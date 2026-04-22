# 💼 AI-Powered Salary Predictor

> An intelligent salary prediction system for Tech / Software Engineering roles.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-blueviolet?style=flat-square)
![Tailwind](https://img.shields.io/badge/Styling-CSS_in_JS-38BDF8?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 Features

- 🎯 **Role-based prediction** — 20+ tech roles from SWE to CTO
- 📍 **Location-aware** — Salary adjusted for 10 countries/regions
- 🎓 **Education factor** — From Bootcamp to PhD
- 🛠️ **Skill stack boost** — See which skills command the highest premium
- 📊 **Percentile breakdown** — P25, Median, P75 salary ranges
- 📈 **Market trend** — Rising / Stable / Declining with AI reasoning
- 💡 **AI Insights** — 3 personalized tips from Claude AI
- 📉 **Comparison chart** — Your estimate vs Junior & Senior averages

---

## 🖥️ Demo

Fill in your profile → Click **Predict My Salary** → Get an instant AI-driven salary estimate with full market analysis.

---

## 🗂️ Project Structure

```
salary-predictor/
├── salary-predictor.jsx   # Main React component (all-in-one)
├── README.md              # Project documentation
```

---

## ⚙️ Setup & Usage

### Option 1 — Run in Claude.ai Artifacts
Paste `salary-predictor.jsx` directly into a Claude.ai React artifact and it runs instantly.

### Option 2 — Run locally with Vite

```bash
# 1. Clone the repo
git clone https://github.com/Annu012/salary-predictor.git
cd salary-predictor

# 2. Install dependencies
npm create vite@latest . -- --template react
npm install

# 3. Replace src/App.jsx with salary-predictor.jsx content

# 4. Start the dev server
npm run dev
```

---

## 🤖 How It Works

1. User fills in: Job Title, Experience, Location, Education, and Skills
2. The app sends a structured prompt to **Claude Sonnet** via the Anthropic API
3. Claude returns a JSON payload with salary range, percentiles, trend, skill boosts, and insights
4. The UI renders the results with animated charts and cards

---

## 🧠 AI Model

| Property | Value |
|----------|-------|
| Model | `claude-sonnet-4-20250514` |
| Provider | Anthropic |
| Input | Structured profile prompt |
| Output | JSON salary analysis |

---

## 📦 Tech Stack

- **React 18** — UI framework
- **Anthropic API** — AI salary analysis (`/v1/messages`)
- **CSS-in-JS** — Custom styling with animations
- **Google Fonts** — Syne + DM Sans typography

---

## 🌍 Supported Locations

| Region | Coverage |
|--------|----------|
| 🇺🇸 United States | ✅ |
| 🇬🇧 United Kingdom | ✅ |
| 🇨🇦 Canada | ✅ |
| 🇩🇪 Germany | ✅ |
| 🇮🇳 India | ✅ |
| 🇦🇺 Australia | ✅ |
| 🇳🇱 Netherlands | ✅ |
| 🇸🇬 Singapore | ✅ |
| 🇫🇷 France | ✅ |
| 🌍 Remote (Global) | ✅ |

---

## ⚠️ Disclaimer

Salary estimates are AI-generated for **informational purposes only**. Actual compensation varies by company, negotiation, team size, and market conditions.

---

## 👩‍💻 Author

**Anisa Shaikh**
- GitHub: [@Annu012](https://github.com/Annu012)
- LinkedIn: [anisa-shaikh11](https://www.linkedin.com/in/anisa-shaikh11)

---

## 📄 License

This project is licensed under the MIT License.
