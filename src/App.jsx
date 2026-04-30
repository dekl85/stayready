import React, { useState, useEffect, useRef } from "react";

// ── FONTS & SUPABASE ──────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap";
document.head.appendChild(fl);
const fl2 = document.createElement("link");
fl2.rel = "stylesheet";
fl2.href = "https://db.onlinewebfonts.com/c/465b1cbe35b5ca0de556720c955abece?family=Abolition+W00+Regular";
document.head.appendChild(fl2);

const SUPABASE_URL = "https://fewkgzetgdvbiawlkrfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2tnemV0Z2R2Ymlhd2xrcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTI4MDAsImV4cCI6MjA5MzAyODgwMH0.IT479cyv9t8FlVzbcuO9W7oeF8Q0uHS-UNwIVYe3bbM";

const sb = {
  h: { "Content-Type":"application/json", "apikey":SUPABASE_KEY, "Authorization":`Bearer ${SUPABASE_KEY}` },
  async get(table, filter="") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${filter?"&"+filter:""}`, { headers:this.h });
    return res.json();
  },
  async post(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:"POST", headers:{...this.h,"Prefer":"return=representation"}, body:JSON.stringify(data) });
    return res.json();
  },
  async patch(table, data, filter) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, { method:"PATCH", headers:{...this.h,"Prefer":"return=representation"}, body:JSON.stringify(data) });
    return res.json();
  },
  async delete(table, filter) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, { method:"DELETE", headers:this.h });
  },
  async signUp(email, pass) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method:"POST", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY}, body:JSON.stringify({email,password:pass}) });
    return res.json();
  },
  async signIn(email, pass) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method:"POST", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY}, body:JSON.stringify({email,password:pass}) });
    return res.json();
  },
};

// ── DESIGN TOKENS ─────────────────────────────────────────────
const C = {
  terracotta: "#c96949",
  red:        "#e94d41",
  cream:      "#fff5ed",
  creamDark:  "#fde8d8",
  black:      "#1a1008",
  white:      "#ffffff",
  g200:       "#e8ddd5",
  g400:       "#b09888",
  g600:       "#7a5c4a",
  g800:       "#3d2a1e",
};

const abolition = "'Abolition W00 Regular', 'Impact', sans-serif";
const sans      = "'PT Sans', system-ui, sans-serif";

// ── PHOTOS ────────────────────────────────────────────────────
const P = {
  hero:        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  kitchen:     "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  service:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  dish1:       "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  dish2:       "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  dish3:       "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  dish4:       "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  dish5:       "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80",
  wine:        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  bar:         "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
};

// ── ICONS ─────────────────────────────────────────────────────
const Ic = ({ n, s=20, c=C.black }) => {
  const a = { width:s, height:s, viewBox:"0 0 24 24", fill:"none", stroke:c, strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" };
  const map = {
    today:    <svg {...a}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    menu:     <svg {...a}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    chat:     <svg {...a}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    train:    <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    user:     <svg {...a}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users:    <svg {...a}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    grid:     <svg {...a}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    check:    <svg {...a} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    logout:   <svg {...a}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:     <svg {...a}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:        <svg {...a}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    send:     <svg {...a}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    fire:     <svg {...a}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>,
    leaf:     <svg {...a}><path d="M2 22l10-10"/><path d="M16 8c0 4.42-3.58 8-8 8a8 8 0 010-16c4.42 0 8 3.58 8 8z"/></svg>,
    star:     <svg {...a}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    alert:    <svg {...a}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    arrow:    <svg {...a}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    clock:    <svg {...a}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    award:    <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    wine:     <svg {...a}><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 005-5c0-2-.5-4-2-8H7c-1.5 4-2 6-2 8a5 5 0 005 5z"/></svg>,
  };
  return map[n] || null;
};

// ── STYLES ────────────────────────────────────────────────────
const g = {
  app:     { fontFamily:sans, background:C.cream, minHeight:"100vh", color:C.black, maxWidth:430, margin:"0 auto" },
  nav:     { background:C.white, borderBottom:`1px solid ${C.g200}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:54, position:"sticky", top:0, zIndex:100 },
  logo:    { fontSize:22, fontFamily:abolition, color:C.terracotta, letterSpacing:"0.05em", textTransform:"uppercase" },
  page:    { padding:"24px 18px 96px" },
  h1:      { fontSize:32, fontFamily:abolition, color:C.black, letterSpacing:"0.03em", textTransform:"uppercase", marginBottom:2, lineHeight:1.1 },
  h2:      { fontSize:22, fontFamily:abolition, color:C.black, letterSpacing:"0.03em", textTransform:"uppercase" },
  h3:      { fontSize:16, fontFamily:abolition, color:C.black, letterSpacing:"0.03em", textTransform:"uppercase" },
  sub:     { color:C.g600, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:24, fontFamily:sans },
  lbl:     { fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.g400, display:"block", marginBottom:6, fontFamily:sans },
  body:    { fontSize:14, lineHeight:1.8, color:C.g800, fontFamily:sans },
  card:    { background:C.white, border:`1px solid ${C.g200}`, borderRadius:4, padding:18, marginBottom:10 },
  cardWarm:{ background:C.creamDark, border:`1px solid ${C.terracotta}33`, borderRadius:4, padding:18, marginBottom:10 },
  input:   { background:C.white, border:`1px solid ${C.g200}`, borderRadius:4, padding:"11px 14px", color:C.black, fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", fontFamily:sans },
  btn:     { background:C.terracotta, color:C.white, border:"none", borderRadius:4, padding:"13px 24px", fontSize:13, fontWeight:"bold", letterSpacing:"0.06em", cursor:"pointer", width:"100%", fontFamily:sans },
  btnRed:  { background:C.red, color:C.white, border:"none", borderRadius:4, padding:"13px 24px", fontSize:13, fontWeight:"bold", cursor:"pointer", width:"100%", fontFamily:sans },
  btnOut:  { background:"transparent", color:C.terracotta, border:`1px solid ${C.terracotta}`, borderRadius:4, padding:"12px 24px", fontSize:13, fontWeight:"bold", cursor:"pointer", width:"100%", fontFamily:sans },
  btnSm:   { background:C.terracotta, color:C.white, border:"none", borderRadius:4, padding:"8px 16px", fontSize:11, fontWeight:"bold", cursor:"pointer", fontFamily:sans },
  btnSmOut:{ background:"transparent", color:C.terracotta, border:`1px solid ${C.terracotta}55`, borderRadius:4, padding:"7px 14px", fontSize:11, cursor:"pointer", fontFamily:sans },
  divider: { height:1, background:C.g200, margin:"18px 0" },
  progress:{ height:3, background:C.g200, borderRadius:2, overflow:"hidden" },
  bar:     (p) => ({ height:"100%", width:`${p}%`, background:C.terracotta, transition:"width 0.5s ease", borderRadius:2 }),
  bnav:    { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.white, borderTop:`1px solid ${C.g200}`, display:"flex", padding:"8px 0 16px", zIndex:100 },
  nbtn:    (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", padding:"4px 0", background:"none", border:"none", color: a ? C.terracotta : C.g400 }),
  ntxt:    (a) => ({ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:a?"bold":"normal", color:"inherit", fontFamily:sans }),
  fgroup:  { marginBottom:14 },
  err:     { background:"#fff0f0", border:`1px solid ${C.red}44`, borderRadius:4, padding:"10px 14px", fontSize:13, color:C.red, fontFamily:sans, marginBottom:14 },
  ok:      { background:"#f0fff4", border:"1px solid #86EFAC", borderRadius:4, padding:"10px 14px", fontSize:13, color:"#15803D", fontFamily:sans, marginBottom:14 },
  tag:     (bg, txt) => ({ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", background:bg, color:txt, fontFamily:sans }),
};

// ── DEMO DATA ─────────────────────────────────────────────────
const DEMO_DIENST = {
  date: new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}),
  shift: "Avonddienst · 17:00 – 23:30",
  reservations: 47, covers: 112,
  team: [
    {id:1,name:"Lena Visser",role:"Chef de rang",shift:"17:00–23:30",kleur:C.terracotta},
    {id:2,name:"Daan Mulder",role:"Sommelier",shift:"17:00–23:30",kleur:C.red},
    {id:3,name:"Fatima El-Hassan",role:"Bediening",shift:"17:30–23:00",kleur:C.g600},
    {id:4,name:"Lars Bakker",role:"Bar",shift:"16:00–00:00",kleur:C.black},
  ],
  events: [
    {id:1,time:"17:30",title:"Briefing met chef",detail:"Specials, 86-lijst, allergenen doornemen",cat:"keuken"},
    {id:2,time:"18:00",title:"Deuren open",detail:"Eerste reserveringen: 18:00, 18:15, 18:30",cat:"service"},
    {id:3,time:"19:30",title:"Groep Philips",detail:"14 personen · tafel 7-9 · zakelijk diner",cat:"groep"},
    {id:4,time:"22:30",title:"Laatste bestelling",detail:"Keuken sluit · gasten informeren",cat:"keuken"},
  ],
  specials: [
    {id:1,cat:"Chef's special",naam:"Wagyu entrecôte",desc:"Truffelboter, asperges, pommes dauphine",prijs:"€49",tip:"Aanprijzen bij vleeseters — vandaag beperkt beschikbaar.",foto:P.dish3},
    {id:2,cat:"Wijntip",naam:"Barossa Valley Shiraz 2021",desc:"Krachtig, kruidig — past perfect bij het vlees",prijs:"€8/glas",tip:"Ook als aperitief aanprijzen.",foto:P.wine},
  ],
  upsells: [
    {id:1,naam:"Late check-out",how:"'Wilt u langer genieten? We hebben nog ruimte tot 23:30.'",extra:"+omzet",ico:"clock"},
    {id:2,naam:"Wijnparing bij menu",how:"'Mag ik een wijnparing aanraden? Onze sommelier heeft vanavond drie perfecte combinaties.'",extra:"+€35",ico:"wine"},
    {id:3,naam:"Dessert suggestie",how:"'Onze chocolade fondant is vanavond een must — gemaakt door de chef zelf.'",extra:"+€12",ico:"star"},
  ],
};

const DEMO_MENU = [
  {id:1,naam:"Wagyu entrecôte 200g",cat:"Hoofdgerecht",desc:"Truffelboter, pommes dauphine, haricots verts",prijs:"€49",foto:P.dish3,allergens:["Lactose"],veg:false,special:true},
  {id:2,naam:"Gegrilde sint-jakobsschelp",cat:"Voorgerecht",desc:"Bloemkoolpurée, crispy capers, citroenboter",prijs:"€19",foto:P.dish1,allergens:["Schaaldieren","Lactose"],veg:false},
  {id:3,naam:"Burrata met heirloom tomaten",cat:"Voorgerecht",desc:"Pesto, rucola, balsamico",prijs:"€15",foto:P.dish4,allergens:["Lactose"],veg:true},
  {id:4,naam:"Risotto wilde paddenstoelen",cat:"Hoofdgerecht",desc:"Parmezaan, truffelolie, verse kruiden",prijs:"€26",foto:P.dish5,allergens:["Lactose","Gluten"],veg:true},
  {id:5,naam:"Zeebaars in zoutkorst",cat:"Hoofdgerecht",desc:"Venkel, aïoli, olijfolie",prijs:"€34",foto:P.dish2,allergens:["Vis","Ei"],veg:false},
];

const QUIZ = [
  {id:1,v:"Wat is onze merkbelofte?",o:["Snel en efficiënt bedienen","Elk gerecht vertelt een verhaal","De laagste prijs in de stad","Maximale omzet per tafel"],c:1,u:"Dit is de kern van wie we zijn."},
  {id:2,v:"Hoe ga je om met een klacht?",o:["Doorverwijzen naar manager","Empathie eerst, oplossing daarna","Korting aanbieden","Ontkennen"],c:1,u:"Empathie voor alles — dan pas de oplossing."},
  {id:3,v:"Wat doe je bij twijfel over allergenen?",o:["Zelf inschatten","De gast geruststellen","Altijd naar de chef","Het menukaartje laten lezen"],c:2,u:"Nooit gokken. Altijd naar de chef."},
  {id:4,v:"Hoe upsell je op de juiste manier?",o:["Door te pushen op prijs","Door enthousiast kennis te delen","Door korting te bieden","Snel door de kaart lopen"],c:1,u:"Kennis en passie verkopen — niet de prijs."},
  {id:5,v:"Wanneer vraag je naar dieetwensen?",o:["Als de gast erom vraagt","Nooit","Proactief bij elke tafel","Alleen bij groepen"],c:2,u:"Altijd proactief — dat is gastvrijheid."},
];

// ── LOADER ────────────────────────────────────────────────────
function Loader() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",flexDirection:"column",gap:16}}>
      <div style={{width:32,height:32,border:`3px solid ${C.g200}`,borderTopColor:C.terracotta,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:12,color:C.g400,fontFamily:sans,letterSpacing:"0.1em",textTransform:"uppercase"}}>Laden...</div>
    </div>
  );
}

