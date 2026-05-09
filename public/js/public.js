// QDC Public Engine


/* ─── CURSOR ─── */
(function(){
  const c=document.getElementById('cur'),c2=document.getElementById('cur2');
  if(!window.matchMedia('(pointer:fine)').matches)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    c.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
  });
  // Cursor tracker throttled to ~20fps
  let _cLast=0;
  (function loop(ts){ if(!document.hidden&&ts-_cLast>50){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;c2.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';_cLast=ts;} requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.svc-card,.doc-card,.fac-item,.rev-card,.tech-item,.faq-q,.cost-card,.treat-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{c.style.width='16px';c.style.height='16px';c2.style.width='52px';c2.style.height='52px'});
    el.addEventListener('mouseleave',()=>{c.style.width='10px';c.style.height='10px';c2.style.width='38px';c2.style.height='38px'});
  });
})();

/* ─── HAMBURGER ─── */
function toggleMenu(){document.getElementById('hbg').classList.toggle('open');document.getElementById('mmenu').classList.toggle('open');document.body.style.overflow=document.getElementById('mmenu').classList.contains('open')?'hidden':'';}
function closeMenu(){document.getElementById('hbg').classList.remove('open');document.getElementById('mmenu').classList.remove('open');document.body.style.overflow='';}

/* ─── OPEN/CLOSED STATUS ─── */
(function(){
  function setStatus(pid,tid){
    const pill=document.getElementById(pid),txt=document.getElementById(tid);if(!pill||!txt)return;
    const now=new Date(),utc=now.getTime()+now.getTimezoneOffset()*60000;
    const bd=new Date(utc+6*3600000);
    const day=bd.getDay(),mins=bd.getHours()*60+bd.getMinutes();
    const isOpen=(day===5)?(mins>=960&&mins<1260):(mins>=720&&mins<1260);
    pill.className='opill '+(isOpen?'open':'closed');txt.textContent=isOpen?'Open Now':'Closed';
  }
  setStatus('opill','otxt');setStatus('mopill','motxt');
})();

