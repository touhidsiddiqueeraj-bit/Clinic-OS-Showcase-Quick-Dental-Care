/**
 * QDC Production Configuration — public/js/config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All sensitive values are removed. The frontend talks exclusively to the
 * proxy (proxy.php on the same origin), never to external APIs directly.
 *
 * Set window.__QDC_CONFIG.PROXY_BASE to the URL of proxy.php.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ── Proxy URL: same-origin is preferred (no CORS header needed) ──────────
  // If your proxy lives at /proxy/proxy.php just use '/proxy/proxy.php'.
  const PROXY_BASE = '/proxy/proxy.php';

  // ── Cached staff token (injected by auth.js after login) ─────────────────
  let _staffToken  = '';
  let _staffId     = '';
  let _staffSession= '';

  function _hipaaParams() {
    // Appends staff auth params to any GAS/proxy query string.
    if (!_staffId) return '';
    return '&_key=' + encodeURIComponent(_staffToken)
         + '&_staff=' + encodeURIComponent(_staffId)
         + '&_session=' + encodeURIComponent(_staffSession);
  }

  function setStaffAuth(id, session, token) {
    _staffId     = id;
    _staffSession= session;
    _staffToken  = token;
  }

  // ── Proxy-aware API helpers ───────────────────────────────────────────────
  /**
   * Call a GAS action via the proxy (staff-authenticated).
   * @param {string} action
   * @param {Object} [extra] - additional query params
   */
  function sheetsAction(action, extra = {}) {
    const params = new URLSearchParams({ route: 'sheets', action, ...extra });
    const auth   = _hipaaParams();
    return fetch(`${PROXY_BASE}?${params}${auth}`);
  }

  /**
   * Send a WhatsApp message via the proxy (staff-authenticated).
   * @param {string} chatId  - e.g. "8801XXXXXXXXX@c.us"
   * @param {string} message
   */
  function waSend(chatId, message) {
    return fetch(`${PROXY_BASE}?route=wa_send${_hipaaParams()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });
  }

  /**
   * Send a WhatsApp message as a public/chatbot action (no staff auth).
   */
  function waPublicSend(chatId, message) {
    return fetch(`${PROXY_BASE}?route=wa_public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });
  }

  /**
   * Call an arbitrary Green-API endpoint via the proxy (staff-authenticated).
   */
  function waApi(endpoint, bodyObj = {}) {
    return fetch(`${PROXY_BASE}?route=wa_api&endpoint=${encodeURIComponent(endpoint)}${_hipaaParams()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj),
    });
  }

  /**
   * Book an appointment (public, no staff auth).
   */
  function bookAppointment(data) {
    return fetch(`${PROXY_BASE}?route=appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // ── Compatibility shim: window.__QDC (used by existing app code) ─────────
  // The original local-mode code used window.__QDC directly.
  // In production these point to proxy routes instead of raw API credentials.
  window.__QDC = {
    // Proxy URL that replaces the raw GAS URL in legacy code
    SHEETS_PROXY: PROXY_BASE + '?route=sheets&',
    // Legacy: QDC_PROXY and QDC_KEY now unused (auth via HTTP headers/params)
    QDC_PROXY: PROXY_BASE,
    QDC_KEY: '', // Populated dynamically by setStaffAuth

    // Firebase stubs (backend migrated to GAS/Sheets)
    auth: { currentUser: null },
    db: null,
    storage: null,

    // Stub Firebase methods
    doc: () => {},
    getDoc: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
    setDoc: () => {},
    collection: () => {},
    query: () => {},
    where: () => {},
    getDocs: () => Promise.resolve({ empty: true, docs: [] }),
    addDoc: () => {},
    serverTimestamp: () => {},
    ref: () => {},
    listAll: () => Promise.resolve({ items: [] }),
    getDownloadURL: () => {},
  };

  // ── Public API ────────────────────────────────────────────────────────────
  window.__QDC_CONFIG = {
    PROXY_BASE,
    setStaffAuth,
    sheetsAction,
    waSend,
    waPublicSend,
    waApi,
    bookAppointment,
    _hipaaParams, // used internally by QDC_staff
  };

  // Replace the local-mode direct-API functions with proxy versions
  window._IS_LOCAL = false;

  window._waSend = function (phone, message) {
    let raw = String(phone || '').replace(/\D/g, '');
    if (raw.startsWith('0') && raw.length === 11) raw = '880' + raw.slice(1);
    if (!raw.startsWith('880')) raw = '880' + raw;
    return waPublicSend(raw + '@c.us', message);
  };

  window._waSendChat = function (chatId, message) {
    // Staff-authenticated send if staff session present, otherwise public
    if (_staffId) return waSend(chatId, message);
    return waPublicSend(chatId, message);
  };

  window._waApi = function (endpoint, bodyObj) {
    return waApi(endpoint, bodyObj);
  };

  // ── Green-API URL shim ────────────────────────────────────────────────────
  // Legacy code builds URLs like: `${__QDC.GREEN_API_BASE}/sendMessage/${__QDC.GREEN_API_TOKEN}`
  // We intercept fetch() to redirect those to our proxy instead.
  (function patchGreenAPIShim() {
    const _orig = window.fetch.bind(window);
    window.fetch = function (url, opts) {
      if (typeof url === 'string' && url.includes('api.green-api.com')) {
        const m = url.match(/\/([a-zA-Z]+)\/[^/]*$/);
        const endpoint = m ? m[1] : 'sendMessage';
        if (endpoint === 'sendMessage') {
          const route = _staffId ? 'wa_send' : 'wa_public';
          const authP = _staffId ? _hipaaParams() : '';
          return _orig(PROXY_BASE + '?route=' + route + authP, opts || {
            method:'POST', headers:{'Content-Type':'application/json'}
          });
        }
        const authP = _staffId ? _hipaaParams() : '';
        return _orig(PROXY_BASE + '?route=wa_api&endpoint=' + encodeURIComponent(endpoint) + authP, opts);
      }
      return _orig(url, opts);
    };
    // Sentinel values — proxy holds the real credentials
    window.__QDC.GREEN_API_BASE      = '[proxy-intercepted]';
    window.__QDC.GREEN_API_TOKEN     = '';
    window.__QDC.GREEN_API_INSTANCE  = '';
  })();

})();