// QDC Staff Dashboard — loaded only after staff login
// ── Wait for Firebase to be available ────────────────────────────────────────
async function waitQDC(){ return new Promise(r=>{const t=setInterval(()=>{if(window.__QDC){clearInterval(t);r(window.__QDC);}},60);}); }

// ═══════════════════════════════════════════════════════════════════════════════
//  i18n — JSON-driven EN / BN toggle
// ═══════════════════════════════════════════════════════════════════════════════
const STRINGS = {
  en: {
    nav_services:'Services', nav_implants:'Implants', nav_aligners:'Aligners',
    nav_braces:'Braces', nav_doctors:'Doctors', nav_faq:'FAQ', nav_location:'Location', nav_book:'Book Now',
    hero_eyebrow:"Quick Dental Care",
    hero_title_1:'Crafting', hero_title_hl:'Exceptional', hero_title_2:'Smiles.',
    hero_desc:'A decade of excellence in Akhalia, Sylhet. Expert specialists, 3D scanning, instant digital X-ray, and treatments that leave you confident for life.',
    hero_btn_book:'Book via WhatsApp →', hero_btn_explore:'Explore Services',
    stat_years:'Years of Care', stat_doctors:'Expert Doctors', stat_depts:'Departments', stat_rated:'Google Rated',
    tech_tag:'Advanced Technology', tech_h:'Precision Technology',
    tech_sub:'We invest in the most advanced dental technology so every diagnosis is faster, every treatment more comfortable, and every result more precise.',
    tech1_name:'3D Intraoral Scanning', tech1_desc:'Digital impressions in under 3 minutes — no putty, no gagging. Creates a precise 3D model used for crowns, aligners, and implant planning.', tech1_badge:'No Impression Material',
    tech2_name:'Instant Digital X-Ray', tech2_desc:'Results appear on screen in seconds. 90% less radiation than conventional X-ray for immediate, accurate diagnosis with peace of mind.', tech2_badge:'90% Less Radiation',
    tech3_name:'Zirconia & CAD/CAM', tech3_desc:'Computer-designed zirconia crowns crafted to match your natural teeth perfectly — the strongest, most natural-looking restorations in dentistry.', tech3_badge:'Same-Day Crowns',
    svc_tag:'What We Offer', svc_h:'Our Departments',
    svc_sub:'Eight specialised departments covering every dimension of your oral health, delivered with precision and premium care.',
    svc1_name:'Conservative Dentistry', svc1_desc:'Fillings, root canals, and complete tooth preservation using digital imaging for pinpoint accuracy.',
    svc2_name:'Instant Digital X-Ray', svc2_desc:'Periapical, bitewing & SLOB technique. Results in seconds, 90% less radiation than conventional methods.',
    svc3_name:'Prosthodontics', svc3_desc:'Dentures, bridges, zirconia & ceramic crowns, composite and porcelain veneers by skilled specialists.',
    svc4_name:'Orthodontics', svc4_desc:'Clear aligners and braces for bite correction. Scroll down to explore both treatment options in detail.',
    svc5_name:'Pediatric Dentistry', svc5_desc:'Gentle child-friendly care. Pulpotomy, pulpectomy, and preventive treatments for young patients.',
    svc6_name:'Oral & Maxillofacial', svc6_desc:'Wisdom teeth, cyst removal, fracture management, and oral cancer screening by experienced surgeons.',
    svc7_name:'Periodontal Dentistry', svc7_desc:'Gum health assessments, deep cleaning, root planing, scaling, and advanced gum disease treatment.',
    svc8_name:'Dental Implants', svc8_desc:'Permanent tooth replacement using 3D-guided implant surgery. Scroll down to learn everything about it.',
    imp_tag:'Permanent Solutions', imp_h:'Dental Implants',
    imp_sub:'The gold standard for missing teeth. A titanium implant replaces the root, and a custom crown sits on top — giving you a tooth that looks, feels, and functions exactly like a natural one. Placed with 3D-guided surgical precision.',
    imp_prec_tag:'3D-Guided Precision', imp_how_h:'How It Works',
    imp_li1:'3D intraoral scan maps your jaw before any procedure — millimetre-perfect planning',
    imp_li2:'Surgical guide manufactured from your scan for pinpoint implant placement',
    imp_li3:'Titanium implant placed under local anaesthesia — minimal trauma, fast recovery',
    imp_li4:'Instant digital X-ray confirms perfect positioning immediately after placement',
    imp_li5:'Custom zirconia crown matched to your natural tooth colour and shape',
    imp_li6:'Lasts a lifetime with normal care — no decay, no movement, no discomfort',
    imp_btn:'Book Implant Consultation →',
    imp_cost_tag:'Approximate Cost', imp_cost_h:'Implant Pricing',
    imp_c1_lbl:'Single Implant + Crown', imp_c1_note:'Titanium implant with zirconia or PFM crown. Most common procedure.',
    imp_c2_lbl:'Multiple Implants', imp_c2_note:'Discounted rate when multiple implants are placed in the same session.',
    imp_c3_lbl:'Full Arch (All-on-4/6)', imp_c3_note:'Full arch rehabilitation. Book a consultation for a detailed treatment plan and pricing.',
    aln_tag:'Invisible Orthodontics', aln_h:'Clear Aligners',
    aln_sub:'Custom-made transparent trays that gently move your teeth into perfect position. Nearly invisible, removable for eating and brushing, and designed using 3D scanning so you see your result before you start.',
    aln_t1_name:'Clear Aligner Tray', aln_t1_desc:'Custom transparent trays that fit over your teeth. Switch to a new set every 1–2 weeks as your teeth shift gradually into alignment.',
    aln_t2_name:'3D Digital Scan', aln_t2_desc:'Treatment starts with a 3-minute intraoral scan — no putty, no discomfort. We simulate your entire result digitally before you commit.',
    aln_t3_name:'Your Final Smile', aln_t3_desc:'Predictable, beautiful results confirmed by digital simulation upfront. Typical treatment: 6–18 months depending on your case complexity.',
    aln_btn:'Book Free 3D Aligner Scan →',
    brc_tag:'Traditional Orthodontics', brc_h:'Dental Braces',
    brc_sub:'The most proven orthodontic treatment available. Metal or ceramic brackets bonded to each tooth — the most effective solution for complex bite and alignment issues. Handled by our specialist orthodontist.',
    brc_t1_name:'Metal Braces', brc_t1_desc:'Stainless steel brackets with coloured elastics. The most durable and affordable option — ideal for severe crowding, overbites, underbites, and complex jaw alignment.',
    brc_t2_name:'Ceramic Braces', brc_t2_desc:'Tooth-coloured ceramic brackets that blend with your teeth. Equally effective as metal braces but far less noticeable — popular choice for adults.',
    brc_t3_name:'After Treatment', brc_t3_desc:'Perfectly aligned teeth and a corrected bite. A retainer worn after treatment keeps your new smile permanently in place for life.',
    brc_btn:'Book Braces Consultation →',
    brc_c1_lbl:'Metal Braces', brc_c1_note:'Full treatment including fittings, monthly adjustments, and final retainer.',
    brc_c2_lbl:'Ceramic Braces', brc_c2_note:'Tooth-coloured brackets. Discreet appearance with the same effectiveness as metal.',
    brc_c3_lbl:'Self-Ligating', brc_c3_note:'Advanced bracket system — fewer visits, faster treatment, and more comfortable.',
    doc_tag:'Our Team', doc_h:'Meet the Doctors',
    doc_sub:'BMDC-registered practitioners dedicated to your comfort, health, and confidence in every visit.',
    doc1_name:'Dr. Marjana Siddique Moury', doc1_role:'Chief Consultant',
    doc2_name:'Dr. Tasnia Binte Mahbub', doc2_role:'Consultant — Pediatric Dentistry',
    hrs_tag:'Opening Hours', hrs_h:'Clinic Schedule',
    loc_tag:'Find Us', loc_h:'Our Location',
    faq_tag:'Common Questions', faq_h:'Frequently Asked Questions',
    appt_tag:'Book Now', appt_h:'Request an Appointment',
    appt_name_lbl:'Full Name', appt_phone_lbl:'Phone Number', appt_dept_lbl:'Department', appt_notes_lbl:'Additional Notes',
    appt_btn:'Send via WhatsApp →',
    day_saturday:'Saturday', day_sunday:'Sunday', day_monday:'Monday',
    day_tuesday:'Tuesday', day_wednesday:'Wednesday', day_thursday:'Thursday', day_friday:'Friday',
    rev_tag:'Patient Voices', rev_h:'What People Say',
    fac_tag:'Infrastructure', fac_h:'Our Facilities',
    con_tag:'Contact Us', con_h:'Get in Touch',
    fol_us:'Follow Us',
    tab_home:'Home', tab_services:'Services', tab_doctors:'Doctors', tab_files:'My Files', tab_location:'Location',
    login_title:'Patient Login', login_sub:'Enter your WhatsApp number to receive a one-time code. Your records will appear instantly.',
    login_phone_lbl:'WhatsApp Number', login_send_otp:'Send OTP via WhatsApp →',
    login_staff_link:'Staff?', otp_title:'Enter OTP', otp_verify:'Verify & Open My Files →',
    logout:'Logout', pid_label:'Your Patient ID', pid_copy:'Copy ID',
    ptab_rx:'Prescriptions', ptab_scans:'3D Scans',
    rx_title:'📋 Your Prescriptions', rx_empty:'No prescriptions uploaded yet.',
    scans_title:'🔬 Your 3D Scans', scans_empty:'No scans available yet.',
  },
  bn: {
    nav_services:'সেবাসমূহ', nav_implants:'ইমপ্লান্ট', nav_aligners:'অ্যালাইনার',
    nav_braces:'ব্রেসেস', nav_doctors:'চিকিৎসক', nav_faq:'প্রশ্নোত্তর', nav_location:'অবস্থান', nav_book:'অ্যাপয়েন্টমেন্ট',
    hero_eyebrow:'Quick Dental Care',
    hero_title_1:'গড়ছি', hero_title_hl:'অসাধারণ', hero_title_2:'হাসি।',
    hero_desc:'আখালিয়া, সিলেটে এক দশকের শ্রেষ্ঠত্ব। বিশেষজ্ঞ চিকিৎসক, থ্রিডি স্ক্যানিং, তাৎক্ষণিক ডিজিটাল এক্স-রে এবং চিকিৎসা যা আপনাকে সারাজীবন আত্মবিশ্বাসী রাখবে।',
    hero_btn_book:'হোয়াটসঅ্যাপে বুক করুন →', hero_btn_explore:'সেবা দেখুন',
    stat_years:'বছরের সেবা', stat_doctors:'বিশেষজ্ঞ চিকিৎসক', stat_depts:'বিভাগ', stat_rated:'গুগল রেটিং',
    tech_tag:'আধুনিক প্রযুক্তি', tech_h:'নির্ভুল প্রযুক্তি',
    tech_sub:'আমরা সর্বাধুনিক ডেন্টাল প্রযুক্তিতে বিনিয়োগ করি যাতে প্রতিটি রোগ নির্ণয় দ্রুততর, প্রতিটি চিকিৎসা আরামদায়ক এবং প্রতিটি ফলাফল আরও নির্ভুল হয়।',
    tech1_name:'থ্রিডি ইন্ট্রাওরাল স্ক্যানিং', tech1_desc:'৩ মিনিটেরও কম সময়ে ডিজিটাল ছাপ — কোনো পুটি নেই, বমি ভাব নেই।', tech1_badge:'ইম্প্রেশন উপাদান নেই',
    tech2_name:'তাৎক্ষণিক ডিজিটাল এক্স-রে', tech2_desc:'ফলাফল সেকেন্ডে পর্দায় আসে। প্রচলিত এক্স-রের চেয়ে ৯০% কম বিকিরণে তাৎক্ষণিক, নির্ভুল রোগ নির্ণয়।', tech2_badge:'৯০% কম বিকিরণ',
    tech3_name:'জিরকোনিয়া ও ক্যাড/ক্যাম', tech3_desc:'কম্পিউটার-ডিজাইন করা জিরকোনিয়া মুকুট আপনার প্রাকৃতিক দাঁতের সাথে নিখুঁতভাবে মিলে যায়।', tech3_badge:'একই দিনে মুকুট',
    svc_tag:'আমরা কী দিই', svc_h:'আমাদের বিভাগসমূহ',
    svc_sub:'আটটি বিশেষজ্ঞ বিভাগ আপনার মৌখিক স্বাস্থ্যের প্রতিটি দিক কভার করে।',
    svc1_name:'কনজার্ভেটিভ ডেন্টিস্ট্রি', svc1_desc:'ফিলিং, রুট ক্যানাল এবং ডিজিটাল ইমেজিং ব্যবহার করে সম্পূর্ণ দাঁত সংরক্ষণ।',
    svc2_name:'তাৎক্ষণিক ডিজিটাল এক্স-রে', svc2_desc:'পেরিয়াপিক্যাল, বিটউইং ও এসএলওবি পদ্ধতি। সেকেন্ডে ফলাফল, ৯০% কম বিকিরণ।',
    svc3_name:'প্রস্থোডন্টিক্স', svc3_desc:'দক্ষ বিশেষজ্ঞদের দ্বারা ডেনচার, ব্রিজ, জিরকোনিয়া ও সিরামিক মুকুট, ভেনির।',
    svc4_name:'অর্থোডন্টিক্স', svc4_desc:'কামড় সংশোধনের জন্য ক্লিয়ার অ্যালাইনার ও ব্রেসেস।',
    svc5_name:'পেডিয়াট্রিক ডেন্টিস্ট্রি', svc5_desc:'মৃদু শিশু-বান্ধব যত্ন। ছোট রোগীদের জন্য প্রতিরোধমূলক চিকিৎসা।',
    svc6_name:'ওরাল ও ম্যাক্সিলোফেশিয়াল', svc6_desc:'আক্কেলদাঁত, সিস্ট অপসারণ, ফ্র্যাকচার ব্যবস্থাপনা ও মুখের ক্যান্সার স্ক্রিনিং।',
    svc7_name:'পেরিওডন্টাল ডেন্টিস্ট্রি', svc7_desc:'মাড়ির স্বাস্থ্য মূল্যায়ন, গভীর পরিষ্কার, রুট প্ল্যানিং ও স্কেলিং।',
    svc8_name:'ডেন্টাল ইমপ্লান্ট', svc8_desc:'থ্রিডি-গাইডেড ইমপ্লান্ট সার্জারি ব্যবহার করে স্থায়ী দাঁত প্রতিস্থাপন।',
    imp_tag:'স্থায়ী সমাধান', imp_h:'ডেন্টাল ইমপ্লান্ট',
    imp_sub:'হারানো দাঁতের স্বর্ণমান। একটি টাইটানিয়াম ইমপ্লান্ট মূলটি প্রতিস্থাপন করে এবং উপরে একটি কাস্টম মুকুট বসে — আপনাকে একটি দাঁত দেয় যা প্রাকৃতিক দাঁতের মতো দেখতে, অনুভব করতে এবং কাজ করে।',
    imp_prec_tag:'থ্রিডি-গাইডেড নির্ভুলতা', imp_how_h:'এটি কীভাবে কাজ করে',
    imp_li1:'থ্রিডি ইন্ট্রাওরাল স্ক্যান যেকোনো প্রক্রিয়ার আগে আপনার চোয়ালের মানচিত্র তৈরি করে',
    imp_li2:'আপনার স্ক্যান থেকে সার্জিক্যাল গাইড তৈরি হয় নির্ভুল ইমপ্লান্ট স্থাপনের জন্য',
    imp_li3:'স্থানীয় অ্যানেস্থেশিয়ায় টাইটানিয়াম ইমপ্লান্ট স্থাপন — ন্যূনতম ট্রমা, দ্রুত সুস্থতা',
    imp_li4:'তাৎক্ষণিক ডিজিটাল এক্স-রে স্থাপনের পরপরই নিখুঁত অবস্থান নিশ্চিত করে',
    imp_li5:'আপনার প্রাকৃতিক দাঁতের রঙ ও আকারের সাথে মানানসই কাস্টম জিরকোনিয়া মুকুট',
    imp_li6:'স্বাভাবিক যত্নে সারাজীবন স্থায়ী — কোনো ক্ষয় নেই, নড়াচড়া নেই, অস্বস্তি নেই',
    imp_btn:'ইমপ্লান্ট পরামর্শ বুক করুন →',
    imp_cost_tag:'আনুমানিক খরচ', imp_cost_h:'ইমপ্লান্ট মূল্য',
    imp_c1_lbl:'একটি ইমপ্লান্ট + মুকুট', imp_c1_note:'জিরকোনিয়া বা পিএফএম মুকুটসহ টাইটানিয়াম ইমপ্লান্ট। সবচেয়ে সাধারণ প্রক্রিয়া।',
    imp_c2_lbl:'একাধিক ইমপ্লান্ট', imp_c2_note:'একই সেশনে একাধিক ইমপ্লান্ট স্থাপন করলে ছাড় পাওয়া যায়।',
    imp_c3_lbl:'ফুল আর্চ (অল-অন-৪/৬)', imp_c3_note:'পূর্ণ আর্চ পুনর্বাসন। বিস্তারিত চিকিৎসা পরিকল্পনার জন্য পরামর্শ বুক করুন।',
    aln_tag:'অদৃশ্য অর্থোডন্টিক্স', aln_h:'ক্লিয়ার অ্যালাইনার',
    aln_sub:'কাস্টম-তৈরি স্বচ্ছ ট্রে যা আপনার দাঁত নিখুঁত অবস্থানে সরিয়ে দেয়। প্রায় অদৃশ্য, খাওয়া ও ব্রাশের জন্য খোলা যায়।',
    aln_t1_name:'ক্লিয়ার অ্যালাইনার ট্রে', aln_t1_desc:'কাস্টম স্বচ্ছ ট্রে যা দাঁতের উপর ফিট করে। প্রতি ১-২ সপ্তাহে নতুন সেটে পরিবর্তন করুন।',
    aln_t2_name:'থ্রিডি ডিজিটাল স্ক্যান', aln_t2_desc:'চিকিৎসা শুরু হয় ৩ মিনিটের ইন্ট্রাওরাল স্ক্যান দিয়ে — কোনো পুটি নেই, কোনো অস্বস্তি নেই।',
    aln_t3_name:'আপনার চূড়ান্ত হাসি', aln_t3_desc:'ডিজিটাল সিমুলেশন দ্বারা আগে থেকে নিশ্চিত ফলাফল। সাধারণ চিকিৎসাকাল: ৬-১৮ মাস।',
    aln_btn:'বিনামূল্যে থ্রিডি অ্যালাইনার স্ক্যান বুক করুন →',
    brc_tag:'ঐতিহ্যবাহী অর্থোডন্টিক্স', brc_h:'ডেন্টাল ব্রেসেস',
    brc_sub:'সবচেয়ে প্রমাণিত অর্থোডন্টিক চিকিৎসা। ধাতু বা সিরামিক ব্র্যাকেট প্রতিটি দাঁতে বন্ধন — জটিল কামড় ও সারিবদ্ধতার সমস্যার সবচেয়ে কার্যকর সমাধান।',
    brc_t1_name:'মেটাল ব্রেসেস', brc_t1_desc:'রঙিন ইলাস্টিকসহ স্টেইনলেস স্টিল ব্র্যাকেট। সবচেয়ে টেকসই ও সাশ্রয়ী বিকল্প।',
    brc_t2_name:'সিরামিক ব্রেসেস', brc_t2_desc:'দাঁতের রঙের সিরামিক ব্র্যাকেট যা দাঁতের সাথে মিশে যায়। ধাতব ব্রেসেসের মতোই কার্যকর কিন্তু অনেক কম দৃশ্যমান।',
    brc_t3_name:'চিকিৎসার পরে', brc_t3_desc:'নিখুঁতভাবে সারিবদ্ধ দাঁত ও সংশোধিত কামড়। চিকিৎসার পরে রিটেইনার আপনার নতুন হাসি স্থায়ীভাবে ধরে রাখে।',
    brc_btn:'ব্রেসেস পরামর্শ বুক করুন →',
    brc_c1_lbl:'মেটাল ব্রেসেস', brc_c1_note:'ফিটিং, মাসিক সমন্বয় এবং চূড়ান্ত রিটেইনারসহ সম্পূর্ণ চিকিৎসা।',
    brc_c2_lbl:'সিরামিক ব্রেসেস', brc_c2_note:'দাঁতের রঙের ব্র্যাকেট। ধাতুর মতোই কার্যকারিতায় বিচক্ষণ চেহারা।',
    brc_c3_lbl:'সেলফ-লিগেটিং', brc_c3_note:'উন্নত ব্র্যাকেট সিস্টেম — কম পরিদর্শন, দ্রুত চিকিৎসা এবং আরও আরামদায়ক।',
    doc_tag:'আমাদের দল', doc_h:'চিকিৎসকদের সাথে পরিচিত হন',
    doc_sub:'বিএমডিসি-নিবন্ধিত চিকিৎসক যারা প্রতিটি পরিদর্শনে আপনার স্বাচ্ছন্দ্য, স্বাস্থ্য ও আত্মবিশ্বাসের জন্য নিবেদিত।',
    doc1_name:'ডা. মারজানা সিদ্দিক মৌরি', doc1_role:'প্রধান পরামর্শদাতা',
    doc2_name:'ডা. তাসনিয়া বিনতে মাহবুব', doc2_role:'পরামর্শদাতা — শিশু দন্তচিকিৎসা',
    hrs_tag:'সেবার সময়', hrs_h:'ক্লিনিকের সময়সূচি',
    loc_tag:'আমাদের খুঁজুন', loc_h:'আমাদের অবস্থান',
    faq_tag:'সাধারণ প্রশ্নাবলী', faq_h:'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
    appt_tag:'এখনই বুক করুন', appt_h:'অ্যাপয়েন্টমেন্টের অনুরোধ',
    appt_name_lbl:'পুরো নাম', appt_phone_lbl:'ফোন নম্বর', appt_dept_lbl:'বিভাগ', appt_notes_lbl:'অতিরিক্ত মন্তব্য',
    appt_btn:'হোয়াটসঅ্যাপে পাঠান →',
    day_saturday:'শনিবার', day_sunday:'রবিবার', day_monday:'সোমবার',
    day_tuesday:'মঙ্গলবার', day_wednesday:'বুধবার', day_thursday:'বৃহস্পতিবার', day_friday:'শুক্রবার',
    rev_tag:'রোগীদের কণ্ঠস্বর', rev_h:'মানুষ কী বলেন',
    fac_tag:'অবকাঠামো', fac_h:'আমাদের সুবিধাসমূহ',
    con_tag:'যোগাযোগ করুন', con_h:'স্পর্শ করুন',
    fol_us:'আমাদের অনুসরণ করুন',
    tab_home:'হোম', tab_services:'সেবাসমূহ', tab_doctors:'চিকিৎসক', tab_files:'আমার ফাইল', tab_location:'অবস্থান',
    login_title:'রোগী লগইন', login_sub:'এককালীন কোড পেতে আপনার হোয়াটসঅ্যাপ নম্বর দিন।',
    login_phone_lbl:'হোয়াটসঅ্যাপ নম্বর', login_send_otp:'OTP পাঠান →',
    login_staff_link:'স্টাফ?', otp_title:'OTP লিখুন', otp_verify:'যাচাই করুন ও ফাইল দেখুন →',
    logout:'লগআউট', pid_label:'আপনার রোগী আইডি', pid_copy:'আইডি কপি করুন',
    ptab_rx:'প্রেসক্রিপশন', ptab_scans:'৩ডি স্ক্যান',
    rx_title:'📋 আপনার প্রেসক্রিপশন', rx_empty:'এখনো কোনো প্রেসক্রিপশন আপলোড করা হয়নি।',
    scans_title:'🔬 আপনার ৩ডি স্ক্যান', scans_empty:'এখনো কোনো স্ক্যান উপলব্ধ নেই।',
  }
};

let currentLang = 'en';
window.QDC_i18n = {
  toggle(){
    currentLang = currentLang==='en'?'bn':'en';
    this.apply();
  },
  apply(){
    const s = STRINGS[currentLang];
    // data-i18n elements (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.dataset.i18n;
      if(s[key] !== undefined) el.textContent = s[key];
    });
    // data-i18n-ph elements (placeholder)
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      const key = el.dataset.i18nPh;
      if(s[key] !== undefined) el.placeholder = s[key];
    });
    // data-i18n-html elements (innerHTML — for italic spans etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{
      const key = el.dataset.i18nHtml;
      if(s[key] !== undefined) el.innerHTML = s[key];
    });
    // lang toggle button label
    // lang toggle removed — English only
    // font switch
    const bnFont = "'Noto Serif Bengali', serif";
    const enFont = "'Jost', sans-serif";
    document.body.style.fontFamily = currentLang==='bn' ? bnFont : enFont;
    // html lang attribute
    document.documentElement.lang = currentLang==='bn' ? 'bn' : 'en';
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  Bottom-tab navigation helper
// ═══════════════════════════════════════════════════════════════════════════════
window.QDC_nav = {
  _cur:0,
  _pages:['home','services','doctors','portal','location'],
  go(section,btn){
    document.querySelectorAll('.btab-item').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    const idx=this._pages.indexOf(section);
    if(window.innerWidth<=1020){ this._slideTo(idx<0?0:idx); }
    else {
      if(section==='home') window.scrollTo({top:0,behavior:'smooth'});
      else { const el=document.getElementById(section); if(el) el.scrollIntoView({behavior:'smooth'}); }
    }
  },
  _slideTo(idx){
    const track=document.getElementById('pages-track');
    if(!track) return;
    document.body.classList.add('swipe-mode');
    this._cur=Math.max(0,Math.min(idx,this._pages.length-1));
    track.style.transform='translateX(-'+(this._cur*100)+'vw)';
    document.querySelectorAll('.pdot-item').forEach((d,i)=>d.classList.toggle('active',i===this._cur));
    document.querySelectorAll('.btab-item').forEach((b,i)=>b.classList.toggle('active',i===this._cur));
    const slide=document.getElementById('page-'+this._pages[this._cur]);
    if(slide) slide.scrollTop=0;
  },
  _initSwipe(){
    if(window.innerWidth>1020) return;
    document.body.classList.add('swipe-mode');
    this._slideTo(0);
    const track=document.getElementById('pages-track');
    if(!track) return;
    // touch listeners handled by hero hit-test block below
  }
};
window.addEventListener('DOMContentLoaded',()=>{ if(window.innerWidth<=1020) QDC_nav._initSwipe(); });
window.addEventListener('resize',()=>{
  if(window.innerWidth>1020) document.body.classList.remove('swipe-mode');
  else if(!document.body.classList.contains('swipe-mode')) QDC_nav._initSwipe();
});

