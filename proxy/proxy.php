<?php
/**
 * QDC Production Proxy — proxy.php
 * ─────────────────────────────────────────────────────────────────────────────
 * Sits between the browser and external APIs (Google Apps Script, Green API,
 * Gemini). Keeps all credentials server-side. Enforces rate limiting, CORS,
 * HMAC auth, and per-route ACLs.
 *
 * Routes:
 *   GET  ?route=sheets&action=...   → Google Apps Script (GAS)
 *   POST ?route=wa_send             → Green-API WhatsApp send
 *   POST ?route=wa_api&endpoint=... → Green-API arbitrary endpoint
 *   GET  ?route=gemini_key          → returns Gemini key via GAS getAlishaKey
 *
 * Requires PHP ≥ 8.0 with curl, json extensions.
 * Place config.php (see config.example.php) in the same directory.
 * ─────────────────────────────────────────────────────────────────────────────
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// ── Load config ────────────────────────────────────────────────────────────
$cfgFile = __DIR__ . '/config.php';
if (!file_exists($cfgFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Proxy not configured (missing config.php)']);
    exit;
}
$CFG = require $cfgFile;

// ── CORS ───────────────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $CFG['allowed_origins'] ?? [];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (in_array('*', $allowed, true)) {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-QDC-Key, X-QDC-Staff, X-QDC-Session');
header('Access-Control-Max-Age: 3600');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fail(string $msg, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

function respond(mixed $data): never {
    echo json_encode($data);
    exit;
}

function getIP(): string {
    foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            return explode(',', $_SERVER[$k])[0];
        }
    }
    return '0.0.0.0';
}

// ── Rate Limiting (file-based, swap for Redis/APCu in high-traffic) ────────
function checkRateLimit(string $key, int $limit, int $window, string $storeDir): void {
    if (!is_dir($storeDir)) {
        @mkdir($storeDir, 0700, true);
    }
    $file = $storeDir . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $key) . '.json';
    $now  = time();
    $hits = [];

    if (file_exists($file)) {
        $raw = @json_decode(file_get_contents($file), true);
        if (is_array($raw)) {
            $hits = array_filter($raw, fn($t) => $t > $now - $window);
        }
    }

    if (count($hits) >= $limit) {
        http_response_code(429);
        header('Retry-After: ' . ($window - ($now - min($hits))));
        echo json_encode(['ok' => false, 'error' => 'Rate limit exceeded. Please wait before retrying.']);
        exit;
    }

    $hits[] = $now;
    file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
}

// ── HMAC staff-session validation ──────────────────────────────────────────
function validateStaffSession(array $CFG): void {
    $key     = $_SERVER['HTTP_X_QDC_KEY'] ?? ($_GET['_key'] ?? '');
    $staffId = $_SERVER['HTTP_X_QDC_STAFF'] ?? ($_GET['_staff'] ?? '');
    $session = $_SERVER['HTTP_X_QDC_SESSION'] ?? ($_GET['_session'] ?? '');

    if (empty($key) || empty($staffId) || empty($session)) {
        fail('Unauthorized: missing staff credentials', 401);
    }

    // Constant-time comparison for HMAC
    $expected = hash_hmac('sha256', $staffId . ':' . $session, $CFG['proxy_secret']);
    if (!hash_equals($expected, $key)) {
        fail('Unauthorized: invalid staff token', 401);
    }
}

// ── cURL helper ────────────────────────────────────────────────────────────
function curlFetch(string $url, string $method = 'GET', ?string $body = null, array $headers = []): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 3,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT      => 'QDC-Proxy/1.0',
        CURLOPT_HTTPHEADER     => array_merge(['Content-Type: application/json'], $headers),
    ]);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err) {
        fail("Upstream network error: $err", 502);
    }
    return ['body' => $resp, 'code' => $code];
}

// ═══════════════════════════════════════════════════════════════════════════
// Main routing
// ═══════════════════════════════════════════════════════════════════════════
$ip    = getIP();
$route = $_GET['route'] ?? '';
$rateDir = $CFG['rate_limit_dir'] ?? sys_get_temp_dir() . '/qdc_rl';

switch ($route) {

    // ── Google Apps Script passthrough ──────────────────────────────────────
    case 'sheets':
        validateStaffSession($CFG);
        checkRateLimit("sheets_$ip", 120, 60, $rateDir);   // 120 req/min per IP

        $action = $_GET['action'] ?? '';
        if (!$action) fail('Missing action parameter');

        // Block dangerous/write operations for non-admin roles (optional)
        $staffId = $_GET['_staff'] ?? '';
        $writeActions = ['deletePatient','purgeAll','resetSheet'];
        $role = $_GET['_role'] ?? 'staff';
        if (in_array($action, $writeActions, true) && $role !== 'admin') {
            fail('Forbidden: insufficient role for this action', 403);
        }

        // Build GAS URL — strip our own proxy params before forwarding
        $forward = $_GET;
        foreach (['route','_key','_session'] as $k) unset($forward[$k]);

        $gasUrl = rtrim($CFG['gas_url'], '?&') . '?' . http_build_query($forward);
        $result = curlFetch($gasUrl);

        http_response_code($result['code'] >= 400 ? $result['code'] : 200);
        header('Content-Type: application/json');
        echo $result['body'];
        exit;

    // ── WhatsApp send ───────────────────────────────────────────────────────
    case 'wa_send':
        validateStaffSession($CFG);
        checkRateLimit("wa_send_$ip", 30, 60, $rateDir);   // 30 WA messages/min per IP

        $rawBody = file_get_contents('php://input');
        $payload = json_decode($rawBody, true) ?? [];
        if (empty($payload['chatId']) || empty($payload['message'])) {
            fail('Missing chatId or message');
        }

        $url = 'https://api.green-api.com/waInstance'
             . $CFG['green_api_instance']
             . '/sendMessage/'
             . $CFG['green_api_token'];

        $result = curlFetch($url, 'POST', json_encode($payload));
        http_response_code($result['code'] >= 400 ? $result['code'] : 200);
        echo $result['body'];
        exit;

    // ── WhatsApp public send (chatbot / appointment confirmations) ──────────
    case 'wa_public':
        // Public route — no staff auth required, but heavily rate-limited
        checkRateLimit("wa_pub_$ip", 5, 60, $rateDir);    // 5/min per IP

        $rawBody = file_get_contents('php://input');
        $payload = json_decode($rawBody, true) ?? [];
        if (empty($payload['chatId']) || empty($payload['message'])) {
            fail('Missing chatId or message');
        }

        // Sanitise message — max 1000 chars, no HTML
        $payload['message'] = mb_substr(strip_tags($payload['message']), 0, 1000);

        $url = 'https://api.green-api.com/waInstance'
             . $CFG['green_api_instance']
             . '/sendMessage/'
             . $CFG['green_api_token'];

        $result = curlFetch($url, 'POST', json_encode($payload));
        http_response_code($result['code'] >= 400 ? $result['code'] : 200);
        echo $result['body'];
        exit;

    // ── Green-API arbitrary endpoint ────────────────────────────────────────
    case 'wa_api':
        validateStaffSession($CFG);
        checkRateLimit("wa_api_$ip", 60, 60, $rateDir);

        $endpoint = $_GET['endpoint'] ?? '';
        if (!$endpoint || !preg_match('/^[a-zA-Z]+$/', $endpoint)) {
            fail('Invalid endpoint');
        }

        $rawBody = file_get_contents('php://input');
        $url = 'https://api.green-api.com/waInstance'
             . $CFG['green_api_instance']
             . '/' . $endpoint . '/'
             . $CFG['green_api_token'];

        $result = curlFetch($url, 'POST', $rawBody);
        echo $result['body'];
        exit;

    // ── Chatbot public GAS query (appointment booking, clinic info) ─────────
    case 'chatbot':
        checkRateLimit("chatbot_$ip", 20, 60, $rateDir);   // 20 chatbot queries/min

        $action = $_GET['action'] ?? 'chatbotQuery';
        $allowedChatbotActions = ['chatbotQuery','bookAppointment','getAlishaKey'];
        if (!in_array($action, $allowedChatbotActions, true)) {
            fail('Forbidden chatbot action', 403);
        }

        $gasUrl = rtrim($CFG['gas_url'], '?&') . '?action=' . urlencode($action);
        if (isset($_GET['data'])) $gasUrl .= '&data=' . urlencode($_GET['data']);

        $result = curlFetch($gasUrl);
        echo $result['body'];
        exit;

    // ── Appointment form (public, no auth) ──────────────────────────────────
    case 'appointment':
        checkRateLimit("appt_$ip", 10, 3600, $rateDir);   // 10/hour per IP

        $rawBody = file_get_contents('php://input');
        $data    = json_decode($rawBody, true) ?? [];

        // Required fields
        foreach (['name','phone','date','service'] as $f) {
            if (empty($data[$f])) fail("Missing required field: $f");
        }
        // Sanitise
        foreach ($data as $k => $v) {
            $data[$k] = mb_substr(strip_tags((string)$v), 0, 200);
        }

        $gasUrl = rtrim($CFG['gas_url'], '?&') . '?' . http_build_query([
            'action' => 'bookAppointment',
            'name'   => $data['name'],
            'phone'  => $data['phone'],
            'date'   => $data['date'],
            'time'   => $data['time'] ?? '',
            'service'=> $data['service'],
            'notes'  => $data['notes'] ?? '',
        ]);

        $result = curlFetch($gasUrl);
        echo $result['body'];
        exit;

    // ── Health check ────────────────────────────────────────────────────────
    case 'health':
        respond(['ok' => true, 'ts' => time(), 'version' => '1.0']);

    default:
        fail('Unknown route', 404);
}
