import React, { useState, useRef, useEffect } from "react";

// ── FONTS ─────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap";
document.head.appendChild(fl);
const styleEl = document.createElement("style");
styleEl.textContent = `
  @import url('https://fonts.cdnfonts.com/css/abolition');
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fu{animation:fadeUp 0.3s ease forwards}
  input:focus,textarea:focus,select:focus{border-color:#c96949!important;box-shadow:0 0 0 3px rgba(201,105,73,0.1)!important}
`;
document.head.appendChild(styleEl);

// ── SUPABASE ──────────────────────────────────────────────────
const SUPABASE_URL = "https://fewkgzetgdvbiawlkrfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2tnemV0Z2R2Ymlhd2xrcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTI4MDAsImV4cCI6MjA5MzAyODgwMH0.IT479cyv9t8FlVzbcuO9W7oeF8Q0uHS-UNwIVYe3bbM";
const sb = {
  h:{  "Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`},
  async get(t,f=""){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*${f?"&"+f:""}`,{headers:this.h});return r.json();},
  async post(t,d){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:{...this.h,"Prefer":"return=representation"},body:JSON.stringify(d)});return r.json();},
  async patch(t,d,f){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${f}`,{method:"PATCH",headers:{...this.h,"Prefer":"return=representation"},body:JSON.stringify(d)});return r.json();},
  async del(t,f){await fetch(`${SUPABASE_URL}/rest/v1/${t}?${f}`,{method:"DELETE",headers:this.h});},
  async signUp(e,p){const r=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:JSON.stringify({email:e,password:p})});return r.json();},
  async signIn(e,p){const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:JSON.stringify({email:e,password:p})});return r.json();},
};

// ── DESIGN TOKENS ─────────────────────────────────────────────
const C = {
  terra:"#c96949", red:"#e94d41", cream:"#fff5ed",
  creamD:"#fde8d8", black:"#1a1008", white:"#ffffff",
  g100:"#faf5f0", g200:"#ecddd2", g400:"#b09888", g600:"#7a5c4a",
};
const abo = "'Abolition','Impact',sans-serif";
const sans = "'PT Sans',system-ui,sans-serif";

// ── PHOTOS ────────────────────────────────────────────────────
const P = {
  hero:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  kitchen:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  service:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  guest:"https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
  dish1:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  dish2:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  dish3:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  dish4:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  dish5:"https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80",
  wine:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
};

