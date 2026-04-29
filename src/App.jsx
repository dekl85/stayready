import { useState, useEffect } from "react";

// ── SUPABASE CONFIG ───────────────────────────────────────────
const SUPABASE_URL = "https://fewkgzetgdvbiawlkrfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld2tnemV0Z2R2Ymlhd2xrcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTI4MDAsImV4cCI6MjA5MzAyODgwMH0.IT479cyv9t8FlVzbcuO9W7oeF8Q0uHS-UNwIVYe3bbM";

// Minimal Supabase client (no package needed)
const sb = {
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
  },

  async from(table) {
    const base = `${SUPABASE_URL}/rest/v1/${table}`;
    return {
      async select(cols = "*", filter = "") {
        const res = await fetch(`${base}?select=${cols}${filter ? "&" + filter : ""}`, { headers: sb.headers });
        return res.json();
      },
      async insert(data) {
        const res = await fetch(base, {
          method: "POST",
          headers: { ...sb.headers, "Prefer": "return=representation" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
      async update(data, filter) {
        const res = await fetch(`${base}?${filter}`, {
          method: "PATCH",
          headers: { ...sb.headers, "Prefer": "return=representation" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
      async delete(filter) {
        const res = await fetch(`${base}?${filter}`, {
          method: "DELETE",
          headers: sb.headers,
        });
        return res.ok;
      },
    };
  },

  auth: {
    async signUp(email, password) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    async signIn(email, password) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    async signOut(token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` },
      });
    },
  },
};

// ── DESIGN ────────────────────────────────────────────────────
const serif = "'PT Serif', Georgia, serif";
const sans  = "'PT Sans', system-ui, sans-serif";
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&family=PT+Sans:wght@400;700&display=swap";
document.head.appendChild(fl);

const C = {
  black:"#0A0A0A", white:"#FAFAFA", g100:"#F2F2F2",
  g200:"#E4E4E4", g400:"#ADADAD", g600:"#6B6B6B", g800:"#2A2A2A",
};

const g = {
  app:    { fontFamily:sans, background:C.white, minHeight:"100vh", color:C.black, maxWidth:430, margin:"0 auto" },
  page:   { padding:"24px 20px 96px" },
  nav:    { background:C.white, borderBottom:`1px solid ${C.g200}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:52, position:"sticky", top:0, zIndex:100 },
  logo:   { fontSize:15, letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:serif },
  h1:     { fontSize:28, fontWeight:700, fontFamily:serif, letterSpacing:"-0.02em", marginBottom:2 },
  h2:     { fontSize:18, fontWeight:700, fontFamily:serif },
  sub:    { color:C.g600, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:24, fontFamily:sans },
  lbl:    { fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.g400, display:"block", marginBottom:6, fontFamily:sans },
  input:  { background:C.g100, border:`1px solid ${C.g200}`, borderRadius:3, padding:"11px 14px", color:C.black, fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", fontFamily:sans },
  btn:    { background:C.black, color:C.white, border:"none", borderRadius:3, padding:"13px 24px", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", width:"100%", fontFamily:sans },
  btnOut: { background:"transparent", color:C.black, border:`1px solid ${C.black}`, borderRadius:3, padding:"12px 24px", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", width:"100%", fontFamily:sans },
  btnSm:  { background:C.black, color:C.white, border:"none", borderRadius:3, padding:"8px 16px", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:sans },
  card:   { background:C.white, border:`1px solid ${C.g200}`, borderRadius:3, padding:18, marginBottom:10 },
  fgroup: { marginBottom:14 },
  progress:{ height:2, background:C.g200, borderRadius:0, overflow:"hidden" },
  bar:    (p) => ({ height:"100%", width:`${p}%`, background:C.black, transition:"width 0.5s ease" }),
  bnav:   { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.white, borderTop:`1px solid ${C.g200}`, display:"flex", padding:"8px 0 16px", zIndex:100 },
  nbtn:   (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", padding:"4px 0", background:"none", border:"none", color: a ? C.black : C.g400 }),
  ntxt:   (a) => ({ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:a?"bold":"normal", color:"inherit", fontFamily:sans }),
  divider:{ height:1, background:C.g200, margin:"18px 0" },
  error:  { background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:3, padding:"10px 14px", fontSize:13, color:"#B91C1C", fontFamily:sans, marginBottom:14 },
  success:{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:3, padding:"10px 14px", fontSize:13, color:"#15803D", fontFamily:sans, marginBottom:14 },
  loader: { display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 20px", flexDirection:"column", gap:16 },
};

// ── ICONS ─────────────────────────────────────────────────────
const Ic = ({ n, s=20, c=C.black }) => {
  const a = { width:s, height:s, viewBox:"0 0 24 24", fill:"none", stroke:c, strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" };
  const map = {
    home:   <svg {...a}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    book:   <svg {...a}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    users:  <svg {...a}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    user:   <svg {...a}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    grid:   <svg {...a}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    check:  <svg {...a} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    logout: <svg {...a}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:   <svg {...a}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:      <svg {...a}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    award:  <svg {...a}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    arrow:  <svg {...a}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return map[n] || null;
};

// ── LOADER ────────────────────────────────────────────────────
function Loader({ text = "Laden..." }) {
  return (
    <div style={g.loader}>
      <div style={{ width:32, height:32, border:`2px solid ${C.g200}`, borderTopColor:C.black, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize:12, color:C.g400, fontFamily:sans, letterSpacing:"0.1em", textTransform:"uppercase" }}>{text}</div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [mode, setMode]   = useState("login");   // login | register
  const [role, setRole]   = useState("medewerker");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [name, setName]   = useState("");
  const [hotel, setHotel] = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErr(""); setLoading(true);
    const data = await sb.auth.signIn(email, pass);
    if (data.error) { setErr(data.error.message || "Inloggen mislukt"); setLoading(false); return; }

    // Fetch employee record
    const table = await sb.from("employees");
    const employees = await table.select("*", `email=eq.${email}`);
    if (!employees || employees.length === 0) {
      setErr("Geen account gevonden. Vraag je manager om je uit te nodigen.");
      setLoading(false); return;
    }
    onLogin({ ...employees[0], token: data.access_token });
    setLoading(false);
  }

  async function handleRegister() {
    setErr(""); setLoading(true);
    if (!name || !email || !pass || !hotel) { setErr("Vul alle velden in"); setLoading(false); return; }
    if (pass.length < 6) { setErr("Wachtwoord minimaal 6 tekens"); setLoading(false); return; }

    try {
      // Stap 1 — Auth
      console.log("Stap 1: auth signup...");
      const auth = await sb.auth.signUp(email, pass);
      console.log("Auth result:", JSON.stringify(auth));
      if (auth.error) { setErr("Auth fout: " + auth.error.message); setLoading(false); return; }

      // Stap 2 — Hotel aanmaken
      console.log("Stap 2: hotel aanmaken...");
      const hotelTable = await sb.from("hotels");
      const hotelResult = await hotelTable.insert({ name: hotel, city: "" });
      console.log("Hotel result:", JSON.stringify(hotelResult));
      const hotelId = Array.isArray(hotelResult) ? hotelResult[0]?.id : hotelResult?.id;
      if (!hotelId) {
        const errMsg = Array.isArray(hotelResult) ? JSON.stringify(hotelResult[0]) : JSON.stringify(hotelResult);
        setErr("Hotel mislukt: " + errMsg);
        setLoading(false); return;
      }

      // Stap 3 — Manager aanmaken
      console.log("Stap 3: employee aanmaken, hotel_id:", hotelId);
      const empTable = await sb.from("employees");
      const empResult = await empTable.insert({ name, email, hotel_id: hotelId, role: "manager", department: "Management", status: "actief", progress: 100 });
      console.log("Employee result:", JSON.stringify(empResult));

      setLoading(false);
      setMode("success");
    } catch(e) {
      setErr("Fout: " + e.message);
      setLoading(false);
    }
  }

  if (mode === "success") return (
    <div style={{ ...g.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:320 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
        <div style={{ fontFamily:serif, fontSize:22, marginBottom:8 }}>Account aangemaakt</div>
        <div style={{ fontSize:14, color:C.g600, fontFamily:sans, marginBottom:24, lineHeight:1.7 }}>Controleer je e-mail voor een bevestigingslink. Daarna kun je inloggen.</div>
        <button style={g.btn} onClick={() => setMode("login")}>Naar inloggen →</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...g.app, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      {/* Hero */}
      <div style={{ height:260, overflow:"hidden", position:"relative", background:C.black }}>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"28px 24px" }}>
          <div style={{ fontSize:10, letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", fontFamily:sans, marginBottom:8 }}>Hotel Onboarding Platform</div>
          <div style={{ fontFamily:serif, fontSize:36, color:C.white, letterSpacing:"-0.02em" }}>StayReady</div>
          <div style={{ fontFamily:sans, fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:6 }}>Verbonden met Supabase ·  Live data</div>
        </div>
      </div>

      <div style={{ flex:1, padding:"28px 24px" }}>
        {/* Mode toggle */}
        <div style={{ display:"flex", border:`1px solid ${C.g200}`, borderRadius:3, overflow:"hidden", marginBottom:20 }}>
          {[["login","Inloggen"],["register","Nieuw hotel"]].map(([m,l]) => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex:1, padding:11, border:"none", cursor:"pointer", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:sans, background: mode===m ? C.black : C.white, color: mode===m ? C.white : C.g600, transition:"all 0.2s" }}>{l}</button>
          ))}
        </div>

        {err && <div style={g.error}>{err}</div>}

        {mode === "login" && (
          <>
            <div style={g.fgroup}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@hotel.nl"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"/></div>
            <button style={{ ...g.btn, opacity: loading ? 0.6 : 1 }} onClick={handleLogin} disabled={loading}>{loading ? "Inloggen..." : "Inloggen →"}</button>
          </>
        )}

        {mode === "register" && (
          <>
            <div style={g.fgroup}><label style={g.lbl}>Jouw naam</label><input style={g.input} value={name} onChange={e => setName(e.target.value)} placeholder="Volledige naam"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Hotelnaam</label><input style={g.input} value={hotel} onChange={e => setHotel(e.target.value)} placeholder="Grand Hotel Amsterdam"/></div>
            <div style={g.fgroup}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="manager@hotel.nl"/></div>
            <div style={g.fgroup}><label style={g.lbl}>Wachtwoord</label><input style={g.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Minimaal 8 tekens"/></div>
            <button style={{ ...g.btn, opacity: loading ? 0.6 : 1 }} onClick={handleRegister} disabled={loading}>{loading ? "Account aanmaken..." : "Hotel registreren →"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── MANAGER DASHBOARD ─────────────────────────────────────────
function ManagerDashboard({ user, onLogout }) {
  const [tab, setTab]         = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [modules, setModules]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showAddMod, setShowAddMod] = useState(false);
  const [newEmp, setNewEmp]     = useState({ name:"", email:"", department:"Receptie" });
  const [newMod, setNewMod]     = useState({ title:"", department:"Algemeen", content:"", duration:"15 min" });
  const [msg, setMsg]           = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const empTable = await sb.from("employees");
    const emps = await empTable.select("*", `hotel_id=eq.${user.hotel_id}&role=eq.medewerker`);
    setEmployees(Array.isArray(emps) ? emps : []);

    const modTable = await sb.from("modules");
    const mods = await modTable.select("*", `hotel_id=eq.${user.hotel_id}`);
    setModules(Array.isArray(mods) ? mods : []);
    setLoading(false);
  }

  async function addEmployee() {
    if (!newEmp.name || !newEmp.email) return;
    const table = await sb.from("employees");
    await table.insert({ ...newEmp, hotel_id: user.hotel_id, role:"medewerker", status:"nieuw", progress:0 });
    setMsg(`${newEmp.name} uitgenodigd ✓`);
    setNewEmp({ name:"", email:"", department:"Receptie" });
    setShowAddEmp(false);
    loadData();
  }

  async function addModule() {
    if (!newMod.title) return;
    const table = await sb.from("modules");
    await table.insert({ ...newMod, hotel_id: user.hotel_id });
    setMsg(`Module "${newMod.title}" aangemaakt ✓`);
    setNewMod({ title:"", department:"Algemeen", content:"", duration:"15 min" });
    setShowAddMod(false);
    loadData();
  }

  async function deleteEmployee(id) {
    const table = await sb.from("employees");
    await table.delete(`id=eq.${id}`);
    loadData();
  }

  async function deleteModule(id) {
    const table = await sb.from("modules");
    await table.delete(`id=eq.${id}`);
    loadData();
  }

  const avg = employees.length ? Math.round(employees.reduce((a,e) => a + (e.progress||0), 0) / employees.length) : 0;
  const done = employees.filter(e => e.status === "afgerond").length;

  return (
    <div style={g.app}>
      <nav style={g.nav}>
        <div style={g.logo}>StayReady</div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, color:C.g400, fontFamily:sans }}>Manager</span>
          <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}><Ic n="logout" s={18} c={C.g400}/></button>
        </div>
      </nav>

      <div style={g.page}>
        {loading ? <Loader text="Data laden..."/> : (
          <>
            {msg && <div style={g.success}>{msg}</div>}

            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <>
                <div style={g.h1}>Dashboard</div>
                <div style={g.sub}>{user.name} · {user.department}</div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:24 }}>
                  {[[employees.length,"Team"],[avg+"%","Voortgang"],[done,"Afgerond"]].map(([v,l]) => (
                    <div key={l} style={{ ...g.card, textAlign:"center", padding:16 }}>
                      <div style={{ fontFamily:serif, fontSize:26 }}>{v}</div>
                      <div style={{ ...g.lbl, marginBottom:0, textAlign:"center" }}>{l}</div>
                    </div>
                  ))}
                </div>

                <div style={g.lbl}>Team voortgang</div>
                {employees.length === 0 && (
                  <div style={{ ...g.card, textAlign:"center", color:C.g400, padding:32 }}>
                    <div style={{ fontFamily:serif, fontSize:16, marginBottom:8 }}>Nog geen medewerkers</div>
                    <div style={{ fontSize:13, fontFamily:sans }}>Voeg je eerste medewerker toe via het Team tabblad.</div>
                  </div>
                )}
                {employees.map(e => (
                  <div key={e.id} style={g.card}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontFamily:serif, fontSize:15 }}>{e.name}</div>
                        <div style={{ fontSize:12, color:C.g600, fontFamily:sans }}>{e.department}</div>
                      </div>
                      <span style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color: e.status==="afgerond" ? C.black : C.g400, fontFamily:sans }}>{e.status}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ ...g.progress, flex:1 }}><div style={g.bar(e.progress||0)}/></div>
                      <span style={{ fontSize:11, fontFamily:sans, color:C.g600 }}>{e.progress||0}%</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── TEAM ── */}
            {tab === "team" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={g.h1}>Team</div>
                  <button style={g.btnSm} onClick={() => setShowAddEmp(!showAddEmp)}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><Ic n="plus" s={14} c={C.white}/>Uitnodigen</span>
                  </button>
                </div>
                <div style={g.sub}>{employees.length} medewerkers</div>

                {showAddEmp && (
                  <div style={{ ...g.card, borderLeft:`3px solid ${C.black}`, marginBottom:20 }}>
                    <div style={g.lbl}>Nieuwe medewerker</div>
                    <div style={g.fgroup}><label style={g.lbl}>Naam</label><input style={g.input} value={newEmp.name} onChange={e => setNewEmp({...newEmp, name:e.target.value})} placeholder="Volledige naam"/></div>
                    <div style={g.fgroup}><label style={g.lbl}>E-mailadres</label><input style={g.input} type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email:e.target.value})} placeholder="naam@email.nl"/></div>
                    <div style={g.fgroup}><label style={g.lbl}>Afdeling</label>
                      <select style={g.input} value={newEmp.department} onChange={e => setNewEmp({...newEmp, department:e.target.value})}>
                        {["Receptie","Housekeeping","F&B","Spa","Security","Algemeen"].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={g.btnSm} onClick={addEmployee}>Opslaan</button>
                      <button style={{ ...g.btnSm, background:"transparent", color:C.black, border:`1px solid ${C.g200}` }} onClick={() => setShowAddEmp(false)}>Annuleren</button>
                    </div>
                  </div>
                )}

                {employees.map(e => (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${C.g200}` }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:C.black, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontFamily:serif, fontSize:15, fontWeight:"bold", color:C.white }}>{e.name[0]}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:serif, fontSize:15 }}>{e.name}</div>
                      <div style={{ fontSize:12, color:C.g600, fontFamily:sans }}>{e.department} · {e.email}</div>
                      <div style={{ ...g.progress, marginTop:6 }}><div style={g.bar(e.progress||0)}/></div>
                    </div>
                    <button onClick={() => deleteEmployee(e.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                      <Ic n="x" s={16} c={C.g400}/>
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* ── MODULES ── */}
            {tab === "modules" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={g.h1}>Modules</div>
                  <button style={g.btnSm} onClick={() => setShowAddMod(!showAddMod)}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><Ic n="plus" s={14} c={C.white}/>Nieuw</span>
                  </button>
                </div>
                <div style={g.sub}>{modules.length} trainingen</div>

                {showAddMod && (
                  <div style={{ ...g.card, borderLeft:`3px solid ${C.black}`, marginBottom:20 }}>
                    <div style={g.lbl}>Nieuwe module</div>
                    <div style={g.fgroup}><label style={g.lbl}>Titel</label><input style={g.input} value={newMod.title} onChange={e => setNewMod({...newMod, title:e.target.value})} placeholder="bijv. Welkom bij ons hotel"/></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <div style={g.fgroup}><label style={g.lbl}>Afdeling</label>
                        <select style={g.input} value={newMod.department} onChange={e => setNewMod({...newMod, department:e.target.value})}>
                          {["Algemeen","Receptie","Housekeeping","F&B","Spa","Security"].map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div style={g.fgroup}><label style={g.lbl}>Duur</label><input style={g.input} value={newMod.duration} onChange={e => setNewMod({...newMod, duration:e.target.value})} placeholder="15 min"/></div>
                    </div>
                    <div style={g.fgroup}><label style={g.lbl}>Inhoud</label><textarea style={{ ...g.input, minHeight:80, resize:"vertical" }} value={newMod.content} onChange={e => setNewMod({...newMod, content:e.target.value})} placeholder="Beschrijf de module inhoud..."/></div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={g.btnSm} onClick={addModule}>Opslaan</button>
                      <button style={{ ...g.btnSm, background:"transparent", color:C.black, border:`1px solid ${C.g200}` }} onClick={() => setShowAddMod(false)}>Annuleren</button>
                    </div>
                  </div>
                )}

                {modules.length === 0 && (
                  <div style={{ ...g.card, textAlign:"center", color:C.g400, padding:32 }}>
                    <div style={{ fontFamily:serif, fontSize:16, marginBottom:8 }}>Nog geen modules</div>
                    <div style={{ fontSize:13, fontFamily:sans }}>Maak je eerste trainingsmodule aan.</div>
                  </div>
                )}

                {modules.map(m => (
                  <div key={m.id} style={{ ...g.card, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:serif, fontSize:15, marginBottom:4 }}>{m.title}</div>
                      <div style={{ fontSize:12, color:C.g600, fontFamily:sans }}>{m.department} · {m.duration}</div>
                      {m.content && <div style={{ fontSize:12, color:C.g400, fontFamily:sans, marginTop:6, lineHeight:1.5 }}>{m.content.substring(0,80)}...</div>}
                    </div>
                    <button onClick={() => deleteModule(m.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, marginLeft:10 }}>
                      <Ic n="x" s={16} c={C.g400}/>
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      <div style={g.bnav}>
        {[["dashboard","grid","Dashboard"],["team","users","Team"],["modules","book","Modules"]].map(([key,ico,lbl]) => (
          <button key={key} style={g.nbtn(tab===key)} onClick={() => setTab(key)}>
            <Ic n={ico} s={19} c={tab===key ? C.black : C.g400}/>
            <span style={g.ntxt(tab===key)}>{lbl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── EMPLOYEE DASHBOARD ────────────────────────────────────────
function EmployeeDashboard({ user, onLogout }) {
  const [tab, setTab]       = useState("training");
  const [modules, setModules] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive]   = useState(null);
  const [step, setStep]       = useState("read");
  const [ans, setAns]         = useState({});

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const modTable = await sb.from("modules");
    const mods = await modTable.select("*", `hotel_id=eq.${user.hotel_id}`);
    setModules(Array.isArray(mods) ? mods : []);

    const compTable = await sb.from("completions");
    const comps = await compTable.select("*", `employee_id=eq.${user.id}`);
    setCompletions(Array.isArray(comps) ? comps.map(c => c.module_id) : []);
    setLoading(false);
  }

  async function completeModule(moduleId) {
    const table = await sb.from("completions");
    await table.insert({ employee_id: user.id, module_id: moduleId });

    // Update progress
    const newDone = [...new Set([...completions, moduleId])];
    const progress = modules.length > 0 ? Math.round((newDone.length / modules.length) * 100) : 0;
    const empTable = await sb.from("employees");
    await empTable.update({ progress, status: progress === 100 ? "afgerond" : "actief" }, `id=eq.${user.id}`);
    setCompletions(newDone);
  }

  function startModule(m) { setActive(m); setStep("read"); setAns({}); }

  async function submitQuiz() {
    await completeModule(active.id);
    setStep("done");
  }

  const pct = modules.length > 0 ? Math.round((completions.length / modules.length) * 100) : 0;

  if (active) return (
    <div style={g.app}>
      <nav style={g.nav}>
        <button onClick={() => setActive(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.black, fontSize:13, fontFamily:sans, letterSpacing:"0.06em" }}>← Terug</button>
        <div style={{ fontSize:12, color:C.g400, fontFamily:sans }}>{active.title}</div>
        <div style={{ width:48 }}/>
      </nav>

      <div style={{ display:"flex", borderBottom:`1px solid ${C.g200}` }}>
        {["Lezen","Bevestigen","Klaar"].map((s,i) => {
          const cur=(step==="read"&&i===0)||(step==="confirm"&&i===1)||(step==="done"&&i===2);
          return <div key={s} style={{ flex:1, padding:12, textAlign:"center", borderBottom: cur ? `2px solid ${C.black}` : "2px solid transparent" }}><span style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color: cur ? C.black : C.g400, fontFamily:sans }}>{s}</span></div>;
        })}
      </div>

      <div style={g.page}>
        {step==="read" && (
          <>
            <div style={{ fontFamily:serif, fontSize:22, marginBottom:6 }}>{active.title}</div>
            <div style={{ fontSize:11, color:C.g400, fontFamily:sans, marginBottom:20 }}>{active.department} · {active.duration}</div>
            <p style={{ fontSize:14, lineHeight:1.9, color:C.g800, fontFamily:sans }}>{active.content || "Geen inhoud toegevoegd."}</p>
            <div style={{ marginTop:28 }}>
              <button style={g.btn} onClick={() => setStep("confirm")}>Ik heb dit gelezen →</button>
            </div>
          </>
        )}
        {step==="confirm" && (
          <>
            <div style={{ fontFamily:serif, fontSize:20, marginBottom:16 }}>Bevestig je kennis</div>
            <div style={{ ...g.card, background:C.g100 }}>
              <p style={{ fontSize:14, fontFamily:sans, lineHeight:1.7 }}>Ik heb de module <strong>"{active.title}"</strong> volledig doorgelezen en begrijp de inhoud.</p>
            </div>
            <div style={{ marginTop:20 }}>
              <button style={g.btn} onClick={submitQuiz}>Bevestigen & afronden →</button>
            </div>
          </>
        )}
        {step==="done" && (
          <div style={{ textAlign:"center", paddingTop:32 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✓</div>
            <div style={{ fontFamily:serif, fontSize:24, marginBottom:8 }}>Module afgerond</div>
            <div style={{ fontSize:13, color:C.g600, fontFamily:sans, marginBottom:12 }}>Certificaat opgeslagen in je dossier</div>
            <div style={{ fontFamily:sans, fontSize:11, color:C.g400, marginBottom:32 }}>{new Date().toLocaleDateString("nl-NL")}</div>
            <button style={g.btn} onClick={() => { setActive(null); loadData(); }}>← Terug naar overzicht</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={g.app}>
      <nav style={g.nav}>
        <div style={g.logo}>StayReady</div>
        <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}><Ic n="logout" s={18} c={C.g400}/></button>
      </nav>

      <div style={g.page}>
        {loading ? <Loader text="Modules laden..."/> : (
          <>
            {tab==="training" && (
              <>
                <div style={g.h1}>Mijn training</div>
                <div style={g.sub}>{user.department} · {user.name}</div>

                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:11, color:C.g600, fontFamily:sans }}>Voortgang</span>
                    <span style={{ fontSize:11, fontFamily:sans, fontWeight:"bold" }}>{pct}%</span>
                  </div>
                  <div style={g.progress}><div style={g.bar(pct)}/></div>
                  <div style={{ fontSize:11, color:C.g400, fontFamily:sans, marginTop:6 }}>{completions.length} van {modules.length} modules afgerond</div>
                </div>

                {modules.length === 0 && (
                  <div style={{ ...g.card, textAlign:"center", color:C.g400, padding:32 }}>
                    <div style={{ fontFamily:serif, fontSize:16, marginBottom:8 }}>Nog geen modules beschikbaar</div>
                    <div style={{ fontSize:13, fontFamily:sans }}>Je manager voegt binnenkort trainingen toe.</div>
                  </div>
                )}

                {modules.map(m => {
                  const isDone = completions.includes(m.id);
                  return (
                    <div key={m.id} onClick={() => startModule(m)} style={{ marginBottom:10, cursor:"pointer", border:`1px solid ${isDone ? C.black : C.g200}`, borderRadius:3, padding:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontFamily:serif, fontSize:15, color: isDone ? C.black : C.black, marginBottom:4 }}>{m.title}</div>
                        <div style={{ fontSize:11, color:C.g600, fontFamily:sans }}>{m.department} · {m.duration}</div>
                      </div>
                      <div style={{ width:30, height:30, borderRadius:"50%", background: isDone ? C.black : C.g100, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {isDone ? <Ic n="check" s={14} c={C.white}/> : <Ic n="arrow" s={14} c={C.g400}/>}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {tab==="certificaten" && (
              <>
                <div style={g.h1}>Certificaten</div>
                <div style={g.sub}>{completions.length} behaald</div>
                {modules.filter(m => completions.includes(m.id)).map(m => (
                  <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${C.g200}` }}>
                    <Ic n="award" s={20} c={C.g400}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:serif, fontSize:14 }}>{m.title}</div>
                      <div style={{ fontSize:11, color:C.g400, fontFamily:sans }}>{m.department} · behaald</div>
                    </div>
                    <Ic n="check" s={16} c={C.black}/>
                  </div>
                ))}
                {completions.length === 0 && <div style={{ ...g.card, textAlign:"center", color:C.g400, padding:32 }}><div style={{ fontFamily:serif }}>Nog geen certificaten</div></div>}
              </>
            )}

            {tab==="profiel" && (
              <>
                <div style={g.h1}>Profiel</div>
                <div style={g.sub}>{user.name}</div>
                <div style={{ ...g.card, background:C.black, color:C.white }}>
                  <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", fontFamily:sans, marginBottom:14 }}>Mijn gegevens</div>
                  <div style={{ fontFamily:serif, fontSize:20, marginBottom:4 }}>{user.name}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontFamily:sans }}>{user.department} · {user.email}</div>
                  <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"16px 0" }}/>
                  <div style={{ display:"flex", gap:24 }}>
                    {[[completions.length,"Modules"],[pct+"%","Voortgang"]].map(([v,l]) => (
                      <div key={l}><div style={{ fontFamily:serif, fontSize:24, color:C.white }}>{v}</div><div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", fontFamily:sans }}>{l}</div></div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:16 }}><button style={g.btnOut} onClick={onLogout}>Uitloggen</button></div>
              </>
            )}
          </>
        )}
      </div>

      <div style={g.bnav}>
        {[["training","book","Training"],["certificaten","award","Certificaten"],["profiel","user","Profiel"]].map(([key,ico,lbl]) => (
          <button key={key} style={g.nbtn(tab===key)} onClick={() => setTab(key)}>
            <Ic n={ico} s={19} c={tab===key ? C.black : C.g400}/>
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

  function handleLogin(userData) { setUser(userData); }
  function handleLogout() { setUser(null); }

  if (!user) return <Login onLogin={handleLogin}/>;
  if (user.role === "manager") return <ManagerDashboard user={user} onLogout={handleLogout}/>;
  return <EmployeeDashboard user={user} onLogout={handleLogout}/>;
}
