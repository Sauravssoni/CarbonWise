# CarbonWise — Carbon Footprint Awareness Platform

CarbonWise is an educational lifestyle carbon footprint awareness platform. It allows users to estimate their carbon footprints across commuting, utilities, nutrition, and shopping categories, and commits to micro-action items locally to build positive green habits.

---

## Technical Stack Features

1. **Deterministic Calculation Engine**: Custom coefficients for transport distance, aircraft legs per month, home heating, per capita electricity allocations, diet types, parcel delivery, and garment acquisitions.
2. **Personalized Intelligent Insights via Gemini 3.5**: Server-side proxy calls to the `@google/genai` model `gemini-3.5-flash` directly, returning structured JSON response schemas for smart advices, falls back smoothly to local deterministic predictions if offline.
3. **Pristine Responsive CSS Design**: High-contrast, mobile-friendly wizard layouts, pixel-perfect custom progress gauges, relatable unit metrics, and transition animation sequences.
4. **Resilient Local Retention Cache**: Fully functional offline history, checked indices, saved micro-commitment lists and habit streaks. No external databases, trackers or login accounts required, retaining 100% data confidentiality.
5. **Rigorous Coverage Matrix**: Thorough automated unit testing suite utilizing `vitest` schemas, ensuring calculation engine exactness, limits, and storage transitions conform to production specifications.
