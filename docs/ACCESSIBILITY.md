# CarbonWise — Accessibility Statement

CarbonWise is designed to be accessible to all users, following WCAG 2.1 AA guidelines.

## Implemented Accessibility Features

### Keyboard Navigation
- [x] Skip-to-main-content link on every page load
- [x] All interactive elements (buttons, radio groups, sliders, inputs) are keyboard-operable
- [x] Visible `:focus-visible` rings on all focusable elements (emerald outline, 2px)
- [x] `aria-current="page"` marks the active navigation item

### Screen Reader Support
- [x] All form steps wrapped in `<fieldset>` with `<legend>` for group labeling
- [x] Radio groups use `role="radiogroup"` with `aria-label` and `role="radio"` with `aria-checked`
- [x] Toggle switches use `role="switch"` with `aria-checked`
- [x] Progress bar in form wizard uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [x] Category breakdown bars use `role="progressbar"` with descriptive `aria-label`
- [x] All decorative icons marked `aria-hidden="true"`
- [x] Loading states use `aria-live="polite"` for dynamic announcements
- [x] Scrollable history log uses `role="log"` with `tabindex="0"` for keyboard access

### Semantic HTML
- [x] Single `<h1>` per page
- [x] Proper heading hierarchy (`h1` → `h2` → `h3` → `h4`)
- [x] `<main>` landmark wraps primary content
- [x] `<nav>` landmarks for navigation sections
- [x] `<noscript>` fallback message in `index.html`

### Motion and Visual
- [x] `prefers-reduced-motion` CSS media query disables all animations and transitions
- [x] No color-only status indicators — all states have text labels
- [x] Focus rings visible on all interactive elements via `:focus-visible`
- [x] Touch targets meet minimum ~44px sizing for mobile

### Forms
- [x] All text/number inputs have associated `<label htmlFor>` or `aria-label`
- [x] Range sliders have `aria-label` describing their purpose
- [x] Required fields marked with visible asterisk and associated labels
- [x] Optional fields labeled explicitly as "(Optional)"
- [x] Character count on text areas provides live feedback

### Error Handling
- [x] Toast notifications use accessible patterns
- [x] No color-only error indicators
- [x] AI failure silently falls back to local deterministic insight — no error shown to user

## Manual Testing Checklist

1. **Keyboard-only navigation**: Tab through entire form wizard and results without mouse
2. **Screen reader**: Test with VoiceOver (macOS) or NVDA (Windows)
3. **Reduced motion**: Enable "Reduce motion" in OS settings and verify no animations
4. **Zoom**: Test at 200% browser zoom — layout should remain usable
5. **Color contrast**: Verify text contrast meets WCAG AA (4.5:1 for normal text)
6. **Touch targets**: On mobile, verify all buttons and controls are easily tappable

## Known Limitations

- The streak day indicators (M/T/W/T/F) in the Progress Dashboard are presentational and do not reflect actual check-in days
- Some `text-[9px]` and `text-[10px]` sizes are used for supplementary labels — primary content uses standard sizes
