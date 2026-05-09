// QDC Staff Extras — tx plans, perio, lab, inbox, photos, reorder

function _patSearch(inputId, resultsId, onSelect){
  const q = (document.getElementById(inputId)?.value||'').trim();
  const res = document.getElementById(resultsId);
  if(!res) return;
  if(q.length < 2){ res.style.display='none'; return; }

  // Store callback in global registry
  if(!window._patSelectCbs) window._patSelectCbs = {};
  window._patSelectCbs[resultsId] = onSelect;

  // Trigger patient load if not done yet
  if(!QDC_staff._patData || QDC_staff._patData.length === 0){
    if(!QDC_staff._patLoaded && !QDC_staff._patLoading){
      QDC_staff._patLoaded = true;
      QDC_staff._loadPatients();
    }
    res.innerHTML='<div style="padding:10px 14px;color:var(--text3);font-size:.86rem">⌛ Loading patients…</div>';
    res.style.display='block';
    setTimeout(()=>_patSearch(inputId, resultsId, onSelect), 1200);
    return;
  }

  const ql = q.toLowerCase();
  const data = QDC_staff._patData.filter(p=>
    (p.name||'').toLowerCase().includes(ql) ||
    (p.id||'').toLowerCase().includes(ql) ||
    (p.phone||'').replace(/\D/g,'').includes(q.replace(/\D/g,'')) ||
    (p.phone||'').includes(q)
  ).slice(0,10);

  if(!data.length){
    res.innerHTML='<div style="padding:10px 14px;color:var(--text3);font-size:.86rem">No patients found for "'+q+'"</div>';
    res.style.display='block';
    return;
  }

  // Use data index + registry — no inline function serialization
  res.innerHTML = data.map((p,i)=>{
    const safe = encodeURIComponent(JSON.stringify(p));
    return `<div onclick="_patSelectCbs['${resultsId}'](JSON.parse(decodeURIComponent('${safe}')))"
      style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s;font-size:.88rem"
      onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
      <span style="color:var(--cream);font-weight:500">${p.name||'—'}</span>
      <span style="color:var(--text3);font-size:.8rem;margin-left:8px">${p.id||''}</span>
      <span style="color:var(--text3);font-size:.8rem;margin-left:6px">${p.phone||''}</span>
    </div>`;
  }).join('');
  res.style.display='block';
}

