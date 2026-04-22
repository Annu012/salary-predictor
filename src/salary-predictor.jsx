import { useState, useEffect } from "react";

// ── Salary Data Model ──────────────────────────────────────────────
const BASE_SALARIES = {
  "Software Engineer":          { base: 115000, junior: 85000,  senior: 160000 },
  "Senior Software Engineer":   { base: 155000, junior: 115000, senior: 200000 },
  "Staff Engineer":             { base: 195000, junior: 155000, senior: 260000 },
  "Principal Engineer":         { base: 230000, junior: 190000, senior: 300000 },
  "Frontend Developer":         { base: 108000, junior: 78000,  senior: 150000 },
  "Backend Developer":          { base: 118000, junior: 85000,  senior: 162000 },
  "Full Stack Developer":       { base: 112000, junior: 80000,  senior: 155000 },
  "DevOps Engineer":            { base: 130000, junior: 95000,  senior: 175000 },
  "Data Scientist":             { base: 125000, junior: 90000,  senior: 175000 },
  "ML Engineer":                { base: 145000, junior: 105000, senior: 210000 },
  "AI Engineer":                { base: 155000, junior: 110000, senior: 225000 },
  "Data Engineer":              { base: 128000, junior: 92000,  senior: 178000 },
  "Product Manager":            { base: 135000, junior: 95000,  senior: 195000 },
  "Engineering Manager":        { base: 185000, junior: 145000, senior: 250000 },
  "CTO":                        { base: 250000, junior: 180000, senior: 380000 },
  "VP of Engineering":          { base: 240000, junior: 170000, senior: 360000 },
  "Cloud Architect":            { base: 165000, junior: 120000, senior: 220000 },
  "Security Engineer":          { base: 138000, junior: 100000, senior: 185000 },
  "QA Engineer":                { base: 95000,  junior: 68000,  senior: 135000 },
  "Mobile Developer":           { base: 118000, junior: 85000,  senior: 165000 },
};

const LOCATION_MULTIPLIERS = {
  "United States 🇺🇸":   1.00,
  "Canada 🇨🇦":          0.78,
  "United Kingdom 🇬🇧":  0.82,
  "Germany 🇩🇪":         0.75,
  "Australia 🇦🇺":       0.80,
  "Netherlands 🇳🇱":     0.74,
  "Singapore 🇸🇬":       0.85,
  "France 🇫🇷":          0.68,
  "India 🇮🇳":           0.18,
  "Remote (Global) 🌍":  0.90,
};

const EXPERIENCE_MULTIPLIERS = {
  "0–1 years (Entry Level)":         0.62,
  "2–3 years (Junior)":              0.78,
  "4–6 years (Mid-Level)":           0.95,
  "7–10 years (Senior)":             1.18,
  "11–15 years (Staff / Lead)":      1.42,
  "15+ years (Principal / Executive)":1.65,
};

const EDUCATION_MULTIPLIERS = {
  "High School Diploma": 0.88,
  "Bootcamp Graduate":   0.92,
  "Associate Degree":    0.94,
  "Bachelor's Degree":   1.00,
  "Master's Degree":     1.08,
  "PhD / Doctorate":     1.14,
};

const SKILL_BOOSTS = {
  "Machine Learning": 14, "Deep Learning": 16, "AI Engineer": 15,
  "Kubernetes": 12, "Terraform": 11, "AWS": 10, "GCP": 9, "Azure": 9,
  "Rust": 13, "Go": 11, "Spark": 12, "Kafka": 11,
  "TypeScript": 8, "GraphQL": 7, "System Design": 9,
  "Python": 7, "Docker": 8, "CI/CD": 7,
  "React": 6, "Node.js": 6, "Java": 5,
  "SQL": 4, "MongoDB": 5, "C++": 7, "C#": 5,
};

