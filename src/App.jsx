import React, { useState, useEffect, useRef } from "react";

// ── FONTS ─────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap";
document.head.appendChild(fl);

const SUPABASE_URL = "https://fewkgzetgdvbiawlkrfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2tnemV0Z2R2Ymlhd2xrcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTI4MDAsImV4cCI6MjA5MzAyODgwMH0.IT479cyv9t8FlVzbcuO9W7oeF8Q0uHS-UNwIVYe3bbM";

const sb = {
  h: { "Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}` },
  async get(t,f=""){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*${f?"&"+f:""}`,{headers:this.h});return r.json();},
  async post(t,d){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:{...this.h,"Prefer":"return=representation"},body:JSON.stringify(d)});return r.json();},
  async patch(t,d,f){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${f}`,{method:"PATCH",headers:{...this.h,"Prefer":"return=representation"},body:JSON.stringify(d)});return r.json();},
  async del(t,f){await fetch(`${SUPABASE_URL}/rest/v1/${t}?${f}`,{method:"DELETE",headers:this.h});},
  async signUp(e,p){const r=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:JSON.stringify({email:e,password:p})});return r.json();},
  async signIn(e,p){const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:JSON.stringify({email:e,password:p})});return r.json();},
};

// ── DESIGN ────────────────────────────────────────────────────
const C = {
  terra: "#c96949", red: "#e94d41", cream: "#fff5ed",
  creamDark: "#fde8d8", creamDeep: "#f5d5be",
  black: "#1a1008", white: "#ffffff",
  g100: "#faf5f0", g200: "#ecddd2", g400: "#b09888",
  g600: "#7a5c4a", g800: "#3d2a1e",
};

const sans = "'PT Sans', system-ui, sans-serif";

// Abolition via CSS
const styleEl = document.createElement("style");
styleEl.textContent = `
  @import url('https://fonts.cdnfonts.com/css/abolition');
  .abo { font-family: 'Abolition', 'Impact', sans-serif !important; text-transform: uppercase; letter-spacing: 0.04em; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
  @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
`;
document.head.appendChild(styleEl);

// ── PHOTOS ────────────────────────────────────────────────────
const P = {
  hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  team: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80",
  service: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  guest: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
  kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  dish1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  dish2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  dish3: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
};

