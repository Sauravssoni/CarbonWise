# CarbonWise Software Architecture Spec

The platform is designed around strict separation of concerns, pure functional logic, and secure full-stack components.

```
                   +------------------------------+
                   |     React SPA Frontend       |
                   | (Form Wizard, Reports, Cache)|
                   +--------------+---------------+
                                  |
                   HTTP POST /api/generate-insight
                                  |
                                  v
                   +--------------+---------------+
                   |   Vercel Serverless Function |
                   |  (api/generate-insight.ts)   |
                   +--------------+---------------+
                                  |
                      If key exists, queries model
                                  |
                                  v
                   +--------------+---------------+
                   |        Gemini API        |
                   |      (gemini-3.5-flash)      |
                   +------------------------------+
```

## Architectural Decoupling

1. **Pure Modules (`/src/lib`)**: All core mathematical formulas and recommendation mappings live in pure functions (`carbon-engine.ts`, `recommendation-engine.ts`). They take raw JavaScript states and output structured answers, making them 100% unit-testable.
2. **Strict Typings (`/src/types.ts`)**: No types are loose or omitted. Strict typescript interfaces represent inputs, categories, checkpoints, actions, and custom API envelopes.
3. **Local State Engine (`/src/lib/storage.ts`)**: Persists check-ins, commitments, and streaks into browser cache. CarbonWise does not use a remote database because it does not collect accounts, emails, names, addresses, or precise location data. User check-ins and completed actions stay on the device.
4. **Serverless API Route (`/api/generate-insight.ts`)**: On Vercel, CarbonWise uses a Vercel Serverless Function at `/api/generate-insight` for optional AI insight generation. The frontend is a Vite static app. The core carbon engine and deterministic recommendations work without Gemini. It runs input validation using Zod, handles sanitization, and implements best-effort per-IP rate-limiting.
