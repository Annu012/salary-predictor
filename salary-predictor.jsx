import { useState } from "react";

const JOBS = [
  "Software Engineer", "Senior Software Engineer", "Staff Engineer", "Principal Engineer",
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer",
  "Data Scientist", "ML Engineer", "AI Engineer", "Data Engineer",
  "Product Manager", "Engineering Manager", "CTO", "VP of Engineering",
  "Cloud Architect", "Security Engineer", "QA Engineer", "Mobile Developer",
];

const LOCATIONS = [
  "United States 🇺🇸", "United Kingdom 🇬🇧", "Canada 🇨🇦", "Germany 🇩🇪",
  "India 🇮🇳", "Australia 🇦🇺", "Netherlands 🇳🇱", "Singapore 🇸🇬",
  "France 🇫🇷", "Remote (Global) 🌍",
];

const EDUCATIONS = [
  "High School Diploma", "Associate Degree", "Bachelor's Degree",
  "Master's Degree", "PhD / Doctorate", "Bootcamp Graduate",
];

const ALL_SKILLS = [
  "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++", "C#",
  "React", "Node.js", "AWS", "GCP", "Azure", "Kubernetes", "Docker",
  "Machine Learning", "Deep Learning", "SQL", "MongoDB", "GraphQL",
  "Terraform", "CI/CD", "System Design", "Spark", "Kafka",
];

