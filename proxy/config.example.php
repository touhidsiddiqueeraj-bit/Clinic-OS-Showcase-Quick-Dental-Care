<?php
/**
 * QDC Proxy Configuration — config.php
 * ─────────────────────────────────────────────────────────────────────────────
 * Copy this file to config.php and fill in your real credentials.
 * NEVER commit config.php to version control.
 * Add config.php to your .gitignore immediately.
 * ─────────────────────────────────────────────────────────────────────────────
 */
return [

    // ── Google Apps Script Web App URL ───────────────────────────────────────
    // Deploy your GAS as a Web App → Execute as: Me, Access: Anyone with link
    // Paste the deployment URL here (the one ending in /exec)
    'gas_url' => 'https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec',

    // ── Green-API WhatsApp Credentials ──────────────────────────────────────
    // https://console.green-api.com → your instance dashboard
    'green_api_instance' => 'YOUR_INSTANCE_ID',        // e.g. 7107545893
    'green_api_token'    => 'YOUR_INSTANCE_TOKEN',     // e.g. 152e1877...

    // ── Proxy HMAC Secret ───────────────────────────────────────────────────
    // A long random secret used to sign staff session tokens.
    // Generate with: openssl rand -hex 32
    'proxy_secret' => 'CHANGE_ME_REPLACE_WITH_64_HEX_CHARS',

    // ── Allowed CORS origins ─────────────────────────────────────────────────
    // List every domain that may call this proxy. Do NOT use '*' in production
    // unless you have no staff auth routes.
    'allowed_origins' => [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
        // 'https://staging.yourdomain.com',
    ],

    // ── Rate-limit state directory ───────────────────────────────────────────
    // Must be writable by the web server user (www-data) and outside webroot.
    // On cPanel: '/home/youraccount/.qdc_rl'
    'rate_limit_dir' => '/tmp/qdc_rate_limits',

];