/* ─── BG PARTICLE CANVAS — disabled for performance ─── */
/* ─── HERO SLIDESHOW ENGINE ─── */
(function(){
  const SLIDES = ['rct','extraction','zirconia','implant','scaling','aligner'];
  let current = 0, autoTimer = null;
  const INTERVAL = 15000;
  const W = 480, H = 480;
  let _cW = 480, _cH = 480;

  function p(t,sp,mn,mx){ return mn+(mx-mn)*(Math.sin(t*sp)*.5+.5); }
  function lerp(a,b,t){ return a+(b-a)*t; }

  function bg(ctx, wt){const W=_cW,H=_cH;
    // White background
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H);
    // Subtle pale blue ripple waves
    for(let wi=0;wi<3;wi++){
      const freq  = .008 + wi*.003;
      const amp   = 10 + wi*5;
      const speed = wt*(0.5+wi*.2);
      const yBase = H*(0.25 + wi*(0.5/3));
      ctx.beginPath(); ctx.moveTo(0,yBase);
      for(let x=0;x<=W;x+=8){
        ctx.lineTo(x, yBase + Math.sin(x*freq+speed)*amp);
      }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle=`rgba(${180+wi*10},${200+wi*8},${230+wi*5},${0.06+wi*0.02})`;
      ctx.fill();
    }
    // Soft blue light glows
    for(let ci=0;ci<3;ci++){
      const cx2 = W*(0.2+ci*0.3) + Math.sin(wt*.4+ci)*W*.06;
      const cy2 = H*0.4 + Math.sin(wt*.3+ci*2)*H*.2;
      const r2  = W*.14 + Math.sin(wt+ci)*W*.04;
      const cg  = ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,r2);
      cg.addColorStop(0,`rgba(18,81,170,0.035)`);
      cg.addColorStop(1,'transparent');
      ctx.fillStyle=cg; ctx.fillRect(cx2-r2,cy2-r2,r2*2,r2*2);
    }
  }
  function brackets(ctx,col){const W=_cW,H=_cH;
    const bl=22,lw=2,c=col||'rgba(201,151,58,.7)';
    [[12,12],[W-12,12],[12,H-12],[W-12,H-12]].forEach(([bx,by],i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=lw;
      const sx=i%2===0?1:-1,sy=i<2?1:-1;
      ctx.beginPath();ctx.moveTo(bx,by+sy*bl);ctx.lineTo(bx,by);ctx.lineTo(bx+sx*bl,by);ctx.stroke();
    });
  }
  function label(ctx,title,sub,y){const W=_cW,H=_cH;
    ctx.fillStyle='rgba(18,81,170,.9)'; ctx.font='700 15px Jost,sans-serif';
    ctx.textAlign='center'; ctx.fillText(title,W/2,y);
    ctx.fillStyle='rgba(18,81,170,.55)'; ctx.font='300 11px Jost,sans-serif';
    ctx.fillText(sub,W/2,y+18);
  }
  function glow(ctx,x,y,r,col){const W=_cW,H=_cH;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  function fieldLabel(ctx,x,y,title,sub){const W=_cW,H=_cH;
    ctx.fillStyle='rgba(18,81,170,.9)'; ctx.font='600 11.5px Jost,sans-serif'; ctx.textAlign='left'; ctx.fillText(title,x,y);
    ctx.fillStyle='rgba(18,81,170,.5)'; ctx.font='300 9.5px Jost,sans-serif'; ctx.fillText(sub,x,y+14);
  }
  function leaderLine(ctx,x1,y1,x2,y2){const W=_cW,H=_cH;
    ctx.strokeStyle='rgba(18,81,170,.35)'; ctx.lineWidth=1; ctx.setLineDash([4,5]);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(200,134,10,.9)'; ctx.beginPath(); ctx.arc(x1,y1,3,0,Math.PI*2); ctx.fill();
  }
  function toothShape(ctx,ox,oy,s){const W=_cW,H=_cH;
    ctx.beginPath();
    ctx.moveTo(ox-s*.45,oy-s*.5);
    ctx.bezierCurveTo(ox-s*.45,oy-s*1.08,ox+s*.45,oy-s*1.08,ox+s*.45,oy-s*.5);
    ctx.bezierCurveTo(ox+s*.54,oy,ox+s*.32,oy+s*.32,ox,oy+s*.52);
    ctx.bezierCurveTo(ox-s*.32,oy+s*.32,ox-s*.54,oy,ox-s*.45,oy-s*.5);
    ctx.closePath();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  1. ROOT CANAL TREATMENT — animated file drilling with pulp glow
  // ═══════════════════════════════════════════════════════════════════════════
  function rRCT(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.5;
    const s=H*.19;

    // Background radial glow
    glow(ctx,cx,cy,s*1.8,`rgba(255,140,0,${.04+Math.sin(t*.7)*.02})`);

    // Jawbone
    ctx.beginPath(); ctx.roundRect(cx-W*.25,cy+H*.14,W*.5,H*.32,10);
    const jg=ctx.createLinearGradient(0,cy+H*.14,0,H);
    jg.addColorStop(0,'rgba(180,210,240,.7)'); jg.addColorStop(1,'rgba(140,185,225,.5)');
    ctx.fillStyle=jg; ctx.fill();
    ctx.strokeStyle='rgba(80,150,220,.5)'; ctx.lineWidth=2; ctx.stroke();

    // Tooth body — big and centered
    toothShape(ctx,cx,cy,s);
    const tg=ctx.createLinearGradient(cx,cy-s*1.1,cx,cy+s*.5);
    tg.addColorStop(0,'rgba(245,240,232,.97)');
    tg.addColorStop(.5,'rgba(225,210,188,.92)');
    tg.addColorStop(1,'rgba(195,172,140,.85)');
    ctx.fillStyle=tg; ctx.fill();
    ctx.strokeStyle='rgba(210,170,100,.7)'; ctx.lineWidth=2.5; ctx.stroke();

    // Pulp chamber — glowing orange
    const pulseA=.3+Math.sin(t*2)*.15;
    glow(ctx,cx,cy-s*.2,s*.5,`rgba(255,120,30,${pulseA})`);
    ctx.beginPath();
    ctx.moveTo(cx-s*.12,cy-s*.3);
    ctx.bezierCurveTo(cx-s*.12,cy-s*.7,cx+s*.12,cy-s*.7,cx+s*.12,cy-s*.3);
    ctx.bezierCurveTo(cx+s*.1,cy-s*.05,cx+s*.05,cy+s*.08,cx,cy+s*.15);
    ctx.bezierCurveTo(cx-s*.05,cy+s*.08,cx-s*.1,cy-s*.05,cx-s*.12,cy-s*.3);
    ctx.closePath();
    ctx.fillStyle=`rgba(180,60,20,${.5+Math.sin(t*1.5)*.15})`; ctx.fill();

    // Root canals
    [cx-s*.1, cx+s*.1].forEach((rx,ri)=>{
      const rlen=s*.95;
      ctx.beginPath();
      ctx.moveTo(rx-5,cy); ctx.bezierCurveTo(rx-3,cy+rlen*.5,rx-1,cy+rlen*.8,rx,cy+rlen);
      ctx.bezierCurveTo(rx+1,cy+rlen*.8,rx+3,cy+rlen*.5,rx+5,cy);
      ctx.closePath();
      ctx.fillStyle='rgba(100,40,10,.4)'; ctx.fill();
    });

    // Animated NiTi file — bounces up and down in canal
    const fileOsc = Math.sin(t*3.5);
    const fileY   = cy + s*.5 + fileOsc*s*.3;
    const fileA   = .7+fileOsc*.2;
    // Glow at tip
    glow(ctx,cx-s*.1,fileY,20,`rgba(255,200,50,${fileA*.6})`);
    // File shaft
    ctx.strokeStyle=`rgba(255,200,60,${fileA})`; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-s*.1,cy-s*.25); ctx.lineTo(cx-s*.1,fileY); ctx.stroke();
    // File tip spiral
    for(let fi=0;fi<5;fi++){
      const fy=fileY-fi*4;
      const fw=4-fi*.4;
      ctx.strokeStyle=`rgba(255,180,30,${fileA*(1-fi*.15)})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx-s*.1-fw,fy); ctx.lineTo(cx-s*.1+fw,fy+3); ctx.stroke();
    }
    // Second file slightly offset
    const f2Y = cy+s*.4 + Math.sin(t*3.5+1)*s*.25;
    ctx.strokeStyle=`rgba(255,160,40,.6)`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx+s*.1,cy-s*.25); ctx.lineTo(cx+s*.1,f2Y); ctx.stroke();

    // Irrigation blue droplets
    for(let d=0;d<5;d++){
      const dt=((t*1.8+d*.7)%(Math.PI));
      const dy=(cy-s*.1)+dt/(Math.PI)*s*1.1;
      const da=Math.sin(dt)*0.8;
      ctx.fillStyle=`rgba(80,180,255,${da*.7})`;
      ctx.beginPath(); ctx.ellipse(cx-s*.1+Math.sin(d)*3,dy,2.5,3.5,0,0,Math.PI*2); ctx.fill();
    }

    label(ctx,'ROOT CANAL TREATMENT','Rotary NiTi files · Apex sealing · Irrigation',H*.08);
    const lx=cx+W*.25;
    leaderLine(ctx,cx+s*.5,cy-s*.6,lx,cy-s*.55);
    fieldLabel(ctx,lx+5,cy-s*.63,'Enamel Crown','Protected');
    leaderLine(ctx,cx-s*.1,fileY,lx,fileY);
    fieldLabel(ctx,lx+5,fileY-7,'NiTi File','Rotary motion');
    leaderLine(ctx,cx-s*.1,cy+s*.85,lx,cy+s*.85);
    fieldLabel(ctx,lx+5,cy+s*.78,'Root Tip','Apex sealed');
    brackets(ctx);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  2. SURGICAL EXTRACTION — forceps gripping, bone cracking effect
  // ═══════════════════════════════════════════════════════════════════════════
  function rExtraction(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.5;
    const s=H*.17;

    glow(ctx,cx,cy,s*1.6,`rgba(80,150,255,.05)`);

    // Socket in jawbone — deepening
    ctx.beginPath(); ctx.roundRect(cx-W*.26,cy+H*.1,W*.52,H*.34,10);
    const jg=ctx.createLinearGradient(0,cy+H*.1,0,H);
    jg.addColorStop(0,'rgba(180,210,240,.7)'); jg.addColorStop(1,'rgba(140,185,225,.5)');
    ctx.fillStyle=jg; ctx.fill(); ctx.strokeStyle='rgba(70,140,210,.5)'; ctx.lineWidth=2; ctx.stroke();

    // Socket hole
    const sockD=.4+Math.sin(t*.4)*.1;
    ctx.beginPath(); ctx.ellipse(cx,cy+H*.13,s*.32*sockD,s*.38*sockD,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(10,20,40,${sockD*.8})`; ctx.fill();
    ctx.strokeStyle=`rgba(200,100,80,.6)`; ctx.lineWidth=1.5; ctx.stroke();

    // Tooth moving upward with rock motion
    const lift  = Math.max(0, Math.sin(t*.55)*H*.06+H*.04);
    const rock  = Math.sin(t*.9)*.08;
    ctx.save();
    ctx.translate(cx, cy-lift);
    ctx.rotate(rock);

    // Roots
    [[-s*.11,s*.8],[s*.11,s*.76]].forEach(([rx,rl])=>{
      ctx.beginPath();
      ctx.moveTo(rx-5,s*.25); ctx.bezierCurveTo(rx-3,s*.55,rx,rl*.88,rx,rl);
      ctx.bezierCurveTo(rx,rl*.88,rx+3,s*.55,rx+5,s*.25); ctx.closePath();
      const rg=ctx.createLinearGradient(0,s*.25,0,rl);
      rg.addColorStop(0,'rgba(230,212,188,.92)'); rg.addColorStop(1,'rgba(180,150,110,.78)');
      ctx.fillStyle=rg; ctx.fill(); ctx.strokeStyle='rgba(160,120,75,.5)'; ctx.lineWidth=1; ctx.stroke();
    });

    // Tooth body
    toothShape(ctx,0,0,s);
    const tg=ctx.createLinearGradient(0,-s,0,s*.5);
    tg.addColorStop(0,'rgba(248,243,236,.97)'); tg.addColorStop(1,'rgba(220,200,172,.88)');
    ctx.fillStyle=tg; ctx.fill(); ctx.strokeStyle='rgba(200,160,90,.7)'; ctx.lineWidth=2; ctx.stroke();

    // Forceps — metallic blue-steel
    const grip=s*.28+Math.sin(t*.6)*s*.04;
    // Left jaw
    ctx.beginPath();
    ctx.moveTo(-grip-14,s*.05); ctx.lineTo(-grip,0); ctx.lineTo(-grip,s*.38);
    ctx.lineTo(-grip-10,s*.44); ctx.lineTo(-grip-16,s*.38); ctx.closePath();
    ctx.fillStyle='rgba(120,160,210,.85)'; ctx.fill();
    ctx.strokeStyle='rgba(180,210,255,.8)'; ctx.lineWidth=1.5; ctx.stroke();
    // Right jaw
    ctx.beginPath();
    ctx.moveTo(grip+14,s*.05); ctx.lineTo(grip,0); ctx.lineTo(grip,s*.38);
    ctx.lineTo(grip+10,s*.44); ctx.lineTo(grip+16,s*.38); ctx.closePath();
    ctx.fillStyle='rgba(120,160,210,.85)'; ctx.fill();
    ctx.strokeStyle='rgba(180,210,255,.8)'; ctx.lineWidth=1.5; ctx.stroke();
    // Handles
    ctx.strokeStyle='rgba(140,185,240,.8)'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-grip-8,-s*.05); ctx.lineTo(-grip-28,-s*.9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(grip+8,-s*.05); ctx.lineTo(grip+28,-s*.9); ctx.stroke();
    // Hinge dot
    ctx.fillStyle='rgba(220,230,255,.9)'; ctx.beginPath(); ctx.arc(0,-s*.05,5,0,Math.PI*2); ctx.fill();

    ctx.restore();

    // Crack lines in bone around socket
    const crA=Math.max(0,Math.sin(t*.55)*.5);
    ctx.strokeStyle=`rgba(255,200,100,${crA*.7})`; ctx.lineWidth=1.5;
    [[-s*.18,s*.12],[-s*.08,s*.05],[s*.12,s*.1]].forEach(([ox,oy])=>{
      ctx.beginPath(); ctx.moveTo(cx+ox,cy+H*.12+oy);
      ctx.lineTo(cx+ox+Math.sin(t)*8,cy+H*.12+oy+12); ctx.stroke();
    });
    // Bone dust
    for(let d=0;d<6;d++){
      const da=(t*1.5+d*.8)%(Math.PI*2);
      const dr=.3+Math.sin(t*2+d)*.2;
      const px=cx+Math.cos(da+d)*(s*.3+dr*s*.1);
      const py=(cy+H*.12)+Math.sin(da*.7)*s*.12;
      ctx.fillStyle=`rgba(200,180,140,${Math.max(0,Math.sin(t+d))*.5})`;
      ctx.beginPath(); ctx.arc(px,py,2+dr*2,0,Math.PI*2); ctx.fill();
    }

    label(ctx,'SURGICAL EXTRACTION','Controlled luxation · Atraumatic technique',H*.08);
    const lx=cx+W*.26;
    leaderLine(ctx,cx+s*.54,cy-s*.3-lift*0.5,lx,cy-s*.28);
    fieldLabel(ctx,lx+5,cy-s*.35,'Dental Forceps','Stainless steel');
    leaderLine(ctx,cx,cy+H*.14,lx,cy+H*.14);
    fieldLabel(ctx,lx+5,cy+H*.1,'Alveolar Socket','Post-extraction site');
    brackets(ctx);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  3. ZIRCONIA CROWN — CAD/CAM crown descending onto prep with shimmer
  // ═══════════════════════════════════════════════════════════════════════════
  function rZirconia(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.5;
    const s=H*.18;

    // Dramatic golden glow behind crown
    const glowA=.15+Math.sin(t*.6)*.08;
    glow(ctx,cx,cy-s*.6,s*1.6,`rgba(201,151,58,${glowA})`);
    glow(ctx,cx,cy-s*.6,s*.8,`rgba(255,220,100,${glowA*.6})`);

    // Prepared tooth stump
    ctx.beginPath();
    ctx.moveTo(cx-s*.38,cy-s*.08);
    ctx.bezierCurveTo(cx-s*.35,cy-s*.42,cx+s*.35,cy-s*.42,cx+s*.38,cy-s*.08);
    ctx.lineTo(cx+s*.3,cy+s*.45);
    ctx.bezierCurveTo(cx+s*.2,cy+s*.56,cx-s*.2,cy+s*.56,cx-s*.3,cy+s*.45);
    ctx.closePath();
    const sg=ctx.createLinearGradient(cx,cy-s*.4,cx,cy+s*.55);
    sg.addColorStop(0,'rgba(235,220,200,.95)'); sg.addColorStop(1,'rgba(190,165,130,.85)');
    ctx.fillStyle=sg; ctx.fill(); ctx.strokeStyle='rgba(180,140,80,.5)'; ctx.lineWidth=2; ctx.stroke();

    // Crown descending — smooth bounce
    const phase=(t*.5)%(Math.PI*2);
    const descent=(.5-.5*Math.cos(phase));
    const crownOffY=-s*1.4+(descent*s*1.05);
    // Shadow grows as crown approaches
    const shadowA=descent*.4;
    ctx.beginPath(); ctx.ellipse(cx,cy-s*.06,s*.4*descent,s*.07*descent,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,0,0,${shadowA})`; ctx.fill();

    // ── Crown ────────────────────────────────────────────────────────────────
    ctx.save(); ctx.translate(cx, cy+crownOffY+s*.5);
    // Crown path
    function crownPath(){
      ctx.beginPath();
      ctx.moveTo(-s*.46,-s*.52);
      ctx.bezierCurveTo(-s*.46,-s*1.12,s*.46,-s*1.12,s*.46,-s*.52);
      ctx.bezierCurveTo(s*.54,-s*.06,s*.34,s*.14,s*.3,s*.34);
      ctx.bezierCurveTo(s*.22,s*.56,s*.1,s*.62,0,s*.56);
      ctx.bezierCurveTo(-s*.1,s*.62,-s*.22,s*.56,-s*.3,s*.34);
      ctx.bezierCurveTo(-s*.34,s*.14,-s*.54,-s*.06,-s*.46,-s*.52);
      ctx.closePath();
    }
    crownPath();
    // Main gradient — white to pale blue (zirconia)
    const zg=ctx.createLinearGradient(-s*.5,-s*1.1,s*.5,s*.6);
    zg.addColorStop(0,'rgba(250,253,255,1)');
    zg.addColorStop(.2,'rgba(230,242,255,.97)');
    zg.addColorStop(.6,'rgba(200,228,252,.93)');
    zg.addColorStop(1,'rgba(165,208,245,.88)');
    ctx.fillStyle=zg; ctx.fill();
    // Strong border with blue glow
    ctx.strokeStyle=`rgba(100,180,255,${.5+Math.sin(t*.8)*.2})`; ctx.lineWidth=2.5; ctx.stroke();

    // Shimmer highlight
    ctx.save(); crownPath(); ctx.clip();
    const shA=.15+Math.sin(t*1.2)*.12;
    const sh=ctx.createLinearGradient(-s*.4,-s*.95,s*.1,-s*.3);
    sh.addColorStop(0,`rgba(255,255,255,${shA})`);
    sh.addColorStop(.4,`rgba(255,255,255,${shA*.3})`);
    sh.addColorStop(1,'transparent');
    ctx.fillStyle=sh; ctx.fillRect(-s*.55,-s*1.15,s*1.1,s*.85);
    // Internal translucency lines — zirconia characteristic
    ctx.strokeStyle=`rgba(180,225,255,${.2+Math.sin(t*.5)*.1})`; ctx.lineWidth=1;
    for(let li=0;li<5;li++){
      ctx.beginPath(); ctx.moveTo(-s*.3+li*s*.15,-s*.9); ctx.lineTo(-s*.28+li*s*.14,s*.3); ctx.stroke();
    }
    ctx.restore();

    // Cervical ring glow
    ctx.beginPath(); ctx.ellipse(0,s*.28,s*.44,s*.09,0,0,Math.PI*2);
    ctx.strokeStyle=`rgba(150,210,255,${.4+Math.sin(t*.6)*.2})`; ctx.lineWidth=2; ctx.stroke();

    // Sparkle particles
    [[-s*.32,-s*.9],[0,-s*1.04],[s*.28,-s*.85],[-s*.1,-s*.6]].forEach(([sx,sy],idx)=>{
      const sa=.4+Math.sin(t*1.5+idx*1.2)*.5;
      const sr=2+Math.sin(t*2+idx)*.8;
      ctx.fillStyle=`rgba(255,255,255,${sa})`; ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fill();
    });

    ctx.restore();

    label(ctx,'ZIRCONIA CROWN','CAD/CAM milled · 1200 MPa strength · Tooth-matched',H*.08);
    const lx=cx+W*.28;
    const crY=cy+crownOffY;
    leaderLine(ctx,cx+s*.5,crY+s*.5-s*.55,lx,crY+s*.5-s*.5);
    fieldLabel(ctx,lx+5,crY+s*.5-s*.58,'Zirconia','High-strength ceramic');
    leaderLine(ctx,cx+s*.4,cy,lx,cy);
    fieldLabel(ctx,lx+5,cy-7,'Prep Margin','0.5mm chamfer');
    brackets(ctx);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  4. DENTAL IMPLANT — screw osseointegrating with pulsing bone fusion
  // ═══════════════════════════════════════════════════════════════════════════
  function rImplant(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.5;
    const s=H*.16;

    // Main glow
    glow(ctx,cx,cy+H*.18,s*1.4,`rgba(26,111,196,${.08+Math.sin(t*.5)*.04})`);

    // Jawbone — 3D look
    ctx.beginPath(); ctx.roundRect(cx-W*.24,cy+H*.08,W*.48,H*.36,12);
    const jg=ctx.createLinearGradient(0,cy+H*.08,0,H);
    jg.addColorStop(0,'rgba(180,210,240,.75)'); jg.addColorStop(1,'rgba(140,185,225,.55)');
    ctx.fillStyle=jg; ctx.fill();
    ctx.strokeStyle='rgba(80,150,230,.5)'; ctx.lineWidth=2; ctx.stroke();
    // Bone texture lines
    ctx.strokeStyle='rgba(80,140,210,.15)'; ctx.lineWidth=1;
    for(let bx=cx-W*.22;bx<cx+W*.22;bx+=16){
      ctx.beginPath(); ctx.moveTo(bx,cy+H*.1); ctx.lineTo(bx+8,cy+H*.44); ctx.stroke();
    }

    // Osseointegration glow — pulses outward from implant
    const ossA=.12+Math.sin(t*.8)*.08;
    glow(ctx,cx,cy+H*.2,s*.9,`rgba(100,220,100,${ossA})`);

    // Implant screw
    const scrTop=cy+H*.05, scrBot=cy+H*.36, scrW=s*.3;
    // Body gradient — titanium metallic
    const ig=ctx.createLinearGradient(cx-scrW,0,cx+scrW,0);
    ig.addColorStop(0,'rgba(60,110,180,.8)');
    ig.addColorStop(.3,'rgba(120,185,255,.95)');
    ig.addColorStop(.7,'rgba(120,185,255,.95)');
    ig.addColorStop(1,'rgba(60,110,180,.8)');
    ctx.fillStyle=ig;
    ctx.beginPath(); ctx.roundRect(cx-scrW,scrTop,scrW*2,scrBot-scrTop,6); ctx.fill();
    ctx.strokeStyle='rgba(160,210,255,.6)'; ctx.lineWidth=2; ctx.stroke();
    // Thread marks
    for(let ti=0;ti<12;ti++){
      const ty=scrTop+ti*(scrBot-scrTop)/12;
      const tw=scrW+4+Math.sin(ti*.7)*2;
      ctx.strokeStyle='rgba(40,80,150,.6)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx-tw,ty); ctx.lineTo(cx+tw,ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-tw,ty); ctx.lineTo(cx-tw-5,ty+5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+tw,ty); ctx.lineTo(cx+tw+5,ty+5); ctx.stroke();
    }
    // Implant hex top
    ctx.save(); ctx.translate(cx,scrTop);
    ctx.strokeStyle='rgba(180,220,255,.7)'; ctx.lineWidth=2;
    for(let h=0;h<6;h++){
      const hx=Math.cos(h*Math.PI/3)*scrW*.6, hy=Math.sin(h*Math.PI/3)*scrW*.4;
      const nx=Math.cos((h+1)*Math.PI/3)*scrW*.6, ny=Math.sin((h+1)*Math.PI/3)*scrW*.4;
      ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(nx,ny); ctx.stroke();
    }
    ctx.restore();

    // Abutment
    const abTop=cy-H*.07, abBot=cy+H*.07;
    const abG=ctx.createLinearGradient(cx-s*.14,0,cx+s*.14,0);
    abG.addColorStop(0,'rgba(80,140,210,.8)');
    abG.addColorStop(.5,'rgba(160,215,255,.95)');
    abG.addColorStop(1,'rgba(80,140,210,.8)');
    ctx.fillStyle=abG;
    ctx.beginPath(); ctx.roundRect(cx-s*.14,abTop,s*.28,abBot-abTop,4); ctx.fill();
    ctx.strokeStyle='rgba(140,200,255,.7)'; ctx.lineWidth=1.5; ctx.stroke();

    // Crown
    const cs=s, crownCY=cy-s*1.05;
    toothShape(ctx,cx,crownCY,cs);
    const cg=ctx.createLinearGradient(cx,crownCY-cs,cx,crownCY+cs*.5);
    cg.addColorStop(0,'rgba(252,248,242,.99)'); cg.addColorStop(.6,'rgba(230,215,195,.93)'); cg.addColorStop(1,'rgba(200,178,148,.86)');
    ctx.fillStyle=cg; ctx.fill();
    ctx.strokeStyle=`rgba(201,151,58,${.45+Math.sin(t*.7)*.2})`; ctx.lineWidth=2.5; ctx.stroke();
    ctx.save(); toothShape(ctx,cx,crownCY,cs); ctx.clip();
    const csh=ctx.createLinearGradient(cx-cs*.3,crownCY-cs*.9,cx+cs*.2,crownCY-cs*.3);
    csh.addColorStop(0,`rgba(255,255,255,${.1+Math.sin(t*.9)*.1})`); csh.addColorStop(1,'transparent');
    ctx.fillStyle=csh; ctx.fillRect(cx-cs,crownCY-cs*1.1,cs*2,cs*.9); ctx.restore();

    label(ctx,'TITANIUM DENTAL IMPLANT','Osseointegration · 3D-guided surgery · Lifetime',H*.08);
    const lx=cx+W*.24;
    [[cx+cs*.52,crownCY,'Crown','Zirconia ceramic'],
     [cx+s*.16,abTop+(abBot-abTop)/2,'Abutment','Ti connector'],
     [cx+scrW+5,scrTop+(scrBot-scrTop)/2,'Implant','Ti screw'],
     [cx+W*.12,cy+H*.32,'Jawbone','Osseointegration']].forEach(([ix,iy,ti,si])=>{
      leaderLine(ctx,ix,iy,lx,iy); fieldLabel(ctx,lx+5,iy-7,ti,si);
    });
    brackets(ctx);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  5. SCALING & POLISHING — ultrasonic tip removing calculus with sparks
  // ═══════════════════════════════════════════════════════════════════════════
  function rScaling(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.52;
    const s=H*.14;

    glow(ctx,cx,cy,s*2.5,`rgba(26,111,196,.06)`);

    // Three teeth in a row
    const teeth=[cx-s*1.28, cx, cx+s*1.28];
    teeth.forEach((tx,ti)=>{
      const ts=s*(ti===1?.95:.82);
      const calcOff=ti*0.8;
      const calcProg=Math.max(0,Math.min(1,(.3+.7*Math.sin(t*.4+calcOff))*.85));

      toothShape(ctx,tx,cy,ts);
      const tg=ctx.createLinearGradient(tx,cy-ts,tx,cy+ts*.5);
      tg.addColorStop(0,'rgba(248,243,235,.97)'); tg.addColorStop(1,'rgba(225,205,180,.9)');
      ctx.fillStyle=tg; ctx.fill(); ctx.strokeStyle='rgba(200,165,105,.6)'; ctx.lineWidth=2; ctx.stroke();

      // Calculus deposits — yellow/brown that disappear
      if(calcProg<.9){
        const ca=1-calcProg;
        ctx.save(); toothShape(ctx,tx,cy,ts); ctx.clip();
        ctx.fillStyle=`rgba(160,120,50,${ca*.65})`;
        for(let ci=0;ci<6;ci++){
          const cpx=tx-ts*.35+ci*ts*.14;
          const cpy=cy-ts*.1;
          ctx.beginPath(); ctx.ellipse(cpx,cpy,ts*.055,ts*.1,Math.sin(ci)*.4,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }
      // Polish shimmer when clean
      if(calcProg>.55){
        const sa=(calcProg-.55)*2.2;
        ctx.save(); toothShape(ctx,tx,cy,ts); ctx.clip();
        const shg=ctx.createLinearGradient(tx-ts*.3,cy-ts*.9,tx+ts*.2,cy-ts*.3);
        shg.addColorStop(0,`rgba(255,255,255,${sa*.4})`); shg.addColorStop(1,'transparent');
        ctx.fillStyle=shg; ctx.fillRect(tx-ts,cy-ts*1.1,ts*2,ts*.85); ctx.restore();
      }
    });

    // Ultrasonic scaler on centre tooth
    const vib=Math.sin(t*12)*2.5; // rapid vibration
    const scalX=cx+s*.4, scalY=cy-s*.38;
    // Scaler handle
    ctx.strokeStyle='rgba(100,160,220,.9)'; ctx.lineWidth=6; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(scalX+20,scalY-28); ctx.lineTo(scalX,scalY+vib); ctx.stroke();
    ctx.strokeStyle='rgba(60,120,190,.7)'; ctx.lineWidth=8;
    ctx.beginPath(); ctx.moveTo(scalX+20,scalY-28); ctx.lineTo(scalX+35,scalY-44); ctx.stroke();
    // Tip
    ctx.strokeStyle='rgba(180,220,255,.95)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(scalX,scalY+vib); ctx.lineTo(scalX-10,scalY+14+vib); ctx.stroke();
    // Vibration rings
    for(let vi=1;vi<=4;vi++){
      const va=p(t*4+vi,.8,.05,.4)*(1/vi);
      ctx.strokeStyle=`rgba(100,200,255,${va})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(scalX-5,scalY+10+vib,vi*7,0,Math.PI*2); ctx.stroke();
    }
    // Calculus sparks
    for(let sp=0;sp<8;sp++){
      const sa=(t*2.5+sp*.4)%(Math.PI);
      const spx=scalX-8+Math.cos(sa+sp*0.9)*(8+sp*4);
      const spy=scalY+10+Math.sin(sa)*(-10-sp*3);
      const sparA=Math.sin(sa)*.9;
      ctx.fillStyle=`rgba(255,200,80,${sparA*.8})`;
      ctx.beginPath(); ctx.arc(spx,spy,1.5,0,Math.PI*2); ctx.fill();
    }
    // Water spray
    for(let wp=0;wp<10;wp++){
      const ws=(t*2+wp*.5)%(Math.PI*1.6);
      const wx=scalX-5+Math.cos(ws+wp)*(5+wp*3);
      const wy=(scalY+10)+Math.sin(ws)*(-5-wp*2.5);
      const wa=Math.max(0,1-ws/(Math.PI*1.6))*.7;
      ctx.fillStyle=`rgba(80,200,255,${wa})`;
      ctx.beginPath(); ctx.arc(wx,wy,1.8,0,Math.PI*2); ctx.fill();
    }

    // Polish cup on left tooth
    const polA=Math.sin(t*4)*.12;
    ctx.save(); ctx.translate(teeth[0],cy-s*.25); ctx.rotate(polA);
    ctx.beginPath(); ctx.ellipse(0,0,s*.2,s*.15,0,0,Math.PI*2);
    ctx.fillStyle='rgba(220,70,50,.75)'; ctx.fill();
    ctx.strokeStyle='rgba(255,120,90,.7)'; ctx.lineWidth=2; ctx.stroke();
    ctx.strokeStyle='rgba(120,140,170,.85)'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(0,-s*.17); ctx.lineTo(0,-s*.42); ctx.stroke();
    ctx.restore();

    label(ctx,'SCALING & POLISHING','Ultrasonic calculus removal · Prophy paste · 45 min',H*.08);
    const lx=cx+W*.3;
    leaderLine(ctx,scalX+4,scalY,lx,scalY);
    fieldLabel(ctx,lx+5,scalY-7,'Ultrasonic Scaler','Piezoelectric 25kHz');
    leaderLine(ctx,cx,cy-s*.1,lx,cy-s*.1);
    fieldLabel(ctx,lx+5,cy-s*.18,'Calculus','Being removed');
    brackets(ctx);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  6. CLEAR ALIGNER — transparent shell settling, teeth straightening
  // ═══════════════════════════════════════════════════════════════════════════
  function rAligner(ctx,t){const W=_cW,H=_cH;
    bg(ctx,t);
    const cx=W*.44, cy=H*.54;
    const s=H*.14;

    glow(ctx,cx,cy-s*.5,s*2,`rgba(80,160,255,.07)`);

    // Teeth gradually straightening
    const straighten=.5+.5*Math.sin(t*.35);
    const teethD=[
      {x:-s*1.32, rot:-.1*(1-straighten), sz:.76},
      {x:-s*.6,   rot:.06*(1-straighten), sz:.84},
      {x:0,        rot:0,                  sz:.92},
      {x:s*.62,    rot:-.05*(1-straighten),sz:.84},
      {x:s*1.34,   rot:.09*(1-straighten), sz:.76},
    ];
    teethD.forEach(({x,rot,sz})=>{
      const ts=s*sz;
      ctx.save(); ctx.translate(cx+x,cy); ctx.rotate(rot);
      toothShape(ctx,0,0,ts);
      const tg=ctx.createLinearGradient(0,-ts,0,ts*.5);
      tg.addColorStop(0,'rgba(250,245,240,.97)'); tg.addColorStop(1,'rgba(225,207,185,.9)');
      ctx.fillStyle=tg; ctx.fill(); ctx.strokeStyle='rgba(195,160,100,.6)'; ctx.lineWidth=2; ctx.stroke();
      ctx.restore();
    });

    // Aligner tray — translucent shell with strong edge
    const aw=s*1.72, ah=s*.7;
    ctx.save(); ctx.translate(cx,cy+s*.15);
    ctx.beginPath();
    ctx.moveTo(-aw,-ah*.3);
    ctx.bezierCurveTo(-aw,-ah*.85,-aw*.4,-ah,0,-ah);
    ctx.bezierCurveTo(aw*.4,-ah,aw,-ah*.85,aw,-ah*.3);
    ctx.lineTo(aw,ah*.38);
    ctx.bezierCurveTo(aw*.8,ah*.72,aw*.4,ah,0,ah);
    ctx.bezierCurveTo(-aw*.4,ah,-aw*.8,ah*.72,-aw,ah*.38);
    ctx.closePath();

    // Fill — icy blue
    const ag=ctx.createLinearGradient(0,-ah,0,ah);
    ag.addColorStop(0,`rgba(180,225,255,${.4+Math.sin(t*.5)*.08})`);
    ag.addColorStop(.5,`rgba(140,200,255,${.25+Math.sin(t*.5)*.06})`);
    ag.addColorStop(1,`rgba(100,175,250,${.18})`);
    ctx.fillStyle=ag; ctx.fill();
    ctx.strokeStyle=`rgba(100,190,255,${.6+Math.sin(t*.6)*.15})`; ctx.lineWidth=2.5; ctx.stroke();

    // Shimmer
    ctx.save(); ctx.clip();
    const shg=ctx.createLinearGradient(-aw*.6,-ah*.85,aw*.3,-ah*.2);
    shg.addColorStop(0,`rgba(255,255,255,${.08+Math.sin(t*.9)*.06})`);
    shg.addColorStop(1,'transparent');
    ctx.fillStyle=shg; ctx.fillRect(-aw,-ah,aw*2,ah);
    // Vertical translucency lines
    ctx.strokeStyle=`rgba(200,235,255,${.15+Math.sin(t*.4)*.08})`; ctx.lineWidth=1;
    for(let li=-2;li<=2;li++){
      ctx.beginPath(); ctx.moveTo(li*aw*.3,-ah*.72); ctx.lineTo(li*aw*.28+6,ah*.62); ctx.stroke();
    }
    ctx.restore();

    // Attachment buttons on tray
    [-s*.88,-s*.38,0,s*.38,s*.88].forEach((bx,bi)=>{
      const ba=.35+Math.sin(t*.7+bi*.8)*.2;
      ctx.beginPath(); ctx.ellipse(bx,-ah*.28,5,3.5,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(120,190,255,${ba})`; ctx.fill();
      ctx.strokeStyle=`rgba(180,225,255,${ba*.7})`; ctx.lineWidth=1; ctx.stroke();
    });
    ctx.restore();

    // Movement arrows
    const arrA=.3+Math.sin(t*.6)*.25;
    ctx.strokeStyle=`rgba(100,200,255,${arrA})`; ctx.lineWidth=2;
    // Left tooth rightward
    [[-s*1.32,-s*1.1],[s*1.34,-s*1.1]].forEach(([ax,dir],ai)=>{
      const adir=ai===0?1:-1;
      ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(cx+ax,cy+ax*0+dir); ctx.lineTo(cx+ax+adir*s*.2,cy+dir); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=`rgba(100,200,255,${arrA})`;
      ctx.beginPath();
      ctx.moveTo(cx+ax+adir*s*.2,cy+dir-5);
      ctx.lineTo(cx+ax+adir*s*.26,cy+dir);
      ctx.lineTo(cx+ax+adir*s*.2,cy+dir+5);
      ctx.fill();
    });

    label(ctx,'CLEAR ALIGNER THERAPY','Virtually invisible · Removable · 3D treatment plan',H*.08);
    const lx=cx+W*.31;
    leaderLine(ctx,cx+aw+4,cy+s*.15,lx,cy+s*.15);
    fieldLabel(ctx,lx+5,cy+s*.08,'Aligner Tray','0.5mm TPU clear');
    leaderLine(ctx,cx,cy-s*.9,lx,cy-s*.9);
    fieldLabel(ctx,lx+5,cy-s*.97,'Tooth movement','~0.25mm per tray');
    brackets(ctx);
  }


  // ── Canvas init & render loop ─────────────────────────────────────────────
  // Active canvas tracking — only run rAF for the visible slide
  let _activeType = 'rct';
  const _ctxMap   = {};
  const _tMap     = {};
  const _sizeMap  = {};
  const _resizeFns= {};

  function initCanvas(cv, type){
    cv.width = 600; cv.height = 600;
    const ctx = cv.getContext('2d');
    _ctxMap[type]  = ctx;
    _sizeMap[type] = 600;
    _tMap[type]    = 0;
    if(type === _activeType) _drawFrame(type);
  }

  function _drawFrame(type){
    const ctx = _ctxMap[type];
    if(!ctx) return;
    const t = _tMap[type];
    _cW = 600; _cH = 600;
    ctx.clearRect(0,0,600,600);
    if(type==='rct')             rRCT(ctx,t);
    else if(type==='extraction') rExtraction(ctx,t);
    else if(type==='zirconia')   rZirconia(ctx,t);
    else if(type==='implant')    rImplant(ctx,t);
    else if(type==='scaling')    rScaling(ctx,t);
    else if(type==='aligner')    rAligner(ctx,t);
    _tMap[type] += 0.022;
    if(type === _activeType) requestAnimationFrame(()=>_drawFrame(type));
  }

  // Transition overlay
  let _transAlpha = 0;
  let _transDir   = 0; // 1=fade in (darken), -1=fade out (brighten)
  let _transRAF   = null;

  function _runTransitionOverlay(){
    const ov = document.getElementById('hero-transition-overlay');
    if(!ov){ _transAlpha=0; return; }
    const bw = ov.parentElement.offsetWidth  || 600;
    const bh = ov.parentElement.offsetHeight || 800;
    if(ov.width !== bw || ov.height !== bh){ ov.width=bw; ov.height=bh; }
    const ctx2 = ov.getContext('2d');
    ctx2.clearRect(0,0,bw,bh);
    if(_transAlpha > 0){
      ctx2.fillStyle = `rgba(3,17,28,${_transAlpha})`;
      ctx2.fillRect(0,0,bw,bh);
    }
    _transAlpha += _transDir * 0.055;
    if(_transAlpha >= 1){
      _transAlpha = 1; _transDir = 0;
      // Halfway: switch animation
      if(_pendingType){
        _activeType = _pendingType; _pendingType = null;
        _drawFrame(_activeType);
      }
      // Start fade out after brief hold
      setTimeout(()=>{ _transDir = -1; _transRAF = requestAnimationFrame(_runTransitionOverlay); }, 80);
      return;
    }
    if(_transAlpha <= 0){
      _transAlpha = 0; _transDir = 0;
      ctx2.clearRect(0,0,bw,bh);
      return;
    }
    _transRAF = requestAnimationFrame(_runTransitionOverlay);
  }

  let _pendingType = null;
  function startAnim(type){
    if(_activeType === type) return;
    _pendingType = type;
    // Cancel any running transition
    if(_transRAF) cancelAnimationFrame(_transRAF);
    _transAlpha = 0; _transDir = 1;
    _transRAF = requestAnimationFrame(_runTransitionOverlay);
  }

  const _allCV=document.querySelectorAll('.hslide-canvas');
  _allCV.forEach(cv=>{if(cv.dataset.anim==='rct'){initCanvas(cv,'rct');}else{cv._lazy=true;}});
  window._lazyInitCanvas=function(t){_allCV.forEach(cv=>{if(cv.dataset.anim===t&&cv._lazy){cv._lazy=false;initCanvas(cv,t);}});};
  setTimeout(()=>{_activeType='rct';_drawFrame('rct');},50);

  const SLIDE_DATA = [
    { line1:'Root Canal',     hl:'Treatment',       desc:'Cleaning, shaping and sealing root canals — eliminating infection and saving your natural tooth.' },
    { line1:'Surgical',       hl:'Extraction',      desc:'Precise atraumatic removal using controlled forcep technique with minimal trauma and fast healing.' },
    { line1:'Zirconia',       hl:'Crown',           desc:'CAD/CAM milled high-strength ceramic crown matched perfectly to your natural tooth colour and shape.' },
    { line1:'Titanium Dental',hl:'Implant',         desc:'3D-guided titanium implant that fuses with your jawbone — a lifetime replacement for missing teeth.' },
    { line1:'Scaling &',      hl:'Polishing',       desc:'Ultrasonic removal of calculus and stain deposits, leaving your teeth clean, smooth and protected.' },
    { line1:'Clear Aligner',  hl:'Therapy',         desc:'Virtually invisible custom trays that straighten your teeth with precision — removable and discreet.' },
  ];

  window.QDC_hero = {
    _masterTimer: null,
    _gen: 0,  // generation counter — incremented on each goTo() to cancel stale animations
    // Erase an element char by char, call onDone when empty
    _erase(el, speed, onDone, gen){
      let i = el.textContent.replace('▌','').length;
      const tick = () => {
        if(this._gen !== gen) return;  // stale — another goTo() fired
        if(i > 0){ el.textContent = el.textContent.replace('▌','').slice(0,--i)+'▌'; setTimeout(tick, speed); }
        else { el.textContent = ''; if(onDone) onDone(); }
      };
      tick();
    },
    // Type text into element char by char, call onDone when complete
    _type(el, text, speed, onDone, gen){
      let j = 0;
      const tick = () => {
        if(this._gen !== gen) return;  // stale — another goTo() fired
        if(j <= text.length){
          el.textContent = text.slice(0,j) + (j<text.length?'▌':'');
          j++;
          setTimeout(tick, speed);
        } else { if(onDone) onDone(); }
      };
      tick();
    },
    // Run a sequence of {el, text, eraseSpeed, typeSpeed} steps in order
    _runSeq(steps, idx, gen){
      if(this._gen !== gen) return;  // stale
      if(idx >= steps.length) return;
      const s = steps[idx];
      const el = document.getElementById(s.id);
      if(!el){ this._runSeq(steps, idx+1, gen); return; }
      const doType = () => this._type(el, s.text, s.typeSpeed||24, ()=>{
        setTimeout(()=>this._runSeq(steps, idx+1, gen), 120);
      }, gen);
      if(!el.textContent.replace('▌','').trim()){ doType(); }
      else { this._erase(el, s.eraseSpeed||22, doType, gen); }
    },
    goTo(n){
      const slides=document.querySelectorAll('.hslide');
      const dots  =document.querySelectorAll('.hsdot');
      slides.forEach((s,i)=>s.classList.toggle('active',i===n));
      dots.forEach((d,i)=>d.classList.toggle('active',i===n));
      current=n;
      startAnim(SLIDES[n]);
      const d = SLIDE_DATA[n]||SLIDE_DATA[0];
      const sn = document.getElementById('hero-step-num');
      if(sn) sn.textContent = n+1;
      // Chained sequence: line1 erases→types, then hl erases→types, then desc erases→types
      this._gen = (this._gen + 1) | 0;  // cancel all in-flight animations
      const _g = this._gen;
      this._runSeq([
        { id:'hero-proc-line1', text:d.line1,  eraseSpeed:40, typeSpeed:45 },
        { id:'hero-proc-hl',    text:d.hl,     eraseSpeed:40, typeSpeed:48 },
        { id:'hero-proc-desc',  text:d.desc,   eraseSpeed:4,  typeSpeed:5  },
      ], 0, _g);
      clearInterval(autoTimer);
      autoTimer=setInterval(()=>window.QDC_hero.goTo((current+1)%SLIDES.length),INTERVAL);
    },
    next(){ this.goTo((current+1)%SLIDES.length); },
    prev(){ this.goTo((current-1+SLIDES.length)%SLIDES.length); }
  };
  autoTimer=setInterval(()=>window.QDC_hero.goTo((current+1)%SLIDES.length),INTERVAL);
  // Trigger typewriter immediately for a random slide on first load
  setTimeout(()=>{ if(window.QDC_hero) window.QDC_hero.goTo(Math.floor(Math.random()*SLIDES.length)); }, 200);
  // Pause hero auto-slide when tab is hidden; resume cleanly when visible again
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      clearInterval(autoTimer);
      // Increment generation to abort any in-flight typewriter animations
      if(window.QDC_hero) window.QDC_hero._gen = (window.QDC_hero._gen + 1) | 0;
    } else {
      // Resume from current slide — re-fire goTo to re-render cleanly
      clearInterval(autoTimer);
      setTimeout(()=>{ if(window.QDC_hero) window.QDC_hero.goTo(current); }, 50);
      autoTimer=setInterval(()=>window.QDC_hero.goTo((current+1)%SLIDES.length),INTERVAL);
    }
  });
  // Touch swipe support
  (function(){
    const vis = document.getElementById('heroSlideshow');
    if(!vis) return;
    let tx=0,ty=0;
    // Swipe hint: wiggle the track once after 1.2s
    const track = document.getElementById('pages-track');
    if(track && window.innerWidth < 1021){
      setTimeout(()=>{
        track.classList.add('swipe-wiggle');
        track.addEventListener('animationend',()=>track.classList.remove('swipe-wiggle'),{once:true});
      }, 1200);
    }
    vis.addEventListener('touchstart',e=>{ tx=e.touches[0].clientX; ty=e.touches[0].clientY; },{passive:true});
    vis.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40){
        if(dx<0) window.QDC_hero.goTo((current+1)%SLIDES.length);
        else     window.QDC_hero.goTo((current-1+SLIDES.length)%SLIDES.length);
      }
    },{passive:true});
  })();
})();

/* ─── EXPENSES ENGINE ─── */
window.QDC_expenses = {
  _data: [],
  _filtered: [],

  onPeriodChange(){
    const v=document.getElementById('exp-period')?.value;
    const s=document.getElementById('exp-date-start'), e=document.getElementById('exp-date-end');
    if(s) s.style.display=v==='custom'?'block':'none';
    if(e) e.style.display=v==='custom'?'block':'none';
    if(v!=='custom') this.load();
  },
  _getPeriodParams(){
    const v=document.getElementById('exp-period')?.value||'month';
    const now=new Date(),y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),d=String(now.getDate()).padStart(2,'0');
    if(v==='today')  return `&start=${y}-${m}-${d}&end=${y}-${m}-${d}`;
    if(v==='week'){const day=now.getDay(),diff=now.getDate()-day+(day===0?-6:1),mon=new Date(new Date().setDate(diff));return `&start=${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}&end=${y}-${m}-${d}`;}
    if(v==='month')  return `&start=${y}-${m}-01&end=${y}-${m}-${d}`;
    if(v==='custom') return `&start=${document.getElementById('exp-date-start')?.value||''}&end=${document.getElementById('exp-date-end')?.value||''}`;
    return '';
  },
  async load(){
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    const msg = document.getElementById('exp-msg');
    if(msg){ msg.textContent = '⌛ Loading…'; msg.className = 'qdc-msg'; }
    try {
      const resp = await fetch(`${proxy}&action=getExpenses${this._getPeriodParams()}${QDC_staff._hipaaParams()}`);
      if(!resp.ok) throw new Error('HTTP ' + resp.status);
      const raw = await resp.json();
      this._data = Array.isArray(raw) ? raw : [];
      // Populate staff filter
      const staffSel = document.getElementById('exp-filter-staff');
      if(staffSel){
        const names = [...new Set(this._data.map(e=>e.staff||e.Staff||'').filter(Boolean))].sort();
        const cur = staffSel.value;
        staffSel.innerHTML = '<option value="">All Staff</option>' + names.map(n=>`<option${n===cur?' selected':''}>${n}</option>`).join('');
      }
      this.filter();
      if(msg){ msg.textContent = ''; msg.className = 'qdc-msg'; }
    } catch(err){
      if(msg){ msg.textContent = '⚠ ' + err.message; msg.className = 'qdc-msg err'; }
    }
  },

  filter(){
    const staffF = document.getElementById('exp-filter-staff')?.value || '';
    const catF   = document.getElementById('exp-filter-cat')?.value   || '';
    this._filtered = this._data.filter(e => {
      const s = e.staff || e.Staff || '';
      const c = e.category || e.Category || '';
      // Hide payroll entries — salaries are confidential
      if(c === 'Payroll' || c === 'payroll') return false;
      return (!staffF || s === staffF) && (!catF || c === catF);
    });
    this._render();
  },

  _render(){
    const tbody = document.getElementById('exp-tbody');
    if(!tbody) return;
    const fmt = n => '৳ ' + Math.round(Number(n)||0).toLocaleString();
    const today = new Date().toISOString().slice(0,10);
    const month = today.slice(0,7);
    const total = this._filtered.reduce((s,e)=>s+Number(e.amount||e.Amount||0),0);
    const monthTotal = this._filtered.filter(e=>String(e.date||e.Date||'').slice(0,7)===month)
                        .reduce((s,e)=>s+Number(e.amount||e.Amount||0),0);
    const el = id => document.getElementById(id);
    if(el('exp-stat-total'))  el('exp-stat-total').textContent  = fmt(total);
    if(el('exp-stat-month'))  el('exp-stat-month').textContent  = fmt(monthTotal);
    if(el('exp-stat-count'))  el('exp-stat-count').textContent  = this._filtered.length;

    if(!this._filtered.length){
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:36px;color:var(--text3)">No expenses found</td></tr>';
      return;
    }
    // Sort newest first
    const sorted = [...this._filtered].sort((a,b)=>String(b.date||b.Date||'').localeCompare(String(a.date||a.Date||'')));
    const _esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    tbody.innerHTML = sorted.map(e => {
      const staff   = e.staff    || e.Staff    || '—';
      const cat     = e.category || e.Category || '—';
      const desc    = e.description || e.Description || '—';
      const amt     = Number(e.amount || e.Amount || 0);
      const date    = String(e.date || e.Date || '').slice(0,10);
      const receipt = e.receipt  || e.Receipt  || '';
      const catColor = {Supplies:'#4fc3f7',Equipment:'#ab47bc',Medications:'#ef5350',
                        Utilities:'#26a69a',Travel:'#ffa726',Other:'var(--text3)'};
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:10px 12px;font-size:.84rem;color:var(--text3)">${_esc(date)}</td>
        <td style="padding:10px 12px;font-weight:600;color:var(--text)">${_esc(staff)}</td>
        <td style="padding:10px 12px"><span style="font-size:.74rem;padding:2px 8px;background:rgba(26,81,170,.08);color:${catColor[cat]||'var(--text3)'};">${_esc(cat)}</span></td>
        <td style="padding:10px 12px;color:var(--text2)">${_esc(desc)}</td>
        <td style="padding:10px 12px;text-align:right;font-weight:600;color:var(--crimson)">৳ ${amt.toLocaleString()}</td>
        <td style="padding:10px 12px;font-size:.78rem;color:var(--text3)">${_esc(receipt)||'—'}</td>
      </tr>`;
    }).join('');
  },

  openAdd(){
    const d = document.getElementById('exp-date');
    if(d) d.value = new Date().toISOString().slice(0,10);
    // Pre-fill staff name from logged-in staff
    const sn = document.getElementById('exp-staff-name');
    if(sn){ sn.value = window.QDC_staff?._staffName || ''; sn.readOnly = true; }
    ['exp-amount','exp-desc','exp-receipt'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    const cat = document.getElementById('exp-cat'); if(cat) cat.value='';
    const m = document.getElementById('exp-modal-msg'); if(m){ m.textContent=''; m.className='qdc-msg'; }
    const btn = document.getElementById('exp-save-btn'); if(btn){ btn.textContent='Save Expense →'; btn.disabled=false; }
    document.getElementById('addExpenseOverlay').classList.add('show');
    setTimeout(()=>{ document.getElementById('exp-amount')?.focus(); }, 150);
  },

  async save(){
    const date    = document.getElementById('exp-date')?.value || '';
    const amount  = document.getElementById('exp-amount')?.value || '';
    const cat     = document.getElementById('exp-cat')?.value || '';
    const staff   = document.getElementById('exp-staff-name')?.value.trim() || '';
    const desc    = document.getElementById('exp-desc')?.value.trim() || '';
    const receipt = document.getElementById('exp-receipt')?.value.trim() || '';
    const msg = document.getElementById('exp-modal-msg');
    const btn = document.getElementById('exp-save-btn');
    if(!date || !amount || !cat || !staff || !desc){
      if(msg){ msg.textContent = '⚠ All required fields must be filled.'; msg.className='qdc-msg err'; }
      return;
    }
    if(btn){ btn.textContent = '⌛ Saving…'; btn.disabled = true; }
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      const params = new URLSearchParams({ action:'addExpense', date, amount, category:cat, staff, description:desc, receipt });
      const resp = await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const data = await resp.json();
      if(!data.ok) throw new Error(data.error || 'Save failed');
      document.getElementById('addExpenseOverlay').classList.remove('show');
      this.load();
    } catch(err){
      if(msg){ msg.textContent = '⚠ ' + err.message; msg.className = 'qdc-msg err'; }
      if(btn){ btn.textContent = 'Save Expense →'; btn.disabled = false; }
    }
  }
};

/* ─── RBAC ENGINE (moved to QDC_staff object in module) ─── */

/* ─── PAYROLL ENGINE ─── */
window.QDC_payroll = {
  _data: [],
  async load(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('payroll-msg');
    try {
      const resp=await fetch(`${proxy}&action=getPayroll${QDC_staff._hipaaParams()}`);
      const raw=await resp.json();
      this._data=Array.isArray(raw)?raw:[];
      this._render();
      if(msg){msg.textContent='';msg.className='qdc-msg';}
    } catch(err){
      if(msg){msg.textContent='⚠ '+err.message;msg.className='qdc-msg err';}
    }
  },
  _render(){
    const tbody=document.getElementById('payroll-tbody');
    if(!tbody) return;
    const fmt=n=>'৳ '+Math.round(Number(n)||0).toLocaleString();
    const today=new Date().toISOString().slice(0,7); // YYYY-MM
    let total=0, dueCount=0, activeCount=0;
    if(!this._data.length){
      tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:36px;color:var(--text3)">No staff records found</td></tr>';
      return;
    }
    const _attrJSON = s => JSON.stringify(String(s||'')).replace(/"/g,'&quot;');
    tbody.innerHTML=this._data.map(s=>{
      const base=Number(s.BaseSalary||s.basesalary||0);
      const bonus=Number(s.Bonus||s.bonus||0);
      const total2=base+bonus;
      total+=total2; activeCount++;
      const lastPaid=String(s.LastPaid||s.lastpaid||'').slice(0,7);
      const isDue=!lastPaid||lastPaid<today;
      if(isDue) dueCount++;
      const sid=s.StaffID||s.staffid||'';
      const sidJ = _attrJSON(sid);
      const nmJ  = _attrJSON(s.Name||s.name||'');
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:10px 12px;font-weight:600;color:var(--text)">${s.Name||s.name||'—'}</td>
        <td style="padding:10px 12px;font-size:.8rem;color:var(--text3);text-transform:capitalize">${s.Role||s.role||'staff'}</td>
        <td style="padding:10px 12px;text-align:right">${fmt(base)}</td>
        <td style="padding:10px 12px;text-align:right;color:var(--gold)">${fmt(bonus)}</td>
        <td style="padding:10px 12px;text-align:right;font-weight:700;color:var(--text)">${fmt(total2)}</td>
        <td style="padding:10px 12px;font-size:.8rem;color:var(--text3)">${s.LastPaid||s.lastpaid||'Never'}</td>
        <td style="padding:10px 12px"><span style="font-size:.72rem;padding:2px 8px;background:${isDue?'rgba(208,48,48,.1)':'rgba(15,158,96,.1)'};color:${isDue?'var(--closed)':'var(--open)'}">${isDue?'DUE':'Paid'}</span></td>
        <td style="padding:10px 12px">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="s-btn-sm" onclick="QDC_payroll.editSalary(${sidJ},${base},${bonus})">✏️ Edit</button>
            <button class="s-btn-sm" style="background:var(--open);color:white;border-color:var(--open)" onclick="QDC_payroll.openPayModal(${sidJ},${nmJ},${total2})">💸 Pay</button>
            <button class="s-btn-sm" style="background:var(--crimson);color:white;border-color:var(--crimson)" onclick="QDC_payroll.openCreateLogin(${sidJ},${nmJ})">🔑 Login</button>
            <button class="s-btn-sm" style="background:var(--closed);color:white;border-color:var(--closed)" onclick="QDC_payroll.deleteStaff(${sidJ},${nmJ})">🗑 Remove</button>
          </div>
        </td>
      </tr>`;
    }).join('');
    const el=id=>document.getElementById(id);
    if(el('pr-total'))      el('pr-total').textContent=fmt(total);
    if(el('pr-due-count'))  el('pr-due-count').textContent=dueCount;
    if(el('pr-staff-count'))el('pr-staff-count').textContent=activeCount;
  },
  editSalary(id, base, bonus){
    document.getElementById('edit-salary-id').value=id;
    document.getElementById('edit-salary-base').value=base;
    document.getElementById('edit-salary-bonus').value=bonus;
    document.getElementById('editSalaryOverlay').classList.add('show');
  },
  async saveSalary(){
    const id=document.getElementById('edit-salary-id').value;
    const salary=document.getElementById('edit-salary-base').value;
    const bonus=document.getElementById('edit-salary-bonus').value;
    const msg=document.getElementById('edit-salary-msg');
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      const r=await fetch(`${proxy}&action=updatePayroll&staffId=${encodeURIComponent(id)}&salary=${salary}&bonus=${bonus}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      document.getElementById('editSalaryOverlay').classList.remove('show');
      this.load();
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  },
  openPayModal(staffId, name, amount){
    document.getElementById('bkash-staff-id').value = staffId;
    document.getElementById('bkash-staff-name').textContent = name;
    document.getElementById('bkash-amount').textContent = '৳ ' + Math.round(amount).toLocaleString();
    document.getElementById('bkash-staff-number').value = '';
    document.getElementById('bkash-ref').value = 'Salary-' + new Date().toISOString().slice(0,7);
    document.getElementById('bkash-pay-msg').textContent = '';
    document.getElementById('bkash-pay-msg').className = 'qdc-msg';
    document.getElementById('bkashPayOverlay').classList.add('show');
  },
  async confirmPay(method){
    const staffId = document.getElementById('bkash-staff-id').value;
    const name    = document.getElementById('bkash-staff-name').textContent;
    const amtStr  = document.getElementById('bkash-amount').textContent.replace(/[^0-9]/g,'');
    const amount  = parseInt(amtStr,10)||0;
    const staffPhone = document.getElementById('bkash-staff-number').value.trim();
    const ref     = document.getElementById('bkash-ref').value.trim();
    const msg     = document.getElementById('bkash-pay-msg');
    if(method==='bkash' && !staffPhone){ if(msg){msg.textContent='⚠ Enter staff bKash number.';msg.className='qdc-msg err';} return; }
    if(msg){msg.textContent='Processing…';msg.className='qdc-msg';}
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    try {
      const r = await fetch(`${proxy}&action=processPayment&staffId=${encodeURIComponent(staffId)}&method=${method}&ref=${encodeURIComponent(ref)}&note=${encodeURIComponent(method==='bkash'?'bKash to '+staffPhone:'Cash payment')}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      // Send WhatsApp receipt if phone available
      const q = window.__QDC||{};
      if(staffPhone && (q.QDC_PROXY || q.GREEN_API_BASE)){
        let raw = String(staffPhone).replace(/\D/g,'');
        if(raw.startsWith('0')) raw='880'+raw.slice(1);
        else if(!raw.startsWith('880')) raw='880'+raw;
        const receipt = method==='bkash'
          ? `✅ *Salary Payment — Quick Dental Care*\n\nDear ${name},\n\nYour salary of *৳${amount.toLocaleString()}* has been sent to your bKash account.\n💳 bKash: ${staffPhone}\n📋 Ref: ${ref}\n📅 Date: ${new Date().toLocaleDateString('en-BD')}\n\nQuick Dental Care, Akhalia, Sylhet`
          : `✅ *Salary Payment — Quick Dental Care*\n\nDear ${name},\n\nYour salary of *৳${amount.toLocaleString()}* has been paid in cash.\n📋 Ref: ${ref}\n📅 Date: ${new Date().toLocaleDateString('en-BD')}\n\nQuick Dental Care, Akhalia, Sylhet`;
        try {
          const waR = await fetch(`${(window.__QDC||{}).GREEN_API_BASE}/sendMessage/${(window.__QDC||{}).GREEN_API_TOKEN}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatId:raw+'@c.us',message:receipt})});
          if (!waR.ok) console.warn('[payroll] WA receipt failed:', waR.status);
        } catch(we){ console.warn('[payroll] WA receipt threw:', we); }
      }
      document.getElementById('bkashPayOverlay').classList.remove('show');
      const pmsg = document.getElementById('payroll-msg');
      if(pmsg){ pmsg.textContent=`✅ Paid ${name} ৳${amount.toLocaleString()} (${method==='bkash'?'bKash':'Cash'})`;pmsg.className='qdc-msg ok'; }
      this.load();
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  },
  async deleteStaff(staffId, name){
    if(!confirm('Remove '+name+' from payroll? This cannot be undone.')) return;
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('payroll-msg');
    try {
      const r=await fetch(`${proxy}&action=deleteStaff&staffId=${encodeURIComponent(staffId)}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      if(msg){msg.textContent='✓ '+name+' removed from payroll.';msg.className='qdc-msg ok';}
      this.load();
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
    }
  },

  openCreateLogin(staffId, name){
    document.getElementById('cl-staff-id').value = staffId;
    document.getElementById('cl-staff-name').textContent = name;
    document.getElementById('cl-password').value = '';
    document.getElementById('cl-role').value = 'staff';
    const msg = document.getElementById('cl-msg'); if(msg){msg.textContent='';msg.className='qdc-msg';}
    document.getElementById('createLoginOverlay').classList.add('show');
    setTimeout(()=>document.getElementById('cl-password').focus(), 150);
  },

  async saveLogin(){
    const staffId  = document.getElementById('cl-staff-id').value;
    const password = document.getElementById('cl-password').value.trim();
    const role     = document.getElementById('cl-role').value;
    const msg      = document.getElementById('cl-msg');
    const btn      = document.getElementById('cl-save-btn');
    if(!staffId||!password){ if(msg){msg.textContent='Password required.';msg.className='qdc-msg err';} return; }
    if(password.length < 6){ if(msg){msg.textContent='Password must be at least 6 characters.';msg.className='qdc-msg err';} return; }
    btn.textContent='⌛ Saving…'; btn.disabled=true;
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      const r = await fetch(`${proxy}&action=createStaffLogin&staffId=${encodeURIComponent(staffId)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      document.getElementById('createLoginOverlay').classList.remove('show');
      if(document.getElementById('payroll-msg')){ document.getElementById('payroll-msg').textContent='✓ Login created for '+staffId; document.getElementById('payroll-msg').className='qdc-msg ok'; }
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
      btn.textContent='Save Login →'; btn.disabled=false;
    }
  },

  openAddStaff(){
    ['add-staff-name','add-staff-id'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    ['add-staff-salary','add-staff-bonus'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='0';});
    document.getElementById('addStaffOverlay').classList.add('show');
  },
  async saveStaff(){
    const name=document.getElementById('add-staff-name')?.value.trim();
    const sid=document.getElementById('add-staff-id')?.value.trim();
    const pass=document.getElementById('add-staff-password')?.value||'';
    const role=document.getElementById('add-staff-role')?.value||'staff';
    const salary=document.getElementById('add-staff-salary')?.value||'0';
    const bonus=document.getElementById('add-staff-bonus')?.value||'0';
    const msg=document.getElementById('add-staff-msg');
    if(!name||!sid){if(msg){msg.textContent='Name and Staff ID required.';msg.className='qdc-msg err';}return;}
    if(!pass||pass.length<6){if(msg){msg.textContent='Password must be at least 6 characters.';msg.className='qdc-msg err';}return;}
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      const params=new URLSearchParams({action:'addStaff',name,staffId:sid,password:pass,role,salary,bonus,active:'TRUE'});
      const r=await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      if(msg){msg.textContent=`✓ ${name} added — they can now login with ID: ${sid}`;msg.className='qdc-msg ok';}
      setTimeout(()=>{document.getElementById('addStaffOverlay').classList.remove('show');this.load();},2000);
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  }
};

/* ─── REVENUE ENGINE ─── */
// ── Chart.js lazy loader ──────────────────────────────────────────────────
// Loads Chart.js from CDN on first call, resolves immediately on subsequent calls.
window._loadChartJS = (function() {
  let _promise = null;
  return function(cb) {
    if (window.Chart) { cb && cb(); return Promise.resolve(); }
    if (!_promise) {
      _promise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Chart.js failed to load'));
        document.head.appendChild(s);
      });
    }
    if (cb) _promise.then(cb).catch(cb);
    return _promise;
  };
})();

window.QDC_revenue = {
  _barChart:null, _incPie:null, _expPie:null,
  onPeriodChange(){
    const v=document.getElementById('rev-period')?.value;
    const s=document.getElementById('rev-start'), e2=document.getElementById('rev-end');
    if(s) s.style.display=v==='custom'?'block':'none';
    if(e2) e2.style.display=v==='custom'?'block':'none';
    if(v!=='custom') this.load();
  },
  _getDates(){
    const v=document.getElementById('rev-period')?.value||'month';
    const now=new Date(), y=now.getFullYear(), m=String(now.getMonth()+1).padStart(2,'0'), d=String(now.getDate()).padStart(2,'0');
    if(v==='today')  return {start:`${y}-${m}-${d}`,end:`${y}-${m}-${d}`};
    if(v==='week'){
      const day=now.getDay(), diff=now.getDate()-day+(day===0?-6:1);
      const mon=new Date(now.setDate(diff));
      const ms=`${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}`;
      return {start:ms,end:`${y}-${m}-${d}`};
    }
    if(v==='month') return {start:`${y}-${m}-01`,end:`${y}-${m}-${d}`};
    return {start:document.getElementById('rev-start')?.value||`${y}-${m}-01`,
            end:document.getElementById('rev-end')?.value||`${y}-${m}-${d}`};
  },
  async load(){
    await new Promise(res => window._loadChartJS ? window._loadChartJS(res) : res());
    const msg=document.getElementById('revenue-msg');
    const {start,end}=this._getDates();
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    try {
      // getRevenue returns { total, paid, due, count, invoices:[...] }
      const [revResp, expResp] = await Promise.all([
        fetch(`${proxy}&action=getRevenue&start=${start}&end=${end}${QDC_staff._hipaaParams()}`),
        fetch(`${proxy}&action=getExpenses${QDC_staff._hipaaParams()}`)
      ]);
      const d    = await revResp.json();
      const expD = await expResp.json();
      // GAS returns { total, paid, due, count, invoices } — no ok field on success
      if(d.error) throw new Error(d.error);
      const invs = Array.isArray(d.invoices) ? d.invoices : [];
      const exps = Array.isArray(expD) ? expD : [];
      // Derive daily and by-type breakdowns from raw data
      const incomeByDay={}, expenseByDay={};
      const incomeByType={}, expenseByType={};
      invs.forEach(r=>{
        const day=String(r.Date||r.date||'').slice(0,10); if(!day) return;
        incomeByDay[day]=(incomeByDay[day]||0)+Number(r.Total||r.total||0);
        const tx=String(r.Treatments||r.treatments||'Other').split('|')[0].trim()||'Other';
        incomeByType[tx]=(incomeByType[tx]||0)+Number(r.Total||r.total||0);
      });
      // Filter expenses by selected date range
      exps.forEach(r=>{
        const day=String(r.date||r.Date||'').slice(0,10); if(!day) return;
        if(start&&day<start) return; if(end&&day>end) return;
        expenseByDay[day]=(expenseByDay[day]||0)+Number(r.amount||r.Amount||0);
        const cat=String(r.category||r.Category||'Other');
        expenseByType[cat]=(expenseByType[cat]||0)+Number(r.amount||r.Amount||0);
      });
      const totalIncome = d.total||0;
      const totalExpenses = Object.values(expenseByDay).reduce((a,b)=>a+b, 0);
      const fmt=n=>'৳ '+Math.round(Number(n)||0).toLocaleString();
      const el=id=>document.getElementById(id);
      if(el('rev-income'))   el('rev-income').textContent=fmt(totalIncome);
      if(el('rev-expenses')) el('rev-expenses').textContent=fmt(totalExpenses);
      const profit=totalIncome-totalExpenses;
      if(el('rev-profit'))   { el('rev-profit').textContent=fmt(profit); el('rev-profit').style.color=profit>=0?'var(--open)':'var(--closed)'; }
      this._drawBarChart(incomeByDay, expenseByDay);
      this._drawPie('rev-income-pie',  incomeByType,  ['#1251aa','#e8a020','#0f9e60','#c42b2b']);
      this._drawPie('rev-expense-pie', expenseByType, ['#e8a020','#c42b2b','#4a6fa8','#0f9e60','#8b5cf6']);
      if(msg){msg.textContent='';msg.className='qdc-msg';}
    } catch(err){ if(msg){msg.textContent='⚠ '+err.message;msg.className='qdc-msg err';} }
  },
  _drawBarChart(incomeByDay, expenseByDay){
    const canvas=document.getElementById('rev-bar-chart'); if(!canvas) return;
    const allDays=[...new Set([...Object.keys(incomeByDay),...Object.keys(expenseByDay)])].sort();
    const ctx=canvas.getContext('2d');
    if(this._barChart){ this._barChart.destroy(); }
    this._barChart=new Chart(ctx,{type:'bar',data:{
      labels:allDays.map(d=>d.slice(5)),
      datasets:[
        {label:'Income',data:allDays.map(d=>incomeByDay[d]||0),backgroundColor:'rgba(15,158,96,.7)',borderRadius:2},
        {label:'Expenses',data:allDays.map(d=>expenseByDay[d]||0),backgroundColor:'rgba(208,48,48,.7)',borderRadius:2}
      ]
    },options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:10},boxWidth:12}}},
      scales:{y:{ticks:{callback:v=>'৳'+v.toLocaleString(),font:{size:9}},grid:{color:'rgba(0,0,0,.06)'}},
              x:{ticks:{font:{size:9}},grid:{display:false}}}}});
  },
  _drawPie(canvasId, dataObj, colors){
    const canvas=document.getElementById(canvasId); if(!canvas) return;
    const keys=Object.keys(dataObj), vals=keys.map(k=>dataObj[k]);
    const ctx=canvas.getContext('2d');
    if(this['_pie_'+canvasId]) this['_pie_'+canvasId].destroy();
    this['_pie_'+canvasId]=new Chart(ctx,{type:'pie',data:{
      labels:keys, datasets:[{data:vals,backgroundColor:colors,borderWidth:1}]
    },options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{size:9},boxWidth:10}}}}});
  },
  async downloadReport(){
    const {start,end}=this._getDates();
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('revenue-msg');
    if(msg){msg.textContent='⌛ Generating report…';msg.className='qdc-msg';}
    try {
      // Fetch full data
      const [invResp, expResp, payResp] = await Promise.all([
        fetch(`${proxy}&action=getInvoices&start=${start}&end=${end}${QDC_staff._hipaaParams()}`),
        fetch(`${proxy}&action=getExpenses&start=${start}&end=${end}${QDC_staff._hipaaParams()}`),
        fetch(`${proxy}&action=getPayroll${QDC_staff._hipaaParams()}`)
      ]);
      const invoices = await invResp.json();
      const expenses = await expResp.json();
      const payroll  = await payResp.json();
      const invList  = Array.isArray(invoices) ? invoices : [];
      const expList  = Array.isArray(expenses) ? expenses : [];
      const payList  = Array.isArray(payroll)  ? payroll  : [];

      const fmt = n => '৳ '+Math.round(Number(n)||0).toLocaleString();
      const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
      const totalInc = invList.reduce((s,r)=>s+Number(r.Total||r.total||0),0);
      const totalExp = expList.reduce((s,r)=>s+Number(r.amount||r.Amount||0),0);
      const totalPay = payList.reduce((s,r)=>s+Number(r.BaseSalary||r.basesalary||0)+Number(r.Bonus||r.bonus||0),0);
      const profit   = totalInc - totalExp;

      const invRows = invList.map(r=>`
        <tr><td>${esc(String(r.Date||r.date||'').slice(0,10))}</td>
            <td>${esc(r.InvoiceRef||r.invoiceref||'')}</td>
            <td>${esc(r.Name||r.name||'—')}</td>
            <td>${esc(r.Treatments||r.treatments||'')}</td>
            <td style="text-align:right">${fmt(r.Total||r.total||0)}</td>
            <td style="text-align:right;color:${Number(r.Due||r.due||0)>0?'#d03030':'#0a9e5c'}">${fmt(r.Due||r.due||0)}</td>
        </tr>`).join('');
      const expRows = expList.map(r=>`
        <tr><td>${esc(String(r.date||r.Date||'').slice(0,10))}</td>
            <td>${esc(r.category||r.Category||'')}</td>
            <td>${esc(r.staff||r.Staff||'—')}</td>
            <td>${esc(r.description||r.Description||'')}</td>
            <td style="text-align:right;color:#d03030">${fmt(r.amount||r.Amount||0)}</td>
        </tr>`).join('');
      const payRows = payList.map(r=>`
        <tr><td>${esc(r.Name||r.name||'—')}</td>
            <td style="text-transform:capitalize">${esc(r.Role||r.role||'')}</td>
            <td style="text-align:right">${fmt(r.BaseSalary||r.basesalary||0)}</td>
            <td style="text-align:right;color:#c8860a">${fmt(r.Bonus||r.bonus||0)}</td>
            <td style="text-align:right">${fmt(Number(r.BaseSalary||r.basesalary||0)+Number(r.Bonus||r.bonus||0))}</td>
        </tr>`).join('');

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Financial Report — Quick Dental Care</title>
      </head><body><div class="page">
      <div class="header">
        <h1>Quick Dental Care — Financial Report</h1>
        <p>Period: ${start} to ${end} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-BD')}</p>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="kpi-val" style="color:#0a9e5c">${fmt(totalInc)}</div><div class="kpi-lbl">Total Income</div></div>
        <div class="kpi"><div class="kpi-val" style="color:#d03030">${fmt(totalExp)}</div><div class="kpi-lbl">Total Expenses</div></div>
        <div class="kpi"><div class="kpi-val profit">${fmt(profit)}</div><div class="kpi-lbl">Net Profit</div></div>
      </div>
      ${invList.length?`<div class="section"><div class="section-title">Invoices (${invList.length})</div>
        <table><thead><tr><th>Date</th><th>Ref</th><th>Patient</th><th>Treatments</th><th style="text-align:right">Total</th><th style="text-align:right">Due</th></tr></thead>
        <tbody>${invRows}</tbody></table></div>`:''}
      ${expList.length?`<div class="section"><div class="section-title">Expenses (${expList.length})</div>
        <table><thead><tr><th>Date</th><th>Category</th><th>Staff</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${expRows}</tbody></table></div>`:''}
      ${payList.length?`<div class="section"><div class="section-title">Payroll</div>
        <table><thead><tr><th>Name</th><th>Role</th><th style="text-align:right">Salary</th><th style="text-align:right">Bonus</th><th style="text-align:right">Total</th></tr></thead>
        <tbody>${payRows}</tbody></table></div>`:''}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:.75rem;color:#999;text-align:center">
        Quick Dental Care · Akhalia, Sylhet · +88 01307978439 · quickdental.com.bd
      </div>
      </div></body></html>`;

      const blob=new Blob([html],{type:'text/html'});
      const url=URL.createObjectURL(blob);
      const w=window.open(url,'_blank');
      if(w){ setTimeout(()=>{try{w.print();}catch(e){} URL.revokeObjectURL(url);},800); }
      else {
        const a=document.createElement('a');
        a.href=url; a.download=`QDC_Report_${start}_${end}.html`; a.click();
        setTimeout(()=>URL.revokeObjectURL(url),3000);
      }
      if(msg){msg.textContent='✓ Report opened — use Ctrl+P / Cmd+P to save as PDF.';msg.className='qdc-msg ok';}
    } catch(err){
      if(msg){msg.textContent='⚠ Report failed: '+err.message;msg.className='qdc-msg err';}
    }
  }
};

/* ─── AUTOMATION ENGINE ─── */
window.QDC_automation = {
  _flags:{},
  _labels:{
    invoice_whatsapp:      'Auto-send WhatsApp on Invoice save',
    prescription_whatsapp: 'Auto-send WhatsApp on Prescription save',
    xray_whatsapp:         'Auto-send WhatsApp when X-Ray is uploaded',
    inventory_alert:       'Weekly low-stock WhatsApp alert (every Thursday 9am)',
    recall:                'Daily recall WhatsApp for unfinished treatment (7-day follow-up)',
    payroll_alert:         'Monthly payroll due notification (1st of month 7am)',
    low_stock_instant:     'Instant low-stock alert after each prescription',
    inventory_auto_deduct: 'Auto-deduct inventory items when prescription is saved',
    queue_auto_clear:      'Auto-remove patient from queue when prescription is saved',
    queue_auto_advance:    'Auto-call next patient when current is marked Done',
    appt_slot_notify:      'Notify manager + patient when slot is requested via website',
    appt_confirm_wa:       'Auto-send WhatsApp confirmation when appointment is booked',
  },
  _descriptions:{
    invoice_whatsapp:      'Sends invoice summary to patient WhatsApp when saved to Sheets.',
    prescription_whatsapp: 'Sends prescription Drive link to patient WhatsApp after upload.',
    xray_whatsapp:         'When the X-Ray Uploader tool uploads a file, sends the patient a WhatsApp with a link to view it in their portal.',
    inventory_alert:       'Every Thursday at 9am, WhatsApps manager with all out/low stock items.',
    recall:                'Checks daily for patients with diagnosis but no treatment after 7 days, sends reminder.',
    payroll_alert:         'On the 1st of each month, WhatsApps manager with payroll totals.',
    low_stock_instant:     'After a prescription is saved, checks if any deducted item is below min and alerts manager.',
    inventory_auto_deduct: 'When prescription Treatment field matches a Procedure_Mapping entry, quantities auto-deducted from Inventory sheet.',
    queue_auto_clear:      'When a prescription is saved for a patient currently in the queue, they are automatically marked Done and removed from the queue list.',
    queue_auto_advance:    'When a patient is marked Done (via queue button or prescription save), automatically moves the next Waiting patient to In Chair and sends them a WhatsApp message to come to reception.',
    appt_slot_notify:      'When a patient requests an appointment slot from the public website, sends a WhatsApp to the manager and a confirmation to the patient.',
    appt_confirm_wa:       'Sends a WhatsApp appointment confirmation to the patient when staff books or edits an appointment in the calendar.',
  },
  _initConfigFields(){
    // Pre-fill from current __QDC values
    const q = window.__QDC||{};
    const cli = document.getElementById('wa-clinic-phone');
    const doc = document.getElementById('wa-doctor-phone');
    const mgr = document.getElementById('wa-manager-phone');
    if(cli && q.CLINIC_PHONE)  cli.value = q.CLINIC_PHONE;
    if(doc && q.DOCTOR_PHONE)  doc.value = q.DOCTOR_PHONE;
  },

  async testWhatsApp(){
    const msg  = document.getElementById('wa-config-msg');
    const phone= document.getElementById('wa-clinic-phone')?.value.trim();
    if(!phone){ if(msg){msg.textContent='Fill in clinic phone first.';msg.className='qdc-msg err';} return; }
    if(msg){msg.textContent='⌛ Sending test…';msg.className='qdc-msg';}
    try {
      // Phone normalize: strip non-digits, 0→880, bare→880
      let _rawP = String(phone||'').replace(/\D/g,'');
      if (_rawP.startsWith('0')) _rawP = '880' + _rawP.slice(1);
      else if (!_rawP.startsWith('880')) _rawP = '880' + _rawP;
      if (typeof window._waSendChat !== 'function') {
        throw new Error('WhatsApp helper not loaded');
      }
      const r = await window._waSendChat(_rawP+'@c.us', '✅ Quick Dental Care — WhatsApp test message. Your configuration is working correctly.');
      const d = await r.json();
      if(d.idMessage){ if(msg){msg.textContent='✅ Test message sent successfully!';msg.className='qdc-msg ok';} }
      else throw new Error(JSON.stringify(d).slice(0,200));
    } catch(e){ if(msg){msg.textContent='⚠ Test failed: '+e.message;msg.className='qdc-msg err';} }
  },

  async saveWhatsAppConfig(){
    const cli   = document.getElementById('wa-clinic-phone')?.value.trim();
    const doc   = document.getElementById('wa-doctor-phone')?.value.trim();
    const mgr   = document.getElementById('wa-manager-phone')?.value.trim();
    const msg   = document.getElementById('wa-config-msg');
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(msg){msg.textContent='⌛ Saving phones…';msg.className='qdc-msg';}
    try {
      const params = new URLSearchParams({action:'saveWhatsAppConfig',
        clinicPhone:cli||'', doctorPhone:doc||'', managerPhone:mgr||''});
      const r = await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Server error');
      if(msg){msg.textContent='✅ Phone numbers saved!';msg.className='qdc-msg ok';}
    } catch(e){
      if(msg){msg.textContent='⚠ Save failed: '+e.message;msg.className='qdc-msg err';}
    }
  },

  async load(){
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('automation-msg');
    this._initConfigFields();
    try {
      const resp=await fetch(`${proxy}&action=getAutomations${QDC_staff._hipaaParams()}`);
      const d=await resp.json();
      this._flags=d.automations||{};
      this._render();
    } catch(err){ if(msg){msg.textContent='⚠ '+err.message;msg.className='qdc-msg err';} }
  },
  _render(){
    const el=document.getElementById('automation-list'); if(!el) return;
    const flags=Object.keys(this._labels);
    el.innerHTML=flags.map(f=>{
      const on=this._flags[f]!==false;
      const desc=this._descriptions?.[f]||'';
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--bg2);border:1px solid var(--border);padding:16px 22px;border-radius:4px;min-width:0">
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;color:var(--text);margin-bottom:3px">${this._labels[f]}</div>
          <div style="font-size:.78rem;color:var(--text2);margin-bottom:4px">${desc}</div>
          <div style="font-size:.68rem;color:var(--text3);font-family:monospace">AUTO_${f.toUpperCase()}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0">
          <div onclick="QDC_automation.toggle('${f}')" style="width:48px;height:26px;border-radius:13px;background:${on?'var(--crimson)':'#ccc'};position:relative;transition:background .25s;cursor:pointer">
            <div style="width:22px;height:22px;background:#fff;border-radius:50%;position:absolute;top:2px;${on?'right:2px':'left:2px'};transition:all .25s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>
          </div>
          <span style="font-size:.72rem;font-weight:600;color:${on?'var(--open)':'var(--text3)'}">${on?'ON':'OFF'}</span>
        </div>
      </div>`;
    }).join('');
  },
  async toggle(flag){
    const prev   = this._flags[flag] !== false;
    const newVal = !prev;
    this._flags[flag] = newVal;
    this._render(); // instant UI update
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      const r = await fetch(`${proxy}&action=setAutomation&flag=${flag}&value=${newVal}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if (!d.ok) throw new Error(d.error||'Server rejected toggle');
    } catch(e) {
      // Revert UI to match reality
      this._flags[flag] = prev;
      this._render();
      const msg = document.getElementById('automation-msg');
      if (msg) { msg.textContent = '⚠ Toggle failed: ' + e.message; msg.className = 'qdc-msg err'; }
    }
  }
};

/* ─── SEO ENGINE ─── */
window.QDC_seo = {
  help(topic){
    const topics = {
      ga_traffic: {
        title: '📊 Site Traffic — Google Analytics 4',
        body:  'Live visitor data is available in your <b>Google Analytics 4 (GA4)</b> dashboard — it cannot be embedded directly here for security reasons.<br><br>Click <b>Open Google Analytics ↗</b> to see: how many visitors your site gets daily, where they come from (Google, Facebook, WhatsApp), which pages they read, and how long they stay.<br><br>To set up GA4: go to analytics.google.com → Create Property → enter your domain → copy the Measurement ID (G-XXXXXXXXXX) → paste it in the Google Analytics 4 section below.'
      },
      income_tax: {
        title: '🧾 How to Pay Bangladesh Income Tax',
        body:  '<b>Step 1 — Get a TIN (Tax Identification Number)</b><br>Register at <a href="https://secure.incometax.gov.bd" target="_blank" style="color:var(--crimson)">secure.incometax.gov.bd</a> with your NID. Your TIN is required for all filings.<br><br><b>Step 2 — File your return online (eTax)</b><br>Go to <a href="https://etaxnbr.gov.bd" target="_blank" style="color:var(--crimson)">etaxnbr.gov.bd</a> → Log in → Select the assessment year → Fill in your income details → Submit.<br><br><b>Step 3 — Pay online via iBAS++</b><br>After filing, use the challan generated to pay via mobile banking (bKash, Nagad, Rocket) or bank transfer directly on the eTax portal. No need to visit a tax office.<br><br><b>Deadline:</b> 30 November each year (for the FY ending 30 June).<br><br><b>For businesses / clinics:</b> A clinic is typically assessed as a sole proprietorship. Consult a CA or tax consultant for the first year — their fee (৳3,000–8,000) is usually worth it to avoid notices.<br><br><a href="https://etaxnbr.gov.bd" target="_blank" style="background:var(--crimson);color:#fff;padding:6px 14px;text-decoration:none;border-radius:2px;font-size:.82rem;display:inline-block;margin-top:6px">→ Open NBR eTax Portal</a>'
      },
      zakat_nisab: {
        title: '☪ Zakat Nisab — Gold Price',
        body:  'The Nisab threshold is the minimum wealth you must have for Zakat to be obligatory. It equals the value of <b>85 grams of gold</b>.<br><br>The gold price changes daily — you should update this field with the current gold price before calculating.<br><br><b>To find today\'s rate:</b><br>• Check <a href="https://www.gold.org/goldhub/data/gold-prices" target="_blank" style="color:var(--crimson)">World Gold Council ↗</a> for international rates<br>• Or check a local jeweller in Sylhet for the Bangladesh market rate<br>• Multiply the price per gram by 85 to get the current Nisab in BDT<br><br><b>Example:</b> If gold is ৳9,000/gram → Nisab = 85 × 9,000 = <b>৳7,65,000</b>'
      },
      meta_tags: {
        title: '🏷 Meta Tags',
        body:  '<b>Page Title</b> — The blue link text shown in Google search results. Keep it under 60 characters. Include your clinic name and location.<br><br><b>Meta Description</b> — The grey summary text under the title in search results. Keep it 120–160 characters. Describe your clinic and services clearly.<br><br><b>Keywords</b> — A comma-separated list of search terms you want to rank for. Google does not use this directly for ranking anymore, but it helps organise your content strategy.<br><br>Click <b>Apply to Page</b> to update the live page, then <b>Check Score</b> to see how well your tags are optimised.'
      },
      ga4: {
        title: '📈 Google Analytics 4',
        body:  'GA4 is Google\'s free tool to see how many people visit your website, where they come from (Google, Facebook, WhatsApp), which pages they read, and how long they stay.<br><br><b>How to set up:</b><br>1. Go to analytics.google.com and sign in with your Google account<br>2. Click Admin → Create Property → enter your clinic name<br>3. Choose Web, enter <code>quickdental.com.bd</code><br>4. Copy the Measurement ID that starts with <code>G-</code><br>5. Paste it here and click "Add GA4"<br><br>After 24–48 hours, real visitor data will appear in your chart.'
      },
      search_console: {
        title: '🔍 Google Search Console',
        body:  'Search Console tells Google your website exists and helps it index (add) your pages faster. Without it, Google may take weeks to find new pages.<br><br><b>Why it matters:</b> After you update your website, you can use Search Console to tell Google "re-index this page" and it will usually appear in search results within hours instead of weeks.<br><br><b>Verify ownership</b> by adding a small HTML tag to your website — your hosting provider can help with this if needed.'
      },
      checklist: {
        title: '✅ SEO Score Checklist',
        body:  'This checklist checks your current page for common SEO issues:<br><br>• <b>Title length</b> — should be 30–60 characters<br>• <b>Description length</b> — should be 120–160 characters<br>• <b>H1 heading</b> — the page should have exactly one main heading<br>• <b>Canonical tag</b> — tells Google the official URL of your page<br>• <b>Schema markup</b> — structured data that helps Google show rich results (star ratings, opening hours, etc.)<br>• <b>Image alt text</b> — descriptions on images help Google understand them<br><br>Click <b>Check Score</b> above to run the check.'
      },
      sitemap: {
        title: '🗺 Sitemap Generator',
        body:  'A sitemap.xml is a file that lists all the pages on your website. You give it to Google so it knows exactly what to index.<br><br><b>How to use:</b><br>1. Enter your domain (e.g. <code>https://quickdental.com.bd</code>)<br>2. Click Generate — a sitemap.xml file will download<br>3. Upload it to your website root (same folder as your HTML file)<br>4. Go to Google Search Console → Sitemaps → add <code>sitemap.xml</code><br><br>This is one of the most important steps for ranking above competitors.'
      },
      schema: {
        title: '🧩 JSON-LD Schema',
        body:  'Schema markup is invisible code that tells Google extra details about your business — your address, phone number, opening hours, doctors, star ratings, and services.<br><br>When Google understands this, your listing can show <b>rich results</b> in search — like star ratings, opening hours, and a knowledge panel on the right side of results.<br><br>Click <b>Generate Schema</b> to create the code, then copy it and paste it into the &lt;head&gt; section of your HTML file (or replace the existing schema block).'
      },
      og_preview: {
        title: '🌐 Open Graph Preview',
        body:  'When someone shares your website link on WhatsApp, Facebook, or other platforms, a preview card appears. This tool shows you what that card will look like.<br><br>The preview uses your page\'s <b>og:title</b>, <b>og:description</b>, and <b>og:image</b> tags. You set these in the Meta Tags section above. A good preview card gets more clicks from shared links.'
      },
      listings: {
        title: '📋 Business Listing Directories',
        body:  'Beyond Google, your clinic should be listed on other websites — Practo, JustDial, Facebook, Bing Maps, Apple Maps, etc. Each listing creates a <b>backlink</b> to your website, which helps your Google ranking.<br><br>More importantly, many patients search on Practo or JustDial directly, so these listings bring extra patients who never use Google.<br><br>Click each directory link to open their registration page and add your clinic details. Keep your name, address, and phone number identical on every directory.'
      },
      keyword_density: {
        title: '🔎 Keyword Density Analyzer',
        body:  'Keyword density is how often a search term appears on your page as a percentage of total words. Google uses this to understand what your page is about.<br><br><b>Ideal density:</b> 1–3% for your main keyword (e.g. "dental implant Sylhet"). Too low and Google may not associate your page with that term. Too high (keyword stuffing) can actually hurt your ranking.<br><br><b>How to use:</b> Copy the text content from your website page, paste it here, and set your target keyword. The tool shows density and the most frequent terms — helping you identify if you\'re missing important words or overusing others.'
      },
      pagespeed: {
        title: '⚡ PageSpeed Insights',
        body:  'Google uses page speed as a ranking factor — faster websites rank higher. PageSpeed Insights (PSI) gives your website a score from 0–100 on mobile and desktop, and tells you exactly what to fix.<br><br><b>What to aim for:</b> 90+ is good, 70–90 is acceptable for most clinic sites. Below 70 may hurt your ranking.<br><br><b>Common fixes:</b> Compress large images, remove unused JavaScript, enable browser caching, and use a fast hosting provider.<br><br>Click "Test Mobile" or "Test Desktop" to open Google\'s free PSI tool directly for your URL.'
      },
      robots_txt: {
        title: '🤖 robots.txt Generator',
        body:  'The <code>robots.txt</code> file tells search engine bots (Googlebot, Bingbot, etc.) which pages they are and aren\'t allowed to crawl.<br><br><b>Why it matters:</b> Without a robots.txt, bots may waste time crawling login pages, admin panels, or duplicate content — pages you don\'t want indexed. A good robots.txt points bots to your sitemap and keeps them focused on your public pages.<br><br><b>How to use:</b> Generate the file here, download it, and upload it to the root of your website (same folder as your HTML file). It must be accessible at <code>https://quickdental.com.bd/robots.txt</code>.'
      },
      competitor: {
        title: '🏆 Competitor Analysis',
        body:  'This tool helps you understand why competitor dental clinics rank higher than you and what you can do about it.<br><br><b>Domain Authority (DA)</b> — A score 1–100 showing how trusted a website is. Higher DA = easier to rank. You build DA by getting other websites to link to you (backlinks).<br><br><b>Top Keyword</b> — The main search term a site ranks for. If a competitor ranks for "best dentist Sylhet" and you don\'t, you need to create content using that phrase.<br><br><b>Page Speed</b> — If you\'re faster than competitors, Google may prefer your site.<br><br><b>Backlinks</b> — Links from other websites pointing to yours. The more quality backlinks you have, the higher you rank. Getting listed on Practo, JustDial, newspapers, and local blogs creates backlinks.'
      },
    };
    const t = topics[topic];
    if(!t) return;
    const ov = document.getElementById('seo-help-overlay');
    document.getElementById('seo-help-title').textContent = t.title;
    document.getElementById('seo-help-body').innerHTML  = t.body;
    if(ov){ ov.style.display='flex'; }
  },
  init(){
    const t=document.getElementById('seo-title');
    if(t) t.value=document.title;
    const desc=document.querySelector('meta[name="description"]');
    const d=document.getElementById('seo-desc');
    if(desc&&d) d.value=desc.getAttribute('content')||'';
    const kw=document.querySelector('meta[name="keywords"]');
    const k=document.getElementById('seo-keywords');
    if(kw&&k) k.value=kw.getAttribute('content')||'';
    // Sync OG fields
    const ogTitle=document.querySelector('meta[property="og:title"]');
    const ogDesc=document.querySelector('meta[property="og:description"]');
    const ogImg=document.querySelector('meta[property="og:image"]');
    if(ogTitle){ const el=document.getElementById('og-title'); if(el) el.value=ogTitle.getAttribute('content')||document.title; }
    if(ogDesc){ const el=document.getElementById('og-desc'); if(el) el.value=ogDesc.getAttribute('content')||''; }
    if(ogImg){ const el=document.getElementById('og-image'); if(el) el.value=ogImg.getAttribute('content')||''; }
    this.renderCitations();
    this.updateOGPreview();
    this.generateSchema();
    this.generateRobots();
  },
  applyAll(){
    const msg   = document.getElementById('seo-apply-msg');
    const setMsg = (txt, ok=true) => { if(msg){ msg.textContent=txt; msg.style.color=ok?'var(--open)':'var(--closed)'; } };
    setMsg('⌛ Applying all SEO settings…');

    // 1. Collect all values
    const title   = document.getElementById('seo-title')?.value.trim()    || document.title;
    const desc    = document.getElementById('seo-desc')?.value.trim()     || '';
    const kw      = document.getElementById('seo-keywords')?.value.trim() || '';
    const ogTitle = document.getElementById('og-title')?.value.trim()     || title;
    const ogDesc  = document.getElementById('og-desc')?.value.trim()      || desc;
    const ogImg   = document.getElementById('og-image')?.value.trim()     || '';
    const ogDomain= document.getElementById('og-domain')?.value.trim()    || 'quickdental.com.bd';
    const ga4Id   = document.getElementById('ga-measurement-id')?.value.trim() || '';
    const schema  = document.getElementById('schema-output')?.value.trim()     || '';

    // 2. Apply to live page in memory
    try {
      document.title = title;
      const setMeta = (sel, val) => {
        document.querySelectorAll(sel).forEach(el => el.setAttribute('content', val));
      };
      if(desc)  setMeta('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]', desc);
      if(kw)    { const m=document.querySelector('meta[name="keywords"]'); if(m) m.setAttribute('content',kw); }
      if(ogTitle){ setMeta('meta[property="og:title"],meta[name="twitter:title"]', ogTitle); }
      if(ogDesc)  setMeta('meta[property="og:description"]', ogDesc);
      if(ogImg)   setMeta('meta[property="og:image"],meta[name="twitter:image"]', ogImg);
    } catch(e){ /* live update is best-effort */ }

    // 3. Get current HTML source and patch it
    try {
      let src = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

      // --- helpers ---
      const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const replaceAttr = (html, tagPat, attr, val) =>
        html.replace(new RegExp('(<'+tagPat+'[^>]*'+attr+'=["\'])[^"\']*(["\'][^>]*>)','gi'), '$1'+esc(val)+'$2');

      // Title
      if(title) src = src.replace(/<title>[^<]*<\/title>/i, '<title>'+esc(title)+'</title>');

      // Meta tags (content= before or after name=/property= )
      const patchMeta = (html, nameOrProp, val) => {
        // Format 1: name="x" content="y"  OR  property="x" content="y"
        html = html.replace(
          new RegExp('(<meta[^>]*(name|property)=["\']'+nameOrProp+'["\'][^>]*content=["\'])[^"\']*(["\'])','gi'),
          '$1'+esc(val)+'$3'
        );
        // Format 2: content="y" name="x"
        html = html.replace(
          new RegExp('(<meta[^>]*content=["\'])[^"\']*(["\'][^>]*(name|property)=["\']'+nameOrProp+'["\'])','gi'),
          '$1'+esc(val)+'$2'
        );
        return html;
      };
      if(desc)    src = patchMeta(src, 'description', desc);
      if(kw)      src = patchMeta(src, 'keywords', kw);
      if(ogTitle) src = patchMeta(src, 'og:title', ogTitle);
      if(ogTitle) src = patchMeta(src, 'twitter:title', ogTitle);
      if(ogDesc)  src = patchMeta(src, 'og:description', ogDesc);
      if(ogDesc)  src = patchMeta(src, 'twitter:description', ogDesc);
      if(ogImg)   src = patchMeta(src, 'og:image', ogImg);
      if(ogImg)   src = patchMeta(src, 'twitter:image', ogImg);
      if(ogDomain){ src = patchMeta(src, 'og:url', 'https://'+ogDomain+'/'); }

      // GA4 — inject or replace gtag script
      if(ga4Id){
        const S = '<'+'script', E = '<'+'/script>';
        const gtagBlock = S+' async src="https://www.googletagmanager.com/gtag/js?id='+ga4Id+'">'+E+'\n'+
          S+'>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag(\'js\',new Date());gtag(\'config\',\''+ga4Id+'\');'+E;
        const gaRe = new RegExp(S.replace('<','<')+' async[^>]+googletagmanager[^>]+>'+E+'[\\s\\S]*?'+S+'>window\\.dataLayer[\\s\\S]*?'+E,'i');
        if(src.includes('googletagmanager.com/gtag/js')){
          src = src.replace(gaRe, gtagBlock);
        } else {
          src = src.replace('</head>', gtagBlock+'\n</head>');
        }
      }

      // Schema — replace the Dentist schema block if a new one was generated
      if(schema && schema.length > 50){
        const S2 = '<'+'script', E2 = '<'+'/script>';
        const schemaTag = S2+' type="application/ld+json">'+schema+E2;
        const schRe = new RegExp(S2+' type="application/ld\\+json">\\s*\\{[\\s\\S]*?"@type"\\s*:\\s*"Dentist"[\\s\\S]*?'+E2,'i');
        if(src.includes('"@type":"Dentist"')){
          src = src.replace(schRe, schemaTag);
        } else {
          src = src.replace('</head>', schemaTag+'\n</head>');
        }
      }

      // Download
      const blob = new Blob([src], {type:'text/html;charset=utf-8'});
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'quickdental_fixed.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
      setMsg('✅ Done! Downloaded updated HTML. Replace your live file with this one.');
    } catch(err){
      setMsg('⚠ Failed: '+err.message, false);
    }
  },

  applyMeta(){
    // Legacy alias — just call applyAll
    this.applyAll();
  },
  checkScore(){
    const title=document.getElementById('seo-title')?.value||document.title;
    const desc=document.getElementById('seo-desc')?.value||'';
    const kw=document.getElementById('seo-keywords')?.value||'';
    const checks=[
      [title.length>=30&&title.length<=70,  'Page title is '+title.length+' chars (ideal: 30–70)'],
      [desc.length>=120&&desc.length<=160,   'Meta description is '+desc.length+' chars (ideal: 120–160)'],
      [kw.split(',').length>=10,             'Keywords: '+kw.split(',').length+' terms (aim for 15+)'],
      [title.toLowerCase().includes('sylhet'),'Title contains location keyword "Sylhet"'],
      [desc.toLowerCase().includes('dental'), 'Description mentions "dental"'],
      [document.querySelectorAll('h1').length===1,'Page has exactly 1 H1 tag'],
      [document.querySelectorAll('img[alt]').length>0,'Images have alt text'],
    ];
    const el=document.getElementById('seo-checklist'); if(!el) return;
    const score=Math.round(checks.filter(([ok])=>ok).length/checks.length*100);
    const scoreColor=score>=80?'var(--open)':score>=60?'var(--gold)':'var(--closed)';
    el.innerHTML=`<div style="font-size:1.2rem;font-weight:700;color:${scoreColor};margin-bottom:10px">SEO Score: ${score}/100</div>`
      +checks.map(([ok,msg])=>`<div style="color:${ok?'var(--open)':'var(--closed)'};margin-bottom:3px;font-size:.84rem">${ok?'✓':'✗'} ${msg}</div>`).join('');
  },
  addGA4(){
    const id=(document.getElementById('ga-measurement-id')?.value||'').trim();
    if(!id||!id.startsWith('G-')){ alert('Enter a valid GA4 Measurement ID starting with G-'); return; }
    if(document.getElementById('_ga4_script')){ alert('GA4 already added for this session.'); return; }
    const s1=document.createElement('script'); s1.id='_ga4_script';
    s1.async=true; s1.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.appendChild(s1);
    const s2=document.createElement('script');
    s2.textContent='window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","'+id+'");';
    document.head.appendChild(s2);
    const status=document.getElementById('ga-status');
    if(status){ status.innerHTML='✅ GA4 ('+id+') active for this session · <a href="https://analytics.google.com" target="_blank" style="color:var(--crimson)">View Analytics ↗</a>'; status.style.color='var(--open)'; }
    // To make permanent, add this to your HTML <head>:
    // GA4 added — see google.com/analytics for permanent setup
  },
  connectGA(){ setTimeout(()=>document.getElementById('ga-measurement-id')?.focus(), 100); },
  generateSitemap(){
    const domain = (document.getElementById('seo-domain')?.value||'https://quickdental.com.bd').replace(/\/+$/,'');
    const now = new Date().toISOString().slice(0,10);
    const pages = [
      {url:'/',priority:'1.0',freq:'weekly'},
      {url:'/#services',priority:'0.9',freq:'monthly'},
      {url:'/#doctors',priority:'0.9',freq:'monthly'},
      {url:'/#implants',priority:'0.8',freq:'monthly'},
      {url:'/#aligners',priority:'0.8',freq:'monthly'},
      {url:'/#braces',priority:'0.8',freq:'monthly'},
      {url:'/#reviews',priority:'0.7',freq:'monthly'},
      {url:'/#location',priority:'0.7',freq:'monthly'},
      {url:'/#appointment',priority:'0.9',freq:'weekly'},
      {url:'/#faq',priority:'0.6',freq:'monthly'},
    ];
    const urlTag = 'url';
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + pages.map(p=>'  <'+urlTag+'>\n    <loc>'+domain+p.url+'</loc>\n    <lastmod>'+now+'</lastmod>\n    <changefreq>'+p.freq+'</changefreq>\n    <priority>'+p.priority+'</priority>\n  </'+urlTag+'>').join('\n')
      + '\n</urlset>';
    const blob = new Blob([xml],{type:'application/xml'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  },
  /* ── JSON-LD SCHEMA GENERATOR ── */
  generateSchema(){
    const domain=(document.getElementById('schema-domain')?.value||'https://quickdental.com.bd').replace(/\/+$/,'');
    const phone=(document.getElementById('schema-phone')?.value||'+8801307978439').trim();
    const schema={
      '@context':'https://schema.org',
      '@type':'Dentist',
      name:'Quick Dental Care',
      url: domain,
      telephone: phone,
      image: domain+'/logo.png',
      description:'Quick Dental Care — best dental clinic in Sylhet, Bangladesh. Dental implants, braces, root canal, aligners.',
      address:{'@type':'PostalAddress',streetAddress:'Akhalia',addressLocality:'Sylhet',addressRegion:'Sylhet Division',addressCountry:'BD'},
      geo:{'@type':'GeoCoordinates',latitude:'24.8949',longitude:'91.8687'},
      openingHoursSpecification:[
        {'@type':'OpeningHoursSpecification',dayOfWeek:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],opens:'12:00',closes:'21:00'},
        {'@type':'OpeningHoursSpecification',dayOfWeek:['Friday'],opens:'16:00',closes:'21:00'}
      ],
      medicalSpecialty:'Dentistry',
      employee:[
        {'@type':'Physician',name:'Dr. Marjana Siddique Moury',jobTitle:'Chief Dental Consultant'},
        {'@type':'Physician',name:'Dr. Tasnia Binte Mahbub',jobTitle:'Pediatric Dental Consultant'}
      ],
      sameAs:['https://www.facebook.com/quickdentalcare']
    };
    const out=document.getElementById('schema-output');
    if(out){ out.value=JSON.stringify(schema,null,2); }
  },
  copySchema(){
    const out=document.getElementById('schema-output');
    if(!out) return;
    navigator.clipboard.writeText(out.value).then(()=>{
      const btn=document.getElementById('schema-copy-btn');
      if(btn){ const orig=btn.textContent; btn.textContent='✓ Copied!'; btn.style.color='var(--open)'; setTimeout(()=>{ btn.textContent=orig; btn.style.color=''; },2000); }
    });
  },
  downloadSchema(){
    const out=document.getElementById('schema-output');
    if(!out||!out.value) return;
    const wrap='<scr'+'ipt type="application/ld+json">\n'+out.value+'\n</'+'script>';
    const blob=new Blob([wrap],{type:'text/html'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='schema.html'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  },

  /* ── KEYWORD DENSITY ANALYZER ── */
  analyzeKeywords(){
    const text=(document.getElementById('kd-input')?.value||'').toLowerCase();
    const target=(document.getElementById('kd-target')?.value||'').toLowerCase().trim();
    const out=document.getElementById('kd-output'); if(!out) return;
    if(!text.trim()){ out.innerHTML='<span style="color:var(--text3)">Paste some content above to analyse.</span>'; return; }
    const words=text.match(/\b[a-z][a-z\-']{1,}\b/g)||[];
    const total=words.length;
    const freq={};
    words.forEach(w=>{ freq[w]=(freq[w]||0)+1; });
    // Remove stop words
    const stop=new Set(['the','and','is','in','of','to','a','an','for','on','with','at','by','from','as','be','this','that','are','was','has','have','it','its','or','not','but','your','you','our','we','can','will','all','also','more','their','been','they','which','who','when','if','one','so','up','out','about','than','do','into','my','how','what','there','i','am','use','he','she','her','him','his','no','any','these','those','each','just','over','after','before','us']);
    const filtered=Object.entries(freq).filter(([w])=>!stop.has(w)).sort((a,b)=>b[1]-a[1]).slice(0,20);
    let html='<div style="font-size:.75rem;color:var(--text3);margin-bottom:10px">Total words: <strong style="color:var(--text)">'+total+'</strong></div>';
    if(target){
      const tCount=freq[target]||0;
      const tDens=total?((tCount/total)*100).toFixed(2):0;
      const tColor=tDens>=0.5&&tDens<=2.5?'var(--open)':tDens>2.5?'var(--closed)':'var(--gold)';
      html+=`<div style="background:var(--surface);border:1px solid var(--border);padding:10px 14px;margin-bottom:12px;border-left:3px solid ${tColor}">
        <span style="font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text3)">Target: </span>
        <strong style="color:var(--text)">"${target}"</strong> — 
        <span style="color:${tColor};font-weight:700">${tCount}x</span> 
        <span style="color:var(--text3);font-size:.82rem">(${tDens}% density · ideal: 0.5–2.5%)</span>
      </div>`;
    }
    html+='<div style="display:flex;flex-direction:column;gap:4px">';
    filtered.forEach(([w,c],i)=>{
      const pct=((c/total)*100).toFixed(2);
      const barW=Math.min(100,(c/filtered[0][1])*100).toFixed(0);
      const col=pct>2.5?'var(--closed)':pct>=0.5?'var(--open)':'var(--text3)';
      html+=`<div style="display:grid;grid-template-columns:120px 1fr 50px 44px;align-items:center;gap:8px;font-size:.8rem">
        <span style="color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${i+1}. ${w}</span>
        <div style="background:var(--surface);border-radius:2px;height:6px;overflow:hidden"><div style="width:${barW}%;height:100%;background:${col};border-radius:2px"></div></div>
        <span style="color:var(--text2);text-align:right">${c}x</span>
        <span style="color:${col};font-weight:600;text-align:right">${pct}%</span>
      </div>`;
    });
    html+='</div>';
    out.innerHTML=html;
  },

  /* ── PAGESPEED INSIGHTS ── */
  launchPageSpeed(strategy){
    const url=(document.getElementById('ps-url')?.value||'https://quickdental.com.bd').trim();
    const link=`https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}&strategy=${strategy}`;
    window.open(link,'_blank');
  },
  launchLighthouse(){
    const url=(document.getElementById('ps-url')?.value||'https://quickdental.com.bd').trim();
    window.open('https://googlechrome.github.io/lighthouse/viewer/?psiurl='+encodeURIComponent(url),'_blank');
  },

  /* ── ROBOTS.TXT GENERATOR ── */
  generateRobots(){
    const domain=(document.getElementById('robots-domain')?.value||'https://quickdental.com.bd').replace(/\/+$/,'');
    const blockAI=document.getElementById('robots-block-ai')?.checked;
    const disallowAdmin=document.getElementById('robots-disallow-admin')?.checked;
    let txt='User-agent: *\n';
    if(disallowAdmin) txt+='Disallow: /admin/\nDisallow: /staff/\nDisallow: /portal/\n';
    txt+='Disallow: /cdn-cgi/\nAllow: /\n';
    if(blockAI){
      txt+='\n# Block AI crawlers\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: anthropic-ai\nDisallow: /\n';
    }
    txt+='\nSitemap: '+domain+'/sitemap.xml\n';
    const out=document.getElementById('robots-output');
    if(out) out.value=txt;
  },
  downloadRobots(){
    const out=document.getElementById('robots-output');
    if(!out||!out.value.trim()) return;
    const blob=new Blob([out.value],{type:'text/plain'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='robots.txt'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  },

  /* ── LOCAL CITATION TRACKER ── */
  _citations:[
    {id:'gmc',   name:'Google Business Profile', url:'https://business.google.com',       priority:'Critical'},
    {id:'practo', name:'Practo',                  url:'https://www.practo.com',             priority:'High'},
    {id:'justdial',name:'JustDial',               url:'https://www.justdial.com',           priority:'High'},
    {id:'fb',    name:'Facebook Page',            url:'https://facebook.com/business',      priority:'High'},
    {id:'yelp',  name:'Yelp',                     url:'https://biz.yelp.com',               priority:'Medium'},
    {id:'foursq',name:'Foursquare',               url:'https://foursquare.com/add-venue',   priority:'Medium'},
    {id:'bing',  name:'Bing Places',              url:'https://www.bingplaces.com',          priority:'High'},
    {id:'apple', name:'Apple Maps Connect',       url:'https://mapsconnect.apple.com',      priority:'Medium'},
    {id:'hlthgr',name:'Healthgrades',             url:'https://www.healthgrades.com',       priority:'Medium'},
    {id:'zocdoc',name:'Zocdoc',                   url:'https://www.zocdoc.com/for-doctors', priority:'Low'},
  ],
  _citationState(){
    try{ return JSON.parse(localStorage.getItem('qdc_citations')||'{}'); }catch(e){ return {}; }
  },
  _saveCitationState(state){ try{ localStorage.setItem('qdc_citations',JSON.stringify(state)); }catch(e){} },
  renderCitations(){
    const el=document.getElementById('citation-list'); if(!el) return;
    const state=this._citationState();
    const prioColor={Critical:'var(--crimson)',High:'var(--gold)',Medium:'rgba(201,151,58,.5)',Low:'var(--text3)'};
    el.innerHTML=this._citations.map(c=>{
      const done=!!state[c.id];
      return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);font-size:.84rem">
        <button onclick="QDC_seo.toggleCitation('${c.id}')" style="width:22px;height:22px;border-radius:3px;border:1.5px solid ${done?'var(--open)':'var(--border)'};background:${done?'var(--open)':'transparent'};cursor:pointer;flex-shrink:0;color:#fff;font-size:.7rem;display:flex;align-items:center;justify-content:center">${done?'✓':''}</button>
        <a href="${c.url}" target="_blank" style="color:${done?'var(--text3)':'var(--text)'};text-decoration:${done?'line-through':'none'};flex:1">${c.name}</a>
        <span style="font-size:.72rem;padding:2px 8px;border:1px solid ${prioColor[c.priority]};color:${prioColor[c.priority]}">${c.priority}</span>
      </div>`;
    }).join('');
    const done=Object.values(this._citationState()).filter(Boolean).length;
    const prog=document.getElementById('citation-progress');
    if(prog){ const pct=Math.round(done/this._citations.length*100); prog.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:.78rem;color:var(--text3);margin-bottom:6px"><span>${done}/${this._citations.length} completed</span><span>${pct}%</span></div><div style="background:var(--surface);border-radius:2px;height:6px"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--crimson),var(--gold));border-radius:2px;transition:width .4s"></div></div>`; }
  },
  toggleCitation(id){
    const state=this._citationState();
    state[id]=!state[id];
    this._saveCitationState(state);
    this.renderCitations();
  },

  /* ── OG / WHATSAPP LINK PREVIEW ── */
  updateOGPreview(){
    const title=document.getElementById('og-title')?.value||document.title;
    const desc=document.getElementById('og-desc')?.value||'Quick Dental Care — best dental clinic in Sylhet.';
    const imgUrl=document.getElementById('og-image')?.value||'';
    const domain=(document.getElementById('og-domain')?.value||'quickdental.com.bd').replace(/https?:\/\//,'');
    document.getElementById('og-prev-title').textContent=title.slice(0,60)+(title.length>60?'…':'');
    document.getElementById('og-prev-desc').textContent=desc.slice(0,120)+(desc.length>120?'…':'');
    document.getElementById('og-prev-domain').textContent=domain.toUpperCase();
    const img=document.getElementById('og-prev-img');
    if(imgUrl){ img.style.backgroundImage=`url(${imgUrl})`; img.style.backgroundSize='cover'; img.style.backgroundPosition='center'; img.textContent=''; }
    else{ img.style.backgroundImage=''; img.textContent='🦷'; }
    const tLen=title.length, dLen=desc.length;
    document.getElementById('og-title-len').textContent=tLen+'/60 '+(tLen>60?'⚠ Too long':'✓');
    document.getElementById('og-title-len').style.color=tLen>60?'var(--closed)':'var(--open)';
    document.getElementById('og-desc-len').textContent=dLen+'/160 '+(dLen>160?'⚠ Too long':'✓');
    document.getElementById('og-desc-len').style.color=dLen>160?'var(--closed)':'var(--open)';
  },
  applyOGTags(){
    const title=document.getElementById('og-title')?.value||'';
    const desc=document.getElementById('og-desc')?.value||'';
    const imgUrl=document.getElementById('og-image')?.value||'';
    if(title){ document.querySelectorAll('meta[property="og:title"]').forEach(m=>m.setAttribute('content',title)); }
    if(desc){ document.querySelectorAll('meta[property="og:description"]').forEach(m=>m.setAttribute('content',desc)); }
    if(imgUrl){ document.querySelectorAll('meta[property="og:image"]').forEach(m=>m.setAttribute('content',imgUrl)); }
    const fb=document.getElementById('og-apply-msg');
    if(fb){ fb.textContent='✅ OG tags updated for this session. Use Apply to Page above to save to file.'; fb.style.color='var(--open)'; setTimeout(()=>fb.textContent='',3000); }
  },

  /* ── COMPETITOR ANALYSIS ── */
  analyzeCompetitor(){
    const url=(document.getElementById('comp-url')?.value||'').trim();
    if(!url){ alert('Enter a competitor URL to analyse.'); return; }
    const enc=encodeURIComponent(url);
    const tools=[
      {name:'SEMrush Overview',   link:`https://www.semrush.com/analytics/overview/?q=${enc}&searchType=domain`},
      {name:'Ahrefs Site Explorer',link:`https://ahrefs.com/site-explorer/overview/v2/subdomains/live?target=${enc}`},
      {name:'Moz Domain Analysis', link:`https://moz.com/domain-analysis?site=${enc}`},
      {name:'PageSpeed (Mobile)',  link:`https://pagespeed.web.dev/report?url=${enc}&strategy=mobile`},
      {name:'PageSpeed (Desktop)', link:`https://pagespeed.web.dev/report?url=${enc}&strategy=desktop`},
      {name:'GTmetrix',            link:`https://gtmetrix.com/?url=${enc}`},
      {name:'SimilarWeb Traffic',  link:`https://www.similarweb.com/website/${url.replace(/https?:\/\//,'')}/`},
      {name:'Backlinks (Ahrefs)',  link:`https://ahrefs.com/backlink-checker/?input=${enc}`},
    ];
    const out=document.getElementById('comp-results'); if(!out) return;
    out.innerHTML=`<div style="font-size:.75rem;color:var(--text3);margin-bottom:10px">Analysing: <strong style="color:var(--gold)">${url}</strong> — click any tool to open:</div>`
      +`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">`
      +tools.map(t=>`<a href="${t.link}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--surface);border:1px solid var(--border);color:var(--text2);text-decoration:none;font-size:.82rem;transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--text)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">↗ ${t.name}</a>`).join('')
      +'</div>'
      +`<div style="margin-top:12px;font-size:.75rem;color:var(--text3)">⚠ These are third-party tools — some require a free account. SimilarWeb & Ahrefs provide the most useful free data.</div>`;
  },
  addCompetitorRow(){
    const tbl=document.getElementById('comp-compare-tbl'); if(!tbl) return;
    const row=document.createElement('tr');
    row.innerHTML=`<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><input class="qdc-input" placeholder="competitor.com" style="width:100%;font-size:.8rem;padding:6px 8px"></td>`
      +['DA','Traffic/mo','Top Keyword','Page Speed','Backlinks'].map(()=>`<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><input class="qdc-input" placeholder="—" style="width:100%;font-size:.8rem;padding:6px 8px;text-align:center"></td>`).join('');
    tbl.appendChild(row);
  }
};

