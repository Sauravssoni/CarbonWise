# CarbonWise Software Architecture Speccing

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
                   |     Express Backend Server   |
                   | (Security Headers, Rate Lim) |
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

1. **Pure Modules (`/src/lib`)**: All core mathematical formulas and recommendation mappings live in pure functions (`carbon-engine.ts`, `recommendation-engine.ts`). They take raw JavaScript states and output structured answers, making them 100% unit-testable under NodeJS or browsers.
2. **Strict Typings (`/src/types.ts`)**: No types are loose or omitted. Strict typescript interfaces represent inputs, categories, checkpoints, actions, and custom API envelopes.
3. **Local State Engine (`/src/lib/storage.ts`)**: Persists check-ins, commitments, and streaks into browser cache. CarbonWise does not use a remote database because it does not collect accounts, emails, names, addresses, or precise location data. User check-ins and completed actions stay on the device. This reduces privacy risk and keeps the MVP secure. It detects environment wrappers so it never throws errors during SSR/Vite build-times or unit testing.
4. **Security Filters (`/server.ts`)**: Embeds Zod parsing, trims long text buffers, applies responsive CORS/framing policies, and isolates API credentials server-side.