export default function SalaryPredictor() {
  const [form, setForm] = useState({
    jobTitle: "",
    experience: "",
    location: "",
    education: "",
    skills: [],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : f.skills.length < 8 ? [...f.skills, skill] : f.skills,
    }));
  };

  const isValid = form.jobTitle && form.experience && form.location && form.education;

  const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `You are a tech industry salary expert with deep knowledge of global compensation benchmarks for 2024-2025.

A user wants a salary prediction. Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "salaryMin": <number in USD/year>,
  "salaryMid": <number in USD/year>,
  "salaryMax": <number in USD/year>,
  "currency": "USD",
  "confidence": <"High" | "Medium" | "Low">,
  "percentile25": <number>,
  "percentile75": <number>,
  "marketTrend": <"Rising" | "Stable" | "Declining">,
  "trendReason": "<1-sentence reason>",
  "topSkillBoost": "<1 skill from their list that boosts pay the most, or empty string>",
  "topSkillBoostPercent": <number 0-30>,
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "compareTo": {
    "juniorSalary": <number>,
    "seniorSalary": <number>
  }
}

User's profile:
- Job Title: ${form.jobTitle}
- Years of Experience: ${form.experience}
- Location: ${form.location}
- Education: ${form.education}
- Skills: ${form.skills.length > 0 ? form.skills.join(", ") : "Not specified"}

Base the salary on real market data. Adjust for location (e.g., India salaries are much lower than US). Be realistic and precise.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    n >= 1000 ? "$" + (n / 1000).toFixed(0) + "K" : "$" + n;

  const trendColor = result?.marketTrend === "Rising"
    ? "#22c55e" : result?.marketTrend === "Declining" ? "#ef4444" : "#f59e0b";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 40%, #0a1628 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }

        select, input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #e2e8f0;
          padding: 12px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        select:focus, input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        select option { background: #0d1b2a; color: #e2e8f0; }

        .skill-chip {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          white-space: nowrap;
        }
        .skill-chip:hover { border-color: #3b82f6; color: #93c5fd; }
        .skill-chip.active {
          background: rgba(59,130,246,0.18);
          border-color: #3b82f6;
          color: #93c5fd;
        }

        .predict-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .predict-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.35);
        }
        .predict-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .salary-bar {
          height: 8px;
          border-radius: 99px;
          background: rgba(255,255,255,0.06);
          margin: 12px 0;
          position: relative;
          overflow: visible;
        }
        .salary-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa);
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .insight-card {
          background: rgba(59,130,246,0.06);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.35s; opacity: 0; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .pulse { animation: pulse 1.4s ease-in-out infinite; }

        .label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 8px;
        }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 20, fontSize: 13, color: "#60a5fa"
          }}>
            <span>⚡</span> AI-Powered · Tech Industry · 2024–2025 Data
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800, lineHeight: 1.1, marginBottom: 14,
            background: "linear-gradient(135deg, #e2e8f0 30%, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Salary Predictor
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            Get an AI-driven salary estimate tailored to your tech profile, role, and location.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Left column — form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Job Title */}
            <div className="card">
              <div className="label">Job Title / Role</div>
              <select value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}>
                <option value="">Select a role…</option>
                {JOBS.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div className="card">
              <div className="label">Years of Experience</div>
              <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
                <option value="">Select experience…</option>
                <option>0–1 years (Entry Level)</option>
                <option>2–3 years (Junior)</option>
                <option>4–6 years (Mid-Level)</option>
                <option>7–10 years (Senior)</option>
                <option>11–15 years (Staff / Lead)</option>
                <option>15+ years (Principal / Executive)</option>
              </select>
            </div>

            {/* Location */}
            <div className="card">
              <div className="label">Location / Country</div>
              <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                <option value="">Select location…</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Education */}
            <div className="card">
              <div className="label">Education Level</div>
              <select value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))}>
                <option value="">Select education…</option>
                {EDUCATIONS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>

            {/* Predict button */}
            <button className="predict-btn" disabled={!isValid || loading} onClick={predict}>
              {loading ? <span className="pulse">Analyzing your profile…</span> : "🔮 Predict My Salary"}
            </button>
            {error && <p style={{ color: "#f87171", fontSize: 14, textAlign: "center" }}>{error}</p>}
          </div>

          {/* Right column — skills + results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Skills */}
            <div className="card">
              <div className="label">Skills / Tech Stack <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", fontSize: 11 }}>(up to 8)</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {ALL_SKILLS.map(s => (
                  <button
                    key={s}
                    className={`skill-chip${form.skills.includes(s) ? " active" : ""}`}
                    onClick={() => toggleSkill(s)}
                  >
                    {form.skills.includes(s) ? "✓ " : ""}{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {!result && !loading && (
              <div className="card" style={{ textAlign: "center", padding: "40px 24px", color: "#334155" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
                <p style={{ fontSize: 15 }}>Fill in your profile and click<br />Predict to see your salary range.</p>
              </div>
            )}

            {loading && (
              <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }} className="pulse">🤖</div>
                <p style={{ color: "#475569", fontSize: 15 }}>AI is analyzing market data…</p>
              </div>
            )}

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Main salary */}
                <div className="card fade-up fade-up-1" style={{
                  background: "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(59,130,246,0.06))",
                  border: "1px solid rgba(59,130,246,0.25)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div className="label">Estimated Annual Salary</div>
                      <div style={{
                        fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 38px)",
                        fontWeight: 800, color: "#60a5fa", lineHeight: 1
                      }}>
                        {fmt(result.salaryMid)}
                        <span style={{ fontSize: 16, color: "#475569", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/yr</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
                        Range: {fmt(result.salaryMin)} — {fmt(result.salaryMax)}
                      </div>
                    </div>
                    <div style={{
                      background: result.confidence === "High" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                      border: `1px solid ${result.confidence === "High" ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                      borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                      color: result.confidence === "High" ? "#4ade80" : "#fbbf24"
                    }}>
                      {result.confidence} Confidence
                    </div>
                  </div>

                  <div className="salary-bar">
                    <div className="salary-bar-fill" style={{ width: "70%" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569" }}>
                    <span>P25: {fmt(result.percentile25)}</span>
                    <span>Median</span>
                    <span>P75: {fmt(result.percentile75)}</span>
                  </div>
                </div>

                {/* Market trend + skill boost */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="card fade-up fade-up-2" style={{ padding: 16 }}>
                    <div className="label">Market Trend</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: trendColor }}>
                      {result.marketTrend === "Rising" ? "↑" : result.marketTrend === "Declining" ? "↓" : "→"} {result.marketTrend}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 4, lineHeight: 1.5 }}>
                      {result.trendReason}
                    </div>
                  </div>

                  <div className="card fade-up fade-up-2" style={{ padding: 16 }}>
                    <div className="label">Top Skill Boost</div>
                    {result.topSkillBoost ? (
                      <>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa" }}>
                          {result.topSkillBoost}
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                          +{result.topSkillBoostPercent}% salary premium
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Add skills to see boost</div>
                    )}
                  </div>
                </div>

                {/* vs Junior / Senior */}
                <div className="card fade-up fade-up-3" style={{ padding: 16 }}>
                  <div className="label">Salary Comparison</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    {[
                      { label: "Junior Avg", val: result.compareTo?.juniorSalary, color: "#64748b" },
                      { label: "Your Estimate", val: result.salaryMid, color: "#3b82f6" },
                      { label: "Senior Avg", val: result.compareTo?.seniorSalary, color: "#a78bfa" },
                    ].map(({ label, val, color }) => {
                      const max = Math.max(result.compareTo?.seniorSalary, result.salaryMid, result.compareTo?.juniorSalary);
                      const pct = Math.round((val / max) * 100);
                      return (
                        <div key={label} style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>{label}</div>
                          <div style={{
                            height: 60, background: "rgba(255,255,255,0.04)", borderRadius: 8,
                            display: "flex", alignItems: "flex-end", overflow: "hidden"
                          }}>
                            <div style={{
                              width: "100%", height: `${pct}%`, background: color,
                              opacity: 0.7, borderRadius: "6px 6px 0 0", transition: "height 1s ease"
                            }} />
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4 }}>{fmt(val)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Insights */}
                <div className="fade-up fade-up-4" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="label">AI Insights</div>
                  {result.insights?.map((ins, i) => (
                    <div key={i} className="insight-card">
                      <span style={{ color: "#3b82f6", marginRight: 8 }}>💡</span>{ins}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#1e293b", fontSize: 12, marginTop: 40 }}>
          Estimates are AI-generated for informational purposes only. Actual salaries vary by company, negotiation, and market conditions.
        </p>
      </div>
    </div>
  );
}
