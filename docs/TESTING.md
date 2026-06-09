# CarbonWise Verification & Testing Matrix

We incorporate 50 automated tests covering validation, storage, carbon calculations, impact translation, recommendation logic, AI fallback safety, and API/client fallback resilience to guarantee resilient stability.

### Automated Testing Matrix

1. **`validation.test.ts`**:
   - Confirms valid complete inputs parse cleanly.
   - Asserts non-allowlist enums or wrong commute modes fail.
   - Varies and checks distance bounds, household size bounds, and note length limits.

2. **`carbon-engine.test.ts`**:
   - Exercises transport formulas including bike, carpool halving, and rail.
   - Tests flight allocations.
   - Asserts household per capita energy splits.
   - Verifies diet baseline choices, waste additions, and package transport factors.
   - Ensures computed category percentages sum to 100%.

3. **`recommendation-engine.test.ts`**:
   - Asserts heavy drivers receive proper priority actions.
   - Confirms car commuters get carpool recommendations.
   - Verifies intense HVAC schedules trigger cooling adjustments.
   - Checks that diet, shopping, and repair actions prioritize accurately.

4. **`impact-translator.test.ts`**:
   - Asserts conversion constants scale properly.
   - Tests zeroes and large inputs.
   - Guarantees outputs never drop below zero.

5. **`storage.test.ts`**:
   - Checks starting initial arrays are empty.
   - Verifies check-ins persist correctly.
   - Confirms completed actions save to active commitments.

6. **`ai.test.ts`**:
   - Asserts deterministic rules generate correctly.
   - Validates Gemini JSON schemas.
   - Verifies correct graceful deterministic fallback on AI failures or timeouts.

7. **`insight-client.test.ts`**:
   - Verifies `buildLocalInsight` returns valid response for all four driver categories.
   - Validates `isValidInsightResponse` rejects null, undefined, empty, and malformed objects.
   - Tests `fetchInsightSafely` returns local fallback on network errors, non-200 responses, invalid JSON, and invalid response shapes.
   - Confirms valid Gemini responses are correctly returned.
   - Guarantees `fetchInsightSafely` never throws regardless of failure mode.

### Running the verification suites
```bash
npm run test
```
This runs the entire Vitest test suite and outputs the status logs.
