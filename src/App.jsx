import React, { useState } from "react";

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

const C = {
  terra:"#c96949", red:"#e94d41", cream:"#fff5ed",
  creamD:"#fde8d8", black:"#1a1008", white:"#ffffff",
  g100:"#faf5f0", g200:"#ecddd2", g400:"#b09888", g600:"#7a5c4a",
};
const abo = "'Abolition','Impact',sans-serif";
const sans = "'PT Sans',system-ui,sans-serif";

// ── ICONS ─────────────────────────────────────────────────────
const Ic = ({n,s=18,c=C.black})=>{
  const a={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:c,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"};
  const map={
    spark:   <svg {...a}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>,
    cal:     <svg {...a}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    menu:    <svg {...a}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    users:   <svg {...a}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    star:    <svg {...a}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trend:   <svg {...a}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    chat:    <svg {...a}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    plus:    <svg {...a}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:       <svg {...a}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check:   <svg {...a} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    edit:    <svg {...a}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:   <svg {...a}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    eye:     <svg {...a}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    photo:   <svg {...a}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    leaf:    <svg {...a}><path d="M2 22l10-10"/><path d="M16 8c0 4.42-3.58 8-8 8a8 8 0 010-16c4.42 0 8 3.58 8 8z"/></svg>,
    alert:   <svg {...a}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    save:    <svg {...a}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    grid:    <svg {...a}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    logout:  <svg {...a}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    heart:   <svg {...a}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  };
  return map[n]||null;
};

// ── STYLES ────────────────────────────────────────────────────
const g={
  app:    {fontFamily:sans,background:C.g100,minHeight:"100vh",color:C.black,maxWidth:430,margin:"0 auto"},
  nav:    {background:C.black,padding:"0 18px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100},
  page:   {padding:"16px 16px 80px"},
  h1:     {fontFamily:abo,fontSize:24,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:2,lineHeight:1.1,color:C.black},
  h2:     {fontFamily:abo,fontSize:18,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black},
  h3:     {fontFamily:abo,fontSize:14,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black},
  lbl:    {fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.g400,display:"block",marginBottom:5,fontFamily:sans},
  input:  {background:C.white,border:`1px solid ${C.g200}`,borderRadius:6,padding:"10px 13px",color:C.black,fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",fontFamily:sans,transition:"border-color 0.2s"},
  btn:    {background:C.terra,color:C.white,border:"none",borderRadius:6,padding:"10px 18px",fontSize:12,fontWeight:"bold",letterSpacing:"0.06em",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:6,transition:"opacity 0.2s"},
  btnOut: {background:"transparent",color:C.terra,border:`1.5px solid ${C.terra}`,borderRadius:6,padding:"9px 16px",fontSize:12,fontWeight:"bold",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:6},
  btnSm:  {background:C.terra,color:C.white,border:"none",borderRadius:5,padding:"6px 12px",fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:sans,display:"flex",alignItems:"center",gap:5},
  btnDanger:{background:"transparent",color:C.red,border:`1px solid ${C.red}44`,borderRadius:5,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:sans},
  card:   {background:C.white,border:`1px solid ${C.g200}`,borderRadius:10,padding:16,marginBottom:10},
  warm:   {background:C.creamD,border:`1px solid ${C.terra}22`,borderRadius:10,padding:16,marginBottom:10},
  section:{background:C.white,border:`1px solid ${C.g200}`,borderRadius:10,marginBottom:12,overflow:"hidden"},
  secHead:{padding:"14px 16px",borderBottom:`1px solid ${C.g200}`,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none"},
  secBody:{padding:"16px"},
  divider:{height:1,background:C.g200,margin:"12px 0"},
  fg:     {marginBottom:12},
  ok:     {background:"#f0fff4",border:"1px solid #86EFAC",borderRadius:6,padding:"8px 12px",fontSize:12,color:"#15803D",fontFamily:sans,marginBottom:10,display:"flex",alignItems:"center",gap:8},
  tag:    (c=C.terra,bg=C.creamD)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:20,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",background:bg,color:c,fontFamily:sans,fontWeight:"bold"}),
  bnav:   {position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.black,borderTop:`1px solid #333`,display:"flex",padding:"8px 0 16px",zIndex:100},
  nbtn:   (a)=>({flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 0",background:"none",border:"none",color:a?C.terra:"#888"}),
  ntxt:   (a)=>({fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:a?"bold":"normal",color:"inherit",fontFamily:sans}),
};

// ── TIPS BIBLIOTHEEK ──────────────────────────────────────────
const TIPS_BIBLIOTHEEK = [
  "Een gast vergeet wat je zei. Een gast vergeet wat je deed. Maar een gast vergeet nooit hoe je ze liet voelen.",
  "Gastvrijheid begint vóórdat de gast gaat zitten — oogcontact, een glimlach, een warme begroeting.",
  "Ken je menukaart als je eigen keuken. Passie voor het product is de beste upsell.",
  "Een klacht is een kans — de gast die klaagt en goed wordt geholpen, komt vaker terug dan de gast die nooit klaagde.",
  "Gebruik de naam van de gast zodra je die kent. Niets klinkt zo aangenaam als de eigen naam.",
  "Een verrassing hoeft niet groot te zijn. Een extra amuse of een handgeschreven kaartje maakt het onvergetelijk.",
  "Stil staan is stil gaan. Kijk rond, anticipeer, help voordat de gast erom vraagt.",
  "Teamwork ziet de gast niet — maar de gast voelt het wel.",
];

const EMOJI_LIJST = ["🍷","🍇","🌸","🍸","⚡","🏔️","✍️","🎸","🌿","🔥","🎨","📚","🌊","🍕","☕","🎯","🌍","💫","🦋","🎭"];
const ALLERGENEN = ["Gluten","Schaaldieren","Eieren","Vis","Pinda's","Soja","Melk","Noten","Selderij","Mosterd","Sesam","Sulfieten","Lupine","Weekdieren"];

// ── SECTIE ACCORDION ──────────────────────────────────────────
function Sectie({icon, title, badge, children, defaultOpen=false, accentColor=C.terra}){
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={g.section} className="fu">
      <div style={g.secHead} onClick={()=>setOpen(!open)}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:accentColor+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic n={icon} s={16} c={accentColor}/>
          </div>
          <span style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",letterSpacing:"0.04em",color:C.black}}>{title}</span>
          {badge && <span style={g.tag(accentColor,accentColor+"18")}>{badge}</span>}
        </div>
        <span style={{color:C.g400,fontSize:18,fontWeight:"bold",transform:open?"rotate(45deg)":"rotate(0)",transition:"transform 0.2s"}}>+</span>
      </div>
      {open && <div style={g.secBody}>{children}</div>}
    </div>
  );
}

// ── OPGESLAGEN TOAST ──────────────────────────────────────────
function Toast({msg}){
  return msg ? (
    <div style={{...g.ok,position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",zIndex:200,maxWidth:380,width:"calc(100% - 32px)",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
      <Ic n="check" s={16} c="#15803D"/>{msg}
    </div>
  ) : null;
}

// ── MANAGER BEHEER ────────────────────────────────────────────
export default function ManagerBeheer() {
  const [tab, setTab] = useState("vandaag");
  const [toast, setToast] = useState("");

  // Data state
  const [briefing, setBriefing] = useState({
    tip: TIPS_BIBLIOTHEEK[0],
    aankondiging: "",
    urgent: false,
  });
  const [gasten, setGasten] = useState([
    {id:1,naam:"Fam. Hendriksen",tafel:"12",info:"25-jarig huwelijksjubileum. Graag verrassing.",bijzonder:true},
    {id:2,naam:"Dhr. Martens",tafel:"6",info:"Vaste gast. Drinkt Barossa Shiraz.",bijzonder:false},
  ]);
  const [nieuweGast, setNieuweGast] = useState({naam:"",tafel:"",info:"",bijzonder:false});

  const [menu, setMenu] = useState([
    {id:1,naam:"Wagyu entrecôte 200g",cat:"Hoofdgerecht",prijs:"€49",desc:"Truffelboter, asperges, pommes dauphine",allergenen:["Lactose"],veg:false,special:true,actief:true},
    {id:2,naam:"Gegrilde sint-jakobsschelp",cat:"Voorgerecht",prijs:"€19",desc:"Bloemkoolpurée, crispy capers",allergenen:["Schaaldieren","Lactose"],veg:false,special:false,actief:true},
    {id:3,naam:"Burrata met heirloom tomaten",cat:"Voorgerecht",prijs:"€15",desc:"Pesto, rucola, balsamico",allergenen:["Lactose"],veg:true,special:false,actief:true},
    {id:4,naam:"Chablis Premier Cru 2022",cat:"Wijn",prijs:"€52/fl",desc:"Fris, mineraal — bij vis en schaaldieren",allergenen:["Sulfieten"],veg:true,special:false,actief:false},
  ]);
  const [nieuwGerecht, setNieuwGerecht] = useState({naam:"",cat:"Voorgerecht",prijs:"",desc:"",allergenen:[],veg:false,special:false,actief:true});
  const [editGerecht, setEditGerecht] = useState(null);

  const [reviews, setReviews] = useState([
    {id:1,bron:"Google",ster:5,tekst:"Het personeel maakte onze avond onvergetelijk. Zelden zo'n warme bediening.",gast:"Anoniem",gedeeld:true},
    {id:2,bron:"TripAdvisor",ster:5,tekst:"De sommelier wist precies wat we zochten zonder dat we het zelf wisten.",gast:"Familie De Boer",gedeeld:false},
  ]);
  const [nieuweReview, setNieuweReview] = useState({bron:"Google",ster:5,tekst:"",gast:""});

  const [team, setTeam] = useState([
    {id:1,naam:"Lena Visser",rol:"Chef de rang",afdeling:"Service",emoji:"🍷",specialiteit:"Wijnadvies",feitje:"Heeft gefietst door Japan",vandaag:true},
    {id:2,naam:"Daan Mulder",rol:"Sommelier",afdeling:"Service",emoji:"🍇",specialiteit:"Natuurwijnen",feitje:"Maakt zelf wijn in garage",vandaag:true},
    {id:3,naam:"Fatima El-Hassan",rol:"Bediening",afdeling:"Service",emoji:"🌸",specialiteit:"Allergenen",feitje:"Bakt elke vrijdag brood voor het team",vandaag:true},
    {id:4,naam:"Lars Bakker",rol:"Bar",afdeling:"Bar",emoji:"🍸",specialiteit:"Signature cocktails",feitje:"Top 10 nationale cocktailwedstrijd",vandaag:false},
  ]);
  const [nieuwLid, setNieuwLid] = useState({naam:"",rol:"Bediening",afdeling:"Service",emoji:"🍷",specialiteit:"",feitje:"",vandaag:true});
  const [editLid, setEditLid] = useState(null);

  const [upsells, setUpsells] = useState([
    {id:1,titel:"Wijnparing bij menu",script:"'Mag ik een wijnparing aanraden? Onze sommelier heeft drie perfecte combinaties.'",extra:"+€35",actief:true},
    {id:2,titel:"Dessert suggestie",script:"'Onze fondant is vanavond een must — gemaakt door de chef zelf.'",extra:"+€12",actief:true},
  ]);
  const [nieuweUpsell, setNieuweUpsell] = useState({titel:"",script:"",extra:""});

  const [modules, setModules] = useState([
    {id:1,titel:"Ons merkverhaal",afdeling:"Merk",duur:"10 min",inhoud:"Wij zijn meer dan een restaurant..."},
    {id:2,titel:"De kunst van gastvrijheid",afdeling:"Service",duur:"20 min",inhoud:"Gastvrijheid begint vóórdat de gast gaat zitten..."},
  ]);
  const [nieuweModule, setNieuweModule] = useState({titel:"",afdeling:"Service",duur:"15 min",inhoud:""});

  function sla(msg="Opgeslagen ✓") {
    setToast(msg);
    setTimeout(()=>setToast(""),2500);
  }

  // ── VANDAAG BEHEER ────────────────────────────────────────
  function VandaagBeheer() {
    return (
      <>
        {/* Gastvrijheidstip */}
        <Sectie icon="spark" title="Tip van de dag" defaultOpen={true}>
          <div style={g.fg}>
            <label style={g.lbl}>Huidige tip</label>
            <textarea style={{...g.input,minHeight:72,resize:"vertical",borderRadius:6}} value={briefing.tip} onChange={e=>setBriefing({...briefing,tip:e.target.value})}/>
          </div>
          <div style={g.fg}>
            <label style={g.lbl}>Of kies uit bibliotheek</label>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {TIPS_BIBLIOTHEEK.map((t,i)=>(
                <div key={i} onClick={()=>setBriefing({...briefing,tip:t})} style={{padding:"9px 12px",borderRadius:6,border:`1px solid ${briefing.tip===t?C.terra:C.g200}`,background:briefing.tip===t?C.creamD:C.white,cursor:"pointer",fontSize:12,fontFamily:sans,color:C.g600,lineHeight:1.5,transition:"all 0.15s"}}>
                  {briefing.tip===t && <Ic n="check" s={12} c={C.terra}/>} "{t.substring(0,60)}..."
                </div>
              ))}
            </div>
          </div>
          <button style={g.btn} onClick={()=>sla("Tip opgeslagen ✓")}><Ic n="save" s={14} c={C.white}/>Opslaan</button>
        </Sectie>

        {/* Aankondiging */}
        <Sectie icon="chat" title="Aankondiging aan team">
          <div style={g.fg}>
            <label style={g.lbl}>Bericht</label>
            <textarea style={{...g.input,minHeight:72,resize:"vertical",borderRadius:6}} value={briefing.aankondiging} onChange={e=>setBriefing({...briefing,aankondiging:e.target.value})} placeholder="bijv. Parkeergarage gesloten vanavond..."/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <input type="checkbox" id="urgent" checked={briefing.urgent} onChange={e=>setBriefing({...briefing,urgent:e.target.checked})}/>
            <label htmlFor="urgent" style={{fontSize:13,fontFamily:sans,color:C.red,cursor:"pointer"}}>⚠️ Urgente melding</label>
          </div>
          <button style={g.btn} onClick={()=>sla("Aankondiging gepubliceerd ✓")}><Ic n="chat" s={14} c={C.white}/>Publiceren</button>
        </Sectie>

        {/* Bijzondere gasten */}
        <Sectie icon="heart" title="Bijzondere gasten" badge={`${gasten.length} vanavond`}>
          {gasten.map(gast=>(
            <div key={gast.id} style={{...g.card,marginBottom:8,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{gast.naam}</div>
                  <span style={g.tag()}>Tafel {gast.tafel}</span>
                  {gast.bijzonder && <span style={{...g.tag(C.red,"#fff0f0"),marginLeft:4}}>★ Bijzonder</span>}
                </div>
                <button style={g.btnDanger} onClick={()=>setGasten(gasten.filter(g=>g.id!==gast.id))}><Ic n="trash" s={13} c={C.red}/></button>
              </div>
              <div style={{fontSize:12,color:C.g600,fontFamily:sans}}>{gast.info}</div>
            </div>
          ))}
          <div style={{...g.warm,marginTop:8}}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Gast toevoegen</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div style={g.fg}><label style={g.lbl}>Naam</label><input style={g.input} value={nieuweGast.naam} onChange={e=>setNieuweGast({...nieuweGast,naam:e.target.value})} placeholder="bijv. Fam. Jansen"/></div>
              <div style={g.fg}><label style={g.lbl}>Tafel</label><input style={g.input} value={nieuweGast.tafel} onChange={e=>setNieuweGast({...nieuweGast,tafel:e.target.value})} placeholder="12"/></div>
            </div>
            <div style={g.fg}><label style={g.lbl}>Bijzonderheid</label><textarea style={{...g.input,minHeight:56,resize:"none",borderRadius:6}} value={nieuweGast.info} onChange={e=>setNieuweGast({...nieuweGast,info:e.target.value})} placeholder="Jubileum, vaste gast, allergenen..."/></div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <input type="checkbox" checked={nieuweGast.bijzonder} onChange={e=>setNieuweGast({...nieuweGast,bijzonder:e.target.checked})}/>
              <label style={{fontSize:12,fontFamily:sans}}>★ Markeer als bijzonder</label>
            </div>
            <button style={g.btn} onClick={()=>{if(!nieuweGast.naam)return;setGasten([...gasten,{...nieuweGast,id:Date.now()}]);setNieuweGast({naam:"",tafel:"",info:"",bijzonder:false});sla("Gast toegevoegd ✓");}}>
              <Ic n="plus" s={14} c={C.white}/>Toevoegen
            </button>
          </div>
        </Sectie>

        {/* Reviews delen */}
        <Sectie icon="star" title="Review delen met team" badge={`${reviews.filter(r=>r.gedeeld).length} gedeeld`}>
          {reviews.map(r=>(
            <div key={r.id} style={{...g.card,marginBottom:8,borderLeft:`3px solid ${r.gedeeld?C.terra:C.g200}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{display:"flex",gap:6}}>
                  <span style={g.tag()}>{r.bron}</span>
                  <span style={{fontSize:12,color:C.terra}}>{"★".repeat(r.ster)}</span>
                </div>
                <button onClick={()=>{setReviews(reviews.map(rv=>rv.id===r.id?{...rv,gedeeld:!rv.gedeeld}:rv));sla(r.gedeeld?"Review verborgen":"Review gedeeld met team ✓");}} style={{...g.btnSm,background:r.gedeeld?C.g400:C.terra}}>
                  <Ic n={r.gedeeld?"eye":"spark"} s={12} c={C.white}/>{r.gedeeld?"Verbergen":"Delen"}
                </button>
              </div>
              <div style={{fontSize:13,fontFamily:sans,fontStyle:"italic",color:C.g600,lineHeight:1.6}}>"{r.tekst}"</div>
              <div style={{fontSize:11,color:C.g400,marginTop:4,fontFamily:sans}}>— {r.gast}</div>
            </div>
          ))}
          <div style={g.warm}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Review toevoegen</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div><label style={g.lbl}>Bron</label>
                <select style={g.input} value={nieuweReview.bron} onChange={e=>setNieuweReview({...nieuweReview,bron:e.target.value})}>
                  {["Google","TripAdvisor","Yelp","Direct"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div><label style={g.lbl}>Sterren</label>
                <select style={g.input} value={nieuweReview.ster} onChange={e=>setNieuweReview({...nieuweReview,ster:Number(e.target.value)})}>
                  {[5,4,3,2,1].map(s=><option key={s} value={s}>{"★".repeat(s)}</option>)}
                </select>
              </div>
            </div>
            <div style={{...g.fg}}><label style={g.lbl}>Gastnaam</label><input style={g.input} value={nieuweReview.gast} onChange={e=>setNieuweReview({...nieuweReview,gast:e.target.value})} placeholder="Anoniem of naam gast"/></div>
            <div style={g.fg}><label style={g.lbl}>Review tekst (plak hier)</label><textarea style={{...g.input,minHeight:72,resize:"vertical",borderRadius:6}} value={nieuweReview.tekst} onChange={e=>setNieuweReview({...nieuweReview,tekst:e.target.value})} placeholder="Kopieer de review tekst hier..."/></div>
            <button style={g.btn} onClick={()=>{if(!nieuweReview.tekst)return;setReviews([...reviews,{...nieuweReview,id:Date.now(),gedeeld:false}]);setNieuweReview({bron:"Google",ster:5,tekst:"",gast:""});sla("Review toegevoegd ✓");}}>
              <Ic n="plus" s={14} c={C.white}/>Toevoegen
            </button>
          </div>
        </Sectie>

        {/* Upsells */}
        <Sectie icon="trend" title="Upsells vanavond" badge={`${upsells.filter(u=>u.actief).length} actief`}>
          {upsells.map(u=>(
            <div key={u.id} style={{...g.card,marginBottom:8,opacity:u.actief?1:0.5}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase"}}>{u.titel}</div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{fontFamily:abo,fontSize:14,color:C.terra}}>{u.extra}</span>
                  <button onClick={()=>setUpsells(upsells.map(x=>x.id===u.id?{...x,actief:!x.actief}:x))} style={{...g.btnSm,background:u.actief?C.terra:C.g400,padding:"4px 8px"}}>
                    <Ic n={u.actief?"check":"eye"} s={12} c={C.white}/>
                  </button>
                </div>
              </div>
              <div style={{fontSize:12,fontFamily:sans,fontStyle:"italic",color:C.g600}}>{u.script}</div>
            </div>
          ))}
          <div style={g.warm}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Upsell toevoegen</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuweUpsell.titel} onChange={e=>setNieuweUpsell({...nieuweUpsell,titel:e.target.value})} placeholder="bijv. Dessert suggestie"/></div>
              <div><label style={g.lbl}>Meeropbrengst</label><input style={g.input} value={nieuweUpsell.extra} onChange={e=>setNieuweUpsell({...nieuweUpsell,extra:e.target.value})} placeholder="+€12"/></div>
            </div>
            <div style={g.fg}><label style={g.lbl}>Script voor medewerker</label><textarea style={{...g.input,minHeight:60,resize:"none",borderRadius:6}} value={nieuweUpsell.script} onChange={e=>setNieuweUpsell({...nieuweUpsell,script:e.target.value})} placeholder="Wat zeg je precies tegen de gast?"/></div>
            <button style={g.btn} onClick={()=>{if(!nieuweUpsell.titel)return;setUpsells([...upsells,{...nieuweUpsell,id:Date.now(),actief:true}]);setNieuweUpsell({titel:"",script:"",extra:""});sla("Upsell toegevoegd ✓");}}>
              <Ic n="plus" s={14} c={C.white}/>Toevoegen
            </button>
          </div>
        </Sectie>
      </>
    );
  }

  // ── MENU BEHEER ───────────────────────────────────────────
  function MenuBeheer() {
    const cats = [...new Set(menu.map(m=>m.cat))];
    return (
      <>
        {cats.map(cat=>(
          <Sectie key={cat} icon="menu" title={cat} badge={`${menu.filter(m=>m.cat===cat&&m.actief).length} actief`}>
            {menu.filter(m=>m.cat===cat).map(item=>(
              <div key={item.id} style={{...g.card,marginBottom:8,opacity:item.actief?1:0.45,borderLeft:`3px solid ${item.special?C.terra:item.actief?C.g200:C.g200}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                      {item.special && <span style={g.tag()}>★ Special</span>}
                      {item.veg && <span style={g.tag("#16A34A","#f0fff4")}>Veg</span>}
                      {!item.actief && <span style={g.tag(C.red,"#fff0f0")}>86</span>}
                    </div>
                    <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",color:C.black}}>{item.naam}</div>
                    <div style={{fontSize:12,color:C.g600,fontFamily:sans,marginTop:2}}>{item.desc}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                      {item.allergenen.map(a=><span key={a} style={g.tag("#B45309","#FFFBEB")}>{a}</span>)}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",marginLeft:10,flexShrink:0}}>
                    <div style={{fontFamily:abo,fontSize:16,color:C.terra}}>{item.prijs}</div>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>setEditGerecht(editGerecht?.id===item.id?null:item)} style={{...g.btnSm,padding:"4px 8px",background:C.g400}}><Ic n="edit" s={12} c={C.white}/></button>
                      <button onClick={()=>{setMenu(menu.map(m=>m.id===item.id?{...m,actief:!m.actief}:m));sla(item.actief?"Gerecht op 86 gezet":"Gerecht actief");}} style={{...g.btnSm,padding:"4px 8px",background:item.actief?C.terra:C.red}}>
                        {item.actief?"Aan":"86"}
                      </button>
                    </div>
                  </div>
                </div>
                {editGerecht?.id===item.id && (
                  <div style={{borderTop:`1px solid ${C.g200}`,paddingTop:10,marginTop:8}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      <div><label style={g.lbl}>Naam</label><input style={g.input} defaultValue={item.naam} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,naam:e.target.value}:m))}/></div>
                      <div><label style={g.lbl}>Prijs</label><input style={g.input} defaultValue={item.prijs} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,prijs:e.target.value}:m))}/></div>
                    </div>
                    <div style={g.fg}><label style={g.lbl}>Beschrijving</label><input style={g.input} defaultValue={item.desc} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,desc:e.target.value}:m))}/></div>
                    <div style={g.fg}>
                      <label style={g.lbl}>Allergenen</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {ALLERGENEN.map(a=>(
                          <button key={a} onClick={()=>setMenu(menu.map(m=>m.id===item.id?{...m,allergenen:m.allergenen.includes(a)?m.allergenen.filter(x=>x!==a):[...m.allergenen,a]}:m))} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${item.allergenen.includes(a)?C.terra:C.g200}`,background:item.allergenen.includes(a)?C.creamD:C.white,color:item.allergenen.includes(a)?C.terra:C.g600,fontSize:11,cursor:"pointer",fontFamily:sans}}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,marginBottom:10}}>
                      <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={item.veg} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,veg:e.target.checked}:m))}/>Vegetarisch</label>
                      <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={item.special} onChange={e=>setMenu(menu.map(m=>m.id===item.id?{...m,special:e.target.checked}:m))}/>★ Special</label>
                    </div>
                    <button style={g.btn} onClick={()=>{setEditGerecht(null);sla("Gerecht bijgewerkt ✓");}}>
                      <Ic n="save" s={14} c={C.white}/>Opslaan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Sectie>
        ))}

        {/* Nieuw gerecht */}
        <Sectie icon="plus" title="Nieuw gerecht toevoegen" accentColor={C.g400}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuwGerecht.naam} onChange={e=>setNieuwGerecht({...nieuwGerecht,naam:e.target.value})} placeholder="Naam gerecht"/></div>
            <div><label style={g.lbl}>Prijs</label><input style={g.input} value={nieuwGerecht.prijs} onChange={e=>setNieuwGerecht({...nieuwGerecht,prijs:e.target.value})} placeholder="€24"/></div>
          </div>
          <div style={g.fg}><label style={g.lbl}>Categorie</label>
            <select style={g.input} value={nieuwGerecht.cat} onChange={e=>setNieuwGerecht({...nieuwGerecht,cat:e.target.value})}>
              {["Amuse","Voorgerecht","Hoofdgerecht","Dessert","Wijn","Cocktail","Overig"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={g.fg}><label style={g.lbl}>Beschrijving</label><textarea style={{...g.input,minHeight:56,resize:"none",borderRadius:6}} value={nieuwGerecht.desc} onChange={e=>setNieuwGerecht({...nieuwGerecht,desc:e.target.value})} placeholder="Ingrediënten, bereiding..."/></div>
          <div style={g.fg}>
            <label style={g.lbl}>Allergenen</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {ALLERGENEN.map(a=>(
                <button key={a} onClick={()=>setNieuwGerecht({...nieuwGerecht,allergenen:nieuwGerecht.allergenen.includes(a)?nieuwGerecht.allergenen.filter(x=>x!==a):[...nieuwGerecht.allergenen,a]})} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${nieuwGerecht.allergenen.includes(a)?C.terra:C.g200}`,background:nieuwGerecht.allergenen.includes(a)?C.creamD:C.white,color:nieuwGerecht.allergenen.includes(a)?C.terra:C.g600,fontSize:11,cursor:"pointer",fontFamily:sans}}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:16,marginBottom:12}}>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={nieuwGerecht.veg} onChange={e=>setNieuwGerecht({...nieuwGerecht,veg:e.target.checked})}/>Vegetarisch</label>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:sans,cursor:"pointer"}}><input type="checkbox" checked={nieuwGerecht.special} onChange={e=>setNieuwGerecht({...nieuwGerecht,special:e.target.checked})}/>★ Special</label>
          </div>
          <button style={g.btn} onClick={()=>{if(!nieuwGerecht.naam)return;setMenu([...menu,{...nieuwGerecht,id:Date.now()}]);setNieuwGerecht({naam:"",cat:"Voorgerecht",prijs:"",desc:"",allergenen:[],veg:false,special:false,actief:true});sla("Gerecht toegevoegd ✓");}}>
            <Ic n="plus" s={14} c={C.white}/>Gerecht toevoegen
          </button>
        </Sectie>
      </>
    );
  }

  // ── TEAM BEHEER ───────────────────────────────────────────
  function TeamBeheer() {
    return (
      <>
        <Sectie icon="users" title="Smoelenboek" badge={`${team.length} leden`} defaultOpen={true}>
          {team.map(lid=>(
            <div key={lid.id} style={{...g.card,marginBottom:8}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:C.terra,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                  <span style={{fontFamily:abo,fontSize:18,color:C.white,textTransform:"uppercase"}}>{lid.naam[0]}</span>
                  <div style={{position:"absolute",bottom:-2,right:-2,fontSize:14}}>{lid.emoji}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase"}}>{lid.naam}</div>
                      <div style={{fontSize:12,color:C.terra,fontFamily:sans,fontWeight:"bold"}}>{lid.rol} · {lid.afdeling}</div>
                    </div>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>setEditLid(editLid?.id===lid.id?null:lid)} style={{...g.btnSm,padding:"4px 8px",background:C.g400}}><Ic n="edit" s={12} c={C.white}/></button>
                      <button onClick={()=>setTeam(team.filter(t=>t.id!==lid.id))} style={{...g.btnSm,padding:"4px 8px",background:"transparent",border:`1px solid ${C.red}`,color:C.red}}><Ic n="trash" s={12} c={C.red}/></button>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:4}}>{lid.specialiteit}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                    <input type="checkbox" checked={lid.vandaag} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,vandaag:e.target.checked}:t))}/>
                    <label style={{fontSize:11,fontFamily:sans,color:C.g600}}>Vanavond aanwezig</label>
                  </div>
                </div>
              </div>

              {editLid?.id===lid.id && (
                <div style={{borderTop:`1px solid ${C.g200}`,paddingTop:12,marginTop:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div><label style={g.lbl}>Naam</label><input style={g.input} defaultValue={lid.naam} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,naam:e.target.value}:t))}/></div>
                    <div><label style={g.lbl}>Rol</label><input style={g.input} defaultValue={lid.rol} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,rol:e.target.value}:t))}/></div>
                  </div>
                  <div style={g.fg}><label style={g.lbl}>Specialiteit</label><input style={g.input} defaultValue={lid.specialiteit} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,specialiteit:e.target.value}:t))} placeholder="bijv. Wijnadvies"/></div>
                  <div style={g.fg}><label style={g.lbl}>Persoonlijk feitje</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} defaultValue={lid.feitje} onChange={e=>setTeam(team.map(t=>t.id===lid.id?{...t,feitje:e.target.value}:t))} placeholder="Iets persoonlijks..."/></div>
                  <div style={g.fg}>
                    <label style={g.lbl}>Favoriete emoji</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {EMOJI_LIJST.map(e=>(
                        <button key={e} onClick={()=>setTeam(team.map(t=>t.id===lid.id?{...t,emoji:e}:t))} style={{width:36,height:36,borderRadius:8,border:`1px solid ${lid.emoji===e?C.terra:C.g200}`,background:lid.emoji===e?C.creamD:C.white,fontSize:18,cursor:"pointer"}}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button style={g.btn} onClick={()=>{setEditLid(null);sla("Profiel bijgewerkt ✓");}}>
                    <Ic n="save" s={14} c={C.white}/>Opslaan
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Nieuw teamlid */}
          <div style={{...g.warm,marginTop:8}}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Nieuw teamlid</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div><label style={g.lbl}>Naam</label><input style={g.input} value={nieuwLid.naam} onChange={e=>setNieuwLid({...nieuwLid,naam:e.target.value})} placeholder="Volledige naam"/></div>
              <div><label style={g.lbl}>Rol</label>
                <select style={g.input} value={nieuwLid.rol} onChange={e=>setNieuwLid({...nieuwLid,rol:e.target.value})}>
                  {["Bediening","Chef de rang","Sommelier","Bar","Runner","Keuken","Manager"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={g.fg}><label style={g.lbl}>Specialiteit</label><input style={g.input} value={nieuwLid.specialiteit} onChange={e=>setNieuwLid({...nieuwLid,specialiteit:e.target.value})} placeholder="bijv. Wijnadvies"/></div>
            <div style={g.fg}><label style={g.lbl}>Persoonlijk feitje</label><textarea style={{...g.input,minHeight:52,resize:"none",borderRadius:6}} value={nieuwLid.feitje} onChange={e=>setNieuwLid({...nieuwLid,feitje:e.target.value})} placeholder="Iets persoonlijks..."/></div>
            <div style={g.fg}>
              <label style={g.lbl}>Favoriete emoji</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {EMOJI_LIJST.map(e=>(
                  <button key={e} onClick={()=>setNieuwLid({...nieuwLid,emoji:e})} style={{width:34,height:34,borderRadius:8,border:`1px solid ${nieuwLid.emoji===e?C.terra:C.g200}`,background:nieuwLid.emoji===e?C.creamD:C.white,fontSize:17,cursor:"pointer"}}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <button style={g.btn} onClick={()=>{if(!nieuwLid.naam)return;setTeam([...team,{...nieuwLid,id:Date.now()}]);setNieuwLid({naam:"",rol:"Bediening",afdeling:"Service",emoji:"🍷",specialiteit:"",feitje:"",vandaag:true});sla("Teamlid toegevoegd ✓");}}>
              <Ic n="plus" s={14} c={C.white}/>Toevoegen
            </button>
          </div>
        </Sectie>
      </>
    );
  }

  // ── MODULES BEHEER ────────────────────────────────────────
  function ModulesBeheer() {
    return (
      <>
        <Sectie icon="grid" title="Trainingsmodules" badge={`${modules.length} modules`} defaultOpen={true}>
          {modules.map(m=>(
            <div key={m.id} style={{...g.card,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <span style={g.tag()}>{m.afdeling}</span>
                  <div style={{fontFamily:abo,fontSize:14,textTransform:"uppercase",marginTop:6}}>{m.titel}</div>
                  <div style={{fontSize:11,color:C.g400,fontFamily:sans,marginTop:2}}>{m.duur}</div>
                </div>
                <button onClick={()=>setModules(modules.filter(x=>x.id!==m.id))} style={g.btnDanger}><Ic n="trash" s={13} c={C.red}/></button>
              </div>
              <div style={{fontSize:12,color:C.g600,fontFamily:sans,lineHeight:1.5}}>{m.inhoud.substring(0,80)}...</div>
            </div>
          ))}
          <div style={g.warm}>
            <div style={{fontFamily:abo,fontSize:13,textTransform:"uppercase",marginBottom:10}}>Module toevoegen</div>
            <div style={g.fg}><label style={g.lbl}>Titel</label><input style={g.input} value={nieuweModule.titel} onChange={e=>setNieuweModule({...nieuweModule,titel:e.target.value})} placeholder="bijv. Gastvrijheid & service"/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div><label style={g.lbl}>Afdeling</label>
                <select style={g.input} value={nieuweModule.afdeling} onChange={e=>setNieuweModule({...nieuweModule,afdeling:e.target.value})}>
                  {["Service","Keuken","Merk","Veiligheid","Kennis","Algemeen"].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div><label style={g.lbl}>Duur</label><input style={g.input} value={nieuweModule.duur} onChange={e=>setNieuweModule({...nieuweModule,duur:e.target.value})} placeholder="15 min"/></div>
            </div>
            <div style={g.fg}><label style={g.lbl}>Inhoud</label><textarea style={{...g.input,minHeight:80,resize:"vertical",borderRadius:6}} value={nieuweModule.inhoud} onChange={e=>setNieuweModule({...nieuweModule,inhoud:e.target.value})} placeholder="Beschrijf de module inhoud..."/></div>
            <button style={g.btn} onClick={()=>{if(!nieuweModule.titel)return;setModules([...modules,{...nieuweModule,id:Date.now()}]);setNieuweModule({titel:"",afdeling:"Service",duur:"15 min",inhoud:""});sla("Module aangemaakt ✓");}}>
              <Ic n="plus" s={14} c={C.white}/>Module toevoegen
            </button>
          </div>
        </Sectie>
      </>
    );
  }

  // ── RENDER ────────────────────────────────────────────────
  const tabs = [
    ["vandaag","spark","Vandaag"],
    ["menu","menu","Menu"],
    ["team","users","Team"],
    ["modules","grid","Modules"],
  ];

  return (
    <div style={g.app}>
      <Toast msg={toast}/>

      <nav style={g.nav}>
        <div style={{fontFamily:abo,fontSize:16,textTransform:"uppercase",letterSpacing:"0.06em",color:C.terra}}>ServeReady</div>
        <div style={{fontSize:11,color:"#888",fontFamily:sans,letterSpacing:"0.1em",textTransform:"uppercase"}}>Manager Beheer</div>
        <button style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="logout" s={17} c={"#888"}/></button>
      </nav>

      <div style={g.page}>
        <div style={{marginBottom:16}}>
          <div style={g.h1}>{tab==="vandaag"?"Dagelijkse briefing":tab==="menu"?"Menukaart":tab==="team"?"Team & Smoelenboek":"Trainingsmodules"}</div>
          <div style={{fontSize:11,color:C.g400,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:sans}}>
            {new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"})}
          </div>
        </div>

        {tab==="vandaag" && <VandaagBeheer/>}
        {tab==="menu"    && <MenuBeheer/>}
        {tab==="team"    && <TeamBeheer/>}
        {tab==="modules" && <ModulesBeheer/>}
      </div>

      <div style={g.bnav}>
        {tabs.map(([key,ico,lbl])=>(
          <button key={key} style={g.nbtn(tab===key)} onClick={()=>setTab(key)}>
            <Ic n={ico} s={19} c={tab===key?C.terra:"#888"}/>
            <span style={g.ntxt(tab===key)}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
