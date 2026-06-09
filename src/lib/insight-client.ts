/**
 * CarbonWise — Client-Side Insight Fetcher with Resilient Fallback
 *
 * Provides a safe, always-succeeding insight pipeline:
 * 1. Attempts to fetch from /api/generate-insight (server-side Gemini)
 * 2. Falls back to deterministic local insight on any failure
 * 3. Never throws, never shows errors to the user
 */

import { FootprintInput, CarbonResult, AIResponse } from '../types.js';

/** Response shape returned by both the API and local fallback */
export interface InsightResponse extends AIResponse {
  source: 'gemini' | 'deterministic' | 'deterministic_fallback' | 'local_fallback';
}

/** Default fetch timeout in milliseconds */
const FETCH_TIMEOUT_MS = 7000;

/**
 * Builds a deterministic local insight based on the user's biggest impact driver.
 * Always returns a valid InsightResponse — no network required.
 */
export function buildLocalInsight(input: FootprintInput, result: CarbonResult): InsightResponse {
  const driver = result.biggestImpactDriver;

  if (driver === 'transport') {
    return {
      source: 'local_fallback',
      personalInsight: `Your transport choices represent your biggest leverage point, driven by a travel total of ${input.distancePerDayKm || 0} km/day.`,
      motivationalNudge: 'Every active carbon-free trip you take helps avoid harmful greenhouse emissions. Small actions build sustainable compound savings!',
      customAction: 'Try carpooling or taking bus/metro transit for your primary commute on 2 days this week.',
    };
  }

  if (driver === 'energy') {
    return {
      source: 'local_fallback',
      personalInsight: `Home energy utility usage (${input.electricityKwhMonthly || 0} kWh) partitioned per capita represents your biggest footprint component.`,
      motivationalNudge: 'Trimming standby draws and keeping cooling efficiency high protects both our climate and household finances.',
      customAction: 'Reduce home AC use by one hour and wash your next batch of laundry in cold water.',
    };
  }

  if (driver === 'consumption') {
    return {
      source: 'local_fallback',
      personalInsight: 'Manufacturing and shipping your monthly deliveries and clothing represents a heavy pre-consumer carbon footprint.',
      motivationalNudge: 'Repairing and consolidating orders directly avoids energy-intensive manufacturing cycles. Repair first, purchase second!',
      customAction: 'Postpone buying any non-urgent retail apparel and combine your next online orders into one batch delivery limit.',
    };
  }

  // food fallback (default)
  return {
    source: 'local_fallback',
    personalInsight: `Your nutrition style (${input.dietType}) and eating cadence are your principal footprint contributors.`,
    motivationalNudge: 'Plant-forward recipes use a fraction of the land, water, and resources of conventional ingredients. Good cooking, good impact.',
    customAction: 'Swap meat for a completely vegetable-forward dinner on three days this week.',
  };
}

/**
 * Validates whether an unknown value conforms to the InsightResponse shape.
 * Returns true only if all required string fields are present and non-empty.
 */
export function isValidInsightResponse(value: unknown): value is InsightResponse {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.personalInsight === 'string' &&
    typeof obj.motivationalNudge === 'string' &&
    typeof obj.customAction === 'string' &&
    obj.personalInsight.length > 0 &&
    obj.motivationalNudge.length > 0 &&
    obj.customAction.length > 0
  );
}

/**
 * Fetches AI-enhanced insight from the serverless API with automatic fallback.
 *
 * Guarantees:
 * - Always returns a valid InsightResponse
 * - Never throws
 * - Falls back to local deterministic insight on any failure
 * - Respects a timeout to prevent indefinite hangs
 */
export async function fetchInsightSafely(
  input: FootprintInput,
  result: CarbonResult
): Promise<InsightResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch('/api/generate-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return buildLocalInsight(input, result);
    }

    const data: unknown = await response.json();

    if (!isValidInsightResponse(data)) {
      return buildLocalInsight(input, result);
    }

    return {
      personalInsight: data.personalInsight,
      motivationalNudge: data.motivationalNudge,
      customAction: data.customAction,
      source: data.source || 'gemini',
    };
  } catch {
    return buildLocalInsight(input, result);
  }
}