// ── ICONS ─────────────────────────────────────────────────────
const Ic = ({n,s=20,c=C.black})=>{
  const a={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:c,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"};
  const map={
    heart:  <svg {...a}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    star:   <svg {...a}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    today:  <svg {...a}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    chat:   <svg {...a}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    train:  <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    users:  <svg {...a}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    user:   <svg {...a}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    grid:   <svg {...a}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    menu:   <svg {...a}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    check:  <svg {...a} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    logout: <svg {...a}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:   <svg {...a}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:      <svg {...a}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    send:   <svg {...a}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    spark:  <svg {...a}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>,
    trend:  <svg {...a}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    edit:   <svg {...a}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:  <svg {...a}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
    save:   <svg {...a}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    award:  <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    clock:  <svg {...a}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert:  <svg {...a}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    arrow:  <svg {...a}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    eye:    <svg {...a}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    leaf:   <svg {...a}><path d="M2 22l10-10"/><path d="M16 8c0 4.42-3.58 8-8 8a8 8 0 010-16c4.42 0 8 3.58 8 8z"/></svg>,
    search: <svg {...a}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    moon:   <svg {...a}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    sun:    <svg {...a}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
    fire:   <svg {...a}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>,
    wine:   <svg {...a}><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 005-5c0-2-.5-4-2-8H7c-1.5 4-2 6-2 8a5 5 0 005 5z"/></svg>,
  };
  return map[n]||null;
};

// ── SHARED STYLES ─────────────────────────────────────────────
const g = {
  app:    {fontFamily:sans,background:C.cream,minHeight:"100vh",color:C.black,maxWidth:430,margin:"0 auto"},
  nav:    {background:C.white,borderBottom:`1px solid ${C.g200}`,padding:"0 18px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100},
  navDark:{background:C.black,padding:"0 18px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100},
  page:   {padding:"18px 16px 96px"},
  h1:     {fontFamily:abo,fontSize:26,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:2,lineHeight:1.1,color:C.black},
  h2:     {fontFamily:abo,fontSize:20,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black},
  h3:     {fontFamily:abo,fontSize:15,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black},
  lbl:    {fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.g400,display:"block",marginBottom:5,fontFamily:sans},
  body:   {fontSize:14,lineHeight:1.85,color:C.g600,fontFamily:sans},
  sub:    {color:C.g600,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:20,fontFamily:sans},
  card:   {background:C.white,border:`1px solid ${C.g200}`,borderRadius:8,padding:16,marginBottom:10},
  warm:   {background:C.creamD,border:`1px solid ${C.terra}22`,borderRadius:8,padding:16,marginBottom:10},
  section:{background:C.white,border:`1px solid ${C.g200}`,borderRadius:10,marginBottom:10,overflow:"hidden"},
  secHead:{padding:"14px 16px",borderBottom:`1px solid ${C.g200}`,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"},
  input:  {background:C.white,border:`1px solid ${C.g200}`,borderRadius:6,padding:"10px 13px",color:C.black,fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",fontFamily:sans},
  btn:    {background:C.terra,color:C.white,border:"none",borderRadius:6,padding:"12px 20px",fontSize:12,fontWeight:"bold",letterSpacing:"0.06em",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:6,width:"100%",justifyContent:"center"},
  btnOut: {background:"transparent",color:C.terra,border:`1.5px solid ${C.terra}`,borderRadius:6,padding:"11px 20px",fontSize:12,fontWeight:"bold",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:6,width:"100%",justifyContent:"center"},
  btnSm:  {background:C.terra,color:C.white,border:"none",borderRadius:5,padding:"7px 13px",fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:5},
  btnSmO: {background:"transparent",color:C.terra,border:`1px solid ${C.terra}55`,borderRadius:5,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:sans},
  btnDng: {background:"transparent",color:C.red,border:`1px solid ${C.red}44`,borderRadius:5,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:sans},
  divider:{height:1,background:C.g200,margin:"14px 0"},
  prog:   {height:4,background:C.g200,borderRadius:2,overflow:"hidden"},
  bar:    (p,c=C.terra)=>({height:"100%",width:`${p}%`,background:c,borderRadius:2,transition:"width 0.5s ease"}),
  bnav:   {position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.white,borderTop:`1px solid ${C.g200}`,display:"flex",padding:"8px 0 16px",zIndex:100},
  bnavDark:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.black,borderTop:"1px solid #333",display:"flex",padding:"8px 0 16px",zIndex:100},
  nbtn:   (a,dark)=>({flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0",background:"none",border:"none",color:a?C.terra:dark?"#777":C.g400}),
  ntxt:   (a)=>({fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:a?"bold":"normal",color:"inherit",fontFamily:sans}),
  fg:     {marginBottom:12},
  err:    {background:"#fff0f0",border:`1px solid ${C.red}44`,borderRadius:6,padding:"10px 14px",fontSize:13,color:C.red,fontFamily:sans,marginBottom:12},
  ok:     {background:"#f0fff4",border:"1px solid #86EFAC",borderRadius:6,padding:"10px 14px",fontSize:13,color:"#15803D",fontFamily:sans,marginBottom:12,display:"flex",alignItems:"center",gap:8},
  tag:    (c=C.terra,bg=C.creamD)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:20,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",background:bg,color:c,fontFamily:sans,fontWeight:"bold"}),
};

// ── HELPERS ───────────────────────────────────────────────────
function Avatar({name,size=40,bg=C.terra}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:abo,fontSize:size*0.42,color:C.white,textTransform:"uppercase"}}>{name?.[0]}</span></div>;
}
function Tag({label,color=C.terra,bg=C.creamD}){
  return <span style={g.tag(color,bg)}>{label}</span>;
}
function Loader(){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",flexDirection:"column",gap:14}}><div style={{width:30,height:30,border:`3px solid ${C.g200}`,borderTopColor:C.terra,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><span style={{fontSize:11,color:C.g400,fontFamily:sans,letterSpacing:"0.1em",textTransform:"uppercase"}}>Laden...</span></div>;
}
function Toast({msg}){
  return msg?<div style={{...g.ok,position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",zIndex:300,maxWidth:380,width:"calc(100% - 32px)",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}><Ic n="check" s={15} c="#15803D"/>{msg}</div>:null;
}
function Sectie({icon,title,badge,children,defaultOpen=false,ac=C.terra}){
  const [open,setOpen]=useState(defaultOpen);
  return(
    <div style={g.section} className="fu">
      <div style={g.secHead} onClick={()=>setOpen(!open)}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:7,background:ac+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={icon} s={15} c={ac}/></div>
          <span style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",letterSpacing:"0.04em"}}>{title}</span>
          {badge&&<span style={g.tag(ac,ac+"18")}>{badge}</span>}
        </div>
        <span style={{color:C.g400,fontSize:16,transform:open?"rotate(45deg)":"rotate(0)",transition:"transform 0.2s",display:"inline-block"}}>+</span>
      </div>
      {open&&<div style={{padding:"14px 16px"}}>{children}</div>}
    </div>
  );
}

// ── DEMO DATA ─────────────────────────────────────────────────
const TIPS = [
  "Een gast vergeet wat je zei. Een gast vergeet wat je deed. Maar een gast vergeet nooit hoe je ze liet voelen.",
  "Gastvrijheid begint vóórdat de gast gaat zitten — oogcontact, een glimlach, een warme begroeting.",
  "Ken je menukaart als je eigen keuken. Passie voor het product is de beste upsell.",
  "Een klacht is een kans — de gast die klaagt en goed wordt geholpen, komt vaker terug.",
  "Gebruik de naam van de gast zodra je die kent. Niets klinkt zo aangenaam als de eigen naam.",
  "Een verrassing hoeft niet groot te zijn. Een extra amuse of handgeschreven kaartje maakt het onvergetelijk.",
  "Stil staan is stil gaan. Kijk rond, anticipeer, help voordat de gast erom vraagt.",
];
const ALLERGENEN = ["Gluten","Schaaldieren","Eieren","Vis","Pinda's","Soja","Melk","Noten","Selderij","Mosterd","Sesam","Sulfieten","Lupine","Weekdieren"];
const EMOJI_LIJST = ["🍷","🍇","🌸","🍸","⚡","🏔️","✍️","🎸","🌿","🔥","🎨","📚","🌊","🍕","☕","🎯","🌍","💫","🦋","🎭"];
const QUIZ = [
  {id:1,v:"Wat is onze merkbelofte?",o:["Snel en efficiënt bedienen","Elk gerecht vertelt een verhaal","De laagste prijs","Maximale omzet per tafel"],c:1,u:"Dit is de kern van wie we zijn."},
  {id:2,v:"Hoe ga je om met een klacht?",o:["Doorverwijzen naar manager","Empathie eerst, oplossing daarna","Korting aanbieden","Ontkennen"],c:1,u:"Empathie voor alles — dan pas de oplossing."},
  {id:3,v:"Wat doe je bij twijfel over allergenen?",o:["Zelf inschatten","De gast geruststellen","Altijd naar de chef","Het menukaartje laten lezen"],c:2,u:"Nooit gokken. Altijd naar de chef."},
  {id:4,v:"Hoe upsell je op de juiste manier?",o:["Door te pushen op prijs","Door enthousiast kennis te delen","Door korting te bieden","Snel door de kaart lopen"],c:1,u:"Kennis en passie verkopen — niet de prijs."},
  {id:5,v:"Wanneer vraag je naar dieetwensen?",o:["Als de gast erom vraagt","Nooit","Proactief bij elke tafel","Alleen bij groepen"],c:2,u:"Altijd proactief — dat is gastvrijheid."},
];

// ── LOGIN ─────────────────────────────────────────────────────
function Login({onLogin}){
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("medewerker");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [naam,setNaam]=useState("");
  const [rest,setRest]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const tip = TIPS[new Date().getDay()%TIPS.length];

  async function doLogin(){
    setErr("");setLoading(true);
    try{
      const auth=await sb.signIn(email,pass);
      if(auth.error){setErr(auth.error.message);setLoading(false);return;}
      const emps=await sb.get("employees",`email=eq.${email}`);
      if(!emps?.length){setErr("Geen account gevonden.");setLoading(false);return;}
      onLogin({...emps[0],token:auth.access_token});
    }catch(e){setErr(e.message);}
    setLoading(false);
  }

  async function doRegister(){
    setErr("");setLoading(true);
    if(!naam||!email||!pass||!rest){setErr("Vul alle velden in");setLoading(false);return;}
    if(pass.length<6){setErr("Wachtwoord minimaal 6 tekens");setLoading(false);return;}
    try{
      const auth=await sb.signUp(email,pass);
      if(auth.error){setErr(auth.error.message);setLoading(false);return;}
      const hotels=await sb.post("hotels",{name:rest,city:""});
      const hotelId=Array.isArray(hotels)?hotels[0]?.id:hotels?.id;
      if(!hotelId){setErr("Restaurant aanmaken mislukt. Controleer RLS in Supabase.");setLoading(false);return;}
      await sb.post("employees",{name:naam,email,hotel_id:hotelId,role:"manager",department:"Management",status:"actief",progress:100});
      setMode("success");
    }catch(e){setErr(e.message);}
    setLoading(false);
  }

  if(mode==="success") return(
    <div style={{...g.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24}}>
      <div style={{textAlign:"center",maxWidth:300}}>
        <div style={{fontSize:52,marginBottom:16}}>✓</div>
        <div style={{...g.h2,marginBottom:8}}>Welkom!</div>
        <p style={{...g.body,marginBottom:24}}>Account aangemaakt. Controleer je e-mail en log daarna in.</p>
        <button style={g.btn} onClick={()=>setMode("login")}>Naar inloggen →</button>
      </div>
    </div>
  );

  return(
    <div style={{...g.app,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{height:290,overflow:"hidden",position:"relative"}}>
        <img src={P.hero} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.35)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"28px 24px"}}>
          <div style={{fontSize:10,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",fontFamily:sans,marginBottom:10}}>Restaurant Platform</div>
          <div style={{fontFamily:abo,fontSize:44,color:C.white,textTransform:"uppercase",lineHeight:1,letterSpacing:"0.04em"}}>ServeReady</div>
          <div style={{height:2,width:44,background:C.terra,margin:"14px 0"}}/>
          <div style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.6)",fontStyle:"italic",lineHeight:1.6,maxWidth:280}}>"{tip}"</div>
        </div>
      </div>
      <div style={{flex:1,padding:"24px 20px"}}>
        <div style={{display:"flex",border:`1px solid ${C.g200}`,borderRadius:6,overflow:"hidden",marginBottom:20}}>
          {[["login","Inloggen"],["register","Nieuw restaurant"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:11,border:"none",cursor:"pointer",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:sans,background:mode===m?C.terra:C.white,color:mode===m?C.white:C.g600,transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
        {err&&<div style={g.err}>{err}</div>}
        {mode==="login"&&(<>
          <div style={g.fg}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jouw@restaurant.nl"/></div>
          <div style={g.fg}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></div>
          <button style={{...g.btn,opacity:loading?.6:1}} onClick={doLogin} disabled={loading}>{loading?"Inloggen...":"Inloggen →"}</button>
          <p style={{textAlign:"center",marginTop:12,fontSize:11,color:C.g400,fontFamily:sans}}>Demo: vul geregistreerde gegevens in</p>
        </>)}
        {mode==="register"&&(<>
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

// ── CHAT ──────────────────────────────────────────────────────
function ChatTab({user}){
  const [kanaal,setKanaal]=useState("algemeen");
  const [prive,setPrive]=useState(null);
  const [showPrive,setShowPrive]=useState(false);
  const [berichten,setBerichten]=useState([
    {id:1,naam:"Lena Visser",role:"Chef de rang",tekst:"Goede avond team! Tafel 12 viert jubileum — wie pakt dit op?",tijd:"17:15",bg:C.terra,kanaal:"algemeen",gelezen:[1,2]},
    {id:2,naam:"Manager",role:"Manager",tekst:"Fatima, kun jij tafel 12 nemen? Ik heb iets speciaals geregeld.",tijd:"17:18",bg:C.red,kanaal:"algemeen",gelezen:[1]},
    {id:3,naam:"Daan Mulder",role:"Sommelier",tekst:"Wagyu is uitverkocht na 20:00 — zeebaars of risotto aanprijzen.",tijd:"17:45",bg:C.black,kanaal:"keuken",gelezen:[1,3]},
  ]);
  const [tekst,setTekst]=useState("");
  const bottomRef=useRef(null);
  const isManager=user?.role==="manager";
  const kanalen=[{id:"algemeen",lbl:"Algemeen",ico:"users"},{id:"keuken",lbl:"Keuken",ico:"fire"},{id:"service",lbl:"Service",ico:"user"},{id:"manager",lbl:"Manager",ico:"star"}];
  const teamleden=[{id:1,naam:"Lena Visser",rol:"Chef de rang",bg:C.terra},{id:2,naam:"Daan Mulder",rol:"Sommelier",bg:C.red},{id:3,naam:"Lars Bakker",rol:"Bar",bg:C.black}];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[berichten,kanaal]);

  function stuur(){
    if(!tekst.trim())return;
    setBerichten([...berichten,{id:Date.now(),naam:user?.name||"Jij",role:user?.department||"",tekst,tijd:new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"}),bg:C.terra,kanaal:prive||kanaal,gelezen:[],eigen:true}]);
    setTekst("");
  }

  if(showPrive) return(
    <div>
      <button onClick={()=>setShowPrive(false)} style={{...g.btnSmO,marginBottom:16}}>← Terug</button>
      <div style={{...g.h3,marginBottom:12}}>Privégesprek starten</div>
      {teamleden.map(m=>(
        <div key={m.id} onClick={()=>{setPrive(`prive-${m.id}`);setShowPrive(false);}} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.g200}`,cursor:"pointer"}}>
          <Avatar name={m.naam} size={40} bg={m.bg}/>
          <div style={{flex:1}}><div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{m.naam}</div><div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{m.rol}</div></div>
          <Ic n="arrow" s={16} c={C.g400}/>
        </div>
      ))}
    </div>
  );

  const gefilterd=berichten.filter(m=>m.kanaal===(prive||kanaal));
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 160px)"}}>
      {!prive&&<div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
        {kanalen.map(k=>(
          <button key={k.id} onClick={()=>setKanaal(k.id)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${kanaal===k.id?C.terra:C.g200}`,background:kanaal===k.id?C.terra:"transparent",color:kanaal===k.id?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{k.lbl}</button>
        ))}
        <button onClick={()=>setShowPrive(true)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${C.g200}`,background:"transparent",color:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>Privé</button>
      </div>}
      {prive&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 12px",background:C.creamD,borderRadius:6}}>
        <Ic n="user" s={15} c={C.terra}/><span style={{fontSize:12,fontFamily:sans,color:C.terra,fontWeight:"bold"}}>Privégesprek</span>
        <button onClick={()=>setPrive(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer"}}><Ic n="x" s={15} c={C.g400}/></button>
      </div>}
      <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
        {gefilterd.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.g400,fontFamily:sans,fontSize:13}}>Nog geen berichten.</div>}
        {gefilterd.map(m=>{
          const eigen=m.naam===(user?.name)||m.eigen;
          return(
            <div key={m.id} style={{display:"flex",flexDirection:eigen?"row-reverse":"row",gap:10,marginBottom:14,alignItems:"flex-start"}}>
              {!eigen&&<Avatar name={m.naam} size={34} bg={m.bg}/>}
              <div style={{maxWidth:"78%"}}>
                {!eigen&&<div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:4}}><span style={{fontFamily:abo,fontSize:12,textTransform:"uppercase"}}>{m.naam}</span><span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{m.role}</span></div>}
                <div style={{background:eigen?C.terra:C.white,color:eigen?C.white:C.black,padding:"10px 14px",borderRadius:eigen?"14px 14px 4px 14px":"14px 14px 14px 4px",border:eigen?"none":`1px solid ${C.g200}`,fontSize:14,fontFamily:sans,lineHeight:1.6}}>{m.tekst}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,justifyContent:eigen?"flex-end":"flex-start"}}>
                  <span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{m.tijd}</span>
                  {isManager&&m.gelezen?.length>0&&<span style={{fontSize:10,color:C.terra,fontFamily:sans}}>✓✓ {m.gelezen.length} gelezen</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.g200}`}}>
        <input style={{...g.input,flex:1,borderRadius:24,padding:"9px 16px"}} value={tekst} onChange={e=>setTekst(e.target.value)} onKeyDown={e=>e.key==="Enter"&&stuur()} placeholder={prive?"Privébericht...":`Bericht in #${kanaal}...`}/>
        <button onClick={stuur} style={{width:40,height:40,borderRadius:"50%",background:C.terra,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><Ic n="send" s={15} c={C.white}/></button>
      </div>
    </div>
  );
}

// ── SMOELENBOEK ───────────────────────────────────────────────
function Smoelenboek({user,teamData}){
  const [geselecteerd,setGeselecteerd]=useState(null);
  const [team,setTeam]=useState(teamData);
  const [zoek,setZoek]=useState("");
  const [filter,setFilter]=useState("allen");
  const [compliment,setCompliment]=useState("");
  const [verstuurd,setVerstuurd]=useState(false);
  const [showEmoji,setShowEmoji]=useState(false);
  const eigenId=1;

  const gefilterd=team.filter(p=>{
    const mz=p.naam.toLowerCase().includes(zoek.toLowerCase())||p.rol.toLowerCase().includes(zoek.toLowerCase());
    const mf=filter==="allen"||(filter==="vanavond"&&p.vandaag)||filter===p.afdeling;
    return mz&&mf;
  });

  if(geselecteerd){
    const eigen=geselecteerd.id===eigenId;
    return(
      <div className="fu">
        <button onClick={()=>{setGeselecteerd(null);setVerstuurd(false);setCompliment("");}} style={{...g.btnSmO,marginBottom:14,width:"auto"}}>← Terug</button>
        <div style={{height:190,borderRadius:10,overflow:"hidden",position:"relative",marginBottom:12}}>
          <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${geselecteerd.bg||C.terra},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:abo,fontSize:72,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>{geselecteerd.naam[0]}</span>
          </div>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(26,16,8,0.7) 0%,transparent 50%)"}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 18px"}}>
            <div style={{fontFamily:abo,fontSize:24,textTransform:"uppercase",color:C.white,lineHeight:1}}>{geselecteerd.naam}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontFamily:sans,marginTop:4}}>{geselecteerd.rol} · {geselecteerd.afdeling}</div>
          </div>
          <div style={{position:"absolute",top:12,right:12}}>
            <button onClick={()=>eigen&&setShowEmoji(!showEmoji)} style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",fontSize:22,cursor:eigen?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center"}}>{geselecteerd.emoji}</button>
          </div>
          {geselecteerd.vandaag&&<div style={{position:"absolute",top:12,left:12,background:C.terra,color:C.white,fontSize:9,fontWeight:"bold",letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 10px",borderRadius:20,fontFamily:sans}}>● Vanavond</div>}
        </div>
        {showEmoji&&eigen&&(
          <div style={{...g.card,marginBottom:12}}>
            <div style={{...g.lbl,marginBottom:8}}>Kies jouw emoji</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {EMOJI_LIJST.map(e=><button key={e} onClick={()=>{setTeam(team.map(p=>p.id===geselecteerd.id?{...p,emoji:e}:p));setGeselecteerd({...geselecteerd,emoji:e});setShowEmoji(false);}} style={{width:40,height:40,borderRadius:8,border:`1px solid ${geselecteerd.emoji===e?C.terra:C.g200}`,background:geselecteerd.emoji===e?C.creamD:C.white,fontSize:20,cursor:"pointer"}}>{e}</button>)}
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[[geselecteerd.inDienst||"—","In dienst"],[geselecteerd.complimenten||0,"Complimenten"],[geselecteerd.vandaag?"Aanwezig":"Vrij","Vanavond"]].map(([v,l])=>(
            <div key={l} style={{...g.warm,flex:1,textAlign:"center",padding:"12px 8px",marginBottom:0}}>
              <div style={{fontFamily:abo,fontSize:16,color:C.terra,lineHeight:1}}>{v}</div>
              <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.g400,fontFamily:sans,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={g.card}>
          <div style={g.fg}><div style={g.lbl}>Specialiteit</div><div style={{fontSize:14,fontFamily:sans,fontWeight:"bold"}}>{geselecteerd.specialiteit||"—"}</div></div>
          <div style={g.divider}/>
          <div style={g.fg}><div style={g.lbl}>Wist je dat...</div><div style={{fontSize:14,fontFamily:sans,color:C.g600,fontStyle:"italic",lineHeight:1.7}}>"{geselecteerd.feitje||"Nog niet ingevuld"}"</div></div>
          <div style={g.divider}/>
          <div><div style={g.lbl}>Dienst vanavond</div><div style={{display:"flex",alignItems:"center",gap:8}}><Ic n="clock" s={14} c={C.terra}/><span style={{fontSize:14,fontFamily:sans,fontWeight:"bold"}}>{geselecteerd.shift||"Niet ingeroosterd"}</span></div></div>
        </div>
        {!eigen&&(
          <div style={g.card}>
            <div style={{fontFamily:abo,fontSize:15,textTransform:"uppercase",marginBottom:6}}>Stuur een compliment</div>
            {verstuurd?(
              <div style={g.ok}><Ic n="check" s={16} c="#15803D"/>Compliment verstuurd! 🎉</div>
            ):(
              <>
                <textarea style={{...g.input,borderRadius:6,minHeight:72,resize:"none",marginBottom:10}} value={compliment} onChange={e=>setCompliment(e.target.value)} placeholder={`Wat wil je ${geselecteerd.naam.split(" ")[0]} laten weten?`}/>
                <button style={g.btn} onClick={()=>{if(compliment.trim()){setVerstuurd(true);}}}>
                  <Ic n="send" s={14} c={C.white}/>Versturen
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  const afdelingen=[...new Set(team.map(p=>p.afdeling))];
  return(
    <>
      <div style={{position:"relative",marginBottom:10}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Ic n="search" s={14} c={C.g400}/></div>
        <input style={{...g.input,paddingLeft:34,borderRadius:24}} value={zoek} onChange={e=>setZoek(e.target.value)} placeholder="Zoek op naam of rol..."/>
        {zoek&&<button onClick={()=>setZoek("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer"}}><Ic n="x" s={14} c={C.g400}/></button>}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {[["allen","Allen"],["vanavond","Vanavond"],...afdelingen.map(a=>[a,a])].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===k?C.terra:C.g200}`,background:filter===k?C.terra:"transparent",color:filter===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
        ))}
      </div>
      {filter==="allen"&&!zoek?(
        <>
          <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:C.terra,fontFamily:sans,fontWeight:"bold",marginBottom:10}}>● Vanavond aanwezig</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {team.filter(p=>p.vandaag).map(p=><ProfielKaart key={p.id} p={p} onClick={()=>setGeselecteerd(p)}/>)}
          </div>
          <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:C.g400,fontFamily:sans,fontWeight:"bold",marginBottom:10}}>Overig team</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {team.filter(p=>!p.vandaag).map(p=><ProfielKaart key={p.id} p={p} onClick={()=>setGeselecteerd(p)}/>)}
          </div>
        </>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {gefilterd.map(p=><ProfielKaart key={p.id} p={p} onClick={()=>setGeselecteerd(p)}/>)}
        </div>
      )}
      <div style={{background:`linear-gradient(135deg,${C.terra},${C.red})`,borderRadius:10,padding:18,marginTop:20,textAlign:"center"}}>
        <div style={{fontFamily:abo,fontSize:18,textTransform:"uppercase",color:C.white,marginBottom:6}}>Ken je collega's</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontFamily:sans,lineHeight:1.6}}>Een sterk team begint met elkaar kennen.</div>
      </div>
    </>
  );
}

function ProfielKaart({p,onClick}){
  return(
    <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.g200}`,borderRadius:10,overflow:"hidden",cursor:"pointer"}} className="fu">
      <div style={{height:110,background:`linear-gradient(135deg,${p.bg||C.terra},${C.red})`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:abo,fontSize:48,color:"rgba(255,255,255,0.25)",textTransform:"uppercase"}}>{p.naam[0]}</span>
        {p.vandaag&&<div style={{position:"absolute",top:8,left:8,background:C.terra,color:C.white,fontSize:9,fontWeight:"bold",letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:20,fontFamily:sans}}>Vanavond</div>}
        <div style={{position:"absolute",top:8,right:8,width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{p.emoji}</div>
      </div>
      <div style={{padding:"12px 12px"}}>
        <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",color:C.black,marginBottom:2}}>{p.naam}</div>
        <div style={{fontSize:11,color:C.terra,fontFamily:sans,fontWeight:"bold",marginBottom:8}}>{p.rol}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}><Ic n="award" s={12} c={C.g400}/><span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{p.complimenten||0}</span></div>
          <Ic n="heart" s={14} c={C.g200}/>
        </div>
      </div>
    </div>
  );
}

// ── MERKQUIZ ──────────────────────────────────────────────────
function MerkquizTab(){
  const [idx,setIdx]=useState(0);
  const [antw,setAntw]=useState({});
  const [klaar,setKlaar]=useState(false);
  const score=Object.entries(antw).filter(([i,a])=>QUIZ[i].c===Number(a)).length;

  if(klaar) return(
    <div>
      <div style={{textAlign:"center",padding:"20px 0 24px"}}>
        <div style={{fontFamily:abo,fontSize:64,color:score>=4?C.terra:C.g400,textTransform:"uppercase",lineHeight:1}}>{score}/{QUIZ.length}</div>
        <div style={{fontFamily:abo,fontSize:22,textTransform:"uppercase",marginBottom:8}}>{score===QUIZ.length?"Perfect!":score>=3?"Goed gedaan!":"Probeer opnieuw"}</div>
        <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.7}}>{score===QUIZ.length?"Jij bent klaar voor de dienst!":score>=3?"Lees de uitleg van de gemiste vragen.":"Neem het merkverhaal opnieuw door."}</div>
      </div>
      {QUIZ.map((q,i)=>{
        const correct=antw[i]===q.c;
        return(
          <div key={q.id} style={{...g.card,borderLeft:`3px solid ${correct?C.terra:C.red}`,marginBottom:8}}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:4}}>{q.v}</div>
            <div style={{fontSize:12,fontFamily:sans,color:correct?C.terra:C.red,marginBottom:4}}>{correct?"✓ Correct":`✗ Juist: "${q.o[q.c]}"`}</div>
            <div style={{fontSize:12,fontFamily:sans,color:C.g600,fontStyle:"italic"}}>{q.u}</div>
          </div>
        );
      })}
      <button style={{...g.btn,marginTop:12}} onClick={()=>{setIdx(0);setAntw({});setKlaar(false);}}>Opnieuw proberen</button>
    </div>
  );

  const q=QUIZ[idx];
  return(
    <>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,fontFamily:sans,color:C.g600}}>Vraag {idx+1} van {QUIZ.length}</span>
        <span style={{fontSize:11,fontFamily:sans,color:C.terra,fontWeight:"bold"}}>{Math.round((idx/QUIZ.length)*100)}%</span>
      </div>
      <div style={{...g.prog,marginBottom:22}}><div style={g.bar(Math.round((idx/QUIZ.length)*100))}/></div>
      <div style={{fontFamily:abo,fontSize:20,textTransform:"uppercase",marginBottom:22,lineHeight:1.3}}>{q.v}</div>
      {q.o.map((opt,j)=>(
        <div key={j} onClick={()=>setAntw({...antw,[idx]:j})} style={{padding:"13px 16px",borderRadius:6,marginBottom:8,cursor:"pointer",border:`1px solid ${antw[idx]===j?C.terra:C.g200}`,background:antw[idx]===j?C.terra:C.white,color:antw[idx]===j?C.white:C.black,transition:"all 0.15s",fontSize:14,fontFamily:sans}}>{opt}</div>
      ))}
      <div style={{display:"flex",gap:10,marginTop:16}}>
        {idx>0&&<button style={{...g.btnOut,flex:1}} onClick={()=>setIdx(idx-1)}>← Terug</button>}
        {antw[idx]!==undefined&&(
          idx<QUIZ.length-1
            ?<button style={{...g.btn,flex:1}} onClick={()=>setIdx(idx+1)}>Volgende →</button>
            :<button style={{...g.btn,flex:1}} onClick={()=>setKlaar(true)}>Resultaat →</button>
        )}
      </div>
    </>
  );
}

// ── TRAINING TAB ──────────────────────────────────────────────
function TrainingTab({user}){
  const [modules,setModules]=useState([]);
  const [completions,setCompletions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [actief,setActief]=useState(null);
  const [step,setStep]=useState("lees");

  useEffect(()=>{loadData();},[]);

  async function loadData(){
    setLoading(true);
    const mods=await sb.get("modules",`hotel_id=eq.${user.hotel_id}`);
    setModules(Array.isArray(mods)?mods:[]);
    const comps=await sb.get("completions",`employee_id=eq.${user.id}`);
    setCompletions(Array.isArray(comps)?comps.map(c=>c.module_id):[]);
    setLoading(false);
  }

  async function afronden(){
    await sb.post("completions",{employee_id:user.id,module_id:actief.id});
    const nieuw=[...new Set([...completions,actief.id])];
    const pct=modules.length>0?Math.round((nieuw.length/modules.length)*100):0;
    await sb.patch("employees",{progress:pct,status:pct===100?"afgerond":"actief"},`id=eq.${user.id}`);
    setCompletions(nieuw);
    setStep("klaar");
  }

  const pct=modules.length>0?Math.round((completions.length/modules.length)*100):0;
  if(loading)return <Loader/>;

  if(actief) return(
    <div>
      <div style={{height:150,borderRadius:8,overflow:"hidden",position:"relative",marginBottom:0}}>
        <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${C.terra},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:abo,fontSize:52,color:"rgba(255,255,255,0.2)",textTransform:"uppercase"}}>{actief.title?.[0]}</span>
        </div>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:14}}>
          <button onClick={()=>{setActief(null);setStep("lees");}} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:4,color:C.white,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:sans,alignSelf:"flex-start"}}>← Terug</button>
          <div>
            <span style={g.tag(C.white,"rgba(255,255,255,0.2)")}>{actief.department}</span>
            <div style={{fontFamily:abo,fontSize:20,color:C.white,textTransform:"uppercase",marginTop:6}}>{actief.title}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.g200}`}}>
        {["Lezen","Bevestigen","Klaar"].map((s,i)=>{
          const cur=(step==="lees"&&i===0)||(step==="bevestig"&&i===1)||(step==="klaar"&&i===2);
          return <div key={s} style={{flex:1,padding:12,textAlign:"center",borderBottom:cur?`2px solid ${C.terra}`:"2px solid transparent"}}><span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:cur?C.terra:C.g400,fontFamily:sans}}>{s}</span></div>;
        })}
      </div>
      <div style={{padding:"18px 0 80px"}}>
        {step==="lees"&&<><p style={g.body}>{actief.content||"Geen inhoud toegevoegd."}</p><div style={{marginTop:20}}><button style={g.btn} onClick={()=>setStep("bevestig")}>Ik heb dit gelezen →</button></div></>}
        {step==="bevestig"&&<><div style={{...g.warm,marginBottom:16}}><p style={{fontSize:14,fontFamily:sans,lineHeight:1.7}}>Ik heb <strong>"{actief.title}"</strong> gelezen en begrijp de inhoud.</p></div><button style={g.btn} onClick={afronden}>Bevestigen & afronden →</button></>}
        {step==="klaar"&&<div style={{textAlign:"center",paddingTop:28}}><div style={{fontSize:52,color:C.terra,marginBottom:12}}>✓</div><div style={{fontFamily:abo,fontSize:22,textTransform:"uppercase",marginBottom:8}}>Module afgerond</div><div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:24}}>Certificaat opgeslagen · {new Date().toLocaleDateString("nl-NL")}</div><button style={g.btn} onClick={()=>{setActief(null);setStep("lees");loadData();}}>← Terug naar overzicht</button></div>}
      </div>
    </div>
  );

  return(
    <>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:C.g600,fontFamily:sans}}>Voortgang onboarding</span><span style={{fontFamily:abo,fontSize:15,color:C.terra}}>{pct}%</span></div>
        <div style={g.prog}><div style={g.bar(pct)}/></div>
        <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:5}}>{completions.length} van {modules.length} modules afgerond</div>
      </div>
      {modules.length===0&&<div style={{...g.card,textAlign:"center",color:C.g400,padding:32}}><div style={{fontFamily:abo,fontSize:16,textTransform:"uppercase",marginBottom:8}}>Nog geen modules</div><div style={{fontSize:13,fontFamily:sans}}>Je manager voegt binnenkort trainingen toe.</div></div>}
      {modules.map(m=>{
        const isDone=completions.includes(m.id);
        return(
          <div key={m.id} onClick={()=>{setActief(m);setStep("lees");}} style={{marginBottom:10,cursor:"pointer",border:`1.5px solid ${isDone?C.terra:C.g200}`,borderRadius:8,overflow:"hidden"}}>
            <div style={{height:84,background:`linear-gradient(135deg,${isDone?C.g600:C.terra},${C.black})`,position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px"}}>
              <div>
                <span style={g.tag(C.white,"rgba(255,255,255,0.15)")}>{m.department}</span>
                <div style={{color:C.white,fontFamily:abo,fontSize:14,textTransform:"uppercase",marginTop:5}}>{m.title}</div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontFamily:sans,marginTop:2}}>{m.duration}</div>
              </div>
              <div style={{width:30,height:30,borderRadius:"50%",background:isDone?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isDone?<Ic n="check" s={14} c={C.terra}/>:<Ic n="arrow" s={13} c={C.white}/>}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── COMPLIMENTEN & FEEDBACK ───────────────────────────────────
function ComplimentenTab({user}){
  const [sec,setSec]=useState("feed");
  const [complimenten,setComplimenten]=useState([
    {id:1,van:"Lena Visser",aan:"Daan Mulder",tekst:"Daan, jouw wijnadvies vanavond bij tafel 7 was perfect. Zo maakt jij het verschil!",tijd:"Gisteren",bg:C.terra,likes:3},
    {id:2,van:"Manager",aan:"Fatima El-Hassan",tekst:"Fatima heeft spontaan bloemen geregeld voor een jubileumkoppel. Dát is gastvrijheid.",tijd:"2 dagen geleden",bg:C.red,likes:7},
  ]);
  const [reviews]=useState([
    {id:1,bron:"Google",ster:5,tekst:"Het personeel maakte onze avond onvergetelijk. Zelden zo'n warme bediening.",gast:"Anoniem"},
    {id:2,bron:"TripAdvisor",ster:5,tekst:"De sommelier wist precies wat we zochten zonder dat we het zelf wisten.",gast:"Familie De Boer"},
  ]);
  const [nieuw,setNieuw]=useState({aan:"",tekst:""});
  const [likes,setLikes]=useState({});
  const teamleden=["Lena Visser","Daan Mulder","Fatima El-Hassan","Lars Bakker","Sara Nguyen"];

  function stuur(){
    if(!nieuw.aan||!nieuw.tekst)return;
    setComplimenten([{id:Date.now(),van:user?.name||"Anoniem",aan:nieuw.aan,tekst:nieuw.tekst,tijd:"Zojuist",bg:C.terra,likes:0},...complimenten]);
    setNieuw({aan:"",tekst:""});
    setSec("feed");
  }

  return(
    <>
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {[["feed","Complimenten"],["feedback","Gastfeedback"],["stuur","Stuur compliment"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSec(k)} style={{padding:"6px 13px",borderRadius:20,border:`1px solid ${sec===k?C.terra:C.g200}`,background:sec===k?C.terra:"transparent",color:sec===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
        ))}
      </div>

      {sec==="feed"&&(<>
        <div style={{...g.warm,display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:28}}>🏆</div>
          <div><div style={{fontFamily:abo,fontSize:16,textTransform:"uppercase",color:C.terra}}>Team van de week</div><div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:2}}>{complimenten.length} complimenten · NPS 9.2</div></div>
        </div>
        {complimenten.map(c=>(
          <div key={c.id} style={{...g.card,marginBottom:12}} className="fu">
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <Avatar name={c.van} size={38} bg={c.bg}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div><span style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{c.van}</span><span style={{fontSize:11,color:C.g400,fontFamily:sans,marginLeft:6}}>→ {c.aan}</span></div>
                  <span style={{fontSize:10,color:C.g400,fontFamily:sans}}>{c.tijd}</span>
                </div>
              </div>
            </div>
            <div style={{fontSize:14,fontFamily:sans,lineHeight:1.7,fontStyle:"italic",color:C.g800,padding:"10px 12px",background:C.cream,borderRadius:6,marginBottom:8}}>"{c.tekst}"</div>
            <button onClick={()=>{setLikes(p=>({...p,[c.id]:!p[c.id]}));setComplimenten(prev=>prev.map(x=>x.id===c.id?{...x,likes:likes[c.id]?x.likes-1:x.likes+1}:x));}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:likes[c.id]?C.red:C.g400,fontFamily:sans,fontSize:12,padding:0}}>
              <Ic n="heart" s={15} c={likes[c.id]?C.red:C.g400}/>{c.likes} {c.likes===1?"reactie":"reacties"}
            </button>
          </div>
        ))}
      </>)}

      {sec==="feedback"&&(<>
        <div style={{background:`linear-gradient(135deg,${C.terra},${C.red})`,borderRadius:10,padding:18,marginBottom:14,textAlign:"center"}}>
          <div style={{fontFamily:abo,fontSize:44,color:C.white,lineHeight:1}}>9.2</div>
          <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",fontFamily:sans,marginTop:4}}>Gemiddelde gastfeedback</div>
        </div>
        {reviews.map(r=>(
          <div key={r.id} style={{...g.card,borderLeft:`3px solid ${C.terra}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <Tag label={r.bron}/>
              <span style={{fontSize:12,color:C.terra}}>{"★".repeat(r.ster)}</span>
            </div>
            <div style={{fontSize:14,fontFamily:sans,fontStyle:"italic",color:C.g800,lineHeight:1.7,marginBottom:6}}>"{r.tekst}"</div>
            <div style={{fontSize:11,color:C.g400,fontFamily:sans}}>— {r.gast}</div>
          </div>
        ))}
      </>)}

      {sec==="stuur"&&(<>
        <div style={{...g.warm,marginBottom:16}}>
          <div style={{fontFamily:abo,fontSize:16,textTransform:"uppercase",color:C.terra,marginBottom:4}}>Erken je collega</div>
          <div style={{fontSize:13,color:C.g600,fontFamily:sans}}>Een compliment kost niets en betekent alles.</div>
        </div>
        <div style={g.fg}><label style={g.lbl}>Voor wie?</label>
          <select style={g.input} value={nieuw.aan} onChange={e=>setNieuw({...nieuw,aan:e.target.value})}>
            <option value="">Kies een collega</option>
            {teamleden.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
        <div style={g.fg}><label style={g.lbl}>Jouw compliment</label><textarea style={{...g.input,minHeight:96,resize:"none",borderRadius:6}} value={nieuw.tekst} onChange={e=>setNieuw({...nieuw,tekst:e.target.value})} placeholder="Beschrijf het concrete moment..."/></div>
        <button style={g.btn} onClick={stuur}><Ic n="send" s={14} c={C.white}/>Deel compliment</button>
      </>)}
    </>
  );
}

// ── VANDAAG (medewerker) ──────────────────────────────────────
function VandaagMedewerker({user}){
  const [sec,setSec]=useState("briefing");
  const [liveBriefing,setLiveBriefing]=useState(null);
  const [loadingB,setLoadingB]=useState(true);

  useEffect(()=>{
    async function laadBriefing(){
      try{
        const data=await sb.get("briefings",`hotel_id=eq.${user?.hotel_id}&date=eq.${new Date().toISOString().split("T")[0]}`);
        if(Array.isArray(data)&&data.length>0){
          const b=data[0];
          setLiveBriefing({
            tip:TIPS[new Date().getDay()%TIPS.length],
            aankondiging:JSON.parse(b.announcements||"[]")[0]?.tekst||"",
            urgent:JSON.parse(b.announcements||"[]")[0]?.urgent||false,
            gasten:JSON.parse(b.events||"[]"),
            upsells:JSON.parse(b.upsells||"[]"),
          });
        }
      }catch(e){console.log("Briefing laden fout:",e);}
      setLoadingB(false);
    }
    laadBriefing();
    // Ververs elke 30 seconden
    const interval=setInterval(laadBriefing,30000);
    return ()=>clearInterval(interval);
  },[user?.hotel_id]);

  const tip=liveBriefing?.tip||TIPS[new Date().getDay()%TIPS.length];
  const gasten=liveBriefing?.gasten||[];
  const briefingData=liveBriefing;
  const datum=new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"});

  return(
    <>
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {[["briefing","Briefing"],["gasten","Gasten"],["upsells","Upsells"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSec(k)} style={{padding:"6px 13px",borderRadius:20,border:`1px solid ${sec===k?C.terra:C.g200}`,background:sec===k?C.terra:"transparent",color:sec===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
        ))}
      </div>

      {sec==="briefing"&&(<>
        {loadingB&&<div style={{...g.warm,display:"flex",gap:10,alignItems:"center",padding:"10px 14px",marginBottom:12}}><div style={{width:16,height:16,border:`2px solid ${C.g200}`,borderTopColor:C.terra,borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/><span style={{fontSize:12,fontFamily:sans,color:C.g600}}>Briefing laden...</span></div>}
        <div style={{background:`linear-gradient(135deg,${C.terra},${C.red})`,borderRadius:10,padding:"24px 20px",marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-16,right:-16,fontSize:100,opacity:0.07,fontFamily:"serif",color:C.white,lineHeight:1}}>"</div>
          <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)",fontFamily:sans,marginBottom:10}}>Gastvrijheid van de dag</div>
          <div style={{fontFamily:sans,fontSize:15,color:C.white,lineHeight:1.7,fontStyle:"italic"}}>"{tip}"</div>
        </div>
        {briefingData?.aankondiging&&(
          <div style={{...briefingData.urgent?{background:"#fff0f0",border:`1px solid ${C.red}44`,borderRadius:8,padding:"12px 14px",marginBottom:10}:g.warm}}>
            <div style={{display:"flex",gap:10}}><Ic n={briefingData.urgent?"alert":"chat"} s={16} c={briefingData.urgent?C.red:C.terra}/><div style={{fontSize:13,fontFamily:sans,lineHeight:1.6,color:briefingData.urgent?C.red:C.g800}}>{briefingData.aankondiging}</div></div>
          </div>
        )}
        <div style={g.card}>
          <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",marginBottom:10}}>Jouw intentie vanavond</div>
          <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:10}}>Hoe pas jij de tip van vandaag toe?</div>
          <textarea style={{...g.input,minHeight:64,resize:"none",borderRadius:6}} placeholder="bijv. Ik onthoud de naam van elke gast..."/>
          <button style={{...g.btnSm,marginTop:10}}>Vastleggen</button>
        </div>
      </>)}

      {sec==="gasten"&&(<>
        <div style={{...g.warm,marginBottom:12}}>
          <div style={{fontSize:12,color:C.terra,fontFamily:sans,fontWeight:"bold"}}>Ken je gasten. Maak het persoonlijk.</div>
        </div>
        {gasten.length===0?(
          <div style={{...g.card,textAlign:"center",color:C.g400,padding:28,fontFamily:sans,fontSize:13}}>Manager heeft nog geen bijzondere gasten ingevoerd.</div>
        ):(
          gasten.map(gast=>(
            <div key={gast.id} style={{...g.card,borderLeft:`3px solid ${C.terra}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{gast.naam}</div>
                <Tag label={`Tafel ${gast.tafel}`}/>
              </div>
              <div style={{fontSize:13,color:C.g600,fontFamily:sans,lineHeight:1.6}}>{gast.info}</div>
            </div>
          ))
        )}
      </>)}

      {sec==="upsells"&&(<>
        <div style={{fontSize:13,color:C.g600,fontFamily:sans,marginBottom:14,lineHeight:1.7}}>Elke extra verkoop telt. Gebruik kennis — niet druk.</div>
        {(briefingData?.upsells||[
          {id:1,titel:"Wijnparing bij menu",script:"'Mag ik een wijnparing aanraden? Onze sommelier heeft drie perfecte combinaties.'",extra:"+€35"},
          {id:2,titel:"Dessert suggestie",script:"'Onze fondant is vanavond een must — gemaakt door de chef zelf.'",extra:"+€12"},
        ]).filter(u=>u.actief!==false).map(u=>(
          <div key={u.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.g200}`}}>
            <div style={{width:38,height:38,borderRadius:6,background:C.terra,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ic n="trend" s={16} c={C.white}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{u.titel}</div>
                <span style={{fontSize:12,fontFamily:sans,fontWeight:"bold",color:C.terra}}>{u.extra}</span>
              </div>
              <div style={{fontSize:12,color:C.g600,fontFamily:sans,fontStyle:"italic"}}>{u.script}</div>
            </div>
          </div>
        ))}
      </>)}
    </>
  );
}

// ── EMPLOYEE APP ──────────────────────────────────────────────
function EmployeeApp({user,onLogout}){
  const [tab,setTab]=useState("vandaag");
  const teamData=sharedData?.team||[
    {id:1,naam:"Lena Visser",rol:"Chef de rang",afdeling:"Service",emoji:"🍷",specialiteit:"Wijnadvies",feitje:"Heeft gefietst door Japan",vandaag:true,complimenten:12,shift:"17:00–23:30",inDienst:"2 jaar",bg:C.terra},
    {id:2,naam:"Daan Mulder",rol:"Sommelier",afdeling:"Service",emoji:"🍇",specialiteit:"Natuurwijnen",feitje:"Maakt zelf wijn in zijn garage",vandaag:true,complimenten:24,shift:"17:00–23:30",inDienst:"4 jaar",bg:C.red},
    {id:3,naam:"Fatima El-Hassan",rol:"Bediening",afdeling:"Service",emoji:"🌸",specialiteit:"Allergenen",feitje:"Bakt elke vrijdag brood voor het team",vandaag:true,complimenten:8,shift:"17:30–23:00",inDienst:"1 jaar",bg:C.g600},
    {id:4,naam:"Lars Bakker",rol:"Bar",afdeling:"Bar",emoji:"🍸",specialiteit:"Signature cocktails",feitje:"Top 10 nationale cocktailwedstrijd",vandaag:false,complimenten:18,shift:"—",inDienst:"3 jaar",bg:C.black},
  ];

  const tabs=[["vandaag","today","Vandaag"],["team","users","Team"],["chat","chat","Chat"],["training","train","Training"]];

  return(
    <div style={g.app}>
      <nav style={g.nav}>
        <div style={{fontFamily:abo,fontSize:18,color:C.terra,textTransform:"uppercase",letterSpacing:"0.04em"}}>ServeReady</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={user?.name} size={30} bg={C.terra}/>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="logout" s={17} c={C.g400}/></button>
        </div>
      </nav>

      <div style={g.page}>
        {tab==="vandaag"&&(<><div style={g.h1}>Vandaag</div><div style={{...g.sub,marginBottom:16}}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"})}</div><VandaagMedewerker user={user}/></>)}
        {tab==="team"&&(
          <>
            <div style={g.h1}>Team</div>
            <div style={{...g.sub,marginBottom:16}}>Smoelenboek · Complimenten · Feedback</div>
            <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {[["smoelen","Smoelenboek"],["complimenten","Complimenten"]].map(([k,l])=>(
                <button key={k} id={`team-${k}`} onClick={e=>{document.querySelectorAll('[id^="team-"]').forEach(b=>b.style.background="transparent");e.target.style.background=C.terra;e.target.style.color=C.white;}} style={{padding:"6px 13px",borderRadius:20,border:`1px solid ${k==="smoelen"?C.terra:C.g200}`,background:k==="smoelen"?C.terra:"transparent",color:k==="smoelen"?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
              ))}
            </div>
            <TeamSubTabs user={user} teamData={teamData}/>
          </>
        )}
        {tab==="chat"&&(<><div style={g.h1}>Chat</div><div style={{...g.sub,marginBottom:16}}>Team communicatie</div><ChatTab user={user}/></>)}
        {tab==="training"&&(<><div style={g.h1}>Training</div><div style={{...g.sub,marginBottom:16}}>Onboarding modules</div><TrainingTab user={user}/></>)}
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

function TeamSubTabs({user,teamData}){
  const [sub,setSub]=useState("smoelen");
  return(
    <>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[["smoelen","👥 Smoelenboek"],["complimenten","💬 Complimenten"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSub(k)} style={{padding:"6px 13px",borderRadius:20,border:`1px solid ${sub===k?C.terra:C.g200}`,background:sub===k?C.terra:"transparent",color:sub===k?C.white:C.g600,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:sans}}>{l}</button>
        ))}
      </div>
      {sub==="smoelen"&&<Smoelenboek user={user} teamData={teamData}/>}
      {sub==="complimenten"&&<ComplimentenTab user={user}/>}
    </>
  );
}

// ── MANAGER APP ───────────────────────────────────────────────
function ManagerApp({user,onLogout}){
  const [tab,setTab]=useState("dashboard");
  const [toast,setToast]=useState("");
  const [modules,setModules]=useState([]);
  const [employees,setEmployees]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editGerecht,setEditGerecht]=useState(null);
  const [editLid,setEditLid]=useState(null);

  // Beheer state
  const [briefing,setBriefing]=useState({tip:TIPS[0],aankondiging:"",urgent:false});
  const [gasten,setGasten]=useState([
    {id:1,naam:"Fam. Hendriksen",tafel:"12",info:"25-jarig huwelijksjubileum. Graag verrassing.",bijzonder:true},
    {id:2,naam:"Dhr. Martens",tafel:"6",info:"Vaste gast. Drinkt Barossa Shiraz.",bijzonder:false},
  ]);
  const [nieuweGast,setNieuweGast]=useState({naam:"",tafel:"",info:"",bijzonder:false});
  const [menu,setMenu]=useState([
    {id:1,naam:"Wagyu entrecôte 200g",cat:"Hoofdgerecht",prijs:"€49",desc:"Truffelboter, asperges, pommes dauphine",allergenen:["Lactose"],veg:false,special:true,actief:true},
    {id:2,naam:"Gegrilde sint-jakobsschelp",cat:"Voorgerecht",prijs:"€19",desc:"Bloemkoolpurée, crispy capers",allergenen:["Schaaldieren","Lactose"],veg:false,special:false,actief:true},
    {id:3,naam:"Burrata met heirloom tomaten",cat:"Voorgerecht",prijs:"€15",desc:"Pesto, rucola, balsamico",allergenen:["Lactose"],veg:true,special:false,actief:true},
  ]);
  const [nieuwGerecht,setNieuwGerecht]=useState({naam:"",cat:"Voorgerecht",prijs:"",desc:"",allergenen:[],veg:false,special:false,actief:true});
  const [reviews,setReviews]=useState([
    {id:1,bron:"Google",ster:5,tekst:"Het personeel maakte onze avond onvergetelijk.",gast:"Anoniem",gedeeld:true},
    {id:2,bron:"TripAdvisor",ster:5,tekst:"De sommelier wist precies wat we zochten.",gast:"Familie De Boer",gedeeld:false},
  ]);
  const [nieuweReview,setNieuweReview]=useState({bron:"Google",ster:5,tekst:"",gast:""});
  const [team,setTeam]=useState([
    {id:1,naam:"Lena Visser",rol:"Chef de rang",afdeling:"Service",emoji:"🍷",specialiteit:"Wijnadvies",feitje:"Heeft gefietst door Japan",vandaag:true,complimenten:12,shift:"17:00–23:30",inDienst:"2 jaar",bg:C.terra},
    {id:2,naam:"Daan Mulder",rol:"Sommelier",afdeling:"Service",emoji:"🍇",specialiteit:"Natuurwijnen",feitje:"Maakt zelf wijn in zijn garage",vandaag:true,complimenten:24,shift:"17:00–23:30",inDienst:"4 jaar",bg:C.red},
    {id:3,naam:"Fatima El-Hassan",rol:"Bediening",afdeling:"Service",emoji:"🌸",specialiteit:"Allergenen",feitje:"Bakt elke vrijdag brood voor het team",vandaag:true,complimenten:8,shift:"17:30–23:00",inDienst:"1 jaar",bg:C.g600},
  ]);
  const [nieuwLid,setNieuwLid]=useState({naam:"",rol:"Bediening",afdeling:"Service",emoji:"🍷",specialiteit:"",feitje:"",vandaag:true,shift:"",inDienst:"",complimenten:0,bg:C.terra});
  const [upsells,setUpsells]=useState([
    {id:1,titel:"Wijnparing bij menu",script:"'Mag ik een wijnparing aanraden?'",extra:"+€35",actief:true},
    {id:2,titel:"Dessert suggestie",script:"'Onze fondant is vanavond een must.'",extra:"+€12",actief:true},
  ]);
  const [nieuweUpsell,setNieuweUpsell]=useState({titel:"",script:"",extra:""});
  const [nieuweModule,setNieuweModule]=useState({titel:"",afdeling:"Service",duur:"15 min",inhoud:""});

  useEffect(()=>{loadData();},[]);

  async function loadData(){
    setLoading(true);
    const emps=await sb.get("employees",`hotel_id=eq.${user.hotel_id}&role=eq.medewerker`);
    setEmployees(Array.isArray(emps)?emps:[]);
    const mods=await sb.get("modules",`hotel_id=eq.${user.hotel_id}`);
    setModules(Array.isArray(mods)?mods:[]);
    setLoading(false);
  }

  async function sla(msg="Opgeslagen ✓"){
    setToast(msg);
    setTimeout(()=>setToast(""),2500);
    // Sla op in Supabase briefings tabel
    try {
      const bestaand = await sb.get("briefings", `hotel_id=eq.${user.hotel_id}&date=eq.${new Date().toISOString().split("T")[0]}`);
      const payload = {
        hotel_id: user.hotel_id,
        date: new Date().toISOString().split("T")[0],
        announcements: JSON.stringify([{tekst: briefing.aankondiging, urgent: briefing.urgent}].filter(a=>a.tekst)),
        events: JSON.stringify(gasten),
        specials: JSON.stringify([]),
        upsells: JSON.stringify(upsells.filter(u=>u.actief)),
      };
      if (Array.isArray(bestaand) && bestaand.length > 0) {
        await sb.patch("briefings", payload, `hotel_id=eq.${user.hotel_id}&date=eq.${new Date().toISOString().split("T")[0]}`);
      } else {
        await sb.post("briefings", payload);
      }
    } catch(e) { console.log("Briefing sync fout:", e); }
  }

  const avg=employees.length?Math.round(employees.reduce((a,e)=>a+(e.progress||0),0)/employees.length):0;
  const afgerond=employees.filter(e=>e.status==="afgerond").length;
  const nieuwCount=employees.filter(e=>e.status==="nieuw").length;
  const actiefCount=employees.filter(e=>e.status==="actief").length;

  const tabs=[["dashboard","grid","Dashboard"],["vandaag","spark","Briefing"],["menu","menu","Menu"],["team","users","Team"],["modules","train","Modules"]];

  return(
    <div style={g.app}>
      <Toast msg={toast}/>
      <nav style={g.navDark}>
        <div style={{fontFamily:abo,fontSize:16,textTransform:"uppercase",letterSpacing:"0.06em",color:C.terra}}>ServeReady</div>
        <div style={{fontSize:11,color:"#777",fontFamily:sans,letterSpacing:"0.1em",textTransform:"uppercase"}}>Manager</div>
        <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="logout" s={17} c={"#777"}/></button>
      </nav>

      <div style={g.page}>
        <div style={{marginBottom:16}}>
          <div style={g.h1}>{tab==="dashboard"?"Dashboard":tab==="vandaag"?"Dagelijkse briefing":tab==="menu"?"Menukaart":tab==="team"?"Team & Smoelenboek":"Modules"}</div>
          <div style={g.sub}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(loading?<Loader/>:(<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[[employees.length,"Team","users"],[avg+"%","Gem. voortgang","trend"],[afgerond,"Afgerond","check"],[reviews.filter(r=>r.gedeeld).length,"Reviews gedeeld","star"]].map(([v,l,ico])=>(
              <div key={l} style={{background:C.white,border:`1px solid ${C.g200}`,borderRadius:8,padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:34,height:34,borderRadius:7,background:C.creamD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={ico} s={15} c={C.terra}/></div>
                <div><div style={{fontFamily:abo,fontSize:22,color:C.terra,lineHeight:1}}>{v}</div><div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.g400,fontFamily:sans,marginTop:2}}>{l}</div></div>
              </div>
            ))}
          </div>
          <div style={{...g.card,borderLeft:`3px solid ${C.terra}`,marginBottom:12}}>
            <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",marginBottom:10}}>Gastvrijheid KPIs</div>
            {[["Gem. gastfeedback","9.2 / 10"],["Complimenten deze week","8"],["Tip van de dag",briefing.tip?"Ingesteld ✓":"Nog niet"],["Bijzondere gasten",gasten.length+" vanavond"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.g200}`}}>
                <span style={{fontSize:13,fontFamily:sans,color:C.g600}}>{l}</span>
                <span style={{fontFamily:abo,fontSize:14,color:C.terra}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",marginBottom:10,letterSpacing:"0.04em"}}>Onboarding voortgang</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {[["nieuw",nieuwCount,"#fff0f0",C.red],["actief",actiefCount,C.creamD,C.terra],["afgerond",afgerond,"#f0fff4","#15803D"]].map(([s,n,bg,c])=>(
              <div key={s} style={{flex:1,background:bg,borderRadius:8,padding:10,textAlign:"center",border:`1px solid ${c}22`}}>
                <div style={{fontFamily:abo,fontSize:22,color:c,lineHeight:1}}>{n}</div>
                <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:c,fontFamily:sans,marginTop:3}}>{s}</div>
              </div>
            ))}
          </div>
          {employees.length===0?(
            <div style={{...g.card,textAlign:"center",color:C.g400,padding:28}}><div style={{fontFamily:abo,fontSize:15,textTransform:"uppercase",marginBottom:6}}>Nog geen medewerkers</div><div style={{fontSize:13,fontFamily:sans}}>Voeg medewerkers toe via het Team tabblad.</div></div>
          ):employees.map(e=>(
            <div key={e.id} style={{...g.card,padding:"12px 14px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <Avatar name={e.name} size={34} bg={C.terra}/>
                  <div><div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{e.name}</div><div style={{fontSize:11,color:C.g400,fontFamily:sans}}>{e.department}</div></div>
                </div>
                <span style={{fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:sans,padding:"3px 8px",borderRadius:20,background:e.status==="afgerond"?"#f0fff4":e.status==="actief"?C.creamD:"#fff0f0",color:e.status==="afgerond"?"#15803D":e.status==="actief"?C.terra:C.red}}>{e.status}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{...g.prog,flex:1}}><div style={g.bar(e.progress||0)}/></div>
                <span style={{fontSize:11,fontFamily:sans,color:C.g600,minWidth:32}}>{e.progress||0}%</span>
              </div>
            </div>
          ))}
          <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",margin:"14px 0 10px",letterSpacing:"0.04em"}}>Snelle acties</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["vandaag","spark","Dagelijkse briefing"],["menu","menu","Menukaart"],["team","users","Team"],["modules","train","Modules"]].map(([t,ico,lbl])=>(
              <button key={t} onClick={()=>setTab(t)} style={{...g.card,cursor:"pointer",padding:14,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8,background:C.white}}>
                <Ic n={ico} s={18} c={C.terra}/><span style={{fontFamily:abo,fontSize:12,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black}}>{lbl}</span>
              </button>
            ))}
          </div>
        </>))}

        {/* ── BRIEFING ── */}
        {tab==="vandaag"&&(<>
          <Sectie icon="spark" title="Tip van de dag" defaultOpen={true}>
            <div style={g.fg}><label style={g.lbl}>Huidige tip</label><textarea style={{...g.input,minHeight:68,resize:"vertical",borderRadius:6}} value={briefing.tip} onChange={e=>setBriefing({...briefing,tip:e.target.value})}/></div>
            <div style={{...g.fg}}><label style={g.lbl}>Kies uit bibliotheek</label>
              {TIPS.map((t,i)=>(
                <div key={i} onClick={()=>setBriefing({...briefing,tip:t})} style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${briefing.tip===t?C.terra:C.g200}`,background:briefing.tip===t?C.creamD:C.white,cursor:"pointer",fontSize:12,fontFamily:sans,color:C.g600,lineHeight:1.5,marginBottom:6}}>
                  {briefing.tip===t&&"✓ "}"{t.substring(0,55)}..."
                </div>
              ))}
            </div>
            <button style={g.btn} onClick={()=>sla("Tip opgeslagen ✓")}><Ic n="save" s={14} c={C.white}/>Opslaan</button>
          </Sectie>
          <Sectie icon="chat" title="Aankondiging aan team">
            <div style={g.fg}><label style={g.lbl}>Bericht</label><textarea style={{...g.input,minHeight:64,resize:"vertical",borderRadius:6}} value={briefing.aankondiging} onChange={e=>setBriefing({...briefing,aankondiging:e.target.value})} placeholder="bijv. Parkeergarage gesloten vanavond..."/></div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><input type="checkbox" checked={briefing.urgent} onChange={e=>setBriefing({...briefing,urgent:e.target.checked})}/><label style={{fontSize:12,fontFamily:sans,color:C.red}}>⚠️ Urgente melding</label></div>
            <button style={g.btn} onClick={()=>sla("Aankondiging gepubliceerd ✓")}><Ic n="chat" s={14} c={C.white}/>Publiceren</button>
          </Sectie>
          <Sectie icon="heart" title="Bijzondere gasten" badge={`${gasten.length}`}>
            {gasten.map(gast=>(
              <div key={gast.id} style={{...g.card,marginBottom:8,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div><div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{gast.naam}</div><Tag label={`Tafel ${gast.tafel}`}/></div>
                  <button style={g.btnDng} onClick={()=>setGasten(gasten.filter(g=>g.id!==gast.id))}><Ic n="trash" s={13} c={C.red}/></button>
                </div>
                <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:4}}>{gast.info}</div>
              </div>
            ))}
            <div style={g.warm}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuweGast.naam} onChange={e=>setNieuweGast({...nieuweGast,naam:e.target.value})} placeholder="bijv. Fam. Jansen"/></div>
                <div><label style={g.lbl}>Tafel</label><input style={g.input} value={nieuweGast.tafel} onChange={e=>setNieuweGast({...nieuweGast,tafel:e.target.value})} placeholder="12"/></div>
              </div>
              <div style={g.fg}><label style={g.lbl}>Bijzonderheid</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} value={nieuweGast.info} onChange={e=>setNieuweGast({...nieuweGast,info:e.target.value})} placeholder="Jubileum, vaste gast..."/></div>
              <button style={g.btn} onClick={()=>{if(!nieuweGast.naam)return;setGasten([...gasten,{...nieuweGast,id:Date.now()}]);setNieuweGast({naam:"",tafel:"",info:"",bijzonder:false});sla("Gast toegevoegd ✓");}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</button>
            </div>
          </Sectie>
          <Sectie icon="star" title="Reviews delen" badge={`${reviews.filter(r=>r.gedeeld).length} gedeeld`}>
            {reviews.map(r=>(
              <div key={r.id} style={{...g.card,marginBottom:8,borderLeft:`3px solid ${r.gedeeld?C.terra:C.g200}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",gap:6}}><Tag label={r.bron}/><span style={{fontSize:12,color:C.terra}}>{"★".repeat(r.ster)}</span></div>
                  <button onClick={()=>{setReviews(reviews.map(rv=>rv.id===r.id?{...rv,gedeeld:!rv.gedeeld}:rv));sla(r.gedeeld?"Review verborgen":"Review gedeeld ✓");}} style={{...g.btnSm,background:r.gedeeld?C.g400:C.terra}}>{r.gedeeld?"Verbergen":"Delen"}</button>
                </div>
                <div style={{fontSize:13,fontFamily:sans,fontStyle:"italic",color:C.g600,lineHeight:1.6}}>"{r.tekst}"</div>
              </div>
            ))}
            <div style={g.warm}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={g.lbl}>Bron</label><select style={g.input} value={nieuweReview.bron} onChange={e=>setNieuweReview({...nieuweReview,bron:e.target.value})}>{["Google","TripAdvisor","Yelp","Direct"].map(b=><option key={b}>{b}</option>)}</select></div>
                <div><label style={g.lbl}>Sterren</label><select style={g.input} value={nieuweReview.ster} onChange={e=>setNieuweReview({...nieuweReview,ster:Number(e.target.value)})}>{[5,4,3,2,1].map(s=><option key={s} value={s}>{"★".repeat(s)}</option>)}</select></div>
              </div>
              <div style={g.fg}><label style={g.lbl}>Gastnaam</label><input style={g.input} value={nieuweReview.gast} onChange={e=>setNieuweReview({...nieuweReview,gast:e.target.value})} placeholder="Anoniem"/></div>
              <div style={g.fg}><label style={g.lbl}>Review tekst</label><textarea style={{...g.input,minHeight:64,resize:"vertical",borderRadius:6}} value={nieuweReview.tekst} onChange={e=>setNieuweReview({...nieuweReview,tekst:e.target.value})} placeholder="Kopieer de review tekst hier..."/></div>
              <button style={g.btn} onClick={()=>{if(!nieuweReview.tekst)return;setReviews([...reviews,{...nieuweReview,id:Date.now(),gedeeld:false}]);setNieuweReview({bron:"Google",ster:5,tekst:"",gast:""});sla("Review toegevoegd ✓");}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</button>
            </div>
          </Sectie>
          <Sectie icon="trend" title="Upsells" badge={`${upsells.filter(u=>u.actief).length} actief`}>
            {upsells.map(u=>(
              <div key={u.id} style={{...g.card,marginBottom:8,opacity:u.actief?1:0.5}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{u.titel}</div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{fontFamily:abo,fontSize:13,color:C.terra}}>{u.extra}</span>
                    <button onClick={()=>setUpsells(upsells.map(x=>x.id===u.id?{...x,actief:!x.actief}:x))} style={{...g.btnSm,background:u.actief?C.terra:C.g400,padding:"3px 8px"}}>{u.actief?"Aan":"Uit"}</button>
                  </div>
                </div>
                <div style={{fontSize:12,fontFamily:sans,fontStyle:"italic",color:C.g600}}>{u.script}</div>
              </div>
            ))}
            <div style={g.warm}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuweUpsell.titel} onChange={e=>setNieuweUpsell({...nieuweUpsell,titel:e.target.value})} placeholder="Late check-out"/></div>
                <div><label style={g.lbl}>Opbrengst</label><input style={g.input} value={nieuweUpsell.extra} onChange={e=>setNieuweUpsell({...nieuweUpsell,extra:e.target.value})} placeholder="+€35"/></div>
              </div>
              <div style={g.fg}><label style={g.lbl}>Script medewerker</label><textarea style={{...g.input,minHeight:56,resize:"none",borderRadius:6}} value={nieuweUpsell.script} onChange={e=>setNieuweUpsell({...nieuweUpsell,script:e.target.value})} placeholder="Wat zeg je precies?"/></div>
              <button style={g.btn} onClick={()=>{if(!nieuweUpsell.titel)return;setUpsells([...upsells,{...nieuweUpsell,id:Date.now(),actief:true}]);setNieuweUpsell({titel:"",script:"",extra:""});sla("Upsell toegevoegd ✓");}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</button>
            </div>
          </Sectie>
        </>)}

        {/* ── MENU ── */}
        {tab==="menu"&&(<>
          {[...new Set(menu.map(m=>m.cat))].map(cat=>(
            <Sectie key={cat} icon="menu" title={cat} badge={`${menu.filter(m=>m.cat===cat&&m.actief).length} actief`} defaultOpen={true}>
              {menu.filter(m=>m.cat===cat).map(item=>(
                <div key={item.id} style={{...g.card,marginBottom:8,opacity:item.actief?1:0.45,borderLeft:`2px solid ${item.special?C.terra:C.g200}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:5,marginBottom:4,flexWrap:"wrap"}}>
                        {item.special&&<Tag label="★ Special"/>}
                        {item.veg&&<Tag label="Veg" color="#16A34A" bg="#f0fff4"/>}
                        {!item.actief&&<Tag label="86" color={C.red} bg="#fff0f0"/>}
                      </div>
                      <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{item.naam}</div>
                      <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:2}}>{item.desc}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{item.allergenen.map(a=><Tag key={a} label={a} color="#B45309" bg="#FFFBEB"/>)}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end",marginLeft:10,flexShrink:0}}>
                      <div style={{fontFamily:abo,fontSize:16,color:C.terra}}>{item.prijs}</div>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>setEditGerecht(editGerecht?.id===item.id?null:item)} style={{...g.btnSm,background:C.g400,padding:"3px 7px"}}><Ic n="edit" s={11} c={C.white}/></button>
                        <button onClick={()=>{setMenu(menu.map(m=>m.id===item.id?{...m,actief:!m.actief}:m));sla(item.actief?"Gerecht op 86":"Gerecht actief");}} style={{...g.btnSm,padding:"3px 7px",background:item.actief?C.terra:C.red}}>{item.actief?"Aan":"86"}</button>
                      </div>
                    </div>
                  </div>
                  {editGerecht?.id===item.id&&(
                    <div style={{borderTop:`1px solid ${C.g200}`,paddingTop:10,marginTop:8}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <div><label style={g.lbl}>Naam</label><input style={g.input} defaultValue={item.naam} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,naam:e.target.value}:m))}/></div>
                        <div><label style={g.lbl}>Prijs</label><input style={g.input} defaultValue={item.prijs} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,prijs:e.target.value}:m))}/></div>
                      </div>
                      <div style={g.fg}><label style={g.lbl}>Beschrijving</label><input style={g.input} defaultValue={item.desc} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,desc:e.target.value}:m))}/></div>
                      <div style={g.fg}><label style={g.lbl}>Allergenen</label>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {ALLERGENEN.map(a=><button key={a} onClick={()=>setMenu(menu.map(m=>m.id===item.id?{...m,allergenen:m.allergenen.includes(a)?m.allergenen.filter(x=>x!==a):[...m.allergenen,a]}:m))} style={{padding:"3px 9px",borderRadius:20,border:`1px solid ${item.allergenen.includes(a)?C.terra:C.g200}`,background:item.allergenen.includes(a)?C.creamD:C.white,color:item.allergenen.includes(a)?C.terra:C.g600,fontSize:11,cursor:"pointer",fontFamily:sans}}>{a}</button>)}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:12,marginBottom:10}}>
                        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={item.veg} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,veg:e.target.checked}:m))}/>Vegetarisch</label>
                        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={item.special} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,special:e.target.checked}:m))}/>★ Special</label>
                      </div>
                      <button style={g.btn} onClick={()=>{setEditGerecht(null);sla("Gerecht bijgewerkt ✓");}}><Ic n="save" s={14} c={C.white}/>Opslaan</button>
                    </div>
                  )}
                </div>
              ))}
            </Sectie>
          ))}
          <Sectie icon="plus" title="Nieuw gerecht toevoegen" ac={C.g400}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuwGerecht.naam} onChange={e=>setNieuwGerecht({...nieuwGerecht,naam:e.target.value})} placeholder="Naam gerecht"/></div>
              <div><label style={g.lbl}>Prijs</label><input style={g.input} value={nieuwGerecht.prijs} onChange={e=>setNieuwGerecht({...nieuwGerecht,prijs:e.target.value})} placeholder="€24"/></div>
            </div>
            <div style={g.fg}><label style={g.lbl}>Categorie</label><select style={g.input} value={nieuwGerecht.cat} onChange={e=>setNieuwGerecht({...nieuwGerecht,cat:e.target.value})}>{["Amuse","Voorgerecht","Hoofdgerecht","Dessert","Wijn","Cocktail"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={g.fg}><label style={g.lbl}>Beschrijving</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} value={nieuwGerecht.desc} onChange={e=>setNieuwGerecht({...nieuwGerecht,desc:e.target.value})} placeholder="Ingrediënten..."/></div>
            <div style={g.fg}><label style={g.lbl}>Allergenen</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {ALLERGENEN.map(a=><button key={a} onClick={()=>setNieuwGerecht({...nieuwGerecht,allergenen:nieuwGerecht.allergenen.includes(a)?nieuwGerecht.allergenen.filter(x=>x!==a):[...nieuwGerecht.allergenen,a]})} style={{padding:"3px 9px",borderRadius:20,border:`1px solid ${nieuwGerecht.allergenen.includes(a)?C.terra:C.g200}`,background:nieuwGerecht.allergenen.includes(a)?C.creamD:C.white,color:nieuwGerecht.allergenen.includes(a)?C.terra:C.g600,fontSize:11,cursor:"pointer",fontFamily:sans}}>{a}</button>)}
              </div>
            </div>
            <div style={{display:"flex",gap:14,marginBottom:12}}>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={nieuwGerecht.veg} onChange={e=>setNieuwGerecht({...nieuwGerecht,veg:e.target.checked})}/>Vegetarisch</label>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={nieuwGerecht.special} onChange={e=>setNieuwGerecht({...nieuwGerecht,special:e.target.checked})}/>★ Special</label>
            </div>
            <button style={g.btn} onClick={()=>{if(!nieuwGerecht.naam)return;setMenu([...menu,{...nieuwGerecht,id:Date.now()}]);setNieuwGerecht({naam:"",cat:"Voorgerecht",prijs:"",desc:"",allergenen:[],veg:false,special:false,actief:true});sla("Gerecht toegevoegd ✓");}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</button>
          </Sectie>
        </>)}

        {/* ── TEAM ── */}
        {tab==="team"&&(
          <Sectie icon="users" title="Smoelenboek" badge={`${team.length} leden`} defaultOpen={true}>
            {team.map(lid=>(
              <div key={lid.id} style={{...g.card,marginBottom:8}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <Avatar name={lid.naam} size={42} bg={lid.bg||C.terra}/>
                    <div style={{position:"absolute",bottom:-2,right:-2,fontSize:14}}>{lid.emoji}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{lid.naam}</div><div style={{fontSize:12,color:C.terra,fontFamily:sans,fontWeight:"bold",marginTop:2}}>{lid.rol} · {lid.afdeling}</div></div>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>setEditLid(editLid?.id===lid.id?null:lid)} style={{...g.btnSm,background:C.g400,padding:"3px 7px"}}><Ic n="edit" s={11} c={C.white}/></button>
                        <button onClick={()=>setTeam(team.filter(t=>t.id!==lid.id))} style={{...g.btnSm,background:"transparent",border:`1px solid ${C.red}`,padding:"3px 7px"}}><Ic n="trash" s={11} c={C.red}/></button>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:4}}>{lid.specialiteit}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                      <input type="checkbox" checked={lid.vandaag} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,vandaag:e.target.checked}:t))}/>
                      <label style={{fontSize:11,fontFamily:sans,color:C.g600}}>Vanavond aanwezig</label>
                    </div>
                  </div>
                </div>
                {editLid?.id===lid.id&&(
                  <div style={{borderTop:`1px solid ${C.g200}`,paddingTop:12,marginTop:10}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      <div><label style={g.lbl}>Naam</label><input style={g.input} defaultValue={lid.naam} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,naam:e.target.value}:t))}/></div>
                      <div><label style={g.lbl}>Rol</label><input style={g.input} defaultValue={lid.rol} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,rol:e.target.value}:t))}/></div>
                    </div>
                    <div style={g.fg}><label style={g.lbl}>Specialiteit</label><input style={g.input} defaultValue={lid.specialiteit} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,specialiteit:e.target.value}:t))}/></div>
                    <div style={g.fg}><label style={g.lbl}>Persoonlijk feitje</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} defaultValue={lid.feitje} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,feitje:e.target.value}:t))}/></div>
                    <div style={g.fg}><label style={g.lbl}>Favoriete emoji</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {EMOJI_LIJST.map(e=><button key={e} onClick={()=>setTeam(team.map(t=>t.id===lid.id?{...t,emoji:e}:t))} style={{width:36,height:36,borderRadius:7,border:`1px solid ${lid.emoji===e?C.terra:C.g200}`,background:lid.emoji===e?C.creamD:C.white,fontSize:18,cursor:"pointer"}}>{e}</button>)}
                      </div>
                    </div>
                    <button style={g.btn} onClick={()=>{setEditLid(null);sla("Profiel bijgewerkt ✓");}}><Ic n="save" s={14} c={C.white}/>Opslaan</button>
                  </div>
                )}
              </div>
            ))}
            <div style={g.warm}>
              <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Nieuw teamlid</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuwLid.naam} onChange={e=>setNieuwLid({...nieuwLid,naam:e.target.value})} placeholder="Volledige naam"/></div>
                <div><label style={g.lbl}>Rol</label><select style={g.input} value={nieuwLid.rol} onChange={e=>setNieuwLid({...nieuwLid,rol:e.target.value})}>{["Bediening","Chef de rang","Sommelier","Bar","Runner","Keuken","Manager"].map(r=><option key={r}>{r}</option>)}</select></div>
              </div>
              <div style={g.fg}><label style={g.lbl}>Specialiteit</label><input style={g.input} value={nieuwLid.specialiteit} onChange={e=>setNieuwLid({...nieuwLid,specialiteit:e.target.value})} placeholder="bijv. Wijnadvies"/></div>
              <div style={g.fg}><label style={g.lbl}>Persoonlijk feitje</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} value={nieuwLid.feitje} onChange={e=>setNieuwLid({...nieuwLid,feitje:e.target.value})} placeholder="Iets persoonlijks..."/></div>
              <div style={g.fg}><label style={g.lbl}>Favoriete emoji</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {EMOJI_LIJST.map(e=><button key={e} onClick={()=>setNieuwLid({...nieuwLid,emoji:e})} style={{width:34,height:34,borderRadius:7,border:`1px solid ${nieuwLid.emoji===e?C.terra:C.g200}`,background:nieuwLid.emoji===e?C.creamD:C.white,fontSize:17,cursor:"pointer"}}>{e}</button>)}
                </div>
              </div>
              <button style={g.btn} onClick={()=>{if(!nieuwLid.naam)return;setTeam([...team,{...nieuwLid,id:Date.now()}]);setNieuwLid({naam:"",rol:"Bediening",afdeling:"Service",emoji:"🍷",specialiteit:"",feitje:"",vandaag:true,shift:"",inDienst:"",complimenten:0,bg:C.terra});sla("Teamlid toegevoegd ✓");}}><Ic n="plus" s={14} c={C.white}/>Toevoegen</button>
            </div>
          </Sectie>
        )}

        {/* ── MODULES ── */}
        {tab==="modules"&&(
          <Sectie icon="train" title="Trainingsmodules" badge={`${modules.length} modules`} defaultOpen={true}>
            {modules.length===0&&<div style={{textAlign:"center",color:C.g400,padding:20,fontFamily:sans,fontSize:13}}>Nog geen modules aangemaakt.</div>}
            {modules.map(m=>(
              <div key={m.id} style={{...g.card,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}><Tag label={m.department}/><div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",marginTop:6}}>{m.title}</div><div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:2}}>{m.duration}</div></div>
                  <button onClick={()=>sb.del("modules",`id=eq.${m.id}`).then(loadData)} style={{...g.btnDng,padding:"4px 8px"}}><Ic n="trash" s={13} c={C.red}/></button>
                </div>
              </div>
            ))}
            <div style={g.warm}>
              <div style={g.fg}><label style={g.lbl}>Titel</label><input style={g.input} value={nieuweModule.titel} onChange={e=>setNieuweModule({...nieuweModule,titel:e.target.value})} placeholder="bijv. Gastvrijheid & service"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={g.lbl}>Afdeling</label><select style={g.input} value={nieuweModule.afdeling} onChange={e=>setNieuweModule({...nieuweModule,afdeling:e.target.value})}>{["Service","Keuken","Merk","Veiligheid","Kennis","Algemeen"].map(a=><option key={a}>{a}</option>)}</select></div>
                <div><label style={g.lbl}>Duur</label><input style={g.input} value={nieuweModule.duur} onChange={e=>setNieuweModule({...nieuweModule,duur:e.target.value})} placeholder="15 min"/></div>
              </div>
              <div style={g.fg}><label style={g.lbl}>Inhoud</label><textarea style={{...g.input,minHeight:72,resize:"vertical",borderRadius:6}} value={nieuweModule.inhoud} onChange={e=>setNieuweModule({...nieuweModule,inhoud:e.target.value})} placeholder="Beschrijf de module inhoud..."/></div>
              <button style={g.btn} onClick={async()=>{if(!nieuweModule.titel)return;await sb.post("modules",{title:nieuweModule.titel,department:nieuweModule.afdeling,content:nieuweModule.inhoud,duration:nieuweModule.duur,hotel_id:user.hotel_id});setNieuweModule({titel:"",afdeling:"Service",duur:"15 min",inhoud:""});sla("Module aangemaakt ✓");loadData();}}><Ic n="plus" s={14} c={C.white}/>Module toevoegen</button>
            </div>
          </Sectie>
        )}
      </div>

      <div style={g.bnavDark}>
        {tabs.map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key,true)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terra:"#777"}/>
            <span style={g.ntxt(tab===key)}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  if(!user) return <Login onLogin={setUser}/>;
  if(user.role==="manager") return <ManagerApp user={user} onLogout={()=>setUser(null)}/>;
  return <EmployeeApp user={user} onLogout={()=>setUser(null)}/>;
}