/* ─── ATTENDANCE ENGINE ─── */
window.QDC_attendance = {
  _staffList: [],
  _records: [],
  _regMode: false,
  _regPollTimer: null,
  _editingStaff: null,

  async load(){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    const isAdmin   = QDC_staff._staffRole==='admin';
    const isMgr     = isAdmin || QDC_staff._staffRole==='manager';
    const regBtn    = document.getElementById('att-reg-btn');
    if(regBtn) regBtn.style.display = isAdmin ? '' : 'none';

    // Today's date
    const today = new Date().toISOString().slice(0,10);
    const el = document.getElementById('att-today-date');
    if(el) el.textContent = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

    // Load staff + today's attendance in parallel
    await this._loadStaff(true);
    try {
      const [attResp, whoResp] = await Promise.all([
        fetch(`${proxy}&action=getAttendance&from=${today}&to=${today}${QDC_staff._hipaaParams()}`),
        fetch(`${proxy}&action=getWhoIsIn${QDC_staff._hipaaParams()}`)
      ]);
      this._records = await attResp.json();
      const whoIn   = await whoResp.json();
      this._renderWhoIn(whoIn);
      this._renderStaffList(isMgr);
    } catch(e){
      const msg = document.getElementById('att-msg');
      if(msg){ msg.textContent='⚠ Could not load attendance: '+e.message; msg.className='qdc-msg err'; }
    }
  },

  _renderWhoIn(list){
    const el = document.getElementById('att-who-in');
    if(!el) return;
    if(!Array.isArray(list)||!list.length){
      el.innerHTML='<span style="color:var(--text3);font-size:.82rem">No one clocked in yet today</span>'; return;
    }
    el.innerHTML = list.map(p=>`
      <div style="background:rgba(15,158,96,.08);border:1px solid rgba(15,158,96,.25);padding:5px 12px;border-radius:20px;font-size:.8rem">
        <span style="color:var(--open);font-weight:600">${p.name||p.staffId}</span>
        <span style="color:var(--text3);margin-left:5px">in ${(()=>{
          const s=String(p.clockIn||'');
          if(!s||s==='undefined') return '—';
          // Handle "Sat Dec 30 1899..." or ISO "1899-12-30T..."
          if(s.includes('1899')||s.includes('1900')){
            try{ return new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}); }catch(e){}
          }
          // Plain HH:mm or HH:mm:ss
          if(/^\d{1,2}:\d{2}/.test(s)) return s.slice(0,5);
          // ISO with time
          if(s.includes('T')) try{ return new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}); }catch(e){}
          return s.slice(0,5)||'?';
        })()}</span>
        ${p.source==='NFC'?'<span style="font-size:.7rem;margin-left:3px">📱</span>':''}
      </div>`).join('');
  },

  _renderStaffList(isMgr){
    const el = document.getElementById('att-staff-list');
    if(!el) return;
    if(!this._staffList.length){ el.innerHTML='<div style="padding:20px;text-align:center;color:var(--text3)">No staff found</div>'; return; }
    const today = new Date().toISOString().slice(0,10);

    const rows = this._staffList.map(s=>{
      const sid  = s.id||s.StaffID||'';
      const nm   = s.name||s.Name||sid;
      const role = (s.role||s.Role||'').toLowerCase();
      // Find today's record for this staff
      const rec  = this._records.find(r=>String(r.StaffID||r.staffId)===sid && String(r.Date||r.date||'').slice(0,10)===today);
      // Robust time extractor — handles plain HH:mm, 1899 dates, ISO strings, "Sat Dec..."
      const _toTime = v => {
        if(!v && v !== 0) return '';
        const s = String(v).trim();
        if(!s || s==='undefined' || s==='null') return '';
        if(/^\d{1,2}:\d{2}/.test(s)) return s.slice(0,5);
        if(s.includes('1899')||s.includes('1900')||s.toLowerCase().startsWith('sat')||s.toLowerCase().startsWith('sun')||s.toLowerCase().startsWith('mon')||s.toLowerCase().startsWith('tue')||s.toLowerCase().startsWith('wed')||s.toLowerCase().startsWith('thu')||s.toLowerCase().startsWith('fri')){
          try{ return new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}); }catch(e){}
        }
        if(s.includes('T')) try{ return new Date(s).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}); }catch(e){}
        return s.slice(0,5);
      };
      const ci   = rec ? _toTime(rec.ClockIn||rec.clockIn) : '';
      const co   = rec ? _toTime(rec.ClockOut||rec.clockOut) : '';
      const hrs  = rec ? Number(rec.HoursWorked||rec.hoursWorked||0) : 0;
      const stat = rec ? String(rec.Status||rec.status||'') : '';
      // Expected times from NFC card registry (if available)
      const expIn  = s.expectedIn  || s.ExpectedIn  || '09:00';
      const expOut = s.expectedOut || s.ExpectedOut || '18:00';

      // Status badge
      let badge = '', badgeCol = '';
      if(!rec){ badge='NOT RECORDED'; badgeCol='var(--text3)'; }
      else if(stat.toLowerCase()==='absent'){ badge='ABSENT'; badgeCol='var(--closed)'; }
      else if(!ci){ badge='ABSENT'; badgeCol='var(--closed)'; }
      else if(ci > expIn){ badge='LATE'; badgeCol='var(--gold)'; }
      else { badge='ON TIME'; badgeCol='var(--open)'; }
      if(co && ci){ badge=(badge==='ABSENT'?'ABSENT':badge)+' • '+hrs+'h'; }
      if(ci && !co){ badge=(badge==='ABSENT'?'IN':badge)+' (no exit)'; badgeCol=badge.includes('LATE')?'var(--gold)':'var(--open)'; }

      // Clock In / Clock Out buttons
      const canClockIn  = !ci;
      const canClockOut = ci && !co;
      const isAdminRole = QDC_staff._staffRole === 'admin';
      const clockBtns = `
        ${canClockIn  ? `<button class="s-btn-sm" style="padding:4px 10px;font-size:.72rem;border-color:var(--open);color:var(--open)" onclick="QDC_attendance.doClockIn('${sid}','${nm}')">▶ Clock In</button>` : ''}
        ${canClockOut ? `<button class="s-btn-sm" style="padding:4px 10px;font-size:.72rem;border-color:var(--closed);color:var(--closed)" onclick="QDC_attendance.doClockOut('${sid}')">■ Clock Out</button>` : ''}
        ${isMgr ? `<button class="s-btn-sm" style="padding:4px 10px;font-size:.72rem" onclick="QDC_attendance.editEntry('${sid}','${nm}','${expIn}','${expOut}')">✏</button>` : ''}
        ${isAdminRole ? `<button class="s-btn-sm" style="padding:4px 10px;font-size:.72rem;border-color:#e74c3c;color:#e74c3c" onclick="QDC_attendance.confirmDeleteStaff('${sid}','${nm.replace(/'/g,'')}')">🗑</button>` : ''}
      `;

      return `<div style="display:grid;grid-template-columns:1fr auto auto auto;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)" data-sid="${sid}">
        <div>
          <div style="font-weight:600;font-size:.88rem">${nm}</div>
          <div style="font-size:.72rem;color:var(--text3);text-transform:capitalize">${role}</div>
        </div>
        <div style="text-align:center;min-width:70px">
          <div style="font-family:monospace;font-size:.88rem;color:var(--text2)">${ci||'—'}</div>
          <div style="font-size:.66rem;color:var(--text3)">Clock In</div>
        </div>
        <div style="text-align:center;min-width:70px">
          <div style="font-family:monospace;font-size:.88rem;color:var(--text2)">${co||'—'}</div>
          <div style="font-size:.66rem;color:var(--text3)">Clock Out</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end">
          <span style="color:${badgeCol};font-size:.72rem;font-weight:700;white-space:nowrap">${badge}</span>
          ${clockBtns}
        </div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr auto auto auto;gap:12px;padding:8px 16px;background:var(--bg2);border-bottom:2px solid var(--border)">
        <div style="font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);font-weight:600">Staff</div>
        <div style="font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);font-weight:600;min-width:70px;text-align:center">In</div>
        <div style="font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);font-weight:600;min-width:70px;text-align:center">Out</div>
        <div style="font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);font-weight:600;min-width:80px;text-align:right">Status</div>
      </div>
      ${rows}`;
  },

  async doClockIn(sid, name){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    try {
      const r = await fetch(`${proxy}&action=clockIn&staffId=${encodeURIComponent(sid)}&staffName=${encodeURIComponent(name)}&loggedBy=${encodeURIComponent(QDC_staff._staffName||'')}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      // Optimistically update local record so button switches immediately
      const today = new Date().toISOString().slice(0,10);
      const time  = d.time || new Date().toTimeString().slice(0,5);
      // Normalize: remove any existing record for this staff+today first
      this._records = this._records.filter(r=>!(String(r.StaffID||r.staffId||r.StaffId)===String(sid)&&String(r.Date||r.date||'').slice(0,10)===today));
      this._records.push({StaffID:sid,StaffName:name,Date:today,ClockIn:time,ClockOut:'',Status:'Present',HoursWorked:0});
      const isMgr = QDC_staff._staffRole==='admin'||QDC_staff._staffRole==='manager';
      this._renderStaffList(isMgr);
      setTimeout(()=>this.load(), 3000);
    } catch(e){
      const msg = document.getElementById('att-msg');
      if(msg){ msg.textContent='⚠ Clock In failed: '+e.message; msg.className='qdc-msg err'; setTimeout(()=>{if(msg)msg.textContent='';},4000); }
    }
  },

  async doClockOut(sid){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    try {
      const r = await fetch(`${proxy}&action=clockOut&staffId=${encodeURIComponent(sid)}&loggedBy=${encodeURIComponent(QDC_staff._staffName||'')}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      // Optimistically update local record
      const today = new Date().toISOString().slice(0,10);
      const time  = d.clockOut || new Date().toTimeString().slice(0,5);
      const rec = this._records.find(r=>String(r.StaffID||r.staffId||r.StaffId)===String(sid)&&String(r.Date||r.date||'').slice(0,10)===today);
      if(rec){ rec.ClockOut = time; rec.HoursWorked = d.hoursWorked||0; }
      const isMgr = QDC_staff._staffRole==='admin'||QDC_staff._staffRole==='manager';
      this._renderStaffList(isMgr);
      setTimeout(()=>this.load(), 3000);
    } catch(e){
      const msg = document.getElementById('att-msg');
      if(msg){ msg.textContent='⚠ Clock Out failed: '+e.message; msg.className='qdc-msg err'; setTimeout(()=>{if(msg)msg.textContent='';},4000); }
    }
  },

  editEntry(sid, name, expIn, expOut){
    // Populate and show edit modal
    const today = new Date().toISOString().slice(0,10);
    const rec   = this._records.find(r=>String(r.StaffID||r.staffId)===sid);
    document.getElementById('attEditName').textContent  = name;
    document.getElementById('attEditSid').value   = sid;
    document.getElementById('attEditDate').value  = today;
    document.getElementById('attEditIn').value    = rec ? String(rec.ClockIn||rec.clockIn||'') : '';
    document.getElementById('attEditOut').value   = rec ? String(rec.ClockOut||rec.clockOut||'') : '';
    document.getElementById('attEditExpIn').value  = expIn;
    document.getElementById('attEditExpOut').value = expOut;
    document.getElementById('attEditNotes').value  = rec ? String(rec.Notes||rec.notes||'') : '';
    document.getElementById('attEditMsg').textContent = '';
    document.getElementById('attEditOverlay').classList.add('show');
  },

  async saveEdit(){
    const proxy   = window.__QDC?.SHEETS_PROXY||'';
    const sid     = document.getElementById('attEditSid').value;
    const name    = document.getElementById('attEditName').textContent;
    const date    = document.getElementById('attEditDate').value;
    const cin     = document.getElementById('attEditIn').value||'';
    const cout    = document.getElementById('attEditOut').value||'';
    const expIn   = document.getElementById('attEditExpIn').value||'09:00';
    const expOut  = document.getElementById('attEditExpOut').value||'18:00';
    const notes   = document.getElementById('attEditNotes').value||'';
    const msg     = document.getElementById('attEditMsg');
    const btn     = document.getElementById('attEditSaveBtn');
    if(!sid||!date){ if(msg){msg.textContent='Missing data.';msg.className='qdc-msg err';} return; }
    // Calculate status
    let status = 'Present';
    if(!cin) status = 'Absent';
    else if(cin > expIn) status = 'Late';
    if(btn){ btn.textContent='⌛ Saving…'; btn.disabled=true; }
    console.log('saveEdit sending:', {sid,date,cin,cout,expIn,expOut,status});
    const ctrl = new AbortController();
    const tmo  = setTimeout(()=>ctrl.abort(), 30000);
    try {
      const url = `${proxy}&action=manualEntry&staffId=${encodeURIComponent(sid)}&staffName=${encodeURIComponent(name)}&date=${date}&clockIn=${encodeURIComponent(cin)}&clockOut=${encodeURIComponent(cout)}&status=${status}&notes=${encodeURIComponent(notes)}&expIn=${encodeURIComponent(expIn)}&expOut=${encodeURIComponent(expOut)}&loggedBy=${encodeURIComponent(QDC_staff._staffName||'')}`;
      console.log('URL:', url);
      const r = await fetch(url, {signal:ctrl.signal});
      clearTimeout(tmo);
      const text = await r.text();
      console.log('Server response:', text.slice(0,200));
      if(!text || text.startsWith('<')) throw new Error('Server error — try again');
      const d = JSON.parse(text);
      if(!d.ok) throw new Error(d.error||'Failed');
      // Re-enable button BEFORE closing so it's ready next time
      if(btn){ btn.textContent='Save'; btn.disabled=false; }
      document.getElementById('attEditOverlay').classList.remove('show');
      // Optimistically update local record
      const today = new Date().toISOString().slice(0,10);
      const rec = this._records.find(r=>String(r.StaffID||r.staffId)===sid&&String(r.Date||r.date||'').slice(0,10)===date);
      if(rec){ rec.ClockIn=cin; rec.ClockOut=cout; rec.Status=status; }
      else if(date===today){ this._records.push({StaffID:sid,StaffName:name,Date:date,ClockIn:cin,ClockOut:cout,Status:status}); }
      const isMgr = QDC_staff._staffRole==='admin'||QDC_staff._staffRole==='manager';
      this._renderStaffList(isMgr);
      setTimeout(()=>this.load(), 2000);
    } catch(e){
      clearTimeout(tmo);
      if(msg){msg.textContent='⚠ '+(e.name==='AbortError'?'Timed out — try again':e.message);msg.className='qdc-msg err';}
      if(btn){ btn.textContent='Save'; btn.disabled=false; }
    }
  },

  // ── Report ────────────────────────────────────────────────────────────────
  showReport(){
    // Set default dates
    const today = new Date().toISOString().slice(0,10);
    const mon   = today.slice(0,7)+'-01';
    document.getElementById('attRptFrom').value = mon;
    document.getElementById('attRptTo').value   = today;
    document.getElementById('attRptOverlay').classList.add('show');
    this._loadStaff();
  },

  async generateReport(){
    const proxy  = window.__QDC?.SHEETS_PROXY||'';
    const from   = document.getElementById('attRptFrom').value;
    const to     = document.getElementById('attRptTo').value;
    const sidFlt = document.getElementById('attRptStaff').value||'';
    const msg    = document.getElementById('attRptMsg');
    const btn    = document.getElementById('attRptBtn');
    if(!from||!to){ if(msg){msg.textContent='Select date range.';msg.className='qdc-msg err';} return; }
    if(btn){ btn.textContent='⌛ Generating…'; btn.disabled=true; }
    try {
      let url = `${proxy}&action=getAttendance&from=${from}&to=${to}`;
      if(sidFlt) url += `&staffId=${encodeURIComponent(sidFlt)}`;
      const [attResp, nfcResp, salResp] = await Promise.all([
        fetch(url),
        fetch(`${proxy}&action=getNFCCards${QDC_staff._hipaaParams()}`),
        fetch(`${proxy}&action=getPayrollSalary${QDC_staff._hipaaParams()}`)
      ]);
      const recs     = await attResp.json();
      const nfcCards = await nfcResp.json().catch(()=>[]);
      const salaries = await salResp.json().catch(()=>({}));
      this._downloadPDF(recs, nfcCards, salaries, from, to);
      document.getElementById('attRptOverlay').classList.remove('show');
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
    }
    if(btn){ btn.textContent='📥 Download PDF'; btn.disabled=false; }
  },

  _downloadPDF(records, nfcCards, salaries, from, to){
    const title = 'Attendance Report: '+from+' to '+to;
    const staffMap = {};
    records.forEach(r=>{
      const sid = String(r.StaffID||r.staffId||'?');
      const nm  = String(r.StaffName||r.staffName||r.Name||sid);
      if(!staffMap[sid]) staffMap[sid]={name:nm,sid,rows:[],present:0,absent:0,late:0,totalHours:0};
      const st  = String(r.Status||r.status||'Present');
      const hrs = Number(r.HoursWorked||r.hoursWorked||0);
      const ci  = String(r.ClockIn||r.clockIn||'—');
      const co  = String(r.ClockOut||r.clockOut||'—');
      const dt  = String(r.Date||r.date||'').slice(0,10);
      const src = String(r.Source||r.source||'Manual');
      staffMap[sid].rows.push({dt,ci,co,hrs,st,src});
      staffMap[sid].totalHours = Math.round((staffMap[sid].totalHours+hrs)*10)/10;
      if(st.toLowerCase()==='absent') staffMap[sid].absent++;
      else { staffMap[sid].present++; if(st.toLowerCase()==='late') staffMap[sid].late++; }
    });
    const stCol = s=>{const l=s.toLowerCase(); return l==='absent'?'#e53935':l==='late'?'#c8860a':'#0f9e60';};
    const sections = Object.values(staffMap).map(s=>{
      const sal    = (salaries&&salaries[s.sid]) ? Number(salaries[s.sid]) : 0;
      const hrRate = sal ? Math.round(sal/(26*8)) : 0;
      const earned = hrRate ? Math.round(hrRate*s.totalHours) : 0;
      const trs = s.rows.sort((a,b)=>a.dt.localeCompare(b.dt)).map(r=>
        '<tr><td>'+r.dt+'</td><td>'+r.ci+'</td><td>'+r.co+'</td><td>'+(r.hrs?r.hrs+'h':'—')+'</td>'+
        '<td style="color:'+stCol(r.st)+';font-weight:600">'+r.st.toUpperCase()+'</td><td style="color:#999">'+r.src+'</td></tr>'
      ).join('');
      return '<div class="sec">'+
        '<div class="sh">'+s.name+' <span class="sid">'+s.sid+'</span></div>'+
        '<div class="sg">'+
          '<div class="sc"><div class="sv">'+s.present+'</div><div class="sl">Present</div></div>'+
          '<div class="sc"><div class="sv" style="color:#e53935">'+s.absent+'</div><div class="sl">Absent</div></div>'+
          '<div class="sc"><div class="sv" style="color:#c8860a">'+s.late+'</div><div class="sl">Late</div></div>'+
          '<div class="sc"><div class="sv">'+s.totalHours+'h</div><div class="sl">Hours</div></div>'+
          (hrRate?'<div class="sc"><div class="sv">৳'+hrRate+'/hr</div><div class="sl">Hourly Rate</div></div>':'')+ 
          (earned?'<div class="sc"><div class="sv" style="color:#1251aa">৳'+earned.toLocaleString()+'</div><div class="sl">Wages</div></div>':'')+
        '</div>'+
        '<table><thead><tr><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Status</th><th>Source</th></tr></thead>'+
        '<tbody>'+trs+'</tbody></table></div>';
    }).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+title+'</title></head><body>'+
      '<h1>🦷 Quick Dental Care — '+title+'</h1>'+
      '<div class="meta">Generated: '+new Date().toLocaleString()+' | '+records.length+' record(s)</div>'+
      (sections||'<p style="color:#888;padding:20px">No records found.</p>')+
      '</body></html>';
    const w = window.open('','_blank','width=960,height=720');
    if(w){ w.document.write(html); w.document.close(); setTimeout(()=>{try{w.print();}catch(e){}},600); }
  },
  _setRange(preset){
    const now=new Date(), today=now.toISOString().slice(0,10);
    let from=today, to=today;
    if(preset==='week'){ const d=now.getDay()||7; const mon=new Date(now); mon.setDate(now.getDate()-d+1); from=mon.toISOString().slice(0,10); }
    else if(preset==='month'){ from=today.slice(0,7)+'-01'; }
    document.getElementById('attRptFrom').value=from;
    document.getElementById('attRptTo').value=to;
  },

  async _loadStaff(force=false){
    if(this._staffList.length&&!force) return;
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    try {
      const r=await fetch(`${proxy}&action=getStaff${QDC_staff._hipaaParams()}`);
      const text=await r.text();
      if(!text||text.startsWith('<')){ console.warn('getStaff returned non-JSON'); return; }
      const d=JSON.parse(text);
      this._staffList=Array.isArray(d)?d:(d.staff||d.data||[]);
      const opts=this._staffList.map(s=>`<option value="${s.id||s.StaffID||''}">${s.name||s.Name||s.id}</option>`).join('');
      ['nfc-assign-staff','attRptStaff'].forEach(id=>{
        const el=document.getElementById(id);
        if(el) el.innerHTML='<option value="">All staff</option>'+opts;
      });
    } catch(e){ console.error('_loadStaff:',e); }
  },

  // ── NFC Registration ──────────────────────────────────────────────────────
  _assignMode: 'existing',

  setAssignMode(mode) {
    this._assignMode = mode;
    const ep = document.getElementById('nfc-existing-panel');
    const np = document.getElementById('nfc-new-panel');
    const b1 = document.getElementById('nfc-mode-existing');
    const b2 = document.getElementById('nfc-mode-new');
    if (mode === 'existing') {
      if (ep) ep.style.display = 'block';
      if (np) np.style.display = 'none';
      if (b1) { b1.style.background='rgba(137,87,229,.12)'; b1.style.color='#8957e5'; b1.style.fontWeight='600'; }
      if (b2) { b2.style.background='var(--surface)'; b2.style.color='var(--text3)'; b2.style.fontWeight='400'; }
    } else {
      if (ep) ep.style.display = 'none';
      if (np) np.style.display = 'block';
      if (b1) { b1.style.background='var(--surface)'; b1.style.color='var(--text3)'; b1.style.fontWeight='400'; }
      if (b2) { b2.style.background='rgba(137,87,229,.12)'; b2.style.color='#8957e5'; b2.style.fontWeight='600'; }
    }
  },

  openAssignForm() {
    this._assignMode = 'existing';
    this.setAssignMode('existing');
    document.getElementById('nfcAssignOverlay').classList.add('show');
    const msg = document.getElementById('nfc-assign-msg');
    if (msg) { msg.textContent=''; msg.className='qdc-msg'; }
  },

  cancelAssign() {
    document.getElementById('nfcAssignOverlay').classList.remove('show');
    // Resume polling for next card
    if (this._regMode) {
      this._updateOled('reg');
      this._showCardWaiting();
      this._regPollTimer = setInterval(()=>this._pollPendingCard(), 2000);
    }
  },

  async toggleRegMode(){
    if(this._regMode){ this.stopRegMode(); return; }
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    const panel = document.getElementById('att-reg-panel');
    const btn   = document.getElementById('att-reg-btn');
    if(panel) panel.style.display = 'block';
    if(btn) { btn.textContent = '✕ Stop Registration'; btn.style.borderColor='#e74c3c'; btn.style.color='#e74c3c'; }
    this._setStep(0); // all grey, connecting
    try {
      const r = await fetch(`${proxy}&action=startRegMode${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(d.ok !== true && d.ok !== undefined) throw new Error(d.error||'Server error');
      this._regMode = true;
      this._espDetected = false;
      this._setStep(1); // server ✓, ESP still waiting
      this._updateOled('reg');
      this._showCardWaiting();
      this._regPollTimer = setInterval(()=>this._pollPendingCard(), 2000);
    } catch(e){
      if(panel) panel.style.display = 'none';
      if(btn) { btn.textContent='📱 Register NFC Card'; btn.style.borderColor='#8957e5'; btn.style.color='#8957e5'; }
      const isOffline = !proxy || e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed');
      this._setStep(-1, isOffline ? 'Cannot reach server. Check your GAS URL in Automations tab.' : e.message);
    }
  },

  _setStep(step, errMsg){
    // Items:    0=server        1=esp           2=scan          3=assign
    // Steps:    0=connecting    1=server_ok     2=esp_waiting   3=esp_active    4=scanned    5=assigned
    //
    // DONE  (green ✓):  server at step>=2, esp at step>=4, scan at step>=5
    // ACTIVE (amber ⌛): server at steps 0-1, ESP ONLY at step 3 (confirmed active), scan at 4, assign at 5
    // Everything else is GREY
    const doneFrom   = [2, 4, 5, 6];   // item i turns green when step >= this
    const activeFrom = [0, 3, 4, 5];   // item i turns amber starting at this step
    const activeTo   = [1, 3, 4, 5];   // item i stops being amber after this step

    const labelsDone   = ['Server connected',  'ESP detected',    'Card scanned',  'Card assigned'];
    const labelsActive = ['Connecting…',        'ESP connecting…', 'Scanning…',     'Assigning…'];
    const labelsGrey   = ['Server',             'ESP device',      'Card scan',     'Card assign'];

    const items = [
      { id:'nfc-step-server' },
      { id:'nfc-step-esp'    },
      { id:'nfc-step-scan'   },
      { id:'nfc-step-assign' },
    ];

    items.forEach((item, i) => {
      const el = document.getElementById(item.id);
      if(!el) return;
      const dot  = el.querySelector('.nfc-dot');
      const lbl  = el.querySelector('.nfc-lbl');
      const icon = el.querySelector('.nfc-icon');

      if(step < 0){
        if(i === 0){
          if(dot){ dot.style.background='#e74c3c'; dot.style.boxShadow='none'; }
          if(lbl){ lbl.textContent='Error: '+(errMsg||'Failed'); lbl.style.color='#e74c3c'; lbl.style.fontWeight='600'; }
          if(icon) icon.textContent='✕';
        } else {
          if(dot){ dot.style.background='var(--border)'; dot.style.boxShadow='none'; }
          if(lbl){ lbl.textContent=labelsGrey[i]; lbl.style.color='var(--text3)'; lbl.style.fontWeight='400'; }
          if(icon) icon.textContent='○';
        }
        return;
      }

      const done   = step >= doneFrom[i];
      const active = !done && step >= activeFrom[i] && step <= activeTo[i];

      if(dot){
        dot.style.background = done ? '#25d366' : active ? '#f39c12' : 'var(--border)';
        dot.style.boxShadow  = active ? '0 0 6px rgba(243,156,18,.5)' : 'none';
      }
      if(lbl){
        lbl.textContent      = done ? labelsDone[i] : active ? labelsActive[i] : labelsGrey[i];
        lbl.style.color      = done ? '#25d366' : active ? 'var(--text)' : 'var(--text3)';
        lbl.style.fontWeight = (done || active) ? '600' : '400';
      }
      if(icon) icon.textContent = done ? '✓' : active ? '⌛' : '○';
    });

    const status = document.getElementById('att-reg-status');
    if(status){
      const msgs = [
        'Connecting to server…',
        'Server connected — waiting for ESP device…',
        'Waiting for ESP device to come online…',
        'ESP active — tap a card on the reader',
        'Card scanned — assign it below',
        'Card assigned! Ready for next card.',
      ];
      status.textContent = (step >= 0 && step < msgs.length) ? msgs[step] : (errMsg || '');
    }
  },

  async stopRegMode(){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    clearInterval(this._regPollTimer);
    this._regMode = false;
    try{ await fetch(`${proxy}&action=endRegMode${QDC_staff._hipaaParams()}`); }catch(e){}
    const panel = document.getElementById('att-reg-panel');
    const btn   = document.getElementById('att-reg-btn');
    if(panel) panel.style.display = 'none';
    if(btn) { btn.textContent = '📱 Register NFC Card'; btn.style.borderColor='#8957e5'; btn.style.color='#8957e5'; }
    document.getElementById('nfcAssignOverlay').classList.remove('show');
  },

  _updateOled(state, uid='') {
    const l1 = document.getElementById('att-oled-line1');
    const l2 = document.getElementById('att-oled-line2');
    const l3 = document.getElementById('att-oled-line3');
    if (!l1) return;
    if (state === 'reg') {
      l1.textContent = 'REGISTRATION MODE';  l1.style.color='#25d366';
      l2.textContent = 'Scan staff NFC card'; l2.style.color='rgba(37,211,102,.7)';
      l3.textContent = '(end from website)';  l3.style.color='rgba(37,211,102,.45)';
    } else if (state === 'scanned') {
      l1.textContent = 'Card scanned!';       l1.style.color='#f3c44a';
      l2.textContent = 'UID: '+uid;           l2.style.color='rgba(243,196,74,.8)';
      l3.textContent = 'Assign on website…';  l3.style.color='rgba(243,196,74,.5)';
    } else if (state === 'assigned') {
      l1.textContent = 'Assigned!';           l1.style.color='#25d366';
      l2.textContent = 'Scan next card';      l2.style.color='rgba(37,211,102,.7)';
      l3.textContent = '';                    l3.style.color='transparent';
    }
  },

  _showCardWaiting() {
    const cw = document.getElementById('att-card-waiting');
    const cs = document.getElementById('att-card-scanned');
    if (cw) cw.style.display = 'block';
    if (cs) cs.style.display = 'none';
  },

  _showCardScanned(uid) {
    const cw = document.getElementById('att-card-waiting');
    const cs = document.getElementById('att-card-scanned');
    const liveUid = document.getElementById('att-live-uid');
    if (cw) cw.style.display = 'none';
    if (cs) cs.style.display = 'block';
    if (liveUid) liveUid.textContent = uid;
    // Also sync UID into assign overlay
    const assignUid = document.getElementById('nfc-assign-uid');
    if (assignUid) assignUid.textContent = uid;
  },

  async _pollPendingCard(){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    try {
      // Call espPoll (website side — no 'source=esp' param)
      // The response includes espLastSeen: timestamp set only when real ESP polls
      const er = await fetch(`${proxy}&action=espPoll${QDC_staff._hipaaParams()}`);
      const ed = await er.json();
      if(!this._espDetected){
        const lastSeen  = parseInt(ed.espLastSeen||'0');
        const ageMs     = lastSeen ? (Date.now() - lastSeen) : Infinity;
        // Real ESP has polled in last 8 seconds (allows for network latency)
        if(lastSeen && ageMs < 8000){
          this._espDetected = true;
          this._setStep(3); // ESP active ✓
        } else {
          this._setStep(2); // still waiting for ESP
        }
      }
      // Check for pending card
      const r = await fetch(`${proxy}&action=getPendingCard${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(d.pending && d.uid){
        clearInterval(this._regPollTimer);
        this._setStep(4);
        this._updateOled('scanned', d.uid);
        this._showCardScanned(d.uid);
        await this._loadStaff(true);
      }
    } catch(e){}
  },

  confirmDeleteStaff(staffId, staffName){
    // Build confirmation overlay
    let ov = document.getElementById('att-delete-overlay');
    if(!ov){
      ov = document.createElement('div');
      ov.id = 'att-delete-overlay';
      ov.style.cssText = 'position:fixed;inset:0;z-index:3100;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center';
      ov.onclick = e => { if(e.target===ov) ov.remove(); };
      document.body.appendChild(ov);
    }
    ov.innerHTML = `
      <div onclick="event.stopPropagation()" style="background:var(--bg);border:1px solid #e74c3c;max-width:420px;width:92vw;border-radius:4px;box-shadow:0 24px 64px rgba(0,0,0,.4)">
        <div style="background:#e74c3c;padding:16px 20px;display:flex;align-items:center;gap:10px">
          <span style="font-size:1.4rem">🗑️</span>
          <div style="font-weight:700;color:#fff;font-size:1rem">Delete Staff Member</div>
        </div>
        <div style="padding:22px 22px 10px">
          <div style="font-size:.96rem;color:var(--text);margin-bottom:12px">
            You are about to permanently delete <strong style="color:#e74c3c">${staffName}</strong> (${staffId}).
          </div>
          <div style="background:rgba(231,76,60,.08);border:1px solid rgba(231,76,60,.3);border-radius:2px;padding:12px 14px;font-size:.84rem;color:var(--text2);line-height:1.7;margin-bottom:18px">
            ⚠️ <strong>This will permanently wipe:</strong><br>
            • All attendance records for this staff<br>
            • Their NFC card registration<br>
            • Their staff profile & login credentials<br>
            • Their payroll entries<br><br>
            <strong style="color:#e74c3c">This cannot be undone.</strong>
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:.82rem;color:var(--text3);display:block;margin-bottom:6px">
              Type <strong style="color:var(--text)">${staffId}</strong> to confirm:
            </label>
            <input id="att-del-confirm-input" class="qdc-input" placeholder="Type staff ID to confirm" style="font-family:monospace;letter-spacing:.06em">
          </div>
          <div class="qdc-msg" id="att-del-msg" style="margin-bottom:10px"></div>
          <div style="display:flex;gap:10px;padding-bottom:8px">
            <button onclick="document.getElementById('att-delete-overlay').remove()"
              style="flex:1;padding:11px;background:var(--surface);border:1px solid var(--border);color:var(--text2);cursor:pointer;font-family:inherit;font-size:.88rem;border-radius:2px">
              Cancel
            </button>
            <button onclick="QDC_attendance.deleteStaffFull('${staffId}','${staffName}')"
              style="flex:1;padding:11px;background:#e74c3c;border:none;color:#fff;cursor:pointer;font-family:inherit;font-size:.88rem;font-weight:700;border-radius:2px" id="att-del-confirm-btn">
              Delete Everything →
            </button>
          </div>
        </div>
      </div>`;
    ov.style.display = 'flex';
    setTimeout(()=>document.getElementById('att-del-confirm-input')?.focus(), 100);
  },

  async deleteStaffFull(staffId, staffName){
    const input = document.getElementById('att-del-confirm-input')?.value.trim();
    const msg   = document.getElementById('att-del-msg');
    const btn   = document.getElementById('att-del-confirm-btn');
    if(input !== staffId){
      if(msg){ msg.textContent='⚠ ID does not match. Type exactly: '+staffId; msg.className='qdc-msg err'; }
      return;
    }
    if(btn){ btn.textContent='Deleting…'; btn.disabled=true; }
    if(msg){ msg.textContent=''; msg.className='qdc-msg'; }
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    try {
      const r = await fetch(`${proxy}&action=deleteStaffFull&staffId=${encodeURIComponent(staffId)}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Delete failed');
      document.getElementById('att-delete-overlay')?.remove();
      // Remove from local lists
      this._staffList = this._staffList.filter(s=>(s.id||s.StaffID)!==staffId);
      this._records   = this._records.filter(r=>(r.StaffID||r.staffId)!==staffId);
      const isMgr = QDC_staff._staffRole==='admin'||QDC_staff._staffRole==='manager';
      this._renderStaffList(isMgr);
      const attMsg = document.getElementById('att-msg');
      if(attMsg){ attMsg.textContent=`✅ ${staffName} and all their records have been permanently deleted.`; attMsg.className='qdc-msg ok'; setTimeout(()=>{if(attMsg)attMsg.textContent='';},5000); }
    } catch(e){
      if(msg){ msg.textContent='⚠ '+e.message; msg.className='qdc-msg err'; }
      if(btn){ btn.textContent='Delete Everything →'; btn.disabled=false; }
    }
  },

  async assignCard(){
    const proxy   = window.__QDC?.SHEETS_PROXY||'';
    const uid     = document.getElementById('nfc-assign-uid')?.textContent;
    const cin     = document.getElementById('nfc-assign-in')?.value||'09:00';
    const cout    = document.getElementById('nfc-assign-out')?.value||'18:00';
    const msg     = document.getElementById('nfc-assign-msg');
    let staffId, staffName;

    if (this._assignMode === 'existing') {
      const sel = document.getElementById('nfc-assign-staff');
      staffId   = sel?.value;
      staffName = sel?.options[sel?.selectedIndex]?.text || '';
      if(!staffId){ if(msg){msg.textContent='Select a staff member.';msg.className='qdc-msg err';} return; }
    } else {
      staffId   = (document.getElementById('nfc-new-staff-id')?.value||'').trim();
      staffName = (document.getElementById('nfc-new-staff-name')?.value||'').trim();
      if(!staffId||!staffName){ if(msg){msg.textContent='Enter Staff ID and Name.';msg.className='qdc-msg err';} return; }
    }

    try {
      const r = await fetch(`${proxy}&action=assignCard&uid=${encodeURIComponent(uid)}&staffId=${encodeURIComponent(staffId)}&staffName=${encodeURIComponent(staffName)}&clockIn=${cin}&clockOut=${cout}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      document.getElementById('nfcAssignOverlay').classList.remove('show');
      this._setStep(5); // Card assigned ✓
      this._updateOled('assigned');
      // After 1.5s reset to step 3 (ESP active, ready for next card) and resume scanning
      setTimeout(()=>{
        this._setStep(3);
        this._showCardWaiting();
        this._regPollTimer = setInterval(()=>this._pollPendingCard(), 2000);
      }, 1500);
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  },
};

/* ─── CALENDAR ENGINE ─── */
window.QDC_calendar = {
  _weekStart: null,
  _appts: [],
  _editId: null,
  _selectedPat: null,
  _viewDays: 7,       // 1 | 3 | 7

  init(){
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0) ? -6 : 1 - day;
    this._weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    // Default to 3-day on mobile
    if(window.innerWidth < 600 && this._viewDays === 7) this._viewDays = 3;
    this._updateViewBtns();
    this.render();
  },

  setView(days){
    this._viewDays = days;
    this._updateViewBtns();
    // For 1-day view, snap to today
    if(days === 1){
      const now = new Date();
      this._weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    this.render();
  },

  _updateViewBtns(){
    [1,3,7].forEach(d=>{
      const btn = document.getElementById('cal-v'+d);
      if(!btn) return;
      const active = d === this._viewDays;
      btn.style.background = active ? 'var(--crimson)' : 'var(--bg2)';
      btn.style.color = active ? '#fff' : 'var(--text2)';
      btn.style.fontWeight = active ? '700' : '400';
    });
  },

  today(){
    const now = new Date();
    if(this._viewDays === 1){
      this._weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      const day = now.getDay();
      const diff = (day === 0) ? -6 : 1 - day;
      this._weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    }
    this.render();
  },

  prev(){
    this._weekStart = new Date(this._weekStart.getTime() - this._viewDays*86400000);
    this.render();
  },
  next(){
    this._weekStart = new Date(this._weekStart.getTime() + this._viewDays*86400000);
    this.render();
  },
  prevWeek(){ this.prev(); },
  nextWeek(){ this.next(); },

  // ── Pure spreadsheet render — text in cells, no absolute positioning ──────
  async render(){
    if(!this._weekStart) this.init();
    if(this._mode === 'list'){ await this._loadWeekForList(); this._renderList(); return; }
    const el = document.getElementById('cal-grid'); if(!el) return;
    const nDays = this._viewDays || 7;
    const dates = Array.from({length:nDays},(_,i)=>new Date(this._weekStart.getTime()+i*86400000));
    const lbl = document.getElementById('cal-week-label');
    if(lbl){
      const fmt=d=>d.toLocaleDateString('en-BD',{day:'2-digit',month:'short'});
      lbl.textContent = nDays===1 ? fmt(dates[0]) : fmt(dates[0])+' – '+fmt(dates[nDays-1]);
    }
    await this._loadWeek(dates[0], dates[nDays-1]);
    const hours=[]; for(let h=8;h<=21;h++) hours.push(h);
    const now=new Date(), today=now.toDateString(), nowH=now.getHours();
    // Responsive column width: wider on fewer days
    const COL_W_OVERRIDE = nDays===1 ? Math.min(window.innerWidth-80, 500) : nDays===3 ? Math.min(Math.floor((window.innerWidth-80)/3), 200) : null;
    const dayLabel=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const colors=[
      ['#dbeafe','#1d4ed8'],['#fef3c7','#d97706'],['#d1fae5','#059669'],
      ['#fce7f3','#db2777'],['#ede9fe','#7c3aed'],['#ccfbf1','#0d9488'],
      ['#fee2e2','#dc2626'],['#e0f2fe','#0284c7'],
    ];
    // Build map: 'YYYY-MM-DD:H' -> [{appt, span}]
    const map={};
    this._appts.forEach((a,idx)=>{
      const ds=String(a.Date||a.date||'').slice(0,10);
      // Handle time as string '09:00', '09:00:00', or Google Sheets fraction (0.375 = 09:00)
      let ts=String(a.Time||a.time||'09:00').trim();
      if(ts.match(/^0\.\d+$/)||ts.match(/^\d{4}-/)){
        // Numeric fraction or wrongly formatted date — try to extract hour
        const frac=parseFloat(ts);
        if(!isNaN(frac)&&frac<1){ const totalMins=Math.round(frac*1440); ts=String(Math.floor(totalMins/60)).padStart(2,'0')+':'+String(totalMins%60).padStart(2,'0'); }
        else ts='09:00';
      }
      // Normalise to HH:mm
      ts=ts.slice(0,5);
      const hh=parseInt(ts.split(':')[0])||9;
      const durH=Math.max(1,Math.ceil(Number(a.Duration||a.duration||60)/60));
      for(let s=0;s<durH;s++){
        const k=ds+':'+(hh+s);
        if(!map[k]) map[k]=[];
        map[k].push({...a,_span:s,_time:ts,_idx:idx});
      }
    });
    // Header
    const minW = nDays===1?300:nDays===3?480:1100;
    let h='<table style="border-collapse:collapse;table-layout:fixed;min-width:'+minW+'px;width:100%"><thead><tr>';
    h+=`<th style="width:58px;padding:8px 4px;font-size:.6rem;color:var(--text3);font-weight:400;border-bottom:2px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:5">TIME</th>`;
    dates.forEach((d,i)=>{
      const iT=d.toDateString()===today,iS=i===5,iU=i===6;
      const bg=iT?'#1251aa':iU?'#fee2e2':iS?'#fef9c3':'var(--bg2)';
      const cl=iT?'#fff':iU?'#b91c1c':iS?'#92400e':'var(--text2)';
      const colW=COL_W_OVERRIDE||'auto';
      const colWStyle=COL_W_OVERRIDE?`width:${colW}px;min-width:${colW}px;`:'';
      h+=`<th style="${colWStyle}text-align:center;padding:8px 4px 6px;background:${bg};border-left:1px solid var(--border);border-bottom:2px solid ${iT?'#1251aa':'var(--border)'};position:sticky;top:0;z-index:5">
        <div style="font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:${cl}">${dayLabel[i]}</div>
        <div style="font-size:1.3rem;font-family:'Cormorant Garamond',serif;font-weight:700;color:${cl};line-height:1.1">${d.getDate()}</div>
        <div style="font-size:.6rem;color:${cl};opacity:.8">${d.toLocaleDateString('en-BD',{month:'short'})}</div>
      </th>`;
    });
    h+=`</tr></thead><tbody>`;
    // Rows
    hours.forEach(hr=>{
      const isNow=hr===nowH;
      const rb=isNow?'border-top:2px solid var(--crimson)':'';
      h+=`<tr style="${rb}">`;
      h+=`<td style="padding:4px 6px 0;font-size:.68rem;text-align:right;vertical-align:top;white-space:nowrap;background:var(--bg);${isNow?'color:var(--crimson);font-weight:700':'color:var(--text3)'}">${String(hr).padStart(2,'0')}:00</td>`;
      dates.forEach((d,di)=>{
        const ds=d.toISOString().slice(0,10);
        const iT=d.toDateString()===today,iS=di===5,iU=di===6;
        const isPast=d<new Date(new Date().toDateString());
        const cBg=iT?'rgba(18,81,170,.03)':iU?'rgba(185,28,28,.025)':iS?'rgba(146,64,14,.02)':'';
        const appts=map[ds+':'+hr]||[];
        const tdW=COL_W_OVERRIDE?`width:${COL_W_OVERRIDE}px;min-width:${COL_W_OVERRIDE}px;`:'';
        if(!appts.length){
          h+=`<td onclick="QDC_calendar.slotClick('${ds}',${hr})" style="${tdW}padding:0;border-left:1px solid rgba(0,0,0,.06);min-height:44px;height:44px;background:${cBg};cursor:pointer;vertical-align:top"></td>`;
        } else {
          const inner=appts.map(a=>{
            const pid=String(a.PatientID||a.patientid||a.Name||'x');
            const ci=(pid.charCodeAt(0)+(pid.charCodeAt(1)||0)+(pid.charCodeAt(2)||0))%colors.length;
            const [bg2,bdr]=colors[ci];
            const nm=a.Name||a.name||'Patient';
            const tx=a.Treatment||a.treatment||'';
            const ph=a.Phone||a.phone||'';
            // Store appt data safely in data attribute
            const idx2=a._idx!=null?a._idx:0;
            return `<div onclick="event.stopPropagation();QDC_calendar._clickAppt(${idx2})"
              style="background:${bg2};border-left:3px solid ${bdr};margin:2px 2px 1px;padding:3px 5px 2px;cursor:pointer;border-radius:2px">
              ${a._span===0
                ? `<div style="font-weight:700;font-size:.73rem;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${nm}</div>
                   <div style="font-size:.63rem;color:#444;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a._time}${tx?' · '+tx:''}</div>
                   ${ph?`<div style="font-size:.6rem;color:#555">${ph}</div>`:''}`
                : `<div style="font-size:.63rem;color:#666;font-style:italic">↳ ${nm}</div>`
              }
            </div>`;
          }).join('');
          h+=`<td style="${tdW}padding:0;border-left:1px solid rgba(0,0,0,.06);vertical-align:top;background:${cBg}">${inner}</td>`;
        }
      });
      h+=`</tr>`;
    });
    h+=`</tbody></table>`;
    el.innerHTML=h;
  },

  _clickAppt(idx){
    const a = this._appts[idx];
    if(a) this.openEditModal(a);
  },

  // ── List / Grid mode switch ────────────────────────────────────────────────
  _mode: 'grid',
  setMode(mode){
    this._mode = mode;
    const gw = document.getElementById('cal-grid-wrap');
    const lw = document.getElementById('cal-list-wrap');
    const vt = document.getElementById('cal-view-toggles');
    const mg = document.getElementById('cal-mode-grid');
    const ml = document.getElementById('cal-mode-list');
    if(mode === 'list'){
      if(gw) gw.style.display = 'none';
      if(lw) lw.style.display = 'block';
      if(vt) vt.style.display = 'none';
      if(mg){ mg.style.background='var(--bg2)'; mg.style.color='var(--text2)'; mg.style.fontWeight='400'; }
      if(ml){ ml.style.background='var(--crimson)'; ml.style.color='#fff'; ml.style.fontWeight='600'; }
      this._renderList();
    } else {
      if(gw) gw.style.display = '';
      if(lw) lw.style.display = 'none';
      if(vt) vt.style.display = '';
      if(mg){ mg.style.background='var(--crimson)'; mg.style.color='#fff'; mg.style.fontWeight='600'; }
      if(ml){ ml.style.background='var(--bg2)'; ml.style.color='var(--text2)'; ml.style.fontWeight='400'; }
      this.render();
    }
  },

  _renderList(){
    const el = document.getElementById('cal-list');
    if(!el) return;
    const appts = [...this._appts].sort((a,b)=>{
      const da = (a.Date||a.date||''), db = (b.Date||b.date||'');
      const ta = (a.Time||a.time||''), tb = (b.Time||b.time||'');
      return da.localeCompare(db)||ta.localeCompare(tb);
    });
    if(!appts.length){
      el.innerHTML = '<div class="empty-state"><span>📅</span><p>No appointments in this period.</p></div>';
      return;
    }
    // Group by date
    const byDate = {};
    appts.forEach((a,i)=>{
      const d = (a.Date||a.date||'?').slice(0,10);
      if(!byDate[d]) byDate[d]=[];
      byDate[d].push({...a,_idx:i});
    });
    const statusColor = {Scheduled:'var(--blue3)',Completed:'var(--open)',Cancelled:'var(--text3)',NoShow:'var(--crimson)'};
    el.innerHTML = Object.keys(byDate).sort().map(date=>{
      const label = new Date(date+'T12:00:00').toLocaleDateString('en-BD',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      const rows = byDate[date].map(a=>{
        const st = a.Status||a.status||'Scheduled';
        const sc = statusColor[st]||'var(--text3)';
        return `<div style="display:grid;grid-template-columns:70px 1fr auto;gap:12px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s"
          onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''"
          onclick="QDC_calendar._clickAppt(${a._idx})">
          <div style="text-align:right">
            <div style="font-weight:700;font-size:.95rem;color:var(--text)">${(a.Time||a.time||'—').slice(0,5)}</div>
            <div style="font-size:.7rem;color:var(--text3)">${a.Duration||a.duration||60}min</div>
          </div>
          <div>
            <div style="font-weight:600;color:var(--text);font-size:.9rem">${a.Name||a.name||'—'}</div>
            <div style="font-size:.78rem;color:var(--text2)">${a.Treatment||a.treatment||'—'}</div>
            ${(a.Phone||a.phone)?`<div style="font-size:.72rem;color:var(--text3)">${a.Phone||a.phone}</div>`:''}
          </div>
          <div>
            <span style="font-size:.7rem;padding:3px 8px;border-radius:2px;background:${sc}22;color:${sc};border:1px solid ${sc}44">${st}</span>
          </div>
        </div>`;
      }).join('');
      return `<div style="background:var(--surface);padding:8px 18px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);font-weight:700;border-bottom:1px solid var(--border)">${label}</div>${rows}`;
    }).join('');
  },

  // ── Load appointments from Sheets ─────────────────────────────────────────
  async _loadWeekForList(){
    // For list view load 30 days from weekStart
    const end = new Date(this._weekStart.getTime() + 29*86400000);
    await this._loadWeek(this._weekStart, end);
    const lbl = document.getElementById('cal-week-label');
    if(lbl){
      const fmt=d=>d.toLocaleDateString('en-BD',{day:'2-digit',month:'short'});
      lbl.textContent = fmt(this._weekStart)+' – '+fmt(end);
    }
  },

  async _loadWeek(start, end){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    const msg = document.getElementById('cal-msg');
    if(msg){ msg.textContent='⌛ Loading…'; msg.className='qdc-msg'; }
    try {
      const r = await fetch(`${proxy}&action=getAppointments&start=${start.toISOString().slice(0,10)}&end=${end.toISOString().slice(0,10)}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      this._appts = Array.isArray(d) ? d : (d.appointments||[]);
      const n = this._appts.length;
      if(msg){ msg.textContent = n ? n+' appointment'+(n>1?'s':'')+' this week' : 'No appointments this week — click any cell to book.'; msg.className='qdc-msg'; }
    } catch(e){
      this._appts = [];
      if(msg){ msg.textContent='Could not load appointments: '+e.message; msg.className='qdc-msg err'; }
    }
  },

  // ── Slot click — open booking at that time ─────────────────────────────────
  slotClick(dateStr, hour){
    this.openBookModal(dateStr, String(hour).padStart(2,'0')+':00');
  },

  // ── Open booking modal ─────────────────────────────────────────────────────
  openBookModal(dateStr, timeStr){
    // Ensure patient data is loaded for search
    if(window.QDC_staff && !QDC_staff._patLoaded){
      QDC_staff._patLoaded = true;
      QDC_staff._loadPatients();
    }
    this._editId = null; this._selectedPat = null;
    const title = document.getElementById('book-modal-title');
    if(title) title.textContent = '📅 New Appointment';
    ['book-pat-search','book-treatment','book-notes'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('book-pat-selected').innerHTML='';
    document.getElementById('book-walkin-phone-wrap').style.display='none';
    const wph = document.getElementById('book-walkin-phone'); if(wph) wph.value='';
    document.getElementById('book-pat-results').style.display='none';
    document.getElementById('book-delete-btn').style.display='none';
    document.getElementById('book-msg').textContent='';
    // Pre-fill date/time if provided
    const d=document.getElementById('book-date');
    if(d) d.value = dateStr || new Date().toISOString().slice(0,10);
    const t=document.getElementById('book-time');
    if(t) t.value = timeStr || '';
    document.getElementById('book-duration').value='60';
    document.getElementById('book-notify').checked=true;
    document.getElementById('bookApptOverlay').classList.add('show');
    setTimeout(()=>document.getElementById('book-pat-search')?.focus(), 150);
    // Load available slots for the pre-filled date
    this.loadAvailableSlots();
  },

  // ── Load & render available slots ─────────────────────────────────────────
  async loadAvailableSlots(){
    const dateEl = document.getElementById('book-date');
    const wrap   = document.getElementById('book-slots-wrap');
    const grid   = document.getElementById('book-slots-grid');
    if(!dateEl?.value || !wrap || !grid) return;
    const date = dateEl.value;
    wrap.style.display='block';
    grid.innerHTML = '<span style="font-size:.78rem;color:var(--text3)">Loading…</span>';

    // All slots clinic is open: 12:00-21:00 (Sat-Thu), 16:00-21:00 (Fri)
    const d    = new Date(date + 'T00:00:00');
    const dow  = d.getDay(); // 0=Sun,5=Fri,6=Sat
    const isFri= dow === 5;
    const allSlots = [];
    const startH = isFri ? 16 : 12;
    for(let h = startH; h < 21; h++){
      allSlots.push(String(h).padStart(2,'0')+':00');
      if(h < 20) allSlots.push(String(h).padStart(2,'0')+':30');
    }

    // Fetch booked slots for this date
    let booked = new Set();
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(proxy){
        const r = await fetch(`${proxy}&action=getAppointments&start=${date}&end=${date}${QDC_staff._hipaaParams()}`);
        const appts = await r.json();
        if(Array.isArray(appts)) appts.forEach(a => {
          const t  = (a.Time||a.time||'').slice(0,5);
          const dur= parseInt(a.Duration||a.duration||60);
          // Block the slot and the next slot if duration > 30
          booked.add(t);
          if(dur > 30){
            const [hh,mm] = t.split(':').map(Number);
            const next = String(hh).padStart(2,'0')+':'+(mm===0?'30':'00');
            const nextH = mm===0 ? String(hh).padStart(2,'0') : String(hh+1).padStart(2,'0');
            booked.add(mm===0 ? next : nextH+':00');
          }
        });
      }
    } catch(_){}

    // Render
    const timeEl = document.getElementById('book-time');
    grid.innerHTML = allSlots.map(slot => {
      const isBusy   = booked.has(slot);
      const isSelNow = timeEl?.value === slot;
      return `<button onclick="QDC_calendar.pickSlot('${slot}')" style="
        padding:5px 10px;font-size:.75rem;font-family:'Jost',sans-serif;cursor:${isBusy?'not-allowed':'pointer'};
        border:1px solid ${isBusy?'var(--border)':isSelNow?'var(--crimson)':'rgba(18,81,170,.35)'};
        background:${isBusy?'var(--surface)':isSelNow?'rgba(192,57,43,.12)':'rgba(18,81,170,.06)'};
        color:${isBusy?'var(--text3)':isSelNow?'var(--crimson)':'var(--blue3)'};
        ${isBusy?'text-decoration:line-through;opacity:.5;pointer-events:none;':''}
        border-radius:2px;transition:all .15s;letter-spacing:.03em"
        ${isBusy?'disabled':''}>
        ${slot}${isBusy?' ✕':''}
      </button>`;
    }).join('');
  },

  pickSlot(slot){
    const t = document.getElementById('book-time');
    if(t){ t.value = slot; }
    // Re-render slots to highlight selected
    this.loadAvailableSlots();
  },

  openEditModal(appt){
    this._editId = appt.ApptID||appt.apptid||appt.id||null;
    this._selectedPat = { id:appt.PatientID||appt.patientid, name:appt.Name||appt.name, phone:appt.Phone||appt.phone };
    const title = document.getElementById('book-modal-title');
    if(title) title.textContent = '✏️ Edit Appointment';
    const d=document.getElementById('book-date'); if(d) d.value=(appt.Date||appt.date||'').slice(0,10);
    const t=document.getElementById('book-time'); if(t) t.value=appt.Time||appt.time||'';
    document.getElementById('book-duration').value=String(appt.Duration||appt.duration||60);
    document.getElementById('book-treatment').value=appt.Treatment||appt.treatment||'';
    document.getElementById('book-notes').value=appt.Notes||appt.notes||'';
    const nm=appt.Name||appt.name||''; const pid=appt.PatientID||appt.patientid||'';
    document.getElementById('book-pat-search').value=nm;
    document.getElementById('book-pat-selected').innerHTML=`<div style="background:rgba(201,151,58,.08);border:1px solid var(--border2);padding:8px 12px;font-size:.84rem;color:var(--gold)">✓ ${nm} — ${pid}</div>`;
    document.getElementById('book-delete-btn').style.display='block';
    document.getElementById('book-msg').textContent='';
    document.getElementById('bookApptOverlay').classList.add('show');
  },

  // ── Patient search in booking modal ───────────────────────────────────────
  searchPatient(){
    const q = document.getElementById('book-pat-search')?.value.trim();
    const res = document.getElementById('book-pat-results');
    // Reset selected patient when user types again
    this._selectedPat = null;
    document.getElementById('book-pat-selected').innerHTML='';
    document.getElementById('book-walkin-phone-wrap').style.display = q ? 'block' : 'none';
    if(!q||q.length<2){ res.style.display='none'; return; }
    // If patient data isn't loaded yet, show loading message and trigger load
    if(!QDC_staff._patData?.length){
      res.innerHTML='<div style="padding:10px 14px;font-size:.84rem;color:var(--text3)">⌛ Loading patients…</div>';
      res.style.display='block';
      if(!QDC_staff._patLoaded){ QDC_staff._patLoaded=true; QDC_staff._loadPatients(); }
      return;
    }
    const data = (QDC_staff._patData||[]).filter(p=>
      (p.name||'').toLowerCase().includes(q.toLowerCase())||
      (p.id||'').toLowerCase().includes(q.toLowerCase())||
      (p.phone||'').includes(q)
    ).slice(0,8);
    if(!data.length){ res.innerHTML='<div style="padding:10px 14px;font-size:.84rem;color:var(--text3)">No patients found</div>'; res.style.display='block'; return; }
    res.innerHTML = data.map(p=>`
      <div onclick="QDC_calendar.selectPatient(${JSON.stringify(p).replace(/"/g,'&quot;')})"
        style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);font-size:.88rem"
        onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
        <span style="color:var(--text);font-weight:500">${p.name||'—'}</span>
        <span style="color:var(--text3);font-size:.78rem;margin-left:8px">${p.id||''}</span>
        <span style="color:var(--text3);font-size:.78rem;margin-left:6px">${p.phone||''}</span>
      </div>`).join('');
    res.style.display='block';
  },

  selectPatient(p){
    this._selectedPat = p;
    document.getElementById('book-pat-search').value=p.name||'';
    document.getElementById('book-pat-results').style.display='none';
    document.getElementById('book-walkin-phone-wrap').style.display='none';
    document.getElementById('book-pat-selected').innerHTML=`
      <div style="background:rgba(201,151,58,.08);border:1px solid var(--border2);padding:8px 12px;font-size:.84rem;color:var(--gold)">
        ✓ ${p.name||'—'}${p.id?' — '+p.id:''}${p.phone?' — '+p.phone:''}
      </div>`;
  },

  _onPatSearchBlur(){
    // If nothing was selected from dropdown and there's a typed name, show phone field
    setTimeout(()=>{
      if(!this._selectedPat && document.getElementById('book-pat-search')?.value.trim()){
        document.getElementById('book-walkin-phone-wrap').style.display='block';
      }
    }, 200);
  },

  // ── Save appointment ───────────────────────────────────────────────────────
  async saveAppointment(){
    const pat   = this._selectedPat;
    const date  = document.getElementById('book-date')?.value;
    const time  = document.getElementById('book-time')?.value;
    const dur   = document.getElementById('book-duration')?.value||'60';
    const tx    = document.getElementById('book-treatment')?.value.trim()||'';
    const notes = document.getElementById('book-notes')?.value.trim()||'';
    const notify= document.getElementById('book-notify')?.checked;
    const msg   = document.getElementById('book-msg');
    const btn   = document.getElementById('book-save-btn');
    // Allow walk-in: use typed name if no patient selected from search
    const typedName = document.getElementById('book-pat-search')?.value.trim();
    const walkinPhone = document.getElementById('book-walkin-phone')?.value.trim();
    const patId   = pat?.id   || '';
    const patName = pat?.name || typedName || '';
    const patPhone= pat?.phone|| walkinPhone|| '';
    if(!patName){ if(msg){msg.textContent='Please enter a patient name.';msg.className='qdc-msg err';} return; }
    if(!date||!time){ if(msg){msg.textContent='Date and time required.';msg.className='qdc-msg err';} return; }
    // Guard: always get fresh btn reference, always re-enable on any exit
    const _resetBtn = ()=>{ const b=document.getElementById('book-save-btn'); if(b){b.textContent='Save Appointment →';b.disabled=false;} };
    if(btn){ btn.textContent='⌛ Saving…'; btn.disabled=true; }
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      if(!proxy) throw new Error('No Apps Script URL configured.');
      const params=new URLSearchParams({
        action: this._editId ? 'updateAppointment' : 'addAppointment',
        ...(this._editId?{apptId:this._editId}:{}),
        patientId:patId, name:patName, phone:patPhone,
        date, time, duration:dur, treatment:tx, notes,
        notify:notify?'1':'0',
        staffName:QDC_staff._staffName||''
      });
      const ctrl = new AbortController();
      const tmo = setTimeout(()=>ctrl.abort(), 12000); // 12s hard timeout
      let r;
      try { r = await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`, {signal:ctrl.signal}); }
      catch(fe){ clearTimeout(tmo); throw new Error(fe.name==='AbortError'?'Timed out (12s) — redeploy Apps Script and try again.':'Network error: '+fe.message); }
      clearTimeout(tmo);
      const text = await r.text();
      let d;
      try { d = JSON.parse(text); } catch(_){ throw new Error('Bad response from server. Check Apps Script is deployed as "Anyone".'); }
      if(!d.ok) throw new Error(d.error||'Server returned error — check Apps Script logs.');
      document.getElementById('bookApptOverlay').classList.remove('show');
      _resetBtn();
      await this.render();
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
      _resetBtn();
    }
  },

  async deleteAppointment(){
    if(!this._editId||!confirm('Delete this appointment?')) return;
    const proxy=window.__QDC?.SHEETS_PROXY||'';
    const msg=document.getElementById('book-msg');
    try {
      const r=await fetch(`${proxy}&action=deleteAppointment&apptId=${encodeURIComponent(this._editId)}${QDC_staff._hipaaParams()}`);
      const d=await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      document.getElementById('bookApptOverlay').classList.remove('show');
      await this.render();
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
      _resetBtn();
    }
  }
};

