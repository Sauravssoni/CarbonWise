# CarbonWise Platform Security Analysis

We enforce comprehensive full-stack security designs from the outset:

### 1. Schema Validation
All inbound parameters sent to our API endpoints undergo explicit schema matching via `Zod`. Type coercion, type bounds, and enum checks are validated strictly before execution.

### 2. Numerical Clamps and Length Caps
To block buffer overflows, extreme load scenarios, or strange calculation answers, numerical inputs undergo strict validation clamps:
- Commute mileage per day is capped at 1,000 km.
- Household density is capped between 1 and 20 occupancy members.
- Delivery packages are capped at 500/month.
- Fast-fashion clothing is capped at 100/month.
- Custom textual note fields are capped at 200 characters and are HTML-escaped using safe sanitize protocols before rendering.

### 3. Server-Side Secret Isolation
AI API keys are isolated on the Node.js backend. Inbound telemetry payload is parsed server-side: no public API credentials have transit to client-side bundles.

### 4. Custom HTTP Security Headers
Express appends standard, robust security layers:
- `X-Content-Type-Options: nosniff` (guards against MIME type sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (disables frame hardware access)
- `X-Frame-Options: SAMEORIGIN` in sandbox development or `DENY` in static production bundles.
