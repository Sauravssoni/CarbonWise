# CarbonWise 🚀🌱

**CarbonWise** is a high-fidelity, educational carbon footprint awareness and tracking platform built using React, Vite, Express, and TypeScript. It is designed to help individuals understand, track, and reduce their approximate carbon footprint through transparent, deterministic calculations and personalized generative AI insights with privacy-first, device-local storage.

---

## 📌 Submission Overview

* **Chosen Vertical**: Individual Sustainability Assistant & Carbon Footprint Awareness platform.
* **Problem Statement**: Individuals lack clear, actionable, and privacy-respecting tools to understand how their daily habits translate to greenhouse gas emissions, track their progress over time, and build sustainable habits.
* **Approach**:
  1. **User Lifestyle Check**: Complete a brief, structured form covering transport, home energy, food diet, and goods consumption.
  2. **Educational Estimation**: Estimates are calculated across the four pillars using standard baseline coefficients.
  3. **Visual Analytics**: Interactive breakdowns identify the biggest emission driver and show relatable equivalents (e.g., smartphone charges, tree-growth equivalents).
  4. **Actionable Commitments**: Generates a custom weekly plan with green action items filtered by user effort commitment levels (Easy, Balanced, Aggressive).
  5. **Durable Local Privacy**: Progress is tracked entirely on-device without account creation or remote database risk.
  6. **Optional Server-Side AI**: Server-side Gemini integration provides customized insights when enabled, falling back gracefully to local deterministic insight if the key is missing or calls fail.
* **Logic Flow**:
  - **Inbound Data Verification**: `Zod` schemas validate lifestyle inputs.
  - **Emission Engine**: Pure functions calculate daily/weekly/monthly values.
  - **Translation Engine**: Translates raw carbon metrics into relatable equivalents.
  - **Action Recommendations**: Ranks next steps dynamically based on effort levels and the user's primary emission driver.
  - **Storage Protocol**: Manages local progress safely without external state side-effects.
  - **Express API Endpoint**: Secure server route runs custom rate-limiting and inputs sanitization before calling Gemini.
* **Assumptions**:
  - Educational and approximate estimates, not formal greenhouse gas accounting or compliance-ready auditing.
  - No remote database is utilized because CarbonWise does not collect accounts, emails, names, addresses, or precise location data. User check-ins and completed actions stay on the device.
  - Gemini API key is optional; fallback mode keeps the core app experience functional without an AI key.

---

## 🔒 Security Hardening Controls

* **Zero Client-Side Secret Leakage**: API keys are isolated on the Node.js backend.
* **Inbound Telemetry Sanitization**: Custom string fields are capped at 200 characters and HTML-escaped.
* **Numerical Bounds Clamping**: Validation boundaries block buffer overflows and extreme numbers (e.g., commute capped at 1,000 km/day).
* **Express Hardening**: Security headers set dynamically (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and `X-Frame-Options: DENY` in production / `SAMEORIGIN` in sandbox development).
* **Payload Limit**: JSON body limit restricted to 10kb to avoid memory exhaust patterns.
* **IP Rate Limiting**: Capped at 15 check-ins per IP per minute.
* **Zero PII Surface**: No usernames, emails, OAuth tokens, databases, or cookies are stored.

---

## ♿ Accessibility (a11y) & UX

* **Semantic HTML**: Standard structure tags (`<main>`, `<section>`, `<header>`, `<footer>`).
* **Keyboard Navigation**: Entire check-in wizard can be navigated via `Tab` and `Enter`/`Space`.
* **Explicit Labels**: Form inputs have strict `htmlFor` tags binding them to input fields.
* **Visual States**: High-contrast active focus outlines, readable font scale, and mobile-friendly tap targets.
* **Aria Status**: Toast alerts and validation errors implement `role="alert"` or `aria-live`.
* **Screen Reader Friendly**: Graphs and category drivers have textual descriptions.

---

## 🛠️ Setup & Local Runtime

### Prerequisites
Ensure Node.js (v18+) is installed.

### Setup
Install the dependencies cleanly:
```bash
npm install
```

### Run Project Dev Environment
Boots full-stack Express server wrapping Vite SPA:
```bash
npm run dev
```

### Build Production Bundle
Builds Vite assets and compiles Express backend:
```bash
npm run build
```

### Launch Production Server
Launches the compiled server:
```bash
npm start
```

---

## 🧪 Automated Testing Matrix

CarbonWise includes a comprehensive test suite using Vitest. Run the test suite:
```bash
npm run test
```
* **Testing Scope**: 32 automated tests covering validation, storage, carbon calculations, impact translation, recommendation logic, and AI fallback safety.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY=
```
*(Optional: If empty or missing, the server automatically defaults to the local deterministic insight engine).*

---

## ⚠️ Known Limitations

* **Estimates only**: All calculations are approximate and intended for awareness, not certified compliance reporting.
* **Device Lock**: Local history and streak data stay on the specific browser and device used, and will be cleared if the browser cache is wiped.
* **Deterministic Fallback**: If the Gemini API key is missing or fails, insights are generated locally using the deterministic rules engine.