/* ─── 1. TREATMENT PLANS ─── */
window.QDC_datamgmt = {
  _chart: null,

  _drawPie(xrayFiles, prescFiles, scanFiles, patFolders) {
    const totalFiles = xrayFiles + prescFiles + scanFiles;
    const driveEl = document.getElementById('dm-drive-info');
    if (!driveEl) return;
    driveEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:center">
        <canvas id="dm-pie-canvas" width="220" height="220"></canvas>
        <div>
          <div style="font-size:.76rem;color:var(--text3);margin-bottom:12px;letter-spacing:.06em;text-transform:uppercase">Drive File Breakdown</div>
          <div style="display:flex;flex-direction:column;gap:10px;font-size:.86rem">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="width:12px;height:12px;border-radius:50%;background:#c9973a;flex-shrink:0"></span>
              <span style="color:var(--text2)">X-Rays</span>
              <span style="margin-left:auto;font-weight:600;color:var(--text)">${xrayFiles}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span style="width:12px;height:12px;border-radius:50%;background:#1a6fb5;flex-shrink:0"></span>
              <span style="color:var(--text2)">Prescriptions</span>
              <span style="margin-left:auto;font-weight:600;color:var(--text)">${prescFiles}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span style="width:12px;height:12px;border-radius:50%;background:#27ae60;flex-shrink:0"></span>
              <span style="color:var(--text2)">3D Scans</span>
              <span style="margin-left:auto;font-weight:600;color:var(--text)">${scanFiles}</span>
            </div>
            <div style="border-top:1px solid var(--border);padding-top:10px;margin-top:4px;display:flex;justify-content:space-between">
              <span style="color:var(--text3);font-size:.78rem">Patient Folders</span>
              <span style="font-weight:600;color:var(--text)">${patFolders}</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text3);font-size:.78rem">Total Files</span>
              <span style="font-weight:600;color:var(--gold)">${totalFiles}</span>
            </div>
          </div>
        </div>
      </div>`;
    requestAnimationFrame(() => {
      const canvas = document.getElementById('dm-pie-canvas');
      if (!canvas) return;
      const ctx2d = canvas.getContext('2d');
      const cx = 110, cy = 110, rad = 90;
      const slices = [
        { val: xrayFiles,  color: '#c9973a' },
        { val: prescFiles, color: '#1a6fb5' },
        { val: scanFiles,  color: '#27ae60' },
      ].filter(sl => sl.val > 0);
      if (!slices.length) {
        ctx2d.beginPath(); ctx2d.arc(cx, cy, rad, 0, Math.PI*2);
        ctx2d.fillStyle='rgba(150,150,150,.15)'; ctx2d.fill();
        ctx2d.fillStyle='rgba(100,116,139,1)'; ctx2d.font='12px sans-serif';
        ctx2d.textAlign='center'; ctx2d.fillText('No files yet', cx, cy+5);
        return;
      }
      const tot = slices.reduce((s,x)=>s+x.val,0);
      let angle = -Math.PI/2;
      slices.forEach(sl => {
        const sweep = (sl.val/tot)*Math.PI*2;
        ctx2d.beginPath(); ctx2d.moveTo(cx,cy);
        ctx2d.arc(cx,cy,rad,angle,angle+sweep); ctx2d.closePath();
        ctx2d.fillStyle=sl.color; ctx2d.fill();
        ctx2d.strokeStyle='#ffffff'; ctx2d.lineWidth=2; ctx2d.stroke();
        angle+=sweep;
      });
      ctx2d.beginPath(); ctx2d.arc(cx,cy,46,0,Math.PI*2);
      ctx2d.fillStyle='#ffffff'; ctx2d.fill();
      ctx2d.fillStyle='#1e293b'; ctx2d.font='bold 20px sans-serif';
      ctx2d.textAlign='center'; ctx2d.fillText(tot, cx, cy+5);
      ctx2d.font='10px sans-serif'; ctx2d.fillStyle='#94a3b8';
      ctx2d.fillText('FILES', cx, cy+20);
    });
  },

  async load() {
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    if (!proxy) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? '—'; };
    const driveEl  = document.getElementById('dm-drive-info');
    const sheetsEl = document.getElementById('dm-sheets-table');
    if (driveEl)  driveEl.innerHTML  = '<div style="color:#94a3b8;font-size:.84rem;padding:8px 0">⌛ Loading Drive stats… (may take 30s)</div>';
    if (sheetsEl) sheetsEl.innerHTML = '<div style="color:#94a3b8;font-size:.84rem;padding:8px 0">⌛ Loading…</div>';

    // Phase 1: fast sheet counts via getRxCount+getPatients (no Drive needed)
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 55000); // GAS Drive walk can take 30-50s
      const resp = await fetch(`${proxy}&action=getDataStats${QDC_staff._hipaaParams()}`, { signal: ctrl.signal });
      const d = await resp.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      const s = d.stats || {};

      // KPIs
      set('dm-patients',     s.patients);
      set('dm-appointments', s.appointments);
      set('dm-invoices',     s.invoices);
      set('dm-prescriptions',s.prescriptions);
      set('dm-xrays',        s.xrays);
      set('dm-staff',        s.staff);

      // Drive link
      const driveLink = document.getElementById('dm-drive-link');
      if (driveLink && s.driveRootUrl) driveLink.href = s.driveRootUrl;

      // Sheets table
      if (sheetsEl && s.sheets) {
        const rows = s.sheets.filter(r => r.rows > 0).sort((a,b) => b.rows - a.rows);
        sheetsEl.innerHTML = rows.length ? rows.map(r =>
          `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e2e8f0">
            <span style="color:#475569">${r.name}</span>
            <span style="font-weight:600;color:#1e293b">${r.rows.toLocaleString()}</span>
          </div>`).join('')
          : '<div style="color:#94a3b8;font-size:.84rem">No records yet.</div>';
      }

      // Drive pie
      this._drawPie(s.xrayFiles||0, s.prescFiles||0, s.scanFiles||0, s.patientFolders||0);

    } catch(e) {
      const msg = e.name==='AbortError' ? 'Drive stats timed out — too many patient folders. Try again later.' : e.message;
      if (driveEl) driveEl.innerHTML = `<div style="color:#ef4444;font-size:.84rem;padding:8px 0">⚠ ${msg}</div>`;
      // Still try to get sheet counts separately
      try {
        const [pResp, aResp] = await Promise.all([
          fetch(`${proxy}&action=getPatients${QDC_staff._hipaaParams()}`),
          fetch(`${proxy}&action=getRxCount${QDC_staff._hipaaParams()}`),
        ]);
        const patients = await pResp.json();
        const rxCount  = await aResp.json();
        if (Array.isArray(patients)) set('dm-patients', patients.length);
        if (rxCount.ok) set('dm-prescriptions', rxCount.count);
      } catch(_) {}
    }
  }
};

window.QDC_txplan = {
  _patient: null,
  _plans: [],
  _visitCount: 0,

  // Safe Visits parser — returns [] on malformed JSON instead of throwing
  _parseVisits(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw !== 'string') return [];
    try { return JSON.parse(raw || '[]') || []; }
    catch(e) { console.warn('[txplan] malformed Visits JSON:', e); return []; }
  },

  load(){
    if(this._patient) this._loadForPatient(this._patient);
  },

  searchPatient(){ _patSearch('txp-pat-search','txp-pat-results', p => QDC_txplan.selectPatient(p)); },

  selectPatient(p){
    this._patient = p;
    document.getElementById('txp-pat-results').style.display='none';
    document.getElementById('txp-pat-search').value = p.name||'';
    document.getElementById('txp-selected-pat').innerHTML =
      `<div style="background:rgba(201,151,58,.07);border:1px solid var(--border2);padding:8px 14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:.86rem">
        <span style="color:var(--gold)">✓</span>
        <span style="color:var(--cream);font-weight:600">${p.name||'—'}</span>
        <span style="color:var(--text3)">${p.id||''}</span>
        <span style="color:var(--text3)">${p.phone||''}</span>
      </div>`;
    this._loadForPatient(p);
  },

  async _loadForPatient(p){
    const wrap = document.getElementById('txp-plans-wrap');
    if(!wrap) return;
    wrap.innerHTML='<div style="padding:20px;color:var(--text3);font-size:.86rem">⌛ Loading plans…</div>';
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy){ wrap.innerHTML='<div class="empty-state"><span>⚙️</span><p>No server configured.</p></div>'; return; }
    try {
      const r = await fetch(`${proxy}&action=getTxPlans&patientId=${encodeURIComponent(p.id||p.ID||'')}${QDC_staff._hipaaParams()}`);
      const raw = await r.text();
      let d;
      try { d = JSON.parse(raw); } catch(pe){ throw new Error('Server parse error: '+raw.slice(0,80)); }
      // GAS may return {ok:false, error:...} if action not found (old GAS deployed)
      if(d && d.ok === false) throw new Error(d.error || 'Unknown GAS error — redeploy GAS v5');
      this._plans = Array.isArray(d) ? d : [];
      this._renderPlans();
    } catch(e){ wrap.innerHTML=`<div class="empty-state"><span>⚠</span><p>${e.message}</p></div>`; }
  },

  _renderPlans(){
    const wrap = document.getElementById('txp-plans-wrap');
    if(!wrap) return;
    if(!this._plans.length){
      wrap.innerHTML=`<div class="empty-state"><span>📋</span><p>No treatment plans yet for this patient.</p>
        <button class="s-btn-sm" onclick="QDC_txplan.openNew()" style="margin-top:12px">+ Create First Plan</button></div>`;
      return;
    }
    const statusColor = {Active:'var(--open)',Completed:'var(--blue3)',Cancelled:'var(--crimson)',Paused:'var(--gold)'};
    wrap.innerHTML = this._plans.map((plan,i)=>{
      const visits = this._parseVisits(plan.Visits);
      const done = visits.filter(v=>v.status==='Done').length;
      const total = visits.reduce((s,v)=>s+Number(v.cost||0), 0);
      const sc = statusColor[plan.Status||'Active']||'var(--text3)';
      return `<div style="border:1px solid var(--border);background:var(--bg2);margin-bottom:12px;overflow:hidden">
        <div style="padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;border-bottom:1px solid var(--border);background:var(--surface)">
          <div>
            <div style="font-weight:600;color:var(--cream);font-size:.96rem">${plan.Title||'Treatment Plan'}</div>
            <div style="font-size:.74rem;color:var(--text3);margin-top:2px">${plan.StartDate||''} ${plan.EndDate?'→ '+plan.EndDate:''}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="color:${sc};font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:1px solid ${sc};padding:3px 10px">${plan.Status||'Active'}</span>
            <span style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--gold)">৳${total.toLocaleString()}</span>
            <button class="s-btn-sm" style="font-size:.72rem;padding:4px 10px" onclick="QDC_txplan.openEdit(${i})">Edit</button>
            <button class="s-btn-sm" style="font-size:.72rem;padding:4px 10px" onclick="QDC_txplan.printPlan(${i})">🖨 Print</button>
            <button class="s-btn-sm" style="font-size:.72rem;padding:4px 10px;border-color:var(--open);color:var(--open)" onclick="QDC_txplan.sendToPatient(${i})">📲 Send</button>
          </div>
        </div>
        <div style="padding:14px 18px">
          ${visits.length ? `<div style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">${done}/${visits.length} visits completed</div>
          <div style="height:4px;background:var(--surface);border-radius:2px;margin-bottom:12px"><div style="height:100%;background:var(--open);border-radius:2px;width:${visits.length?Math.round((done/visits.length)*100):0}%;transition:width .4s"></div></div>
          ${visits.map((v,vi)=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">
            <div onclick="QDC_txplan.toggleVisit(${i},${vi})" style="width:18px;height:18px;border:1.5px solid ${v.status==='Done'?'var(--open)':'var(--border2)'};border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${v.status==='Done'?'rgba(34,197,94,.15)':'transparent'}">
              ${v.status==='Done'?'<span style="color:var(--open);font-size:.8rem">✓</span>':''}
            </div>
            <span style="font-size:.86rem;color:var(--cream);flex:1;min-width:0">${v.treatment||'Visit '+(vi+1)}</span>
            <span style="font-size:.78rem;color:var(--text3)">${v.date||'TBD'}</span>
            <span style="font-size:.82rem;color:var(--gold)">৳${Number(v.cost||0).toLocaleString()}</span>
          </div>`).join('')}` : '<div style="color:var(--text3);font-size:.86rem">No visits added yet.</div>'}
          ${plan.Notes?`<div style="margin-top:10px;font-size:.82rem;color:var(--text2);font-style:italic">${plan.Notes}</div>`:''}
        </div>
      </div>`;
    }).join('');
  },

  openNew(){
    if(!this._patient){ alert('Search and select a patient first.'); return; }
    this._visitCount=0;
    document.getElementById('txp-modal-title').textContent='New Treatment Plan';
    document.getElementById('txp-plan-patient').textContent=`Patient: ${this._patient.name||''} (${this._patient.id||''})`;
    document.getElementById('txp-patient-id').value=this._patient.id||'';
    document.getElementById('txp-title').value='';
    document.getElementById('txp-start').value=new Date().toISOString().slice(0,10);
    document.getElementById('txp-end').value='';
    document.getElementById('txp-notes').value='';
    document.getElementById('txp-edit-id').value='';
    document.getElementById('txp-visits-list').innerHTML='';
    document.getElementById('txp-total').textContent='0 BDT';
    document.getElementById('txp-modal-msg').textContent='';
    document.getElementById('txp-save-txt').textContent='Save Treatment Plan';
    this.addVisitRow();
    document.getElementById('txPlanOverlay').classList.add('show');
  },

  openEdit(i){
    const plan=this._plans[i];
    if(!plan) return;
    this._visitCount=0;
    document.getElementById('txp-modal-title').textContent='Edit Treatment Plan';
    document.getElementById('txp-plan-patient').textContent=`Patient: ${this._patient?.name||''} (${this._patient?.id||''})`;
    document.getElementById('txp-patient-id').value=this._patient?.id||'';
    document.getElementById('txp-title').value=plan.Title||'';
    document.getElementById('txp-start').value=plan.StartDate||'';
    document.getElementById('txp-end').value=plan.EndDate||'';
    document.getElementById('txp-notes').value=plan.Notes||'';
    document.getElementById('txp-edit-id').value=plan.PlanID||i;
    document.getElementById('txp-modal-msg').textContent='';
    const vl=document.getElementById('txp-visits-list'); vl.innerHTML='';
    const visits=this._parseVisits(plan.Visits);
    visits.forEach(v=>this.addVisitRow(v));
    this._updateTotal();
    document.getElementById('txPlanOverlay').classList.add('show');
  },

  addVisitRow(v=null){
    this._visitCount++;
    const idx=this._visitCount;
    const li=document.createElement('div');
    li.id=`txv-${idx}`;
    li.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end;background:var(--surface);padding:10px 12px;border:1px solid var(--border)';
    li.innerHTML=`
      <div><label class="s-lbl">Treatment</label><input class="qdc-input" id="txv-tx-${idx}" value="${v?.treatment||''}" placeholder="e.g. RCT #17" style="margin-top:4px;font-size:.84rem" oninput="QDC_txplan._updateTotal()"></div>
      <div><label class="s-lbl">Date</label><input class="qdc-input" id="txv-date-${idx}" type="date" value="${v?.date||''}" style="margin-top:4px;font-size:.84rem"></div>
      <div><label class="s-lbl">Cost (BDT)</label><input class="qdc-input" id="txv-cost-${idx}" type="number" value="${v?.cost||0}" placeholder="0" style="margin-top:4px;font-size:.84rem" oninput="QDC_txplan._updateTotal()"></div>
      <button onclick="document.getElementById('txv-${idx}').remove();QDC_txplan._updateTotal()" style="background:none;border:1px solid var(--border);color:var(--crimson);cursor:pointer;padding:8px 12px;align-self:end;font-size:.9rem">✕</button>`;
    document.getElementById('txp-visits-list').appendChild(li);
    this._updateTotal();
  },

  _updateTotal(){
    let t=0;
    document.querySelectorAll('[id^="txv-cost-"]').forEach(el=>{ t+=Number(el.value||0); });
    const tot=document.getElementById('txp-total');
    if(tot) tot.textContent='৳'+t.toLocaleString();
  },

  printPlan(i){
    const plan = this._plans[i];
    if(!plan) return;
    const pat = this._patient || {};
    const visits = this._parseVisits(plan.Visits);
    const total = visits.reduce((s,v)=>s+Number(v.cost||0),0);
    const done  = visits.filter(v=>v.status==='Done').length;
    const rows  = visits.map(v=>`<tr style="border-bottom:1px solid #eee">
      <td style="padding:8px 10px">${v.treatment||'—'}</td>
      <td style="padding:8px 10px;text-align:center">${v.date||'TBD'}</td>
      <td style="padding:8px 10px;text-align:center">${v.status||'Pending'}</td>
      <td style="padding:8px 10px;text-align:right">৳${Number(v.cost||0).toLocaleString()}</td>
    </tr>`).join('');
    const w = window.open('','_blank','width=820,height=700');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Treatment Plan — ${pat.name||''}</title>
      <style>
        body{font-family:Georgia,serif;color:#222;margin:0;padding:32px 40px}
        h1{font-size:1.6rem;margin:0 0 4px}
        .sub{font-size:.85rem;color:#666;margin-bottom:24px}
        table{width:100%;border-collapse:collapse;font-size:.92rem}
        thead tr{background:#f5f5f5}
        th{padding:9px 10px;text-align:left;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:#555}
        .total-row td{font-weight:700;border-top:2px solid #222;padding:10px}
        .footer{margin-top:32px;font-size:.78rem;color:#888;border-top:1px solid #ddd;padding-top:16px}
        @media print{button{display:none}}
      </style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <h1>${plan.Title||'Treatment Plan'}</h1>
          <div class="sub">Patient: <strong>${pat.name||'—'}</strong> &nbsp;·&nbsp; ID: ${pat.id||'—'} &nbsp;·&nbsp; Phone: ${pat.phone||'—'}</div>
        </div>
        <div style="text-align:right;font-size:.82rem;color:#666">
          Quick Dental Care<br>Akhalia, Sylhet<br>+88 01307978439
        </div>
      </div>
      <div style="font-size:.82rem;color:#555;margin-bottom:16px">
        Start: ${plan.StartDate||'—'} &nbsp;·&nbsp; End: ${plan.EndDate||'—'} &nbsp;·&nbsp; Status: ${plan.Status||'Active'} &nbsp;·&nbsp; Progress: ${done}/${visits.length} visits completed
      </div>
      <table>
        <thead><tr><th>Treatment</th><th style="text-align:center">Date</th><th style="text-align:center">Status</th><th style="text-align:right">Cost</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="total-row"><td colspan="3">Total</td><td style="text-align:right">৳${total.toLocaleString()}</td></tr></tfoot>
      </table>
      ${plan.Notes?`<div style="margin-top:16px;font-size:.84rem;color:#555;font-style:italic">Notes: ${plan.Notes}</div>`:''}
      <div class="footer">Generated by Quick Dental Care Management System &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-BD',{day:'2-digit',month:'short',year:'numeric'})}</div>
      <br><button onclick="window.print()" style="padding:8px 20px;background:#c0392b;color:#fff;border:none;cursor:pointer;font-size:.9rem;border-radius:2px">🖨 Print</button>
    </body></html>`);
    w.document.close();
  },

  sendToPatient(i){ return this._sendToPatientAsync(i); },

  async save(){
    const btn=document.getElementById('txp-save-txt'), msg=document.getElementById('txp-modal-msg');
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const title=document.getElementById('txp-title')?.value.trim();
    const patId=document.getElementById('txp-patient-id')?.value||'';
    if(!title){ if(msg){msg.textContent='⚠ Plan title is required.';msg.className='qdc-msg err';} return; }
    if(!patId){ if(msg){msg.textContent='⚠ No patient selected. Search and select a patient first.';msg.className='qdc-msg err';} return; }
    const visits=[];
    document.querySelectorAll('[id^="txv-tx-"]').forEach(el=>{
      const idx=el.id.replace('txv-tx-','');
      visits.push({
        treatment:el.value.trim(),
        date:document.getElementById('txv-date-'+idx)?.value||'',
        cost:Number(document.getElementById('txv-cost-'+idx)?.value)||0,
        status:'Pending'
      });
    });
    if(btn) btn.textContent='Saving…';
    try {
      const editId=document.getElementById('txp-edit-id')?.value||'';
      const params = new URLSearchParams({
        action:'saveTxPlan',
        patientId:patId,
        planId:editId,
        title,
        startDate:document.getElementById('txp-start')?.value||'',
        endDate:document.getElementById('txp-end')?.value||'',
        notes:document.getElementById('txp-notes')?.value||'',
        visits:JSON.stringify(visits)
      });
      const r=await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'GAS returned error — ensure GAS v5 is deployed');
      document.getElementById('txPlanOverlay').classList.remove('show');
      if(this._patient) this._loadForPatient(this._patient);
      const m=document.getElementById('txp-msg'); if(m){m.textContent='✅ Plan saved.';m.className='qdc-msg ok';setTimeout(()=>m.textContent='',3000);}
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
    if(btn) btn.textContent='Save Treatment Plan';
  },

  async toggleVisit(planIdx, visitIdx){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const plan=this._plans[planIdx]; if(!plan) return;
    const visits=[...this._parseVisits(plan.Visits)];
    const v=visits[visitIdx]; if(!v) return;
    v.status=v.status==='Done'?'Pending':'Done';
    try {
      await fetch(`${proxy}&action=saveTxPlan&patientId=${encodeURIComponent(plan.PatientID||'')}&planId=${encodeURIComponent(plan.PlanID||'')}&visits=${encodeURIComponent(JSON.stringify(visits))}&title=${encodeURIComponent(plan.Title||'')}${QDC_staff._hipaaParams()}`);
      this._plans[planIdx].Visits=visits;
      this._renderPlans();
    } catch(e){}
  },

  printPlan(i){
    const plan=this._plans[i]; if(!plan) return;
    const pat=this._patient||{};
    const visits=this._parseVisits(plan.Visits);
    const total=visits.reduce((s,v)=>s+Number(v.cost||0),0);
    const done=visits.filter(v=>v.status==='Done').length;
    const rows=visits.map((v,n)=>`<tr>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb">${n+1}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb">${v.treatment||'—'}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center">${v.date||'TBD'}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right">৳${Number(v.cost||0).toLocaleString()}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;color:${v.status==='Done'?'#16a34a':'#6b7280'}">${v.status==='Done'?'✓ Done':'Pending'}</td>
    </tr>`).join('');
    const w=window.open('','_blank','width=800,height=700');
    if(!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Treatment Plan</title>
    <style>body{font-family:sans-serif;padding:40px;color:#111;max-width:740px;margin:0 auto}
    h1{font-size:1.4rem;margin-bottom:4px}h2{font-size:1rem;color:#555;font-weight:400;margin-top:0}
    table{width:100%;border-collapse:collapse;font-size:.9rem}
    th{background:#f3f4f6;padding:8px 10px;text-align:left;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em}
    .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:.78rem;color:#888}
    .total-row{text-align:right;font-weight:700;font-size:1rem;margin-top:12px}
    @media print{body{padding:20px}}</style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;border-bottom:2px solid #111;padding-bottom:16px">
      <div><h1>${plan.Title||'Treatment Plan'}</h1><h2>Patient: ${pat.name||''} &nbsp;|&nbsp; ID: ${pat.id||''}</h2></div>
      <div style="text-align:right;font-size:.82rem;color:#555"><strong>Quick Dental Care</strong><br>Akhalia, Sylhet<br>+88 01307978439</div>
    </div>
    <table><thead><tr>
      <th>#</th><th>Treatment</th><th style="text-align:center">Date</th>
      <th style="text-align:right">Cost (BDT)</th><th style="text-align:center">Status</th>
    </tr></thead><tbody>${rows}</tbody></table>
    <div class="total-row">Total: ৳${total.toLocaleString()} &nbsp;·&nbsp; ${done}/${visits.length} completed</div>
    ${plan.Notes?`<p style="font-size:.84rem;color:#555;font-style:italic;margin-top:14px">Notes: ${plan.Notes}</p>`:''}
    <div class="footer">Start: ${plan.StartDate||'—'} &nbsp;·&nbsp; End: ${plan.EndDate||'—'} &nbsp;·&nbsp; Status: ${plan.Status||'Active'}<br>Printed: ${new Date().toLocaleDateString('en-BD',{dateStyle:'long'})}</div>
    <script>setTimeout(()=>window.print(),400);<\/script></body></html>`);
    w.document.close();
  },

  async _sendToPatientAsync(i){
    const plan=this._plans[i]; if(!plan) return;
    const pat=this._patient||{};
    const phone=pat.phone||'';
    if(!phone||phone==='—'){ alert('No phone number on file for this patient.'); return; }
    const visits=this._parseVisits(plan.Visits);
    const total=visits.reduce((s,v)=>s+Number(v.cost||0),0);
    const done=visits.filter(v=>v.status==='Done').length;
    const lines=visits.map((v,n)=>`${n+1}. ${v.treatment||'Visit '+(n+1)}${v.date?' ('+v.date+')':''} — ৳${Number(v.cost||0).toLocaleString()} ${v.status==='Done'?'✓':''}`).join('\n');
    const waMsg=`🦷 *Treatment Plan — Quick Dental Care*\n\nDear ${pat.name||'Patient'},\n\n📋 *${plan.Title||'Treatment Plan'}*\n${plan.StartDate?'Start: '+plan.StartDate+'\n':''}\n${lines}\n\n💰 *Total: ৳${total.toLocaleString()}* (${done}/${visits.length} completed)${plan.Notes?'\n\n📝 '+plan.Notes:''}\n\n📍 Quick Dental Care, Akhalia, Sylhet\n☎ +88 01307978439`;
    const q=window.__QDC||{};
    const m=document.getElementById('txp-msg');
    if(m){m.textContent='Sending…';m.className='qdc-msg';}
    try {
      let raw=String(phone).replace(/\D/g,'');
      if(raw.startsWith('0')) raw='880'+raw.slice(1);
      else if(!raw.startsWith('880')) raw='880'+raw;
      const _txpChat2 = raw+'@c.us';
      const r=await fetch((window.__QDC||{}).GREEN_API_BASE+'/sendMessage/'+(window.__QDC||{}).GREEN_API_TOKEN,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chatId:raw+'@c.us',message:waMsg})
      });
      const d=await r.json();
      if(d.idMessage||d.ok!==false){
        if(m){m.textContent=`✅ Plan sent to ${pat.name} via WhatsApp.`;m.className='qdc-msg ok';setTimeout(()=>m.textContent='',4000);}
      } else throw new Error(JSON.stringify(d));
    } catch(e){
      if(m){m.textContent='⚠ Send failed: '+e.message;m.className='qdc-msg err';}
    }
  }
};

/* ─── 2. PERIODONTAL CHARTING ─── */
window.QDC_perio = {
  _patient: null,
  _data: {},  // { toothNum: { buccal:[3,3,3], lingual:[3,3,3], bleed:[false,false,false], mob:0, rec:0, furc:0 } }
  _upper: [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],
  _lower: [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38],

  load(){
    document.getElementById('perio-date').value = new Date().toISOString().slice(0,10);
    this._renderChart();
  },

  searchPatient(){ _patSearch('perio-pat-search','perio-pat-results', p=>QDC_perio.selectPatient(p)); },

  selectPatient(p){
    this._patient=p;
    document.getElementById('perio-pat-results').style.display='none';
    document.getElementById('perio-pat-search').value=p.name||'';
    document.getElementById('perio-selected-pat').innerHTML=
      `<div style="background:rgba(201,151,58,.07);border:1px solid var(--border2);padding:7px 14px;font-size:.86rem;color:var(--cream)">${p.name} · ${p.id}</div>`;
  },

  _renderChart(){
    const el=document.getElementById('perio-chart');
    if(!el) return;
    const mkRow=(teeth,label)=>{
      const cells=teeth.map(t=>{
        const d=this._data[t]||{buccal:[0,0,0],lingual:[0,0,0],bleed:[false,false,false],mob:0,furc:0};
        const depthColor=n=>n>=6?'#e74c3c':n>=4?'#f39c12':'#2ecc71';
        const depths=d.buccal.map((v,i)=>`<input type="number" min="0" max="12" value="${v||''}" 
          style="width:28px;border:none;border-bottom:2px solid ${depthColor(v||0)};background:transparent;text-align:center;font-size:.75rem;color:var(--text);outline:none;padding:2px 0"
          oninput="QDC_perio._set(${t},'buccal',${i},this.value)">`).join('');
        return `<td style="text-align:center;padding:6px 4px;border:1px solid var(--border);min-width:72px">
          <div style="font-size:.65rem;color:var(--text3);margin-bottom:4px;font-weight:600">${t}</div>
          <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px">${depths}</div>
          <div style="display:flex;gap:2px;justify-content:center;margin-bottom:3px">
            ${d.bleed.map((b,i)=>`<div onclick="QDC_perio._toggleBleed(${t},${i})" 
              style="width:10px;height:10px;border-radius:50%;background:${b?'#e74c3c':'var(--border)'};cursor:pointer;transition:background .2s"></div>`).join('')}
          </div>
          <select style="width:64px;font-size:.64rem;background:transparent;border:1px solid var(--border);color:var(--text2);padding:1px" 
            onchange="QDC_perio._set(${t},'mob',0,this.value)">
            <option value="0" ${d.mob==0?'selected':''}>Mob 0</option>
            <option value="1" ${d.mob==1?'selected':''}>Mob 1</option>
            <option value="2" ${d.mob==2?'selected':''}>Mob 2</option>
            <option value="3" ${d.mob==3?'selected':''}>Mob 3</option>
          </select>
        </td>`;
      }).join('');
      return `<tr><td style="font-size:.65rem;color:var(--text3);padding:4px 8px;white-space:nowrap;font-weight:600">${label}</td>${cells}</tr>`;
    };
    el.innerHTML=`<table style="border-collapse:collapse;width:100%;font-size:.78rem">
      <tbody>
        <tr><td style="font-size:.7rem;color:var(--text3);padding:4px 8px;font-weight:600">UPPER</td>
          ${this._upper.map(t=>`<td style="text-align:center;padding:4px;font-size:.7rem;color:var(--text3);font-weight:700;border:1px solid var(--border)">${t}</td>`).join('')}</tr>
        ${mkRow(this._upper,'Buccal')}
        <tr style="border-top:2px solid var(--border2)"><td></td>
          ${this._upper.map(t=>`<td style="text-align:center;padding:2px;font-size:.6rem;color:var(--text3);font-style:italic;border:1px solid var(--border)">palatal</td>`).join('')}</tr>
        ${mkRow(this._lower.slice().reverse(),'Lingual')}
        <tr><td style="font-size:.7rem;color:var(--text3);padding:4px 8px;font-weight:600">LOWER</td>
          ${this._lower.map(t=>`<td style="text-align:center;padding:4px;font-size:.7rem;color:var(--text3);font-weight:700;border:1px solid var(--border)">${t}</td>`).join('')}</tr>
        ${mkRow(this._lower,'Buccal')}
      </tbody>
    </table>`;
  },

  _set(tooth,field,idx,val){
    if(!this._data[tooth]) this._data[tooth]={buccal:[0,0,0],lingual:[0,0,0],bleed:[false,false,false],mob:0,furc:0};
    if(field==='mob'||field==='furc') this._data[tooth][field]=Number(val);
    else this._data[tooth][field][idx]=Number(val)||0;
  },

  _toggleBleed(tooth,idx){
    if(!this._data[tooth]) this._data[tooth]={buccal:[0,0,0],lingual:[0,0,0],bleed:[false,false,false],mob:0,furc:0};
    this._data[tooth].bleed[idx]=!this._data[tooth].bleed[idx];
    this._renderChart();
  },

  clearChart(){ this._data={}; this._renderChart(); },

  printChart(){
    const patEl  = document.getElementById('perio-selected-pat');
    const patTxt = patEl?.textContent?.trim() || 'Patient unknown';
    const date   = document.getElementById('perio-date')?.value || '';
    const exam   = document.getElementById('perio-examiner')?.value || '';
    const chart  = document.getElementById('perio-chart');
    if(!chart){ alert('No chart to print.'); return; }
    const chartHtml = chart.outerHTML;
    const win = window.open('','_blank','width=1100,height=800');
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Periodontal Chart — ${patTxt}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:20px;background:#fff}
        h2{font-size:16px;margin-bottom:4px}
        .meta{font-size:11px;color:#555;margin-bottom:16px}
        .perio-tooth{display:inline-block;text-align:center;padding:4px;border:1px solid #ccc;margin:1px;min-width:60px;vertical-align:top}
        .perio-row{display:flex;align-items:center;gap:2px;margin:2px 0;overflow-x:auto}
        .perio-depth{display:inline-block;min-width:18px;text-align:center;padding:2px 3px;border-radius:2px;font-weight:bold;font-size:10px}
        .dep-ok{background:#c8f7c5;color:#196f3d}.dep-warn{background:#fdebd0;color:#784212}.dep-bad{background:#fadbd8;color:#7b241c}
        .bleed-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin:1px}
        .bleed-on{background:#e74c3c}.bleed-off{background:#ddd}
        .mob-val{font-size:9px;color:#555;display:block;margin-top:2px}
        .section-label{font-weight:bold;font-size:11px;color:#333;margin:10px 0 4px;padding:4px 8px;background:#f0f0f0}
        .legend{display:flex;gap:16px;margin-top:12px;font-size:10px;color:#555}
        .legend span{margin-right:4px}
        select{display:none}
        @media print{body{padding:8px} button{display:none}}
      </style>
    </head><body>
      <h2>🦷 Periodontal Chart</h2>
      <div class="meta">Patient: <strong>${patTxt}</strong> &nbsp;|&nbsp; Date: <strong>${date}</strong> &nbsp;|&nbsp; Examiner: <strong>${exam||'—'}</strong></div>
      ${chartHtml}
      <div class="legend">
        <div><span style="color:#e74c3c">■</span> Bleeding on probe</div>
        <div><span style="color:#e67e22">■</span> Suppuration</div>
        <div><span style="color:#f39c12">■</span> Furcation</div>
        <div>Depth: green=1–3mm &nbsp; amber=4–5mm &nbsp; red=6+mm</div>
      </div>
      <div style="margin-top:16px;font-size:10px;color:#999">Printed from Quick Dental Care — ${new Date().toLocaleString('en-BD')}</div>
      <script>window.onload=function(){ window.print(); }<\/script>
    </body></html>`);
    win.document.close();
  },

  async saveChart(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('perio-msg');
    if(!this._patient){ if(msg){msg.textContent='⚠ Select a patient first using the search above.';msg.className='qdc-msg err';} return; }
    if(msg){msg.textContent='⌛ Saving…';msg.className='qdc-msg';}
    try {
      const pid = this._patient.id||this._patient.PatientID||'';
      const params = new URLSearchParams({
        action:'savePerioChart',
        patientId:pid,
        date:document.getElementById('perio-date')?.value||'',
        examiner:document.getElementById('perio-examiner')?.value||'',
        data:JSON.stringify(this._data)
      });
      const r=await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'GAS returned error — ensure GAS v5 is deployed');
      if(msg){msg.textContent='✅ Perio chart saved successfully.';msg.className='qdc-msg ok';setTimeout(()=>msg.textContent='',3000);}
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  }
};

/* ─── 3. LAB WORK TRACKER ─── */
window.QDC_lab = {
  _cases: [],
  _filtered: [],

  async load(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const tbody=document.getElementById('lab-tbody');
    if(tbody) tbody.innerHTML='<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--text3)">⌛ Loading…</td></tr>';
    try {
      const r=await fetch(`${proxy}&action=getLabCases${QDC_staff._hipaaParams()}`);
      const raw=await r.text();
      let d; try{ d=JSON.parse(raw); }catch(pe){ throw new Error('Parse error: '+raw.slice(0,80)); }
      if(d && d.ok===false) throw new Error(d.error||'GAS error — redeploy GAS v5');
      this._cases=Array.isArray(d)?d:[];
      this._filtered=[...this._cases];
      this._renderStats();
      this._renderTable();
    } catch(e){ if(tbody) tbody.innerHTML=`<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--crimson)">⚠ ${e.message}</td></tr>`; }
  },

  _renderStats(){
    const el=document.getElementById('lab-stats'); if(!el) return;
    const total=this._cases.length;
    const pending=this._cases.filter(c=>['Dispatched','At Lab'].includes(c.Status)).length;
    const overdue=this._cases.filter(c=>{ const due=c.DueDate||c.dueDate||''; return due && new Date(due)<new Date() && !['Received','Delivered'].includes(c.Status); }).length;
    const today=new Date().toISOString().slice(0,10);
    const dueToday=this._cases.filter(c=>(c.DueDate||c.dueDate||'').slice(0,10)===today && !['Received','Delivered'].includes(c.Status)).length;
    el.innerHTML=[
      ['Total Cases',total,'var(--text2)'],
      ['Pending',pending,'var(--gold)'],
      ['Due Today',dueToday,'var(--blue3)'],
      ['Overdue',overdue,'var(--crimson)'],
    ].map(([l,v,c])=>`<div style="background:var(--surface);border:1px solid var(--border);padding:14px 16px;text-align:center">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:600;color:${c};line-height:1">${v}</div>
      <div style="font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-top:4px">${l}</div>
    </div>`).join('');
  },

  _renderTable(){
    const tbody=document.getElementById('lab-tbody'); if(!tbody) return;
    const today=new Date();
    const statusColor={Dispatched:'var(--gold)',AtLab:'var(--blue3)','At Lab':'var(--blue3)',Received:'var(--open)',Delivered:'var(--text3)',Issue:'var(--crimson)'};
    if(!this._filtered.length){ tbody.innerHTML='<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--text3)">No lab cases found.</td></tr>'; return; }
    tbody.innerHTML=this._filtered.map((c,i)=>{
      const due=new Date(c.DueDate||c.dueDate||'');
      const overdue=c.DueDate && due<today && !['Received','Delivered'].includes(c.Status);
      const sc=statusColor[c.Status||'']||'var(--text3)';
      return `<tr style="border-bottom:1px solid var(--border);${overdue?'background:rgba(231,76,60,.04)':''}">
        <td style="padding:10px 14px;color:var(--cream);font-size:.88rem">${c.PatientName||c.patientName||'—'}</td>
        <td style="padding:10px 14px;color:var(--text2);font-size:.84rem">${c.WorkType||c.workType||'—'}</td>
        <td style="padding:10px 14px;color:var(--text2);font-size:.84rem">${c.LabName||c.labName||'—'}</td>
        <td style="padding:10px 14px;color:var(--text2);font-size:.82rem">${(c.DispatchDate||c.dispatchDate||'—').slice(0,10)}</td>
        <td style="padding:10px 14px;color:${overdue?'var(--crimson)':'var(--text2)'};font-size:.82rem;font-weight:${overdue?700:400}">
          ${(c.DueDate||c.dueDate||'—').slice(0,10)}${overdue?' ⚠':''}
        </td>
        <td style="padding:10px 14px"><span style="font-size:.7rem;padding:3px 10px;border:1px solid ${sc};color:${sc};font-weight:600;letter-spacing:.06em">${c.Status||'—'}</span></td>
        <td style="padding:10px 14px">
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <select onchange="QDC_lab.updateStatus('${(c.CaseID||c.caseId||'').replace(/'/g,'')}',(this.value),this)" style="font-size:.74rem;background:var(--surface);border:1px solid var(--border);color:var(--text2);padding:4px 8px;cursor:pointer">
              ${['Dispatched','At Lab','Received','Delivered','Issue'].map(s=>`<option value="${s}"${(c.Status||'')==s?' selected':''}>${s}</option>`).join('')}
            </select>
            <span class="lab-status-tick-${(c.CaseID||c.caseId||'').replace(/[^a-z0-9]/gi,'')}" style="font-size:.8rem;color:var(--open);display:none">✓</span>
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  applyFilter(){
    const status=document.getElementById('lab-filter-status')?.value||'';
    const search=(document.getElementById('lab-filter-search')?.value||'').toLowerCase();
    this._filtered=this._cases.filter(c=>{
      const matchS=!status||c.Status===status;
      const matchQ=!search||(c.PatientName||'').toLowerCase().includes(search)||(c.LabName||'').toLowerCase().includes(search);
      return matchS&&matchQ;
    });
    this._renderTable();
  },

  _patLookup(){
    _patSearch('lab-pat-name', 'lab-pat-results', function(p){
      const inp = document.getElementById('lab-pat-name');
      const res = document.getElementById('lab-pat-results');
      if(inp){ inp.value = (p.name||'') + (p.id ? ' · '+p.id : ''); inp.dataset.patientId = p.id||''; }
      if(res) res.style.display='none';
    });
  },

  openNew(){
    document.getElementById('lab-modal-title').textContent='New Lab Case';
    const inp = document.getElementById('lab-pat-name');
    if(inp){ inp.value=''; inp.dataset.patientId=''; }
    const res = document.getElementById('lab-pat-results');
    if(res) res.style.display='none';
    document.getElementById('lab-teeth').value='';
    document.getElementById('lab-shade').value='';
    document.getElementById('lab-lab-name').value='';
    document.getElementById('lab-dispatch-date').value=new Date().toISOString().slice(0,10);
    document.getElementById('lab-due-date').value='';
    document.getElementById('lab-fee').value='';
    document.getElementById('lab-notes').value='';
    document.getElementById('lab-edit-id').value='';
    document.getElementById('lab-modal-msg').textContent='';
    document.getElementById('lab-save-txt').textContent='Create Lab Case';
    document.getElementById('labCaseOverlay').classList.add('show');
  },

  async save(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const btn=document.getElementById('lab-save-txt'), msg=document.getElementById('lab-modal-msg');
    const patInput = document.getElementById('lab-pat-name');
    const pat = patInput?.value.trim().split('·')[0].trim(); // name before the · separator
    const patId = patInput?.dataset.patientId || '';
    if(!pat){ if(msg){msg.textContent='⚠ Patient name required.';msg.className='qdc-msg err';} return; }
    if(btn) btn.textContent='Saving…';
    try {
      const params = new URLSearchParams({
        action:'saveLabCase',
        caseId:document.getElementById('lab-edit-id')?.value||'',
        patientName:pat,
        patientId:patId,
        workType:document.getElementById('lab-work-type')?.value||'',
        teeth:document.getElementById('lab-teeth')?.value||'',
        shade:document.getElementById('lab-shade')?.value||'',
        labName:document.getElementById('lab-lab-name')?.value||'',
        dispatchDate:document.getElementById('lab-dispatch-date')?.value||'',
        dueDate:document.getElementById('lab-due-date')?.value||'',
        fee:document.getElementById('lab-fee')?.value||0,
        notes:document.getElementById('lab-notes')?.value||'',
        status:'Dispatched'
      });
      const r=await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'GAS returned error — ensure GAS v5 is deployed');
      document.getElementById('labCaseOverlay').classList.remove('show');
      await this.load();
      const lm=document.getElementById('lab-msg'); if(lm){lm.textContent='✅ Lab case saved.';lm.className='qdc-msg ok';setTimeout(()=>lm.textContent='',3000);}
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
    if(btn) btn.textContent='Create Lab Case';
  },

  async updateStatus(caseId, newStatus, selectEl){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    if(!caseId){ return; }
    try {
      const r=await fetch(`${proxy}&action=updateLabStatus&caseId=${encodeURIComponent(caseId)}&status=${encodeURIComponent(newStatus)}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      // Show tick next to dropdown
      if(selectEl){
        const tick=selectEl.parentElement?.querySelector('[class*="lab-status-tick"]');
        if(tick){ tick.style.display='inline'; setTimeout(()=>tick.style.display='none',1500); }
      }
      // Update local cache without full reload
      const c=this._cases.find(c=>(c.CaseID||c.caseId||'')==caseId);
      if(c) c.Status=newStatus;
      const cf=this._filtered.find(c=>(c.CaseID||c.caseId||'')==caseId);
      if(cf) cf.Status=newStatus;
    } catch(e){
      const lm=document.getElementById('lab-msg');
      if(lm){lm.textContent='⚠ Status update failed: '+e.message;lm.className='qdc-msg err';setTimeout(()=>lm.textContent='',3000);}
    }
  }
};

/* ─── 4. WHATSAPP INBOX ─── */
window.QDC_inbox = {
  _threads: [],
  _filtered: [],
  _activePhone: null,
  _pollTimer: null,
  _isMobile(){ return window.innerWidth <= 640; },

  showList(){
    const list = document.getElementById('inbox-list-pane');
    const chat = document.getElementById('inbox-chat-pane');
    if(list) list.classList.remove('inbox-hidden');
    if(chat) chat.classList.remove('inbox-visible');
    this._activePhone = null;
  },

  showChat(){
    if(this._isMobile()){
      const list = document.getElementById('inbox-list-pane');
      const chat = document.getElementById('inbox-chat-pane');
      if(list) list.classList.add('inbox-hidden');
      if(chat) chat.classList.add('inbox-visible');
    }
  },

  async load(){
    const pill = document.getElementById('inbox-status-txt');
    if(pill) pill.textContent = 'Checking…';
    // Show loading state immediately
    const tl = document.getElementById('inbox-thread-list');
    if(tl) tl.innerHTML='<div style="padding:16px;text-align:center;color:var(--text3);font-size:.84rem">⌛ Loading messages…</div>';
    await this._checkState();
    await this._loadMessages();
    clearInterval(this._pollTimer);
    this._pollTimer = setInterval(()=>this._loadMessages(), 20000);
  },

  async _checkState(){
    const pill = document.getElementById('inbox-status-txt');
    try {
      const q = window.__QDC||{};
      const inst2 = q.GREEN_API_INSTANCE || '';
      const tok2  = q.GREEN_API_TOKEN    || '';
      const r = await fetch((window.__QDC||{}).GREEN_API_BASE+'/getStateInstance/'+(window.__QDC||{}).GREEN_API_TOKEN);
      const d = await r.json();
      if(pill){
        const connected = d.stateInstance === 'authorized';
        pill.textContent = connected ? 'Connected' : (d.stateInstance||'Not connected');
        const pillEl = document.getElementById('inbox-status-pill');
        if(pillEl) pillEl.style.borderColor = connected ? 'rgba(34,197,94,.3)' : 'rgba(231,76,60,.3)';
        const dot = pillEl?.querySelector('.pdot');
        if(dot) dot.style.background = connected ? 'var(--open)' : 'var(--crimson)';
      }
    } catch(e){ if(pill) pill.textContent = 'Error'; }
  },

  async _loadMessages(){
    const q   = window.__QDC||{};
    const tl  = document.getElementById('inbox-thread-list');
    const _gBase = q.GREEN_API_BASE || '';
    const _gTok  = q.GREEN_API_TOKEN || '';

    if (!_gBase || !_gTok) {
      if(tl) tl.innerHTML='<div style="padding:20px;color:var(--text3);font-size:.84rem">Green API not configured.</div>';
      return;
    }

    try {
      // Use getChats as PRIMARY source — same as WhatsApp Web.
      // It returns the full conversation list with the last message per chat.
      // ONLY @c.us IDs are real person-to-person contacts.
      // @g.us = groups, @s.whatsapp.net = newsletters/meta, @broadcast = status.
      let chats = [];
      try {
        const r = await fetch(_gBase + '/getChats/' + _gTok);
        const parsed = await r.json();
        if (Array.isArray(parsed)) chats = parsed;
        console.log('[Inbox] getChats:', chats.length, 'total, sample:', JSON.stringify(chats[0]||{}).slice(0,150));
      } catch(e) { console.warn('[Inbox] getChats failed:', e); }

      // Strict filter: ONLY @c.us contacts with a phone number >= 7 digits
      const realChats = chats.filter(c => {
        const id = String(c.id || '');
        if (!id.endsWith('@c.us')) return false;
        const digits = id.replace('@c.us','').replace(/\D/g,'');
        return digits.length >= 7;
      });
      console.log('[Inbox] After @c.us filter:', realChats.length, 'real contacts');

      const byPhone = {};
      // Phone normalizer: always store as digits without country code
      // e.g. 8801712783288@c.us → '01712783288' (local BD format for display)
      //      8801234567890 → '01234567890'
      function _normPhone(raw) {
        const digits = raw.replace('@c.us','').replace(/\D/g,'');
        // BD: 880XXXXXXXXXXX → 0XXXXXXXXXXX
        if (digits.startsWith('880') && digits.length === 13) return '0' + digits.slice(3);
        return digits;
      }

      // Patients cross-reference for name lookup
      const patientMap = {};
      const allPats = (window.QDC_staff && QDC_staff._staffCtx && QDC_staff._staffCtx.patients) || [];
      allPats.forEach(p => {
        const ph = String(p.Phone||p.phone||'').replace(/\D/g,'');
        if (ph.length >= 7) {
          // Store under both local (01xxx) and international (880xxx) formats
          const local = ph.startsWith('880') && ph.length===13 ? '0'+ph.slice(3) : ph;
          const intl  = local.startsWith('0') && local.length===11 ? '880'+local.slice(1) : ph;
          const nm = p.Name || p.name || '';
          if (nm) { patientMap[local] = nm; patientMap[intl] = nm; }
        }
      });

      realChats.forEach(c => {
        const phone = _normPhone(c.id); // normalized local format
        const intlPhone = phone.startsWith('0') && phone.length===11 ? '880'+phone.slice(1) : phone;
        // Name priority: patients sheet → WhatsApp contact name → phone
        const name = patientMap[phone] || patientMap[intlPhone] || c.name || c.contactName || phone;
        const lm   = c.lastMessage || {};
        const txt  = lm.textMessage || lm.caption || lm.text || '';
        const mediaLabel =
          lm.typeMessage === 'imageMessage'    ? '📷 Image'    :
          lm.typeMessage === 'audioMessage'    ? '🎵 Audio'    :
          lm.typeMessage === 'videoMessage'    ? '🎥 Video'    :
          lm.typeMessage === 'documentMessage' ? '📄 Document' :
          lm.typeMessage === 'locationMessage' ? '📍 Location' :
          lm.typeMessage === 'stickerMessage'  ? '🎉 Sticker'  : '';
        const preview = txt || mediaLabel;
        byPhone[phone] = {
          phone, name,
          unread: Number(c.unreadCount) || 0,
          msgs: preview ? [{
            id: lm.idMessage || '',
            timestamp: Number(lm.timestamp) || 0,
            type: lm.type || 'incoming',
            textMessage: preview,
            typeMessage: lm.typeMessage || 'textMessage',
            isRead: true,
          }] : [],
        };
      });

      this._threads  = Object.values(byPhone).sort((a,b)=>{
        const ta = a.msgs[a.msgs.length-1]?.timestamp || 0;
        const tb = b.msgs[b.msgs.length-1]?.timestamp || 0;
        return tb - ta;
      });
      this._filtered = [...this._threads];

      this._checkNewMessages();
      if (!this._threads.length) {
        if(tl) tl.innerHTML='<div style="padding:20px;color:var(--text3);font-size:.84rem">No conversations found.<br><span style="font-size:.74rem;opacity:.7">Messages from patients will appear here when they message your WhatsApp.</span></div>';
        return;
      }
      this._renderThreadList();
      if (this._activePhone && this._chatLoaded) this._renderMessages(this._activePhone);

      // Background: enrich previews from lastIncomingMessages (fire-and-forget)
      this._enrichFromMessages();

    } catch(err){
      console.error('[Inbox] error:', err);
      if(tl) tl.innerHTML=`<div style="padding:16px;color:var(--crimson);font-size:.84rem">⚠ ${err.message}</div>`;
    }
  },

  async _enrichFromMessages(){
    const _gBase = (window.__QDC||{}).GREEN_API_BASE || '';
    const _gTok  = (window.__QDC||{}).GREEN_API_TOKEN || '';
    try {
      const [r1, r2] = await Promise.all([
        fetch(_gBase + '/lastIncomingMessages/' + _gTok, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({minutes:10080})}),
        fetch(_gBase + '/lastOutgoingMessages/' + _gTok,  {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({minutes:10080})})
      ]);
      const inc = await r1.json().catch(()=>[]);
      const out = await r2.json().catch(()=>[]);
      const all = [...(Array.isArray(inc)?inc:[]), ...(Array.isArray(out)?out:[])];
      all.forEach(m => {
        const rawId = String(m.chatId || m.senderId || '');
        if (!rawId.endsWith('@c.us')) return;
        const phone = rawId.replace('@c.us','');
        const thread = this._threads.find(t => t.phone === phone);
        if (!thread) return;
        const isOut = Array.isArray(out) && out.includes(m);
        const txt = m.textMessage||m.caption||m.text||
          (m.typeMessage==='imageMessage'?'📷 Image':m.typeMessage==='audioMessage'?'🎵 Audio':
           m.typeMessage==='videoMessage'?'🎥 Video':m.typeMessage==='documentMessage'?'📄 Document':'📎 Media');
        if (!thread.msgs.some(x => x.id && x.id === m.idMessage)) {
          thread.msgs.push({
            id: m.idMessage||'', timestamp: Number(m.timestamp)||0,
            type: isOut?'outgoing':'incoming',
            textMessage: txt, typeMessage: m.typeMessage||'textMessage', isRead: !!m.isRead,
          });
          if (!isOut && !m.isRead) thread.unread++;
        }
      });
      this._threads.forEach(t => t.msgs.sort((a,b)=>a.timestamp-b.timestamp));
      this._filtered = [...this._threads];
      this._renderThreadList();
    } catch(e) { /* silent */ }
  },

  _lastSeenTimestamp: 0,

  _checkNewMessages(){
    if(!this._threads.length) return;
    const newest = this._threads[0].msgs
      .filter(m => m.type === 'incoming')
      .reduce((max, m) => Math.max(max, m.timestamp||0), 0);

    if(this._lastSeenTimestamp === 0){
      // First load — just record, don't notify
      this._lastSeenTimestamp = newest;
      return;
    }

    // Find all new incoming messages since last check
    const newMsgs = this._threads.flatMap(t =>
      t.msgs.filter(m => m.type === 'incoming' && (m.timestamp||0) > this._lastSeenTimestamp)
    );

    if(!newMsgs.length) return;
    this._lastSeenTimestamp = newest;

    // Update tab badge
    const tabEl = document.getElementById('stab-inbox');
    if(tabEl){
      let badge = tabEl.querySelector('.inbox-badge');
      if(!badge){
        badge = document.createElement('span');
        badge.className = 'inbox-badge';
        badge.style.cssText = 'background:#ef4444;color:#fff;border-radius:50%;width:16px;height:16px;font-size:.6rem;display:inline-flex;align-items:center;justify-content:center;margin-left:4px;vertical-align:middle;font-weight:700';
        tabEl.appendChild(badge);
      }
      const cur = parseInt(badge.textContent)||0;
      badge.textContent = cur + newMsgs.length;
    }

    // Show staff notification banner
    const senderName = this._threads[0].name || this._threads[0].phone || 'Patient';
    const lastText = newMsgs[newMsgs.length-1]?.textMessage || 'New message';
    this._showMsgToast(senderName, lastText, newMsgs.length);

    // Browser push notification (if permitted)
    if(Notification.permission === 'granted'){
      new Notification(`💬 ${newMsgs.length > 1 ? newMsgs.length + ' new messages' : senderName}`, {
        body: lastText.slice(0, 80),
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🦷</text></svg>'
      });
    } else if(Notification.permission !== 'denied'){
      Notification.requestPermission();
    }
  },

  _showMsgToast(sender, text, count){
    const existing = document.getElementById('inbox-new-toast');
    if(existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'inbox-new-toast';
    toast.style.cssText = 'position:fixed;top:70px;right:14px;background:var(--blue3);color:#fff;border-radius:8px;padding:10px 16px;font-size:.82rem;z-index:9001;max-width:260px;box-shadow:0 4px 20px rgba(0,0,0,.25);cursor:pointer;animation:slideInRight .3s ease';
    toast.innerHTML = `<div style="font-weight:600;margin-bottom:2px">💬 ${count > 1 ? count + ' new messages' : 'New message'}</div><div style="opacity:.85;font-size:.76rem">${sender}: ${text.slice(0,60)}${text.length>60?'…':''}</div>`;
    toast.onclick = () => { toast.remove(); QDC_staff.tab('inbox'); };
    document.body.appendChild(toast);
    setTimeout(() => toast?.remove(), 6000);
  },

  // Call this when staff opens inbox tab to clear badge
  clearBadge(){
    const tabEl = document.getElementById('stab-inbox');
    const badge = tabEl?.querySelector('.inbox-badge');
    if(badge) badge.remove();
  },

  // Load full chat history (both sent + received) when opening a thread
  async _loadChatHistory(phone){
    const q    = window.__QDC||{};
    const msgs = document.getElementById('inbox-messages');
    if(msgs) msgs.innerHTML='<div style="padding:20px;text-align:center;color:var(--text3);font-size:.84rem">⌛ Loading conversation…</div>';
    try {
      const _inst = q.GREEN_API_INSTANCE || '';
      const _tok  = q.GREEN_API_TOKEN    || '';
      const r = await fetch(
        (window.__QDC||{}).GREEN_API_BASE+'/getChatHistory/'+(window.__QDC||{}).GREEN_API_TOKEN,
        {method:'POST',
         headers:{'Content-Type':'application/json'},
         body: JSON.stringify({chatId: (phone.startsWith('0')&&phone.length===11?'880'+phone.slice(1):phone)+'@c.us', count: 50})}
      );
      const raw = await r.text();
      let history;
      try { history = JSON.parse(raw); } catch(pe){ throw new Error('Parse error: '+raw.slice(0,80)); }

      if(!Array.isArray(history)){
        // Fall back to showing just the incoming messages we already have
        this._chatLoaded = true;
        this._renderMessages(phone);
        return;
      }

      // Normalise each message
      const normalized = history.map(m=>({
        id:          m.idMessage||'',
        timestamp:   Number(m.timestamp)||0,
        // Green API getChatHistory: type field is 'incoming' or 'outgoing'
        type:        m.type || (m.senderId && !m.senderId.includes('me')? 'incoming':'outgoing'),
        textMessage: m.textMessage || m.caption ||
                     (m.typeMessage==='imageMessage'    ? '📷 Image'    :
                      m.typeMessage==='audioMessage'    ? '🎵 Audio'    :
                      m.typeMessage==='videoMessage'    ? '🎥 Video'    :
                      m.typeMessage==='documentMessage' ? '📄 Document' :
                      m.typeMessage==='locationMessage' ? '📍 Location' :
                      m.typeMessage==='stickerMessage'  ? '🎉 Sticker'  : '📎 Media'),
        typeMessage: m.typeMessage||'textMessage',
      })).sort((a,b)=>a.timestamp - b.timestamp);

      // Update or create thread with full history
      let thread = this._threads.find(t=>t.phone===phone);
      if(thread){
        thread.msgs = normalized;
        // Name priority: patients sheet > chat history senderName > existing name
        const normPh = phone.startsWith('0')&&phone.length===11 ? '880'+phone.slice(1) : phone;
        const allPatsH = (window.QDC_staff?._staffCtx?.patients) || [];
        let resolvedName = '';
        for (const p of allPatsH) {
          const ph2 = String(p.Phone||p.phone||'').replace(/\D/g,'');
          const loc2 = ph2.startsWith('880')&&ph2.length===13?'0'+ph2.slice(3):ph2;
          if (loc2===phone || ph2===normPh) { resolvedName=p.Name||p.name||''; break; }
        }
        if (resolvedName) thread.name = resolvedName;
        else {
          const nameFromHistory = history.find(m=>m.senderName&&m.type!=='outgoing')?.senderName;
          if(nameFromHistory) thread.name = nameFromHistory;
        }
      } else {
        thread = {phone, name:phone, msgs:normalized, unread:0};
        this._threads.unshift(thread);
        this._filtered = [...this._threads];
        this._renderThreadList();
      }
      this._chatLoaded = true;
      this._renderMessages(phone);
      // Scroll to bottom after history loads
      setTimeout(()=>{ const el=document.getElementById('inbox-messages'); if(el) el.scrollTop=el.scrollHeight; }, 80);
    } catch(e){
      if(msgs) msgs.innerHTML=`<div style="padding:16px;color:var(--crimson)">⚠ ${e.message}<br><span style="font-size:.74rem;opacity:.7">Check that Green API is connected and authorised.</span></div>`;
    }
  },

  filterThreads(){
    const q = (document.getElementById('inbox-search')?.value||'').trim().toLowerCase();
    if(!q){
      this._filtered = [...this._threads];
    } else {
      this._filtered = this._threads.filter(t=>
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.msgs.some(m=>(m.textMessage||'').toLowerCase().includes(q))
      );
    }
    const tl = document.getElementById('inbox-thread-list');
    if(!this._filtered.length && q){
      if(tl) tl.innerHTML=`<div style="padding:16px;color:var(--text3);font-size:.84rem">No conversations matching "${q}".</div>`;
      return;
    }
    this._renderThreadList();
  },

  _renderThreadList(){
    const tl=document.getElementById('inbox-thread-list'); if(!tl) return;
    if(!this._filtered.length){ tl.innerHTML='<div style="padding:20px;color:var(--text3);font-size:.84rem">No conversations found.</div>'; return; }
    tl.innerHTML=this._filtered.map(t=>{
      const last=t.msgs.length ? t.msgs[t.msgs.length-1] : null;
      const preview = last
        ? (last.textMessage||last.caption||'📎 Media').slice(0,55)
        : '— tap to load messages —';
      const time=last?.timestamp ? new Date(last.timestamp*1000).toLocaleTimeString('en-BD',{hour:'2-digit',minute:'2-digit'}) : '';
      const isActive=t.phone===this._activePhone;
      return `<div onclick="QDC_inbox.openThread('${t.phone}')"
        style="padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;background:${isActive?'var(--surface)':'transparent'};transition:background .15s"
        onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background='${isActive?'var(--surface)':'transparent'}'">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
          <span style="font-weight:600;font-size:.88rem;color:var(--cream)">${t.name}</span>
          <span style="font-size:.7rem;color:var(--text3)">${time}</span>
        </div>
        <div style="font-size:.78rem;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${preview}</div>
        ${t.unread?`<span style="display:inline-block;background:#25d366;color:#fff;border-radius:10px;font-size:.65rem;padding:1px 7px;margin-top:3px;font-weight:600">${t.unread}</span>`:''}
      </div>`;
    }).join('');
  },

  openThread(phone){
    this._activePhone  = phone;
    this._chatLoaded   = false;
    this._renderThreadList();
    this.showChat();
    // Load header immediately from thread list data
    const thread = this._threads.find(t=>t.phone===phone);
    const header = document.getElementById('inbox-chat-header');
    if(header && thread){
      header.innerHTML =
        `<button onclick="QDC_inbox.showList()" style="background:none;border:1px solid var(--border);color:var(--text2);padding:5px 12px;cursor:pointer;font-size:.8rem;flex-shrink:0;display:${this._isMobile()?'inline-flex':'none'}">← Back</button>
         <div style="width:34px;height:34px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.88rem;flex-shrink:0">${(thread.name||'?')[0].toUpperCase()}</div>
         <div><div style="font-weight:600;color:var(--cream);font-size:.9rem">${thread.name}</div><div style="font-size:.7rem;color:var(--text3)">+${phone}</div></div>`;
    }
    // Fetch full conversation history
    this._loadChatHistory(phone);
  },

  _renderMessages(phone){
    const thread = this._threads.find(t=>t.phone===phone); if(!thread) return;
    const header = document.getElementById('inbox-chat-header');
    const msgs   = document.getElementById('inbox-messages');
    const backBtn= document.querySelector('[data-role="inbox-back"]') || document.getElementById('inbox-back-btn');
    if(header) header.innerHTML =
      `<button data-role="inbox-back" onclick="QDC_inbox.showList()" style="background:none;border:1px solid var(--border);color:var(--text2);padding:5px 12px;cursor:pointer;font-size:.8rem;flex-shrink:0;display:${this._isMobile()?'inline-flex':'none'}">← Back</button>
       <div style="width:34px;height:34px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.88rem;flex-shrink:0">${(thread.name||'?')[0].toUpperCase()}</div>
       <div><div style="font-weight:600;color:var(--cream);font-size:.9rem">${thread.name}</div><div style="font-size:.7rem;color:var(--text3)">+${phone}</div></div>`;
    if(!msgs) return;
    msgs.innerHTML = thread.msgs.map(m=>{
      const text = m.textMessage || m.caption ||
        (m.typeMessage==='imageMessage'    ? '📷 Image'    :
         m.typeMessage==='audioMessage'    ? '🎵 Audio'    :
         m.typeMessage==='videoMessage'    ? '🎥 Video'    :
         m.typeMessage==='documentMessage' ? '📄 Document' :
         m.typeMessage==='locationMessage' ? '📍 Location' :
         m.typeMessage==='stickerMessage'  ? '🎉 Sticker'  : '📎 Media');
      const time  = m.timestamp ? new Date(m.timestamp*1000).toLocaleTimeString('en-BD',{hour:'2-digit',minute:'2-digit'}) : '';
      const out   = m.type==='outgoing';
      return `<div style="display:flex;${out?'justify-content:flex-end':'justify-content:flex-start'}">
        <div style="max-width:75%;padding:8px 12px;border-radius:${out?'12px 2px 12px 12px':'2px 12px 12px 12px'};background:${out?'#25d366':'var(--surface)'};color:${out?'#fff':'var(--text)'};font-size:.88rem;line-height:1.6;word-break:break-word">
          <div>${text}</div>
          <div style="font-size:.64rem;opacity:.65;text-align:right;margin-top:3px">${time}</div>
        </div>
      </div>`;
    }).join('');
    msgs.scrollTop = msgs.scrollHeight;
  },

  async sendReply(){
    const textarea = document.getElementById('inbox-reply');
    const msg = (textarea?.value||'').trim();
    if(!msg || !this._activePhone) return;
    const q = window.__QDC||{};
    textarea.value = '';
    textarea.disabled = true;


    const rawNum = String(this._activePhone).replace(/\D/g,'');
    const chatId = (rawNum.startsWith('880') ? rawNum : rawNum.startsWith('0') ? '880'+rawNum.slice(1) : '880'+rawNum) + '@c.us';
    try {
      const r = await fetch(
        (window.__QDC||{}).GREEN_API_BASE+'/sendMessage/'+(window.__QDC||{}).GREEN_API_TOKEN,
        {method:"POST",
         headers:{"Content-Type":"application/json"},
         body: JSON.stringify({chatId: chatId, message: msg})}
      );
      const d = await r.json();
      if(!d.idMessage) throw new Error(d.message||'Send failed');
      // Add to local thread immediately
      const thread = this._threads.find(t=>t.phone===this._activePhone);
      if(thread){
        thread.msgs.push({
          id: d.idMessage, timestamp: Math.floor(Date.now()/1000),
          type:'outgoing', textMessage: msg, typeMessage:'textMessage'
        });
        this._renderMessages(this._activePhone);
      }
    } catch(e){
      textarea.value = msg;
      alert('Send failed: '+e.message);
    }
    textarea.disabled = false;
    textarea.focus();
  }
};

/* ─── 5. CLINICAL PHOTOGRAPHY ─── */
window.QDC_photos = {
  _patient: null,
  _view: 'grid',
  _files: [],

  searchPatient(){ _patSearch('photo-pat-search','photo-pat-results', p=>QDC_photos.selectPatient(p)); },

  selectPatient(p){
    this._patient=p;
    document.getElementById('photo-pat-results').style.display='none';
    document.getElementById('photo-pat-search').value=p.name||'';
    document.getElementById('photo-selected-pat').innerHTML=
      `<div style="background:rgba(201,151,58,.07);border:1px solid var(--border2);padding:7px 14px;font-size:.86rem;color:var(--cream)">${p.name} · ${p.id}</div>`;
    this.load();
  },

  async load(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const gallery=document.getElementById('photo-gallery'); if(!gallery) return;
    if(!this._patient){ gallery.innerHTML='<div class="empty-state"><span>📷</span><p>Search for a patient to view their photos.</p></div>'; return; }
    gallery.innerHTML='<div style="padding:24px;color:var(--text3);font-size:.86rem">⌛ Loading photos…</div>';
    try {
      const typeFilter=document.getElementById('photo-filter-type')?.value||'';
      const pid = this._patient.id||this._patient.PatientID||'';
      // Use dedicated getPhotos action (added in GAS v5 doGet)
      const r=await fetch(`${proxy}&action=getPhotos&patientId=${encodeURIComponent(pid)}${QDC_staff._hipaaParams()}`);
      const raw=await r.text();
      let d; try{ d=JSON.parse(raw); }catch(pe){ throw new Error('Parse error: '+raw.slice(0,80)); }
      if(d && d.ok===false) throw new Error(d.error||'GAS error — redeploy GAS v5');
      const allPhotos=Array.isArray(d)?d:(d.photos||[]);
      const filtered=typeFilter?allPhotos.filter(p=>(p.Type||p.type||'').toLowerCase().includes(typeFilter.toLowerCase())):allPhotos;
      if(!filtered.length){ gallery.innerHTML='<div class="empty-state"><span>📷</span><p>No clinical photos found for this patient.</p></div>'; return; }

      // Convert Drive view URL to embeddable URL
      const toEmbedUrl = (p) => {
        const fid = p.FileID || p.fileId || '';
        if(fid) return `https://drive.google.com/thumbnail?id=${fid}&sz=w400`;
        const url = p.DriveURL || p.url || '';
        const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if(m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w400`;
        return url;
      };
      const toOpenUrl = (p) => {
        const fid = p.FileID || p.fileId || '';
        if(fid) return `https://drive.google.com/file/d/${fid}/view`;
        return p.DriveURL || p.url || '';
      };

      if(this._view==='pairs'){
        // Group by treatment type — show before/after within each group
        const pairs={};
        filtered.forEach(p=>{
          const key = (p.Type||p.type||'General');
          if(!pairs[key]) pairs[key]=[];
          pairs[key].push(p);
        });
        // Sort each group: Before → During → After → Follow-up
        const phaseOrder = {'Before':0,'During':1,'After':2,'Follow-up':3,'Follow up':3};
        Object.values(pairs).forEach(grp => grp.sort((a,b)=>(phaseOrder[a.Phase||a.phase||'']||99)-(phaseOrder[b.Phase||b.phase||'']||99)));
        gallery.style.gridTemplateColumns='repeat(auto-fill,minmax(360px,1fr))';
        gallery.innerHTML=Object.entries(pairs).map(([type,grp])=>`
          <div style="border:1px solid var(--border);background:var(--bg2);overflow:hidden">
            <div style="padding:8px 14px;background:var(--surface);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);font-weight:600">${type} · ${grp[0].Date||grp[0].date||''}</div>
            <div style="display:grid;grid-template-columns:repeat(${Math.min(grp.length,2)},1fr);gap:0">
              ${grp.map(p=>`<div style="position:relative;cursor:pointer" onclick="window.open('${toOpenUrl(p)}','_blank')">
                <div style="height:190px;background:var(--surface);overflow:hidden">
                  <img src="${toEmbedUrl(p)}" alt="${p.Phase||p.phase||''}" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy"
                    onerror="this.parentElement.innerHTML='<div style=height:190px;display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--text3)>📷</div>'">
                </div>
                <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));color:#fff;font-size:.72rem;padding:8px 8px 6px;font-weight:600">${p.Phase||p.phase||p.Filename||p.name||'—'}</div>
              </div>`).join('')}
            </div>
          </div>`).join('');
      } else {
        gallery.style.gridTemplateColumns='repeat(auto-fill,minmax(180px,1fr))';
        gallery.innerHTML=filtered.map(p=>`
          <div style="border:1px solid var(--border);background:var(--bg2);overflow:hidden;cursor:pointer" onclick="window.open('${toOpenUrl(p)}','_blank')">
            <div style="height:150px;background:var(--surface);position:relative;overflow:hidden">
              <img src="${toEmbedUrl(p)}" alt="${p.Filename||p.name||''}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s" loading="lazy"
                onerror="this.parentElement.innerHTML='<div style=height:150px;display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--text3)>📷</div>'"
                onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
            </div>
            <div style="padding:8px 10px">
              <div style="font-size:.78rem;font-weight:500;color:var(--cream);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.Type||p.type||'Photo'}</div>
              <div style="font-size:.7rem;color:var(--text3);margin-top:2px">${p.Date||p.date||''} ${(p.Phase||p.phase)?'· '+(p.Phase||p.phase):''}</div>
            </div>
          </div>`).join('');
      }
    } catch(e){ gallery.innerHTML=`<div class="empty-state"><span>⚠</span><p>${e.message}</p></div>`; }
  },

  setView(v,btn){
    this._view=v;
    ['grid','pairs'].forEach(id=>{ const b=document.getElementById('photo-view-'+id); if(b){ b.style.background='var(--bg2)'; b.style.color='var(--text2)'; b.style.borderColor='var(--border2)'; }});
    if(btn){ btn.style.background='var(--crimson)'; btn.style.color='#fff'; btn.style.borderColor='var(--crimson)'; }
    this.load();
  },

  openUpload(){
    const patName = this._patient?.name || '';
    const patId   = this._patient?.id   || '';
    document.getElementById('pu-patient').value = patName ? `${patName} (${patId})` : '';
    document.getElementById('pu-patient').dataset.patientId = patId;
    document.getElementById('pu-date').value = new Date().toISOString().slice(0,10);
    document.getElementById('pu-msg').textContent = '';
    document.getElementById('pu-btn-txt').textContent = 'Upload Photos';
    this._files = [];
    document.getElementById('pu-preview').innerHTML = '';
    document.getElementById('pu-file-txt').textContent = 'Click or drag photos here';
    document.getElementById('photoUploadOverlay').classList.add('show');
  },

  filesSelected(input){
    this._files=Array.from(input.files);
    document.getElementById('pu-file-txt').textContent=`${this._files.length} file${this._files.length>1?'s':''} selected`;
    const prev=document.getElementById('pu-preview'); prev.innerHTML='';
    this._files.forEach(f=>{
      const img=document.createElement('img');
      img.style.cssText='width:60px;height:60px;object-fit:cover;border:1px solid var(--border);border-radius:2px';
      const reader=new FileReader(); reader.onload=e=>img.src=e.target.result; reader.readAsDataURL(f);
      prev.appendChild(img);
    });
  },

  async upload(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const btn=document.getElementById('pu-btn-txt'), msg=document.getElementById('pu-msg');
    if(!this._files.length){ if(msg){msg.textContent='⚠ Select at least one photo.';msg.className='qdc-msg err';} return; }
    if(btn) btn.textContent='Uploading…';
    if(msg){ msg.textContent=''; msg.className='qdc-msg'; }
    let uploaded=0, failed=0;
    const patInput = document.getElementById('pu-patient');
    const patId    = patInput?.dataset.patientId || this._patient?.id || 'unknown';
    const type  = document.getElementById('pu-type')?.value||'';
    const phase = document.getElementById('pu-phase')?.value||'';
    const date  = document.getElementById('pu-date')?.value||'';
    for(const file of this._files){
      if(msg) msg.textContent=`⌛ Uploading ${uploaded+failed+1}/${this._files.length}: ${file.name}…`;
      try {
        const b64=await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e2=>res(e2.target.result.split(',')[1]); r.onerror=rej; r.readAsDataURL(file); });
        // Pass metadata as URL params (survive GAS redirect), base64 in body
        const params = new URLSearchParams({
          action:'uploadPhoto',
          patientId:patId,
          filename:file.name,
          type, phase, date,
          mimeType:file.type
        });
        const r=await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`, {method:'POST', body:b64});
        const raw=await r.text();
        let d; try{ d=JSON.parse(raw); }catch(pe){ throw new Error('Server error: '+raw.slice(0,80)); }
        if(!d.ok) throw new Error(d.error||'Upload failed');
        uploaded++;
      } catch(e2){
        failed++;
        if(msg){ msg.textContent=`⚠ ${file.name}: ${e2.message}`; msg.className='qdc-msg err'; }
      }
    }
    if(uploaded>0){
      if(msg){ msg.textContent=`✅ ${uploaded} photo${uploaded>1?'s':''} uploaded successfully.${failed>0?' ('+failed+' failed)':''}`; msg.className='qdc-msg ok'; }
    } else {
      if(msg && !msg.textContent.startsWith('⚠')){ msg.textContent='⚠ No photos uploaded. Check connection.'; msg.className='qdc-msg err'; }
    }
    if(btn) btn.textContent='Upload Photos';
    if(uploaded>0) setTimeout(()=>{ document.getElementById('photoUploadOverlay').classList.remove('show'); if(this._patient) this.load(); },1500);
  }
};

/* History tab removed */

/* ─── AUTOMATION: POST-VISIT SURVEY ─── */
// Triggered from queue when status set to Done
const _origSetQueueStatus = window.QDC_staff?._setQueueStatusOrig;
// Hook into savePrescription success to send survey 24h later via GAS scheduled trigger
// (Actual 24h delay handled by GAS — website just fires action=scheduleSurvey)

/* ─── AUTOMATION: INVENTORY REORDER SUGGESTIONS ─── */
window.QDC_reorder = {
  async checkAndNotify(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    try {
      const r=await fetch(`${proxy}&action=checkReorderNeeds${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!Array.isArray(d)||!d.length) return;
      // Show banner in inventory tab
      const inv=document.getElementById('spanel-inventory');
      if(!inv) return;
      let banner=document.getElementById('reorder-banner');
      if(!banner){
        banner=document.createElement('div');
        banner.id='reorder-banner';
        banner.style.cssText='background:rgba(231,76,60,.08);border:1px solid rgba(231,76,60,.3);padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap';
        inv.insertBefore(banner, inv.querySelector('.staff-card')||inv.children[1]);
      }
      banner.innerHTML=`<div><div style="font-weight:600;color:var(--crimson);font-size:.88rem">⚠ ${d.length} item${d.length>1?'s':''} need reordering</div>
        <div style="font-size:.78rem;color:var(--text2);margin-top:2px">${d.slice(0,3).map(i=>i.name||i.Name).join(', ')}${d.length>3?` +${d.length-3} more`:''}</div>
      </div>
      <button class="s-btn-sm" style="border-color:var(--crimson);color:var(--crimson)" onclick="QDC_reorder.showDraftOrder()">View Draft Order →</button>`;
    } catch(e){}
  },

  async showDraftOrder(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    try {
      const r=await fetch(`${proxy}&action=checkReorderNeeds${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!Array.isArray(d)||!d.length){ alert('No reorder needs found.'); return; }
      let ov=document.getElementById('reorder-overlay');
      if(!ov){ ov=document.createElement('div'); ov.id='reorder-overlay';
        ov.style.cssText='position:fixed;inset:0;z-index:3100;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center';
        ov.onclick=e=>{if(e.target===ov)ov.remove();}; document.body.appendChild(ov); }
      const rows=d.map(i=>`<tr>
        <td style="padding:8px 12px;color:var(--cream);font-size:.86rem">${i.name||i.Name||'—'}</td>
        <td style="padding:8px 12px;color:var(--crimson);font-size:.86rem">${i.stock||i.Stock||0}</td>
        <td style="padding:8px 12px;color:var(--text3);font-size:.86rem">${i.minStock||i.MinStock||0}</td>
        <td style="padding:8px 12px"><input value="${Math.max(10,(i.minStock||i.MinStock||0)*2-(i.stock||i.Stock||0))}" type="number" min="1" style="width:70px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 8px;font-size:.84rem" id="reorder-qty-${i.id||i.ID}"></td>
        <td style="padding:8px 12px"><input value="${i.supplier||i.Supplier||''}" placeholder="Supplier" style="width:140px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 8px;font-size:.84rem"></td>
      </tr>`).join('');
      ov.innerHTML=`<div onclick="event.stopPropagation()" style="background:var(--bg);border:1px solid var(--border2);width:min(600px,94vw);max-height:80vh;overflow-y:auto;border-radius:4px">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:600;color:var(--cream)">📦 Draft Purchase Order</div>
          <button onclick="document.getElementById('reorder-overlay').remove()" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:1.1rem">✕</button>
        </div>
        <div style="padding:16px 20px">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:var(--surface)">
              <th style="padding:8px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)">Item</th>
              <th style="padding:8px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)">Current</th>
              <th style="padding:8px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)">Min</th>
              <th style="padding:8px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)">Order Qty</th>
              <th style="padding:8px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)">Supplier</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end">
          <button class="s-btn-sm" onclick="document.getElementById('reorder-overlay').remove()">Close</button>
          <button class="s-btn-sm" style="border-color:var(--open);color:var(--open)" onclick="QDC_reorder.sendToManager()">📩 Send to Manager via WhatsApp</button>
        </div>
      </div>`;
      ov.style.display='flex';
    } catch(e){ alert('Error: '+e.message); }
    setTimeout(()=>{ msgs.scrollTop=msgs.scrollHeight; }, 50);
  },

  async sendToManager(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    try {
      const r=await fetch(`${proxy}&action=sendReorderAlert${QDC_staff._hipaaParams()}`); const d=await r.json();
      if(d.ok) alert('✅ Draft purchase order sent to manager via WhatsApp.');
      else throw new Error(d.error||'Failed');
    } catch(e){ alert('⚠ '+e.message); }
    document.getElementById('reorder-overlay')?.remove();
  }
};

// Check reorder on inventory tab open
const _origTab = window.QDC_staff?.tab?.bind(window.QDC_staff);
if(window.QDC_staff && _origTab){
  window.QDC_staff.tab = function(which, el){
    _origTab(which, el);
    if(which==='inventory') setTimeout(()=>QDC_reorder.checkAndNotify(), 600);
  };
}

