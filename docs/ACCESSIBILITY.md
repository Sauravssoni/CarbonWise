# CarbonWise Accessibility Design Specs

CarbonWise is engineered to be fully inclusive, meeting WCAG 2.1 AA benchmarks from the source:

### 1. Semantic Layout
Layout controls are enclosed in semantic structural containers (`<header>`, `<main>`, `<footer>`, `<form>`).

### 2. Form Wizard Navigability
Inputs, slider ranges, and inputs have matched, explicit labels using matching `htmlFor` targets. Options are nested under explicit `<div role="radiogroup">` wrappers with explicit `aria-label` settings.

### 3. Keyboard Visibility Action Rings
Focus rings are highly visible across custom radio blocks, checkboxes, buttons, and custom inputs utilizing standard `focus:ring-2 focus:ring-emerald-500` rings.

### 4. Color and Contrast
Text pairings conform to WCAG contrast guidelines, choosing rich slate charcoal hues on soft off-white backgrounds, avoiding pale yellow/green contrasts.

### 5. Screen Reader Auditable alerts
Our custom success alerts are loaded under explicit `role="alert"` and `aria-live="assertive"` tags, notifying assistive users instantly. All icons have fallback descriptive screen-reader nodes. Showcases and translation progress segments are fully audible.