const MARKET_TRENDS = {
  "AI Engineer":       { trend: "Rising",   reason: "Explosive demand for AI/LLM engineers across all industries." },
  "ML Engineer":       { trend: "Rising",   reason: "AI adoption is driving sustained demand for ML talent." },
  "Data Scientist":    { trend: "Stable",   reason: "Market has matured; strong demand with steady compensation." },
  "DevOps Engineer":   { trend: "Rising",   reason: "Cloud-native adoption and platform engineering growth." },
  "Cloud Architect":   { trend: "Rising",   reason: "Multi-cloud strategies increasing architect demand." },
  "Security Engineer": { trend: "Rising",   reason: "Cybersecurity threats driving strong hiring across sectors." },
  "QA Engineer":       { trend: "Declining","reason: ": "AI-assisted testing reducing demand for manual QA roles." },
  "CTO":               { trend: "Stable",   reason: "Leadership roles remain competitive in tech-forward orgs." },
  "default":           { trend: "Stable",   reason: "Steady demand with competitive compensation in the market." },
};

function computeSalary(form) {
  const roleData    = BASE_SALARIES[form.jobTitle] || BASE_SALARIES["Software Engineer"];
  const locMult     = LOCATION_MULTIPLIERS[form.location]   || 1.0;
  const expMult     = EXPERIENCE_MULTIPLIERS[form.experience] || 1.0;
  const eduMult     = EDUCATION_MULTIPLIERS[form.education]  || 1.0;

  // Skill boost: pick highest matching skill
  let topSkill = "", topBoostPct = 0;
  form.skills.forEach(s => {
    const b = SKILL_BOOSTS[s] || 0;
    if (b > topBoostPct) { topBoostPct = b; topSkill = s; }
  });
  const skillMult = 1 + (topBoostPct / 100) * 0.6; // partial boost

  const mid = Math.round(roleData.base * locMult * expMult * eduMult * skillMult / 1000) * 1000;
  const min = Math.round(mid * 0.85 / 1000) * 1000;
  const max = Math.round(mid * 1.20 / 1000) * 1000;
  const p25 = Math.round(mid * 0.90 / 1000) * 1000;
  const p75 = Math.round(mid * 1.10 / 1000) * 1000;

  const juniorSalary = Math.round(roleData.junior * locMult / 1000) * 1000;
  const seniorSalary = Math.round(roleData.senior * locMult / 1000) * 1000;

  const trendData = MARKET_TRENDS[form.jobTitle] || MARKET_TRENDS["default"];

  const confidence = expMult >= 0.95 && locMult >= 0.75 ? "High" : "Medium";

  const insights = buildInsights(form, mid, topSkill, topBoostPct, locMult);

  return { salaryMin: min, salaryMid: mid, salaryMax: max, p25, p75,
           juniorSalary, seniorSalary, topSkill, topBoostPct,
           trend: trendData.trend, trendReason: trendData.reason, confidence, insights };
}

function buildInsights(form, mid, topSkill, topBoost, locMult) {
  const ins = [];
  if (locMult < 0.3) ins.push(`Salaries in India are significantly lower than US benchmarks, but purchasing power parity makes this competitive locally.`);
  else if (locMult >= 0.95) ins.push(`${form.location.split(" ")[0]} offers some of the highest tech salaries globally — leverage this in negotiations.`);

  if (topSkill && topBoost >= 10) ins.push(`Your ${topSkill} skill is among the highest-paying in the market right now — highlight it prominently on your resume.`);
  else if (topSkill) ins.push(`Adding high-demand skills like Kubernetes, Rust, or Machine Learning could boost your salary by 10–16%.`);
  else ins.push(`Selecting relevant skills can unlock an additional 7–16% salary premium — add your tech stack above.`);

  const expLabel = form.experience.split(" ")[0];
  if (form.experience.includes("Entry") || form.experience.includes("Junior"))
    ins.push(`At ${expLabel} experience, focus on building a strong portfolio and targeting companies with structured growth paths to accelerate your salary progression.`);
  else if (form.experience.includes("Senior") || form.experience.includes("Staff"))
    ins.push(`With your experience level, total compensation (RSUs, bonuses) often adds 20–40% on top of base salary — always negotiate the full package.`);
  else
    ins.push(`Mid-level engineers who earn a promotion to Senior can see a 20–30% salary jump — consider targeting that milestone in your next review.`);

  return ins.slice(0, 3);
}