/* ─── NAV SCROLL BEHAVIOUR ─── */
(function(){
  const nav = document.getElementById('main-nav');
  if(!nav) return;
  let lastY = 0, ticking = false;
  function update(){
    const y = window.scrollY;
    if(y < 60){
      // At top — hide nav (transparent)
      nav.classList.remove('nav--visible');
    } else if(y > lastY){
      // Scrolling DOWN — hide nav (slide up)
      nav.style.transform = 'translateY(-100%)';
      nav.classList.remove('nav--visible');
    } else {
      // Scrolling UP — show nav
      nav.style.transform = 'translateY(0)';
      nav.classList.add('nav--visible');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, {passive:true});
  update();
})();

/* ─── SCROLL PROGRESS BAR ─── */
(function(){
  const bar = document.getElementById('qdc-scroll-bar');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const s = document.documentElement;
    const pct = (s.scrollTop || document.body.scrollTop) / ((s.scrollHeight || document.body.scrollHeight) - s.clientHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, {passive:true});
})();

/* ─── HERO PARTICLE CANVAS ─── */
(function(){
  const canvas = document.getElementById('qdc-particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;

  function resize(){
    const hero = document.getElementById('hero');
    W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  function Particle(){
    this.reset = function(fromBottom){
      this.x  = Math.random() * W;
      this.y  = fromBottom ? H + 10 : Math.random() * H;
      this.vx = (Math.random() - .5) * .7;
      this.vy = -Math.random() * 1.2 - .5;
      this.r  = Math.random() * 3 + 1;
      this.alpha = Math.random() * .55 + .25;
      this.life = 0;
      this.maxLife = Math.random() * 280 + 140;
      this.type = Math.floor(Math.random() * 3); // 0=dot 1=cross 2=diamond
      // Random color: gold or blue
      this.gold = Math.random() > .45;
    };
    this.reset(false);
    this.life = Math.random() * this.maxLife;
  }

  function drawParticle(p){
    const progress = p.life / p.maxLife;
    const fade = progress < .15 ? progress / .15 : progress > .7 ? 1 - (progress - .7) / .3 : 1;
    const a = p.alpha * fade;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(p.x, p.y);

    if(p.type === 0){
      // glowing dot
      const g = ctx.createRadialGradient(0,0,0,0,0,p.r*4);
      if(p.gold){
        g.addColorStop(0, 'rgba(255,185,30,1)');
        g.addColorStop(.4,'rgba(200,134,10,.6)');
        g.addColorStop(1, 'rgba(200,134,10,0)');
      } else {
        g.addColorStop(0, 'rgba(80,140,255,1)');
        g.addColorStop(.4,'rgba(18,81,170,.6)');
        g.addColorStop(1, 'rgba(18,81,170,0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, p.r*4, 0, Math.PI*2); ctx.fill();
    } else if(p.type === 1){
      // plus cross
      const col = p.gold ? `rgba(255,185,30,${a})` : `rgba(100,160,255,${a})`;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.2;
      const s = p.r * 2.5;
      ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(0,s); ctx.stroke();
    } else {
      // diamond
      const col = p.gold ? `rgba(240,180,20,${a})` : `rgba(60,120,240,${a})`;
      ctx.fillStyle = col;
      const s = p.r * 2.2;
      ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(s*.6,0); ctx.lineTo(0,s); ctx.lineTo(-s*.6,0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function init(){
    particles = [];
    for(let i = 0; i < 70; i++) particles.push(new Particle());
  }

  function animate(){
    ctx.clearRect(0, 0, W, H);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy; p.life++;
      if(p.life >= p.maxLife || p.y < -20){ p.reset(true); }
      drawParticle(p);
    }
    raf = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', ()=>{ resize(); init(); }, {passive:true});

  // Pause when not visible
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ cancelAnimationFrame(raf); raf=null; }
    else if(!raf){ raf=requestAnimationFrame(animate); }  // restart only once
  });
})();

/* ─── BUTTON RIPPLE ─── */
document.addEventListener('click', function(e){
  const btn = e.target.closest('.qdc-btn-primary, .btn-gold');
  if(!btn) return;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.22);width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:rippleOut .55s ease-out forwards;pointer-events:none;z-index:10`;
  btn.style.position = 'relative'; btn.style.overflow = 'hidden';
  btn.appendChild(r);
  setTimeout(()=>r.remove(), 600);
}, true);

/* inject ripple keyframes */
(function(){
  const s = document.createElement('style');
  s.textContent = '@keyframes rippleOut{to{transform:scale(1);opacity:0}}';
  document.head.appendChild(s);
})();

/* ─── STAT COUNTER ANIMATION ─── */
(function(){
  const stats = document.querySelectorAll('.hero-stats .stat-n');
  if(!stats.length) return;

  function animCount(el){
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g,''));
    const suffix = raw.replace(/[0-9.]/g,'');
    if(isNaN(num) || num === 0) return;
    const dur = 1400, steps = 60;
    let frame = 0;
    const timer = setInterval(()=>{
      frame++;
      const prog = frame / steps;
      const ease = 1 - Math.pow(1 - prog, 3); // cubic ease-out
      const cur = Math.round(num * ease * 10) / 10;
      el.textContent = (cur % 1 === 0 ? Math.round(cur) : cur) + suffix;
      if(frame >= steps){ el.textContent = raw; clearInterval(timer); }
    }, dur / steps);
  }

  // Trigger once when hero stats scroll into view
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        stats.forEach((s,i) => setTimeout(()=> animCount(s), i * 150));
        obs.disconnect();
      }
    });
  }, {threshold: .5});

  const statsWrap = document.querySelector('.hero-stats');
  if(statsWrap) obs.observe(statsWrap);
})();

/* ─── ENHANCED SECTION REVEAL — stagger children ─── */
(function(){
  const cards = document.querySelectorAll(
    '.svc-card, .doc-card, .rev-card, .tech-item, .fac-item, .cost-card, .treat-card'
  );
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.transitionDelay = (e.target.dataset.si || 0) + 'ms';
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});

  // Assign stagger delays within each grid
  document.querySelectorAll('.svc-grid, .rev-grid, .tech-grid, .fac-grid, .doc-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.dataset.si = i * 80;
      child.classList.add('reveal');
      obs.observe(child);
    });
  });
})();




/* ─── TREATMENT CARD CANVASES ─── */
document.querySelectorAll('.tc').forEach(cv=>{
  const type=cv.dataset.t;
  const W=400,H=280;cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d');
  let t=0;
  function p(ti,sp,mn,mx){return mn+(mx-mn)*(Math.sin(ti*sp)*.5+.5);}
  function bg(){
    const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0d1018');g.addColorStop(1,'#07090e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(201,151,58,.04)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }
  function gl(){const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'transparent');g.addColorStop(.3,'rgba(201,151,58,.5)');g.addColorStop(.7,'rgba(201,151,58,.5)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,H-2,W,2);}

  function rAligner(){
    bg();
    const rg=ctx.createRadialGradient(W/2,H*.48,0,W/2,H*.48,128);rg.addColorStop(0,'rgba(100,180,255,'+p(t,.8,.08,.2)+')');rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(W/2,H*.48,128,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(W/2,H*.56);
    const aw=118,ah=70;
    ctx.beginPath();ctx.arc(0,0,aw,Math.PI,0);ctx.lineTo(aw,ah);ctx.arc(0,ah,aw,0,Math.PI);ctx.closePath();
    const ag=ctx.createLinearGradient(0,-aw,0,ah+aw);ag.addColorStop(0,'rgba(178,234,255,.82)');ag.addColorStop(.5,'rgba(140,205,255,.52)');ag.addColorStop(1,'rgba(80,140,220,.32)');ctx.fillStyle=ag;ctx.fill();
    ctx.strokeStyle='rgba(180,230,255,'+p(t,.6,.5,.92)+')';ctx.lineWidth=2.5;ctx.stroke();
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(i*aw*.38,-(ah*.46+Math.abs(i)*4),aw*.08,ah*.2,0,0,Math.PI*2);ctx.fillStyle='rgba(210,242,255,.48)';ctx.fill();ctx.strokeStyle='rgba(180,225,255,.65)';ctx.lineWidth=1;ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,'+p(t,1.3,.03,.11)+')';ctx.fillRect(-aw,-ah*.45-ah*.28,aw*2,7);
    ctx.restore();
    ctx.fillStyle='rgba(180,230,255,.88)';ctx.font='600 13px Jost,sans-serif';ctx.textAlign='center';ctx.fillText('CLEAR ALIGNER TRAY',W/2,H*.12);
    ctx.fillStyle='rgba(120,185,255,.5)';ctx.font='300 10px Jost,sans-serif';ctx.fillText('Virtually invisible when worn',W/2,H*.2);gl();
  }

  function rScan(){
    bg();
    ctx.strokeStyle='rgba(201,151,58,'+p(t,.5,.04,.09)+')';ctx.lineWidth=.7;
    for(let x=0;x<W;x+=22){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=22){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.save();ctx.translate(W/2,H*.54);
    const s=48,sc=1+p(t,.5,.0,.07);ctx.scale(sc,sc);
    function tw(ox,oy,c){ctx.beginPath();ctx.moveTo(ox-s*.5,oy-s*.55);ctx.bezierCurveTo(ox-s*.5,oy-s*1.1,ox+s*.5,oy-s*1.1,ox+s*.5,oy-s*.55);ctx.bezierCurveTo(ox+s*.55,oy,ox+s*.3,oy+s*.35,ox,oy+s*.5);ctx.bezierCurveTo(ox-s*.3,oy+s*.35,ox-s*.55,oy,ox-s*.5,oy-s*.55);ctx.closePath();ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(ox+s*.5,oy-s*.55);ctx.lineTo(ox+s*.65,oy-s*.7);ctx.stroke();ctx.beginPath();ctx.moveTo(ox+s*.48,oy-s*.2);ctx.lineTo(ox+s*.63,oy-s*.35);ctx.stroke();}
    tw(0,0,'rgba(201,151,58,'+p(t,.6,.5,.92)+')');tw(7,-8,'rgba(232,184,75,'+p(t,.6,.2,.44)+')');
    const bY=-s*1.18+Math.sin(t*1.5)*s*2.2;
    const bgl2=ctx.createLinearGradient(0,bY-5,0,bY+5);bgl2.addColorStop(0,'transparent');bgl2.addColorStop(.5,'rgba(232,184,75,'+p(t*1.5,.8,.22,.62)+')');bgl2.addColorStop(1,'transparent');
    ctx.fillStyle=bgl2;ctx.fillRect(-s,bY-5,s*2,10);
    ctx.restore();
    [[12,10],[W-12,10],[12,H-10],[W-12,H-10]].forEach(([bx,by],i)=>{ctx.strokeStyle='rgba(201,151,58,.45)';ctx.lineWidth=1.5;const sx=i%2===0?1:-1,sy=i<2?1:-1;ctx.beginPath();ctx.moveTo(bx,by+sy*14);ctx.lineTo(bx,by);ctx.lineTo(bx+sx*14,by);ctx.stroke();});
    ctx.fillStyle='rgba(201,151,58,.88)';ctx.font='600 13px Jost,sans-serif';ctx.textAlign='center';ctx.fillText('3D DIGITAL SCAN',W/2,H*.12);
    ctx.fillStyle='rgba(201,151,58,.45)';ctx.font='300 10px Jost,sans-serif';ctx.fillText('Instant model · No impressions',W/2,H*.2);gl();
  }

  function rSmile(){
    bg();
    const rg=ctx.createRadialGradient(W/2,H*.52,0,W/2,H*.52,152);rg.addColorStop(0,'rgba(201,151,58,'+p(t,.5,.09,.22)+')');rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(W/2,H*.52,152,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(W/2,H*.54);
    const sm=86;
    ctx.beginPath();ctx.ellipse(0,0,sm,sm*.4,0,0,Math.PI);
    const lg=ctx.createLinearGradient(-sm,0,sm,0);lg.addColorStop(0,'rgba(192,57,43,.7)');lg.addColorStop(.5,'rgba(215,78,60,.82)');lg.addColorStop(1,'rgba(192,57,43,.7)');ctx.fillStyle=lg;ctx.fill();
    ctx.beginPath();ctx.ellipse(0,4,sm*.76,sm*.26,0,0,Math.PI);ctx.fillStyle='rgba(18,7,7,.9)';ctx.fill();
    const tw2=sm*.76*2/6,th2=sm*.22;
    for(let i=0;i<6;i++){const tx=-sm*.76+i*tw2+tw2*.05,ty2=4;const tg=ctx.createLinearGradient(tx,ty2,tx,ty2+th2);tg.addColorStop(0,'rgba(253,248,241,.97)');tg.addColorStop(1,'rgba(220,210,192,.82)');ctx.fillStyle=tg;ctx.beginPath();ctx.roundRect(tx,ty2,tw2*.9,th2,2);ctx.fill();ctx.strokeStyle='rgba(201,151,58,.2)';ctx.lineWidth=.7;ctx.stroke();}
    [[sm*.68,-sm*.28],[sm*.85,sm*.04],[-sm*.72,-sm*.24]].forEach(([sx,sy])=>{const sa=p(t+sx*.01,.8,.32,1);ctx.fillStyle='rgba(245,208,128,'+sa+')';ctx.font=(11+sa*4)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✦',sx,sy);});
    ctx.beginPath();ctx.moveTo(-sm,0);ctx.bezierCurveTo(-sm*.5,-sm*.16,sm*.5,-sm*.16,sm,0);ctx.strokeStyle='rgba(192,57,43,.5)';ctx.lineWidth=2;ctx.stroke();
    ctx.restore();
    ctx.fillStyle='rgba(245,208,128,.9)';ctx.font='600 13px Jost,sans-serif';ctx.textAlign='center';ctx.fillText('YOUR NEW SMILE',W/2,H*.12);
    ctx.fillStyle='rgba(201,151,58,.5)';ctx.font='300 10px Jost,sans-serif';ctx.fillText('Confident · Aligned · Beautiful',W/2,H*.2);gl();
  }

  function rMetal(){
    bg();
    ctx.save();ctx.translate(W/2,H*.54);
    ctx.beginPath();ctx.moveTo(-128,-8);
    for(let x=-128;x<=128;x+=2){ctx.lineTo(x,-8+Math.sin(x*.06+t*1.5)*3+Math.abs(x)*.003);}
    ctx.strokeStyle='rgba(200,215,230,'+p(t,.5,.72,.96)+')';ctx.lineWidth=3;ctx.stroke();
    for(let i=-3;i<=3;i++){if(i===0)continue;const bx=i*36;const by=-8+Math.sin(bx*.06+t*1.5)*3+Math.abs(bx)*.003;ctx.fillStyle='rgba(242,238,228,.65)';ctx.beginPath();ctx.roundRect(bx-10,by-26,20,42,2);ctx.fill();ctx.fillStyle='rgba(180,198,218,.9)';ctx.fillRect(bx-7,by-6,14,12);ctx.strokeStyle='rgba(220,232,242,.8)';ctx.lineWidth=1;ctx.strokeRect(bx-7,by-6,14,12);ctx.fillStyle='rgba(78,100,125,.72)';ctx.fillRect(bx-7,by-1.5,14,3);ctx.fillStyle='rgba('+(192+p(t+i*.3,.8,0,38))+',57,43,.82)';ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    ctx.fillStyle='rgba(200,218,238,.88)';ctx.font='600 13px Jost,sans-serif';ctx.textAlign='center';ctx.fillText('METAL BRACES',W/2,H*.12);
    ctx.fillStyle='rgba(160,185,215,.5)';ctx.font='300 10px Jost,sans-serif';ctx.fillText('Most durable · For complex cases',W/2,H*.2);gl();
  }

  function rCeramic(){
    bg();
    ctx.save();ctx.translate(W/2,H*.54);
    ctx.beginPath();ctx.moveTo(-128,-8);
    for(let x=-128;x<=128;x+=2){ctx.lineTo(x,-8+Math.sin(x*.06+t*1.5)*3+Math.abs(x)*.003);}
    ctx.strokeStyle='rgba(220,208,180,'+p(t,.5,.62,.88)+')';ctx.lineWidth=2.5;ctx.stroke();
    for(let i=-3;i<=3;i++){if(i===0)continue;const bx=i*36;const by=-8+Math.sin(bx*.06+t*1.5)*3+Math.abs(bx)*.003;ctx.fillStyle='rgba(242,238,226,.7)';ctx.beginPath();ctx.roundRect(bx-10,by-26,20,42,2);ctx.fill();ctx.fillStyle='rgba(234,224,204,.88)';ctx.fillRect(bx-7,by-6,14,12);ctx.strokeStyle='rgba(201,151,58,.38)';ctx.lineWidth=1;ctx.strokeRect(bx-7,by-6,14,12);ctx.fillStyle='rgba(178,158,118,.55)';ctx.fillRect(bx-7,by-1.5,14,3);ctx.fillStyle='rgba(218,204,178,.6)';ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    ctx.fillStyle='rgba(230,216,186,.88)';ctx.font='600 13px Jost,sans-serif';ctx.textAlign='center';ctx.fillText('CERAMIC BRACES',W/2,H*.12);
    ctx.fillStyle='rgba(201,151,58,.5)';ctx.font='300 10px Jost,sans-serif';ctx.fillText('Tooth-coloured · Discreet',W/2,H*.2);gl();
  }

  function render(){
    ctx.clearRect(0,0,W,H);
    if(type==='aligner')rAligner();
    else if(type==='scan')rScan();
    else if(type==='smile')rSmile();
    else if(type==='metal')rMetal();
    else if(type==='ceramic')rCeramic();
    t+=0.018;if(!document.hidden)requestAnimationFrame(render);
  }
  render();
});

/* ─── IMPLANT SECTION CANVAS ─── */
(function(){
  const cv = document.getElementById('implant-canvas');
  if(!cv) return;
  const box = cv.parentElement;
  function resize(){
    cv.width  = box.offsetWidth  || 600;
    cv.height = box.offsetHeight || 400;
  }
  resize();
  window.addEventListener('resize', resize);
  const ctx = cv.getContext('2d');
  let t = 0;
  function p(ti,sp,mn,mx){return mn+(mx-mn)*(Math.sin(ti*sp)*.5+.5);}

  function draw(){
    const W=cv.width, H=cv.height;
    if(W<10||H<10){t+=0.018;if(!document.hidden)requestAnimationFrame(draw);return;}
    ctx.clearRect(0,0,W,H);
    const cx=W*.42, cy=H*.5, s=Math.min(W,H)*.18;

    // White background
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(18,81,170,.04)'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    // Osseointegration glow
    const ossA=.1+Math.sin(t*.7)*.06;
    const og=ctx.createRadialGradient(cx,cy+H*.2,0,cx,cy+H*.2,s*1.2);
    og.addColorStop(0,`rgba(100,220,100,${ossA})`); og.addColorStop(1,'transparent');
    ctx.fillStyle=og; ctx.beginPath(); ctx.arc(cx,cy+H*.2,s*1.2,0,Math.PI*2); ctx.fill();

    // Jawbone
    const jg=ctx.createLinearGradient(0,cy+H*.06,0,H);
    jg.addColorStop(0,'rgba(180,210,240,.75)'); jg.addColorStop(1,'rgba(140,185,225,.55)');
    ctx.fillStyle=jg;
    ctx.beginPath(); ctx.roundRect(cx-W*.22,cy+H*.06,W*.44,H*.38,10);
    ctx.fill(); ctx.strokeStyle='rgba(80,150,230,.5)'; ctx.lineWidth=2; ctx.stroke();
    // Bone texture
    ctx.strokeStyle='rgba(18,81,170,.07)'; ctx.lineWidth=1;
    for(let bx=cx-W*.2;bx<cx+W*.2;bx+=14){ctx.beginPath();ctx.moveTo(bx,cy+H*.08);ctx.lineTo(bx+7,cy+H*.42);ctx.stroke();}

    // Implant screw
    const scrTop=cy+H*.03, scrBot=cy+H*.35, scrW=s*.3;
    const ig=ctx.createLinearGradient(cx-scrW,0,cx+scrW,0);
    ig.addColorStop(0,'rgba(60,110,180,.8)'); ig.addColorStop(.35,'rgba(120,185,255,.95)');
    ig.addColorStop(.65,'rgba(120,185,255,.95)'); ig.addColorStop(1,'rgba(60,110,180,.8)');
    ctx.fillStyle=ig;
    ctx.beginPath(); ctx.roundRect(cx-scrW,scrTop,scrW*2,scrBot-scrTop,6); ctx.fill();
    ctx.strokeStyle='rgba(160,210,255,.6)'; ctx.lineWidth=2; ctx.stroke();
    // Thread marks
    for(let ti=0;ti<12;ti++){
      const ty=scrTop+ti*(scrBot-scrTop)/12;
      const tw=scrW+4+Math.sin(ti*.7)*2;
      ctx.strokeStyle='rgba(40,80,150,.65)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx-tw,ty); ctx.lineTo(cx+tw,ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-tw,ty); ctx.lineTo(cx-tw-5,ty+5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+tw,ty); ctx.lineTo(cx+tw+5,ty+5); ctx.stroke();
    }

    // Abutment
    const abT=cy-H*.07, abB=cy+H*.05;
    const abG=ctx.createLinearGradient(cx-s*.14,0,cx+s*.14,0);
    abG.addColorStop(0,'rgba(80,140,210,.8)'); abG.addColorStop(.5,'rgba(160,215,255,.95)'); abG.addColorStop(1,'rgba(80,140,210,.8)');
    ctx.fillStyle=abG;
    ctx.beginPath(); ctx.roundRect(cx-s*.14,abT,s*.28,abB-abT,4); ctx.fill();
    ctx.strokeStyle='rgba(140,200,255,.7)'; ctx.lineWidth=1.5; ctx.stroke();

    // Crown
    const cs=s*.96, crY=cy-s*.98;
    ctx.beginPath();
    ctx.moveTo(cx-cs*.45,crY-cs*.5);
    ctx.bezierCurveTo(cx-cs*.45,crY-cs*1.08,cx+cs*.45,crY-cs*1.08,cx+cs*.45,crY-cs*.5);
    ctx.bezierCurveTo(cx+cs*.54,crY,cx+cs*.32,crY+cs*.32,cx,crY+cs*.52);
    ctx.bezierCurveTo(cx-cs*.32,crY+cs*.32,cx-cs*.54,crY,cx-cs*.45,crY-cs*.5);
    ctx.closePath();
    const cg=ctx.createLinearGradient(cx,crY-cs,cx,crY+cs*.5);
    cg.addColorStop(0,'rgba(252,248,242,.99)'); cg.addColorStop(.6,'rgba(228,210,188,.93)'); cg.addColorStop(1,'rgba(198,172,140,.86)');
    ctx.fillStyle=cg; ctx.fill();
    ctx.strokeStyle=`rgba(201,151,58,${.5+Math.sin(t*.7)*.2})`; ctx.lineWidth=2.5; ctx.stroke();
    // Crown shimmer
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx-cs*.45,crY-cs*.5);
    ctx.bezierCurveTo(cx-cs*.45,crY-cs*1.08,cx+cs*.45,crY-cs*1.08,cx+cs*.45,crY-cs*.5);
    ctx.bezierCurveTo(cx+cs*.54,crY,cx+cs*.32,crY+cs*.32,cx,crY+cs*.52);
    ctx.bezierCurveTo(cx-cs*.32,crY+cs*.32,cx-cs*.54,crY,cx-cs*.45,crY-cs*.5);
    ctx.closePath(); ctx.clip();
    const csh=ctx.createLinearGradient(cx-cs*.3,crY-cs*.9,cx+cs*.2,crY-cs*.3);
    csh.addColorStop(0,`rgba(255,255,255,${.08+Math.sin(t*.9)*.06})`); csh.addColorStop(1,'transparent');
    ctx.fillStyle=csh; ctx.fillRect(cx-cs,crY-cs*1.1,cs*2,cs*.9); ctx.restore();

    // Labels
    const lx=cx+W*.26;
    const items=[
      [cx+cs*.5,crY,'Crown','Zirconia ceramic'],
      [cx+s*.16,abT+(abB-abT)/2,'Abutment','Ti connector'],
      [cx+scrW+4,scrTop+(scrBot-scrTop)/2,'Implant','Titanium screw'],
      [cx+W*.1,cy+H*.3,'Jawbone','Osseointegration'],
    ];
    items.forEach(([ix,iy,ti2,si])=>{
      ctx.strokeStyle='rgba(201,151,58,.4)'; ctx.lineWidth=1; ctx.setLineDash([4,5]);
      ctx.beginPath(); ctx.moveTo(ix,iy); ctx.lineTo(lx,iy); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(200,134,10,.85)'; ctx.beginPath(); ctx.arc(ix,iy,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(18,81,170,.9)'; ctx.font='600 '+Math.max(10,W*.022)+'px Jost,sans-serif'; ctx.textAlign='left'; ctx.fillText(ti2,lx+5,iy-3);
      ctx.fillStyle='rgba(18,81,170,.55)'; ctx.font='300 '+Math.max(9,W*.019)+'px Jost,sans-serif'; ctx.fillText(si,lx+5,iy+Math.max(10,W*.022));
    });

    // Corner brackets
    const bl=16; [[10,10],[W-10,10],[10,H-10],[W-10,H-10]].forEach(([bx,by],i)=>{
      ctx.strokeStyle='rgba(201,151,58,.6)'; ctx.lineWidth=1.5;
      const sx=i%2===0?1:-1,sy=i<2?1:-1;
      ctx.beginPath(); ctx.moveTo(bx,by+sy*bl); ctx.lineTo(bx,by); ctx.lineTo(bx+sx*bl,by); ctx.stroke();
    });
    // Title
    ctx.fillStyle='rgba(18,81,170,.85)'; ctx.font='600 '+Math.max(11,W*.022)+'px Jost,sans-serif';
    ctx.textAlign='center'; ctx.fillText('3D-GUIDED IMPLANT PLACEMENT',W/2,H*.07);

    t+=0.016;if(!document.hidden)requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── DOCTOR PORTRAITS ─── */
document.querySelectorAll('.doc-portrait').forEach(cv=>{
  const box=cv.parentElement;cv.width=box.offsetWidth||440;cv.height=box.offsetHeight||250;
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  const ini=cv.dataset.i,c1=cv.dataset.c1,c2=cv.dataset.c2,pat=parseInt(cv.dataset.p||1);
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,c1);bg.addColorStop(1,c2);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=1;
  if(pat===1)for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(i*40,0);ctx.lineTo(i*40,H);ctx.stroke();}
  if(pat===2)for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(W/2,H/2,25+i*20,0,Math.PI*2);ctx.stroke();}
  if(pat===3)for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(0,i*30);ctx.lineTo(W,i*30);ctx.stroke();}
  const cX=W/2,cY=H*.45;
  const sg=ctx.createRadialGradient(cX,cY-12,0,cX,cY,75);sg.addColorStop(0,'rgba(255,255,255,.22)');sg.addColorStop(1,'rgba(255,255,255,.05)');ctx.fillStyle=sg;ctx.beginPath();ctx.arc(cX,cY,72,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.24)';ctx.beginPath();ctx.arc(cX,cY-14,28,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.17)';ctx.beginPath();ctx.arc(cX,cY+52,46,Math.PI,0);ctx.fill();
  ctx.font='bold 38px "Cormorant Garamond",Georgia,serif';ctx.fillStyle='rgba(255,255,255,.92)';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ini,cX,cY+4);
  const lg=ctx.createLinearGradient(0,0,W,0);lg.addColorStop(0,c1);lg.addColorStop(.5,'#e8b84b');lg.addColorStop(1,c2);ctx.fillStyle=lg;ctx.fillRect(0,0,W,3);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(0,H-26,W,26);
});

/* ─── SCROLL REVEAL ─── */
const rObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:0,rootMargin:'0px 0px -40px 0px'});
/* Fire immediately for elements already in viewport */
requestAnimationFrame(()=>{document.querySelectorAll('.reveal').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<window.innerHeight)el.classList.add('on');});});
document.querySelectorAll('.reveal').forEach(el=>rObs.observe(el));

/* ─── FAQ ─── */
document.addEventListener('click',e=>{
  const q=e.target.closest('.faq-q');if(!q)return;
  const item=q.closest('.faq-item'),was=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!was)item.classList.add('open');
});

/* ─── APPOINTMENT ─── */
// ── Public slot picker ───────────────────────────────────────────────────────
let _publicSelectedSlot = '';

async function loadPublicSlots(){
  const dateEl  = document.getElementById('appt-date');
  const wrap    = document.getElementById('appt-slots-wrap');
  const grid    = document.getElementById('appt-slots-grid');
  const lbl     = document.getElementById('appt-slots-date-label');
  if(!dateEl?.value || !wrap || !grid) return;
  const date = dateEl.value;
  _publicSelectedSlot = '';
  document.getElementById('appt-selected-slot').textContent = '';
  wrap.style.display = 'block';
  if(lbl) lbl.textContent = new Date(date+'T12:00:00').toLocaleDateString('en-BD',{weekday:'long',day:'numeric',month:'long'});
  grid.innerHTML = '<span style="font-size:.82rem;color:var(--text3)">Checking availability…</span>';

  const dow = new Date(date+'T00:00:00').getDay(); // 5=Fri
  const isFri = dow === 5;
  const allSlots = [];
  for(let h = isFri?16:12; h < 21; h++){
    allSlots.push(String(h).padStart(2,'0')+':00');
    if(h < 20) allSlots.push(String(h).padStart(2,'0')+':30');
  }

  let booked = new Set();
  try {
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    if(proxy){
      const r = await fetch(`${proxy}&action=getAppointments&start=${date}&end=${date}${QDC_staff._hipaaParams()}`);
      const appts = await r.json();
      if(Array.isArray(appts)) appts.forEach(a => {
        const t   = (a.Time||a.time||'').slice(0,5);
        const dur = parseInt(a.Duration||a.duration||60);
        booked.add(t);
        if(dur > 30){
          const [hh,mm] = t.split(':').map(Number);
          booked.add(mm===0 ? String(hh).padStart(2,'0')+':30' : String(hh+1).padStart(2,'0')+':00');
        }
      });
    }
  } catch(_){}

  grid.innerHTML = allSlots.map(slot => {
    const busy = booked.has(slot);
    return `<button type="button" onclick="pickPublicSlot('${slot}',this)" style="
      padding:8px 12px;font-size:.82rem;font-family:inherit;cursor:${busy?'not-allowed':'pointer'};
      border:1.5px solid ${busy?'var(--border)':'rgba(18,81,170,.35)'};
      background:${busy?'var(--surface)':'rgba(18,81,170,.05)'};
      color:${busy?'var(--text3)':'var(--blue3)'};
      ${busy?'text-decoration:line-through;opacity:.45;pointer-events:none;':''}
      border-radius:3px;transition:all .15s;font-weight:500"
      ${busy?'disabled':''}>${slot}</button>`;
  }).join('');
}

function pickPublicSlot(slot, btn){
  _publicSelectedSlot = slot;
  document.querySelectorAll('#appt-slots-grid button').forEach(b=>{
    b.style.background = 'rgba(18,81,170,.05)';
    b.style.borderColor = 'rgba(18,81,170,.35)';
    b.style.color = 'var(--blue3)';
  });
  btn.style.background    = 'var(--crimson)';
  btn.style.borderColor   = 'var(--crimson)';
  btn.style.color         = '#fff';
  document.getElementById('appt-selected-slot').textContent = '✓ Selected: '+slot+' — Click Send Request to confirm.';
}

async function doAppt(e){
  e.preventDefault();
  const name  = document.getElementById('appt-name')?.value || '';
  const phone = document.getElementById('appt-phone')?.value || '';
  const dept  = document.getElementById('appt-dept')?.value || 'Not specified';
  const date  = document.getElementById('appt-date')?.value || '';
  const notes = document.getElementById('appt-notes')?.value || '';
  const slot  = _publicSelectedSlot;
  const proxy = window.__QDC?.SHEETS_PROXY || '';

  const dateStr = date ? new Date(date+'T12:00:00').toLocaleDateString('en-BD',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : 'Not specified';
  const slotStr = slot ? slot : 'Any available';

  // Notify manager
  if(proxy){
    const managerMsg = `🦷 *New Appointment Request*\n\n` +
      `Patient: *${name}*\nPhone: ${phone}\nDepartment: ${dept}\n` +
      `Requested Date: ${dateStr}\nRequested Time: *${slotStr}*` +
      (notes ? `\nNotes: ${notes}` : '') +
      `\n\nPlease confirm or suggest an alternative slot.`;
    fetch(`${proxy}&action=sendWhatsApp&phone=${encodeURIComponent('01307978439')}&message=${encodeURIComponent(managerMsg)}${QDC_staff._hipaaParams()}`).catch(()=>{});

    // Notify patient
    const patientMsg = `🦷 *Quick Dental Care — Appointment Request Received*\n\nDear ${name},\n\n` +
      `We've received your request for *${dateStr}* at *${slotStr}*.\n\n` +
      `✅ We will confirm your appointment or suggest an alternative time via WhatsApp within a few hours.\n\n` +
      `If urgent, call us: 📞 *+88 01307978439*\n📍 Quick Dental Care, Akhalia, Sylhet`;
    fetch(`${proxy}&action=sendWhatsApp&phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(patientMsg)}${QDC_staff._hipaaParams()}`).catch(()=>{});
  }

  // Always open WhatsApp as fallback
  const waMsg = encodeURIComponent(
    `Hello Quick Dental Care!\n\nAppointment Request\n• Name: ${name}\n• Phone: ${phone}` +
    `\n• Department: ${dept}\n• Preferred Date: ${dateStr}\n• Preferred Time: ${slotStr}` +
    (notes?`\n• Notes: ${notes}`:'')
  );
  window.open('https://wa.me/8801307978439?text='+waMsg,'_blank');

  // Show confirmation message on page
  const msgEl = document.getElementById('appt-form-msg');
  if(msgEl){
    msgEl.style.display='block';
    msgEl.innerHTML = `✅ <strong>Request sent!</strong> We'll confirm your slot at <strong>${slotStr}</strong> on <strong>${dateStr}</strong> via WhatsApp shortly.`;
  }
}


