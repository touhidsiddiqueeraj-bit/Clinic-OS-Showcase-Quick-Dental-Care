// QDC Staff Message Board
/* ── Staff Message Board ─────────────────────────────────────── */
window.QDC_msgboard = (() => {
  const STORAGE_KEY = 'qdc_staff_messages';
  let open = false;
  let _syncing = false;

  function getMessages() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function saveMessages(msgs) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-100))); } catch {}
  }

  async function syncFromGAS() {
    if (_syncing) return;
    _syncing = true;
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if (!proxy || proxy.includes('YOUR_')) return;
      const hp = (window.QDC_staff && QDC_staff._hipaaParams) ? QDC_staff._hipaaParams() : '';
      const r = await fetch(`${proxy}&action=getRecentNotes&since=0${hp}`);
      const data = await r.json();
      const rows = Array.isArray(data) ? data : (data.rows || []);
      const gasNotes = rows
        .filter(n => (n.Type || n.type || '') === 'board')
        .map(n => ({
          id:     String(n.NoteID || n.noteId || Date.now()),
          text:   String(n.Note   || n.note   || ''),
          author: String(n.StaffID || n.staffId || 'Staff'),
          time:   n.Timestamp
            ? new Date(n.Timestamp).toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})
            : '',
          read:   true,
          fromGAS: true
        }));
      if (gasNotes.length > 0) {
        const local = getMessages().filter(m => !m.fromGAS);
        const all = [...gasNotes, ...local];
        const seen = new Set();
        const merged = all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
        merged.sort((a, b) => String(a.id) < String(b.id) ? -1 : 1);
        saveMessages(merged.slice(-100));
      }
    } catch(e) { /* show local cache on network fail */ }
    finally { _syncing = false; }
  }

  const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

  function render() {
    const list = document.getElementById('msgboard-list');
    if (!list) return;
    const msgs = getMessages();
    if (!msgs.length) {
      list.innerHTML = '<div style="color:var(--text3);font-size:.8rem;text-align:center;padding:20px">No messages yet. Post something for the team.</div>';
      return;
    }
    list.innerHTML = msgs.map((m, i) => `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px 12px;position:relative">
        <div style="font-size:.7rem;color:var(--gold);font-weight:600;margin-bottom:4px">${esc(m.author||'Staff')} \xB7 ${esc(m.time||'')}</div>
        <div style="font-size:.83rem;color:var(--text);line-height:1.5;white-space:pre-wrap">${esc(m.text)}</div>
        ${!m.fromGAS ? `<button onclick="QDC_msgboard.del(${i})" aria-label="Delete message" style="position:absolute;top:6px;right:8px;background:none;border:none;color:var(--text3);cursor:pointer;font-size:.75rem;padding:2px 4px" title="Delete">\u2715</button>` : ''}
      </div>
    `).join('');
    setTimeout(() => { list.scrollTop = list.scrollHeight; }, 20);
    const badge = document.getElementById('staff-msgboard-badge');
    if (badge) {
      const unread = msgs.filter(m => !m.read).length;
      if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; }
      else badge.style.display = 'none';
    }
  }

  function toggle() {
    open = !open;
    const panel = document.getElementById('staff-msgboard-panel');
    if (open) {
      panel.style.display = 'flex';
      setTimeout(() => panel.classList.add('open'), 10);
      const msgs = getMessages();
      msgs.forEach(m => m.read = true);
      saveMessages(msgs);
      render();
      syncFromGAS().then(render);
    } else {
      panel.classList.remove('open');
      setTimeout(() => panel.style.display = 'none', 280);
    }
  }

  async function post() {
    const inp = document.getElementById('msgboard-inp');
    const text = (inp?.value || '').trim();
    if (!text) return;
    const staffName = window.QDC_staff?._staffName || 'Staff';
    const staffId   = window.QDC_staff?._staffId   || 'staff';
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) + ' ' +
                 now.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
    const tempId = 'local-' + Date.now();
    const msgs = getMessages();
    msgs.push({ text, author: staffName, time, read: true, id: tempId, fromGAS: false });
    saveMessages(msgs);
    inp.value = '';
    render();
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      const hp = (window.QDC_staff && QDC_staff._hipaaParams) ? QDC_staff._hipaaParams() : '';
      if (proxy && !proxy.includes('YOUR_')) {
        const p = new URLSearchParams({ action:'addNote', staffId, note:text, type:'board' });
        const r = await fetch(`${proxy}&${p}${hp}`);
        const d = await r.json().catch(()=>({}));
        if (d.ok && d.id) {
          const saved = getMessages();
          const idx = saved.findIndex(m => m.id === tempId);
          if (idx >= 0) { saved[idx].id = d.id; saved[idx].fromGAS = true; saveMessages(saved); render(); }
        }
      }
    } catch(e) { /* message stays local if GAS unreachable */ }
  }

  function del(idx) {
    const msgs = getMessages();
    msgs.splice(idx, 1);
    saveMessages(msgs);
    render();
  }

  function show() {
    const btn = document.getElementById('staff-msgboard-btn');
    if (btn) btn.style.display = 'block';
    render();
    setTimeout(() => syncFromGAS().then(render), 600);
  }
  function hide() {
    const btn = document.getElementById('staff-msgboard-btn');
    if (btn) btn.style.display = 'none';
    const panel = document.getElementById('staff-msgboard-panel');
    if (panel) { panel.classList.remove('open'); panel.style.display = 'none'; }
    open = false;
  }

  function _attachEnterHandler() {
    document.getElementById('msgboard-inp')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); post(); }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _attachEnterHandler);
  } else {
    _attachEnterHandler();
  }

  return { toggle, post, del, show, hide };
})();