// Tooth animation zone (hero-visual, top of mobile) → let parent scroll internally
// Everything else → horizontal page swipe
(function(){
  function initHeroScroll(){
    const track = document.getElementById('pages-track');
    if(!track) return;
    let sx=0, sy=0, onAnim=false;
    track.addEventListener('touchstart', function(e){
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      const anim = document.querySelector('.hero-visual');
      if(anim){
        const r = anim.getBoundingClientRect();
        onAnim = sy >= r.top && sy <= r.bottom && sx >= r.left && sx <= r.right;
      } else { onAnim = false; }
    },{passive:true});
    track.addEventListener('touchend', function(e){
      if(onAnim) return; // tooth animation area — let it do its thing
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if(Math.abs(dx) > Math.abs(dy)*1.4 && Math.abs(dx) > 45){
        if(dx < 0) QDC_nav._slideTo(QDC_nav._cur + 1);
        else       QDC_nav._slideTo(QDC_nav._cur - 1);
      }
    },{passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initHeroScroll);
  else initHeroScroll();
})();

// ═══════════════════════════════════════════════════════════════════════════════
//  WhatsApp widget
// ═══════════════════════════════════════════════════════════════════════════════
window.QDC_wa = {
  open: false,
  toggle(){
    this.open = !this.open;
    document.getElementById('waPopup').classList.toggle('open', this.open);
  }
};
// Auto-open once after 6 s
setTimeout(()=>{ if(!localStorage.getItem('wa_shown')){ QDC_wa.toggle(); localStorage.setItem('wa_shown','1'); } }, 6000);

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH — WhatsApp OTP via Firebase Phone Auth
// ═══════════════════════════════════════════════════════════════════════════════
let confirmationResult = null;
let currentUser       = null;

window.QDC_auth = {
  async init(){
    const { auth, onAuthStateChanged } = await waitQDC();
    onAuthStateChanged(auth, async user => {
      if(user){
        currentUser = user;
        document.getElementById('navAuthTxt').textContent = 'My Files';
        document.getElementById('btabFileTxt').textContent = '✓ My Files';
        if(QDC_auth._fromConsult){
          QDC_auth._fromConsult = false;
          QDC_auth.openConsultation();
        } else {
          await QDC_portal.load(user);
        }
      } else {
        currentUser = null;
        document.getElementById('navAuthTxt').textContent = 'My Files';
      }
    });
  },

  openRoleModal(){
    if(currentUser){ QDC_portal.show(); return; }
    document.getElementById('roleOverlay').classList.add('show');
  },

  openLogin(){
    // called after role=patient selected
    if(currentUser){ QDC_portal.show(); return; }
    document.getElementById('authOverlay').classList.add('show');
  },

  selectRole(role){
    document.getElementById('roleOverlay').classList.remove('show');
    if(role==='patient'){
      document.getElementById('authOverlay').classList.add('show');
    } else {
      QDC_staff.open();
    }
  },
  closeLogin(){
    document.getElementById('authOverlay').classList.remove('show');
    // Clear pending state to prevent cross-session leaks
    this._pendingPhone  = null;
    this._pendingWaPhone = null;
    this._fromConsult    = false;
  },

  _recaptchaReady: false,
  _recaptchaPromise: null,
  _initRecaptcha(){
    if(this._recaptchaReady || this._recaptchaPromise) return this._recaptchaPromise;
    const { auth, RecaptchaVerifier } = window.__QDC;
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: ()=>{ document.getElementById('sendOtpBtn').disabled = false; },
      'expired-callback': ()=>{ document.getElementById('sendOtpBtn').disabled = true; }
    });
    this._recaptchaPromise = window.recaptchaVerifier.render()
      .then(()=>{ this._recaptchaReady = true; })
      .catch(e=>{ this._recaptchaPromise = null; console.warn('[auth] recaptcha render failed', e); });
    return this._recaptchaPromise;
  },

  toggleFamilyWA(){
    const checked = document.getElementById('authFamilyToggle').checked;
    const block   = document.getElementById('authFamilyBlock');
    if(block) block.style.display = checked ? 'block' : 'none';
    const sendBtn = document.getElementById('sendOtpBtn');
    if(sendBtn) sendBtn.querySelector('span').textContent = checked
      ? 'Send OTP to Family Member →'
      : 'Send OTP via WhatsApp →';
  },

  _normalisePhone(raw){
    let p = (raw||'').replace(/[\s\-]/g,'');
    if(p.startsWith('+880')) p = '0' + p.slice(4);
    else if(p.startsWith('880') && p.length>=13) p = '0' + p.slice(3);
    if(!p.startsWith('0')) p = '0' + p;
    return p;
  },

  async sendOtp(){
    const raw   = document.getElementById('authPhone').value.trim();
    const msg   = document.getElementById('auth-msg1');
    if(raw.replace(/\D/g,'').length < 10){ msg.textContent='Enter a valid phone number (min 10 digits).'; msg.className='qdc-msg err'; return; }
    const phone = this._normalisePhone(raw);
    const btn   = document.getElementById('sendOtpBtn');
    msg.className='qdc-msg'; msg.textContent='';
    this._pendingPhone = phone;   // patient's own phone (for record lookup)

    // Determine which number to send OTP to
    const useFamilyWA = document.getElementById('authFamilyToggle')?.checked;
    let waPhone = phone;
    if(useFamilyWA){
      const famRaw = (document.getElementById('authFamilyPhone')?.value||'').trim();
      if(famRaw.replace(/\D/g,'').length < 10){
        msg.textContent='Enter the family member\'s WhatsApp number.'; msg.className='qdc-msg err'; return;
      }
      waPhone = this._normalisePhone(famRaw);
    }
    this._pendingWaPhone = waPhone; // WhatsApp delivery number (may differ from patient phone)

    try {
      const { SHEETS_PROXY } = window.__QDC;
      btn.innerHTML='<span class="qdcspinner"></span>Checking number…'; btn.disabled=true;
      // Always check patient's own phone in the database
      let info;
      // Always try real GAS regardless of local/production
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(()=>ctrl.abort(), 10000);
        const chk = await fetch(`${SHEETS_PROXY}&action=checkPhone&phone=${encodeURIComponent(phone)}`, {signal:ctrl.signal});
        clearTimeout(timer);
        info = await chk.json();
      } catch(netErr) {
        // Network truly blocked — tell user to try on live site
        msg.textContent = '⚠ Cannot verify number offline. Please open the site at sylhetdental.com to login.';
        msg.className = 'qdc-msg err';
        btn.innerHTML = '<span>Send OTP via WhatsApp →</span>'; btn.disabled = false;
        return;
      }
      if(!info.exists){
        msg.innerHTML='⚠ Number not registered. <button onclick="QDC_auth.openCreateAccount()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:.9em;text-decoration:underline;padding:0">Create an account →</button>';
        msg.className='qdc-msg err';
        btn.innerHTML='<span>Send OTP via WhatsApp →</span>'; btn.disabled=false;
        return;
      }
      btn.innerHTML='<span class="qdcspinner"></span>Sending OTP…';
      // Send OTP to the WhatsApp number (family or own)
      let data;
      // Always try real GAS for OTP send
      try {
        const ctrl2 = new AbortController();
        const timer2 = setTimeout(()=>ctrl2.abort(), 10000);
        const _r = await fetch(`${SHEETS_PROXY}&action=sendOTP&phone=${encodeURIComponent(waPhone)}`, {signal:ctrl2.signal});
        clearTimeout(timer2);
        data = await _r.json();
      } catch(netErr2) {
        throw new Error('Network error sending OTP. Please try again.');
      }
      if(!data.ok) throw new Error(data.error||'Could not send OTP');
      document.getElementById('auth-s1').classList.remove('active');
      document.getElementById('auth-s2').classList.add('active');
      const dest = useFamilyWA ? `family member's WhatsApp (${waPhone})` : `your WhatsApp (${phone})`;
      document.getElementById('otpSubText').textContent = `Code sent to ${info.name||'you'} — delivered to ${dest}`;
      document.getElementById('o1').focus();
    } catch(e){
      msg.textContent = '⚠ '+(e.message||'Failed. Try again.');
      msg.className='qdc-msg err';
      btn.innerHTML='<span>Send OTP via WhatsApp →</span>'; btn.disabled=false;
    }
  },

  // Sync phone with Google Sheets — creates Ghost Account if new
  async _syncWithSheets(phone){
    const { SHEETS_PROXY } = window.__QDC;
    try {
      const res = await fetch(SHEETS_PROXY+'&action=findOrCreate&phone='+encodeURIComponent(phone));
      const data = await res.json();
      window._sheetsPatient = data; // {exists, patientId, name, ...}
    } catch(e){ console.warn('Sheets sync failed (offline?)', e); }
  },

  otpNext(el, nextId){
    if(el.value.length===1 && nextId) document.getElementById(nextId).focus();
    if(!nextId) this.verifyOtp(); // auto-verify on last digit
  },

  async verifyOtp(){
    const code = ['o1','o2','o3','o4','o5','o6'].map(id=>document.getElementById(id).value).join('');
    const msg  = document.getElementById('auth-msg2');
    if(code.length<6){ msg.textContent='Enter all 6 digits.'; msg.className='qdc-msg err'; return; }
    const btn = document.getElementById('verifyOtpBtn');
    btn.innerHTML='<span class="qdcspinner"></span>Verifying…'; btn.disabled=true;
    try {
      const { SHEETS_PROXY } = window.__QDC;
      const phone = this._pendingPhone || '';
      let data;
      const _vr = await fetch(`${SHEETS_PROXY}&action=verifyOTP&phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(code)}`);
      data = await _vr.json();
      if(!data.ok) throw new Error(data.error||'Invalid code');
      // OTP verified — load patient data
      currentUser = { uid: data.patientId, phoneNumber: phone, name: data.name };
      window.__QDC_USER = { patientId: data.patientId, name: data.name, phone };
      this.closeLogin();
      if(this._fromConsult){
        // Came from consultation modal — go back to it, not the portal
        this._fromConsult = false;
        this.openConsultation();
      } else {
        QDC_portal.loadFromSheets(data);
        QDC_portal.show();
      }
    } catch(e){
      msg.textContent='⚠ '+(e.message||'Invalid code. Please try again.');
      msg.className='qdc-msg err';
      btn.innerHTML='<span>Verify & Open My Files →</span>'; btn.disabled=false;
    }
  },

  async _ensureFirestoreProfile(user){
    const { db, doc, getDoc, setDoc, serverTimestamp } = window.__QDC;
    const ref = doc(db, 'patients', user.uid);
    const snap = await getDoc(ref);
    if(!snap.exists()){
      const sp = window._sheetsPatient || {};
      const year = new Date().getFullYear();
      const last4 = (user.phoneNumber||'').slice(-4);
      // Sequence from Firestore counter (simplified — for production use a transaction)
      const seq   = String(Date.now()).slice(-4);
      const pid   = `QDC-${year}-${seq}-${last4}`;
      await setDoc(ref, {
        uid:       user.uid,
        phone:     user.phoneNumber,
        patientId: sp.patientId || pid,
        name:      sp.name      || 'New Patient',
        createdAt: serverTimestamp(),
        source:    sp.exists ? 'sheets_linked' : 'ghost_account',
        sheetsRow: sp.row || null,
      });
    }
  },

  backToPhone(){
    document.getElementById('auth-s1').classList.add('active');
    document.getElementById('auth-s2').classList.remove('active');
    ['o1','o2','o3','o4','o5','o6'].forEach(id=>document.getElementById(id).value='');
    // Reset family WA toggle
    const tog = document.getElementById('authFamilyToggle');
    if(tog){ tog.checked=false; this.toggleFamilyWA(); }
    this._pendingWaPhone = null;
  },

  goStaff(){ this.closeLogin(); QDC_staff.open(); },

  async logout(){
    const { auth, signOut } = window.__QDC;
    await signOut(auth);
    currentUser = null;
    document.getElementById('portal-view').classList.remove('show');
    if(window.QDC_msgboard) QDC_msgboard.hide();
        document.getElementById('staff-view').classList.remove('show');
  }
};


// ──────────────────────────────────────────────────────────────────────────────
//  QDC_auth helpers: Create Account, Consultation
// ──────────────────────────────────────────────────────────────────────────────
Object.assign(QDC_auth, {

  onCountryChange(){
    const sel  = document.getElementById('ca-country');
    const opt  = sel?.options[sel.selectedIndex];
    const dial = opt?.dataset.dial || '+880';
    const ph   = opt?.dataset.ph   || '017XXXXXXXX';
    const badge  = document.getElementById('ca-dial-badge');
    const prefix = document.getElementById('ca-dial-prefix');
    const input  = document.getElementById('ca-phone');
    if(badge)  badge.textContent  = dial;
    if(prefix) prefix.textContent = dial;
    if(input)  { input.placeholder = ph; input.value = ''; }
  },

  openCreateAccount(){
    ['ca-name','ca-phone','ca-age','ca-address','ca-notes'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('ca-msg').textContent='';
    // Reset country to Bangladesh
    const sel = document.getElementById('ca-country');
    if(sel){ sel.value = 'BD'; this.onCountryChange(); }
    document.getElementById('createAccOverlay').classList.add('show');
  },

  async submitCreateAccount(){
    const name    = document.getElementById('ca-name')?.value.trim();
    const rawPhone= document.getElementById('ca-phone')?.value.trim().replace(/\s/g,'');
    const age     = document.getElementById('ca-age')?.value.trim();
    const gender  = document.getElementById('ca-gender')?.value;
    const address = document.getElementById('ca-address')?.value.trim();
    const notes   = document.getElementById('ca-notes')?.value.trim();
    const source  = document.getElementById('ca-source')?.value || 'Website';
    const msg     = document.getElementById('ca-msg');
    const btn     = document.getElementById('ca-btn-txt');
    // Build full international phone
    const sel     = document.getElementById('ca-country');
    const opt     = sel?.options[sel?.selectedIndex];
    const dial    = (opt?.dataset.dial || '+880').replace('+','');
    const country = opt?.value || 'BD';
    // Strip leading 0 from local number if country prefix would be prepended
    let localNum  = rawPhone.replace(/\D/g,'');
    if(localNum.startsWith('0') && country !== 'OTHER') localNum = localNum.slice(1);
    // Don't double-prepend if user already typed the country code
    const phone   = localNum.startsWith(dial) ? '+'+localNum : '+'+dial+localNum;

    if(!name||!rawPhone){ msg.textContent='⚠ Name and WhatsApp number are required.'; msg.className='qdc-msg err'; return; }
    if(localNum.length < 7){ msg.textContent='⚠ Enter a valid phone number.'; msg.className='qdc-msg err'; return; }

    btn.innerHTML='<span class="qdcspinner"></span>Creating account…';
    msg.className='qdc-msg'; msg.textContent='';

    try {
      const { SHEETS_PROXY } = window.__QDC;
      const today = new Date().toISOString().slice(0,10);
      const seq   = String(Date.now()).slice(-4);
      const last4 = name.replace(/\s/g,'').toUpperCase().slice(0,4).padEnd(4,'X');
      const pid   = `QDC-${new Date().getFullYear()}-${seq}-${last4}`;

      const url = `${SHEETS_PROXY}&action=addPatient` +
        `&id=${encodeURIComponent(pid)}&name=${encodeURIComponent(name)}` +
        `&phone=${encodeURIComponent(phone)}&age=${encodeURIComponent(age)}` +
        `&gender=${encodeURIComponent(gender)}&address=${encodeURIComponent(address)}` +
        `&source=${encodeURIComponent(source)}&notes=${encodeURIComponent((notes||'')+' [Country:'+country+']')}`;

      const res  = await fetch(url);
      const data = await res.json();

      if(!data.ok) throw new Error(data.error||'Registration failed');

      // Also send confirmation via WhatsApp
      await fetch(`${SHEETS_PROXY}&action=sendWelcome&phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&pid=${encodeURIComponent(pid)}`).catch(()=>{});

      msg.innerHTML = `✅ <strong>Account created!</strong><br>Your Patient ID: <code style="color:var(--gold)">${pid}</code><br>A confirmation has been sent to your WhatsApp.`;
      msg.className = 'qdc-msg ok';
      btn.textContent = 'Account Created ✓';

      // Also add to local staff patient cache
      if(QDC_staff._patData) {
        QDC_staff._patData.unshift({id:pid, name, phone, age, gender, country:'Bangladesh', address, source, reg:today, lastVisit:'', notes:notes||''});
        QDC_staff._cacheSet('patients', QDC_staff._patData);  // update cache with new patient
        QDC_staff._renderPatSummary?.();
        QDC_staff.patFilter?.();
      }
    } catch(e){
      msg.textContent = '⚠ '+e.message;
      msg.className='qdc-msg err';
      btn.textContent = 'Create My Account & Get Patient ID →';
    }
  },

  openConsultation(){
    const isLoggedIn = !!currentUser;
    document.getElementById('consult-logged-in').style.display  = isLoggedIn ? 'block' : 'none';
    document.getElementById('consult-logged-out').style.display = isLoggedIn ? 'none'  : 'block';
    if(isLoggedIn){
      const pid = currentUser.uid || '—';
      const nm  = currentUser.name || '';
      document.getElementById('consult-pid-show').textContent = nm ? `${nm} — ${pid}` : pid;
    }
    document.getElementById('consultOverlay').classList.add('show');
  },

  async submitConsultation(){
    const btn    = document.getElementById('consult-btn-txt');
    const msg    = document.getElementById('consult-msg');
    const reason = document.getElementById('consult-reason')?.value||'';
    const prefDate= document.getElementById('consult-pref-date')?.value||'';
    const prefTime= document.getElementById('consult-pref-time')?.value||'Morning (10am–12pm)';
    if(!reason||!prefDate){ if(msg){msg.textContent='Please select a reason and preferred date.';msg.className='qdc-msg err';} return; }
    if(btn) btn.textContent='Sending…';
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      const user=window.__QDC_USER||{};
      const params=new URLSearchParams({
        action:'submitConsultation',
        name:user.name||'Patient',
        phone:user.phone||'',
        patientId:user.patientId||'',
        reason, prefDate, prefTime
      });
      await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      if(msg){msg.textContent='✅ Request sent! We will contact you shortly to confirm your appointment.';msg.className='qdc-msg ok';}
      if(btn) btn.textContent='Request Sent ✓';
    } catch(e){
      if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';}
      if(btn) btn.textContent='Send Request →';
    }
  },

});

