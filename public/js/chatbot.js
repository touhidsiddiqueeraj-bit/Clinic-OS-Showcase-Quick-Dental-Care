// QDC Chatbot — initialised on first chat-bubble click
(function(){
  /* ── CONFIG ── Gemini key is fetched from GAS Script Property (v8.6+) ── */
  const MODEL = 'gemini-2.5-flash-lite';

  // Key is lazy-loaded from GAS `getAlishaKey` action on first use, then cached.
  // In local mode this hits GAS direct; in prod it goes via proxy.php.
  let _alishaKey = '';
  let _alishaKeyPromise = null;
  async function _getAlishaKey() {
    if (_alishaKey) return _alishaKey;
    if (_alishaKeyPromise) return _alishaKeyPromise;
    _alishaKeyPromise = (async () => {
      try {
        const proxy = (window.__QDC||{}).SHEETS_PROXY || '';
        if (!proxy) throw new Error('SHEETS_PROXY not configured');
        const auth = (typeof _hp === 'function') ? _hp() : '';
        const res = await fetch(`${proxy}&action=getAlishaKey${auth}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const j = await res.json();
        if (j && j.ok && j.key) { _alishaKey = j.key; return j.key; }
        throw new Error(j && j.error ? j.error : 'Key not configured');
      } catch (e) {
        console.warn('[Alisha] key fetch failed:', e);
        _alishaKeyPromise = null; // allow retry on next call
        throw e;
      }
    })();
    return _alishaKeyPromise;
  }
  async function _getURL() {
    const key = await _getAlishaKey();
    return 'https://generativelanguage.googleapis.com/v1beta/models/'
         + MODEL + ':streamGenerateContent?alt=sse&key=' + key;
  }

  /* ── Runtime date ── */
  const _today = new Date().toLocaleDateString('en-BD', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const _time  = new Date().toLocaleTimeString('en-BD', {hour:'2-digit', minute:'2-digit', hour12:true});

  /* ── Patient-facing system prompt ── */
  // ── Categorised context chunks (only injected when relevant) ──
  const _CTX = {
    base: 'QDC dental assistant. Quick Dental Care, Akhalia, Sylhet. +88 01307978439. ' + _today + '. Reply in user\'s language (Bengali/English). Under 3 sentences. No diagnosis.',

    booking: 'BOOKING: Collect name, phone (REQUIRED), date/time, reason. ALL FOUR before booking. Output: {"BOOK_APPOINTMENT":true,"name":"","phone":"","datetime":"","reason":""}',

    pricing: 'PRICES (BDT approx, confirm at consultation):\nConsultation 500-700 | RCT Manual 4-5k, Endo 5.5-6.5k, Re-RCT 6.5-7.5k | Filling Composite 1.8-2.7k, GI 1.3-1.7k | Scaling 2.5-4k | Whitening 11-19k | Crown Regular 4.5-5.5k, Zirconia 17-20k | Veneer Composite 5.5-6.5k, E-Max 22-26k | Extraction 1.3-1.7k, Surgical 5.5-10.5k | Implant 70-85k | Braces 75-160k | Invisalign 180k+ | Denture from 900 | 3D Scan 28-32k | Children 400-3.3k',

    staff: 'DOCTORS:\nDr. Marjana Moury (BMDC 7652) — Chief Consultant, Orthodontics specialist: braces, aligners, Invisalign.\nDr. Tasnia Mahbub (BMDC 14203) — Consultant, Restorative: RCT, crowns, veneers, scaling, whitening.',

    services: 'SERVICES: Consultation, RCT, Fillings, Scaling, Whitening, Crowns, Veneers, Extractions, Implants, Braces, Invisalign, Dentures, Children\'s Dentistry, 3D Scanning, Surgical Extractions, Periodontal Therapy, X-Ray & Imaging.',

    faq: 'FAQ: Toothache=evaluation needed. Sensitivity=enamel erosion. Bleeding gums=gingivitis/scaling. After extraction: no spitting/hot food/smoking 24h. After RCT: soreness 2-3d normal. Child first visit: age 1. Emergencies: call/visit immediately. GOOGLE REVIEW LINK: https://share.google/cIG2jzfDFowC9Mdm7 — share this when patient praises the clinic or asks how to leave a review.'
  };

  function _buildPublicSys(query) {
    var q = (query || '').toLowerCase();
    var parts = [_CTX.base, _CTX.booking];
    var isPrice   = /price|cost|fee|how much|কত|দাম|charge|rate|taka|tk/.test(q);
    var isStaff   = /doctor|dr\.|dentist|specialist|who|কে|ডাক্তার|moury|mahbub|orthodon/.test(q);
    var isSvc     = /service|treatment|what.*do|offer|procedure|available|কী|করেন/.test(q);
    var isFaq     = /toothache|pain|sensitiv|bleed|gum|after|extract|rct|root|child|baby|emerg|ব্যথা/.test(q);
    var anyMatch  = isPrice || isStaff || isSvc || isFaq;
    if (isPrice  || !anyMatch) parts.push(_CTX.pricing);
    if (isStaff  || !anyMatch) parts.push(_CTX.staff);
    if (isSvc    || !anyMatch) parts.push(_CTX.services);
    if (isFaq    || !anyMatch) parts.push(_CTX.faq);
    return parts.join('\n\n');
  }

  // Fallback alias used in welcome chips etc
  var SYS_PUBLIC = _buildPublicSys('');

  /* ── Staff system prompt (built dynamically with live data) ── */
  function buildStaffSys(staffName, role, patients, appointments, query, turnNum) {
    var q        = (query || '').toLowerCase();
    var allPats  = patients || [];
    var _lvl     = role==='admin'?4:role==='manager'?3:role==='doctor'?2:1;
    var turn     = turnNum || 1;

    // ── Intent detection ──────────────────────────────────────────────
    var isQueue    = /queue|waiting|chair|done|no.show|next|call.*in/.test(q);
    var isInventory= /inventory|stock|item|supply|supplies|restock|low|out.of|available|consumable|গুদাম|মজুদ|glove|syringe|napkin|cotton|mask|needle|gauze|glov|how many|do we have|left|কয়টা|আছে/.test(q);
    var isAppt     = /appoint|schedul|book|slot|date|time|when|available/.test(q);
    var isBilling  = /bill|invoice|pay|due|total|cost|amount|charge|৳/.test(q);
    var isRx       = /prescription|rx|treatment|diagnos|medication|drug|med|tablet|syrup|history|procedure/.test(q);
    var isExpense  = /expense|spend|cost|buy|purchase|खर्च/.test(q);
    var isWA       = /whatsapp|message|send|wa|notify|sms/.test(q);
    var isPerf     = /performance|revenue|profit|report|summary|income|month|30.day/.test(q);
    var isPatient  = /patient|find|search|phone|number|name|id|who|look.?up/.test(q);

    // ── Patient context (progressive) ─────────────────────────────────
    var searchTerms = (q.match(/[a-z0-9\u0980-\u09FF]{3,}/g) || [])
      .filter(function(t) {
        return !new Set(['tell','about','from','patient','memory','find','who','what','when','how',
          'show','list','the','and','for','with','has','billing','history','record','details',
          'info','data','profile','queue','appointment','send','message']).has(t);
      })
      .map(function(t) { return t.replace(/^(880|\+880|0)/, ''); });

    // ── SMART CONTEXT: JS-side search filters to save tokens ──────────
    var patContext = '';
    var invCtx = '';
    var apptContext = '';

    // Patient context: only inject matches if query has search terms, else compact summary
    if (searchTerms.length > 0) {
      var matches = allPats.filter(function(p) {
        var raw   = String(p.Phone||p.phone||'');
        var norm  = raw.replace(/\D/g,'');
        var short = norm.slice(-8);
        var hay   = ((p.Name||p.name||'') + ' ' + raw + ' ' + norm + ' ' + short + ' ' + (p.PatientID||p.id||'')).toLowerCase();
        return searchTerms.some(function(t) { return hay.includes(t); });
      }).slice(0, 10);
      if (matches.length) {
        patContext = 'MATCHING PATIENTS (' + matches.length + ' of ' + allPats.length + ' total):\n' + JSON.stringify(matches, null, 0);
      } else {
        patContext = allPats.length + ' patients in system. No matches for search terms. Ask user to clarify.';
      }
    } else if (isPatient) {
      // Patient-related query but no specific search terms — inject last 50 compact
      var top50 = allPats.slice(0, 50).map(function(p){
        var raw = String(p.Phone||p.phone||'').replace(/\D/g,'');
        var norm = raw.startsWith('0') ? '880'+raw.slice(1) : raw.startsWith('880') ? raw : '880'+raw;
        return {id: p.PatientID||p.id||'', n: p.Name||p.name||'', ph: norm};
      });
      patContext = 'PATIENTS (last 50 of ' + allPats.length + '):\n' + JSON.stringify(top50);
    } else {
      // Non-patient query — just state count
      patContext = allPats.length + ' patients in system. Use patient name/phone to look up.';
    }

    // Inventory context: only inject relevant items based on intent
    var inv = staffCtx.inventory || [];
    if (inv.length) {
      if (isInventory) {
        // Full inventory requested — inject everything compact
        var invLines = inv.map(function(i){
          return (i.name||'?')+':'+Number(i.stock||0)+(i.category?'('+i.category+')':'');
        });
        invCtx = 'INVENTORY (' + inv.length + ' items, name:stock(category)):\n' + invLines.join(', ');
      } else {
        // Not inventory-focused — only inject low/out-of-stock alerts
        var lowItems = inv.filter(function(i){ return Number(i.stock||0) <= Number(i.minStock||i.min||5); });
        if (lowItems.length) {
          invCtx = 'LOW STOCK ALERT (' + lowItems.length + '): ' + lowItems.map(function(i){
            return (i.name||'?')+':'+Number(i.stock||0);
          }).join(', ') + '. ' + inv.length + ' total items in inventory.';
        } else {
          invCtx = inv.length + ' inventory items, all stocked above minimum.';
        }
      }
    }

    // Appointment context: inject today's appointments for queue/schedule queries
    var appts = staffCtx.appointments || [];
    if (appts.length && (isQueue || isAppt || !anyIntent)) {
      var todayStr = new Date().toISOString().slice(0,10);
      var todayAppts = appts.filter(function(a){
        var d = a.Date || a.date || '';
        return String(d).slice(0,10) === todayStr;
      });
      if (todayAppts.length) {
        apptContext = 'TODAY\'S APPOINTMENTS (' + todayAppts.length + '):\n' + todayAppts.map(function(a){
          return (a.Time||a.time||'?') + ' ' + (a.Name||a.name||'Patient') + ' — ' + (a.Treatment||a.treatment||a.Dept||'Visit') + (a.Status?' ['+a.Status+']':'');
        }).join('\n');
      } else {
        apptContext = 'No appointments scheduled for today. ' + appts.length + ' total in date range.';
      }
    }


    // ── RBAC-gated action chunks ───────────────────────────────────────
    var _queueActs = [
      '{"QDC_ACTION":"getQueue","date":"YYYY-MM-DD"}',
      '{"QDC_ACTION":"addQueue","patientName":"","patientId":"","dept":"General","status":"Waiting"}',
      '{"QDC_ACTION":"updateQueue","patientName":"","status":"Waiting|In Chair|Done|No Show"}',
    ];
    var _noteAct   = ['{"QDC_ACTION":"addNote","patientId":"","note":""}'];
    var _waAct     = [
      '{"QDC_ACTION":"sendWA","phone":"880...","patientName":"","message":"Quick Dental Care:..."}',
      '{"QDC_ACTION":"notifyPatient","patientId":"","patientName":"","phone":"880...","message":"Quick Dental Care: ..."}',
      '{"QDC_ACTION":"callNextPatient","patientName":"","phone":"880...","dept":"General"}',
      '{"QDC_ACTION":"callNextPatient","auto":true}',
      '{"QDC_ACTION":"broadcastWA","target":"today|all|queue","message":"Quick Dental Care: ..."}',
    ];
    var _apptAct   = ['{"QDC_ACTION":"addAppointment","patientId":"","patientName":"","date":"YYYY-MM-DD","time":"HH:MM","treatment":"","notes":""}'];
    var _expAct    = ['{"QDC_ACTION":"addExpense","description":"","amount":0,"category":"Staff Expense"}'];
    var _rxActs    = [
      '{"QDC_ACTION":"getPrescriptions","patientId":"","patientName":""}',
      '{"QDC_ACTION":"getHistory","patientId":"","patientName":""}',
    ];
    var _apptReadAct = ['{"QDC_ACTION":"getAppointments","date":"YYYY-MM-DD","patientName":""}'];
    var _billAct   = ['{"QDC_ACTION":"getBilling","patientId":"","patientName":""}'];
    var _perfAct   = ['{"QDC_ACTION":"getPerformance"}'];
    var _invActs   = [
      '{"QDC_ACTION":"getInventory"}',
      '{"QDC_ACTION":"updateInventory","id":"","op":"restock|use","qty":1}',
      '{"QDC_ACTION":"removeInventory","id":"","name":""}',
      '{"QDC_ACTION":"requestRestock","itemName":"","qty":0,"note":""}',
      '{"QDC_ACTION":"requestSupplies","items":[{"name":"","qty":0}],"urgency":"normal|urgent","note":""}',
    ];

    // Only inject actions relevant to the current query
    var anyIntent = isQueue||isAppt||isBilling||isRx||isExpense||isWA||isPerf||isPatient||isInventory;
    var acts = [];
    if (isQueue  || !anyIntent) acts = acts.concat(_queueActs);
    if (isPatient|| !anyIntent) acts = acts.concat(_noteAct);
    if (isWA || isQueue || !anyIntent) acts = acts.concat(_waAct);
    if (isAppt   || !anyIntent) acts = acts.concat(_apptAct);
    if (isAppt   || isQueue || !anyIntent) acts = acts.concat(_apptReadAct);
    if (isExpense|| !anyIntent) acts = acts.concat(_expAct);
    if (_lvl >= 2 && (isRx || !anyIntent))   acts = acts.concat(_rxActs);
    if (_lvl >= 2 && (isBilling||isRx||!anyIntent)) acts = acts.concat(_billAct);
    if (_lvl >= 3 && (isPerf || !anyIntent)) acts = acts.concat(_perfAct);
    if (isInventory || !anyIntent) acts = acts.concat(_invActs);

    // ── Role note (terse) ──────────────────────────────────────────────
    var roleNote = _lvl===1
      ? 'Staff. Read-only: queue, calendar, inventory, patients, notes, expenses. Can book appointments, add to queue, log expenses. No Rx/billing/inbox access.'
      : _lvl===2
        ? 'Doctor. Read-only: everything staff has + invoices/billing, prescriptions/treatment history, expenses. Can write prescriptions, view patient treatment costs. Answer cost/billing questions from INVOICES data. Suggest meds based on dx. No inbox access.'
        : 'Manager. Full read-only access to all data including payroll, revenue, expenses. Can use getPerformance for clinic summary. Has inbox access.';

    // ── Assemble ───────────────────────────────────────────────────────
    var parts = [
      'Alisha, QDC assistant. ' + staffName + '(' + role + ') ' + _today.split(',')[0],
      patContext,
    ];
    if (invCtx) parts.push(invCtx);
    if (apptContext) parts.push(apptContext);

    // ── Billing/Invoice context (doctor+) — for cost/billing/treatment queries ──
    if (_lvl >= 2 && (isBilling || isRx || isPatient || !anyIntent)) {
      var invoices = staffCtx.invoices || [];
      if (invoices.length) {
        // Compact: last 50 invoices with key fields
        var invSummary = invoices.slice(-50).map(function(inv){
          return {pid:inv.PatientID||'', n:inv.Name||'', tx:inv.Treatments||'', t:Number(inv.Total||0), p:Number(inv.Paid||0), d:Number(inv.Due||0), dt:String(inv.Date||'').slice(0,10)};
        });
        parts.push('INVOICES (last 50, read-only) — use to answer billing/cost/treatment questions:\n' + JSON.stringify(invSummary));
      }
    }

    // ── Expense context (doctor+) ──
    if (_lvl >= 2 && (isExpense || isPerf)) {
      var expenses = staffCtx.expenses || [];
      if (expenses.length) {
        var expSummary = expenses.slice(-30).map(function(ex){
          return {d:String(ex.date||'').slice(0,10), cat:ex.category||'', desc:ex.description||'', amt:Number(ex.amount||0)};
        });
        parts.push('EXPENSES (last 30, read-only):\n' + JSON.stringify(expSummary));
      }
    }

    // ── Payroll context (manager+) ──
    if (_lvl >= 3 && (isPerf || !anyIntent)) {
      var payroll = staffCtx.payroll || [];
      if (payroll.length) {
        var paySummary = payroll.map(function(p){
          return {id:p.StaffID||'', n:p.Name||'', sal:Number(p.BaseSalary||0), bon:Number(p.Bonus||0), status:p.PaymentStatus||''};
        });
        parts.push('PAYROLL (read-only):\n' + JSON.stringify(paySummary));
      }
    }

    // apptContext omitted — action-driven
    if (acts.length) parts.push('ACTIONS (one JSON line only):\n' + acts.join('\n'));
    parts.push(roleNote + ' Be decisive and action-first. When emitting an action, output ONLY the JSON object on a single line — no extra text before or after. Never wrap JSON in markdown code blocks. sendWA/notifyPatient: compose message yourself. callNextPatient: use for next/call-in/notify-next, emit {auto:true} if unsure who is next. broadcastWA: target=today for queue patients, target=all for all patients, use {{name}} for personalisation. requestSupplies: use when staff asks to order/request supplies — accepts multiple items [{name,qty}], urgency (normal/urgent), note. Logs to Requests sheet + WA to manager. Writes: emit action directly, UI shows confirm card. For billing/cost/treatment questions, answer directly from INVOICES data — do NOT emit a getBilling action unless data is not in context.');

    return parts.join('\n');
  }


  /* ── State ── */
  let history  = [];
  let isOpen   = false;
  let busy     = false;
  let isStaff  = false;
  let staffCtx = { name:'', role:'', patients:[], appointments:[], inventory:[] };
  let dataLoaded = false;
  let msgCount = 0; // progressive context turn counter

  const $    = id => document.getElementById(id);
  const $msgs = () => $('qdc-msgs');

  /* ── HIPAA params helper (safe for chatbot context) ── */
  function _hp() {
    // Proxy secret has trailing '?' — URL-encode it
    const _PSEC = '&_psec=' + encodeURIComponent('2BorNOT2BTHATISTHE?');
    try {
      if (window.QDC_staff && QDC_staff._hipaaParams) return QDC_staff._hipaaParams();
      // In local mode without staff login (patient mode), still pass _psec
      if (window._IS_LOCAL) return _PSEC;
      return '';
    } catch(e) { return window._IS_LOCAL ? _PSEC : ''; }
  }


  /* ── Detect staff login from QDC session ── */
  function detectStaff() {
    const name = window.QDC_staff?._staffName || '';
    const role = window.QDC_staff?._staffRole || '';
    if (name && role) {
      isStaff = true;
      staffCtx.name = name;
      staffCtx.role = role;
      dataLoaded = false;
      // Eager load all staff data at login — not lazily on first message
      setTimeout(function(){ loadStaffData(); }, 100);
    }
  }

  /* ── Load patients + appointments + role-gated read-only data into context ── */
  async function loadStaffData() {
    if (dataLoaded) return;
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    if (!proxy) return;
    try {
      const now = new Date();
      const s30 = new Date(now); s30.setDate(now.getDate()-30);
      const e30 = new Date(now); e30.setDate(now.getDate()+30);
      const role = (staffCtx.role||'staff').toLowerCase();
      const _lvl = role==='admin'?4:role==='manager'?3:role==='doctor'?2:1;
      // Base fetches for all roles
      const fetches = [
        fetch(proxy + '&action=getPatients' + _hp()),
        fetch(proxy + '&action=getAppointments&start=' + s30.toISOString().slice(0,10) + '&end=' + e30.toISOString().slice(0,10) + _hp()),
        fetch(proxy + '&action=getInventory' + _hp())
      ];
      // Doctor+ gets invoices (for billing/cost queries) and prescriptions (for treatment history)
      if (_lvl >= 2) {
        fetches.push(fetch(proxy + '&action=getInvoices' + _hp()));
        fetches.push(fetch(proxy + '&action=getExpenses' + _hp()));
      }
      // Manager+ gets revenue and payroll
      if (_lvl >= 3) {
        fetches.push(fetch(proxy + '&action=getPayroll' + _hp()));
      }
      const results = await Promise.all(fetches.map(function(f){ return f.catch(function(){return {json:function(){return [];}}}); }));
      staffCtx.patients     = await results[0].json().catch(function(){return [];});
      staffCtx.appointments = await results[1].json().catch(function(){return [];});
      staffCtx.inventory    = await results[2].json().catch(function(){return [];});
      if (_lvl >= 2 && results[3]) staffCtx.invoices = await results[3].json().catch(function(){return [];});
      if (_lvl >= 2 && results[4]) staffCtx.expenses = await results[4].json().catch(function(){return [];});
      if (_lvl >= 3 && results[5]) staffCtx.payroll  = await results[5].json().catch(function(){return [];});
      dataLoaded = true;
      const sub = $('qdc-head-sub');
      if (sub) sub.textContent = 'Staff mode · ' + staffCtx.name + ' · Ready';
    } catch(e) {
      console.warn('QDC staff data load failed:', e);
    }
  }

  /* ── Minimal markdown ── */
  function md(t) {
    return t
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul style="margin:5px 0 2px 14px;padding:0">$1</ul>')
      .replace(/\n/g, '<br>');
  }

  function scroll() { setTimeout(() => { const m = $msgs(); if (m) m.scrollTop = m.scrollHeight; }, 30); }

  function userMsg(text) {
    $('qdc-chips-row')?.remove();
    const el = document.createElement('div');
    el.className = 'qm u'; el.textContent = text;
    $msgs().appendChild(el); scroll();
  }

  function botBubble() {
    $('qdc-chips-row')?.remove();
    const el = document.createElement('div');
    el.className = 'qm b streaming';
    el.innerHTML = '<div class="qdots"><span></span><span></span><span></span></div>';
    $msgs().appendChild(el); scroll();
    return el;
  }

  /* ── Public chips (patient mode) ── */
  const CHIPS_PUBLIC = [
    '📅 Book an appointment',
    'দাঁতের ব্যথা — কী করবো?',
    'Root canal — খরচ কত?',
    'Scaling & whitening info',
  ];

  /* ── Staff chips ── */
  const CHIPS_STAFF = [
    "Today's appointments",
    'Find patient by name',
    "Who's in the queue?",
    'Patients seen this week',
  ];

  function showChips(staffMode) {
    const chips = staffMode ? CHIPS_STAFF : CHIPS_PUBLIC;
    const row = document.createElement('div');
    row.className = 'qchips'; row.id = 'qdc-chips-row';
    chips.forEach(c => {
      const b = document.createElement('button');
      b.className = 'qchip'; b.textContent = c;
      b.onclick = () => { row.remove(); qdcChat.sendText(c); };
      row.appendChild(b);
    });
    $msgs().appendChild(row); scroll();
  }

  /* ── Welcome messages ── */
  function welcome() {
    // Staff mode is set via onStaffLogin() — always start public here
    if (isStaff) {
      staffWelcome();
    } else {
      const el = document.createElement('div');
      el.className = 'qm b';
      el.innerHTML = md('**আস্সালামু আলাইকুম! 👋** Welcome to **Quick Dental Care, Sylhet!**\n\n📅 **Book an appointment** · 💰 Treatment costs · 🦷 Dental advice\n\nAsk anything in **English or Bengali** 🇧🇩 — I can book appointments directly!');
      $msgs().appendChild(el); scroll();
      showChips(false);
    }
  }

  async function staffWelcome() {
    // Update header to show staff mode
    const sub = $('qdc-head-sub');
    if (sub) sub.textContent = 'Staff mode · Loading clinic data…';
    const hd = $('qdc-head');
    if (hd) hd.style.background = 'linear-gradient(135deg, #0f4f2a 0%, #1a7a40 100%)';
    const av = hd?.querySelector('.qdc-av');
    if (av) av.textContent = '🏥';

    const el = document.createElement('div');
    el.className = 'qm b';
    el.innerHTML = md(`**Staff mode 🏥** — Hello, **${staffCtx.name}** (${staffCtx.role})\n\nLoading clinic data…`);
    $msgs().appendChild(el); scroll();

    // Wait for data to load
    if (!dataLoaded) await loadStaffData();

    // Build day summary from loaded data
    const todayStr = new Date().toISOString().slice(0,10);
    const todayTime = new Date().toLocaleTimeString('en-BD', {hour:'2-digit', minute:'2-digit', hour12:true});

    // Queue today
    let queueSummary = '';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if (proxy) {
        const qR = await fetch(proxy + '&action=getQueue&date=' + todayStr + _hp());
        const qD = await qR.json().catch(()=>[]);
        const qList = Array.isArray(qD) ? qD : [];
        if (qList.length) {
          const waiting = qList.filter(q=>(q.Status||'').toLowerCase()==='waiting').length;
          const inChair = qList.filter(q=>(q.Status||'').toLowerCase()==='in chair').length;
          const done    = qList.filter(q=>(q.Status||'').toLowerCase()==='done').length;
          queueSummary = `🪑 **Queue:** ${waiting} waiting` + (inChair ? `, ${inChair} in chair` : '') + (done ? `, ${done} done` : '') + ` (${qList.length} total)`;
        } else {
          queueSummary = '🪑 **Queue:** Empty — no patients yet';
        }
      }
    } catch(e) { queueSummary = '🪑 Queue data unavailable'; }

    // Today's appointments
    const appts = (staffCtx.appointments||[]).filter(a => String(a.Date||a.date||'').slice(0,10) === todayStr);
    const apptSummary = appts.length
      ? `📅 **Appointments:** ${appts.length} today` + (appts.length <= 4 ? ' — ' + appts.map(a=>(a.Time||'?')+' '+((a.Name||a.name||'').split(' ')[0]||'Patient')).join(', ') : '')
      : '📅 **Appointments:** None scheduled today';

    // Low stock
    const inv = staffCtx.inventory || [];
    const lowStock = inv.filter(i => Number(i.stock||0) <= Number(i.minStock||i.min||5));
    const invSummary = lowStock.length
      ? `📦 **Low stock:** ${lowStock.length} item${lowStock.length>1?'s':''} — ${lowStock.slice(0,3).map(i=>i.name+' ('+i.stock+')').join(', ')}${lowStock.length>3?' +' + (lowStock.length-3) + ' more':''}`
      : '📦 **Inventory:** All stocked';

    // Patients count
    const patCount = (staffCtx.patients||[]).length;

    el.innerHTML = md(
      `**Good ${new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, ${staffCtx.name.split(' ')[0]}** 🏥 ${todayTime}\n\n` +
      queueSummary + '\n' +
      apptSummary + '\n' +
      invSummary + '\n' +
      `👥 **Patients:** ${patCount} registered\n\n` +
      `Ask me anything — lookups, queue, appointments, supplies.`
    );
    if (sub) sub.textContent = 'Staff mode · ' + staffCtx.name + ' · Ready';
    showChips(true);
  }

  /* ── Handle write actions from staff bot ── */
  async function handleStaffAction(rawText, bubble) {
    // Extract JSON with balanced braces (handles nested objects like items:[{...}])
    const _jsonStart = rawText.indexOf('{"QDC_ACTION"');
    if (_jsonStart < 0) return false;
    let _depth = 0, _jsonEnd = -1;
    for (let _ji = _jsonStart; _ji < rawText.length; _ji++) {
      if (rawText[_ji] === '{') _depth++;
      else if (rawText[_ji] === '}') { _depth--; if (_depth === 0) { _jsonEnd = _ji + 1; break; } }
    }
    if (_jsonEnd < 0) return false;
    const actionMatch = [rawText.slice(_jsonStart, _jsonEnd)];
    try {
      const act   = JSON.parse(actionMatch[0]);
      // Strip raw JSON from bubble — show only the natural language part
      const _cleanText = rawText.replace(actionMatch[0], '').replace(/```json|```/g, '').trim();
      // Always clear raw JSON from bubble immediately (before async work)
      bubble.innerHTML = _cleanText ? md(_cleanText) : '<em style="color:var(--text3);font-size:.88rem">⌛ Processing…</em>';
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if (!proxy) return false;
      let url = '', successMsg = '';

      if (act.QDC_ACTION === 'addQueue') {
        const params = new URLSearchParams({ action:'addQueue', name: act.patientName, id: act.patientId||'', dept: act.dept||'General', status: act.status||'Waiting', date: new Date().toISOString().slice(0,10) });
        url = proxy + '&' + params;
        successMsg = `✅ **${act.patientName}** added to today's queue as **${act.status||'Waiting'}**`;
        // Auto-refresh queue panel if visible
        setTimeout(()=>{ if(window.QDC_staff && QDC_staff._loadQueue) QDC_staff._loadQueue(); }, 800);
      } else if (act.QDC_ACTION === 'updateQueue') {
        const params = new URLSearchParams({ action:'updateQueueStatus', name: act.patientName, status: act.status, date: new Date().toISOString().slice(0,10) });
        url = proxy + '&' + params;
        successMsg = `✅ Queue updated — **${act.patientName}** marked as **${act.status}**`;
      } else if (act.QDC_ACTION === 'sendWA') {
        // Show confirmation bubble first — don't send yet
        bubble.innerHTML = md(
          `**📱 WhatsApp — Send confirmation**\n\n` +
          `**To:** ${act.patientName} (${act.phone})\n\n` +
          `**Message:**\n${act.message}\n\n` +
          `<span style="color:#64748b;font-size:.85em">Tap **Send** to confirm or **Cancel** to abort.</span>`
        );
        const btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        const actJson = JSON.stringify(act);
        const sendBtn = document.createElement('button');
        sendBtn.textContent = '✓ Send';
        sendBtn.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        sendBtn.onclick = () => qdcChat._confirmWA(act, btns);
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕ Cancel';
        cancelBtn.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        cancelBtn.onclick = () => { btns.parentElement.querySelector('span[style*="color:#64748b"]').textContent = 'Cancelled.'; btns.remove(); };
        btns.appendChild(sendBtn); btns.appendChild(cancelBtn);
        bubble.appendChild(btns);
        bubble.classList.remove('streaming');
        busy = false; $('qdc-send').disabled = false; $('qdc-inp')?.focus();
        return; // Don't go through normal action flow
      } else if (act.QDC_ACTION === 'broadcastWA') {
        const bTarget  = act.target || 'today';
        const bMsg     = act.message || '';
        const q2       = window.__QDC || {};
        const inst2    = q2.GREEN_API_INSTANCE || '';
        const tok2     = q2.GREEN_API_TOKEN    || '';

        bubble.innerHTML = md('⌛ Resolving recipients…');
        try {
          let recipients = []; // [{name, phone}]

          if (bTarget === 'queue' || bTarget === 'today') {
            // Fetch today's queue
            const today = new Date().toISOString().slice(0,10);
            const qR = await fetch(proxy + '&action=getQueue&date=' + today + _hp());
            const qD = await qR.json().catch(()=>[]);
            const qList = Array.isArray(qD) ? qD : [];
            // Resolve phones from staffCtx.patients
            qList.forEach(q => {
              const name = q.Name || q.name || '';
              const pid  = String(q.PatientID || q.id || '').toLowerCase();
              const found = (staffCtx.patients||[]).find(p =>
                (p.PatientID||p.id||'').toLowerCase() === pid ||
                (p.Name||p.name||'').toLowerCase() === name.toLowerCase()
              );
              const raw = found ? String(found.Phone||found.phone||'').replace(/\D/g,'') : '';
              const norm = raw.startsWith('0') ? '880'+raw.slice(1) : raw.startsWith('880') ? raw : raw ? '880'+raw : '';
              if (norm.length >= 11) recipients.push({ name, phone: norm });
            });
          } else {
            // 'all' — use staffCtx.patients directly (last 200 loaded)
            (staffCtx.patients||[]).forEach(p => {
              const raw = String(p.Phone||p.phone||'').replace(/\D/g,'');
              const norm = raw.startsWith('0') ? '880'+raw.slice(1) : raw.startsWith('880') ? raw : raw ? '880'+raw : '';
              if (norm.length >= 11) recipients.push({ name: p.Name||p.name||'Patient', phone: norm });
            });
          }

          // Deduplicate by phone
          const seen = new Set();
          recipients = recipients.filter(r => { if(seen.has(r.phone)) return false; seen.add(r.phone); return true; });

          if (!recipients.length) { bubble.innerHTML = md('No recipients with phone numbers found.'); bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus(); return true; }

          // Preview
          const preview = bMsg.length > 120 ? bMsg.slice(0,120)+'…' : bMsg;
          bubble.innerHTML = md(
            `**📢 Broadcast WhatsApp — Confirm**\n\n` +
            `**Recipients:** ${recipients.length} patient${recipients.length>1?'s':''} (${bTarget})\n` +
            `**Sample:** ${recipients.slice(0,3).map(r=>r.name).join(', ')}${recipients.length>3?' +'+( recipients.length-3)+' more':''}\n\n` +
            `**Message preview:**\n${preview}`
          );
          const bBtns = document.createElement('div');
          bBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center';
          const bSend = document.createElement('button');
          bSend.textContent = `📤 Send to ${recipients.length}`;
          bSend.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
          const bCancel = document.createElement('button');
          bCancel.textContent = '✕ Cancel';
          bCancel.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
          const bProgress = document.createElement('span');
          bProgress.style.cssText = 'font-size:.8rem;color:#64748b';
          bCancel.onclick = () => { bBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
          bSend.onclick = async () => {
            bSend.disabled = true; bCancel.disabled = true;
            bBtns.appendChild(bProgress);
            let sent = 0, failed = 0;
            for (const rec of recipients) {
              const personalMsg = bMsg.replace(/\{\{name\}\}/gi, rec.name);
              try {
                const r = await window._waSendChat(rec.phone+'@c.us', personalMsg);
                const d = await r.json();
                d.idMessage ? sent++ : failed++;
              } catch(e){ failed++; }
              bProgress.textContent = `Sending… ${sent+failed}/${recipients.length}`;
              await new Promise(res => setTimeout(res, 800)); // ~75/min, well under Green API limit
            }
            bBtns.innerHTML = `<em style="color:#22c55e;font-size:.85rem">✅ Sent: ${sent} · Failed: ${failed}</em>`;
          };
          bBtns.appendChild(bSend); bBtns.appendChild(bCancel);
          bubble.appendChild(bBtns);
        } catch(e) { bubble.innerHTML = md('⚠ Broadcast failed: '+e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'notifyPatient') {
        // Same confirm-card pattern as sendWA but labelled as patient notification
        const npPhone = String(act.phone||'').replace(/\D/g,'');
        const npNorm  = npPhone.startsWith('0') ? '880'+npPhone.slice(1) : npPhone.startsWith('880') ? npPhone : '880'+npPhone;
        bubble.innerHTML = md(
          `**📱 Notify Patient — Confirm**\n\n` +
          `**To:** ${act.patientName||'Patient'} (${act.phone})\n\n` +
          `**Message:**\n${act.message}`
        );
        const npBtns = document.createElement('div');
        npBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        const npSend = document.createElement('button');
        npSend.textContent = '✓ Send';
        npSend.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        const npCancel = document.createElement('button');
        npCancel.textContent = '✕ Cancel';
        npCancel.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        npCancel.onclick = () => { npBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        npSend.onclick = async () => {
          npBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Sending…</em>';
          const q2 = window.__QDC||{};
          try {
            const r = await window._waSendChat(npNorm+'@c.us', act.message);
            const d = await r.json();
            npBtns.innerHTML = d.idMessage
              ? `<em style="color:#22c55e;font-size:.85rem">✅ Message sent to ${act.patientName||'patient'}.</em>`
              : `<em style="color:#ef4444;font-size:.85rem">⚠ Send failed.</em>`;
          } catch(e){ npBtns.innerHTML = `<em style="color:#ef4444;font-size:.85rem">⚠ ${e.message}</em>`; }
        };
        npBtns.appendChild(npSend); npBtns.appendChild(npCancel); bubble.appendChild(npBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'callNextPatient') {
        // Auto mode: fetch queue and find first Waiting patient
        if (act.auto) {
          bubble.innerHTML = md('⌛ Finding next patient in queue…');
          try {
            const today = new Date().toISOString().slice(0,10);
            const qR = await fetch(proxy + '&action=getQueue&date=' + today + _hp());
            const qD = await qR.json().catch(()=>[]);
            const next = Array.isArray(qD) ? qD.find(p=>(p.Status||p.status||'').toLowerCase()==='waiting') : null;
            if (!next) { bubble.innerHTML = md('No waiting patients in queue right now.'); bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus(); return true; }
            act.patientName = next.Name || next.name || '';
            // Resolve phone from staffCtx.patients
            const pid = String(next.PatientID || next.id || '').toLowerCase();
            const found = (staffCtx.patients||[]).find(p=>(p.PatientID||p.id||'').toLowerCase()===pid || (p.Name||p.name||'').toLowerCase()===(act.patientName||'').toLowerCase());
            act.phone = found ? String(found.Phone||found.phone||'').replace(/\D/g,'') : '';
          } catch(e) { bubble.innerHTML = md('⚠ Could not fetch queue: '+e.message); bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus(); return true; }
        }

        // Mark patient as In Chair + send "you're next" WhatsApp
        const cnPhone = String(act.phone||'').replace(/\D/g,'');
        const cnNorm  = cnPhone.startsWith('0') ? '880'+cnPhone.slice(1) : cnPhone.startsWith('880') ? cnPhone : '880'+cnPhone;
        const cnName  = act.patientName || 'Patient';
        const cnMsg   = `🦷 *Quick Dental Care*\n\nDear ${cnName}, you are next! Please come to the reception now.\n\n📍 Akhalia, Sylhet`;

        bubble.innerHTML = md(`**📢 Call Next Patient — Confirm**\n\n- **Patient:** ${cnName}\n- **Action:** Mark as *In Chair* + send WhatsApp "you're next"\n${cnNorm ? '- **Phone:** '+act.phone : '_No phone — queue update only_'}`);
        const cnBtns = document.createElement('div');
        cnBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        const cnYes = document.createElement('button');
        cnYes.textContent = '📢 Call In';
        cnYes.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        const cnNo = document.createElement('button');
        cnNo.textContent = '✕ Cancel';
        cnNo.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        cnNo.onclick = () => { cnBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        cnYes.onclick = async () => {
          cnBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Updating…</em>';
          const q2 = window.__QDC||{};
          const results = [];
          try {
            // 1. Update queue status to In Chair — GAS expects 'name' not 'patientName'
            const qParams = new URLSearchParams({ action:'updateQueueStatus', name: cnName, status:'In Chair', date: new Date().toISOString().slice(0,10) });
            const qRes = await fetch((q2.SHEETS_PROXY||proxy) + '&' + qParams);
            const qD = await qRes.json().catch(()=>({}));
            results.push(qD.ok !== false ? '✅ Marked *In Chair*' : '⚠ Queue update failed');
            setTimeout(()=>{ if(window.QDC_staff?._loadQueue) QDC_staff._loadQueue(); }, 800);
          } catch(e){ results.push('⚠ Queue: '+e.message); }
          // 2. Send WA only if we have a real phone (more than just prefix)
          if (cnPhone.length > 6) {
            try {
              const r = await window._waSendChat(cnNorm+'@c.us', cnMsg);
              const d = await r.json();
              results.push(d.idMessage ? '✅ WhatsApp sent' : '⚠ WA send failed');
            } catch(e){ results.push('⚠ WA: '+e.message); }
          } else {
            results.push('_No phone — WA skipped_');
          }
          cnBtns.innerHTML = `<em style="color:#22c55e;font-size:.85rem">${results.join(' · ')}</em>`;
        };
        cnBtns.appendChild(cnYes); cnBtns.appendChild(cnNo); bubble.appendChild(cnBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getPrescriptions') {
        bubble.innerHTML = md('⌛ Fetching prescriptions for **' + (act.patientName||act.patientId) + '**…');
        try {
          // Resolve name→ID if patientId missing
          let rxPid = act.patientId || '';
          if (!rxPid && act.patientName && staffCtx.patients && staffCtx.patients.length) {
            const nq = act.patientName.toLowerCase();
            const found = staffCtx.patients.find(p => (p.Name||p.name||'').toLowerCase().includes(nq) || (p.PatientID||p.id||'').toLowerCase() === nq);
            if (found) rxPid = found.PatientID || found.id || '';
          }
          const pRes = await fetch(proxy + '&action=getPatientFiles&patientId=' + encodeURIComponent(rxPid) + _hp());
          const pData = await pRes.json().catch(()=>({}));
          const rxList = pData.prescriptions || [];
          if (!rxList.length) {
            bubble.innerHTML = md('No prescriptions found for **' + (act.patientName||act.patientId) + '**.');
          } else {
            // Sort newest first
            rxList.sort((a,b) => (b.date||'').localeCompare(a.date||''));
            const rows = rxList.map((r,i) =>
              (i===0 ? '**Latest:** ' : '') +
              '**' + (r.date||'—') + '** — ' +
              (r.tx||r.dx||'Treatment record') +
              (r.dx ? ' (' + r.dx + ')' : '') +
              (r.url ? ' [📄 View PDF](' + r.url + ')' : '')
            ).join('\n');
            const rxHeader = '**Prescriptions \u2014 ' + (act.patientName||act.patientId) + '** (' + rxList.length + ' records)';
            bubble.innerHTML = md(rxHeader + '\n\n' + rows);
          }
        } catch(e) { bubble.innerHTML = md('⚠ Could not fetch prescriptions: ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return;
      } else if (act.QDC_ACTION === 'getBilling') {
        bubble.innerHTML = md('⌛ Fetching billing for **' + (act.patientName||act.patientId) + '**…');
        try {
          const bRes = await fetch(proxy + '&action=getInvoices&patientId=' + encodeURIComponent(act.patientId||'') + '&name=' + encodeURIComponent(act.patientName||'') + _hp());
          const raw  = await bRes.json().catch(()=>[]);
          const list = Array.isArray(raw) ? raw : (raw.invoices||raw.rows||[]);
          if (!list.length) {
            bubble.innerHTML = md('No billing records found for **' + (act.patientName||act.patientId) + '**.');
          } else {
            const total = list.reduce((s,b)=>s+(parseFloat(b.Amount||b.amount||b.Total||b.total||0)),0);
            const rows  = list.slice(-10).map(b=>'- **'+(b.Date||b.date||'—')+'** · '+(b.Treatment||b.treatment||b.Description||b.description||'—')+' · ৳'+(b.Amount||b.amount||b.Total||b.total||'—')).join('\n');
            bubble.innerHTML = md('**Billing — '+(act.patientName||act.patientId)+'**\n\n'+rows+'\n\n**Total: ৳'+total.toLocaleString()+'** ('+list.length+' records)');
          }
        } catch(e) { bubble.innerHTML = md('⚠ Billing fetch failed: ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return;
      } else if (act.QDC_ACTION === 'addNote') {
        const params = new URLSearchParams({ action:'addNote', patientId: act.patientId, note: act.note, staffId: staffCtx.name, type:'general' });
        url = proxy + '&' + params;
        successMsg = `✅ Note added to patient **${act.patientId}**`;
      } else if (act.QDC_ACTION === 'updateAppt') {
        const params = new URLSearchParams({ action:'updateAppointment', apptId: act.apptId, field: act.field, value: act.value });
        url = proxy + '&' + params;
        successMsg = `✅ Appointment **${act.apptId}** updated`;
      } else if (act.QDC_ACTION === 'addAppointment') {
        // Show confirmation card before writing
        bubble.innerHTML = md(
          '**📅 Book Appointment — Confirm**\n\n' +
          '- **Patient:** ' + (act.patientName||act.patientId) + '\n' +
          '- **Date:** ' + (act.date||'—') + '\n' +
          '- **Time:** ' + (act.time||'—') + '\n' +
          '- **Treatment:** ' + (act.treatment||'General') + '\n' +
          (act.notes ? '- **Notes:** ' + act.notes + '\n' : '')
        );
        const apptBtns = document.createElement('div');
        apptBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        const apptYes = document.createElement('button');
        apptYes.textContent = '✓ Book';
        apptYes.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        const apptNo  = document.createElement('button');
        apptNo.textContent  = '✕ Cancel';
        apptNo.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        apptNo.onclick  = () => { apptBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        apptYes.onclick = async () => {
          apptBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Booking…</em>';
          try {
            const p = new URLSearchParams({ action:'addAppointment', patientId:act.patientId||'', name:act.patientName||'', date:act.date||'', time:act.time||'', treatment:act.treatment||'', notes:act.notes||'', staffName:staffCtx.name });
            const r2 = await fetch(proxy + '&' + p + _hp());
            const d2 = await r2.json().catch(()=>({}));
            if (d2.ok === false) throw new Error(d2.error||'Failed');
            bubble.innerHTML = md('✅ Appointment booked for **' + (act.patientName||act.patientId) + '** on **' + act.date + '** at **' + act.time + '**');
            dataLoaded = false; loadStaffData();
          } catch(e2) { apptBtns.innerHTML = '<em style="color:#ef4444;font-size:.85rem">⚠ ' + e2.message + '</em>'; }
        };
        apptBtns.appendChild(apptYes); apptBtns.appendChild(apptNo);
        bubble.appendChild(apptBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'addExpense') {
        bubble.innerHTML = md(
          '**💸 Add Expense — Confirm**\n\n' +
          '- **Description:** ' + (act.description||'—') + '\n' +
          '- **Amount:** ৳' + (act.amount||0) + '\n' +
          '- **Category:** ' + (act.category||'Staff Expense')
        );
        const expBtns = document.createElement('div');
        expBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        const expYes = document.createElement('button');
        expYes.textContent = '✓ Add';
        expYes.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        const expNo = document.createElement('button');
        expNo.textContent  = '✕ Cancel';
        expNo.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        expNo.onclick  = () => { expBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        expYes.onclick = async () => {
          expBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Saving…</em>';
          try {
            const today = new Date().toISOString().slice(0,10);
            const p = new URLSearchParams({ action:'addExpense', date:today, staff:staffCtx.name, category:act.category||'Staff Expense', description:act.description||'', amount:act.amount||0 });
            const r2 = await fetch(proxy + '&' + p + _hp());
            const d2 = await r2.json().catch(()=>({}));
            if (d2.ok === false) throw new Error(d2.error||'Failed');
            bubble.innerHTML = md('✅ Expense recorded — **' + (act.description||'') + '** ৳' + (act.amount||0));
          } catch(e2) { expBtns.innerHTML = '<em style="color:#ef4444;font-size:.85rem">⚠ ' + e2.message + '</em>'; }
        };
        expBtns.appendChild(expYes); expBtns.appendChild(expNo);
        bubble.appendChild(expBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getAppointments') {
        bubble.innerHTML = md('⌛ Fetching appointments…');
        try {
          var apDate = act.date || new Date().toISOString().slice(0,10);
          var apR = await fetch(proxy + '&action=getAppointments&start=' + apDate + '&end=' + apDate + _hp());
          var apD = await apR.json().catch(function(){return [];});
          var apList = Array.isArray(apD) ? apD : [];
          if (act.patientName) {
            var apq = act.patientName.toLowerCase();
            apList = apList.filter(function(a){return (a.Name||a.name||a.PatientID||'').toLowerCase().includes(apq);});
          }
          if (!apList.length) {
            bubble.innerHTML = md('No appointments found for ' + apDate + (act.patientName ? ' matching **' + act.patientName + '**' : '') + '.');
          } else {
            var apOut = '**Appointments \u2014 ' + apDate + '** (' + apList.length + ')\n\n';
            apOut += apList.map(function(a){
              return '- **' + (a.Time||a.time||'—') + '** ' + (a.Name||a.name||'Patient') + ' — ' + (a.Treatment||a.treatment||'Visit') + (a.Status?' ['+a.Status+']':'');
            }).join('\n');
            bubble.innerHTML = md(apOut);
          }
        } catch(e) { bubble.innerHTML = md('⚠ ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getInventory') {
        var invAll = staffCtx.inventory || [];
        if (!invAll.length) {
          bubble.innerHTML = md('No inventory data loaded. Please sync and try again.');
        } else {
          var invOut = invAll.filter(function(i){return Number(i.stock||0)===0;});
          var invLow = invAll.filter(function(i){var s=Number(i.stock||0),mn=Number(i.minStock||i.min||5);return s>0&&s<=mn;});
          var invOk  = invAll.filter(function(i){var s=Number(i.stock||0),mn=Number(i.minStock||i.min||5);return s>mn;});
          var invOut2 = '**Out of Stock (' + invOut.length + '):**\n' + (invOut.length ? invOut.map(function(i){return '- ' + i.name + ' (' + (i.category||'') + ')';}).join('\n') : '_None_');
          var invLow2 = '**Low Stock (' + invLow.length + '):**\n' + (invLow.length ? invLow.map(function(i){return '- ' + i.name + ': ' + i.stock + ' left (min ' + (i.minStock||i.min||5) + ')';}).join('\n') : '_None_');
          var invOk2  = '**In Stock: ' + invOk.length + ' items**';
          bubble.innerHTML = md('**Inventory Status**\n\n' + invOut2 + '\n\n' + invLow2 + '\n\n' + invOk2);
        }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'updateInventory') {
        var invProxy = proxy;
        var invParams = new URLSearchParams({ action:'updateInventory', id:act.id||'', op:act.op||'use', qty:act.qty||1 });
        var invR = await fetch(invProxy + '&' + invParams + _hp());
        var invD = await invR.json().catch(function(){return {};});
        if (invD.ok === false) { throw new Error(invD.error||'Update failed'); }
        // Refresh local inventory
        var freshInv = await fetch(invProxy + '&action=getInventory' + _hp());
        staffCtx.inventory = await freshInv.json().catch(function(){return staffCtx.inventory||[];});
        bubble.innerHTML = md('✅ Inventory updated — **' + (act.id||act.name||'item') + '** ' + (act.op==='restock'?'restocked by':'used') + ' ' + (act.qty||1));
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'removeInventory') {
        bubble.innerHTML = md('**Remove Inventory Item -- Confirm**\n\n- **Item:** ' + (act.name||act.id));
        var remBtns = document.createElement('div');
        remBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        var remYes = document.createElement('button');
        remYes.textContent = '✓ Remove';
        remYes.style.cssText = 'background:#ef4444;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        var remNo = document.createElement('button');
        remNo.textContent = '✕ Cancel';
        remNo.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        remNo.onclick = function(){ remBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        remYes.onclick = async function(){
          remBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Removing…</em>';
          try {
            var rp = new URLSearchParams({ action:'updateInventory', id:act.id||'', op:'delete' });
            var rr = await fetch(proxy + '&' + rp + _hp());
            var rd = await rr.json().catch(function(){return {};});
            if (rd.ok === false) { throw new Error(rd.error||'Failed'); }
            staffCtx.inventory = staffCtx.inventory.filter(function(i){return i.id !== act.id;});
            bubble.innerHTML = md('✅ **' + (act.name||act.id) + '** removed from inventory.');
          } catch(e2){ remBtns.innerHTML = '<em style="color:#ef4444;font-size:.85rem">⚠ ' + e2.message + '</em>'; }
        };
        remBtns.appendChild(remYes); remBtns.appendChild(remNo);
        bubble.appendChild(remBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getQueue') {
        bubble.innerHTML = md('⌛ Fetching today\'s queue…');
        try {
          const today = new Date().toISOString().slice(0,10);
          const qDate = act.date || today;
          const qR = await fetch(proxy + '&action=getQueue&date=' + encodeURIComponent(qDate) + _hp());
          const qD = await qR.json().catch(function(){return [];});
          const qList = Array.isArray(qD) ? qD : [];
          if (!qList.length) {
            bubble.innerHTML = md('No patients in the queue for **' + qDate + '**.');
          } else {
            const waiting  = qList.filter(function(q){return (q.Status||q.status||'').toLowerCase()==='waiting';});
            const inChair  = qList.filter(function(q){return (q.Status||q.status||'').toLowerCase()==='in chair';});
            const done     = qList.filter(function(q){return (q.Status||q.status||'').toLowerCase()==='done';});
            let out = '**Queue — ' + qDate + '** (' + qList.length + ' total)\n\n';
            if (inChair.length) out += '**🪑 In Chair:**\n' + inChair.map(function(q){return '- ' + (q.Token||q.token||'#?') + ' · ' + (q.Name||q.name||'Patient') + ' — ' + (q.Dept||q.dept||'General');}).join('\n') + '\n\n';
            if (waiting.length) out += '**⏳ Waiting (' + waiting.length + '):**\n' + waiting.map(function(q){return '- ' + (q.Token||q.token||'#?') + ' · ' + (q.Name||q.name||'Patient') + ' — ' + (q.Dept||q.dept||'General');}).join('\n') + '\n\n';
            if (done.length)    out += '**✅ Done:** ' + done.length + ' patient(s)';
            bubble.innerHTML = md(out);
          }
        } catch(e) { bubble.innerHTML = md('⚠ Could not fetch queue: ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getHistory') {
        bubble.innerHTML = md('⌛ Fetching history for **' + (act.patientName||act.patientId) + '**…');
        try {
          let rxPid = act.patientId || '';
          if (!rxPid && act.patientName && staffCtx.patients?.length) {
            const nq = act.patientName.toLowerCase();
            const found = staffCtx.patients.find(p => (p.Name||p.name||'').toLowerCase().includes(nq));
            if (found) rxPid = found.PatientID || found.id || '';
          }
          const [rxResp, apptResp, billResp] = await Promise.all([
            fetch(proxy + '&action=getPatientFiles&patientId=' + encodeURIComponent(rxPid) + _hp()),
            fetch(proxy + '&action=getAppointments&start=2020-01-01&end=' + new Date().toISOString().slice(0,10) + _hp()),
            fetch(proxy + '&action=getPatientSummary&patientId=' + encodeURIComponent(rxPid) + _hp()),
          ]);
          const rxData   = await rxResp.json().catch(()=>({}));
          const apptData = await apptResp.json().catch(()=>([]));
          const billData = await billResp.json().catch(()=>({}));
          const rxList   = (rxData.prescriptions||[]).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
          const patAppts = Array.isArray(apptData) ? apptData.filter(a=>String(a.PatientID||a.patientId||'').toLowerCase()===rxPid.toLowerCase()).slice(0,5) : [];
          const invList  = (billData.invoices||[]).slice(0,5);
          let out = '**Patient History — ' + (act.patientName||rxPid) + '**\n\n';
          if (rxList.length) {
            out += '**Prescriptions/Treatments:**\n' + rxList.slice(0,5).map(r=>'- ' + (r.date||'—') + ': ' + (r.tx||r.dx||'Record')).join('\n') + '\n\n';
          }
          if (patAppts.length) {
            out += '**Past Appointments:**\n' + patAppts.map(a=>'- ' + (a.Date||a.date||'—') + ' ' + (a.Time||a.time||'') + ': ' + (a.Treatment||a.treatment||'Visit')).join('\n') + '\n\n';
          }
          if (invList.length) {
            out += '**Billing:**\n' + invList.map(i=>'- ' + (i.date||'—') + ': ' + (i.treatments||'—') + ' — ৳' + (i.total||0)).join('\n');
          }
          if (!rxList.length && !patAppts.length && !invList.length) out += '_No records found._';
          bubble.innerHTML = md(out);
        } catch(e) { bubble.innerHTML = md('⚠ Could not fetch history: ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'getPerformance') {
        bubble.innerHTML = md('⌛ Fetching clinic performance…');
        try {
          const end   = new Date().toISOString().slice(0,10);
          const start = new Date(Date.now()-30*24*3600*1000).toISOString().slice(0,10);
          const [revResp, qResp] = await Promise.all([
            fetch(proxy + '&action=getRevenue&start=' + start + '&end=' + end + _hp()),
            fetch(proxy + '&action=getQueue&date=' + end + _hp()),
          ]);
          const rev = await revResp.json().catch(()=>({}));
          const q   = await qResp.json().catch(()=>([]));
          const fmt = n => '৳' + Math.round(Number(n)||0).toLocaleString();
          let out = '**Clinic Performance — Last 30 Days**\n\n';
          out += '- **Revenue:** ' + fmt(rev.income||0) + '\n';
          out += '- **Expenses:** ' + fmt(rev.expenses||0) + '\n';
          out += '- **Profit:** ' + fmt(rev.profit||0) + '\n';
          out += '- **Today\'s Queue:** ' + (Array.isArray(q)?q.length:0) + ' patients\n\n';
          if (rev.incomeByType && Object.keys(rev.incomeByType).length) {
            const top = Object.entries(rev.incomeByType).sort((a,b)=>b[1]-a[1]).slice(0,4);
            out += '**Top Treatments:**\n' + top.map(([k,v])=>'- ' + k + ': ' + fmt(v)).join('\n');
          }
          bubble.innerHTML = md(out);
        } catch(e) { bubble.innerHTML = md('⚠ ' + e.message); }
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'requestRestock') {
        const q2 = window.__QDC || {};
        const inst2 = q2.GREEN_API_INSTANCE || '';
        const tok2  = q2.GREEN_API_TOKEN  || '';
        const mgr2  = '8801930317225';
        const item2 = act.itemName || 'item';
        const qty2  = act.qty ? ' (qty: ' + act.qty + ')' : '';
        const note2 = act.note ? '\nNote: ' + act.note : '';
        const waMsg2 = '📦 *Restock Request — QDC*\n\nItem: *' + item2 + '*' + qty2 + note2 + '\nRequested by: ' + staffCtx.name + '\n\n📍 Quick Dental Care, Akhalia, Sylhet';
        bubble.innerHTML = md('**📦 Restock Request — Confirm**\n\n- **Item:** ' + item2 + (act.qty ? '\n- **Qty:** ' + act.qty : '') + (act.note ? '\n- **Note:** ' + act.note : '') + '\n\nSend to manager via WhatsApp?');
        var rstBtns2 = document.createElement('div');
        rstBtns2.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        var rstYes2 = document.createElement('button');
        rstYes2.textContent = '📩 Send Request';
        rstYes2.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        var rstNo2 = document.createElement('button');
        rstNo2.textContent = '✕ Cancel';
        rstNo2.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        rstNo2.onclick = function(){ rstBtns2.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        rstYes2.onclick = async function(){
          rstBtns2.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Sending…</em>';
          try {
            var rr2 = await window._waSendChat(mgr2 + '@c.us', waMsg2);
            var dd2 = await rr2.json();
            rstBtns2.innerHTML = dd2.idMessage ? '<em style="color:#22c55e;font-size:.85rem">✅ Restock request sent to manager.</em>' : '<em style="color:#ef4444;font-size:.85rem">⚠ Send failed.</em>';
          } catch(e3){ rstBtns2.innerHTML = '<em style="color:#ef4444;font-size:.85rem">⚠ ' + e3.message + '</em>'; }
        };
        rstBtns2.appendChild(rstYes2); rstBtns2.appendChild(rstNo2); bubble.appendChild(rstBtns2);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else if (act.QDC_ACTION === 'requestSupplies') {
        // Request multiple supplies — adds to Requests sheet + WA to manager
        var items3 = act.items || [];
        if (!items3.length && act.itemName) items3 = [{name:act.itemName, qty:act.qty||1}];
        var urgency3 = act.urgency || 'normal';
        var note3 = act.note || '';
        var itemList3 = items3.map(function(i){ return '• ' + (i.name||'item') + (i.qty ? ' ×' + i.qty : ''); }).join('\n');
        bubble.innerHTML = md(
          '**📦 Supply Request — Confirm**\n\n' +
          itemList3 + '\n' +
          (urgency3==='urgent' ? '\n🔴 **URGENT**\n' : '') +
          (note3 ? '\n**Note:** ' + note3 + '\n' : '') +
          '\nThis will add to the requests log and notify the manager via WhatsApp.'
        );
        var supBtns = document.createElement('div');
        supBtns.style.cssText = 'display:flex;gap:8px;margin-top:10px';
        var supYes = document.createElement('button');
        supYes.textContent = '📩 Submit Request';
        supYes.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        var supNo = document.createElement('button');
        supNo.textContent = '✕ Cancel';
        supNo.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:.85rem';
        supNo.onclick = function(){ supBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">Cancelled.</em>'; };
        supYes.onclick = async function(){
          supBtns.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Submitting…</em>';
          var results3 = [];
          try {
            // 1. Add each item to Requests sheet via GAS
            for (var si=0; si<items3.length; si++) {
              var rp3 = new URLSearchParams({ action:'addRequest', item:items3[si].name||'', qty:items3[si].qty||1, unit:'pcs', priority:urgency3==='urgent'?'Urgent':'Normal', notes:note3, staffId:staffCtx.name });
              await fetch(proxy + '&' + rp3 + _hp());
            }
            results3.push('✅ ' + items3.length + ' item(s) logged');
            // 2. Send WA to manager
            var waItems3 = items3.map(function(i){ return '• ' + (i.name||'item') + (i.qty ? ' ×' + i.qty : ''); }).join('\n');
            var waMsg3 = '📦 *Supply Request — QDC*\n\n' + waItems3 + (urgency3==='urgent'?'\n\n🔴 URGENT':'') + (note3?'\nNote: '+note3:'') + '\n\nRequested by: ' + staffCtx.name + '\n📍 Quick Dental Care, Akhalia, Sylhet';
            var mgr3 = '8801930317225';
            var wr3 = await window._waSendChat(mgr3 + '@c.us', waMsg3);
            var wd3 = await wr3.json();
            results3.push(wd3.idMessage ? '✅ Manager notified' : '⚠ WA failed');
          } catch(e3){ results3.push('⚠ ' + e3.message); }
          supBtns.innerHTML = '<em style="color:#22c55e;font-size:.85rem">' + results3.join(' · ') + '</em>';
        };
        supBtns.appendChild(supYes); supBtns.appendChild(supNo); bubble.appendChild(supBtns);
        bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
        return true;

      } else {
        return false;
      }

      const r = await fetch(url + _hp());
      const d = await r.json().catch(() => ({}));
      if (d.ok === false) throw new Error(d.error || 'Server error');
      bubble.innerHTML = md(successMsg);
      // Refresh data silently
      dataLoaded = false;
      loadStaffData();
      return true;
    } catch(e) {
      // Clear raw JSON and show clean error
      const isAuth = /unauthorized|access denied|401/i.test(e.message||'');
      bubble.innerHTML = isAuth
        ? '<span style="color:var(--crimson)">⚠ Not authorized. Log in as staff with the correct role.</span>'
        : `<span style="color:var(--crimson)">⚠ Action failed: ${e.message||'Unknown error'}</span>`;
      bubble.classList.remove('streaming'); busy=false; $('qdc-send').disabled=false; $('qdc-inp')?.focus();
      return true;
    }
  }

  function handleBooking(rawText, bubble) {
    const bookMatch = rawText.match(/\{\s*"BOOK_APPOINTMENT"\s*:\s*true[^}]+\}/);
    if (!bookMatch) return false;
    try {
      const bk = JSON.parse(bookMatch[0]);

      // Show confirmation card — patient must confirm before WA is sent
      bubble.innerHTML = md(
        '**📅 Confirm Your Appointment Request**\n\n' +
        '- **Name:** ' + (bk.name || '—') + '\n' +
        '- **Phone:** ' + (bk.phone || '—') + '\n' +
        '- **Date/Time:** ' + (bk.datetime || '—') + '\n' +
        '- **Reason:** ' + (bk.reason || '—') + '\n\n' +
        'Please confirm — we will send you a WhatsApp confirmation and notify our team.'
      );

      const confirmBtn = document.createElement('div');
      confirmBtn.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap';

      const yesBtn = document.createElement('button');
      yesBtn.textContent = '✓ Confirm Appointment';
      yesBtn.style.cssText = 'background:#1a6fb5;color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:.9rem;font-weight:600';

      const noBtn = document.createElement('button');
      noBtn.textContent = '✕ Cancel';
      noBtn.style.cssText = 'background:#f1f5f9;border:1px solid #dde3ed;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:.9rem';

      noBtn.onclick = () => {
        confirmBtn.remove();
        bubble.innerHTML += '<br><em style="color:#64748b;font-size:.85rem">Appointment request cancelled.</em>';
      };

      yesBtn.onclick = () => {
        // Block if phone not collected
        if (!bk.phone || bk.phone === '—' || bk.phone.trim() === '') {
          confirmBtn.innerHTML = '<em style="color:#d03030">⚠ Phone number is required. Please go back and provide your phone number.</em>';
          return;
        }

        confirmBtn.innerHTML = '<em style="color:#64748b;font-size:.85rem">⌛ Sending confirmation…</em>';

        // Normalize patient phone
        const rawPat = String(bk.phone || '').replace(/\D/g, '');
        const patPhone = rawPat.startsWith('880') ? rawPat : rawPat.startsWith('0') ? '880' + rawPat.slice(1) : '880' + rawPat;

        const proxy = window.__QDC?.SHEETS_PROXY || '';
        const q2 = window.__QDC || {};
        const inst = '';
        const tok = '';

        const managerMsg = '🦷 *New Appointment (Chatbot)*\n' +
          'Name: ' + bk.name + '\n' +
          'Phone: ' + bk.phone + '\n' +
          'When: ' + bk.datetime + '\n' +
          'Reason: ' + bk.reason + '\nCall patient to confirm.';

        const patMsg = 'Quick Dental Care: আপনার অ্যাপয়েন্টমেন্ট অনুরোধ পাওয়া গেছে।\n' +
          'Appointment request received for ' + bk.datetime + '.\n' +
          'We will call ' + bk.phone + ' to confirm.\n' +
          'Quick Dental Care, Akhalia, Sylhet. ☎ 01307978439';

        const mgr = '8801930317225';

        // Send to manager via Green API directly (always works, no deployment needed)
        window._waSendChat(mgr + '@c.us', managerMsg).catch(()=>{});

        // Send to patient via Green API directly
        if (patPhone.length >= 12) {
          window._waSendChat(patPhone + '@c.us', patMsg).catch(()=>{});
        }

        // Also try via GAS proxy as backup (if deployed)
        if (proxy) {
          fetch(proxy + '&action=sendWhatsApp&phone=' + encodeURIComponent('01930317225') + '&message=' + encodeURIComponent(managerMsg) + _hp()).catch(()=>{});
        }

        // Update bubble to success state
        setTimeout(() => {
          confirmBtn.innerHTML = '';
          bubble.innerHTML = md(
            '**✅ Appointment Request Confirmed!**\n\n' +
            '- **Name:** ' + (bk.name || '—') + '\n' +
            '- **Phone:** ' + (bk.phone || '—') + '\n' +
            '- **Date/Time:** ' + (bk.datetime || '—') + '\n' +
            '- **Reason:** ' + (bk.reason || '—') + '\n\n' +
            'Our team will call **' + (bk.phone || 'you') + '** to confirm.\n' +
            'For urgent queries: **+88 01307978439**'
          );
        }, 1500);
      };

      confirmBtn.appendChild(yesBtn);
      confirmBtn.appendChild(noBtn);
      bubble.appendChild(confirmBtn);
      return true;
    } catch (_) { return false; }
  }

  /* ── Streaming fetch ── */
  async function streamReply(text) {
    busy = true; $('qdc-send').disabled = true;
    const bubble     = botBubble();
    let   rawText    = '';
    let   firstChunk = true;

    // Staff mode: use 2.0-flash for larger context window support + bigger output
    // Lazy-fetch URL with API key from GAS Script Property (v8.6+).
    let reqURL;
    try {
      reqURL = await _getURL();
    } catch (keyErr) {
      bubble.innerHTML = '⚠ Alisha is unavailable: API key not configured. Ask admin to set ALISHA_API_KEY in GAS Script Properties.';
      bubble.classList.remove('streaming');
      busy = false; $('qdc-send').disabled = false;
      return;
    }

    // Data should already be loaded at login — reload only if missing
    if (isStaff && !dataLoaded) {
      await loadStaffData();
    }

    const activeSYS = isStaff
      ? buildStaffSys(staffCtx.name, staffCtx.role, staffCtx.patients, staffCtx.appointments, history.length ? history[history.length-1]?.parts?.[0]?.text : '', msgCount)
      : _buildPublicSys(text);

    const maxTokens = isStaff ? 600 : 300;

    let res, lastErr;
    try {
      res = await fetch(reqURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: activeSYS }] },
          contents: history.slice(-4),
          generationConfig: { maxOutputTokens: maxTokens, temperature: isStaff ? 0.3 : 0.65, thinkingConfig: { thinkingBudget: 0 } }
        })
      });
      if (res.status === 429) {
        const errBody = await res.json().catch(()=>({}));
        const m = JSON.stringify(errBody).match(/retry in ([\d.]+)s/i);
        const wait = m ? Math.round(parseFloat(m[1])) : 30;
        bubble.innerHTML = `⏳ Rate limit reached. Please wait ${wait}s before sending again.`;
        bubble.classList.remove('streaming');
        busy = false; $('qdc-send').disabled = false; $('qdc-inp')?.focus();
        // Re-enable after wait
        $('qdc-send').disabled = true;
        setTimeout(() => { $('qdc-send').disabled = false; }, wait * 1000);
        return;
      }
    } catch(fetchErr) { lastErr = fetchErr; }

    try {
      if (!res) throw lastErr || new Error('fetch failed');

      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || 'HTTP ' + res.status);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buf     = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const chunk = JSON.parse(raw);
            const token = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (token) {
              if (firstChunk) { bubble.innerHTML = ''; firstChunk = false; }
              rawText += token;
              bubble.innerHTML = md(rawText);
              scroll();
            }
          } catch(_) {}
        }
      }

      if (buf.startsWith('data: ')) {
        try {
          const chunk = JSON.parse(buf.slice(6).trim());
          const token = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (token) { rawText += token; bubble.innerHTML = md(rawText); scroll(); }
        } catch(_) {}
      }

      if (!rawText) bubble.innerHTML = 'Sorry, no response. Please try again.';

      // Handle actions
      if (isStaff) {
        await handleStaffAction(rawText, bubble);
      } else {
        handleBooking(rawText, bubble);
      }

      const histText = isStaff ? rawText.replace(/PATIENTS\(\d+\):[^\n]*/g,'[data]').replace(/APPTS\(\d+\):[^\n]*/g,'[data]') : rawText;
      history.push({ role: 'model', parts: [{ text: histText }] });
      if (history.length > (isStaff ? 4 : 10)) history = history.slice(isStaff ? -4 : -10);
    } catch(err) {
      console.error('QDC chat:', err);
      const is404 = err.message && err.message.includes('404');
      const is429 = err.message && err.message.includes('429');
      const errMsg = isStaff
        ? 'Error: ' + err.message
        : is404 ? '⚠ AI service unavailable right now. Please call: <strong>+88 01307978439</strong>'
        : is429 ? '⚠ Too many requests — please wait a moment and try again.'
        : 'Sorry, something went wrong. Please call: <strong>+88 01307978439</strong>';
      bubble.innerHTML = errMsg;
    } finally {
      bubble.classList.remove('streaming');
      busy = false; $('qdc-send').disabled = false;
      $('qdc-inp')?.focus();
    }
  }

  /* ── Public API ── */
  window.qdcChat = {
    toggle() {
      isOpen = !isOpen;
      $('qdc-win').classList.toggle('open', isOpen);
      if (isOpen) {
        if (!$msgs().children.length) { msgCount = 0; welcome(); }
        setTimeout(() => $('qdc-inp')?.focus(), 280);
      }
    },
    key(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); } },
    resize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 86) + 'px'; },
    send() {
      const t = ($('qdc-inp')?.value || '').trim();
      if (!t || busy) return;
      $('qdc-inp').value = ''; this.resize($('qdc-inp'));
      this.sendText(t);
    },
    sendText(text) {
      if (busy) return;
      const now = Date.now();
      const elapsed = now - (window._qdcLastSend || 0);
      const minGap = 6000; // 6s between sends — respects 15 RPM free tier
      if (elapsed < minGap) {
        const wait = Math.ceil((minGap - elapsed) / 1000);
        const el = document.createElement('div');
        el.className = 'qm b';
        el.style.color = '#64748b';
        el.textContent = '⏳ Please wait ' + wait + 's before sending again.';
        $msgs().appendChild(el); scroll();
        return;
      }
      window._qdcLastSend = now;
      userMsg(text);
      history.push({ role: 'user', parts: [{ text }] });
      msgCount++;
      streamReply(text);
    },
    // Allow staff data refresh on demand
    refreshData() { dataLoaded = false; loadStaffData(); },
    async _confirmWA(act, btnContainer) {
      btnContainer.innerHTML = '<em style="color:#64748b;font-size:.85rem">Sending…</em>';
      try {
        const q = window.__QDC || {};
        let d = {};
          const waPhone = String(act.phone||'').replace(/\D/g,'');
          const waNorm = waPhone.startsWith('0') ? '880'+waPhone.slice(1) : waPhone.startsWith('880') ? waPhone : '880'+waPhone;
          const r = await window._waSendChat(waNorm + '@c.us', act.message);
          d = await r.json().catch(()=>({}));
















        btnContainer.innerHTML = (d.idMessage || d.id)
          ? '<span style="color:#0f9e60">✅ Sent successfully</span>'
          : '<span style="color:#d03030">⚠ Send failed: ' + (d.error||JSON.stringify(d)||'unknown') + '</span>';
      } catch(e) {
        btnContainer.innerHTML = '<span style="color:#d03030">⚠ ' + e.message + '</span>';
      }
    },
    // Called by QDC_staff after successful login
    onStaffLogin(name, role) {
      isStaff = true;
      staffCtx.name = name;
      staffCtx.role = role;
      dataLoaded = false;
      // Data loads lazily on first staff query — not at login
      // If chat is open, switch to staff mode and show loaded state
      if (isOpen && $msgs() && !$msgs().children.length) {
        staffWelcome();
      } else if (isOpen) {
        staffWelcome();
      }
    }
  };

})();