// ── TAG COMPONENT ─────────────────────────────────────────────
function CatTag({cat}) {
  const map = {
    "keuken":  [C.creamDark, C.terracotta],
    "groep":   ["#EFF6FF", "#1E40AF"],
    "service": ["#F0FDF4", "#15803D"],
    "F&B":     [C.creamDark, C.terracotta],
    "Merk":    ["#F5F0FF", "#6D28D9"],
    "Service": ["#F0FDF4", "#15803D"],
    "Veiligheid":["#FFF7ED","#C2410C"],
    "Kennis":  [C.creamDark, C.terracotta],
  };
  const [bg, txt] = map[cat] || [C.creamDark, C.g600];
  return <span style={g.tag(bg,txt)}>{cat}</span>;
}

// ── LOGIN ─────────────────────────────────────────────────────
function Login({onLogin}) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("medewerker");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [naam, setNaam] = useState("");
  const [rest, setRest] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    setErr(""); setLoading(true);
    try {
      const auth = await sb.signIn(email, pass);
      if (auth.error) { setErr(auth.error.message); setLoading(false); return; }
      const emps = await sb.get("employees", `email=eq.${email}`);
      if (!emps || emps.length === 0) { setErr("Geen account gevonden."); setLoading(false); return; }
      onLogin({...emps[0], token:auth.access_token});
    } catch(e) { setErr("Fout: "+e.message); }
    setLoading(false);
  }

  async function doRegister() {
    setErr(""); setLoading(true);
    if (!naam||!email||!pass||!rest) { setErr("Vul alle velden in"); setLoading(false); return; }
    if (pass.length < 6) { setErr("Wachtwoord minimaal 6 tekens"); setLoading(false); return; }
    try {
      const auth = await sb.signUp(email, pass);
      if (auth.error) { setErr("Auth: "+auth.error.message); setLoading(false); return; }
      const hotels = await sb.post("hotels", {name:rest, city:""});
      const hotelId = Array.isArray(hotels) ? hotels[0]?.id : hotels?.id;
      if (!hotelId) { setErr("Restaurant aanmaken mislukt. Controleer Supabase RLS."); setLoading(false); return; }
      await sb.post("employees", {name:naam,email,hotel_id:hotelId,role:"manager",department:"Management",status:"actief",progress:100});
      setMode("success");
    } catch(e) { setErr("Fout: "+e.message); }
    setLoading(false);
  }

  if (mode==="success") return (
    <div style={{...g.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24}}>
      <div style={{textAlign:"center",maxWidth:320}}>
        <div style={{fontSize:56,marginBottom:16}}>✓</div>
        <div style={{...g.h2,marginBottom:8}}>Account aangemaakt</div>
        <div style={{...g.body,color:C.g600,marginBottom:24}}>Controleer je e-mail voor bevestiging. Daarna kun je inloggen.</div>
        <button style={g.btn} onClick={() => setMode("login")}>Naar inloggen →</button>
      </div>
    </div>
  );

  return (
    <div style={{...g.app,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      {/* Hero */}
      <div style={{height:280,overflow:"hidden",position:"relative"}}>
        <img src={P.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.45)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"28px 24px"}}>
          <div style={{fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",fontFamily:sans,marginBottom:8}}>Restaurant Onboarding Platform</div>
          <div style={{fontFamily:abolition,fontSize:42,color:C.white,letterSpacing:"0.05em",textTransform:"uppercase",lineHeight:1}}>ServeReady</div>
          <div style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:8,fontStyle:"italic"}}>Elk gerecht vertelt een verhaal.</div>
        </div>
      </div>

      <div style={{flex:1,padding:"28px 20px"}}>
        <div style={{display:"flex",border:`1px solid ${C.g200}`,borderRadius:4,overflow:"hidden",marginBottom:20}}>
          {[["login","Inloggen"],["register","Nieuw restaurant"]].map(([m,l]) => (
            <button key={m} onClick={() => {setMode(m);setErr("");}} style={{flex:1,padding:11,border:"none",cursor:"pointer",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:sans,background:mode===m?C.terracotta:C.white,color:mode===m?C.white:C.g600,transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>

        {err && <div style={g.err}>{err}</div>}

        {mode==="login" && (
          <>
            <div style={g.fgroup}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jouw@restaurant.nl"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></div>
            <button style={{...g.btn,opacity:loading?0.6:1}} onClick={doLogin} disabled={loading}>{loading?"Inloggen...":"Inloggen →"}</button>
            <p style={{textAlign:"center",marginTop:12,fontSize:11,color:C.g400,fontFamily:sans}}>Demo: vul gegevens in van geregistreerd account</p>
          </>
        )}
        {mode==="register" && (
          <>
            <div style={g.fgroup}><label style={g.lbl}>Jouw naam</label><input style={g.input} value={naam} onChange={e=>setNaam(e.target.value)} placeholder="Volledige naam"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Restaurantnaam</label><input style={g.input} value={rest} onChange={e=>setRest(e.target.value)} placeholder="Restaurant De Keuken"/></div>
            <div style={g.fgroup}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="manager@restaurant.nl"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Minimaal 6 tekens"/></div>
            <button style={{...g.btn,opacity:loading?0.6:1}} onClick={doRegister} disabled={loading}>{loading?"Registreren...":"Restaurant registreren →"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── CHAT ──────────────────────────────────────────────────────
function ChatTab({user, hotelId}) {
  const [messages, setMessages] = useState([
    {id:1,naam:"Lena Visser",role:"Chef de rang",tekst:"Goede avond team! Tafels 7-9 zijn gereserveerd voor de groep Philips. Extra aandacht graag.",tijd:"17:15",kleur:C.terracotta},
    {id:2,naam:"Lars Bakker",role:"Bar",tekst:"Ontvangen! Bar is klaar. Welkomstdrankjes staan klaar voor de groep.",tijd:"17:22",kleur:C.black},
    {id:3,naam:"Daan Mulder",role:"Sommelier",tekst:"Wagyu is vanavond uitverkocht na 20:00. Alternatieven: zeebaars of risotto aanprijzen.",tijd:"17:45",kleur:C.red},
  ]);
  const [tekst, setTekst] = useState("");
  const [kanaal, setKanaal] = useState("algemeen");
  const bottomRef = useRef(null);

  const kanalen = [
    {id:"algemeen",label:"Algemeen",ico:"users"},
    {id:"keuken",label:"Keuken",ico:"fire"},
    {id:"service",label:"Service",ico:"user"},
    {id:"manager",label:"Manager",ico:"star"},
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  function stuur() {
    if (!tekst.trim()) return;
    setMessages([...messages, {
      id:Date.now(), naam:user.name, role:user.department,
      tekst, tijd:new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"}),
      kleur:C.terracotta, kanaal, eigen:true,
    }]);
    setTekst("");
  }

  const gefilterd = messages.filter(m => !m.kanaal || m.kanaal === kanaal);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 150px)"}}>
      {/* Kanalen */}
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {kanalen.map(k => (
          <button key={k.id} onClick={() => setKanaal(k.id)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${kanaal===k.id?C.terracotta:C.g200}`,background:kanaal===k.id?C.terracotta:"transparent",color:kanaal===k.id?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans,display:"flex",alignItems:"center",gap:6}}>
            <Ic n={k.ico} s={12} c={kanaal===k.id?C.white:C.g600}/>
            {k.label}
          </button>
        ))}
      </div>

      {/* Berichten */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:16}}>
        {gefilterd.map(m => {
          const eigen = m.naam === user.name;
          return (
            <div key={m.id} style={{display:"flex",flexDirection:eigen?"row-reverse":"row",gap:10,marginBottom:16,alignItems:"flex-start"}}>
              {!eigen && (
                <div style={{width:36,height:36,borderRadius:"50%",background:m.kleur,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontFamily:abolition,fontSize:14,color:C.white}}>{m.naam[0]}</span>
                </div>
              )}
              <div style={{maxWidth:"75%"}}>
                {!eigen && (
                  <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:4}}>
                    <span style={{fontFamily:sans,fontSize:12,fontWeight:"bold",color:C.black}}>{m.naam}</span>
                    <span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{m.role}</span>
                  </div>
                )}
                <div style={{background:eigen?C.terracotta:C.white,color:eigen?C.white:C.black,padding:"10px 14px",borderRadius:eigen?"14px 14px 4px 14px":"14px 14px 14px 4px",border:eigen?"none":`1px solid ${C.g200}`,fontSize:14,fontFamily:sans,lineHeight:1.6}}>
                  {m.tekst}
                </div>
                <div style={{fontSize:10,color:C.g400,fontFamily:sans,marginTop:4,textAlign:eigen?"right":"left"}}>{m.tijd}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:10,alignItems:"center",paddingTop:12,borderTop:`1px solid ${C.g200}`}}>
        <input
          style={{...g.input,flex:1,borderRadius:24,padding:"10px 16px"}}
          value={tekst}
          onChange={e=>setTekst(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&stuur()}
          placeholder={`Bericht in #${kanaal}...`}
        />
        <button onClick={stuur} style={{width:42,height:42,borderRadius:"50%",background:C.terracotta,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <Ic n="send" s={16} c={C.white}/>
        </button>
      </div>
    </div>
  );
}

// ── VANDAAG TAB ───────────────────────────────────────────────
function VandaagTab() {
  const [sec, setSec] = useState("overzicht");
  return (
    <>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {[["overzicht","Overzicht"],["team","Team"],["specials","F&B"],["upsells","Upsells"]].map(([k,l]) => (
          <button key={k} onClick={()=>setSec(k)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${sec===k?C.terracotta:C.g200}`,background:sec===k?C.terracotta:"transparent",color:sec===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
        ))}
      </div>

      {sec==="overzicht" && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            {[[DEMO_DIENST.reservations,"Reserveringen"],[DEMO_DIENST.covers,"Couverts"]].map(([v,l]) => (
              <div key={l} style={{...g.cardWarm,textAlign:"center",padding:16,marginBottom:0}}>
                <div style={{fontFamily:abolition,fontSize:32,color:C.terracotta,lineHeight:1}}>{v}</div>
                <div style={{...g.lbl,marginBottom:0,textAlign:"center"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={g.lbl}>Planning avond</div>
          <div style={{position:"relative",paddingLeft:22}}>
            <div style={{position:"absolute",left:4,top:6,bottom:6,width:2,background:C.g200,borderRadius:2}}/>
            {DEMO_DIENST.events.map(e => (
              <div key={e.id} style={{display:"flex",gap:12,marginBottom:14,position:"relative"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:e.cat==="keuken"?C.terracotta:e.cat==="groep"?"#3B82F6":C.g400,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1,background:C.white,border:`1px solid ${C.g200}`,borderRadius:4,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{fontFamily:abolition,fontSize:14,color:C.black,textTransform:"uppercase"}}>{e.title}</div>
                    <span style={{fontSize:11,fontFamily:sans,color:C.g600}}>{e.time}</span>
                  </div>
                  <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{e.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sec==="team" && (
        <>
          <div style={{fontFamily:sans,fontSize:13,color:C.g600,marginBottom:16,fontStyle:"italic"}}>{DEMO_DIENST.shift}</div>
          {DEMO_DIENST.team.map(m => (
            <div key={m.id} style={{display:"flex",gap:14,alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:m.kleur,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontFamily:abolition,fontSize:18,color:C.white}}>{m.name[0]}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:abolition,fontSize:16,textTransform:"uppercase",color:C.black}}>{m.name}</div>
                <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:2}}>{m.role}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <Ic n="clock" s={12} c={C.g400}/>
                <span style={{fontSize:11,fontFamily:sans,color:C.g400}}>{m.shift}</span>
              </div>
            </div>
          ))}
          <div style={{...g.cardWarm,marginTop:20,textAlign:"center",padding:24}}>
            <div style={{fontFamily:abolition,fontSize:22,color:C.terracotta,textTransform:"uppercase",marginBottom:8}}>Vanavond werken we samen</div>
            <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.7}}>{DEMO_DIENST.team.length} collega's · {DEMO_DIENST.covers} gasten · Maak het bijzonder.</div>
          </div>
        </>
      )}

      {sec==="specials" && (
        <>
          <div style={{height:120,borderRadius:4,overflow:"hidden",marginBottom:14,position:"relative"}}>
            <img src={P.service} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.55)"}}/>
            <div style={{position:"absolute",inset:0,padding:16,display:"flex",alignItems:"flex-end"}}>
              <div style={{fontFamily:abolition,fontSize:24,color:C.white,textTransform:"uppercase"}}>Specials van vanavond</div>
            </div>
          </div>
          {DEMO_DIENST.specials.map(sp => (
            <div key={sp.id} style={{...g.card,borderLeft:`3px solid ${C.terracotta}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <CatTag cat={sp.cat}/>
                <span style={{fontFamily:abolition,fontSize:16,color:C.terracotta}}>{sp.prijs}</span>
              </div>
              <div style={{fontFamily:abolition,fontSize:18,color:C.black,textTransform:"uppercase",marginBottom:4}}>{sp.naam}</div>
              <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:10}}>{sp.desc}</div>
              <div style={{background:C.creamDark,borderRadius:4,padding:"8px 12px",fontSize:12,fontFamily:sans,color:C.terracotta,fontStyle:"italic"}}>💬 {sp.tip}</div>
            </div>
          ))}
        </>
      )}

      {sec==="upsells" && (
        <>
          <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:16,lineHeight:1.7}}>Elke extra verkoop telt. Gebruik kennis — niet druk.</div>
          {DEMO_DIENST.upsells.map(u => (
            <div key={u.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{width:40,height:40,borderRadius:4,background:C.terracotta,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic n={u.ico} s={18} c={C.white}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontFamily:abolition,fontSize:15,textTransform:"uppercase",color:C.black}}>{u.naam}</div>
                  <span style={{fontSize:12,fontFamily:sans,fontWeight:"bold",color:C.terracotta}}>{u.extra}</span>
                </div>
                <div style={{fontSize:12,color:C.g600,fontFamily:sans,fontStyle:"italic"}}>{u.how}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ── MENU TAB ──────────────────────────────────────────────────
function MenuTab() {
  const [actief, setActief] = useState(null);
  const cats = [...new Set(DEMO_MENU.map(m=>m.cat))];
  const [cat, setCat] = useState(cats[0]);

  if (actief) return (
    <div>
      <button onClick={()=>setActief(null)} style={{...g.btnSmOut,marginBottom:16}}>← Terug</button>
      <div style={{height:200,borderRadius:4,overflow:"hidden",marginBottom:16}}>
        <img src={actief.foto} alt={actief.naam} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>
      <div style={{fontFamily:abolition,fontSize:26,textTransform:"uppercase",marginBottom:6}}>{actief.naam}</div>
      <div style={{fontSize:14,color:C.g600,fontFamily:sans,marginBottom:12,lineHeight:1.7}}>{actief.desc}</div>
      <div style={{fontFamily:abolition,fontSize:22,color:C.terracotta,marginBottom:16}}>{actief.prijs}</div>
      <div style={g.lbl}>Allergenen</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {actief.allergens.map(a=><span key={a} style={g.tag(C.creamDark,C.terracotta)}>{a}</span>)}
      </div>
      {actief.veg && <div style={{...g.cardWarm,display:"flex",gap:8,alignItems:"center",padding:"10px 14px"}}><Ic n="leaf" s={16} c={C.terracotta}/><span style={{fontSize:13,fontFamily:sans,color:C.terracotta}}>Vegetarisch</span></div>}
      {actief.special && <div style={{...g.card,display:"flex",gap:8,alignItems:"center",padding:"10px 14px",marginTop:8,borderLeft:`3px solid ${C.terracotta}`}}><Ic n="star" s={16} c={C.terracotta}/><span style={{fontSize:13,fontFamily:sans,color:C.terracotta}}>Aanbevolen voor upselling vanavond</span></div>}
    </div>
  );

  return (
    <>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${cat===c?C.terracotta:C.g200}`,background:cat===c?C.terracotta:"transparent",color:cat===c?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{c}</button>
        ))}
      </div>
      {DEMO_MENU.filter(m=>m.cat===cat).map(item=>(
        <div key={item.id} onClick={()=>setActief(item)} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.g200}`,cursor:"pointer"}}>
          <div style={{width:72,height:72,borderRadius:4,overflow:"hidden",flexShrink:0}}>
            <img src={item.foto} alt={item.naam} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{fontFamily:abolition,fontSize:15,textTransform:"uppercase",color:C.black}}>{item.naam}</div>
              <span style={{fontFamily:abolition,fontSize:14,color:C.terracotta}}>{item.prijs}</span>
            </div>
            <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginBottom:6,lineHeight:1.5}}>{item.desc}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {item.allergens.slice(0,2).map(a=><span key={a} style={g.tag(C.creamDark,C.terracotta)}>{a}</span>)}
              {item.veg && <span style={g.tag("#F0FDF4","#15803D")}>Veg</span>}
              {item.special && <span style={g.tag(C.creamDark,C.terracotta)}>★ Special</span>}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ── MERKQUIZ TAB ──────────────────────────────────────────────
function MerkquizTab() {
  const [idx, setIdx] = useState(0);
  const [antwoorden, setAntwoorden] = useState({});
  const [klaar, setKlaar] = useState(false);
  const score = Object.entries(antwoorden).filter(([i,a])=>QUIZ[i].c===a).length;

  if (klaar) return (
    <div>
      <div style={{textAlign:"center",padding:"20px 0 28px"}}>
        <div style={{fontFamily:abolition,fontSize:72,color:score>=4?C.terracotta:C.g400,textTransform:"uppercase",lineHeight:1}}>{score}/{QUIZ.length}</div>
        <div style={{fontFamily:abolition,fontSize:24,textTransform:"uppercase",marginBottom:8}}>{score===QUIZ.length?"Perfect!":score>=3?"Goed gedaan!":"Probeer opnieuw"}</div>
        <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.7}}>{score===QUIZ.length?"Jij bent klaar voor de dienst.":score>=3?"Lees de uitleg van de gemiste vragen.":"Neem het merkverhaal opnieuw door."}</div>
      </div>
      {QUIZ.map((q,i)=>{
        const correct = antwoorden[i]===q.c;
        return (
          <div key={q.id} style={{...g.card,borderLeft:`3px solid ${correct?C.terracotta:C.red}`,marginBottom:8}}>
            <div style={{fontFamily:abolition,fontSize:13,textTransform:"uppercase",marginBottom:4}}>{q.v}</div>
            <div style={{fontSize:12,fontFamily:sans,color:correct?C.terracotta:C.red,marginBottom:4}}>{correct?"✓ Correct":`✗ Juist: "${q.o[q.c]}"`}</div>
            <div style={{fontSize:12,fontFamily:sans,color:C.g600,fontStyle:"italic"}}>{q.u}</div>
          </div>
        );
      })}
      <div style={{marginTop:16}}><button style={g.btn} onClick={()=>{setIdx(0);setAntwoorden({});setKlaar(false);}}>Opnieuw proberen</button></div>
    </div>
  );

  const q = QUIZ[idx];
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,fontFamily:sans,color:C.g600}}>Vraag {idx+1} van {QUIZ.length}</span>
        <span style={{fontSize:11,fontFamily:sans,color:C.terracotta,fontWeight:"bold"}}>{Math.round((idx/QUIZ.length)*100)}%</span>
      </div>
      <div style={{...g.progress,marginBottom:24}}><div style={g.bar(Math.round((idx/QUIZ.length)*100))}/></div>
      <div style={{fontFamily:abolition,fontSize:22,textTransform:"uppercase",marginBottom:24,lineHeight:1.3,color:C.black}}>{q.v}</div>
      {q.o.map((opt,j)=>{
        const sel = antwoorden[idx]===j;
        return (
          <div key={j} onClick={()=>setAntwoorden({...antwoorden,[idx]:j})} style={{padding:"13px 16px",borderRadius:4,marginBottom:8,cursor:"pointer",border:`1px solid ${sel?C.terracotta:C.g200}`,background:sel?C.terracotta:C.white,color:sel?C.white:C.black,transition:"all 0.15s",fontSize:14,fontFamily:sans}}>{opt}</div>
        );
      })}
      <div style={{display:"flex",gap:10,marginTop:20}}>
        {idx>0 && <button style={{...g.btnOut,flex:1}} onClick={()=>setIdx(idx-1)}>← Terug</button>}
        {antwoorden[idx]!==undefined && (
          idx<QUIZ.length-1
            ? <button style={{...g.btn,flex:1}} onClick={()=>setIdx(idx+1)}>Volgende →</button>
            : <button style={{...g.btn,flex:1}} onClick={()=>setKlaar(true)}>Resultaat →</button>
        )}
      </div>
    </>
  );
}

// ── TRAINING TAB ──────────────────────────────────────────────
function TrainingTab({user, hotelId}) {
  const [modules, setModules] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actief, setActief] = useState(null);
  const [step, setStep] = useState("lees");

  useEffect(()=>{loadData();},[]);

  async function loadData() {
    setLoading(true);
    const mods = await sb.get("modules",`hotel_id=eq.${hotelId}`);
    setModules(Array.isArray(mods)?mods:[]);
    const comps = await sb.get("completions",`employee_id=eq.${user.id}`);
    setCompletions(Array.isArray(comps)?comps.map(c=>c.module_id):[]);
    setLoading(false);
  }

  async function afronden() {
    await sb.post("completions",{employee_id:user.id,module_id:actief.id});
    const nieuw = [...new Set([...completions,actief.id])];
    const pct = modules.length>0?Math.round((nieuw.length/modules.length)*100):0;
    await sb.patch("employees",{progress:pct,status:pct===100?"afgerond":"actief"},`id=eq.${user.id}`);
    setCompletions(nieuw);
    setStep("klaar");
  }

  const pct = modules.length>0?Math.round((completions.length/modules.length)*100):0;

  if (loading) return <Loader/>;

  if (actief) return (
    <div>
      <div style={{height:160,borderRadius:4,overflow:"hidden",marginBottom:0,position:"relative"}}>
        <img src={P.kitchen} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.45)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:16}}>
          <button onClick={()=>{setActief(null);setStep("lees");}} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:4,color:C.white,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:sans,alignSelf:"flex-start"}}>← Terug</button>
          <div>
            <CatTag cat={actief.department}/>
            <div style={{fontFamily:abolition,fontSize:22,color:C.white,textTransform:"uppercase",marginTop:8}}>{actief.title}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.g200}`}}>
        {["Lezen","Bevestigen","Klaar"].map((s,i)=>{
          const cur=(step==="lees"&&i===0)||(step==="bevestig"&&i===1)||(step==="klaar"&&i===2);
          return <div key={s} style={{flex:1,padding:12,textAlign:"center",borderBottom:cur?`2px solid ${C.terracotta}`:"2px solid transparent"}}><span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:cur?C.terracotta:C.g400,fontFamily:sans}}>{s}</span></div>;
        })}
      </div>
      <div style={{padding:"20px 0 80px"}}>
        {step==="lees" && <><p style={g.body}>{actief.content||"Geen inhoud toegevoegd."}</p><div style={{marginTop:24}}><button style={g.btn} onClick={()=>setStep("bevestig")}>Ik heb dit gelezen →</button></div></>}
        {step==="bevestig" && <><div style={{...g.cardWarm,marginBottom:20}}><p style={{fontSize:14,fontFamily:sans,lineHeight:1.7}}>Ik heb de module <strong>"{actief.title}"</strong> volledig doorgelezen en begrijp de inhoud.</p></div><button style={g.btn} onClick={afronden}>Bevestigen & afronden →</button></>}
        {step==="klaar" && <div style={{textAlign:"center",paddingTop:32}}><div style={{fontFamily:abolition,fontSize:64,color:C.terracotta,textTransform:"uppercase"}}>✓</div><div style={{fontFamily:abolition,fontSize:24,textTransform:"uppercase",marginBottom:8}}>Module afgerond</div><div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:28}}>Certificaat opgeslagen · {new Date().toLocaleDateString("nl-NL")}</div><button style={g.btn} onClick={()=>{setActief(null);setStep("lees");loadData();}}>← Terug naar overzicht</button></div>}
      </div>
    </div>
  );

  return (
    <>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:11,color:C.g600,fontFamily:sans}}>Voortgang</span>
          <span style={{fontFamily:abolition,fontSize:16,color:C.terracotta}}>{pct}%</span>
        </div>
        <div style={g.progress}><div style={g.bar(pct)}/></div>
        <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:6}}>{completions.length} van {modules.length} modules afgerond</div>
      </div>
      {modules.length===0 && <div style={{...g.card,textAlign:"center",color:C.g400,padding:32}}><div style={{fontFamily:abolition,fontSize:18,textTransform:"uppercase",marginBottom:8}}>Nog geen modules</div><div style={{fontSize:13,fontFamily:sans}}>Je manager voegt binnenkort trainingen toe.</div></div>}
      {modules.map(m=>{
        const isDone = completions.includes(m.id);
        return (
          <div key={m.id} onClick={()=>{setActief(m);setStep("lees");}} style={{marginBottom:10,cursor:"pointer",border:`1px solid ${isDone?C.terracotta:C.g200}`,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:88,overflow:"hidden",position:"relative",background:C.black}}>
              <img src={P.kitchen} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:isDone?"brightness(0.3)":"brightness(0.5)"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
                <div>
                  <CatTag cat={m.department}/>
                  <div style={{color:C.white,fontFamily:abolition,fontSize:15,textTransform:"uppercase",marginTop:6}}>{m.title}</div>
                  <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontFamily:sans,marginTop:2}}>{m.duration}</div>
                </div>
                <div style={{width:32,height:32,borderRadius:"50%",background:isDone?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isDone?<Ic n="check" s={15} c={C.terracotta}/>:<Ic n="arrow" s={14} c={C.white}/>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── EMPLOYEE APP ──────────────────────────────────────────────
function EmployeeApp({user, onLogout}) {
  const [tab, setTab] = useState("vandaag");
  const tabs = [["vandaag","today","Vandaag"],["menu","menu","Kaart"],["quiz","star","Merkquiz"],["chat","chat","Chat"],["training","train","Training"]];

  return (
    <div style={g.app}>
      <nav style={g.nav}>
        <div style={g.logo}>ServeReady</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.terracotta,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:abolition,fontSize:14,color:C.white}}>{user.name[0]}</span>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="logout" s={18} c={C.g400}/></button>
        </div>
      </nav>

      <div style={g.page}>
        {tab==="vandaag" && (<><div style={g.h1}>Vandaag</div><div style={{...g.sub,marginBottom:18}}>{DEMO_DIENST.date}</div><VandaagTab/></>)}
        {tab==="menu"    && (<><div style={g.h1}>Menukaart</div><div style={{...g.sub,marginBottom:18}}>Ken elk gerecht · ken elk verhaal</div><MenuTab/></>)}
        {tab==="quiz"    && (<><div style={g.h1}>Merkquiz</div><div style={{...g.sub,marginBottom:18}}>Test je kennis — elke dienst</div><MerkquizTab/></>)}
        {tab==="chat"    && (<><div style={g.h1}>Chat</div><div style={{...g.sub,marginBottom:18}}>Team communicatie</div><ChatTab user={user} hotelId={user.hotel_id}/></>)}
        {tab==="training"&& (<><div style={g.h1}>Training</div><div style={{...g.sub,marginBottom:18}}>Onboarding modules</div><TrainingTab user={user} hotelId={user.hotel_id}/></>)}
      </div>

      <div style={g.bnav}>
        {tabs.map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terracotta:C.g400}/>
            <span style={g.ntxt(tab===key)}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MANAGER APP ───────────────────────────────────────────────
function ManagerApp({user, onLogout}) {
  const [tab, setTab] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showAddMod, setShowAddMod] = useState(false);
  const [newEmp, setNewEmp] = useState({name:"",email:"",department:"Bediening"});
  const [newMod, setNewMod] = useState({title:"",department:"Service",content:"",duration:"15 min"});
  const [msg, setMsg] = useState("");

  useEffect(()=>{loadData();},[]);

  async function loadData() {
    setLoading(true);
    const emps = await sb.get("employees",`hotel_id=eq.${user.hotel_id}&role=eq.medewerker`);
    setEmployees(Array.isArray(emps)?emps:[]);
    const mods = await sb.get("modules",`hotel_id=eq.${user.hotel_id}`);
    setModules(Array.isArray(mods)?mods:[]);
    setLoading(false);
  }

  async function addEmployee() {
    if (!newEmp.name||!newEmp.email) return;
    await sb.post("employees",{...newEmp,hotel_id:user.hotel_id,role:"medewerker",status:"nieuw",progress:0});
    setMsg(`${newEmp.name} toegevoegd ✓`);
    setNewEmp({name:"",email:"",department:"Bediening"});
    setShowAddEmp(false);
    loadData();
  }

  async function addModule() {
    if (!newMod.title) return;
    await sb.post("modules",{...newMod,hotel_id:user.hotel_id});
    setMsg(`Module "${newMod.title}" aangemaakt ✓`);
    setNewMod({title:"",department:"Service",content:"",duration:"15 min"});
    setShowAddMod(false);
    loadData();
  }

  const avg = employees.length?Math.round(employees.reduce((a,e)=>a+(e.progress||0),0)/employees.length):0;

  return (
    <div style={g.app}>
      <div style={{height:110,overflow:"hidden",position:"relative"}}>
        <img src={P.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.4)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"14px 20px"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",fontFamily:sans}}>ServeReady Manager</div>
            <div style={{fontFamily:abolition,fontSize:20,color:C.white,textTransform:"uppercase"}}>{user.name}</div>
          </div>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:4,padding:"6px 10px",cursor:"pointer"}}>
            <Ic n="logout" s={16} c={C.white}/>
          </button>
        </div>
      </div>

      <div style={g.page}>
        {msg && <div style={g.ok}>{msg}</div>}
        {loading ? <Loader/> : (
          <>
            {tab==="dashboard" && (
              <>
                <div style={g.h1}>Dashboard</div>
                <div style={g.sub}>Restaurant overzicht</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>
                  {[[employees.length,"Team"],[avg+"%","Voortgang"],[employees.filter(e=>e.status==="afgerond").length,"Afgerond"]].map(([v,l])=>(
                    <div key={l} style={{...g.cardWarm,textAlign:"center",padding:16,marginBottom:0}}>
                      <div style={{fontFamily:abolition,fontSize:26,color:C.terracotta,lineHeight:1}}>{v}</div>
                      <div style={{...g.lbl,marginBottom:0,textAlign:"center"}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={g.lbl}>Team voortgang</div>
                {employees.map(e=>(
                  <div key={e.id} style={g.card}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div>
                        <div style={{fontFamily:abolition,fontSize:16,textTransform:"uppercase"}}>{e.name}</div>
                        <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{e.department}</div>
                      </div>
                      <span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:e.status==="afgerond"?C.terracotta:C.g400,fontFamily:sans}}>{e.status}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{...g.progress,flex:1}}><div style={g.bar(e.progress||0)}/></div>
                      <span style={{fontSize:11,fontFamily:sans,color:C.g600}}>{e.progress||0}%</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab==="team" && (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={g.h1}>Team</div>
                  <button style={g.btnSm} onClick={()=>setShowAddEmp(!showAddEmp)}><span style={{display:"flex",alignItems:"center",gap:6}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</span></button>
                </div>
                <div style={g.sub}>{employees.length} medewerkers</div>
                {showAddEmp && (
                  <div style={{...g.cardWarm,marginBottom:20}}>
                    <div style={g.fgroup}><label style={g.lbl}>Naam</label><input style={g.input} value={newEmp.name} onChange={e=>setNewEmp({...newEmp,name:e.target.value})} placeholder="Volledige naam"/></div>
                    <div style={g.fgroup}><label style={g.lbl}>E-mail</label><input style={g.input} type="email" value={newEmp.email} onChange={e=>setNewEmp({...newEmp,email:e.target.value})} placeholder="naam@restaurant.nl"/></div>
                    <div style={g.fgroup}><label style={g.lbl}>Afdeling</label>
                      <select style={g.input} value={newEmp.department} onChange={e=>setNewEmp({...newEmp,department:e.target.value})}>
                        {["Bediening","Keuken","Bar","Sommelier","Runner","Chef de rang"].map(d=><option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={g.btnSm} onClick={addEmployee}>Opslaan</button>
                      <button style={g.btnSmOut} onClick={()=>setShowAddEmp(false)}>Annuleren</button>
                    </div>
                  </div>
                )}
                {employees.map(e=>(
                  <div key={e.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${C.g200}`}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:C.terracotta,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontFamily:abolition,fontSize:16,color:C.white}}>{e.name[0]}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:abolition,fontSize:15,textTransform:"uppercase"}}>{e.name}</div>
                      <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{e.department} · {e.email}</div>
                      <div style={{...g.progress,marginTop:6}}><div style={g.bar(e.progress||0)}/></div>
                    </div>
                    <button onClick={()=>sb.delete("employees",`id=eq.${e.id}`).then(loadData)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                      <Ic n="x" s={16} c={C.g400}/>
                    </button>
                  </div>
                ))}
              </>
            )}

            {tab==="modules" && (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={g.h1}>Modules</div>
                  <button style={g.btnSm} onClick={()=>setShowAddMod(!showAddMod)}><span style={{display:"flex",alignItems:"center",gap:6}}><Ic n="plus" s={14} c={C.white}/>Nieuw</span></button>
                </div>
                <div style={g.sub}>{modules.length} trainingen</div>
                {showAddMod && (
                  <div style={{...g.cardWarm,marginBottom:20}}>
                    <div style={g.fgroup}><label style={g.lbl}>Titel</label><input style={g.input} value={newMod.title} onChange={e=>setNewMod({...newMod,title:e.target.value})} placeholder="bijv. Gastvrijheid & service"/></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div style={g.fgroup}><label style={g.lbl}>Afdeling</label>
                        <select style={g.input} value={newMod.department} onChange={e=>setNewMod({...newMod,department:e.target.value})}>
                          {["Service","Keuken","Merk","Veiligheid","Kennis","Algemeen"].map(d=><option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div style={g.fgroup}><label style={g.lbl}>Duur</label><input style={g.input} value={newMod.duration} onChange={e=>setNewMod({...newMod,duration:e.target.value})} placeholder="15 min"/></div>
                    </div>
                    <div style={g.fgroup}><label style={g.lbl}>Inhoud</label><textarea style={{...g.input,minHeight:80,resize:"vertical"}} value={newMod.content} onChange={e=>setNewMod({...newMod,content:e.target.value})} placeholder="Beschrijf de module inhoud..."/></div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={g.btnSm} onClick={addModule}>Opslaan</button>
                      <button style={g.btnSmOut} onClick={()=>setShowAddMod(false)}>Annuleren</button>
                    </div>
                  </div>
                )}
                {modules.map(m=>(
                  <div key={m.id} style={{...g.card,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><CatTag cat={m.department}/></div>
                      <div style={{fontFamily:abolition,fontSize:16,textTransform:"uppercase",marginBottom:4}}>{m.title}</div>
                      <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{m.duration}</div>
                    </div>
                    <button onClick={()=>sb.delete("modules",`id=eq.${m.id}`).then(loadData)} style={{background:"none",border:"none",cursor:"pointer",padding:4,marginLeft:10}}>
                      <Ic n="x" s={16} c={C.g400}/>
                    </button>
                  </div>
                ))}
              </>
            )}

            {tab==="chat" && (
              <>
                <div style={g.h1}>Chat</div>
                <div style={g.sub}>Team communicatie</div>
                <ChatTab user={user} hotelId={user.hotel_id}/>
              </>
            )}
          </>
        )}
      </div>

      <div style={g.bnav}>
        {[["dashboard","grid","Dashboard"],["team","users","Team"],["modules","menu","Modules"],["chat","chat","Chat"]].map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terracotta:C.g400}/>
            <span style={g.ntxt(tab===key)}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <Login onLogin={setUser}/>;
  if (user.role==="manager") return <ManagerApp user={user} onLogout={()=>setUser(null)}/>;
  return <EmployeeApp user={user} onLogout={()=>setUser(null)}/>;
}