// ── Constants ──────────────────────────────────────────────────────
const JOBS = Object.keys(BASE_SALARIES);
const LOCATIONS = Object.keys(LOCATION_MULTIPLIERS);
const EDUCATIONS = Object.keys(EDUCATION_MULTIPLIERS);
const EXPERIENCES = Object.keys(EXPERIENCE_MULTIPLIERS);
const ALL_SKILLS = [
  "Python","JavaScript","TypeScript","Java","Go","Rust","C++","C#",
  "React","Node.js","AWS","GCP","Azure","Kubernetes","Docker",
  "Machine Learning","Deep Learning","SQL","MongoDB","GraphQL",
  "Terraform","CI/CD","System Design","Spark","Kafka",
];

// ── Component ──────────────────────────────────────────────────────
export default function SalaryPredictor() {
  const [form, setForm]     = useState({ jobTitle:"", experience:"", location:"", education:"", skills:[] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const toggleSkill = (s) => setForm(f => ({
    ...f,
    skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : f.skills.length < 8 ? [...f.skills, s] : f.skills,
  }));

  const isValid = form.jobTitle && form.experience && form.location && form.education;

  const predict = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {          // brief delay for UX feel
      setResult(computeSalary(form));
      setLoading(false);
    }, 900);
  };

  const reset = () => { setResult(null); setForm({ jobTitle:"", experience:"", location:"", education:"", skills:[] }); };

  const fmt = (n) => !n && n !== 0 ? "N/A" : n >= 1000 ? "$" + Math.round(n/1000) + "K" : "$" + n;

  const trendColor = result?.trend === "Rising" ? "#22c55e" : result?.trend === "Declining" ? "#ef4444" : "#f59e0b";
  const trendIcon  = result?.trend === "Rising" ? "↑" : result?.trend === "Declining" ? "↓" : "→";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0d1b2a 50%,#0a1628 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#e2e8f0" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0f1e}::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:3px}
        .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;backdrop-filter:blur(10px)}
        .sel{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#e2e8f0;padding:11px 14px;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;cursor:pointer}
        .sel:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
        .sel option{background:#0d1b2a;color:#e2e8f0}
        .chip{padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;background:rgba(255,255,255,0.03);color:#94a3b8;white-space:nowrap;font-family:inherit}
        .chip:hover{border-color:#3b82f6;color:#93c5fd;background:rgba(59,130,246,.08)}
        .chip.on{background:rgba(59,130,246,.18);border-color:#3b82f6;color:#93c5fd}
        .btn{width:100%;padding:14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);border:none;border-radius:12px;color:#fff;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s}
        .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(59,130,246,.35)}
        .btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
        .lbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#475569;margin-bottom:8px}
        .insight{background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.14);border-radius:10px;padding:10px 13px;font-size:13px;color:#94a3b8;line-height:1.6}
        .bar-bg{height:7px;border-radius:99px;background:rgba(255,255,255,.06);margin:10px 0 6px;overflow:hidden}
        .bar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#1d4ed8,#60a5fa)}
        @keyframes fuUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .a1{animation:fuUp .4s .05s ease forwards;opacity:0}
        .a2{animation:fuUp .4s .15s ease forwards;opacity:0}
        .a3{animation:fuUp .4s .25s ease forwards;opacity:0}
        .a4{animation:fuUp .4s .35s ease forwards;opacity:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .pulse{animation:pulse 1.3s ease-in-out infinite}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
        .grid2c{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:660px){.grid2{grid-template-columns:1fr}}
      `}</style>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 16px 72px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.22)", borderRadius:999, padding:"5px 14px", marginBottom:18, fontSize:12, color:"#60a5fa", fontWeight:500 }}>
            ⚡ AI-Powered · Tech Industry · 2024–2025 Data
          </div>
          <h1 style={{ fontFamily:"'Syne','Segoe UI',sans-serif", fontSize:"clamp(28px,5vw,48px)", fontWeight:800, lineHeight:1.1, marginBottom:12, background:"linear-gradient(135deg,#e2e8f0 30%,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Salary Predictor
          </h1>
          <p style={{ color:"#64748b", fontSize:15, maxWidth:440, margin:"0 auto", lineHeight:1.6 }}>
            Get an instant salary estimate tailored to your tech role, skills, and location.
          </p>
        </div>

        <div className="grid2">

          {/* ── LEFT: Form ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <div className="card">
              <div className="lbl">Job Title / Role</div>
              <select className="sel" value={form.jobTitle} onChange={e => setForm(f=>({...f,jobTitle:e.target.value}))}>
                <option value="">Select a role…</option>
                {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="lbl">Years of Experience</div>
              <select className="sel" value={form.experience} onChange={e => setForm(f=>({...f,experience:e.target.value}))}>
                <option value="">Select experience…</option>
                {EXPERIENCES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="lbl">Location / Country</div>
              <select className="sel" value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))}>
                <option value="">Select location…</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="lbl">Education Level</div>
              <select className="sel" value={form.education} onChange={e => setForm(f=>({...f,education:e.target.value}))}>
                <option value="">Select education…</option>
                {EDUCATIONS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="lbl">Skills / Tech Stack <span style={{ color:"#334155", fontWeight:400, textTransform:"none", fontSize:11 }}>({form.skills.length}/8)</span></div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:4 }}>
                {ALL_SKILLS.map(s => (
                  <button key={s} className={`chip${form.skills.includes(s)?" on":""}`} onClick={()=>toggleSkill(s)}>
                    {form.skills.includes(s)?"✓ ":""}{s}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn" disabled={!isValid||loading} onClick={predict}>
              {loading ? <span className="pulse">⚙️ Calculating…</span> : "🔮 Predict My Salary"}
            </button>
          </div>

          {/* ── RIGHT: Results ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {!result && !loading && (
              <div className="card" style={{ textAlign:"center", padding:"52px 24px" }}>
                <div style={{ fontSize:44, marginBottom:12 }}>💼</div>
                <p style={{ fontSize:14, color:"#475569", lineHeight:1.7 }}>
                  Fill in your profile and click<br /><strong style={{ color:"#60a5fa" }}>Predict My Salary</strong> to get started.
                </p>
              </div>
            )}

            {loading && (
              <div className="card" style={{ textAlign:"center", padding:"52px 24px" }}>
                <div style={{ fontSize:42, marginBottom:14 }} className="pulse">📊</div>
                <p style={{ color:"#475569", fontSize:14 }}>Crunching market data…</p>
              </div>
            )}

            {result && (
              <>
                {/* Main salary card */}
                <div className="card a1" style={{ background:"linear-gradient(135deg,rgba(29,78,216,.14),rgba(59,130,246,.05))", border:"1px solid rgba(59,130,246,.22)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div className="lbl">Estimated Annual Salary</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,4vw,36px)", fontWeight:800, color:"#60a5fa", lineHeight:1 }}>
                        {fmt(result.salaryMid)}
                        <span style={{ fontSize:14, color:"#475569", fontWeight:400, fontFamily:"'DM Sans',sans-serif" }}>/yr</span>
                      </div>
                      <div style={{ fontSize:12, color:"#475569", marginTop:5 }}>Range: {fmt(result.salaryMin)} — {fmt(result.salaryMax)}</div>
                    </div>
                    <div style={{ background: result.confidence==="High"?"rgba(34,197,94,.12)":"rgba(245,158,11,.12)", border:`1px solid ${result.confidence==="High"?"rgba(34,197,94,.28)":"rgba(245,158,11,.28)"}`, borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, color:result.confidence==="High"?"#4ade80":"#fbbf24" }}>
                      {result.confidence} Confidence
                    </div>
                  </div>
                  <div className="bar-bg"><div className="bar-fill" style={{ width:"68%" }} /></div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#475569" }}>
                    <span>P25: {fmt(result.p25)}</span><span>Median</span><span>P75: {fmt(result.p75)}</span>
                  </div>
                </div>

                {/* Trend + Skill Boost */}
                <div className="grid2c">
                  <div className="card a2" style={{ padding:15 }}>
                    <div className="lbl">Market Trend</div>
                    <div style={{ fontSize:17, fontWeight:700, color:trendColor }}>{trendIcon} {result.trend}</div>
                    <div style={{ fontSize:12, color:"#475569", marginTop:5, lineHeight:1.55 }}>{result.trendReason}</div>
                  </div>
                  <div className="card a2" style={{ padding:15 }}>
                    <div className="lbl">Top Skill Boost</div>
                    {result.topSkill ? (
                      <>
                        <div style={{ fontSize:15, fontWeight:700, color:"#a78bfa" }}>{result.topSkill}</div>
                        <div style={{ fontSize:12, color:"#475569", marginTop:5 }}>+{result.topBoostPct}% salary premium</div>
                      </>
                    ) : (
                      <div style={{ fontSize:12, color:"#475569", marginTop:5 }}>Select skills to see boost</div>
                    )}
                  </div>
                </div>

                {/* Bar chart */}
                <div className="card a3" style={{ padding:15 }}>
                  <div className="lbl">Salary Comparison</div>
                  <div style={{ display:"flex", gap:12, marginTop:10, alignItems:"flex-end" }}>
                    {[
                      { label:"Junior Avg",   val:result.juniorSalary, color:"#64748b" },
                      { label:"Your Estimate",val:result.salaryMid,    color:"#3b82f6" },
                      { label:"Senior Avg",   val:result.seniorSalary, color:"#a78bfa" },
                    ].map(({ label, val, color }) => {
                      const mx = Math.max(result.seniorSalary||0, result.salaryMid||0, result.juniorSalary||0, 1);
                      const pct = Math.max(8, Math.round((val/mx)*100));
                      return (
                        <div key={label} style={{ flex:1, textAlign:"center" }}>
                          <div style={{ height:70, background:"rgba(255,255,255,.04)", borderRadius:8, display:"flex", alignItems:"flex-end", overflow:"hidden" }}>
                            <div style={{ width:"100%", height:`${pct}%`, background:color, opacity:.75, borderRadius:"6px 6px 0 0" }} />
                          </div>
                          <div style={{ fontSize:11, fontWeight:700, color, marginTop:5 }}>{fmt(val)}</div>
                          <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Insights */}
                <div className="a4" style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div className="lbl">Insights</div>
                  {result.insights.map((ins,i) => (
                    <div key={i} className="insight"><span style={{ color:"#3b82f6", marginRight:7 }}>💡</span>{ins}</div>
                  ))}
                </div>

                {/* Reset */}
                <button onClick={reset} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, color:"#475569", padding:"10px", fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}
                  onMouseOver={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}
                  onMouseOut={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}>
                  ↺ Start Over
                </button>
              </>
            )}
          </div>
        </div>

        <p style={{ textAlign:"center", color:"#1e293b", fontSize:11, marginTop:36 }}>
          Estimates are based on 2024–2025 market benchmarks. Actual salaries vary by company, negotiation, and market conditions.
        </p>
      </div>
    </div>
  );
}
