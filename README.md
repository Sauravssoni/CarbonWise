# CarbonWise 🚀🌱

**CarbonWise** is a high-fidelity, educational carbon footprint awareness and tracking platform built using React, Vite, Express, and TypeScript.

It is designed to help individuals **understand, track, and reduce** their approximate carbon footprint through transparent, deterministic calculations and personalized generative AI insights with absolute privacy.

---

## 🌟 Solution Core Pillars

CarbonWise maps directly to key behavioral change metrics for climate awareness:

### 1. Understand (Educational Estimates & Transparency)
- **Interactive Footprint Wizard**: A step-by-step form covering transport, home energy, food diet, and goods consumption.
- **Carbon Snapshot**: Real-time equivalent visualizations (e.g., matching emissions to equivalent tree seedlings grown, km driven, or smartphone charges).
- **Category Breakdown & Focus Drives**: Clean, high-contrast SVG visualization of category weights.
- **Assumptions Panel**: Detailed and referenceable formulas based on actual educational baselines (DEFRA 2023, IEA Emission Factors v1.4, IPCC, and CoolClimate).

### 2. Track (Durable Local Retentions)
- **Check-ins History**: Interactive timelines stored entirely in local storage to keep 100% data privacy.
- **Habit Streak & Activity Counters**: Automatically tracks overall carbon averages, active streak intervals, and progress shifts over time.

### 3. Reduce (Commitment Hub)
- **Effort-Based Action Strategy**: Personalized next-step micro-goals filtered by user-declared preferred commitment levels (Easy, Balanced, or Aggressive).
- **Active Commitments Loop**: Select, commit, and toggle action items, triggering responsive completion feedback toasts.

### 4. Interactive Insights (Optional Generative AI with Stable Fallback)
- **Generative AI Proxy Route**: Secure, server-side `@google/genai` integration with `gemini-3.5-flash` checking for active API secrets.
- **Robust Deterministic Fallback**: Falls back gracefully to high-quality local predictions on network timeouts, bad outputs, or missing API keys—ensuring 100% platform availability.

---

## 🔬 Carbon Calculations Accuracy Disclaimer

> **Educational Estimate Copy**:  
> *CarbonWise provides educational estimates based on transparent assumptions. It is designed for awareness and health-minded habit change, not official greenhouse gas auditing. All final emission metrics are approximate.*

---

## 📦 Stack Architecture & Environment Configuration

The application operates as a single-container full-stack node runtime:

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide icons, and Motion animation framework.
- **Backend API**: Minimalist Express.ts serving build artifacts and `/api/generate-insight`.
- **Database**: CarbonWise does not use a remote database because it does not collect accounts, emails, names, addresses, or precise location data. User check-ins and completed actions stay on the device. This reduces privacy risk and keeps the MVP secure.
- **Secrets Protocol**: Lazily initialized server-side `GEMINI_API_KEY` prevents key leakage to the browser.
- **Rate limiting / Hardening**: High-security headers configured in Express (`Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN/DENY`), with JSON body parser bounds of 10kb to block malicious payloads.

---

## ⚙️ Running & Testing Locally

### Initial Setup
Install the project dependencies first:
```bash
npm install
```

### Run Project Dev Environment
Boots full-stack Express server wrapping Vite SPA:
```bash
npm run dev
```

### Build Production Bundle
Builds Vite assets and bundles Express TS backend server via CJS compilation:
```bash
npm run build
```

### Launch Production Container Mode
Runs the compiled server:
```bash
npm run start
```

### Automated Testing Matrix
Runs 32 automated tests verifying validation schemas, storage persistence, carbon-engine formulas, recommendation priority algorithms, AI fallback safety, and translators:
```bash
npm run test
```

---

## 🔒 Security Hardening Controls
- **No Client-Side Secrets**: Gemini keys remain server-side.
- **Input Sanitization**: Numerical input parameters are strictly clamped (`distance किलोमीटर ≤ 1,000`, `householdSize ∈ [1, 20]`), and text comments are restricted to 200 character caps.
- **Strict Headers**: Frame-guard, MIME type sniffing blocks, and device permission rails prevent injection patterns.
- **Zero PII Storage**: Name, email, location tracking, and contact details are completely omitted to ensure absolute confidentiality.