// ── ICONS ─────────────────────────────────────────────────────
const Ic = ({ n, s=20, c=C.black }) => {
  const a = { width:s, height:s, viewBox:"0 0 24 24", fill:"none", stroke:c, strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" };
  const map = {
    heart:    <svg {...a}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    star:     <svg {...a}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    today:    <svg {...a}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
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
    menu:     <svg {...a}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    sun:      <svg {...a}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon:     <svg {...a}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    award:    <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    message:  <svg {...a}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    fire:     <svg {...a}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>,
    clock:    <svg {...a}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert:    <svg {...a}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    arrow:    <svg {...a}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    sparkle:  <svg {...a}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>,
  };
  return map[n] || null;
};

// ── STYLES ────────────────────────────────────────────────────
const g = {
  app:    { fontFamily:sans, background:C.cream, minHeight:"100vh", color:C.black, maxWidth:430, margin:"0 auto" },
  nav:    { background:C.white, borderBottom:`1px solid ${C.g200}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 12px rgba(201,105,73,0.08)" },
  page:   { padding:"20px 18px 100px" },
  h1:     { fontSize:30, fontFamily:"'Abolition','Impact',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2, lineHeight:1.1, color:C.black },
  h2:     { fontSize:22, fontFamily:"'Abolition','Impact',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em", color:C.black },
  h3:     { fontSize:16, fontFamily:"'Abolition','Impact',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em", color:C.black },
  sub:    { color:C.g600, fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:20, fontFamily:sans },
  lbl:    { fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.g400, display:"block", marginBottom:6, fontFamily:sans },
  body:   { fontSize:14, lineHeight:1.85, color:C.g800, fontFamily:sans },
  card:   { background:C.white, border:`1px solid ${C.g200}`, borderRadius:8, padding:18, marginBottom:10 },
  warm:   { background:C.creamDark, border:`1px solid ${C.terra}22`, borderRadius:8, padding:18, marginBottom:10 },
  input:  { background:C.white, border:`1px solid ${C.g200}`, borderRadius:6, padding:"11px 14px", color:C.black, fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", fontFamily:sans, transition:"border-color 0.2s" },
  btn:    { background:C.terra, color:C.white, border:"none", borderRadius:6, padding:"13px 24px", fontSize:13, fontWeight:"bold", letterSpacing:"0.06em", cursor:"pointer", width:"100%", fontFamily:sans, transition:"opacity 0.2s" },
  btnOut: { background:"transparent", color:C.terra, border:`1.5px solid ${C.terra}`, borderRadius:6, padding:"12px 24px", fontSize:13, fontWeight:"bold", cursor:"pointer", width:"100%", fontFamily:sans },
  btnSm:  { background:C.terra, color:C.white, border:"none", borderRadius:6, padding:"8px 16px", fontSize:11, fontWeight:"bold", cursor:"pointer", fontFamily:sans },
  btnSmO: { background:"transparent", color:C.terra, border:`1px solid ${C.terra}55`, borderRadius:6, padding:"7px 14px", fontSize:11, cursor:"pointer", fontFamily:sans },
  divider:{ height:1, background:C.g200, margin:"18px 0" },
  prog:   { height:4, background:C.g200, borderRadius:2, overflow:"hidden" },
  bar:    (p,c=C.terra)=>({ height:"100%", width:`${p}%`, background:c, borderRadius:2, transition:"width 0.6s ease" }),
  bnav:   { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.white, borderTop:`1px solid ${C.g200}`, display:"flex", padding:"8px 0 18px", zIndex:100, boxShadow:"0 -4px 20px rgba(201,105,73,0.08)" },
  nbtn:   (a)=>({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", padding:"4px 0", background:"none", border:"none", color:a?C.terra:C.g400 }),
  ntxt:   (a)=>({ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:a?"bold":"normal", color:"inherit", fontFamily:sans }),
  fg:     { marginBottom:14 },
  err:    { background:"#fff0f0", border:`1px solid ${C.red}44`, borderRadius:6, padding:"10px 14px", fontSize:13, color:C.red, fontFamily:sans, marginBottom:14 },
  ok:     { background:"#f0fff4", border:"1px solid #86EFAC", borderRadius:6, padding:"10px 14px", fontSize:13, color:"#15803D", fontFamily:sans, marginBottom:14 },
};

// ── HELPERS ───────────────────────────────────────────────────
function Avatar({name, size=40, bg=C.terra}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:size*0.42,color:C.white,textTransform:"uppercase"}}>{name?.[0]}</span>
    </div>
  );
}

function Tag({label, color=C.terra, bg=C.creamDark}) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",background:bg,color,fontFamily:sans,fontWeight:"bold"}}>{label}</span>;
}

function Loader() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",flexDirection:"column",gap:16}}>
      <div style={{width:32,height:32,border:`3px solid ${C.g200}`,borderTopColor:C.terra,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontSize:12,color:C.g400,fontFamily:sans,letterSpacing:"0.1em",textTransform:"uppercase"}}>Laden...</div>
    </div>
  );
}

// ── DEMO DATA ─────────────────────────────────────────────────
const INSPIRATIE = [
  { zin: "Een gast vergeet wat je zei. Een gast vergeet wat je deed. Maar een gast vergeet nooit hoe je ze liet voelen.", auteur: "Maya Angelou (bewerkt)" },
  { zin: "Gastvrijheid is niet iets wat je doet. Het is iets wat je bent.", auteur: "Danny Meyer" },
  { zin: "De beste service is die waarbij de gast niet eens merkt dat er service is.", auteur: "" },
  { zin: "Elk bord dat de keuken verlaat is een handtekening. Elke tafel die je bedient is een verhaal.", auteur: "" },
  { zin: "Een glimlach kost niets en is het mooiste gerecht dat je kunt serveren.", auteur: "" },
];

const COMPLIMENTEN_DEMO = [
  { id:1, van:"Lena Visser", aan:"Daan Mulder", tekst:"Daan, jouw wijnadvies vanavond bij tafel 7 was perfect. De gasten waren diep onder de indruk. Zo maakt jij het verschil!", tijd:"Gisteren", avatar:C.terra, likes:3 },
  { id:2, van:"Manager", aan:"Fatima El-Hassan", tekst:"Fatima heeft vanavond een bijzonder moment gecreëerd voor een stel dat hun jubileum vierde. Spontaan bloemen geregeld. Dát is gastvrijheid.", tijd:"2 dagen geleden", avatar:C.red, likes:7 },
  { id:3, van:"Sara Nguyen", aan:"Lars Bakker", tekst:"Lars, jouw welkomstcocktail voor de verjaardag van gast mevrouw Janssen — ze stond te stralen. Chapeau!", tijd:"3 dagen geleden", avatar:C.g600, likes:5 },
];

const FEEDBACK_DEMO = [
  { id:1, bron:"Google", gast:"Anoniem", ster:5, tekst:"Het personeel maakte onze avond onvergetelijk. Zelden zo'n warme bediening meegemaakt.", tijd:"Vandaag", tag:"Service" },
  { id:2, bron:"TripAdvisor", gast:"Familie De Boer", ster:5, tekst:"De sommelier wist precies wat we zochten zonder dat we het zelf wisten. Absolute aanrader!", tijd:"Gisteren", tag:"Kennis" },
  { id:3, bron:"Google", gast:"Anoniem", ster:4, tekst:"Heerlijk eten. Enige minpuntje: iets te lang wachten bij het dessert.", tijd:"2 dagen geleden", tag:"Timing" },
];

const DIENST_DATA = {
  datum: new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}),
  shift: "Avonddienst · 17:00–23:30",
  covers: 112,
  reserveringen: 47,
  gasten_bijzonder: [
    { naam:"Fam. Hendriksen", tafel:"12", info:"25-jarig huwelijksjubileum. Graag een verrassing." },
    { naam:"Dhr. Martens", tafel:"6", info:"Vaste gast. Drinkt altijd Barossa Shiraz. Geeft grote fooi bij goede service." },
    { naam:"Groep Philips", tafel:"7-9", info:"14 personen, zakelijk diner. Geen alcohol op de rekening." },
  ],
  team: [
    {id:1,name:"Lena Visser",role:"Chef de rang",shift:"17:00–23:30",bg:C.terra},
    {id:2,name:"Daan Mulder",role:"Sommelier",shift:"17:00–23:30",bg:C.red},
    {id:3,name:"Fatima El-Hassan",role:"Bediening",shift:"17:30–23:00",bg:C.g600},
    {id:4,name:"Lars Bakker",role:"Bar",shift:"16:00–00:00",bg:C.black},
  ],
  nadienstVragen: [
    "Welk moment van vanavond was jouw hoogtepunt?",
    "Welke gast verraste jou?",
    "Wat zou je morgen anders doen?",
    "Wie in het team verdient een compliment?",
  ],
};

const MODULES_DEMO = [
  { id:"d1", title:"Ons merkverhaal", department:"Merk", duration:"10 min", photo:P.service, content:"Wij zijn meer dan een restaurant. Wij zijn een plek waar herinneringen worden gemaakt. Onze filosofie: elk gerecht vertelt een verhaal, elke gast vertrekt met een gevoel. Gastvrijheid is niet wat we doen — het is wie we zijn." },
  { id:"d2", title:"De kunst van gastvrijheid", department:"Service", duration:"20 min", photo:P.guest, content:"Gastvrijheid begint vóórdat de gast gaat zitten. Oogcontact bij binnenkomst. Begroeting binnen 30 seconden. Water zonder te vragen. Onze belofte: elke gast voelt zich de enige gast van de avond." },
  { id:"d3", title:"Allergenen & veiligheid", department:"Veiligheid", duration:"15 min", photo:P.kitchen, content:"Allergenen zijn levensreddend. De 14 verplichte allergenen ken je uit je hoofd. Bij twijfel ga je altijd naar de chef. Nooit gokken. Kruisbesmetting vermijden. Proactief vragen bij elke tafel." },
];

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
  const inspiratie = INSPIRATIE[new Date().getDay() % INSPIRATIE.length];

  async function doLogin() {
    setErr(""); setLoading(true);
    try {
      const auth = await sb.signIn(email, pass);
      if (auth.error) { setErr(auth.error.message); setLoading(false); return; }
      const emps = await sb.get("employees", `email=eq.${email}`);
      if (!emps?.length) { setErr("Geen account gevonden."); setLoading(false); return; }
      onLogin({...emps[0], token:auth.access_token});
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }

  async function doRegister() {
    setErr(""); setLoading(true);
    if (!naam||!email||!pass||!rest) { setErr("Vul alle velden in"); setLoading(false); return; }
    if (pass.length < 6) { setErr("Wachtwoord minimaal 6 tekens"); setLoading(false); return; }
    try {
      const auth = await sb.signUp(email, pass);
      if (auth.error) { setErr(auth.error.message); setLoading(false); return; }
      const hotels = await sb.post("hotels", {name:rest, city:""});
      const hotelId = Array.isArray(hotels)?hotels[0]?.id:hotels?.id;
      if (!hotelId) { setErr("Restaurant aanmaken mislukt. Controleer RLS in Supabase."); setLoading(false); return; }
      await sb.post("employees", {name:naam,email,hotel_id:hotelId,role:"manager",department:"Management",status:"actief",progress:100});
      setMode("success");
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }

  if (mode==="success") return (
    <div style={{...g.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24}}>
      <div style={{textAlign:"center",maxWidth:300}}>
        <div style={{fontSize:52,marginBottom:16}}>✓</div>
        <div style={{...g.h2,marginBottom:8}}>Welkom!</div>
        <div style={{...g.body,color:C.g600,marginBottom:24}}>Account aangemaakt. Controleer je e-mail en log in.</div>
        <button style={g.btn} onClick={()=>setMode("login")}>Naar inloggen →</button>
      </div>
    </div>
  );

  return (
    <div style={{...g.app,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{height:300,overflow:"hidden",position:"relative"}}>
        <img src={P.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.35)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"28px 24px"}}>
          <div style={{fontSize:10,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",fontFamily:sans,marginBottom:10}}>Restaurant Platform</div>
          <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:46,color:C.white,textTransform:"uppercase",lineHeight:1,letterSpacing:"0.04em"}}>ServeReady</div>
          <div style={{height:2,width:48,background:C.terra,margin:"14px 0"}}/>
          <div style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.65)",fontStyle:"italic",lineHeight:1.6,maxWidth:280}}>"{inspiratie.zin}"</div>
        </div>
      </div>

      <div style={{flex:1,padding:"28px 20px"}}>
        <div style={{display:"flex",border:`1px solid ${C.g200}`,borderRadius:6,overflow:"hidden",marginBottom:20}}>
          {[["login","Inloggen"],["register","Nieuw restaurant"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:11,border:"none",cursor:"pointer",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:sans,background:mode===m?C.terra:C.white,color:mode===m?C.white:C.g600,transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
        {err && <div style={g.err}>{err}</div>}
        {mode==="login" && (<>
          <div style={g.fg}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jouw@restaurant.nl"/></div>
          <div style={g.fg}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></div>
          <button style={{...g.btn,opacity:loading?.6:1}} onClick={doLogin} disabled={loading}>{loading?"Inloggen...":"Inloggen →"}</button>
        </>)}
        {mode==="register" && (<>
          <div style={g.fg}><label style={g.lbl}>Jouw naam</label><input style={g.input} value={naam} onChange={e=>setNaam(e.target.value)} placeholder="Volledige naam"/></div>
          <div style={g.fg}><label style={g.lbl}>Restaurantnaam</label><input style={g.input} value={rest} onChange={e=>setRest(e.target.value)} placeholder="Restaurant De Keuken"/></div>
          <div style={g.fg}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="manager@restaurant.nl"/></div>
          <div style={g.fg}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Minimaal 6 tekens"/></div>
          <button style={{...g.btn,opacity:loading?.6:1}} onClick={doRegister} disabled={loading}>{loading?"Registreren...":"Restaurant registreren →"}</button>
        </>)}
      </div>
    </div>
  );
}

// ── VOOR DE DIENST ────────────────────────────────────────────
function VoorDienst() {
  const inspiratie = INSPIRATIE[new Date().getDay() % INSPIRATIE.length];
  const [sectie, setSectie] = useState("inspiratie");

  return (
    <>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {[["inspiratie","✦ Inspiratie"],["gasten","Gasten van vanavond"],["team","Team"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSectie(k)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${sectie===k?C.terra:C.g200}`,background:sectie===k?C.terra:"transparent",color:sectie===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans,fontWeight:sectie===k?"bold":"normal"}}>{l}</button>
        ))}
      </div>

      {sectie==="inspiratie" && (
        <>
          {/* Quote van de dag */}
          <div style={{background:`linear-gradient(135deg, ${C.terra}, ${C.red})`,borderRadius:10,padding:"28px 24px",marginBottom:18,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,fontSize:120,opacity:0.08,fontFamily:"serif",color:C.white,lineHeight:1}}>"</div>
            <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",fontFamily:sans,marginBottom:12}}>Gastvrijheid van de dag</div>
            <div style={{fontFamily:sans,fontSize:16,color:C.white,lineHeight:1.7,fontStyle:"italic",marginBottom:16}}>"{inspiratie.zin}"</div>
            {inspiratie.auteur && <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontFamily:sans}}>— {inspiratie.auteur}</div>}
          </div>

          {/* Hoe ga jij dit toepassen? */}
          <div style={g.card}>
            <div style={{...g.h3,marginBottom:4}}>Hoe pas jij dit toe vanavond?</div>
            <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:12,lineHeight:1.6}}>Eén concrete actie — hoe maak jij vanavond het verschil voor een gast?</div>
            <textarea style={{...g.input,minHeight:72,resize:"none"}} placeholder="bijv. Ik onthoud de naam van elke gast die ik begroet..."/>
            <button style={{...g.btnSm,marginTop:10}}>Vastleggen</button>
          </div>

          {/* Gastvrijheidstips */}
          <div style={{...g.lbl,marginTop:8}}>Tips voor vanavond</div>
          {[
            {ico:"sparkle",tip:"Begroet elke gast met oogcontact en gebruik hun naam zodra je die kent."},
            {ico:"heart",tip:"Als een gast aarzelt bij het menu — bied je persoonlijke favoriet aan. Dat creëert vertrouwen."},
            {ico:"star",tip:"Een verrassing hoeft niet groot te zijn. Een extra amuse of een handgeschreven kaartje maakt het onvergetelijk."},
          ].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.g200}`}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.creamDark,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic n={t.ico} s={17} c={C.terra}/>
              </div>
              <div style={{fontSize:13,color:C.g800,fontFamily:sans,lineHeight:1.6,paddingTop:4}}>{t.tip}</div>
            </div>
          ))}
        </>
      )}

      {sectie==="gasten" && (
        <>
          <div style={{...g.warm,marginBottom:16}}>
            <div style={{fontSize:12,color:C.terra,fontFamily:sans,fontWeight:"bold",marginBottom:4}}>Vanavond: {DIENST_DATA.covers} couverts · {DIENST_DATA.reserveringen} reserveringen</div>
            <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>Ken je gasten. Maak het persoonlijk.</div>
          </div>
          <div style={g.lbl}>Bijzondere gasten vanavond</div>
          {DIENST_DATA.gasten_bijzonder.map((gast,i)=>(
            <div key={i} style={{...g.card,borderLeft:`3px solid ${C.terra}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{...g.h3,fontSize:15}}>{gast.naam}</div>
                <Tag label={`Tafel ${gast.tafel}`} color={C.terra} bg={C.creamDark}/>
              </div>
              <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>
                <Ic n="alert" s={13} c={C.terra}/> {gast.info}
              </div>
            </div>
          ))}
          <div style={{...g.card,background:C.g100,textAlign:"center",padding:20}}>
            <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>Ken jij een vaste gast met een bijzondere wens? Laat het de manager weten via de chat.</div>
          </div>
        </>
      )}

      {sectie==="team" && (
        <>
          <div style={{fontFamily:sans,fontSize:13,color:C.g600,marginBottom:16,fontStyle:"italic"}}>{DIENST_DATA.shift}</div>
          {DIENST_DATA.team.map(m=>(
            <div key={m.id} style={{display:"flex",gap:14,alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${C.g200}`}}>
              <Avatar name={m.name} size={44} bg={m.bg}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:16,textTransform:"uppercase",color:C.black}}>{m.name}</div>
                <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:2}}>{m.role}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <Ic n="clock" s={12} c={C.g400}/>
                <span style={{fontSize:11,fontFamily:sans,color:C.g400}}>{m.shift}</span>
              </div>
            </div>
          ))}
          <div style={{background:`linear-gradient(135deg, ${C.terra}, ${C.red})`,borderRadius:10,padding:20,marginTop:16,textAlign:"center"}}>
            <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:20,color:C.white,textTransform:"uppercase",marginBottom:8}}>Samen maken we het verschil</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",fontFamily:sans,lineHeight:1.6}}>{DIENST_DATA.team.length} collega's · {DIENST_DATA.covers} gasten · Één avond om nooit te vergeten.</div>
          </div>
        </>
      )}
    </>
  );
}

// ── COMPLIMENTEN ──────────────────────────────────────────────
function ComplimentenTab({user}) {
  const [complimenten, setComplimenten] = useState(COMPLIMENTEN_DEMO);
  const [feedback, setFeedback] = useState(FEEDBACK_DEMO);
  const [sectie, setSectie] = useState("feed");
  const [nieuw, setNieuw] = useState({aan:"",tekst:""});
  const [likes, setLikes] = useState({});

  function stuurCompliment() {
    if (!nieuw.aan||!nieuw.tekst) return;
    setComplimenten([{
      id:Date.now(), van:user?.name||"Anoniem", aan:nieuw.aan, tekst:nieuw.tekst,
      tijd:"Zojuist", avatar:C.terra, likes:0
    }, ...complimenten]);
    setNieuw({aan:"",tekst:""});
  }

  function toggleLike(id) {
    setLikes(prev=>({...prev,[id]:!prev[id]}));
    setComplimenten(prev=>prev.map(c=>c.id===id?{...c,likes:likes[id]?c.likes-1:c.likes+1}:c));
  }

  const avgSter = feedback.reduce((a,f)=>a+f.ster,0)/feedback.length;

  return (
    <>
      <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:4}}>
        {[["feed","💬 Complimenten"],["feedback","⭐ Gastfeedback"],["stuur","✦ Stuur compliment"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSectie(k)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${sectie===k?C.terra:C.g200}`,background:sectie===k?C.terra:"transparent",color:sectie===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans,fontWeight:sectie===k?"bold":"normal"}}>{l}</button>
        ))}
      </div>

      {sectie==="feed" && (
        <>
          <div style={{...g.warm,display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div style={{fontSize:32}}>🏆</div>
            <div>
              <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:18,textTransform:"uppercase",color:C.terra}}>Team van de week</div>
              <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginTop:2}}>Jullie NPS score: 9.2 · {complimenten.length} complimenten deze week</div>
            </div>
          </div>
          {complimenten.map(c=>(
            <div key={c.id} style={{...g.card,marginBottom:12}} className="fade-up">
              <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                <Avatar name={c.van} size={40} bg={c.avatar}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <span style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:14,textTransform:"uppercase",color:C.black}}>{c.van}</span>
                      <span style={{fontSize:12,color:C.g400,fontFamily:sans,marginLeft:6}}>→ {c.aan}</span>
                    </div>
                    <span style={{fontSize:11,color:C.g400,fontFamily:sans}}>{c.tijd}</span>
                  </div>
                </div>
              </div>
              <div style={{fontSize:14,fontFamily:sans,lineHeight:1.7,color:C.g800,fontStyle:"italic",padding:"12px 14px",background:C.cream,borderRadius:6,marginBottom:10}}>"{c.tekst}"</div>
              <button onClick={()=>toggleLike(c.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:likes[c.id]?C.red:C.g400,fontFamily:sans,fontSize:12,padding:0}}>
                <Ic n="heart" s={16} c={likes[c.id]?C.red:C.g400}/>
                {c.likes} {c.likes===1?"reactie":"reacties"}
              </button>
            </div>
          ))}
        </>
      )}

      {sectie==="feedback" && (
        <>
          {/* Score samenvatting */}
          <div style={{background:`linear-gradient(135deg, ${C.terra}, ${C.red})`,borderRadius:10,padding:20,marginBottom:18,display:"flex",gap:20,alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:48,color:C.white,lineHeight:1}}>{avgSter.toFixed(1)}</div>
              <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",fontFamily:sans}}>Gemiddeld</div>
            </div>
            <div style={{flex:1}}>
              {[5,4,3].map(s=>{
                const count = feedback.filter(f=>f.ster===s).length;
                const pct = Math.round((count/feedback.length)*100);
                return (
                  <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontFamily:sans,minWidth:16}}>{s}★</span>
                    <div style={{...g.prog,flex:1,background:"rgba(255,255,255,0.2)"}}><div style={{...g.bar(pct,C.white)}}/></div>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontFamily:sans,minWidth:24}}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {feedback.map(f=>(
            <div key={f.id} style={{...g.card,borderLeft:`3px solid ${f.ster===5?C.terra:f.ster===4?C.g400:C.red}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <Tag label={f.bron} color={C.terra} bg={C.creamDark}/>
                  <Tag label={f.tag} color={C.g600} bg={C.g100}/>
                </div>
                <div style={{display:"flex",gap:2}}>
                  {[...Array(f.ster)].map((_,i)=><Ic key={i} n="star" s={13} c={C.terra}/>)}
                </div>
              </div>
              <div style={{fontSize:14,fontFamily:sans,lineHeight:1.7,fontStyle:"italic",color:C.g800,marginBottom:6}}>"{f.tekst}"</div>
              <div style={{fontSize:11,color:C.g400,fontFamily:sans}}>— {f.gast} · {f.tijd}</div>
            </div>
          ))}
        </>
      )}

      {sectie==="stuur" && (
        <>
          <div style={{...g.warm,marginBottom:20}}>
            <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:18,textTransform:"uppercase",color:C.terra,marginBottom:6}}>Erken je collega</div>
            <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>Een compliment kost niets en betekent alles. Deel het met het team.</div>
          </div>
          <div style={g.fg}><label style={g.lbl}>Voor wie?</label>
            <select style={g.input} value={nieuw.aan} onChange={e=>setNieuw({...nieuw,aan:e.target.value})}>
              <option value="">Kies een collega</option>
              {DIENST_DATA.team.map(m=><option key={m.id} value={m.name}>{m.name} · {m.role}</option>)}
            </select>
          </div>
          <div style={g.fg}><label style={g.lbl}>Jouw compliment</label>
            <textarea style={{...g.input,minHeight:100,resize:"none"}} value={nieuw.tekst} onChange={e=>setNieuw({...nieuw,tekst:e.target.value})} placeholder="Beschrijf het concrete moment dat jou opviel..."/>
          </div>
          <button style={g.btn} onClick={stuurCompliment}>Deel compliment →</button>
        </>
      )}
    </>
  );
}

// ── NA DE DIENST ──────────────────────────────────────────────
function NaDienst({user}) {
  const [antwoorden, setAntwoorden] = useState({});
  const [verstuurd, setVerstuurd] = useState(false);

  if (verstuurd) return (
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:52,marginBottom:16}}>🌙</div>
      <div style={{...g.h2,marginBottom:8}}>Dank je wel</div>
      <div style={{fontSize:14,color:C.g600,fontFamily:sans,lineHeight:1.7,maxWidth:280,margin:"0 auto"}}>Jouw reflectie helpt het team morgen beter te zijn. Tot de volgende dienst!</div>
    </div>
  );

  return (
    <>
      <div style={{...g.warm,marginBottom:20}}>
        <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:C.terra,fontFamily:sans,marginBottom:6}}>Einde dienst · Reflectie</div>
        <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:20,textTransform:"uppercase",color:C.black,marginBottom:6}}>Hoe was vanavond?</div>
        <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>Leer van elke dienst. Vier successen. Verbeter samen.</div>
      </div>
      {DIENST_DATA.nadienstVragen.map((v,i)=>(
        <div key={i} style={g.card}>
          <div style={{fontSize:14,fontWeight:"bold",fontFamily:sans,marginBottom:10,color:C.black}}>{v}</div>
          <textarea style={{...g.input,minHeight:68,resize:"none"}} value={antwoorden[i]||""} onChange={e=>setAntwoorden({...antwoorden,[i]:e.target.value})} placeholder="Jouw antwoord..."/>
        </div>
      ))}
      <div style={{height:12}}/>
      <button style={g.btn} onClick={()=>setVerstuurd(true)}>Reflectie versturen →</button>
    </>
  );
}

// ── CHAT TAB ──────────────────────────────────────────────────
function ChatTab({user}) {
  const [kanaal, setKanaal] = useState("algemeen");
  const [privé, setPrivé] = useState(null);
  const [berichten, setBerichten] = useState([
    {id:1,naam:"Lena Visser",role:"Chef de rang",tekst:"Goede avond! Tafel 12 viert jubileum — wie pakt dit op?",tijd:"17:15",bg:C.terra,kanaal:"algemeen",gelezen:[1,2]},
    {id:2,naam:"Manager",role:"Manager",tekst:"Fatima, kun jij tafel 12 nemen vanavond? Ik heb iets speciaals geregeld.",tijd:"17:18",bg:C.red,kanaal:"algemeen",gelezen:[1]},
    {id:3,naam:"Fatima El-Hassan",role:"Bediening",tekst:"Begrepen! Ik neem het over. Zijn er bijzonderheden?",tijd:"17:20",bg:C.g600,kanaal:"algemeen",gelezen:[1]},
    {id:4,naam:"Daan Mulder",role:"Sommelier",tekst:"Wagyu is uitverkocht na 20:00 — alternatieven: zeebaars of risotto.",tijd:"17:45",bg:C.black,kanaal:"keuken",gelezen:[1,3]},
  ]);
  const [tekst, setTekst] = useState("");
  const [showPrivé, setShowPrivé] = useState(false);
  const bottomRef = useRef(null);

  const kanalen = [{id:"algemeen",lbl:"Algemeen",ico:"users"},{id:"keuken",lbl:"Keuken",ico:"fire"},{id:"service",lbl:"Service",ico:"user"},{id:"manager",lbl:"Manager",ico:"star"}];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[berichten,kanaal]);

  function stuur() {
    if (!tekst.trim()) return;
    setBerichten([...berichten,{
      id:Date.now(),naam:user?.name||"Jij",role:user?.department||"",tekst,
      tijd:new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"}),
      bg:C.terra,kanaal:privé||kanaal,gelezen:[],eigen:true
    }]);
    setTekst("");
  }

  const gefilterd = berichten.filter(m=>m.kanaal===(privé||kanaal));
  const isManager = user?.role==="manager";

  if (showPrivé) return (
    <div>
      <button onClick={()=>setShowPrivé(false)} style={{...g.btnSmO,marginBottom:16}}>← Terug naar kanalen</button>
      <div style={{...g.h3,marginBottom:4}}>Privégesprek starten</div>
      <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:16}}>Kies een collega voor een privébericht:</div>
      {DIENST_DATA.team.map(m=>(
        <div key={m.id} onClick={()=>{setPrivé(`privé-${m.id}`);setShowPrivé(false);}} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.g200}`,cursor:"pointer"}}>
          <Avatar name={m.name} size={40} bg={m.bg}/>
          <div>
            <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:14,textTransform:"uppercase"}}>{m.name}</div>
            <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{m.role}</div>
          </div>
          <div style={{marginLeft:"auto"}}><Ic n="arrow" s={16} c={C.g400}/></div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 160px)"}}>
      {/* Kanalen */}
      {!privé && (
        <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
          {kanalen.map(k=>(
            <button key={k.id} onClick={()=>setKanaal(k.id)} style={{padding:"7px 12px",borderRadius:20,border:`1px solid ${kanaal===k.id?C.terra:C.g200}`,background:kanaal===k.id?C.terra:"transparent",color:kanaal===k.id?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans,display:"flex",alignItems:"center",gap:5}}>
              <Ic n={k.ico} s={11} c={kanaal===k.id?C.white:C.g600}/>{k.lbl}
            </button>
          ))}
          <button onClick={()=>setShowPrivé(true)} style={{padding:"7px 12px",borderRadius:20,border:`1px solid ${C.g200}`,background:"transparent",color:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans,display:"flex",alignItems:"center",gap:5}}>
            <Ic n="user" s={11} c={C.g400}/>Privé
          </button>
        </div>
      )}

      {privé && (
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"8px 12px",background:C.creamDark,borderRadius:6}}>
          <Ic n="user" s={16} c={C.terra}/>
          <span style={{fontSize:12,fontFamily:sans,color:C.terra,fontWeight:"bold"}}>Privégesprek</span>
          <button onClick={()=>setPrivé(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer"}}><Ic n="x" s={16} c={C.g400}/></button>
        </div>
      )}

      {/* Berichten */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
        {gefilterd.length===0 && (
          <div style={{textAlign:"center",padding:"40px 20px",color:C.g400,fontFamily:sans,fontSize:13}}>Nog geen berichten in dit kanaal.</div>
        )}
        {gefilterd.map(m=>{
          const eigen = m.naam===(user?.name||"Jij") || m.eigen;
          return (
            <div key={m.id} style={{display:"flex",flexDirection:eigen?"row-reverse":"row",gap:10,marginBottom:14,alignItems:"flex-start"}}>
              {!eigen && <Avatar name={m.naam} size={34} bg={m.bg}/>}
              <div style={{maxWidth:"78%"}}>
                {!eigen && (
                  <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:4}}>
                    <span style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:12,textTransform:"uppercase",color:C.black}}>{m.naam}</span>
                    <span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{m.role}</span>
                  </div>
                )}
                <div style={{background:eigen?C.terra:C.white,color:eigen?C.white:C.black,padding:"10px 14px",borderRadius:eigen?"14px 14px 4px 14px":"14px 14px 14px 4px",border:eigen?"none":`1px solid ${C.g200}`,fontSize:14,fontFamily:sans,lineHeight:1.6}}>{m.tekst}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,justifyContent:eigen?"flex-end":"flex-start"}}>
                  <span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{m.tijd}</span>
                  {/* Leesbevestiging — alleen voor manager */}
                  {isManager && m.gelezen?.length > 0 && (
                    <span style={{fontSize:10,color:C.terra,fontFamily:sans}}>✓✓ {m.gelezen.length} gelezen</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:10,alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.g200}`}}>
        <input style={{...g.input,flex:1,borderRadius:24,padding:"10px 16px"}} value={tekst} onChange={e=>setTekst(e.target.value)} onKeyDown={e=>e.key==="Enter"&&stuur()} placeholder={privé?"Privébericht...":`Bericht in #${kanaal}...`}/>
        <button onClick={stuur} style={{width:42,height:42,borderRadius:"50%",background:C.terra,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <Ic n="send" s={16} c={C.white}/>
        </button>
      </div>
    </div>
  );
}

// ── TRAINING TAB ──────────────────────────────────────────────
function TrainingTab({user}) {
  const [modules, setModules] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actief, setActief] = useState(null);
  const [step, setStep] = useState("lees");

  useEffect(()=>{loadData();},[]);

  async function loadData() {
    setLoading(true);
    const mods = await sb.get("modules",`hotel_id=eq.${user.hotel_id}`);
    const allMods = [...(Array.isArray(mods)?mods:[]),...MODULES_DEMO.map(m=>({...m,hotel_id:user.hotel_id,_demo:true}))];
    setModules(allMods);
    const comps = await sb.get("completions",`employee_id=eq.${user.id}`);
    setCompletions(Array.isArray(comps)?comps.map(c=>c.module_id):[]);
    setLoading(false);
  }

  async function afronden() {
    if (!actief._demo) {
      await sb.post("completions",{employee_id:user.id,module_id:actief.id});
      const nieuw = [...new Set([...completions,actief.id])];
      const pct = Math.round((nieuw.length/modules.length)*100);
      await sb.patch("employees",{progress:pct,status:pct===100?"afgerond":"actief"},`id=eq.${user.id}`);
      setCompletions(nieuw);
    }
    setStep("klaar");
  }

  const pct = modules.length>0?Math.round((completions.length/modules.length)*100):0;
  if (loading) return <Loader/>;

  if (actief) return (
    <div>
      <div style={{height:160,borderRadius:8,overflow:"hidden",marginBottom:0,position:"relative"}}>
        <img src={actief.photo||P.service} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.45)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:16}}>
          <button onClick={()=>{setActief(null);setStep("lees");}} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:4,color:C.white,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:sans,alignSelf:"flex-start"}}>← Terug</button>
          <div>
            <Tag label={actief.department} color={C.white} bg="rgba(255,255,255,0.2)"/>
            <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:22,color:C.white,textTransform:"uppercase",marginTop:8}}>{actief.title}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.g200}`}}>
        {["Lezen","Bevestigen","Klaar"].map((s,i)=>{
          const cur=(step==="lees"&&i===0)||(step==="bevestig"&&i===1)||(step==="klaar"&&i===2);
          return <div key={s} style={{flex:1,padding:12,textAlign:"center",borderBottom:cur?`2px solid ${C.terra}`:"2px solid transparent"}}><span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:cur?C.terra:C.g400,fontFamily:sans}}>{s}</span></div>;
        })}
      </div>
      <div style={{padding:"20px 0 80px"}}>
        {step==="lees" && <><p style={g.body}>{actief.content}</p><div style={{marginTop:24}}><button style={g.btn} onClick={()=>setStep("bevestig")}>Ik heb dit gelezen →</button></div></>}
        {step==="bevestig" && <><div style={{...g.warm,marginBottom:20}}><p style={{fontSize:14,fontFamily:sans,lineHeight:1.7}}>Ik heb <strong>"{actief.title}"</strong> gelezen en begrijp de inhoud.</p></div><button style={g.btn} onClick={afronden}>Bevestigen & afronden →</button></>}
        {step==="klaar" && <div style={{textAlign:"center",paddingTop:32}}>
          <div style={{fontSize:56,color:C.terra,marginBottom:16}}>✓</div>
          <div style={{...g.h2,marginBottom:8}}>Module afgerond</div>
          <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:28}}>Certificaat opgeslagen · {new Date().toLocaleDateString("nl-NL")}</div>
          <button style={g.btn} onClick={()=>{setActief(null);setStep("lees");loadData();}}>← Terug naar overzicht</button>
        </div>}
      </div>
    </div>
  );

  return (
    <>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:11,color:C.g600,fontFamily:sans}}>Voortgang onboarding</span>
          <span style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:16,color:C.terra}}>{pct}%</span>
        </div>
        <div style={g.prog}><div style={g.bar(pct)}/></div>
        <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:6}}>{completions.length} van {modules.length} modules afgerond</div>
      </div>
      {modules.map(m=>{
        const isDone = completions.includes(m.id);
        return (
          <div key={m.id} onClick={()=>{setActief(m);setStep("lees");}} style={{marginBottom:10,cursor:"pointer",border:`1.5px solid ${isDone?C.terra:C.g200}`,borderRadius:8,overflow:"hidden",transition:"border-color 0.2s"}}>
            <div style={{height:88,overflow:"hidden",position:"relative"}}>
              <img src={m.photo||P.service} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:isDone?"brightness(0.3)":"brightness(0.5)"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
                <div>
                  <Tag label={m.department} color={C.white} bg="rgba(255,255,255,0.15)"/>
                  <div style={{color:C.white,fontFamily:"'Abolition','Impact',sans-serif",fontSize:15,textTransform:"uppercase",marginTop:6}}>{m.title}</div>
                  <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontFamily:sans,marginTop:2}}>{m.duration}</div>
                </div>
                <div style={{width:32,height:32,borderRadius:"50%",background:isDone?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isDone?<Ic n="check" s={15} c={C.terra}/>:<Ic n="arrow" s={14} c={C.white}/>}
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
  const [dagDeel, setDagDeel] = useState(()=>{
    const h = new Date().getHours();
    return h<14?"voor":h<23?"tijdens":"na";
  });

  const tabs = [
    ["vandaag","today","Dienst"],
    ["team","heart","Team"],
    ["chat","chat","Chat"],
    ["training","train","Training"],
  ];

  return (
    <div style={g.app}>
      <nav style={g.nav}>
        <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:20,color:C.terra,textTransform:"uppercase",letterSpacing:"0.04em"}}>ServeReady</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={user?.name} size={32} bg={C.terra}/>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="logout" s={17} c={C.g400}/></button>
        </div>
      </nav>

      <div style={g.page}>
        {tab==="vandaag" && (
          <>
            <div style={g.h1}>Vandaag</div>
            <div style={{...g.sub,marginBottom:16}}>{DIENST_DATA.datum}</div>

            {/* Dag-navigatie */}
            <div style={{display:"flex",gap:0,border:`1px solid ${C.g200}`,borderRadius:8,overflow:"hidden",marginBottom:20}}>
              {[["voor","☀️ Vóór dienst"],["tijdens","🌇 Tijdens"],["na","🌙 Na dienst"]].map(([k,l])=>(
                <button key={k} onClick={()=>setDagDeel(k)} style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",fontSize:11,fontFamily:sans,background:dagDeel===k?C.terra:C.white,color:dagDeel===k?C.white:C.g600,transition:"all 0.2s",fontWeight:dagDeel===k?"bold":"normal"}}>{l}</button>
              ))}
            </div>

            {dagDeel==="voor" && <VoorDienst/>}
            {dagDeel==="tijdens" && (
              <>
                <div style={{...g.warm,marginBottom:16}}>
                  <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:18,color:C.terra,textTransform:"uppercase",marginBottom:4}}>Je bent live</div>
                  <div style={{fontSize:13,color:C.g600,fontFamily:sans}}>Dienst gestart · {DIENST_DATA.covers} gasten verwacht</div>
                </div>
                <div style={g.lbl}>Gasten van vanavond</div>
                {DIENST_DATA.gasten_bijzonder.map((gast,i)=>(
                  <div key={i} style={{...g.card,borderLeft:`3px solid ${C.terra}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:14,textTransform:"uppercase"}}>{gast.naam}</div>
                      <Tag label={`Tafel ${gast.tafel}`} color={C.terra} bg={C.creamDark}/>
                    </div>
                    <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>{gast.info}</div>
                  </div>
                ))}
                <div style={{...g.lbl,marginTop:8}}>Snel naar</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["chat","Chat team","chat"],["training","Menukaart","menu"]].map(([t,l,ico])=>(
                    <button key={t} onClick={()=>setTab(t)} style={{...g.card,textAlign:"center",cursor:"pointer",padding:16,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <Ic n={ico} s={22} c={C.terra}/>
                      <span style={{fontSize:12,fontFamily:sans,fontWeight:"bold",color:C.black}}>{l}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {dagDeel==="na" && <NaDienst user={user}/>}
          </>
        )}

        {tab==="team" && (
          <>
            <div style={g.h1}>Team & Gasten</div>
            <div style={{...g.sub,marginBottom:16}}>Verbondenheid · Inspiratie · Succes</div>
            <ComplimentenTab user={user}/>
          </>
        )}

        {tab==="chat" && (
          <>
            <div style={g.h1}>Chat</div>
            <div style={{...g.sub,marginBottom:16}}>Team communicatie</div>
            <ChatTab user={user}/>
          </>
        )}

        {tab==="training" && (
          <>
            <div style={g.h1}>Training</div>
            <div style={{...g.sub,marginBottom:16}}>Onboarding · Kennis · Groei</div>
            <TrainingTab user={user}/>
          </>
        )}
      </div>

      <div style={g.bnav}>
        {tabs.map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terra:C.g400}/>
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

  const avg = employees.length?Math.round(employees.reduce((a,e)=>a+(e.progress||0),0)/employees.length):0;

  return (
    <div style={g.app}>
      <div style={{height:110,overflow:"hidden",position:"relative"}}>
        <img src={P.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.35)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"14px 20px"}}>
          <div>
            <div style={{fontSize:9,letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",fontFamily:sans}}>ServeReady Manager</div>
            <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:22,color:C.white,textTransform:"uppercase"}}>{user.name}</div>
          </div>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:4,padding:"6px 10px",cursor:"pointer"}}>
            <Ic n="logout" s={16} c={C.white}/>
          </button>
        </div>
      </div>

      <div style={g.page}>
        {msg && <div style={g.ok}>{msg}</div>}
        {loading?<Loader/>:(
          <>
            {tab==="dashboard" && (
              <>
                <div style={g.h1}>Dashboard</div>
                <div style={g.sub}>Restaurant overzicht</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
                  {[[employees.length,"Team"],[avg+"%","Voortgang"],[employees.filter(e=>e.status==="afgerond").length,"Afgerond"]].map(([v,l])=>(
                    <div key={l} style={{...g.warm,textAlign:"center",padding:14,marginBottom:0}}>
                      <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:26,color:C.terra,lineHeight:1}}>{v}</div>
                      <div style={{...g.lbl,marginBottom:0,textAlign:"center"}}>{l}</div>
                    </div>
                  ))}
                </div>
                {/* Gastvrijheid KPIs */}
                <div style={{...g.card,borderLeft:`3px solid ${C.terra}`,marginBottom:20}}>
                  <div style={{...g.h3,marginBottom:12}}>Gastvrijheid KPIs</div>
                  {[["Gem. gastfeedback","9.2 / 10","star"],["Complimenten deze week","8","heart"],["Modules afgerond","74%","award"]].map(([lbl,val,ico])=>(
                    <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.g200}`}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <Ic n={ico} s={15} c={C.terra}/>
                        <span style={{fontSize:13,fontFamily:sans,color:C.g800}}>{lbl}</span>
                      </div>
                      <span style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:16,color:C.terra}}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={g.lbl}>Team voortgang</div>
                {employees.map(e=>(
                  <div key={e.id} style={g.card}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div>
                        <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:15,textTransform:"uppercase"}}>{e.name}</div>
                        <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{e.department}</div>
                      </div>
                      <span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:e.status==="afgerond"?C.terra:C.g400,fontFamily:sans}}>{e.status}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{...g.prog,flex:1}}><div style={g.bar(e.progress||0)}/></div>
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
                  <div style={{...g.warm,marginBottom:20}}>
                    <div style={g.fg}><label style={g.lbl}>Naam</label><input style={g.input} value={newEmp.name} onChange={e=>setNewEmp({...newEmp,name:e.target.value})} placeholder="Volledige naam"/></div>
                    <div style={g.fg}><label style={g.lbl}>E-mail</label><input style={g.input} type="email" value={newEmp.email} onChange={e=>setNewEmp({...newEmp,email:e.target.value})} placeholder="naam@restaurant.nl"/></div>
                    <div style={g.fg}><label style={g.lbl}>Rol</label>
                      <select style={g.input} value={newEmp.department} onChange={e=>setNewEmp({...newEmp,department:e.target.value})}>
                        {["Bediening","Chef de rang","Sommelier","Bar","Runner","Keuken"].map(d=><option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={g.btnSm} onClick={async()=>{if(!newEmp.name||!newEmp.email)return;await sb.post("employees",{...newEmp,hotel_id:user.hotel_id,role:"medewerker",status:"nieuw",progress:0});setMsg(`${newEmp.name} toegevoegd ✓`);setNewEmp({name:"",email:"",department:"Bediening"});setShowAddEmp(false);loadData();}}>Opslaan</button>
                      <button style={g.btnSmO} onClick={()=>setShowAddEmp(false)}>Annuleren</button>
                    </div>
                  </div>
                )}
                {employees.map(e=>(
                  <div key={e.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${C.g200}`}}>
                    <Avatar name={e.name} size={42} bg={C.terra}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:15,textTransform:"uppercase"}}>{e.name}</div>
                      <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{e.department} · {e.email}</div>
                      <div style={{...g.prog,marginTop:6}}><div style={g.bar(e.progress||0)}/></div>
                    </div>
                    <button onClick={()=>sb.del("employees",`id=eq.${e.id}`).then(loadData)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="x" s={16} c={C.g400}/></button>
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
                  <div style={{...g.warm,marginBottom:20}}>
                    <div style={g.fg}><label style={g.lbl}>Titel</label><input style={g.input} value={newMod.title} onChange={e=>setNewMod({...newMod,title:e.target.value})} placeholder="bijv. Gastvrijheid & service"/></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div style={g.fg}><label style={g.lbl}>Afdeling</label>
                        <select style={g.input} value={newMod.department} onChange={e=>setNewMod({...newMod,department:e.target.value})}>
                          {["Service","Keuken","Merk","Veiligheid","Kennis","Algemeen"].map(d=><option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div style={g.fg}><label style={g.lbl}>Duur</label><input style={g.input} value={newMod.duration} onChange={e=>setNewMod({...newMod,duration:e.target.value})} placeholder="15 min"/></div>
                    </div>
                    <div style={g.fg}><label style={g.lbl}>Inhoud</label><textarea style={{...g.input,minHeight:80,resize:"vertical"}} value={newMod.content} onChange={e=>setNewMod({...newMod,content:e.target.value})} placeholder="Beschrijf de module inhoud..."/></div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={g.btnSm} onClick={async()=>{if(!newMod.title)return;await sb.post("modules",{...newMod,hotel_id:user.hotel_id});setMsg(`Module aangemaakt ✓`);setShowAddMod(false);loadData();}}>Opslaan</button>
                      <button style={g.btnSmO} onClick={()=>setShowAddMod(false)}>Annuleren</button>
                    </div>
                  </div>
                )}
                {[...modules,...MODULES_DEMO].map(m=>(
                  <div key={m.id} style={{...g.card,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <Tag label={m.department} color={C.terra} bg={C.creamDark}/>
                      <div style={{fontFamily:"'Abolition','Impact',sans-serif",fontSize:15,textTransform:"uppercase",marginTop:6,marginBottom:2}}>{m.title}</div>
                      <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{m.duration}</div>
                    </div>
                    {!m._demo && <button onClick={()=>sb.del("modules",`id=eq.${m.id}`).then(loadData)} style={{background:"none",border:"none",cursor:"pointer",padding:4,marginLeft:10}}><Ic n="x" s={16} c={C.g400}/></button>}
                  </div>
                ))}
              </>
            )}

            {tab==="chat" && (
              <>
                <div style={g.h1}>Chat</div>
                <div style={g.sub}>Team communicatie · Leesbevestigingen aan</div>
                <ChatTab user={user}/>
              </>
            )}
          </>
        )}
      </div>

      <div style={g.bnav}>
        {[["dashboard","grid","Dashboard"],["team","users","Team"],["modules","menu","Modules"],["chat","chat","Chat"]].map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terra:C.g400}/>
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
