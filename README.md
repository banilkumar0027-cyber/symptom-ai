# SymptomAI — Pattern-Powered Health Journal

A full-stack Next.js app that helps people with chronic conditions track symptoms, discover triggers, and share insights with their doctors — powered by the Claude AI API.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set your Anthropic API key
Create a `.env.local` file:
```env
ANTHROPIC_API_KEY=your_api_key_here
```
Get a key at: https://console.anthropic.com

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
symptom-ai/
├── app/
│   ├── api/
│   │   └── insight/route.ts     # Claude AI insight endpoint
│   ├── globals.css              # Design tokens + global styles
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   └── page.tsx                 # Main app shell
├── components/
│   ├── Header.tsx               # Sticky header with streak
│   ├── BottomNav.tsx            # Tab navigation
│   ├── LogTab.tsx               # 5-step daily logging form
│   ├── HistoryTab.tsx           # Collapsible entry history
│   ├── InsightsTab.tsx          # AI insights + pattern charts
│   └── ProfileTab.tsx           # User profile + stats
├── lib/
│   ├── store.ts                 # Zustand state (persisted)
│   └── utils.ts                 # Pattern detection + helpers
├── types/
│   └── index.ts                 # All TypeScript types + constants
└── README.md
```

---

## ✨ Features

### MVP (Implemented)
- **5-step daily log**: symptoms, sleep/stress, food, mood, notes
- **Persistent storage**: all data saved to localStorage via Zustand
- **AI insights**: Claude generates personalized analysis after each log
- **Pattern detection**: algorithm finds trigger→symptom correlations
- **Severity trends**: recharts line chart of 14-day history
- **Entry history**: collapsible cards with full entry detail
- **User profile**: conditions, stats, streak tracking
- **Streak counter**: motivates daily logging

### Architecture
- **Frontend**: Next.js 14 App Router + TypeScript
- **Styling**: CSS variables + Tailwind utility classes
- **State**: Zustand with localStorage persistence
- **AI**: Anthropic Claude API (claude-opus-4-6)
- **Charts**: Recharts
- **Fonts**: Syne (display) + DM Sans (body)

---

## 🗺️ Roadmap

### v1.5
- [ ] Supabase backend (multi-device sync)
- [ ] User authentication
- [ ] Wearable integration (Apple Health, Fitbit via API)
- [ ] PDF doctor report export (react-pdf)
- [ ] Push notification reminders (PWA)
- [ ] Medication tracking module

### v2.0
- [ ] React Native mobile app (Expo)
- [ ] Clinic white-label B2B version
- [ ] Stripe subscription (Freemium → Pro $9.99/mo)
- [ ] Shareable doctor report links

---

## 💰 Monetization Plan

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 7-day history, basic tracking |
| Pro | $9.99/mo | Unlimited history, AI insights, pattern detection, PDF export |
| Family | $14.99/mo | Up to 4 profiles |
| Clinic | $99-299/mo | White-label, patient dashboard |

---

## 🔒 Privacy
All health data is stored locally by default. No data is transmitted except to the Anthropic API for insight generation (the entry content only — no PII).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Variables + Tailwind CSS |
| State | Zustand + localStorage |
| AI | Anthropic Claude API |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Fonts | Google Fonts (Syne + DM Sans) |

---

Built with ❤️ and Claude AI.