// ── Patient Portal object ──────────────────────────────────────────────────
window.QDC_portal = {
  _pid: '',
  show(){ document.getElementById('portal-view').classList.add('show'); },
  hide(){ document.getElementById('portal-view').classList.remove('show'); },

  // ── Called after WhatsApp OTP login ───────────────────────────────────────
  loadFromSheets(data){
    const pid  = data.patientId || '—';
    const name = data.name      || 'Patient';
    this._loadFiles(pid, name);
  },

  // ── Called by staff from Patient Database ─────────────────────────────────
  openForPatient(pid, name){
    this._loadFiles(pid, name);
    this.show();
  },

  // ── Legacy Firebase path (kept for Firebase users) ────────────────────────
  async load(user){
    try {
      const { db, doc, getDoc } = window.__QDC;
      const snap = await getDoc(doc(db, 'patients', user.uid));
      const data = snap.exists() ? snap.data() : {};
      const pid  = data.patientId || user.uid;
      const name = data.name || '';
      this._loadFiles(pid, name);
    } catch(e){
      // Fallback: try loading by phone
      this._loadFiles(user.uid, '');
    }
  },


  // Extract Google Drive file ID from any Drive URL format
  _fid(f){
    if(f.fileId) return f.fileId;
    const u = f.url||f.DriveURL||'';
    if(!u) return '';
    let m;
    m = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);   if(m) return m[1];
    m = u.match(/[?&]id=([a-zA-Z0-9_-]+)/);        if(m) return m[1];
    m = u.match(/\/d\/([a-zA-Z0-9_-]+)/);           if(m) return m[1];
    return '';
  },
  // Build correct URLs from a fileId
  _drivePreview(fid){ return fid ? `https://drive.google.com/file/d/${fid}/preview` : ''; },
  _driveView(fid)   { return fid ? `https://drive.google.com/file/d/${fid}/view`    : ''; },
  _driveThumb(fid)  { return fid ? `https://drive.google.com/thumbnail?id=${fid}&sz=w400` : ''; },
  _driveDl(fid)     { return fid ? `https://drive.google.com/uc?export=download&id=${fid}` : ''; },

  tab(which, btn){
    document.querySelectorAll('.portal-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('ptab-rx').style.display      = which==='rx'      ? 'block':'none';
    document.getElementById('ptab-scans').style.display   = which==='scans'   ? 'block':'none';
    document.getElementById('ptab-xrays').style.display   = which==='xrays'  ? 'block':'none';
    document.getElementById('ptab-billing').style.display = which==='billing' ? 'block':'none';
    if(which==='billing') this._loadBilling();
    if(which==='xrays')   this._loadXrays();
    if(which==='scans')   this._ensureModelViewer();
  },

  async _loadXrays(){
    const pid = this._pid;
    if(!pid || pid==='—') return;
    const grid = document.getElementById('xray-grid');
    if(grid) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span>⌛</span><p>Loading…</p></div>';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      const resp = await fetch(`${proxy}&action=getPatientFiles&patientId=${encodeURIComponent(pid)}&type=xray${QDC_staff._hipaaParams()}`);
      const d = await resp.json();
      // d.xrays = watcher uploads; d.scans = manual uploads — merge both
      const allXrays = [...(d.xrays||[]), ...(d.scans||[]).filter(f=>/\.(jpg|jpeg|png|dcm|dicom)$/i.test(f.name||''))];
      // Deduplicate by fileId
      const seen = new Set();
      const xrays = allXrays.filter(x=>{ if(!x.fileId||seen.has(x.fileId)){ return !x.fileId; } seen.add(x.fileId); return true; });
      if(!grid) return;
      if(!xrays.length){ grid.innerHTML='<div class="empty-state" style="grid-column:1/-1"><span>🩻</span><p>No X-rays uploaded yet.</p></div>'; return; }
      grid.innerHTML = xrays.map(x=>{
        const fid   = QDC_portal._fid(x);
        const thumb = fid ? QDC_portal._driveThumb(fid) : (x.directUrl||x.url);
        const view  = fid ? QDC_portal._driveView(fid)  : x.url;
        const dlUrl = fid ? QDC_portal._driveDl(fid)    : x.url;
        const isImg = /\.(jpg|jpeg|png|webp|bmp|tiff?)$/i.test(x.name||'') || (x.mimeType||'').startsWith('image/');
        return `<div class="scan-card">
          ${isImg
            ? `<img src="${thumb}" alt="${x.name||'X-Ray'}"
                style="width:100%;height:220px;object-fit:cover;background:var(--surface);display:block"
                onerror="this.src='${view}';this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='flex';}" loading="lazy">`
            : ''}
          <div style="${isImg?'display:none':'display:flex'};height:220px;background:var(--surface);align-items:center;justify-content:center;font-size:3rem">🩻</div>
          <div class="scan-meta">
            <div class="scan-name">${x.name||'X-Ray'}</div>
            <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
              <a href="${view}" target="_blank" style="background:var(--surface);border:1px solid var(--border);color:var(--text2);padding:6px 12px;font-size:.74rem;text-decoration:none;border-radius:2px">View Full Size ↗</a>
              <a href="${dlUrl}" download="${x.name||'xray'}" style="background:var(--crimson);color:#fff;padding:6px 12px;font-size:.74rem;text-decoration:none;border-radius:2px">⬇ Download</a>
            </div>
          </div>
        </div>`;
      }).join('');
    } catch(err){
      if(grid) grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><span>⚠</span><p>${err.message}</p></div>`;
    }
  },

  async _loadBilling(){
    const pid = this._pid;
    if(!pid || pid==='—') return;
    const billingDiv = document.getElementById('bill-invoices');
    if(billingDiv) billingDiv.innerHTML = '<div class="empty-state"><span>⌛</span><p>Loading…</p></div>';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy) throw new Error('No proxy');
      const resp = await fetch(`${proxy}&action=getPatientSummary&patientId=${encodeURIComponent(pid)}${QDC_staff._hipaaParams()}`);
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      const d = await resp.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      const fmt = n => '৳ '+Math.round(Number(n)||0).toLocaleString();
      const el = id => document.getElementById(id);
      if(el('bill-total'))     el('bill-total').textContent     = fmt(d.totalInvoiced);
      if(el('bill-paid'))      el('bill-paid').textContent      = fmt(d.totalPaid);
      if(el('bill-due'))       el('bill-due').textContent       = fmt(d.totalDue);
      if(el('bill-visits'))    el('bill-visits').textContent    = d.visitCount || '0';
      if(el('bill-lastvisit')) el('bill-lastvisit').textContent = d.lastVisit  || 'N/A';

      const invoices = d.invoices || [];
      if(!billingDiv) return;
      if(!invoices.length){
        billingDiv.innerHTML = '<div class="empty-state"><span>📋</span><p>No invoices on record yet.</p></div>';
        return;
      }
      billingDiv.innerHTML = invoices.map(inv => {
        const dueColor = Number(inv.due)>0 ? 'var(--closed)' : 'var(--open)';
        const dueTxt   = Number(inv.due)>0 ? fmt(inv.due)+' due' : 'Paid in full';
        return `<div style="background:var(--bg2);border:1px solid var(--border);padding:14px 18px;margin-bottom:10px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;color:var(--text);font-size:.92rem">${inv.treatments||'Treatment'}</div>
            <div style="font-size:.78rem;color:var(--text3);margin-top:3px">${inv.date||'—'}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-weight:700;color:var(--text);font-family:'Cormorant Garamond',serif;font-size:1.15rem">${fmt(inv.total)}</div>
            <div style="font-size:.76rem;color:${dueColor};margin-top:2px">${dueTxt}</div>
          </div>
        </div>`;
      }).join('');
    } catch(err){
      if(billingDiv) billingDiv.innerHTML = `<div class="empty-state"><span>⚠</span><p>Could not load billing: ${err.message}</p></div>`;
    }
  },

  async _loadFiles(pid, name){
    this._pid = pid;
    // Update PID display elements
    const pidEl = document.getElementById('portal-pid');
    const pidBig = document.getElementById('portal-pid-big');
    if(pidEl)  pidEl.textContent  = pid;
    if(pidBig) pidBig.textContent = pid;
    // Show name in portal nav if available
    const nameEl = document.getElementById('portal-patient-name');
    if(nameEl) nameEl.textContent = name || pid;
    // Load prescriptions (files from Drive)
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    if(!proxy) return;
    // Load prescriptions + scans in one call
    const rxList  = document.getElementById('rx-list');
    const scanGrid = document.getElementById('scan-grid');
    if(rxList)   rxList.innerHTML   = '<div class="empty-state"><span>⌛</span><p>Loading…</p></div>';
    if(scanGrid) scanGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span>⌛</span><p>Loading…</p></div>';
    try {
      const resp = await fetch(`${proxy}&action=getPatientFiles&patientId=${encodeURIComponent(pid)}${QDC_staff._hipaaParams()}`);
      const rawText = await resp.text();
      let d = {};
      try { d = JSON.parse(rawText); } catch(pe){}
      if(d.ok===false && d.error){
        const errMsg = '<div class="empty-state"><span>⚠</span><p style="color:var(--crimson);font-size:.8rem">GAS error: '+d.error+'<br><small>Deploy GAS v8.4 to fix this.</small></p></div>';
        if(rxList)   rxList.innerHTML   = errMsg;
        if(scanGrid) scanGrid.innerHTML = errMsg;
        return;
      }
      // ── Prescriptions ──
      const files = (d.prescriptions || d.files || []).filter(f=>(f.url||f.DriveURL||'').trim());
      if(rxList){
        if(!files.length){
          rxList.innerHTML = '<div class="empty-state"><span>📄</span><p>No prescriptions on file yet.</p></div>';
        } else {
          rxList.innerHTML = files.map(f=>{
            const fid     = QDC_portal._fid(f);
            const preview = QDC_portal._drivePreview(fid);
            const view    = QDC_portal._driveView(fid) || f.url;
            const dl      = QDC_portal._driveDl(fid);
            return `<div class="rx-item" style="background:var(--bg2);border:1px solid var(--border);margin-bottom:12px;border-radius:2px;overflow:hidden">
              <div style="padding:14px 18px;display:flex;align-items:center;gap:14px">
                <div style="font-size:1.8rem;flex-shrink:0">📄</div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;color:var(--text);font-size:.9rem">${f.name||'Prescription'}</div>
                  <div style="font-size:.74rem;color:var(--text3);margin-top:2px">${f.date||''}</div>
                  ${f.tx?`<div style="font-size:.76rem;color:var(--text2);margin-top:2px">Treatment: ${f.tx}</div>`:''}
                </div>
                <div style="display:flex;gap:8px;flex-shrink:0">
                  ${view?`<a href="${view}" target="_blank" style="background:var(--surface);border:1px solid var(--border);color:var(--text2);padding:7px 12px;font-size:.72rem;text-decoration:none;border-radius:2px;white-space:nowrap">Open ↗</a>`:''}
                  ${dl?`<a href="${dl}" download style="background:var(--crimson);color:#fff;padding:7px 12px;font-size:.72rem;text-decoration:none;border-radius:2px;white-space:nowrap">⬇ Download</a>`:''}
                </div>
              </div>
              ${preview?`<iframe src="${preview}" style="width:100%;height:320px;border:none;border-top:1px solid var(--border);display:block" loading="lazy" allow="autoplay" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`:''}
            </div>`;
          }).join('');
        }
      }
      // ── Scans ──
      const scans = d.scans || [];
      if(scanGrid){
        if(!scans.length){
          scanGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span>🦷</span><p>No 3D scans on file.</p></div>';
        } else {
          this._ensureModelViewer();
          scanGrid.innerHTML = scans.map(s=>{
            const name  = s.name||'Scan';
            const ext   = name.split('.').pop().toLowerCase();
            const dlUrl = s.fileId ? `https://drive.google.com/uc?export=download&id=${s.fileId}` : s.url;
            const is3d  = ['glb','gltf'].includes(ext);
            const isStl = ext==='stl';
            const isObj = ext==='obj';
            let viewer = '';
            if(is3d){
              viewer = `<model-viewer src="${dlUrl}" alt="${name}"
                camera-controls auto-rotate shadow-intensity="1"
                style="width:100%;height:240px;background:var(--surface);display:block"
                loading="lazy" reveal="auto">
                <div slot="poster" style="display:flex;align-items:center;justify-content:center;height:240px;font-size:.88rem;color:var(--text3)">⌛ Loading 3D model…</div>
              </model-viewer>`;
            } else if(isStl||isObj){
              viewer = `<div style="width:100%;height:240px;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
                <div style="font-size:2.4rem">🦷</div>
                <div style="font-size:.8rem;color:var(--text3)">.${ext.toUpperCase()} file</div>
                <a href="${dlUrl}" download="${name}" style="background:var(--crimson);color:#fff;padding:8px 16px;font-size:.76rem;letter-spacing:.06em;text-decoration:none;border-radius:2px;margin-top:4px">⬇ Download to view in 3D software</a>
              </div>`;
            } else {
              viewer = `<div style="width:100%;height:240px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:2.5rem">🦷</div>`;
            }
            return `<div class="scan-card">
              ${viewer}
              <div class="scan-meta">
                <div class="scan-name">${name}</div>
                <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
                  ${dlUrl?`<a href="${dlUrl}" target="_blank" style="background:var(--surface);border:1px solid var(--border);color:var(--text2);padding:6px 12px;font-size:.74rem;text-decoration:none;border-radius:2px">Open in Drive ↗</a>`:''}
                  ${dlUrl?`<a href="${dlUrl}" download="${name}" style="background:var(--crimson);color:#fff;padding:6px 12px;font-size:.74rem;text-decoration:none;border-radius:2px">⬇ Download</a>`:''}
                </div>
              </div>
            </div>`;
          }).join('');
        }
      }
    } catch(err){
      if(rxList)   rxList.innerHTML   = `<div class="empty-state"><span>⚠</span><p>${err.message}</p></div>`;
      if(scanGrid) scanGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span>⚠</span><p>${err.message}</p></div>`;
    }
  },

  _ensureModelViewer(){
    if(document.querySelector('script[data-mv]')) return;
    const s = document.createElement('script');
    s.setAttribute('data-mv','1');
    s.type='module';
    s.src='https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(s);
  },

  copyPid(){
    navigator.clipboard.writeText(this._pid).then(()=>{
      const btn = document.querySelector('.pid-copy');
      btn.textContent = '✓ Copied!'; btn.style.color='var(--open)';
      setTimeout(()=>{ btn.textContent='Copy ID'; btn.style.color=''; }, 2000);
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  STAFF DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
// Staff credentials are verified via Google Sheets proxy (see staffLogin action)

window.QDC_staff = {
  _authenticated: false,
  _staffName: '',
  _staffId: '',
  _uploadType: 'prescription',
  _uploadTargetUid: null,

  /* ── localStorage cache helpers ─────────────────────────────────────── */
  _cacheGet(key, ttlMs){
    try {
      const raw = localStorage.getItem('qdc_'+key);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      if(Date.now() - obj.ts > ttlMs) return null;  // expired
      return obj.data;
    } catch(e){ return null; }
  },
  _cacheSet(key, data){
    try { localStorage.setItem('qdc_'+key, JSON.stringify({data, ts:Date.now(), v:1})); } catch(e){}
  },
  _cacheClear(key){ try{ localStorage.removeItem('qdc_'+key); }catch(e){} },

  open(){
    this._openLoginModal();
  },

  _openLoginModal(){
    // ── Remember Me: auto-fill or auto-login ──
    try {
      const saved = JSON.parse(localStorage.getItem('qdc_remember')||'null');
      if(saved && saved.id && saved.pw && (Date.now()-saved.saved) < 30*86400000){
        const idEl=document.getElementById('staffIdInput');
        const pwEl=document.getElementById('staffPwInput');
        const cbEl=document.getElementById('staffRememberMe');
        if(idEl) idEl.value=saved.id;
        if(pwEl) pwEl.value=saved.pw;
        if(cbEl) cbEl.checked=true;
        document.getElementById('staffLoginOverlay').classList.add('show');
        // Auto-submit after short delay (gives page time to settle)
        setTimeout(()=>this.login(), 300);
        return;
      }
    } catch(_){}
    document.getElementById('staffLoginOverlay').classList.add('show');
    setTimeout(()=>document.getElementById('staffIdInput').focus(), 150);
  },

  togglePw(){
    const inp = document.getElementById('staffPwInput');
    inp.type = inp.type==='password' ? 'text' : 'password';
  },

  logout(){
    // Clear remembered credentials so login screen shows
    try { localStorage.removeItem('qdc_remember'); } catch(_){}
    this._authenticated = false;
    this._staffName = '';
    this._staffId   = '';
    this._staffRole = '';
    this._stopIdleTimer();
    if(window.QDC_msgboard) QDC_msgboard.hide();
    document.getElementById('staff-view').classList.remove('show');
    // Re-open login
    setTimeout(()=>this._openLoginModal(), 150);
  },

  _localDevLogin(){
    this._authenticated = true;
    this._staffName = 'Local Dev (Admin)';
    this._staffRole = 'admin';
    this._applyRBAC('admin');
    document.getElementById('staffLoginOverlay').classList.remove('show');
    document.getElementById('staff-view').classList.add('show');
    const greet = document.getElementById('staff-greeting');
    if(greet) greet.textContent = '⚠ Local Dev Mode — Admin';
    this.refresh();
    if(window.QDC_msgboard) QDC_msgboard.show();
  },

  async login(){
    const staffId  = document.getElementById('staffIdInput').value.trim();
    const password = document.getElementById('staffPwInput').value;
    const msg = document.getElementById('staff-login-msg');
    const btn = document.getElementById('staffLoginBtnTxt');
    if(!staffId||!password){ msg.textContent='Enter your Staff ID and password.'; msg.className='qdc-msg err'; return; }
    btn.innerHTML = '<span class="qdcspinner"></span>Verifying…';
    msg.className='qdc-msg'; msg.textContent='';
    try {
      const { SHEETS_PROXY } = window.__QDC;
      let data;
      // staffLogin has no staff session yet — but needs _psec in local mode since
      // the proxy_secret check happens before the action handler runs.
      const _loginPsec = window._IS_LOCAL ? '&_psec=' + encodeURIComponent('2BorNOT2BTHATISTHE?') : '';
      const res = await fetch(`${SHEETS_PROXY}&action=staffLogin&id=${encodeURIComponent(staffId)}&pw=${encodeURIComponent(password)}${_loginPsec}`);
      data = await res.json();
      if(data.ok){
        this._authenticated = true;
        this._staffName = data.name || staffId;
        this._staffId   = staffId;
        this._staffRole = (data.role||'staff').toLowerCase();
        this._applyRBAC(this._staffRole);
        // ── Remember Me ──
        const rememberMe = document.getElementById('staffRememberMe')?.checked;
        if(rememberMe){
          try { localStorage.setItem('qdc_remember',JSON.stringify({id:staffId,pw:password,name:this._staffName,role:this._staffRole,saved:Date.now()})); } catch(_){}
        } else {
          try { localStorage.removeItem('qdc_remember'); } catch(_){}
        }
        document.getElementById('staffLoginOverlay').classList.remove('show');
        // Notify chatbot of staff login so it pre-loads data
        if(window.qdcChat) qdcChat.onStaffLogin(this._staffName, this._staffRole);
        document.getElementById('staff-view').classList.add('show');
        const greet = document.getElementById('staff-greeting');
        if(greet) greet.textContent = `Welcome, ${this._staffName}`;
        this.refresh();
        this._startNotifPolling();
        this._startIdleTimer();
        // Preload all data immediately on login behind a sync overlay
        this._preloadAll();
        if(this._staffRole!=='doctor') setTimeout(()=>this._remindPendingTasks(),4000);
        this._initTabSwipe();
        if(window.QDC_msgboard) QDC_msgboard.show();
      } else {
        msg.textContent = data.error || 'Invalid credentials.';
        msg.className='qdc-msg err';
      }
    } catch(e){
      msg.textContent = 'Could not reach server. Check connection.';
      msg.className='qdc-msg err';
    }
    btn.textContent = 'Access Dashboard →';
  },

  _initTabSwipe(){
    if(window.innerWidth > 1020) return; // desktop: no swipe
    const view = document.getElementById('staff-view');
    if(!view || view._swipeInit) return;
    view._swipeInit = true;
    let tx=0, ty=0, dragging=false;
    view.addEventListener('touchstart', e=>{
      // Ignore touches inside inputs, textareas, selects, scrollable children
      const tag = e.target.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||tag==='BUTTON') return;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
      dragging = true;
    }, {passive:true});
    view.addEventListener('touchend', e=>{
      if(!dragging) return;
      dragging = false;
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      if(Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 90) return; // vertical or too short
      // Get ordered visible tabs
      const allTabs = ['queue','calendar','upload','inventory','patients','prescription','invoice','notes','expenses','payroll','revenue','attendance','automation','seo','datamgmt','txplan','perio','lab','inbox','photos'];
      const visibleTabs = allTabs.filter(t=>{
        const el = document.getElementById('stab-'+t);
        return el && el.offsetParent !== null && getComputedStyle(el).display !== 'none';
      });
      const activeTab = visibleTabs.find(t=> document.getElementById('stab-'+t)?.classList.contains('active'));
      if(!activeTab) return;
      const idx = visibleTabs.indexOf(activeTab);
      const nextTab = dx < 0 ? visibleTabs[idx+1] : visibleTabs[idx-1];
      if(!nextTab) return;
      QDC_staff.tab(nextTab);
      // Scroll the tab bar so active tab is visible
      setTimeout(()=>{
        const tabEl = document.getElementById('stab-'+nextTab);
        tabEl?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
      }, 50);
    }, {passive:true});
  },

  async _preloadAll(){
    // Remove any existing overlay
    const existing = document.getElementById('staffSyncOverlay');
    if(existing) existing.remove();

    // Build sync overlay
    const ov = document.createElement('div');
    ov.id = 'staffSyncOverlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(245,248,252,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;font-family:inherit';
    ov.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:28px;max-width:320px;text-align:center;padding:40px 20px">

        <!-- ClinicOS Logo mark -->
        <div style="position:relative;width:72px;height:72px">
          <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px">
            <!-- Outer ring -->
            <circle cx="36" cy="36" r="34" stroke="rgba(201,151,58,0.2)" stroke-width="1.5"/>
            <!-- Cross / plus mark -->
            <rect x="33" y="18" width="6" height="36" rx="3" fill="url(#cg1)"/>
            <rect x="18" y="33" width="36" height="6" rx="3" fill="url(#cg1)"/>
            <!-- Corner accent dots -->
            <circle cx="36" cy="10" r="2.5" fill="#c9973a" opacity="0.6"/>
            <circle cx="36" cy="62" r="2.5" fill="#c9973a" opacity="0.6"/>
            <circle cx="10" cy="36" r="2.5" fill="#c9973a" opacity="0.6"/>
            <circle cx="62" cy="36" r="2.5" fill="#c9973a" opacity="0.6"/>
            <defs>
              <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#1a6fb5"/>
                <stop offset="100%" stop-color="#c9973a"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Wordmark -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <div style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;letter-spacing:.04em;color:var(--text1)">Clinic<span style="color:var(--gold)">OS</span></div>
          <div style="font-size:.58rem;letter-spacing:.28em;text-transform:uppercase;color:var(--text3);font-weight:500">Powered by ClinicOS</div>
        </div>

        <!-- Divider -->
        <div style="width:60px;height:1px;background:linear-gradient(to right,transparent,var(--gold),transparent)"></div>

        <!-- Status -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%">
          <div id="qdc-sync-status" style="font-size:.75rem;color:var(--text3);letter-spacing:.05em">Booting…</div>
          <div style="width:200px;height:2px;background:var(--border);border-radius:2px;overflow:hidden">
            <div id="qdc-sync-bar" style="height:100%;background:linear-gradient(to right,var(--blue3),var(--gold));border-radius:2px;width:0%;transition:width .5s ease"></div>
          </div>
        </div>

      </div>
    `;
        document.body.appendChild(ov);

    const setStatus = (txt, pct) => {
      const s = document.getElementById('qdc-sync-status');
      const b = document.getElementById('qdc-sync-bar');
      if(s) s.textContent = txt;
      if(b) b.style.width = pct+'%';
    };
    const tick = id => { /* step indicators removed — progress bar only */ };

    try {
      setStatus('Loading patients…', 10);
      if(!this._patLoaded){ this._patLoaded=true; await this._loadPatients(); }
      tick('qdc-step-patients'); setStatus('Loading inventory…', 35);

      this._invLoaded = true;
      await this._loadInventory();
      tick('qdc-step-inventory'); setStatus('Loading queue…', 60);

      await this._loadQueue();
      tick('qdc-step-queue'); setStatus('Loading appointments…', 72);

      setStatus('Loading staff…', 82);

      if(window.QDC_attendance && QDC_attendance._loadStaff) await QDC_attendance._loadStaff();
      tick('qdc-step-staff'); setStatus('All data synced ✓', 100);

      // Warm billing cache in background (non-blocking) after sync
      this._warmBillingCache();

      // Preload all tab data in background so tabs open instantly
      const _self = this;
      setTimeout(function(){
        if(window.QDC_invoice)   QDC_invoice.setPeriod('today');
        if(window.QDC_expenses)  QDC_expenses.load();
        if(window.QDC_payroll)   QDC_payroll.load();
        if(window.QDC_revenue)   QDC_revenue.load();
        if(window.QDC_automation)QDC_automation.load();
        if(window.QDC_lab)       QDC_lab.load();
        if(window.QDC_inbox)     QDC_inbox.load();
        if(window.QDC_calendar)  QDC_calendar.render && QDC_calendar.render();
        if(window.QDC_attendance)QDC_attendance.load();
        if(window.QDC_datamgmt)  QDC_datamgmt.load();
      }, 1500); // 1.5s after sync completes — non-blocking

      await new Promise(r=>setTimeout(r, 650));
      ov.style.transition = 'opacity .35s';
      ov.style.opacity = '0';
      await new Promise(r=>setTimeout(r, 360));
      ov.remove();
    } catch(err){
      setStatus('⚠ Sync error — '+err.message, 100);
      await new Promise(r=>setTimeout(r, 2500));
      ov.remove();
    }
  },

  _billingCache: {},

  async _warmBillingCache(){
    // Silently pre-fetch billing summaries for all patients in background
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy || !this._patData?.length) return;
    // Fetch in small batches to avoid overwhelming the GAS
    const pats = this._patData.slice(0, 200);  // top 200 by recency
    const BATCH = 5;
    for(let i=0; i<pats.length; i+=BATCH){
      const batch = pats.slice(i, i+BATCH);
      await Promise.all(batch.map(async p => {
        if(this._billingCache[p.id]) return;  // already cached
        try {
          const r = await fetch(`${proxy}&action=getPatientSummary&patientId=${encodeURIComponent(p.id)}${QDC_staff._hipaaParams()}`);
          const b = await r.json();
          if(b.ok) this._billingCache[p.id] = b;
        } catch(e){ /* silent */ }
      }));
      await new Promise(res=>setTimeout(res, 300));  // throttle between batches
    }
  },


  tab(which){
    ['queue','calendar','upload','inventory','patients','notes','invoice','prescription','expenses','payroll','revenue','attendance','automation','seo',
     'datamgmt','datamgmt','txplan','perio','lab','inbox','photos'].forEach(t=>{
      const tabEl = document.getElementById(`stab-${t}`);
      const panEl = document.getElementById(`spanel-${t}`);
      if(tabEl) tabEl.classList.toggle('active', t===which);
      if(panEl) panEl.style.display = t===which ? 'block':'none';
    });
    // inventory preloaded on login by _preloadAll()
    if(which==='patients'){
      if(this._patData?.length){ this._patFiltered=[...this._patData]; this._renderPatSummary(); this._renderPatTable(); }
      else if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); }
    }
    if(which==='upload' && !this._patLoaded){ this._patLoaded=true; this._loadPatients(); }
    if(which==='queue')    this._loadQueue();
    if(which==='inventory') setTimeout(()=>this.pollNotifications(), 1200);
    if(which==='invoice') setTimeout(()=>{ if(window.QDC_invoice) QDC_invoice.setPeriod('today'); }, 300);
    if(which==='expenses')  setTimeout(()=>{ if(window.QDC_expenses) QDC_expenses.load(); }, 200);
    if(which==='prescription') { if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); } setTimeout(()=>{ if(window.QDC_rx) QDC_rx.initToothMap(); }, 100); }
    if(which==='payroll')   setTimeout(()=>{ if(window.QDC_payroll)   QDC_payroll.load(); }, 200);
    if(which==='revenue')   setTimeout(()=>{ if(window.QDC_revenue)   QDC_revenue.load(); }, 200);
    if(which==='automation')setTimeout(()=>{ if(window.QDC_automation)QDC_automation.load(); }, 200);
    if(which==='seo')       setTimeout(()=>{ if(window.QDC_seo)       QDC_seo.init(); }, 200);
    if(which==='datamgmt')  setTimeout(()=>{ if(window.QDC_datamgmt) QDC_datamgmt.load(); }, 200);
    if(which==='attendance') { QDC_attendance.load(); }
    if(which==='txplan')    { if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); } setTimeout(()=>{ if(window.QDC_txplan)  QDC_txplan.load(); }, 200); }
    if(which==='perio')     { if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); } setTimeout(()=>{ if(window.QDC_perio)   QDC_perio.load(); }, 200); }
    if(which==='lab')       { if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); } setTimeout(()=>{ if(window.QDC_lab)     QDC_lab.load(); }, 200); }
    if(which==='photos')    { if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); } setTimeout(()=>{ if(window.QDC_photos)  QDC_photos.load(); }, 200); }
    if(which==='inbox')     setTimeout(()=>{ if(window.QDC_inbox){ QDC_inbox.load(); QDC_inbox.clearBadge(); } }, 200);
    // waitingroom removed
    if(which==='calendar')  {
      if(!this._patLoaded){ this._patLoaded=true; this._loadPatients(); }
      setTimeout(()=>{
        if(!window.QDC_calendar) return;
        // Auto-switch to 3-day on mobile if still on 7-day
        if(window.innerWidth < 650 && QDC_calendar._viewDays === 7){
          QDC_calendar._viewDays = 3;
          QDC_calendar._updateViewBtns();
        }
        QDC_calendar.render();
      }, 100);
    }
  },
  /* ── NOTIFICATIONS ── */
  _notifs: [],

  async pollNotifications(){
    const bar  = document.getElementById('staff-notif-bar');
    const list = document.getElementById('staff-notif-list');
    if(!bar || !list) return;
    const notifs = [];

    // Check low/out stock from local inventory cache
    const dismissed = this._dismissedInvNotifs || new Set();
    const lowItems = (this._invData||[]).filter(it=>{
      const s=isNaN(it.stock)?0:Number(it.stock), m=isNaN(it.min)?5:Number(it.min)||5;
      const key = it.id||it.name;
      return s <= m && !dismissed.has(key);
    });
    lowItems.forEach(it=>{
      const out = (isNaN(it.stock)?0:Number(it.stock))===0;
      notifs.push({
        type: out?'danger':'warn',
        ico:  out?'🚨':'⚠️',
        text: out ? `OUT OF STOCK: ${it.name}` : `Low stock: ${it.name} (${it.stock} ${it.unit||'pcs'} left)`,
        action: ()=>this.tab('inventory')
      });
    });

    // Check notes from Apps Script — both shift notes AND board messages
    try {
      const { SHEETS_PROXY } = window.__QDC;
      if(SHEETS_PROXY && !SHEETS_PROXY.includes('YOUR_')){
        const res  = await fetch(`${SHEETS_PROXY}&action=getRecentNotes&since=${this._lastNotifCheck||0}${this._hipaaParams()}`);
        const data = await res.json();
        const rows = Array.isArray(data) ? data : (data.rows || []);
        if(rows.length){
          const boardMsgs = rows.filter(n => (n.Type||n.type||'') === 'board');
          const shiftNotes = rows.filter(n => (n.Type||n.type||'') !== 'board');
          // Shift notes → go to notes tab
          shiftNotes.forEach(n=>{
            notifs.push({ type:'info', ico:'📝', text:`New note from ${n.StaffID||n.staffId||'staff'}: ${(n.Note||n.note||'').slice(0,60)}…`, action:()=>this.tab('notes') });
          });
          // Board messages → update board badge + browser notification
          if(boardMsgs.length > 0){
            notifs.push({
              type:'info', ico:'💬',
              text: boardMsgs.length === 1
                ? `Board: ${(boardMsgs[0].Note||boardMsgs[0].note||'').slice(0,60)}`
                : `${boardMsgs.length} new board messages`,
              action: ()=>{ if(window.QDC_msgboard) QDC_msgboard.toggle(); }
            });
            // Update board badge
            const badge = document.getElementById('staff-msgboard-badge');
            if(badge){
              const current = parseInt(badge.textContent||'0')||0;
              const total = current + boardMsgs.length;
              badge.textContent = total;
              badge.style.display = 'flex';
            }
            // Browser push notification
            if(Notification.permission === 'granted'){
              const sender = boardMsgs[0].StaffID||boardMsgs[0].staffId||'Staff';
              const body = boardMsgs.length === 1
                ? (boardMsgs[0].Note||boardMsgs[0].note||'').slice(0,100)
                : `${boardMsgs.length} new messages on the staff board`;
              new Notification(`📋 QDC Board — ${sender}`, { body, icon: '/favicon.ico', tag: 'qdc-board' });
            } else if(Notification.permission !== 'denied'){
              Notification.requestPermission();
            }
          }
        }
        this._lastNotifCheck = Date.now();
      }
    } catch(e){ /* offline — skip */ }

    this._notifs = notifs;
    this._renderNotifs();
  },

  _renderNotifs(){
    const bar  = document.getElementById('staff-notif-bar');
    const list = document.getElementById('staff-notif-list');
    if(!bar || !list) return;
    if(!this._notifs.length){ bar.classList.remove('has-notifs'); return; }
    bar.classList.add('has-notifs');
    list.innerHTML = this._notifs.map((n,i)=>`
      <div class="snotif ${n.type}" onclick="QDC_staff._notifClick(${i})">
        <span class="snotif-ico">${n.ico}</span>
        <span>${n.text}</span>
      </div>`).join('') +
      `<button class="snotif-clear" onclick="QDC_staff._clearNotifs()">✕ Clear</button>`;
  },

  _notifClick(i){ this._notifs[i]?.action?.(); },
  _clearNotifs(){
    // Remember dismissed inventory item keys so they don't re-appear this session
    (this._invData||[]).forEach(it=>{
      const s=isNaN(it.stock)?0:Number(it.stock), m=isNaN(it.min)?5:Number(it.min)||5;
      if(s<=m){ if(!this._dismissedInvNotifs) this._dismissedInvNotifs=new Set(); this._dismissedInvNotifs.add(it.id||it.name); }
    });
    this._notifs=[];
    document.getElementById('staff-notif-bar')?.classList.remove('has-notifs');
  },

  _startNotifPolling(){
    // Request browser notification permission silently at login
    if(typeof Notification !== 'undefined' && Notification.permission === 'default'){
      Notification.requestPermission();
    }
    this.pollNotifications();
    setInterval(()=>this.pollNotifications(), 60000); // poll every 60s
  },
  // ── HIPAA: audit params helper ────────────────────────────────────
  _hipaaParams(){
    const sid  = encodeURIComponent(this._staffId   || '');
    const role = encodeURIComponent(this._staffRole || '');
    // Proxy secret has trailing '?' — must URL-encode to avoid query-string break
    const psec = window._IS_LOCAL ? '&_psec=' + encodeURIComponent('2BorNOT2BTHATISTHE?') : '';
    return `&_sid=${sid}&_role=${role}${psec}`;
  },

  // ── HIPAA: 15-minute idle session timeout ─────────────────────────
  _idleTimer: null,
  _idleWarningTimer: null,
  _IDLE_TIMEOUT_MS: 15 * 60 * 1000,   // 15 minutes
  _IDLE_WARNING_MS: 14 * 60 * 1000,   // warn at 14 minutes

  _startIdleTimer(){
    this._stopIdleTimer();
    const events = ['mousemove','keydown','mousedown','touchstart','scroll'];
    this._idleReset = () => this._resetIdleTimer();
    events.forEach(ev => document.addEventListener(ev, this._idleReset, { passive: true }));
    this._idleWarningTimer = setTimeout(() => {
      if(!this._authenticated) return;
      const banner = document.getElementById('qdc-idle-warning');
      if(banner) { banner.style.display='flex'; }
    }, this._IDLE_WARNING_MS);
    this._idleTimer = setTimeout(() => {
      if(!this._authenticated) return;
      this._forceIdleLogout();
    }, this._IDLE_TIMEOUT_MS);
  },

  _resetIdleTimer(){
    if(!this._authenticated) return;
    clearTimeout(this._idleTimer);
    clearTimeout(this._idleWarningTimer);
    const banner = document.getElementById('qdc-idle-warning');
    if(banner) banner.style.display='none';
    this._idleWarningTimer = setTimeout(() => {
      if(!this._authenticated) return;
      const b = document.getElementById('qdc-idle-warning');
      if(b) b.style.display='flex';
    }, this._IDLE_WARNING_MS);
    this._idleTimer = setTimeout(() => {
      if(!this._authenticated) return;
      this._forceIdleLogout();
    }, this._IDLE_TIMEOUT_MS);
  },

  _stopIdleTimer(){
    clearTimeout(this._idleTimer);
    clearTimeout(this._idleWarningTimer);
    if(this._idleReset){
      const events = ['mousemove','keydown','mousedown','touchstart','scroll'];
      events.forEach(ev => document.removeEventListener(ev, this._idleReset));
      this._idleReset = null;
    }
    const banner = document.getElementById('qdc-idle-warning');
    if(banner) banner.style.display='none';
  },

  _forceIdleLogout(){
    this._stopIdleTimer();
    // Show a brief toast before logging out
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:12px 24px;border-radius:8px;z-index:99999;font-size:.95rem;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    toast.textContent = '⏱ Session expired due to inactivity. Please log in again.';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); this.logout(); }, 2500);
  },





  /* ── INVENTORY MANAGEMENT ────────────────────────────────── */
  _invData: [],    // full inventory array (local cache)
  _invFiltered: [], // after filter/sort
  _invPage: 0,
  _invPageSize: 20,

  async _syncPatientsInBackground(){
    // Silent background refresh — update cache and UI if data changed
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy) return;
      const resp = await fetch(proxy + '&action=getPatients' + QDC_staff._hipaaParams());
      if(!resp.ok) return;
      const raw  = await resp.json();
      if(!Array.isArray(raw) || !raw.length) return;
      const syncEl = document.getElementById('pat-last-sync');
      // Re-run the same mapping logic by delegating to forceSync
      // Simple approach: if count differs, trigger a full reload
      if(raw.length !== (this._patData||[]).length){
        this._patLoading = false;
        await this._loadPatients(true);
      } else {
        this._cacheSet('patients', this._patData);
        if(syncEl) syncEl.textContent = 'Synced ' + new Date().toLocaleTimeString('en-BD') + ' · ' + this._patData.length + ' patients';
      }
    } catch(e){ /* silent */ }
  },

  async _loadInventory(forceSync){
    const el = document.getElementById('inv-tbody');

    // ── Serve from cache instantly (5 min TTL) ────────────────────────────
    if(!forceSync){
      const cached = this._cacheGet('inventory', 5*60*1000);
      if(cached && cached.length){
        this._invData     = cached;
        this._invFiltered = [...cached];
        this._invPage     = 0;
        this._renderInvSummary();
        this._renderInvFilters();
        this._renderInvTable();
        // Background sync
        setTimeout(()=>this._syncInventoryInBackground(), 500);
        return;
      }
    }

    if(el) el.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text3)">⌛ Loading…</td></tr>';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy || proxy.includes('YOUR_')) {
        // Demo data for testing
        this._invData = [
          {id:'INV001',name:'Latex Gloves (S)',cat:'PPE',stock:120,unit:'box',min:10,notes:'Monthly order',updated:'2026-03-01'},
          {id:'INV002',name:'Latex Gloves (M)',cat:'PPE',stock:3,unit:'box',min:10,notes:'',updated:'2026-03-05'},
          {id:'INV003',name:'Latex Gloves (L)',cat:'PPE',stock:0,unit:'box',min:10,notes:'Reorder urgent',updated:'2026-02-28'},
          {id:'INV004',name:'Surgical Masks',cat:'PPE',stock:200,unit:'piece',min:50,notes:'',updated:'2026-03-01'},
          {id:'INV005',name:'Composite Resin A2',cat:'Restorative',stock:8,unit:'syringe',min:5,notes:'Dentsply',updated:'2026-03-03'},
          {id:'INV006',name:'Composite Resin A3',cat:'Restorative',stock:4,unit:'syringe',min:5,notes:'',updated:'2026-03-03'},
          {id:'INV007',name:'Etch Gel 37%',cat:'Restorative',stock:12,unit:'bottle',min:3,notes:'',updated:'2026-03-01'},
          {id:'INV008',name:'Bonding Agent',cat:'Restorative',stock:6,unit:'bottle',min:2,notes:'',updated:'2026-03-01'},
          {id:'INV009',name:'Sodium Hypochlorite',cat:'Endodontics',stock:15,unit:'bottle',min:5,notes:'',updated:'2026-02-25'},
          {id:'INV010',name:'K-Files #15-40',cat:'Endodontics',stock:2,unit:'pack',min:5,notes:'Reorder needed',updated:'2026-03-06'},
          {id:'INV011',name:'Paper Points #25',cat:'Endodontics',stock:30,unit:'pack',min:10,notes:'',updated:'2026-03-01'},
          {id:'INV012',name:'Gutta Percha #25',cat:'Endodontics',stock:18,unit:'pack',min:5,notes:'',updated:'2026-03-01'},
          {id:'INV013',name:'Local Anaesthetic Lignospan',cat:'Anaesthetics',stock:45,unit:'cartridge',min:20,notes:'',updated:'2026-03-04'},
          {id:'INV014',name:'Disposable Syringes 5ml',cat:'Consumables',stock:80,unit:'piece',min:30,notes:'',updated:'2026-03-01'},
          {id:'INV015',name:'Impression Material Light Body',cat:'Prosthetics',stock:6,unit:'cartridge',min:3,notes:'3M ESPE',updated:'2026-02-28'},
          {id:'INV016',name:'Impression Material Heavy Body',cat:'Prosthetics',stock:4,unit:'cartridge',min:3,notes:'',updated:'2026-02-28'},
          {id:'INV017',name:'X-Ray Films',cat:'Radiology',stock:0,unit:'packet',min:5,notes:'Order from Dhaka',updated:'2026-03-07'},
          {id:'INV018',name:'Lead Apron',cat:'Radiology',stock:2,unit:'piece',min:2,notes:'',updated:'2026-01-10'},
          {id:'INV019',name:'Orthodontic Brackets Metal',cat:'Orthodontics',stock:25,unit:'packet',min:10,notes:'',updated:'2026-03-02'},
          {id:'INV020',name:'Orthodontic Wire 0.014',cat:'Orthodontics',stock:12,unit:'coil',min:5,notes:'',updated:'2026-03-02'},
        ];
      } else {
        const r = await fetch(proxy + '&action=getInventory' + QDC_staff._hipaaParams());
        const d = await r.json();
        // GAS returns a plain array; normalise all possible field name variants
        const raw = Array.isArray(d) ? d : (d.rows || d.data || []);
        // GAS now returns clean typed fields: id,name,category,stock,minStock,unit,notes,lastUpdated
        // Parse a field that may be a real number, a date-serialised number (from Sheets date-format bug),
        // or a genuine date string to ignore.
        function invNum(v, fallback){
          if(v == null || v === '') return fallback;
          if(typeof v === 'number') return isNaN(v) ? fallback : v;
          var s = String(v).trim();
          if(s === '') return fallback;
          if(!isNaN(s)) return Number(s);  // plain numeric string
          // Detect Sheets date-serialisation: "1900-03-31T18:00:00.000Z" etc.
          // GAS in UTC+6 serialises Sheets date serial N as UTC date (serial N-1 days from Dec 30 1899).
          // Recovery: count UTC days from Dec 30 1899 to the ISO date, then +1.
          // Use Date.UTC() for correct cross-year arithmetic (avoids timezone constructor issues).
          var m = s.match(/^(\d{4})-(\d{2})-(\d{2})T/);
          if(m){
            var yr=+m[1], mo=+m[2], dy=+m[3];
            if(yr >= 1899 && yr <= 1910){
              // UTC+6 (Bangladesh): serial = utcDelta (no offset needed since UTC date is already 1 day behind local)
              // UTC+0: serial = utcDelta - 1
              // We try without offset first (works for UTC+6), then with -1 as fallback in the calling code
              var utcDelta = Math.round(
                (Date.UTC(yr,mo-1,dy) - Date.UTC(1899,11,30)) / 86400000
              );
              // utcDelta is correct for UTC+6 GAS; for UTC+0 GAS it would be utcDelta-1
              if(utcDelta >= 0 && utcDelta < 10000) return utcDelta;
            }
          }
          return fallback;
        }
        // Sheet layout after importInventoryV2():
        // id | name | category | stock | minStock | supplier | price | lastUpdated | notes
        // Old layout (pre-migration): id | name | CATEGORY(in stock col) | STOCK(in unit col) | minStock | ...
        this._invData = raw.filter(r=>r.name||r.Name).map(r => {
          var rName  = r.name  || r.Name  || '';
          var rId    = r.id    || r.ID    || r.itemid || '';
          var rCat   = r.category || r.Category || r.cat || '';
          var rStock = r.stock !== undefined ? r.stock : r.Stock;
          var rUnit  = r.unit  !== undefined ? r.unit  : r.Unit;
          var rMin   = r.minStock !== undefined ? r.minStock : (r.minstock !== undefined ? r.minstock : r.min);
          var rUpd   = r.lastUpdated || r.LastUpdated || r.updatedat || r.updated || '';

          // Detect OLD layout: stock col has category (string), unit col has actual stock (number)
          var catVal, stockVal;
          if(typeof rStock === 'string' && isNaN(rStock) && rStock !== ''){
            catVal   = rStock;  // e.g. "Endodontics"
            stockVal = invNum(rUnit, 0);
          } else {
            catVal   = rCat || (typeof rUnit === 'string' && isNaN(rUnit) && rUnit ? rUnit : 'General');
            stockVal = invNum(rStock, 0);
          }

          // Safety: if stock=0 and unit column holds a positive integer, use it
          if(stockVal === 0 && typeof rUnit === 'number' && rUnit > 0) stockVal = rUnit;
          if(stockVal === 0 && typeof rUnit === 'string' && !isNaN(rUnit) && Number(rUnit) > 0) stockVal = Number(rUnit);

          var minVal  = invNum(rMin, 5);
          var unitStr = (rCat && typeof rUnit === 'string' && isNaN(rUnit) && rUnit) ? rUnit : 'pcs';

          return { id:rId, name:rName, cat:catVal||'General', stock:stockVal, unit:unitStr, min:minVal, notes:r.notes||r.Notes||'', updated:rUpd };
        });
      }
      this._invFiltered = [...this._invData];
      this._invPage = 0;
      this._cacheSet('inventory', this._invData);  // persist to localStorage
      this._renderInvSummary();
      this._renderInvFilters();
      this._renderInvTable();
    } catch(err) {
      if(el) el.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--crimson)">⚠ Failed to load: '+err.message+'</td></tr>';
    }
  },

  async _syncInventoryInBackground(){
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(!proxy) return;
      const r = await fetch(proxy + '&action=getInventory' + QDC_staff._hipaaParams());
      const d = await r.json();
      const raw = Array.isArray(d) ? d : (d.rows||d.data||[]);
      if(raw.length && raw.length !== this._invData.length){
        this._invLoaded = false;
        await this._loadInventory(true);  // reload fully if count changed
      } else {
        this._cacheSet('inventory', this._invData);
      }
    } catch(e){ /* silent */ }
  },

  _renderInvSummary(){
    const data = this._invData;
    const cats = new Set(data.map(i=>i.cat||'Uncategorised')).size;
    const low = data.filter(i=>i.stock>0 && i.stock<(i.min||5)).length;
    const out = data.filter(i=>i.stock<=0).length;
    document.getElementById('invs-total').textContent = data.length;
    document.getElementById('invs-low').textContent   = low;
    document.getElementById('invs-out').textContent   = out;
    document.getElementById('invs-cats').textContent  = cats;
    // Colour indicators
    document.getElementById('invs-low').style.color   = low>0?'#e6b800':'var(--gold2)';
    document.getElementById('invs-out').style.color   = out>0?'var(--crimson)':'var(--gold2)';
  },

  _renderInvFilters(){
    const cats = [...new Set(this._invData.map(i=>i.cat||'Uncategorised'))].sort();
    const sel  = document.getElementById('inv-cat-filter');
    const datalist = document.getElementById('inv-cat-datalist');
    if(!sel) return;
    const existing = sel.value;
    sel.innerHTML = '<option value="">All Categories</option>';
    cats.forEach(c=>{ 
      sel.innerHTML += `<option value="${c}">${c}</option>`;
      if(datalist) datalist.innerHTML += `<option value="${c}">`;
    });
    sel.value = existing;
  },

  invFilter(){
    const q      = (document.getElementById('inv-search')?.value||'').toLowerCase();
    const cat    = document.getElementById('inv-cat-filter')?.value||'';
    const status = document.getElementById('inv-status-filter')?.value||'';
    const sort   = document.getElementById('inv-sort')?.value||'name';
    let d = [...this._invData];
    if(q)      d = d.filter(i=>(i.name+i.cat+i.notes).toLowerCase().includes(q));
    if(cat)    d = d.filter(i=>(i.cat||'Uncategorised')===cat);
    if(status==='ok')  d = d.filter(i=>i.stock>=(i.min||5));
    if(status==='low') d = d.filter(i=>i.stock>0 && i.stock<(i.min||5));
    if(status==='out') d = d.filter(i=>i.stock<=0);
    if(sort==='name')       d.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==='stock-asc')  d.sort((a,b)=>a.stock-b.stock);
    if(sort==='stock-desc') d.sort((a,b)=>b.stock-a.stock);
    if(sort==='cat')        d.sort((a,b)=>(a.cat||'').localeCompare(b.cat||''));
    this._invFiltered = d;
    this._invPage = 0;
    this._renderInvTable();
  },

  _renderInvTable(){
    const tbody = document.getElementById('inv-tbody');
    const pager = document.getElementById('inv-pager');
    if(!tbody) return;
    const d  = this._invFiltered;
    const ps = this._invPageSize;
    const pg = this._invPage;
    const slice = d.slice(pg*ps, (pg+1)*ps);
    if(!d.length){ tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:36px;color:var(--text3)">No items match filter</td></tr>'; return; }
    tbody.innerHTML = slice.map(it=>{
      const mn   = it.min||5;
      const s    = it.stock<=0?'out':it.stock<mn?'low':'ok';
      const slbl = s==='out'?'🔴 Out':s==='low'?'⚠️ Low':'✅ OK';
      return `<tr data-id="${it.id}">
        <td><strong style="color:var(--text)">${it.name}</strong>${it.notes?'<div style="font-size:.72rem;color:var(--text3);margin-top:2px">'+it.notes+'</div>':''}</td>
        <td><span style="background:rgba(201,151,58,.08);border:1px solid var(--border);padding:2px 8px;font-size:.72rem;letter-spacing:.06em">${it.cat||'—'}</span></td>
        <td><span class="inv-stock-cell ${s}">${it.stock}</span></td>
        <td style="color:var(--text3)">${it.unit||'—'}</td>
        <td style="color:var(--text3)">${mn}</td>
        <td><span class="inv-badge ${s}">${slbl}</span></td>
        <td style="color:var(--text3);font-size:.78rem">${it.updated||'—'}</td>
        <td><div class="inv-actions">
          <button class="inv-act-btn" onclick="QDC_staff.useOne('${it.id}')" title="Use 1 unit">−1 Use</button>
          <button class="inv-act-btn" onclick="QDC_staff.restockModal('${it.id}')">+ Restock</button>
          <button class="inv-act-btn" onclick="QDC_staff.invModal('${it.id}')">✏️</button>
          <button class="inv-act-btn use" onclick="QDC_staff.deleteInvItem('${it.id}')" title="Delete">🗑</button>
        </div></td>
      </tr>`;
    }).join('');
    // Pagination
    const pages = Math.ceil(d.length/ps);
    if(pager){
      pager.innerHTML = pages<=1?'': 
        Array.from({length:pages},(_,i)=>`<button class="inv-pg-btn${i===pg?' active':''}" onclick="QDC_staff._goInvPage(${i})">${i+1}</button>`).join('');
    }
  },

  _goInvPage(n){ this._invPage=n; this._renderInvTable(); },

  useOne(id){
    const it = this._invData.find(i=>i.id===id);
    if(!it) return;
    if(it.stock<=0){ alert('Item is already out of stock!'); return; }
    it.stock--;
    it.updated = new Date().toISOString().slice(0,10);
    this._invFiltered = [...this._invData];
    this._renderInvSummary();
    this.invFilter();
    this._syncInvItem(id,'use',1);
  },

  restockModal(id){
    const it = this._invData.find(i=>i.id===id);
    if(!it) return;
    document.getElementById('restock-item-id').value  = id;
    document.getElementById('restock-item-name').textContent = it.name;
    document.getElementById('restock-qty').value  = '';
    document.getElementById('restock-note').value = '';
    document.getElementById('restock-msg').textContent = '';
    document.getElementById('invRestockOverlay').classList.add('show');
  },

  confirmRestock(){
    const id  = document.getElementById('restock-item-id').value;
    const qty = parseInt(document.getElementById('restock-qty').value)||0;
    const msg = document.getElementById('restock-msg');
    if(!qty||qty<1){ msg.textContent='⚠ Enter a valid quantity'; return; }
    const it = this._invData.find(i=>i.id===id);
    if(!it) return;
    it.stock += qty;
    it.updated = new Date().toISOString().slice(0,10);
    document.getElementById('invRestockOverlay').classList.remove('show');
    this._renderInvSummary();
    this.invFilter();
    this._syncInvItem(id,'restock',qty);
  },

  invModal(editId){
    const it = editId ? this._invData.find(i=>i.id===editId) : null;
    document.getElementById('inv-modal-title').textContent = it ? 'Edit Item' : 'Add New Item';
    document.getElementById('inv-edit-id').value   = editId||'';
    document.getElementById('inv-f-name').value    = it?.name||'';
    document.getElementById('inv-f-cat').value     = it?.cat||'';
    document.getElementById('inv-f-unit').value    = it?.unit||'';
    document.getElementById('inv-f-stock').value   = it?.stock??'';
    document.getElementById('inv-f-min').value     = it?.min??'';
    document.getElementById('inv-f-notes').value   = it?.notes||'';
    document.getElementById('inv-modal-msg').textContent = '';
    document.getElementById('invItemOverlay').classList.add('show');
  },

  saveInvItem(){
    const msg  = document.getElementById('inv-modal-msg');
    const name = document.getElementById('inv-f-name').value.trim();
    if(!name){ msg.textContent='⚠ Name is required'; return; }
    const editId = document.getElementById('inv-edit-id').value;
    const today  = new Date().toISOString().slice(0,10);
    if(editId){
      const it = this._invData.find(i=>i.id===editId);
      if(it){
        it.name=name; it.cat=document.getElementById('inv-f-cat').value.trim();
        it.unit=document.getElementById('inv-f-unit').value.trim();
        it.stock=parseInt(document.getElementById('inv-f-stock').value)||0;
        it.min=parseInt(document.getElementById('inv-f-min').value)||5;
        it.notes=document.getElementById('inv-f-notes').value.trim();
        it.updated=today;
      }
    } else {
      const newId='INV'+String(Date.now()).slice(-6);
      this._invData.push({id:newId,name,cat:document.getElementById('inv-f-cat').value.trim(),
        unit:document.getElementById('inv-f-unit').value.trim(),
        stock:parseInt(document.getElementById('inv-f-stock').value)||0,
        min:parseInt(document.getElementById('inv-f-min').value)||5,
        notes:document.getElementById('inv-f-notes').value.trim(),updated:today});
    }
    document.getElementById('invItemOverlay').classList.remove('show');
    this._renderInvSummary();
    this._renderInvFilters();
    this.invFilter();
    msg.textContent='';
  },

  deleteInvItem(id){
    if(!confirm('Delete this item from inventory?')) return;
    this._invData = this._invData.filter(i=>i.id!==id);
    this._renderInvSummary();
    this.invFilter();
  },

  exportInvCSV(){
    const rows = [['ID','Name','Category','Stock','Unit','Min Stock','Status','Notes','Last Updated']];
    this._invFiltered.forEach(it=>{
      const s = it.stock<=0?'Out of Stock':it.stock<(it.min||5)?'Low Stock':'In Stock';
      rows.push([it.id,it.name,it.cat||'',it.stock,it.unit||'',it.min||5,s,it.notes||'',it.updated||'']);
    });
    const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'QDC_Inventory_'+new Date().toISOString().slice(0,10)+'.csv';
    a.click();
  },

  async _syncInvItem(id, action, qty){
    // Sync to Google Sheets (when proxy configured)
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy||proxy.includes('YOUR_')) return;
    try {
      await fetch(proxy+'&action=updateInventory&id='+id+'&op='+action+'&qty='+qty+QDC_staff._hipaaParams());
    } catch(e){ /* silent fail */ }
  },
  /* ── END INVENTORY ── */


  /* ══════════════════════════════════════════════════════
     PATIENT DATABASE — Google Sheets Integration
     Sheet columns expected:
       PatientID | Name | Phone | Age | Gender | Address |
       Source | RegisteredAt | LastVisit | Notes | Active
  ══════════════════════════════════════════════════════ */
  _patData: [],
  _patFiltered: [],
  _patPage: 0,
  _patPageSize: 25,
  async _loadPatients(forceSync){
    if(this._patLoading && !forceSync) return;
    if(forceSync) this._cacheClear('patients');  // explicit sync: discard stale cache
    this._patLoading = true;
    const syncEl = document.getElementById('pat-last-sync');

    // ── Serve from localStorage cache instantly (10 min TTL) ──────────────
    if(!forceSync){
      const cached = this._cacheGet('patients', 10*60*1000);
      if(cached && cached.length){
        this._patData     = cached;
        this._patFiltered = [...cached];
        this._patPage     = 0;
        if(syncEl) syncEl.textContent = 'Cached · ' + cached.length + ' patients — syncing…';
        try{ this._renderPatSummary(); }catch(e){}
        try{ this._renderPatTable();   }catch(e){}
        // Background sync: update cache without blocking UI
        this._patLoading = false;
        this._syncPatientsInBackground();
        return;
      }
    }

    if(syncEl) syncEl.textContent = '⌛ Syncing…';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy) throw new Error('No proxy URL');
      const resp = await fetch(proxy + '&action=getPatients' + QDC_staff._hipaaParams());
      if(!resp.ok) throw new Error('HTTP ' + resp.status);
      const raw = await resp.json();
      const rows = Array.isArray(raw) ? raw : [];
      // Case-insensitive key getter
      const g = (r, ...keys) => {
        for(const k of keys){
          // Direct match first
          if(r[k] != null && r[k] !== '') return String(r[k]);
          // Lowercase match
          const lk = k.toLowerCase();
          const found = Object.keys(r).find(rk => rk.toLowerCase() === lk);
          if(found && r[found] != null && r[found] !== '') return String(r[found]);
        }
        return '';
      };
      // SHEET LAYOUT (confirmed from actual Sheets screenshot):
      // Headers (row 1): PatientID(A) | Phone(B) | Name(C) | CreatedAt(D) | Source(E)
      // Walk-in row data: pid | real_phone | real_name | age("23")    | gender("Male")
      // Migration row data: pid | real_NAME  | real_PHONE | gender("F") | country("Bangladesh")
      this._patData = rows
        .filter(r => r && typeof r === 'object' && Object.keys(r).length > 0)
        .map((r, i) => {
          const isAllDigits  = s => /^[\d\s\-+().]+$/.test(String(s||'')) && /\d{6,}/.test(String(s||''));
          const hasLetters   = s => /[a-zA-Zঀ-৿]/.test(String(s||''));
          const isGenderWord = s => /^(male|female|other)$/i.test(String(s||'').trim());
          const isCountry    = s => /^(bangladesh|india|pakistan|nepal|bhutan|myanmar)$/i.test(String(s||'').trim());
          const isAge        = s => /^\d{1,3}$/.test(String(s||'').trim()) && +s > 0 && +s < 120;

          const id       = g(r,'PatientID','patientid','id') || ('QDC-'+String(i+1).padStart(4,'0'));
          const rawPhone = g(r,'Phone','phone','mobile') || '';
          const rawName  = g(r,'Name','name','fullname') || '';

          // Migration patients have Name=phone_digits, Phone=actual_name (swapped in sheet)
          let name, phone;
          if(isAllDigits(rawName) && hasLetters(rawPhone)){
            name = rawPhone; phone = rawName;
          } else {
            name = rawName || '—'; phone = rawPhone || '—';
          }

          const rawCreated = g(r,'CreatedAt','createdat','registeredat','RegisteredAt') || '';
          const rawSource  = g(r,'Source','source') || '';
          let age = '', gender = '', source = '', reg = '';

          if(isGenderWord(rawSource)){
            // Walk-in patient: Source=gender, CreatedAt=age
            gender = rawSource;  source = 'Walk-in';
            if(isAge(rawCreated)) age = rawCreated; else reg = rawCreated;
          } else if(isCountry(rawSource)){
            // Migration patient: Source=country, CreatedAt=gender
            source = 'Imported';
            if(isGenderWord(rawCreated)) gender = rawCreated; else reg = rawCreated;
          } else {
            source = rawSource || 'Walk-in';
            if(isGenderWord(rawCreated))     gender = rawCreated;
            else if(isAge(rawCreated))        age    = rawCreated;
            else                              reg    = rawCreated;
          }

          // Normalise reg to YYYY-MM-DD
          if(reg && /^\d{4}-\d{2}-\d{2}/.test(reg)){
            reg = reg.slice(0,10);
          } else {
            // Migration patients: ISO timestamp is in an extra unnamed column.
            // Scan ALL values of r for an ISO date string.
            reg = '';
            var allVals = Object.values(r);
            for(var vi=0; vi<allVals.length; vi++){
              var vs = String(allVals[vi]||'');
              if(/^\d{4}-\d{2}-\d{2}T/.test(vs)){ reg = vs.slice(0,10); break; }
            }
          }
          const country = g(r,'Country','country') || '';
          return {
            id, name, phone, age, gender,
            country,
            address:   g(r,'Address','address','area') || '',
            source,
            reg,
            lastVisit: g(r,'LastVisit','lastvisit','last_visit') || '',
            notes:     g(r,'Notes','notes') || '',
          };
        });
      this._cacheSet('patients', this._patData);  // persist to localStorage
      if(syncEl) syncEl.textContent = 'Synced ' + new Date().toLocaleTimeString('en-BD') + ' · ' + this._patData.length + ' patients';
    } catch(err){
      console.warn('Patient load:', err.message);
      if(!this._patData) this._patData = [];
      if(syncEl) syncEl.textContent = this._patData.length
        ? 'Cached · ' + this._patData.length + ' patients (sync failed)'
        : '⚠ ' + err.message;
    }
    this._patFiltered = [...this._patData];
    this._patPage = 0;
    try { this._renderPatSummary(); } catch(e){ console.warn('summary:', e); }
    try { this._renderPatTable();   } catch(e){ console.warn('table:', e); }
    this._patLoading = false;
  },

  _parseCSV(text) {
    const rows = [];
    const lines = text.split(/\r?\n/);
    for(const line of lines) {
      if(!line.trim()) continue;
      const row = [];
      let cur = '', inQ = false;
      for(let i = 0; i < line.length; i++) {
        const ch = line[i];
        if(ch === '"') { inQ = !inQ; }
        else if(ch === ',' && !inQ) { row.push(cur.trim()); cur = ''; }
        else { cur += ch; }
      }
      row.push(cur.trim());
      rows.push(row);
    }
    return rows;
  },

  _renderPatSummary() {
    const d = this._patData;
    const today = new Date().toISOString().slice(0,10);
    const month = today.slice(0,7);
    document.getElementById('pats-total').textContent = d.length;
    // Registered today/month: check if reg is a real ISO date (not a gender/age value)
    const isRealDate = r => r.reg && /^\d{4}-\d{2}-\d{2}/.test(r.reg);
    document.getElementById('pats-today').textContent = d.filter(p => isRealDate(p) && p.reg.startsWith(today)).length;
    document.getElementById('pats-month').textContent = d.filter(p => isRealDate(p) && p.reg.startsWith(month)).length;

  },

  patFilter() {
    const q    = (document.getElementById('pat-search')?.value||'').toLowerCase();
    const src  = document.getElementById('pat-src-filter')?.value||'';
    const sort = document.getElementById('pat-sort')?.value||'newest';
    let d = [...this._patData];
    if(q)   d = d.filter(p => (p.id+p.name+p.phone+(p.address||'')+(p.country||'')).toLowerCase().includes(q));
    if(src) d = d.filter(p => (p.source||'').toLowerCase() === src.toLowerCase());
    if(sort === 'newest') d.sort((a,b) => (b.reg||'').localeCompare(a.reg||''));
    if(sort === 'oldest') d.sort((a,b) => (a.reg||'').localeCompare(b.reg||''));
    if(sort === 'name')   d.sort((a,b) => a.name.localeCompare(b.name));
    this._patFiltered = d;
    this._patPage = 0;
    this._renderPatTable();
  },

  _renderPatTable() {
    const tbody = document.getElementById('pat-tbody');
    const pager = document.getElementById('pat-pager');
    if(!tbody) return;
    const d = this._patFiltered, ps = this._patPageSize, pg = this._patPage;
    const slice = d.slice(pg*ps, (pg+1)*ps);
    const srcColor = s => {
      if(!s) return 'var(--text3)';
      const sl = s.toLowerCase();
      if(sl.includes('whatsapp')) return '#25d366';
      if(sl.includes('referral')) return 'var(--gold)';
      if(sl.includes('website'))  return '#4fc3f7';
      return 'var(--text3)';
    };
    if(!d.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:36px;color:var(--text3)">No patients match filter</td></tr>';
      return;
    }
    const isAdmin = this._staffRole === 'admin';
    tbody.innerHTML = slice.map(p => `
      <tr>
        <td style="text-align:center">${isAdmin?`<input type="checkbox" class="pat-row-chk" data-id="${p.id}" data-name="${p.name.replace(/"/g,'&quot;')}" data-phone="${p.phone}" onchange="QDC_staff._onPatCheck()" style="cursor:pointer;accent-color:#25d366">`:''}
        </td>
        <td><code style="font-size:.78rem;color:var(--gold);background:rgba(201,151,58,.08);padding:2px 7px">${p.id}</code></td>
        <td><strong style="color:var(--text)">${p.name}</strong>${p.address?'<div style="font-size:.72rem;color:var(--text3);margin-top:1px">📍 '+p.address+'</div>':''}</td>
        <td><a href="tel:${p.phone}" style="color:var(--text2);text-decoration:none">${p.phone}</a></td>
        <td style="color:var(--text3)">${p.age?p.age+'y':'—'}${p.gender?' · '+p.gender.charAt(0):''}</td>
        <td style="color:var(--text3);font-size:.78rem">${p.country||'—'}</td>
        <td><span style="color:${srcColor(p.source)};font-size:.78rem">${p.source||'—'}</span></td>
        <td style="color:var(--text3);font-size:.82rem">${p.reg||'—'}</td>
        <td style="color:var(--text3);font-size:.82rem">${p.lastVisit||'—'}</td>
        <td><div class="inv-actions">
          <button class="inv-act-btn" onclick="QDC_staff.viewPatient('${p.id}')">👁 View</button>
          <button class="inv-act-btn" onclick="QDC_staff.addToQueue('${p.id}','${p.name.replace(/'/g,'')}')">📋 Queue</button>
          <button class="inv-act-btn" onclick="window.open(location.origin+location.pathname+'?pid='+encodeURIComponent('${p.id}'),'_blank')" title='Open Portal in new tab'>📁 Portal</button>
        </div></td>
      </tr>`).join('');
    // Restore checked state
    document.querySelectorAll('.pat-row-chk').forEach(cb => {
      if(this._selectedPatIds && this._selectedPatIds.has(cb.dataset.id)) cb.checked = true;
    });
    const pages = Math.ceil(d.length/ps);
    if(pager) pager.innerHTML = pages <= 1 ? '' :
      Array.from({length:pages},(_,i) =>
        `<button class="inv-pg-btn${i===pg?' active':''}" onclick="QDC_staff._goPatPage(${i})">${i+1}</button>`
      ).join('');
  },

  _goPatPage(n) { this._patPage = n; this._renderPatTable(); },

  /* ── Patient checkbox selection ── */
  _selectedPatIds: new Set(),
  _onPatCheck() {
    document.querySelectorAll('.pat-row-chk').forEach(cb => {
      if(cb.checked) this._selectedPatIds.add(cb.dataset.id);
      else this._selectedPatIds.delete(cb.dataset.id);
    });
    const bar   = document.getElementById('pat-sel-bar');
    const count = document.getElementById('pat-sel-count');
    const n = this._selectedPatIds.size;
    if(bar) bar.style.display = n > 0 ? 'flex' : 'none';
    if(count) count.textContent = n + ' patient' + (n !== 1 ? 's' : '') + ' selected';
  },
  _toggleAllPat(checked) {
    document.querySelectorAll('.pat-row-chk').forEach(cb => {
      cb.checked = checked;
      if(checked) this._selectedPatIds.add(cb.dataset.id);
      else this._selectedPatIds.delete(cb.dataset.id);
    });
    this._onPatCheck();
  },
  _clearPatSelection() {
    this._selectedPatIds = new Set();
    document.querySelectorAll('.pat-row-chk').forEach(cb => cb.checked = false);
    const allChk = document.getElementById('pat-sel-all'); if(allChk) allChk.checked = false;
    const bar = document.getElementById('pat-sel-bar'); if(bar) bar.style.display = 'none';
  },
  _getSelectedPatients() {
    return (this._patData||[]).filter(p => this._selectedPatIds.has(p.id));
  },

  async viewPatient(id) {
    const p = this._patData.find(x => x.id === id);
    if(!p) return;
    const content = document.getElementById('pat-detail-content');
    if(!content) return;
    const lbl = (t) => `<div style="color:var(--text3);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">${t}</div>`;
    const cell = (t,v) => `<div>${lbl(t)}<span style="color:var(--text)">${v||'—'}</span></div>`;
    const fmt = n => '৳ ' + Math.round(Number(n)||0).toLocaleString();

    content.innerHTML = `
      <div class="qdc-modal-title" style="margin-bottom:4px">${p.name}</div>
      <div style="color:var(--gold);font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px">${p.id}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;font-size:.9rem">
        <div>${lbl('Phone')}<a href="tel:${p.phone}" style="color:var(--text);text-decoration:none">${p.phone}</a>
          <a href="https://wa.me/${(p.phone||'').replace(/\D/g,'')}?text=Hi+${encodeURIComponent(p.name)}," target="_blank" style="margin-left:8px;color:#25d366;font-size:.78rem">WA →</a></div>
        ${cell('Age / Gender', (p.age?p.age+'y':'')+((p.age&&p.gender)?' · ':'')+p.gender)}
        ${cell('Country', p.country)}
        ${cell('Source', p.source)}
        ${cell('Registered', p.reg)}
        ${cell('Last Visit', p.lastVisit)}
      </div>
      ${p.notes?`<div style="margin-top:14px;padding:12px 16px;background:var(--surface);border:1px solid var(--border)">${lbl('Notes')}<div style="color:var(--text2);font-size:.9rem">${p.notes}</div></div>`:''}
      <div id="pat-billing-section" style="margin-top:18px">
        <div style="color:var(--text3);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px">💳 Billing Summary</div>
        <div style="text-align:center;color:var(--text3);font-size:.82rem;padding:10px 0">⌛ Loading billing…</div>
      </div>
      <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">
        <button class="qdc-btn-primary" style="flex:1;min-width:120px" onclick="window.open(location.origin+location.pathname+'?pid='+encodeURIComponent('${p.id}'),'_blank');document.getElementById('patDetailOverlay').classList.remove('show')">📁 Open Portal</button>
        <button class="s-btn-sm" onclick="QDC_staff.addToQueue('${p.id}','${p.name.replace(/'/g,'')}');document.getElementById('patDetailOverlay').classList.remove('show')">📋 Queue</button>
        <a href="https://wa.me/${(p.phone||'').replace(/\D/g,'')}?text=Hi+${encodeURIComponent(p.name)},+this+is+Quick+Dental+Care." target="_blank" class="s-btn-sm" style="text-decoration:none">💬 WA</a>
      </div>`;
    document.getElementById('patDetailOverlay').classList.add('show');

    // Load billing — use cache if available (pre-warmed on login), else fetch
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(proxy){
        const cached = this._billingCache[p.id];
        const b = cached || await fetch(`${proxy}&action=getPatientSummary&patientId=${encodeURIComponent(p.id)}${QDC_staff._hipaaParams()}`).then(r=>r.json());
        const sec = document.getElementById('pat-billing-section');
        if(sec && b.ok){
          const vts = b.visitCount||0;
          const inv = b.invoices||[];
          sec.innerHTML = `
            <div style="color:var(--text3);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px">💳 Billing Summary</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center;margin-bottom:14px">
              <div style="background:var(--surface);border:1px solid var(--border);padding:10px 6px;border-radius:2px">
                <div style="font-size:1.2rem;font-weight:700;color:var(--gold)">${vts}</div>
                <div style="font-size:.68rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase">Visits</div>
              </div>
              <div style="background:var(--surface);border:1px solid var(--border);padding:10px 6px;border-radius:2px">
                <div style="font-size:1rem;font-weight:700;color:var(--text)">${fmt(b.totalInvoiced)}</div>
                <div style="font-size:.68rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase">Invoiced</div>
              </div>
              <div style="background:var(--surface);border:1px solid var(--border);padding:10px 6px;border-radius:2px">
                <div style="font-size:1rem;font-weight:700;color:#27ae60">${fmt(b.totalPaid)}</div>
                <div style="font-size:.68rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase">Paid</div>
              </div>
              <div style="background:var(--surface);border:1px solid var(--border);padding:10px 6px;border-radius:2px">
                <div style="font-size:1rem;font-weight:700;color:${Number(b.totalDue)>0?'var(--crimson)':'var(--text3)'}">${fmt(b.totalDue)}</div>
                <div style="font-size:.68rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase">Due</div>
              </div>
            </div>
            ${inv.length ? `<div style="font-size:.8rem">
              ${inv.slice(0,4).map(i=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
                <span style="color:var(--text3)">${i.date||'—'}</span>
                <span style="color:var(--text2);flex:1;padding:0 10px;font-size:.76rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${i.treatments||'—'}</span>
                <span style="color:var(--text);font-weight:600">${fmt(i.total)}</span>
                ${Number(i.due)>0?`<span style="color:var(--crimson);margin-left:8px;font-size:.74rem">-${fmt(i.due)} due</span>`:''}
              </div>`).join('')}
              ${inv.length>4?`<div style="color:var(--text3);font-size:.76rem;padding-top:6px">+${inv.length-4} more invoices</div>`:''}
            </div>` : '<div style="color:var(--text3);font-size:.82rem;padding:4px 0">No invoices on record.</div>'}`;
        }
      }
    } catch(e){ /* billing load failed silently */ }
  },

  addPatientModal() {
    ['padd-name','padd-phone','padd-age','padd-address','padd-complaint','padd-medhistory'].forEach(id => {
      const el=document.getElementById(id); if(el) el.value='';
    });
    ['padd-gender','padd-source'].forEach(id=>{ const el=document.getElementById(id); if(el) el.selectedIndex=0; });
    const m=document.getElementById('padd-msg'); if(m){m.textContent='';m.className='qdc-msg';}
    const b=document.getElementById('padd-save-btn'); if(b){b.textContent='Register Patient →';b.disabled=false;}
    document.getElementById('patAddOverlay').classList.add('show');
    setTimeout(()=>{ const n=document.getElementById('padd-name'); if(n) n.focus(); },150);
  },

  async saveNewPatient() {
    const name      = document.getElementById('padd-name')?.value.trim()||'';
    let _rawPhone = (document.getElementById('padd-phone')?.value||'').trim().replace(/[\s\-]/g,'');
    if(_rawPhone.startsWith('+880')) _rawPhone = '0' + _rawPhone.slice(4);
    else if(_rawPhone.startsWith('880') && _rawPhone.length>=13) _rawPhone = '0' + _rawPhone.slice(3);
    const phone = _rawPhone.startsWith('0') ? _rawPhone : '0' + _rawPhone;
    const age       = document.getElementById('padd-age')?.value.trim()||'';
    const gender    = document.getElementById('padd-gender')?.value||'';
    const address   = document.getElementById('padd-address')?.value.trim()||'';
    const complaint = document.getElementById('padd-complaint')?.value.trim()||'';
    const medHist   = document.getElementById('padd-medhistory')?.value.trim()||'';
    const source    = document.getElementById('padd-source')?.value||'Walk-in';
    const msg = document.getElementById('padd-msg');
    const btn = document.getElementById('padd-save-btn');
    if(!name){ msg.textContent='⚠ Full name is required.'; msg.className='qdc-msg err'; return; }
    if(phone.length<10){ msg.textContent='⚠ Valid phone number is required.'; msg.className='qdc-msg err'; return; }
    if(btn){ btn.textContent='⌛ Saving…'; btn.disabled=true; }
    msg.textContent=''; msg.className='qdc-msg';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(!proxy) throw new Error('Proxy not configured');
      const notes = [complaint, medHist].filter(Boolean).join(' | ');
      const params = new URLSearchParams({ action:'addPatient', name, phone, age, gender, address, notes, source });
      const resp = await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const data = await resp.json();
      if(!data.ok) throw new Error(data.error||'Save failed');
      const today = new Date().toISOString().slice(0,10);
      const newPat = { id:data.patientId, name, phone, age, gender, address, source, reg:today, lastVisit:'', notes };
      this._patData.unshift(newPat);
      document.getElementById('patAddOverlay').classList.remove('show');
      this._renderPatSummary();
      this.patFilter();
    } catch(err) {
      msg.textContent='⚠ Failed: '+err.message; msg.className='qdc-msg err';
      if(btn){ btn.textContent='Register Patient →'; btn.disabled=false; }
    }
  },

  exportPatientsCSV() {
    const rows = [['PatientID','Name','Phone','Age','Gender','Address','Source','Registered','Last Visit','Notes']];
    this._patFiltered.forEach(p => rows.push([p.id,p.name,p.phone,p.age,p.gender,p.country||'',p.address,p.source,p.reg,p.lastVisit,p.notes]));
    const csv = rows.map(r => r.map(c=>'"'+String(c||'').replace(/"/g,'""')+'"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = 'QDC_Patients_'+new Date().toISOString().slice(0,10)+'.csv';
    a.click();
  },

  addToQueue(pid, name) {
    this.tab('queue');
    setTimeout(()=>{
      const f = document.getElementById('add-queue-form');
      if(f) f.style.display='block';
      const ni = document.getElementById('q-name');
      if(ni && name){ ni.value = name; ni.dispatchEvent(new Event('input')); }
      const _pat = (QDC_staff._patData||[]).find(p=>(p.PatientID||p.id||'')===pid);
      QDC_staff._queueSelectedPat = {id:pid, name, phone:(_pat?.Phone||_pat?.phone||'')};
      // Pre-fill time with now
      const ti = document.getElementById('q-time');
      if(ti){ const n=new Date(); ti.value=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0'); }
    }, 200);
  },

  queueSearch(){
    const q = (document.getElementById('q-search')?.value||'').trim();
    const res = document.getElementById('q-search-results');
    if(q.length < 2){ if(res) res.style.display='none'; return; }
    const hits = (this._patData||[]).filter(p=>
      (p.name||'').toLowerCase().includes(q.toLowerCase())||
      (p.id||'').toLowerCase().includes(q.toLowerCase())
    ).slice(0,6);
    if(!hits.length||!res){ if(res) res.style.display='none'; return; }
    res.innerHTML = hits.map(p=>`
      <div onclick="QDC_staff.selectQueuePatient(${JSON.stringify(p).replace(/"/g,'&quot;')})"
        style="padding:9px 14px;cursor:pointer;border-bottom:1px solid var(--border);font-size:.86rem"
        onmouseover="this.style.background='var(--bg2)'" onmouseout="this.style.background=''">
        <span style="color:var(--cream)">${p.name}</span>
        <span style="color:var(--text3);margin-left:8px">${p.id}</span>
        <span style="color:var(--text3);margin-left:8px">${p.phone}</span>
      </div>`).join('');
    res.style.display='block';
  },

  selectQueuePatient(p){
    const ni = document.getElementById('q-name'); if(ni) ni.value = p.name||'';
    const si = document.getElementById('q-search'); if(si) si.value = p.name||'';
    const res = document.getElementById('q-search-results'); if(res) res.style.display='none';
    const ti = document.getElementById('q-time');
    if(ti && !ti.value){ const n=new Date(); ti.value=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0'); }
    // Store patient id+phone so submitQueue can save them to the queue row
    QDC_staff._queueSelectedPat = {id: p.id||p.PatientID||'', name: p.name||p.Name||'', phone: p.phone||p.Phone||''};
  },
  /* ── END PATIENT DATABASE ── */

  /* ── QUEUE ── */
  async _loadQueue(){
    const el = document.getElementById('queue-list');
    if(el) el.innerHTML = '<div class="empty-state"><span>⌛</span><p>Syncing with Sheets…</p></div>';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      let rows = [], apptPatientIds = new Set(), apptTimes = {};
      if(proxy){
        const today = new Date().toISOString().slice(0,10);
        // Fetch queue and today's appointments in parallel
        const [qRes, aRes] = await Promise.all([
          fetch(`${proxy}&action=getQueue&date=${encodeURIComponent(today)}${QDC_staff._hipaaParams()}`),
          fetch(`${proxy}&action=getAppointments&start=${today}&end=${today}${QDC_staff._hipaaParams()}`).catch(()=>null)
        ]);
        const d = await qRes.json();
        if(Array.isArray(d)) rows = d;
        else if(d && Array.isArray(d.rows)) rows = d.rows;
        else if(d && d.error) throw new Error(d.error);
        // Build appointment lookup
        if(aRes && aRes.ok){
          const aData = await aRes.json();
          if(Array.isArray(aData)) aData.forEach(a => {
            const pid = a.PatientID || a.patientId || '';
            const nm  = (a.Name || a.name || '').toLowerCase();
            if(pid) apptPatientIds.add(pid);
            if(nm)  apptPatientIds.add(nm);  // fallback by name
            const t = a.Time || a.time || '';
            if(pid) apptTimes[pid] = t;
            if(nm)  apptTimes[nm]  = t;
          });
        }
      }
      // ── Priority sort ──────────────────────────────────────────────────────
      // 1. In Chair (currently being seen)
      // 2. Appointment patients (sorted by appointment time)
      // 3. Walk-ins (sorted by arrival time)
      // 4. Done patients stay at bottom
      const statusOrder = { 'In Chair': 0, 'Waiting': 1, 'Missed': 2, 'Done': 3 };
      rows.sort((a, b) => {
        const aStatus = a.Status || a.status || 'Waiting';
        const bStatus = b.Status || b.status || 'Waiting';
        const aSO = statusOrder[aStatus] ?? 1;
        const bSO = statusOrder[bStatus] ?? 1;
        if(aSO !== bSO) return aSO - bSO;
        // Both same status — check appointment priority
        const aKey = a.PatientID || a.patientId || (a.Name||'').toLowerCase();
        const bKey = b.PatientID || b.patientId || (b.Name||'').toLowerCase();
        const aHas = apptPatientIds.has(aKey);
        const bHas = apptPatientIds.has(bKey);
        if(aHas && !bHas) return -1;
        if(!aHas && bHas) return  1;
        // Both have or both don't — sort by time
        const aTime = apptTimes[aKey] || a.Time || a.time || '99:99';
        const bTime = apptTimes[bKey] || b.Time || b.time || '99:99';
        return aTime.localeCompare(bTime);
      });
      // Annotate rows with appointment flag
      rows.forEach(r => {
        const key = r.PatientID || r.patientId || (r.Name||'').toLowerCase();
        r._hasAppt    = apptPatientIds.has(key);
        r._apptTime   = apptTimes[key] || '';
      });
      this._queueData = rows;
      this._renderQueue(rows);
    } catch(err){
      if(el) el.innerHTML = `<div class="empty-state"><span>⚠</span><p>Failed to load queue: ${err.message}</p></div>`;
    }
  },

  _renderQueue(rows){
    const el = document.getElementById('queue-list');
    if(!el) return;
    if(!rows.length){ el.innerHTML='<div class="empty-state"><span>🗂️</span><p>No patients in queue today. Click + Add Patient to start.</p></div>'; return; }
    const statusColor = {Waiting:'var(--gold)',Done:'#2ecc71','In Chair':'var(--crimson)',Missed:'var(--text3)'};
    // Count non-done for display numbering
    let visNum = 0;
    el.innerHTML = `<table style="width:100%;border-collapse:collapse">
      <thead><tr style="border-bottom:1px solid var(--border)">
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">#</th>
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">Patient</th>
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">Dept</th>
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">Time</th>
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">Status</th>
        <th style="text-align:left;padding:10px 12px;font-size:.72rem;letter-spacing:.1em;color:var(--text3);font-weight:400;text-transform:uppercase">Actions</th>
      </tr></thead>
      <tbody>${rows.map((r,i)=>{
        const st = r.Status||r.status||'Waiting';
        const isDone = st==='Done';
        if(!isDone) visNum++;
        const numDisp = isDone ? '—' : visNum;
        const apptBadge = r._hasAppt
          ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:.62rem;padding:1px 6px;background:rgba(18,81,170,.12);color:var(--blue3);border:1px solid rgba(18,81,170,.25);border-radius:2px;margin-left:4px">📅 Appt${r._apptTime?' '+r._apptTime:''}</span>`
          : '';
        const rowBg = r._hasAppt && st==='Waiting' ? 'background:rgba(18,81,170,.03);' : '';
        return `
        <tr style="border-bottom:1px solid var(--border);transition:background .15s;${rowBg}" onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background='${r._hasAppt&&st==='Waiting'?'rgba(18,81,170,.03)':''}'">
          <td style="padding:12px;font-size:.8rem;color:var(--text3);font-weight:${r._hasAppt?'600':'400'}">${numDisp}</td>
          <td style="padding:12px">
            <div style="font-weight:500;color:var(--text)">${r.Name||r.name||'—'}${apptBadge}</div>
            ${(r.PatientID||r.patientid)?`<div style="font-size:.7rem;color:var(--gold);margin-top:1px">${r.PatientID||r.patientid}</div>`:''}
            ${(r.Phone||r.phone)?`<div style="font-size:.72rem;color:var(--text3)">${r.Phone||r.phone}</div>`:''}
          </td>
          <td style="padding:12px;font-size:.82rem;color:var(--text2)">${r.Dept||r.dept||'General'}</td>
          <td style="padding:12px;font-size:.82rem;color:var(--text2)">${r.Time||r.time||'—'}</td>
          <td style="padding:12px"><span style="padding:3px 10px;font-size:.72rem;letter-spacing:.06em;border-radius:2px;background:${(statusColor[st]||'var(--text3)').replace(')',',').replace('var','rgba')||statusColor[st]+'22'||'rgba(200,200,200,.15)'};background:${statusColor[st]||'var(--text3)'}22;color:${statusColor[st]||'var(--text3)'};">${st}</span></td>
          <td style="padding:12px">
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${st!=='In Chair'?`<button class="s-btn-sm" onclick="QDC_staff.setQueueStatus(${i},'In Chair')">→ In Chair</button>`:''}
              ${st!=='Done'?`<button class="s-btn-sm" onclick="QDC_staff.setQueueStatus(${i},'Done')">✓ Done</button>`:''}
              ${st==='Done'?'<span style="font-size:.72rem;color:var(--open)">✓ Done</span>':''}
            </div>
          </td>
        </tr>`;
      }).join('')}
      </tbody></table>`;
  },

  async _autoAdvanceNext(){
    // Check automation flag
    const autoFlag = window.QDC_automation?._flags?.queue_auto_advance;
    if(autoFlag === false) return; // explicitly disabled
    const proxy = window.__QDC?.SHEETS_PROXY || '';
    if(!proxy) return;
    const next = (this._queueData||[]).find(p=>(p.Status||p.status||'').toLowerCase()==='waiting');
    if(!next) return;
    const nextName = next.Name||next.name||'';
    const nextDate = next.Date||next.date||new Date().toISOString().slice(0,10);
    // Step 1: Mark In Chair
    try {
      await fetch(`${proxy}&action=updateQueueStatus&name=${encodeURIComponent(nextName)}&date=${encodeURIComponent(nextDate)}&status=In Chair${QDC_staff._hipaaParams()}`);
      next.Status = 'In Chair'; next.status = 'In Chair';
      this._renderQueue(this._queueData);
    } catch(e){ console.error('[AutoAdvance] In Chair failed:', e); return; }
    // Step 2: Resolve phone
    const q2 = window.__QDC||{};
    let rawPhone = String(next.Phone||next.phone||'').replace(/\D/g,'');
    if (!rawPhone) {
      const pid = String(next.PatientID||next.patientid||'');
      if (pid) {
        const allPats = this._patData||[];
        const patRec = allPats.find(p=>(p.PatientID||p.id||'')===pid);
        rawPhone = String(patRec?.Phone||patRec?.phone||'').replace(/\D/g,'');
      }
    }
    // Step 3: Send WA
    if(rawPhone.length > 6){
      const norm = rawPhone.startsWith('0') ? '880'+rawPhone.slice(1) : rawPhone.startsWith('880') ? rawPhone : '880'+rawPhone;
      const waMsg = '\uD83E\uDDB7 *Quick Dental Care*\n\nDear '+nextName+', you are next! Please come to the reception now.\n\n\uD83D\uDCCD Akhalia, Sylhet';
      fetch((window.__QDC||{}).GREEN_API_BASE+'/sendMessage/'+(window.__QDC||{}).GREEN_API_TOKEN,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ chatId: norm+'@c.us', message: waMsg })
      }).catch(e=>console.error('[AutoAdvance] WA error:', e));
    }
    // Toast
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:calc(var(--tab-h) + 16px);left:50%;transform:translateX(-50%);background:#1a6fb5;color:#fff;padding:8px 18px;border-radius:20px;font-size:.8rem;z-index:9000;pointer-events:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    toast.textContent = '\uD83D\uDCE2 ' + nextName + ' called in';
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 3000);
    return nextName;
  },

  async setQueueStatus(idx, status){
    const rows = this._queueData || [];
    const row = rows[idx];
    if(!row) return;
    const name = row.Name||row.name||'';
    const date = row.Date||row.date||new Date().toISOString().slice(0,10);
    if(status === 'Done'){
      // Remove from local queue immediately
      this._queueData = rows.filter((_,i)=>i!==idx);
      this._renderQueue(this._queueData);
    } else {
      row.Status = status; row.status = status;
      this._renderQueue(rows);
    }
    // Sync to sheet
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy) return;
      await fetch(`${proxy}&action=updateQueueStatus&name=${encodeURIComponent(name)}&date=${encodeURIComponent(date)}&status=${encodeURIComponent(status)}${QDC_staff._hipaaParams()}`);

      // ── Auto-advance: when marked Done, call next Waiting patient ──
      if(status === 'Done'){
        this._autoAdvanceNext();
      }
    } catch(e){ console.error('setQueueStatus failed',e); }
  },

  addToQueueForm(){
    const f = document.getElementById('add-queue-form');
    if(!f) return;
    const show = f.style.display==='none' || f.style.display==='';
    f.style.display = show ? 'block' : 'none';
    if(show){
      const ti = document.getElementById('q-time');
      if(ti && !ti.value){ const n=new Date(); ti.value=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0'); }
      setTimeout(()=>{ const ni=document.getElementById('q-name'); if(ni) ni.focus(); },100);
    }
  },

  async submitQueue(){
    const name = document.getElementById('q-name')?.value.trim();
    const dept = document.getElementById('q-dept')?.value||'General';
    const time = document.getElementById('q-time')?.value;
    const msg  = document.getElementById('queue-msg');
    const date = new Date().toISOString().slice(0,10);
    if(!name){ if(msg){msg.textContent='Enter patient name.';msg.className='qdc-msg err';} return; }
    if(msg){ msg.textContent='Adding…'; msg.className='qdc-msg'; }
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(!proxy) throw new Error('Proxy not configured');
      // Get patientId/phone from search results if available
      const selPat = QDC_staff._queueSelectedPat || {};
      const params = new URLSearchParams({ action:'addQueue', name, dept, time:time||'', date,
        patientId: selPat.id||'', phone: selPat.phone||'' });
      QDC_staff._queueSelectedPat = null;
      const r = await fetch(`${proxy}&${params}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      if(!d.ok) throw new Error(d.error||'Failed');
      if(msg){msg.textContent='✓ Added to queue!';msg.className='qdc-msg ok';}
      ['q-name','q-search'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
      const qd=document.getElementById('q-dept'); if(qd) qd.value='';
      const qt=document.getElementById('q-time'); if(qt) qt.value='';
      document.getElementById('q-search-results').style.display='none';
      setTimeout(()=>this._loadQueue(), 800);
    } catch(e){ if(msg){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';} }
  },

  /* ── NOTES ── */
  async saveNotes(){
    const ta  = document.getElementById('shift-notes-area');
    const msg = document.getElementById('notes-msg');
    if(!ta) return;
    const text = ta.value;
    const key  = 'qdc_shift_notes_'+new Date().toISOString().slice(0,10);
    localStorage.setItem(key, text);
    // Also push to Sheets if proxy available
    try {
      const proxy = window.__QDC?.SHEETS_PROXY || '';
      if(proxy && !proxy.includes('YOUR_') && text.trim()){
        await fetch(`${proxy}&action=addNote&staffId=${encodeURIComponent(this._staffName||'staff')}&note=${encodeURIComponent(text)}&type=shift${QDC_staff._hipaaParams()}`);
      }
    } catch(e){ /* offline ok */ }
    if(msg){ msg.textContent='Notes saved ✓'; msg.className='qdc-msg ok'; setTimeout(()=>msg.textContent='',2500); }
  },

  /* ── SUPPLY REQUESTS (role-aware modal) ── */
  _reqData: [],
  _staffRole: 'staff',

  _applyRBAC(role){
    const allTabs = ['queue','calendar','upload','inventory','patients','notes','expenses',
                     'prescription','invoice','payroll','revenue','attendance','automation','seo',
                     'datamgmt','txplan','perio','lab','inbox','photos'];
    const access = {
      admin:   allTabs,
      manager: ['queue','calendar','upload','inventory','patients','notes','expenses',
                'invoice','payroll','revenue','attendance','txplan','lab','inbox'],
      doctor:  ['queue','calendar','upload','inventory','patients','notes','expenses',
                'prescription','txplan','perio','lab','photos'],
      staff:   ['queue','calendar','upload','inventory','patients','notes','expenses'],
    };
    const allowed = access[role] || access['staff'];
    allTabs.forEach(t=>{
      const el = document.getElementById('stab-'+t);
      if(!el) return;
      if(allowed.includes(t)){ el.classList.remove('rbac-hidden'); }
      else { el.classList.add('rbac-hidden'); }
    });
    // Hide/show buttons and elements tagged with rbac- classes
    const roleSet = { staff:1, doctor:1, manager:1, admin:1 };
    const hierarchy = { staff:0, doctor:1, manager:2, admin:3 };
    document.querySelectorAll('[class*="rbac-"]').forEach(el=>{
      // Gather which roles this element is visible for
      const visFor = [];
      if(el.classList.contains('rbac-staff'))   visFor.push('staff');
      if(el.classList.contains('rbac-doctor'))  visFor.push('doctor');
      if(el.classList.contains('rbac-manager')) visFor.push('manager');
      if(el.classList.contains('rbac-admin'))   visFor.push('admin');
      if(visFor.length === 0) return; // no rbac classes — skip
      // Skip tab buttons (handled above)
      if(el.id && el.id.startsWith('stab-')) return;
      if(visFor.includes(role)){
        el.classList.remove('rbac-hidden');
      } else {
        el.classList.add('rbac-hidden');
      }
    });
  },

  openRequestModal(){
    const isDoc = this._staffRole === 'doctor';
    const ds = document.getElementById('req-doctor-section');
    if(ds) ds.style.display = isDoc ? 'block' : 'none';
    const title = document.getElementById('req-modal-title');
    if(title) title.textContent = isDoc ? '📋 Request Supplies' : '📋 Supply Tasks';
    const sub = document.getElementById('req-modal-subtitle');
    if(sub) sub.textContent = isDoc
      ? 'Request items you need — staff will be notified on their next login.'
      : 'Doctor supply requests. Mark each as fulfilled once procured.';
    const lbl = document.getElementById('req-list-label');
    if(lbl) lbl.textContent = isDoc ? 'Your Requests' : 'Pending Tasks';
    this._populateReqDatalist();
    this._loadRequests();
    document.getElementById('supplyReqOverlay').classList.add('show');
  },

  toggleRequestPanel(){ this.openRequestModal(); },

  _populateReqDatalist(){
    const dl = document.getElementById('inv-req-datalist');
    if(dl) dl.innerHTML = (this._invData||[]).map(it=>`<option value="${it.name}">`).join('');
  },

  async _remindPendingTasks(){
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(!proxy||proxy.includes('YOUR_')) return;
      const r = await fetch(`${proxy}&action=getRequests${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      const n = (d.rows||[]).filter(x=>x.status!=='Fulfilled').length;
      if(!n) return;
      this._notifs = [{
        type:'warn', ico:'📋',
        text:`${n} supply task${n>1?'s':''} pending from doctor${n>1?'s':''}`,
        action:()=>this.openRequestModal()
      }, ...(this._notifs||[]).filter(x=>!x.text.includes('supply task'))];
      this._renderNotifs();
    } catch(e){}
  },

  async _loadRequests(){
    const el = document.getElementById('req-list');
    if(el) el.innerHTML='<div style="padding:20px;text-align:center;color:var(--text3);font-size:.85rem">⌛ Loading…</div>';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(!proxy||proxy.includes('YOUR_')){ this._renderRequests([]); return; }
      const r = await fetch(`${proxy}&action=getRequests${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      this._reqData = d.rows||[];
      this._renderRequests(this._reqData);
    } catch(e){
      if(el) el.innerHTML=`<div style="padding:16px;color:var(--crimson);font-size:.85rem">⚠ ${e.message}</div>`;
    }
  },

  _renderRequests(rows){
    const el = document.getElementById('req-list');
    if(!el) return;
    const isDoc = this._staffRole === 'doctor';
    const pending = rows.filter(r=>r.status!=='Fulfilled');
    if(!pending.length){
      el.innerHTML=`<div class="empty-state" style="padding:24px 0"><span>${isDoc?'✅':'🎉'}</span><p style="font-size:.85rem">${isDoc?'No active requests.':'All tasks completed!'}</p></div>`;
      return;
    }
    const pc = {urgent:'#e74c3c',normal:'var(--gold)',low:'var(--text3)'};
    el.innerHTML = pending.map(r=>`
      <div style="display:flex;align-items:flex-start;gap:12px;padding:13px 0;border-bottom:1px solid var(--border)">
        <div style="width:9px;height:9px;border-radius:50%;margin-top:6px;flex-shrink:0;background:${pc[r.priority||'normal']}"></div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;color:var(--text1)">${r.item||'—'}</div>
          <div style="font-size:.78rem;color:var(--text3);margin-top:3px">${r.qty||''} ${r.unit||''} · by <span style="color:var(--gold)">${r.requestedby||'doctor'}</span> · ${(r.createdat||'').slice(0,10)}</div>
          ${r.notes?`<div style="font-size:.79rem;color:var(--text2);margin-top:4px;font-style:italic">"${r.notes}"</div>`:''}
        </div>
        <span style="font-size:.68rem;padding:2px 7px;background:${pc[r.priority||'normal']}22;color:${pc[r.priority||'normal']};letter-spacing:.05em;align-self:flex-start;flex-shrink:0">${(r.priority||'normal').toUpperCase()}</span>
        ${!isDoc?`<button class="s-btn-sm" onclick="QDC_staff.fulfillRequest('${r.reqid}')" style="align-self:flex-start;flex-shrink:0">✓ Done</button>`:''}
      </div>`).join('');
  },

  async submitRequest(){
    const item=document.getElementById('req-item')?.value.trim();
    const qty=document.getElementById('req-qty')?.value.trim();
    const unit=document.getElementById('req-unit')?.value.trim();
    const priority=document.getElementById('req-priority')?.value||'normal';
    const notes=document.getElementById('req-notes')?.value.trim();
    const msg=document.getElementById('req-msg');
    const btn=document.getElementById('req-submit-txt');
    if(!item||!qty){msg.textContent='⚠ Item and quantity required.';msg.className='qdc-msg err';return;}
    if(btn) btn.innerHTML='<span class="qdcspinner"></span>';
    msg.className='qdc-msg'; msg.textContent='';
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      if(proxy&&!proxy.includes('YOUR_')){
        const r=await fetch(`${proxy}&action=addRequest&item=${encodeURIComponent(item)}&qty=${encodeURIComponent(qty)}&unit=${encodeURIComponent(unit||'pcs')}&priority=${encodeURIComponent(priority)}&notes=${encodeURIComponent(notes||'')}&staffId=${encodeURIComponent(this._staffName||'doctor')}${QDC_staff._hipaaParams()}`);
        const d=await r.json(); if(!d.ok) throw new Error(d.error);
      }
      msg.textContent=`✅ Requested: ${qty} × ${item}`; msg.className='qdc-msg ok';
      ['req-item','req-qty','req-unit','req-notes'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
      document.getElementById('req-priority').value='normal';
      if(btn) btn.textContent='Submit Request →';
      setTimeout(()=>this._loadRequests(),600);
    } catch(e){msg.textContent='⚠ '+e.message;msg.className='qdc-msg err';if(btn)btn.textContent='Submit Request →';}
  },

  async fulfillRequest(reqId){
    try {
      const proxy=window.__QDC?.SHEETS_PROXY||'';
      if(proxy&&!proxy.includes('YOUR_')){
        const r=await fetch(`${proxy}&action=updateRequest&reqId=${encodeURIComponent(reqId)}&status=Fulfilled&staffId=${encodeURIComponent(this._staffName||'staff')}${QDC_staff._hipaaParams()}`);
        const d=await r.json(); if(!d.ok) throw new Error(d.error);
      }
      this._reqData=(this._reqData||[]).map(r=>r.reqid===reqId?{...r,status:'Fulfilled'}:r);
      this._renderRequests(this._reqData);
    } catch(e){alert('Error: '+e.message);}
  },

  /* ── UPLOAD PATIENT SEARCH ── */
  _uploadTimer: null,
  _uploadType: 'prescription',
  _uploadFiles: [],

  triggerUpload(type){
    this._uploadType = type || 'prescription';
    // Update file input accept based on type
    const fi = document.getElementById('staffFileInput');
    if(fi){
      if(type==='xray') fi.accept='.jpg,.jpeg,.png,.dcm,.dicom,.pdf';
      else if(type==='scan') fi.accept='.stl,.obj,.glb,.gltf,.pdf';
      else fi.accept='.pdf';
    }
    const inp = document.getElementById('staffFileInput');
    if(!inp) return;
    // Set accept based on type
    inp.accept = type === 'scan'
      ? '.stl,.obj,.glb,.gltf,.ply,.dcm,.zip'
      : '.pdf,.jpg,.jpeg,.png,.webp';
    inp.value = ''; // reset so same file can be re-selected
    inp.click();
  },

  uploadFiles(input){
    const files = Array.from(input.files || []);
    if(!files.length) return;
    this._uploadFiles = files;
    const pid = this._uploadTargetUid;
    if(!pid){ alert('Please select a patient first.'); return; }

    const labels={'scan':'3D Scan','xray':'X-Ray','prescription':'Prescription'};
    const typeLabel = labels[this._uploadType]||'Prescription';
    const patName = document.getElementById('upload-target-name')?.textContent || pid;

    // Build file preview list
    const listHtml = files.map((f,i) => {
      const kb = (f.size/1024).toFixed(1);
      const icon = f.name.endsWith('.pdf') ? '📄' :
                   f.name.match(/\.(jpg|jpeg|png|webp)$/i) ? '🖼️' : '🦷';
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--bg2);border:1px solid var(--border)">
        <span style="font-size:1.4rem">${icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:500;color:var(--text1);font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</div>
          <div style="font-size:.74rem;color:var(--text3);margin-top:2px">${kb} KB · ${typeLabel}</div>
        </div>
        <button onclick="QDC_staff._removeUploadFile(${i})" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:1.1rem;padding:4px">✕</button>
      </div>`;
    }).join('');

    // Populate and open modal
    const icons={'scan':'🦷','xray':'🩻','prescription':'📄'};
    document.getElementById('upld-icon').textContent = icons[this._uploadType]||'📄';
    document.getElementById('upld-title').textContent = `Upload ${typeLabel}`;
    document.getElementById('upld-subtitle').textContent = `Uploading to: ${patName}`;
    document.getElementById('upld-file-list').innerHTML = listHtml;
    document.getElementById('upld-progress-wrap').style.display = 'none';
    document.getElementById('upld-links').style.display = 'none';
    document.getElementById('upld-actions').style.display = 'flex';
    (document.getElementById('upld-confirm-txt')||document.querySelector('[data-role="upld-confirm-txt"]')).textContent = `Upload ${files.length} File${files.length>1?'s':''} →`;
    document.getElementById('upld-msg').textContent = '';
    document.getElementById('uploadProgressOverlay').classList.add('show');
  },

  _removeUploadFile(i){
    this._uploadFiles.splice(i, 1);
    if(!this._uploadFiles.length){ this.closeUploadModal(); return; }
    // Rebuild list
    const tmp = [...this._uploadFiles];
    this._uploadFiles = tmp;
    this.uploadFiles({ files: tmp });
  },

  async doUpload(){
    const files = this._uploadFiles;
    const pid = this._uploadTargetUid;
    if(!files.length || !pid) return;

    const btn = (document.getElementById('upld-confirm-btn')||document.querySelector('[data-role="upld-confirm"]'));
    const msg = document.getElementById('upld-msg');
    const bar = document.getElementById('upld-progress-bar');
    const barTxt = document.getElementById('upld-progress-txt');
    const progressWrap = document.getElementById('upld-progress-wrap');
    const linksList = document.getElementById('upld-links-list');
    const linksBox = document.getElementById('upld-links');
    const actions = document.getElementById('upld-actions');

    btn.disabled = true;
    (document.getElementById('upld-confirm-txt')||document.querySelector('[data-role="upld-confirm-txt"]')).innerHTML = '<span class="qdcspinner"></span> Uploading…';
    progressWrap.style.display = 'block';
    msg.textContent = '';
    msg.className = 'qdc-msg';

    const proxy = window.__QDC?.SHEETS_PROXY || '';
    const results = [];

    for(let i = 0; i < files.length; i++){
      const f = files[i];
      const pct = Math.round((i / files.length) * 100);
      bar.style.width = pct + '%';
      barTxt.textContent = `${pct}% — uploading ${f.name}`;

      try {
        // Convert to base64
        const b64 = await new Promise((res, rej) => {
          const rd = new FileReader();
          rd.onload = () => res(rd.result.split(',')[1]);
          rd.onerror = rej;
          rd.readAsDataURL(f);
        });

        if(proxy && !proxy.includes('YOUR_')){
          const _ufBody = {
            action: 'uploadFile',
            patientId: pid,
            filename: f.name,
            fileType: this._uploadType,
            mimeType: f.type || 'application/octet-stream',
            data: b64
          };
          if (window._IS_LOCAL) _ufBody._psec = '2BorNOT2BTHATISTHE?';
          if (window.QDC_staff && QDC_staff._staffId) {
            _ufBody._sid = QDC_staff._staffId;
            _ufBody._role = QDC_staff._staffRole || '';
          }
          const resp = await fetch(proxy, {
            method: 'POST',
            headers: {'Content-Type':'text/plain'},
            body: JSON.stringify(_ufBody)
          });
          const d = await resp.json();
          if(d.ok && d.url){
            results.push({ name: f.name, url: d.url, ok: true });
          } else {
            results.push({ name: f.name, error: d.error || 'Upload failed', ok: false });
          }
        } else {
          // No proxy configured — store locally as data URL and generate a fake local link
          results.push({ name: f.name, url: null, ok: false, error: 'Sheets proxy not configured. File ready but not saved to Drive.' });
        }
      } catch(e){
        results.push({ name: f.name, error: e.message, ok: false });
      }
    }

    bar.style.width = '100%';
    barTxt.textContent = 'Complete';

    // Show results
    const succeeded = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);

    if(succeeded.length){
      linksBox.style.display = 'block';
      linksList.innerHTML = succeeded.map(r => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
          <span style="color:var(--open)">✅</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.84rem;color:var(--text1);overflow:hidden;text-overflow:ellipsis">${r.name}</div>
            <a href="${r.url}" target="_blank" style="font-size:.74rem;color:var(--gold);word-break:break-all">${r.url}</a>
          </div>
          <button onclick="navigator.clipboard.writeText('${r.url}')" class="s-btn-sm" style="flex-shrink:0">Copy</button>
        </div>`).join('');

      // Send link to patient via WhatsApp through proxy
      if(succeeded.length > 0){
        const patPhone = this._patData?.find(p => p.id === pid)?.phone || '';
        const patName  = this._patData?.find(p => p.id === pid)?.name  || 'Patient';
        if(patPhone && patPhone !== '—'){
          const linksText = succeeded.map(r => `• ${r.name}\n  ${r.url}`).join('\n');
          const fileWord  = this._uploadType === 'scan' ? '3D Scan' : 'Prescription';
          const waMsg = `🦷 *Quick Dental Care — ${fileWord} Ready*\n\nDear ${patName},\n\nYour ${fileWord.toLowerCase()}${succeeded.length>1?'s have':' has'} been saved to your patient record:\n\n${linksText}\n\nPatient ID: ${pid}\n📍 Akhalia, Sylhet | ☎ +88 01307978439`;
          const waP = new URLSearchParams({ action:'sendWhatsApp', phone: patPhone, message: waMsg });
          fetch(`${window.__QDC.SHEETS_PROXY}&${waP}${QDC_staff._hipaaParams()}`).catch(()=>{});
        }
      }
    }

    if(failed.length){
      msg.textContent = `⚠ ${failed.length} file(s) failed: ${failed.map(r=>r.error).join('; ')}`;
      msg.className = 'qdc-msg err';
    }

    if(succeeded.length){
      msg.textContent = `✅ ${succeeded.length} file${succeeded.length>1?'s':''} uploaded successfully.`;
      msg.className = 'qdc-msg ok';
    }

    // Update action button
    btn.disabled = false;
    actions.innerHTML = `<button class="s-btn-sm" onclick="QDC_staff.closeUploadModal()" style="width:100%">Close</button>`;
    (document.getElementById('upld-confirm-txt')||document.querySelector('[data-role="upld-confirm-txt"]')).textContent = 'Done';
  },

  closeUploadModal(){
    document.getElementById('uploadProgressOverlay').classList.remove('show');
    this._uploadFiles = [];
    // Reset progress
    const bar = document.getElementById('upld-progress-bar');
    if(bar) bar.style.width = '0%';
    const actions = document.getElementById('upld-actions');
    if(actions) actions.innerHTML = `
      <button class="qdc-btn-primary" data-role="upld-confirm" onclick="QDC_staff.doUpload()" style="flex:1">
        <span data-role="upld-confirm-txt">Upload Now →</span>
      </button>
      <button class="s-btn-sm" onclick="QDC_staff.closeUploadModal()">Cancel</button>`;
  },

  /* ── UPLOAD PATIENT SEARCH ── */
  _uploadTimer: null,
  searchForUpload(){
    clearTimeout(this._uploadTimer);
    const q=document.getElementById('upload-search-input')?.value.trim();
    const res=document.getElementById('upload-search-results');
    if(!q||q.length<2){if(res)res.style.display='none';return;}
    this._uploadTimer=setTimeout(async ()=>{
      const sp=document.getElementById('upload-search-spinner');
      if(sp)sp.style.display='inline';
      try {
        let hits = [];
        const ql=q.toLowerCase();
        const qPhone=q.replace(/\D/g,'');

        if(this._patData&&this._patData.length){
          // Local search from cached patient data
          hits=this._patData.filter(p=>{
            if((p.name||'').toLowerCase().includes(ql)) return true;
            if((p.id||'').toLowerCase().includes(ql)) return true;
            if(qPhone.length>=3 && (p.phone||'').replace(/\D/g,'').includes(qPhone)) return true;
            return false;
          }).slice(0,8);
        } else {
          // Live API search as fallback
          const proxy=window.__QDC?.SHEETS_PROXY||'';
          if(proxy&&!proxy.includes('YOUR_')){
            const r=await fetch(`${proxy}&action=searchPatient&q=${encodeURIComponent(q)}${QDC_staff._hipaaParams()}`);
            const d=await r.json();
            const _rows = Array.isArray(d) ? d : (d.rows||[]);
            hits=_rows.slice(0,8).map(p=>({
              id:p.PatientID||p.patientid||p.id||'',
              name:p.Name||p.name||'',
              phone:p.Phone||p.phone||''
            }));
          }
        }
        if(sp)sp.style.display='none';
        if(!res)return;
        if(!hits.length){
          res.style.display='block';
          res.innerHTML=`<div style="padding:12px 16px;font-size:.84rem;color:var(--text3)">No patients found for "${q}"</div>`;
          return;
        }
        res.style.display='block';
        res.innerHTML=hits.map(p=>`
          <div onclick="QDC_staff.selectUploadPatient('${p.id}','${(p.name||'').replace(/'/g,"\\'")}','${p.phone||''}')"
            style="padding:11px 16px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:center"
            onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
            <div style="width:34px;height:34px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0">👤</div>
            <div>
              <div style="font-weight:500;color:var(--text1);font-size:.9rem">${p.name||'—'}</div>
              <div style="font-size:.75rem;color:var(--text3);margin-top:2px">${p.id||''} · ${p.phone||''}</div>
            </div>
          </div>`).join('');
      } catch(e){
        if(sp)sp.style.display='none';
        if(res){res.style.display='block';res.innerHTML=`<div style="padding:12px 16px;font-size:.84rem;color:var(--crimson)">⚠ Search failed: ${e.message}</div>`;}
      }
    },280);
  },
  selectUploadPatient(pid,name,phone){
    const inp=document.getElementById('upload-search-input');if(inp)inp.value=name;
    const res=document.getElementById('upload-search-results');if(res)res.style.display='none';
    const info=document.getElementById('upload-patient-info');
    if(info)info.innerHTML=`
      <div style="display:flex;align-items:center;gap:14px;background:var(--surface);border:1px solid var(--border);padding:14px 16px">
        <div style="font-size:1.5rem">👤</div>
        <div style="flex:1">
          <div style="font-weight:600;color:var(--text1)">${name}</div>
          <div style="font-size:.78rem;color:var(--gold);margin-top:2px">${pid}</div>
          <div style="font-size:.76rem;color:var(--text3)">${phone}</div>
        </div>
        <button class="s-btn-sm" onclick="QDC_staff._clearUploadSearch()">✕</button>
      </div>`;
    const tn=document.getElementById('upload-target-name');if(tn)tn.textContent=`${name} (${pid})`;
    this._uploadTargetUid=pid;
    const area=document.getElementById('upload-area');if(area)area.style.display='block';
  },
  _clearUploadSearch(){
    const inp=document.getElementById('upload-search-input');if(inp)inp.value='';
    const info=document.getElementById('upload-patient-info');if(info)info.innerHTML='';
    const area=document.getElementById('upload-area');if(area)area.style.display='none';
    this._uploadTargetUid=null;
  },

  async refresh(){
    // Set date label
    const dl = document.getElementById('queue-date-lbl');
    if(dl) dl.textContent = new Date().toLocaleDateString('en-BD',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    await Promise.all([this._loadQueue(), this._loadInventory()]);
    // Patient data loaded on-demand (click Sync) to save bandwidth
    // Load shift notes
    const saved = localStorage.getItem('qdc_shift_notes_'+new Date().toISOString().slice(0,10));
    const ta = document.getElementById('shift-notes-area');
    if(ta && saved) ta.value = saved;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════════════════════════
(async ()=>{
  await waitQDC();

  // ── Patient portal deep-link: ?pid=QDC-XXXX ─────────────────────────────
  // When staff clicks Portal from the patient list, this page opens with ?pid=
  // We bypass ALL auth (no Firebase, no OTP) and show the portal directly.
  const _urlPid = new URLSearchParams(location.search).get('pid');
  if(_urlPid){
    // Open portal immediately with the pid, load name in background
    document.getElementById('portal-view').style.cssText =
      'display:block!important;position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto';
    // Start loading files immediately — don't wait for name lookup
    QDC_portal._loadFiles(_urlPid, '');
    // Load name in background and update the display once fetched
    (async () => {
      try {
        const _proxy = window.__QDC?.SHEETS_PROXY||'';
        if(_proxy){
          const _res = await fetch(`${_proxy}&action=searchPatient&q=${encodeURIComponent(_urlPid)}`);
          const _pts = await _res.json();
          const _pt  = Array.isArray(_pts) && _pts.length ? _pts[0] : null;
          const _name = _pt ? (_pt.Name||_pt.name||'Patient') : 'Patient';
          const pidEl = document.getElementById('portal-pid');
          const nameEl = document.getElementById('portal-patient-name');
          if(pidEl)  pidEl.textContent  = _urlPid;
          if(nameEl) nameEl.textContent = _name;
        }
      } catch(e){ /* name lookup failed, pid still shown */ }
    })();
    return; // Don't run normal boot path
  }

  // ── Normal boot ─────────────────────────────────────────────────────────
  QDC_auth.init();
  if(location.hash==='#staff') QDC_staff.open();

  window.addEventListener('popstate', ()=>{
    document.getElementById('portal-view').classList.remove('show');
    document.getElementById('staff-view').classList.remove('show');
  });
})();

// ═══════════════════════════════════════════════════════════════════════════════
//  INVOICE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
window.QDC_invoice = {
  _patient: null,
  _lines: [],
  _discount: 0,

  // Price lookup from QDC price list (PDF)
  _prices: {
    'Consultation': 600,
    'Root Canal Treatment Manual': 4500,
    'Root Canal Treatment Endo Motor': 6000,
    'Anterior Root Canal Manual': 4000,
    'Anterior Root Canal Endo Motor': 5000,
    '3rd Molar Root Canal Treatment': 5500,
    'Re-Root Canal Treatment (Re-RCT)': 7000,
    'Composite Filling Regular': 2000,
    'Composite Filling Special': 2500,
    'Diastema Closure': 8000,
    'GI Filling': 1500,
    'Temporary Filling': 500,
    'Black Triangle Filling (lower)': 6000,
    'Flowable Injection Mould Technique (Upper)': 30000,
    'Scaling + Polishing': 2500,
    'Whitening with Air Abrasion': 17000,
    'Whitening with Scaling Polishing': 14000,
    'Whitening without Scaling Polishing': 12000,
    'Gum Therapy': 5000,
    'Regular Crown': 5000,
    'Special Crown': 6000,
    'Golden Crown Regular': 10000,
    'Golden Crown Special': 15000,
    'Zirconia Crown': 18500,
    'Composite Veneer': 6000,
    'Zirconia Veneer': 14000,
    'E-Max Veneer': 24000,
    'Emergency Charge for Zirconia Crown': 5000,
    'Emergency Charge for PFM Crown': 2000,
    'Dental Scan': 30000,
    'Normal Extraction': 1500,
    'Upper 3rd Molar Extraction': 2000,
    'Mobile Tooth Extraction': 500,
    'Grinding': 500,
    'Crown Setting': 1000,
    'Tooth Build-up': 1000,
    'Composite Bonding after-RCT': 5000,
    'Operculectomy': 2500,
    'Incision & Drainage': 3000,
    'Surgical Extraction': 6000,
    'Cyst Enucleation': 10000,
    'Arch Bar Wiring': 12000,
    'Mucocele': 10000,
    'Eupils': 10000,
    'Acrylic Denture Self Cure': 1000,
    'Acrylic Denture Heat Cure': 2500,
    'Flexible Denture': 6000,
    'Complete Denture Heat Cure': 50000,
    'Complete Denture Heat Cure Single Jaw': 30000,
    'Complete Denture Self Cure': 30000,
    'Complete Denture Self Cure Single Jaw': 20000,
    'Complete Denture Soft Liner': 90000,
    'Complete Denture Soft Liner Single Jaw': 50000,
    'Spacing Normal Occlusion (Braces)': 80000,
    'Spacing Malocclusion Posterior (Braces)': 90000,
    'Crowding Extraction (Braces)': 120000,
    'Crowding Non Extraction (Braces)': 100000,
    'Crowding Severe (Braces)': 150000,
    'Clear Retainer 1st': 9000,
    'Next Retainer': 17000,
    'Invisalign': 180000,
    'Implant': 70000,
    'Immediate Implant with Zirconia Crown': 85000,
    'Dental Scan for Invisalign': 6000,
    'SDF': 1500,
    'Light Cure GI': 1500,
    'Pulpectomy': 3000,
    'Deciduous Extraction': 500,
    'S.S Crown': 2000,
    'LSTR with TF': 600,
    'Regular GI': 1000,
  },

  _autoFillCost(name){
    const price = this._prices[name];
    const costEl = document.getElementById('inv-treat-cost');
    if(!costEl) return;
    if(price){
      costEl.value = price;
    } else if(!name.trim()) {
      costEl.value = '';
    }
    // If name typed but not in price list, leave cost as-is for manual entry
  },

  searchPatient(){
    const q = document.getElementById('inv-pat-search').value.trim();
    if(q.length < 2){ document.getElementById('inv-pat-results').style.display='none'; return; }
    const results = document.getElementById('inv-pat-results');
    const data = (QDC_staff._patData||[]).filter(p=>
      (p.name||'').toLowerCase().includes(q.toLowerCase()) ||
      (p.id||'').toLowerCase().includes(q.toLowerCase()) ||
      (p.phone||'').includes(q)
    ).slice(0,8);
    if(!data.length){ results.innerHTML='<div style="padding:12px 16px;color:var(--text3);font-size:.88rem">No patients found</div>'; results.style.display='block'; return; }
    results.innerHTML = data.map(p=>`
      <div onclick="QDC_invoice.selectPatient(${JSON.stringify(p).replace(/"/g,'&quot;')})"
        style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s"
        onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
        <span style="color:var(--cream);font-weight:500">${p.name||'—'}</span>
        <span style="color:var(--text3);font-size:.82rem;margin-left:10px">${p.id||''}</span>
        <span style="color:var(--text3);font-size:.82rem;margin-left:8px">${p.phone||''}</span>
      </div>`).join('');
    results.style.display='block';
  },

  selectPatient(p){
    this._patient = p;
    document.getElementById('inv-pat-results').style.display='none';
    document.getElementById('inv-pat-search').value = p.name||'';
    document.getElementById('inv-pat-selected').innerHTML = `
      <div style="background:rgba(201,151,58,.07);border:1px solid var(--border2);padding:10px 14px;display:flex;gap:14px;flex-wrap:wrap;font-size:.88rem">
        <span style="color:var(--gold)">✓ Selected:</span>
        <span style="color:var(--cream)">${p.name||'—'}</span>
        <span style="color:var(--text3)">${p.id||''}</span>
        <span style="color:var(--text3)">${p.phone||''}</span>
      </div>`;
  },

  addTreatment(){
    const name = document.getElementById('inv-treat-name').value.trim();
    const cost = parseFloat(document.getElementById('inv-treat-cost').value)||0;
    if(!name){ document.getElementById('inv-msg').textContent='Enter treatment name.'; document.getElementById('inv-msg').className='qdc-msg err'; return; }
    this._lines.push({ name, cost });
    document.getElementById('inv-treat-name').value='';
    document.getElementById('inv-treat-cost').value='';
    document.getElementById('inv-msg').textContent='';
    this._renderLines();
    this._calc();
  },

  removeLine(i){
    this._lines.splice(i,1);
    this._renderLines();
    this._calc();
  },

  _renderLines(){
    const tbody = document.getElementById('inv-line-tbody');
    const wrap  = document.getElementById('inv-line-wrap');
    if(!this._lines.length){ wrap.style.display='none'; tbody.innerHTML=''; return; }
    wrap.style.display='block';
    tbody.innerHTML = this._lines.map((l,i)=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:9px 10px;color:var(--text3);font-size:.85rem">${i+1}</td>
        <td style="padding:9px 10px;color:var(--cream)">${l.name}</td>
        <td style="padding:9px 10px;text-align:right;color:var(--gold)">৳ ${l.cost.toLocaleString()}</td>
        <td style="padding:9px 10px;text-align:center">
          <button onclick="QDC_invoice.removeLine(${i})" style="background:none;border:none;color:var(--crimson);cursor:pointer;font-size:.9rem">✕</button>
        </td>
      </tr>`).join('');
  },

  setDiscount(pct){
    this._discount = Math.max(0, Math.min(100, pct));
    document.getElementById('disc-custom').value = pct;
    [0,5,10,15,20,25].forEach(v=>{
      const b = document.getElementById(`disc-${v}`);
      if(b) b.style.background = v===pct ? 'var(--gold)' : '';
      if(b) b.style.color      = v===pct ? 'var(--bg)'   : '';
    });
    this._calc();
  },

  _calc(){
    const sub  = this._lines.reduce((s,l)=>s+l.cost,0);
    const disc = Math.round(sub * this._discount / 100);
    const total= sub - disc;
    const paid = parseFloat(document.getElementById('inv-paid').value)||0;
    const due  = Math.max(0, total - paid);
    document.getElementById('inv-subtotal').textContent = `৳ ${sub.toLocaleString()}`;
    document.getElementById('inv-discount').textContent = `— ৳ ${disc.toLocaleString()}`;
    document.getElementById('inv-disc-pct').textContent = this._discount;
    document.getElementById('inv-total').textContent    = `৳ ${total.toLocaleString()}`;
    document.getElementById('inv-due').textContent      = `৳ ${due.toLocaleString()}`;
    return { sub, disc, total, paid, due };
  },

  calcDue(){ this._calc(); },

  async downloadPDF(){
    if(!this._lines.length){ const m=document.getElementById('inv-msg'); m.textContent='Add at least one treatment.'; m.className='qdc-msg err'; return; }
    const { sub, disc, total, paid, due } = this._calc();
    const pat   = this._patient || { name:'—', id:'—', phone:'—' };
    const now   = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth()+1}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const m = document.getElementById('inv-msg');
    // Save to server FIRST — get sequential INV-YYYY-NNNN ref for the PDF
    let invNum = '';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(proxy && m){ m.textContent='⌛ Saving & generating invoice…'; m.className='qdc-msg'; }
      if(proxy){
        const p2 = new URLSearchParams({ action:'addInvoice',
          patientId:pat.id||'—', name:pat.name||'—', phone:pat.phone||'—',
          date:now.toISOString(), treatments:this._lines.map(l=>l.name).join(' | '),
          subtotal:sub, discount:disc, total, paid, due, discountPct:this._discount });
        const resp2 = await fetch(`${proxy}&${p2}${QDC_staff._hipaaParams()}`);
        const d2 = await resp2.json();
        invNum = d2.invoiceRef || '';
        // ── Auto-send WhatsApp invoice summary to patient ──────────────────────
        if(pat.phone && pat.phone !== '—'){
          const rawPh = String(pat.phone||'').replace(/\D/g,'');
          const normPh = rawPh.startsWith('0') ? '880'+rawPh.slice(1) : rawPh.startsWith('880') ? rawPh : '880'+rawPh;
          const txList = this._lines.map(l=>`  • ${l.name}: ৳${l.cost.toLocaleString()}`).join('\n');
          const invMsg = `🦷 *Quick Dental Care — Invoice*\n\n` +
            `Dear ${pat.name},\n\n` +
            `Thank you for your visit. Here is your invoice summary:\n\n` +
            `*Invoice:* ${invNum}\n` +
            `*Date:* ${dateStr}\n\n` +
            `*Treatments:*\n${txList}\n\n` +
            `*Total:* ৳${total.toLocaleString()}\n` +
            `*Paid:* ৳${paid.toLocaleString()}\n` +
            `*Due:* ৳${due.toLocaleString()}\n\n` +
            (due > 0 ? `⚠ Please settle the remaining balance at your earliest convenience.\n\n` : `✅ Invoice fully paid — thank you!\n\n`) +
            `📍 Quick Dental Care, Akhalia, Sylhet\n` +
            `☎ +88 01307978439\n` +
            `🔗 sylhetdental.com`;
          const waP = new URLSearchParams({ action:'sendWhatsApp', phone:normPh, message:invMsg });
          fetch(`${proxy}&${waP}${QDC_staff._hipaaParams()}`).catch(()=>{});
        }
      }
    } catch(e){ /* fall back */ }
    if(!invNum) invNum = 'INV-'+new Date().getFullYear()+'-'+String(Date.now()).slice(-4);

    // Barcode digits from patient id
    const bcNum = (pat.id||'0000').replace(/\D/g,'').slice(-4).padStart(4,'0');

    const rows = this._lines.map((l,i)=>`
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#333">${i+1}. ${l.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;color:#333">৳ ${l.cost.toLocaleString()}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Invoice — Quick Dental Care</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;background:#fff;color:#333;font-size:14px}
      .page{max-width:680px;margin:0 auto;padding:0}
      .header{background:#2d6b5e;color:#fff;padding:22px 30px;display:flex;align-items:center;gap:16px}
      .logo-circle{width:52px;height:52px;border-radius:50%;background:#c0392b;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0}
      .clinic-name{font-size:1.9rem;font-weight:700;letter-spacing:.02em}
      .clinic-sub{font-size:.75rem;letter-spacing:.18em;margin-top:2px;opacity:.85}
      .body{padding:28px 30px}
      .inv-title{font-size:2rem;font-weight:700;color:#222}
      .inv-date{font-size:.88rem;color:#666;margin-top:3px}
      .barcode{font-family:monospace;font-size:1.1rem;letter-spacing:.25em;color:#222;text-align:right}
      .info-table{width:100%;border-collapse:collapse;margin:20px 0}
      .info-table td{padding:9px 12px;border:1px solid #ddd;font-size:.92rem}
      .info-table td:first-child{font-weight:600;background:#f9f9f9;width:38%}
      .proc-table{width:100%;border-collapse:collapse;margin:8px 0}
      .proc-table thead tr{background:#f0f0f0}
      .proc-table th{padding:10px 12px;text-align:left;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:#555}
      .proc-table th:last-child{text-align:right}
      .summary{margin-top:16px;border:1px solid #ddd}
      .summary tr td{padding:9px 12px;border-bottom:1px solid #eee;font-size:.92rem}
      .summary tr td:last-child{text-align:right}
      .summary .total-row td{font-weight:700;font-size:1.05rem;background:#f9f9f9}
      .summary .due-row td{font-weight:700;font-size:1.1rem}
      .footer{background:#2d6b5e;color:#fff;padding:12px 30px;display:flex;gap:20px;flex-wrap:wrap;font-size:.75rem;margin-top:28px}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>
    <div class="page">
      <div class="header">
        <div class="logo-circle">🦷</div>
        <div>
          <div class="clinic-name">QUICK DENTAL CARE</div>
          <div class="clinic-sub">QUALITY TREATMENT YOU CAN AFFORD</div>
        </div>
      </div>
      <div class="body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <div class="inv-title">Invoice</div>
            <div class="inv-date">${dateStr}</div>
          </div>
          <div class="barcode">
            <div style="font-size:.9rem;font-weight:700;letter-spacing:.04em;color:#1251aa;margin-bottom:3px">INV-${invNum}</div>
            <div style="font-size:1.8rem;letter-spacing:.3em;font-family:monospace;color:#555">|||||||||||||||</div>
            <div style="letter-spacing:.22em;font-size:.76rem;color:#888">${bcNum.split('').join(' ')}</div>
          </div>
        </div>
        <table class="info-table">
          <tr><td>ID #</td><td>${pat.id||'—'}</td></tr>
          <tr><td>Patient Name</td><td>${pat.name||'—'}</td></tr>
          <tr><td>Doctor name</td><td>Dr. Marjana Siddique Moury</td></tr>
          <tr><td>Phone</td><td>${pat.phone||'—'}</td></tr>
          <tr><td>E-mail</td><td>info@quickdental.com.bd</td></tr>
        </table>
        <table class="proc-table">
          <thead><tr><th>Procedures</th><th style="text-align:right">Amount (BDT)</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <table class="summary">
          <tr><td>Total</td><td>৳ ${sub.toLocaleString()}</td></tr>
          <tr><td>Discount (${this._discount}%)</td><td>৳ ${disc.toLocaleString()}</td></tr>
          <tr class="total-row"><td>Payable</td><td>৳ ${total.toLocaleString()}</td></tr>
          <tr><td>Paid</td><td>৳ ${paid.toLocaleString()}</td></tr>
          <tr class="due-row"><td>Due</td><td>৳ ${due.toLocaleString()}</td></tr>
        </table>
      </div>
      <div class="footer">
        <span>📞 +8801307978439</span>
        <span>✉ info@quickdental.com.bd</span>
        <span>🌐 www.quickdental.com.bd</span>
        <span>📍 Akhalia, Sylhet</span>
      </div>
    </div>
    </body></html>`;

    const blob = new Blob([html], {type:'text/html'});
    const blobUrl = URL.createObjectURL(blob);
    const w = window.open(blobUrl, '_blank');
    if(w){ setTimeout(()=>{ try{ w.print(); }catch(e){} URL.revokeObjectURL(blobUrl); }, 1000); }
    else {
      const a = document.createElement('a');
      a.href = blobUrl; a.download = `Invoice_${pat.id||'QDC'}_${new Date().toISOString().slice(0,10)}.html`;
      a.click(); setTimeout(()=>URL.revokeObjectURL(blobUrl),5000);
    }
    if(m){ m.textContent=`✓ ${invNum} · ${pat.name} · ৳${total.toLocaleString()}`; m.className='qdc-msg ok'; }
  },

  reset(){
    this._patient=null; this._lines=[]; this._discount=0;
    ['inv-pat-search','inv-treat-name','inv-treat-cost','inv-paid'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
    document.getElementById('inv-pat-selected').innerHTML='';
    document.getElementById('inv-line-wrap').style.display='none';
    document.getElementById('inv-line-tbody').innerHTML='';
    this.setDiscount(0);
    const m=document.getElementById('inv-msg'); m.textContent=''; m.className='qdc-msg';
  },

  _period: 'today',

  setPeriod(p){
    this._period = p;
    const labels = {today:'Today', week:'This Week', month:'This Month', custom:'Custom Date'};
    const lbl = document.getElementById('inv-period-label');
    const cust = document.getElementById('inv-period-custom')?.value||'';
    if(lbl) lbl.textContent = 'Showing: ' + (p==='custom' && cust ? cust : labels[p]||p);
    ['today','week','month'].forEach(k=>{
      const b = document.getElementById(`inv-period-${k}`);
      if(b){ b.style.background = k===p ? 'var(--gold)' : ''; b.style.color = k===p ? 'var(--bg)' : ''; }
    });
    this.loadSummary();
  },

  async loadSummary(){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy) return;
    try {
      const resp = await fetch(`${proxy}&action=getInvoices${QDC_staff._hipaaParams()}`);
      if(!resp.ok) return;
      const raw = await resp.json();
      const rows = Array.isArray(raw) ? raw : [];
      const now    = new Date();
      const today  = now.toISOString().slice(0,10);
      const weekAgo= new Date(now-7*24*3600*1000).toISOString().slice(0,10);
      const month  = today.slice(0,7);
      const custom = document.getElementById('inv-period-custom')?.value||'';
      const filtered = rows.filter(r=>{
        const d = String(r.Date||r.date||'').slice(0,10);
        if(this._period==='today')  return d===today;
        if(this._period==='week')   return d>=weekAgo;
        if(this._period==='month')  return d.startsWith(month);
        if(this._period==='custom') return custom ? d===custom : true;
        return true;
      });
      const fmt = n=>'৳ '+Math.round(n).toLocaleString();
      const el  = id=>document.getElementById(id);
      const sum = (k1,k2)=>filtered.reduce((s,r)=>s+Number(r[k1]||r[k2]||0),0);
      if(el('inv-stat-total'))  el('inv-stat-total').textContent  = fmt(sum('Total','total'));
      if(el('inv-stat-paid'))   el('inv-stat-paid').textContent   = fmt(sum('Paid','paid'));
      if(el('inv-stat-due'))    el('inv-stat-due').textContent    = fmt(sum('Due','due'));
      if(el('inv-stat-count'))  el('inv-stat-count').textContent  = filtered.length;
    } catch(e){ console.warn('Invoice summary:', e.message); }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  PRESCRIPTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
window.QDC_rx = {
  _patient: null,
  _meds: [],

  searchPatient(){
    const q = document.getElementById('rx-pat-search').value.trim();
    const results = document.getElementById('rx-pat-results');
    if(q.length < 2){ results.style.display='none'; return; }
    const data = (QDC_staff._patData||[]).filter(p=>
      (p.name||'').toLowerCase().includes(q.toLowerCase()) ||
      (p.id||'').toLowerCase().includes(q.toLowerCase()) ||
      (p.phone||'').includes(q)
    ).slice(0,8);
    if(!data.length){ results.innerHTML='<div style="padding:12px 16px;color:var(--text3);font-size:.88rem">No patients found</div>'; results.style.display='block'; return; }
    results.innerHTML = data.map(p=>`
      <div onclick="QDC_rx.selectPatient(${JSON.stringify(p).replace(/"/g,'&quot;')})"
        style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s"
        onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
        <span style="color:var(--cream);font-weight:500">${p.name||'—'}</span>
        <span style="color:var(--text3);font-size:.82rem;margin-left:10px">${p.id||''}</span>
        <span style="color:var(--text3);font-size:.82rem;margin-left:8px">${p.phone||''}</span>
      </div>`).join('');
    results.style.display='block';
  },

  selectPatient(p){
    this._patient = p;
    document.getElementById('rx-pat-results').style.display='none';
    document.getElementById('rx-pat-search').value = p.name||'';
    document.getElementById('rx-pat-selected').innerHTML = `
      <div style="background:rgba(201,151,58,.07);border:1px solid var(--border2);padding:12px 14px">
        <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.88rem;margin-bottom:10px;align-items:center">
          <span style="color:var(--gold)">✓ Selected:</span>
          <span style="color:var(--cream);font-weight:600">${p.name||'—'}</span>
          <span style="color:var(--text3)">${p.id||''}</span>
          <span style="color:var(--text3)">${p.age ? p.age+'y' : ''} ${p.gender||''}</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="QDC_rx.openPortalFiles('xray','${(p.id||'').replace(/'/g,'')}')" 
            style="display:flex;align-items:center;gap:6px;padding:7px 12px;background:rgba(30,136,229,.12);border:1px solid rgba(30,136,229,.4);color:#42a5f5;font-family:inherit;font-size:.78rem;cursor:pointer;border-radius:2px;transition:all .15s"
            onmouseover="this.style.background='rgba(30,136,229,.22)'" onmouseout="this.style.background='rgba(30,136,229,.12)'">
            📷 View X-Rays
          </button>
          <button onclick="QDC_rx.openPortalFiles('prescription','${(p.id||'').replace(/'/g,'')}')"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px;background:rgba(102,187,106,.12);border:1px solid rgba(102,187,106,.4);color:#66bb6a;font-family:inherit;font-size:.78rem;cursor:pointer;border-radius:2px;transition:all .15s"
            onmouseover="this.style.background='rgba(102,187,106,.22)'" onmouseout="this.style.background='rgba(102,187,106,.12)'">
            📋 Past Prescriptions
          </button>
          <button onclick="QDC_rx.openPortalFiles('scan','${(p.id||'').replace(/'/g,'')}')"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px;background:rgba(171,71,188,.12);border:1px solid rgba(171,71,188,.4);color:#ce93d8;font-family:inherit;font-size:.78rem;cursor:pointer;border-radius:2px;transition:all .15s"
            onmouseover="this.style.background='rgba(171,71,188,.22)'" onmouseout="this.style.background='rgba(171,71,188,.12)'">
            🔬 3D Scans
          </button>
        </div>
      </div>`;
    // Load previous prescription for this patient
    this._loadPrevRx(p);
  },

  async openPortalFiles(type, patientId){
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy){ alert('No server configured.'); return; }
    const btn = event?.target;
    const origText = btn?.innerHTML;
    if(btn){ btn.innerHTML='⌛'; btn.disabled=true; }
    try {
      const r = await fetch(`${proxy}&action=getPatientFiles&patientId=${encodeURIComponent(patientId)}${QDC_staff._hipaaParams()}`);
      const rawText2 = await r.text();
      let d = {};
      try { d = JSON.parse(rawText2); } catch(pe2){}
      if(d.ok===false && d.error){
        if(btn){ btn.innerHTML=origText; btn.disabled=false; }
        let gasVer="?"; try{ const vr=await fetch(`${proxy}&action=version${QDC_staff._hipaaParams()}`); const vd=await vr.json(); gasVer=vd.v||"?"; }catch(ve){} alert("Server error loading files:\n\nError: "+d.error+"\n\nDeployed GAS version: "+gasVer+"\n(Expected: v8.4+)\n\nRaw (first 300):\n"+rawText2.slice(0,300));
        return;
      }

      // Map type to correct array in response
      let files = [];
      if(type==='xray')         files = [...(d.xrays||[]), ...(d.scans||[]).filter(f=>/\.(jpg|jpeg|png|dcm|dicom)$/i.test(f.name||''))];
      else if(type==='prescription') files = d.prescriptions||[];
      else                           files = [...(d.scans||[]).filter(f=>!/\.(jpg|jpeg|png|dcm|dicom)$/i.test(f.name||'')), ...(d.scans||[])];

      // Deduplicate by url
      const seen = new Set();
      files = files.filter(f=>{ const u=f.url||''; if(seen.has(u)) return false; seen.add(u); return true; });

      if(!files.length){
        const errDetail = d._errors && d._errors.length ? '\n\nServer errors:\n' + d._errors.join('\n') : '';
        alert(`No ${type==='xray'?'X-ray':type==='prescription'?'prescription':'scan'} files found for this patient.${errDetail}\n\nMake sure the files are uploaded via the X-Ray uploader tool or prescription save.`);
        return;
      }

      // Sort by date descending (most recent first)
      files.sort((a,b)=>String(b.date||b.Date||'').localeCompare(String(a.date||a.Date||'')));

      if(files.length === 1){
        window.open(files[0].url||files[0].DriveURL, '_blank');
        return;
      }

      // Multiple files — show a clean picker overlay
      let ov = document.getElementById('rx-files-overlay');
      if(!ov){ ov = document.createElement('div'); ov.id='rx-files-overlay';
        ov.style.cssText='position:fixed;inset:0;z-index:3200;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center';
        ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
        document.body.appendChild(ov); }

      const typeLabel = type==='xray'?'X-Rays':type==='prescription'?'Prescriptions':'3D Scans';
      const typeIcon  = type==='xray'?'📷':type==='prescription'?'📋':'🔬';
      const isXray = type==='xray';
      const items = files.map((f,i)=>{
        const url  = f.url||f.DriveURL||'';
        const name = f.name||f.Filename||f.filename||('File '+(i+1));
        const date = f.date||f.Date||'';
        const fid  = QDC_portal._fid(f);
        const thumb = fid ? `https://drive.google.com/thumbnail?id=${fid}&sz=w600` : '';
        const view  = fid ? QDC_portal._driveView(fid) : url;
        const isImg = isXray || /\.(jpg|jpeg|png|webp|bmp|tiff?)$/i.test(name);
        if(isImg && thumb){
          return `<div style="break-inside:avoid;margin-bottom:10px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;overflow:hidden">
            <a href="${view}" target="_blank" rel="noopener" style="display:block">
              <img src="${thumb}" alt="${name}" loading="lazy" style="width:100%;display:block;background:var(--surface);min-height:120px;object-fit:cover"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <div style="display:none;height:120px;align-items:center;justify-content:center;background:var(--surface);font-size:2rem">${typeIcon}</div>
            </a>
            <div style="padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:.8rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div>
                ${date?`<div style="font-size:.7rem;color:var(--text3);margin-top:1px">${date}</div>`:''}
              </div>
              <a href="${view}" target="_blank" rel="noopener" style="font-size:.72rem;color:var(--blue3);text-decoration:none;flex-shrink:0">Open ↗</a>
            </div>
          </div>`;
        }
        return `<div style="break-inside:avoid;margin-bottom:10px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;overflow:hidden">
          <a href="${url}" target="_blank" rel="noopener"
            style="display:flex;align-items:center;gap:12px;padding:12px 16px;text-decoration:none;transition:background .15s"
            onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
            <span style="font-size:1.4rem">${typeIcon}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:.85rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div>
              ${date?`<div style="font-size:.72rem;color:var(--text3);margin-top:2px">${date}</div>`:''}
            </div>
            <span style="font-size:.72rem;color:var(--blue3);flex-shrink:0">Open ↗</span>
          </a>
        </div>`;
      }).join('');

      const gridStyle = isXray ? 'columns:2;column-gap:10px;padding:12px' : 'padding:0';
      ov.innerHTML=`<div onclick="event.stopPropagation()" style="background:var(--bg);border:1px solid var(--border2);width:min(${isXray?'580px':'440px'},94vw);max-height:80vh;overflow-y:auto;border-radius:4px;box-shadow:0 24px 64px rgba(0,0,0,.4)">
        <div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--bg);z-index:1">
          <div>
            <div style="font-weight:600;color:var(--text);font-size:.95rem">${typeIcon} ${typeLabel}</div>
            <div style="font-size:.76rem;color:var(--text3);margin-top:2px">${this._patient?.name||patientId} — ${files.length} file${files.length>1?'s':''}</div>
          </div>
          <button onclick="document.getElementById('rx-files-overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--text3);cursor:pointer;font-size:.9rem;padding:4px 10px;border-radius:2px">✕</button>
        </div>
        <div style="${gridStyle}">${items}</div>
        <div style="padding:10px 18px;background:var(--surface);border-top:1px solid var(--border)">
          <button onclick="document.getElementById('rx-files-overlay').remove()" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:.8rem">Close</button>
        </div>
      </div>`;
      ov.style.display='flex';
    } catch(e){
      alert('Could not load files: '+e.message);
    } finally {
      if(btn){ btn.innerHTML=origText; btn.disabled=false; }
    }
  },

  async _loadPrevRx(p){
    const panel = document.getElementById('rx-prev-panel');
    const box   = document.getElementById('rx-prev-content');
    if(!box) return;
    const proxy = window.__QDC?.SHEETS_PROXY||'';
    if(!proxy){ if(panel) panel.style.display='none'; return; }
    if(panel) panel.style.display='block';
    box.innerHTML='<div style="color:var(--text3);font-size:.82rem;padding:4px 0">⌛ Loading previous records…</div>';
    try {
      const pid = p.id||p.PatientID||p.ID||'';
      // Use getPatientFiles which returns prescriptions array with DriveURL, date, tx, dx
      const r = await fetch(`${proxy}&action=getPatientFiles&patientId=${encodeURIComponent(pid)}${QDC_staff._hipaaParams()}`);
      const d = await r.json();
      const rxList = Array.isArray(d.prescriptions) ? d.prescriptions : [];
      if(!rxList.length){
        box.innerHTML='<div style="color:var(--text3);font-size:.82rem;padding:4px 0">No previous prescriptions on record.</div>';
        return;
      }
      // Sort by date descending, take last 3
      const sorted = rxList.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,3);
      box.innerHTML = sorted.map((rx,i)=>{
        const date = rx.date||'—';
        const dx   = rx.dx||'';
        const tx   = rx.tx||'';
        const url  = rx.url||'';
        const name = rx.name||'';
        return `<div style="border:1px solid var(--border);border-radius:2px;margin-bottom:10px;overflow:hidden">
          <div style="background:var(--surface);padding:7px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span style="font-size:.76rem;font-weight:600;color:var(--text3);letter-spacing:.06em">${i===0?'LAST VISIT':'VISIT '+(i+1)}</span>
            <span style="font-size:.8rem;color:var(--text2)">${date}</span>
            ${url?`<a href="${url}" target="_blank" rel="noopener" style="font-size:.72rem;color:var(--blue3);text-decoration:none">📄 Open PDF</a>`:''}
          </div>
          <div style="padding:10px 12px;display:grid;gap:5px">
            ${name?`<div style="font-size:.82rem"><span style="color:var(--text3)">File:</span> <span style="color:var(--text2)">${name}</span></div>`:''}
            ${dx?`<div style="font-size:.82rem"><span style="color:var(--text3)">Diagnosis:</span> <span style="color:var(--cream)">${dx}</span></div>`:''}
            ${tx?`<div style="font-size:.82rem"><span style="color:var(--text3)">Treatment:</span> <span style="color:var(--text2)">${tx}</span></div>`:''}
          </div>
        </div>`;
      }).join('');
    } catch(e){
      box.innerHTML=`<div style="color:var(--text3);font-size:.82rem">Could not load history: ${e.message}</div>`;
    }
  },

  addMed(){
    const name = document.getElementById('rx-med-name').value.trim();
    const dose = document.getElementById('rx-med-dose').value.trim();
    const dur  = document.getElementById('rx-med-dur').value.trim();
    const note = document.getElementById('rx-med-note').value.trim();
    if(!name){ const m=document.getElementById('rx-msg'); m.textContent='Enter medicine name.'; m.className='qdc-msg err'; return; }
    this._meds.push({ name, dose, dur, note });
    ['rx-med-name','rx-med-dose','rx-med-dur','rx-med-note'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('rx-msg').textContent='';
    this._renderMeds();
  },

  removeMed(i){ this._meds.splice(i,1); this._renderMeds(); },

  _renderMeds(){
    const tbody = document.getElementById('rx-med-tbody');
    const wrap  = document.getElementById('rx-med-list');
    if(!this._meds.length){ wrap.style.display='none'; tbody.innerHTML=''; return; }
    wrap.style.display='block';
    tbody.innerHTML = this._meds.map((m,i)=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;color:var(--cream)">${m.name}</td>
        <td style="padding:8px 10px;color:var(--text2)">${m.dose||'—'}</td>
        <td style="padding:8px 10px;color:var(--text2)">${m.dur||'—'}</td>
        <td style="padding:8px 10px;color:var(--text3)">${m.note||''}</td>
        <td style="padding:8px 10px;text-align:center">
          <button onclick="QDC_rx.removeMed(${i})" style="background:none;border:none;color:var(--crimson);cursor:pointer;font-size:.9rem">✕</button>
        </td>
      </tr>`).join('');
  },

  _getFields(){
    return {
      cc:     document.getElementById('rx-cc')?.value.trim()||'',
      oe:     document.getElementById('rx-oe')?.value.trim()||'',
      dx:     document.getElementById('rx-dx')?.value.trim()||'',
      tx:     document.getElementById('rx-tx')?.value.trim()||'',
      mh:     document.getElementById('rx-mh')?.value.trim()||'',
      inv:    document.getElementById('rx-inv')?.value.trim()||'',
      advice: document.getElementById('rx-advice')?.value.trim()||'',
    };
  },

  async downloadPDF(){
    const pat = this._patient || { name:'', id:'', age:'', gender:'' };
    const f   = this._getFields();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'2-digit'}) + ' at ' +
                    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    const bcNum = (pat.id||'0000').replace(/\D/g,'').slice(-4).padStart(4,'0');
    // Get sequential RX ref from server before building PDF
    let rxRef = 'RX-'+new Date().getFullYear()+'-PREVIEW';
    try {
      const proxy = window.__QDC?.SHEETS_PROXY||'';
      if(proxy){
        const cntResp = await fetch(proxy + '&action=getRxCount' + QDC_staff._hipaaParams());
        const cntData = await cntResp.json().catch(()=>({}));
        const seq = String((cntData.count||0)+1).padStart(4,'0');
        rxRef = 'RX-'+new Date().getFullYear()+'-'+seq;
      }
    } catch(e){ /* use preview ref */ }
    // Pre-compute tooth map HTML (can't call 'this' inside template literal)
    const toothMapHtml = this._getToothMapHtml();

    const medRows = this._meds.length
      ? this._meds.map(m=>`<div style="margin-bottom:6px"><strong>${m.name}</strong><br><span style="font-family:'Courier New',monospace">${m.dose||''}</span> ${m.dur?'<span style="color:#555">'+m.dur+'</span>':''} ${m.note?'<em style="color:#888">'+m.note+'</em>':''}</div>`).join('')
      : '<div style="color:#999;font-size:.85rem">No medicines added</div>';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Prescription — Quick Dental Care</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;background:#fff;color:#333;font-size:13.5px}
      .page{max-width:680px;margin:0 auto}
      .header{background:#2d6b5e;color:#fff;padding:18px 28px;display:flex;align-items:center;gap:14px}
      .logo-circle{width:48px;height:48px;border-radius:50%;background:#c0392b;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0}
      .clinic-name{font-size:1.8rem;font-weight:700}
      .clinic-sub{font-size:.7rem;letter-spacing:.16em;opacity:.85;margin-top:2px}
      .body{padding:22px 28px}
      .meta-row{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:16px;border-bottom:1px solid #ddd;padding-bottom:12px;font-size:.85rem}
      .meta-row b{color:#333;font-weight:600}
      .meta-row span{color:#555}
      .barcode{font-family:monospace;text-align:right;font-size:.85rem}
      .two-col{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:8px}
      .left-col{border-right:1px solid #ddd;padding-right:16px}
      .right-col{padding-left:16px}
      .section-lbl{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:5px;margin-top:14px;font-weight:600}
      .section-val{font-size:.88rem;color:#222;line-height:1.55;min-height:22px}
      .rx-symbol{font-size:2rem;font-weight:700;font-family:serif;color:#c0392b;margin:12px 0 4px}
      .footer-bar{background:#2d6b5e;color:#fff;padding:10px 28px;display:flex;gap:18px;flex-wrap:wrap;font-size:.72rem;margin-top:24px}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>
    <div class="page">
      <div class="header">
        <div class="logo-circle">🦷</div>
        <div style="flex:1">
          <div class="clinic-name">QUICK DENTAL CARE</div>
          <div class="clinic-sub">QUALITY TREATMENT YOU CAN AFFORD</div>
        </div>
      </div>
      <div class="body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div class="meta-row" style="flex:1">
            <div><b>BDS:</b> <span>Sylhet MAG Osmani Medical College</span></div>
            <div><b>PGT:</b> <span>Oral &amp; Maxillofacial Surgery</span></div>
            <div><b>BMDC:</b> <span>7652</span></div>
            <div></div>
            <div><b>Patient ID #</b> <span>${pat.id||'—'}</span></div>
            <div><b>Printed</b> <span>${dateStr}</span></div>
            <div><b>Name:</b> <span>${pat.name||'—'}</span></div>
            <div><b>Age</b> <span>${pat.age||'—'}${pat.gender ? ' / '+pat.gender : ''}</span></div>
          </div>
          <div class="barcode" style="margin-left:16px;text-align:right">
            <div style="font-size:1rem;font-weight:700;color:#222;letter-spacing:.04em;margin-bottom:2px">${rxRef}</div>
            <div style="font-size:1.6rem;letter-spacing:.25em;color:#555">|||||||||||||||</div>
            <div style="letter-spacing:.22em;font-size:.76rem;color:#888">${bcNum.split('').join(' ')}</div>
          </div>
        </div>

        ${toothMapHtml ? `<div style="margin-bottom:16px">
          <div style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:8px;font-weight:600">TOOTH CHART</div>
          ${toothMapHtml}
        </div>` : ''}
        <div class="two-col">
          <div class="left-col">
            <div class="section-lbl">C/C</div>
            <div class="section-val">${f.cc||'—'}</div>
            <div class="section-lbl">O/E</div>
            <div class="section-val">${(f.oe||'—').replace(/\n/g,'<br>')}</div>
            <div class="section-lbl">M/H</div>
            <div class="section-val">${f.mh||'—'}</div>
            <div class="section-lbl">Investigation</div>
            <div class="section-val">${f.inv||'—'}</div>
            <div class="section-lbl">Diagnosis</div>
            <div class="section-val">${f.dx||'—'}</div>
            <div class="section-lbl">Treatment</div>
            <div class="section-val">${f.tx||'—'}</div>
          </div>
          <div class="right-col">
            <div class="rx-symbol">Rx</div>
            ${medRows}
            ${f.advice ? `<div class="section-lbl" style="margin-top:18px">Advice</div><div class="section-val">${f.advice}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="footer-bar">
        <span>📞 +8801307978439</span>
        <span>✉ info@quickdental.com.bd</span>
        <span>🌐 www.quickdental.com.bd</span>
        <span>📍 Akhalia, Sylhet</span>
      </div>
    </div>
    </body></html>`;

    const rxBlob = new Blob([html], {type:'text/html'});
    const rxUrl  = URL.createObjectURL(rxBlob);
    const w = window.open(rxUrl,'_blank');
    if(w){ setTimeout(()=>{ try{w.print();}catch(e){} URL.revokeObjectURL(rxUrl); },1000); }
    else { const a=document.createElement('a'); a.href=rxUrl; a.download=`Prescription_${pat.id||'QDC'}_${new Date().toISOString().slice(0,10)}.html`; a.click(); setTimeout(()=>URL.revokeObjectURL(rxUrl),5000); }
    const m = document.getElementById('rx-msg');
    m.textContent = '✓ Prescription ready — print dialog will open. Choose Save as PDF.';
    m.className = 'qdc-msg ok';

    // Store reference for upload
    this._lastHtml = html;
  },

  async uploadToPatient(){
    const pat = this._patient;
    const m   = document.getElementById('rx-msg');
    if(!pat){ m.textContent='Select a patient first.'; m.className='qdc-msg err'; return; }
    if(!this._lastHtml){ m.textContent='Generate the prescription PDF first (click Download).'; m.className='qdc-msg err'; return; }

    const btn = document.getElementById('rx-upload-btn');
    btn.textContent = '⌛ Uploading…'; btn.disabled=true;
    m.textContent = 'Converting to PDF…'; m.className='qdc-msg';

    try {
      const { SHEETS_PROXY } = window.__QDC;
      const f   = this._getFields();
      const now = new Date();

      // Convert prescription HTML → PDF blob using browser print API via hidden iframe,
      // then encode as base64 to send to Apps Script which saves it to Drive
      const htmlB64 = btoa(unescape(encodeURIComponent(this._lastHtml)));
      const fileName = `Prescription_${pat.id||'unknown'}_${now.toISOString().slice(0,10)}.pdf`;

      m.textContent = 'Saving to Google Drive & Sheets…'; 

      // Send as JSON via text/plain — Apps Script reads e.postData.contents
      // URLSearchParams fails on large base64 payloads
      const _pObj = {
        action:     'savePrescription',
        patientId:  pat.id||'—',
        name:       pat.name||'—',
        phone:      pat.phone||'—',
        date:       now.toISOString(),
        cc:         f.cc,
        oe:         f.oe,
        dx:         f.dx,
        tx:         f.tx,
        mh:         f.mh,
        advice:     f.advice,
        meds:       this._meds.map(x=>`${x.name} ${x.dose} ${x.dur}${x.note?' ('+x.note+')':''}`).join(' | '),
        fileName:   fileName,
        htmlContent: htmlB64
      };
      // In local mode, inject _psec into POST body so GAS doPost accepts it
      if (window._IS_LOCAL) _pObj._psec = '2BorNOT2BTHATISTHE?';
      // Also inject current staff session so GAS audit log captures the author
      if (window.QDC_staff && QDC_staff._staffId) {
        _pObj._sid = QDC_staff._staffId;
        _pObj._role = QDC_staff._staffRole || '';
      }
      const payload = JSON.stringify(_pObj);
      const res  = await fetch(SHEETS_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: payload
      });

      const data = await res.json();
      if(data.ok){
        const driveLink = data.driveUrl ? ` · <a href="${data.driveUrl}" target="_blank" style="color:var(--gold)">View in Drive ↗</a>` : '';
        const rxRef = data.rxRef || '';
        m.innerHTML = `✓ ${rxRef ? rxRef+' · ' : ''}Saved to ${pat.name}'s record${driveLink}`;
        m.className = 'qdc-msg ok';
        // Auto-send WhatsApp to patient — send regardless of Drive upload success
        if(pat.phone && pat.phone !== '—'){
          const f2 = this._getFields();
          const rawPh2 = String(pat.phone||'').replace(/\D/g,'');
          const normPh2 = rawPh2.startsWith('0') ? '880'+rawPh2.slice(1) : rawPh2.startsWith('880') ? rawPh2 : '880'+rawPh2;
          const driveSection = data.driveUrl ? `📄 View / Download: ${data.driveUrl}\n\n` : '';
          const rxMsg = `🦷 *Quick Dental Care — Prescription*\n\nDear ${pat.name},\n\nYour prescription from today's visit has been recorded.\n\n` +
            driveSection +
            (f2.tx ? `🔧 Treatment: ${f2.tx}\n` : '') +
            (f2.advice ? `💬 Advice: ${f2.advice}\n` : '') +
            `\nPatient ID: ${pat.id}\n📍 Quick Dental Care, Akhalia, Sylhet\n☎ +88 01307978439\n🔗 sylhetdental.com`;
          const waParams = new URLSearchParams({ action:'sendWhatsApp', phone:normPh2, message:rxMsg });
          fetch(`${window.__QDC.SHEETS_PROXY}&${waParams}${QDC_staff._hipaaParams()}`).catch(()=>{});
        }
        // ── Auto-clear patient from queue (they're in chair getting a prescription = done) ──
        try {
          const qRows = QDC_staff._queueData || [];
          const qIdx  = qRows.findIndex(r =>
            (r.PatientID && r.PatientID === pat.id) ||
            (r.Name && r.Name.toLowerCase() === (pat.name||'').toLowerCase()) ||
            (r.Phone && r.Phone.replace(/\D/g,'').slice(-8) === (pat.phone||'').replace(/\D/g,'').slice(-8))
          );
          if(qIdx >= 0){
            const qRow  = qRows[qIdx];
            const qName = qRow.Name || qRow.name || '';
            const qDate = qRow.Date || qRow.date || new Date().toISOString().slice(0,10);
            // Remove from local queue immediately
            QDC_staff._queueData = qRows.filter((_,i) => i !== qIdx);
            QDC_staff._renderQueue(QDC_staff._queueData);
            // Sync Done status to sheet
            const proxy = window.__QDC?.SHEETS_PROXY || '';
            if(proxy) fetch(`${proxy}&action=updateQueueStatus&name=${encodeURIComponent(qName)}&date=${encodeURIComponent(qDate)}&status=Done${QDC_staff._hipaaParams()}`).catch(()=>{});
            m.innerHTML += ' · <span style="color:#25d366">✓ Removed from queue</span>';
            // Auto-advance next patient
            const advName = await QDC_staff._autoAdvanceNext();
            if(advName) m.innerHTML += ' · <span style="color:#1a6fb5">📢 '+advName+' called in</span>';
          }
        } catch(qErr){ console.warn('Queue clear failed', qErr); }
        // ── Schedule post-visit satisfaction survey (24h later) ──────────────
        try {
          const proxy = window.__QDC?.SHEETS_PROXY||'';
          if(proxy && pat.phone) {
            fetch(`${proxy}&action=scheduleSurvey&patientId=${encodeURIComponent(pat.id||'')}&name=${encodeURIComponent(pat.name||'')}&phone=${encodeURIComponent(pat.phone||'')}${QDC_staff._hipaaParams()}`).catch(()=>{});
          }
        } catch(_){}
      } else {
        throw new Error(data.error||'Save failed');
      }
    } catch(e){
      m.textContent = '⚠ Upload failed — PDF downloaded only. Error: '+(e.message||e);
      m.className = 'qdc-msg err';
    }
    btn.textContent = '☁ Save to Patient Record'; btn.disabled=false;
  },

  // ── Tooth Map ──────────────────────────────────────────────────────────────
  _teeth: {}, // { '17': 'selected', '18': 'problem', ... }

  initToothMap(){
    const svg = document.getElementById('tooth-svg');
    if(!svg || svg.children.length > 0) return;
    // FDI notation: upper right 18-11, upper left 21-28, lower left 31-38, lower right 41-48
    const upper = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
    const lower = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];
    const W=30, GAP=4, H=44, startX=14;
    const makeTeeth = (nums, y, arc) => {
      nums.forEach((n, i) => {
        const x = startX + i*(W+GAP);
        const g = document.createElementNS('http://www.w3.org/2000/svg','g');
        g.setAttribute('data-tooth', n);
        g.style.cursor = 'pointer';
        // Crown rect
        const crownH = H * 0.68;
        const rx2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rx2.setAttribute('x', x); rx2.setAttribute('y', y);
        rx2.setAttribute('width', W); rx2.setAttribute('height', crownH);
        rx2.setAttribute('rx', 4);
        rx2.setAttribute('fill', 'var(--surface)');
        rx2.setAttribute('stroke', 'var(--border)'); rx2.setAttribute('stroke-width', '1.2');
        rx2.setAttribute('id', 'tooth-rect-'+n);
        // Root nubs
        const rw = W*0.28, rh = H*0.28;
        const r1 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        const r2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
        const rootY = arc ? y - rh + 2 : y + crownH;
        [r1,r2].forEach((r,ri)=>{
          r.setAttribute('x', x + W*(ri===0?0.15:0.57));
          r.setAttribute('y', rootY); r.setAttribute('width', rw); r.setAttribute('height', rh);
          r.setAttribute('rx', 2); r.setAttribute('fill','var(--surface)');
          r.setAttribute('stroke','var(--border)'); r.setAttribute('stroke-width','0.8');
          r.setAttribute('pointer-events','none');
        });
        // Number
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('x', x+W/2); txt.setAttribute('y', y + crownH/2 + 4);
        txt.setAttribute('text-anchor','middle'); txt.setAttribute('font-size','9');
        txt.setAttribute('fill','var(--text3)'); txt.setAttribute('pointer-events','none');
        txt.textContent = n;
        g.appendChild(r1); g.appendChild(r2); g.appendChild(rx2); g.appendChild(txt);
        // Click = cycle: normal → selected → problem → normal
        g.addEventListener('click', () => QDC_rx.cycleTooth(n));
        svg.appendChild(g);
      });
    };
    // Separator line
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1','14'); line.setAttribute('y1','85');
    line.setAttribute('x2','526'); line.setAttribute('y2','85');
    line.setAttribute('stroke','var(--border)'); line.setAttribute('stroke-dasharray','4,3');
    svg.appendChild(line);
    makeTeeth(upper, 14, false);
    makeTeeth(lower, 112, true);
  },

  cycleTooth(n){
    const states = [undefined, 'selected', 'problem'];
    const cur = states.indexOf(this._teeth[n]);
    const next = states[(cur+1) % states.length];
    if(next === undefined) delete this._teeth[n];
    else this._teeth[n] = next;
    this._updateToothMap();
  },

  clearTeeth(){
    this._teeth = {};
    this._updateToothMap();
  },

  _updateToothMap(){
    const fills = { selected:'rgba(200,134,10,.3)', problem:'rgba(208,48,48,.25)' };
    const strokes = { selected:'var(--gold)', problem:'var(--closed)' };
    // Reset all
    document.querySelectorAll('[id^="tooth-rect-"]').forEach(r=>{
      r.setAttribute('fill','var(--surface)'); r.setAttribute('stroke','var(--border)');
    });
    // Apply states
    Object.entries(this._teeth).forEach(([n,state])=>{
      const r = document.getElementById('tooth-rect-'+n);
      if(r){ r.setAttribute('fill', fills[state]||'var(--surface)'); r.setAttribute('stroke', strokes[state]||'var(--border)'); }
    });
    // Update display text and hidden input
    const sel = Object.entries(this._teeth).filter(([,v])=>v==='selected').map(([k])=>k);
    const prob = Object.entries(this._teeth).filter(([,v])=>v==='problem').map(([k])=>k);
    const parts = [];
    if(sel.length) parts.push('Working: '+sel.join(', '));
    if(prob.length) parts.push('Problem: '+prob.join(', '));
    const disp = document.getElementById('tooth-selected-display');
    if(disp) disp.textContent = parts.length ? parts.join(' | ') : 'None';
    const inp = document.getElementById('rx-tooth-map');
    if(inp) inp.value = JSON.stringify(this._teeth);
  },

  _getToothMapHtml(){
    if(!Object.keys(this._teeth).length) return '';
    const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
    const lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
    const W=24, GAP=2, H=38;
    // Tooth shape: crown + root nub for visual differentiation
    const toothPath = (x, y, n, state, isUpper) => {
      const fill = state==='selected'?'rgba(200,134,10,.25)':state==='problem'?'rgba(208,48,48,.22)':'#f4f4f4';
      const stroke = state==='selected'?'#c8860a':state==='problem'?'#d03030':'#bbb';
      const sw = state ? '1.8' : '1';
      const crown_h = H * 0.68;
      const root_h  = H * 0.32;
      const ry = isUpper ? y : y;
      // Crown: rounded rectangle
      const crown = `<rect x="${x}" y="${ry}" width="${W}" height="${crown_h}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
      // Root nub(s): two small rounded rects below/above crown
      const rw = W*0.28, rh = root_h*0.85;
      const r1x = x + W*0.18, r2x = x + W*0.54;
      const ry2 = isUpper ? ry + crown_h : ry - rh + 2;
      const roots = `<rect x="${r1x}" y="${ry2}" width="${rw}" height="${rh}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="${sw*0.7}"/>
        <rect x="${r2x}" y="${ry2}" width="${rw}" height="${rh}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="${sw*0.7}"/>`;
      const numY = isUpper ? ry + crown_h/2 + 4 : ry + crown_h/2 + 4;
      const num = `<text x="${x+W/2}" y="${numY}" text-anchor="middle" font-size="8" fill="${state?stroke:'#888'}" font-weight="${state?'700':'400'}">${n}</text>`;
      return crown + (n<=15||n>=21&&n<=25||(n>=41&&n<=45)||(n>=31&&n<=35)?roots:'') + num;
    };
    const makeRow = (nums, y, isUpper) => nums.map((n,i) => {
      const x = 8 + i*(W+GAP);
      return toothPath(x, y, n, this._teeth[n], isUpper);
    }).join('');
    const totalW = 8 + upper.length*(W+GAP) + 4;
    const legend = [
      ['rgba(200,134,10,.25)','#c8860a','Working/Selected'],
      ['rgba(208,48,48,.22)','#d03030','Problem Tooth']
    ].map(([f,s,l],i)=>`
      <rect x="${8+i*120}" y="${totalW<460?100:100}" width="10" height="10" rx="2" fill="${f}" stroke="${s}" stroke-width="1.5"/>
      <text x="${8+i*120+14}" y="${totalW<460?109:109}" font-size="8.5" fill="#666">${l}</text>`).join('');
    // Layout: 14px label + 10px gap + 38px crown + 14px roots + 12px gap + 10px label + 10px gap + 38px crown + 14px roots + 14px legend = ~164px
    const svgH = 170;
    const upperY = 22;   // top of upper crowns
    const lowerY = upperY + H + 14 + 18; // gap of 18px between rows
    const midlineY = upperY + H + 14 + 9;
    return `<svg viewBox="0 0 ${totalW} ${svgH}" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:520px;display:block;margin:0 auto;font-family:Arial,sans-serif">
      <text x="${totalW/2}" y="11" text-anchor="middle" font-size="8.5" fill="#999" font-weight="600" letter-spacing="1">UPPER JAW</text>
      ${makeRow(upper, upperY, true)}
      <line x1="4" y1="${midlineY}" x2="${totalW-4}" y2="${midlineY}" stroke="#ccc" stroke-dasharray="4,3" stroke-width="0.8"/>
      <text x="${totalW/2}" y="${lowerY + H + 14}" text-anchor="middle" font-size="8.5" fill="#999" font-weight="600" letter-spacing="1">LOWER JAW</text>
      ${makeRow(lower, lowerY, false)}
      <rect x="8" y="${svgH-18}" width="10" height="10" rx="2" fill="rgba(200,134,10,.25)" stroke="#c8860a" stroke-width="1.5"/>
      <text x="22" y="${svgH-10}" font-size="8" fill="#666">Working/Selected</text>
      <rect x="130" y="${svgH-18}" width="10" height="10" rx="2" fill="rgba(208,48,48,.22)" stroke="#d03030" stroke-width="1.5"/>
      <text x="144" y="${svgH-10}" font-size="8" fill="#666">Problem Tooth</text>
    </svg>`;
  },

  reset(){
    this._patient=null; this._meds=[]; this._lastHtml=null; this._teeth={};
    ['rx-pat-search','rx-cc','rx-oe','rx-dx','rx-tx','rx-mh','rx-inv','rx-advice',
     'rx-med-name','rx-med-dose','rx-med-dur','rx-med-note'].forEach(id=>{
      const e=document.getElementById(id); if(e) e.value='';
    });
    document.getElementById('rx-pat-selected').innerHTML='';
    document.getElementById('rx-med-list').style.display='none';
    document.getElementById('rx-med-tbody').innerHTML='';
    const m=document.getElementById('rx-msg'); m.textContent=''; m.className='qdc-msg';
    const pp=document.getElementById('rx-prev-panel'); if(pp) pp.style.display='none';
    const pc=document.getElementById('rx-prev-content'); if(pc) pc.innerHTML='';
  }
};
