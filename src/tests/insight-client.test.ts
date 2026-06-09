/**
 * CarbonWise — Insight Client Fallback Resilience Tests
 *
 * Tests the client-side insight fetcher guarantees:
 * - buildLocalInsight always returns valid InsightResponse
 * - isValidInsightResponse correctly validates response shape
 * - fetchInsightSafely always returns valid insight, never throws
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildLocalInsight,
  isValidInsightResponse,
  fetchInsightSafely,
  InsightResponse,
} from '../lib/insight-client';
import { FootprintInput, CarbonResult } from '../types';

/** Minimal valid FootprintInput for testing */
const MOCK_INPUT: FootprintInput = {
  commuteMode: 'Car',
  distancePerDayKm: 35,
  carpool: false,
  flightsThisMonth: 1,
  electricityKwhMonthly: 360,
  acUsage: 'Medium',
  householdSize: 2,
  dietType: 'Mixed',
  foodWaste: 'Sometimes',
  eatingOutFrequency: 'Weekly',
  onlineOrdersMonthly: 5,
  clothingPurchasesMonthly: 2,
  recyclingHabit: 'Sometimes',
  reductionTarget: 10,
  preferredEffort: 'Balanced',
  optionalNote: '',
};

/** Minimal valid CarbonResult for each driver category */
function mockResultWithDriver(driver: 'transport' | 'energy' | 'food' | 'consumption'): CarbonResult {
  return {
    dailyTotal: 12.5,
    weeklyTotal: 87.5,
    monthlyTotal: 375.0,
    breakdown: { transport: 5, energy: 3, food: 2.5, consumption: 2 },
    percentages: { transport: 40, energy: 24, food: 20, consumption: 16 },
    biggestImpactDriver: driver,
    footprintBand: 'High',
    input: MOCK_INPUT,
  };
}

// --- buildLocalInsight ---

describe('buildLocalInsight', () => {
  it('returns valid InsightResponse for transport driver', () => {
    const insight = buildLocalInsight(MOCK_INPUT, mockResultWithDriver('transport'));
    expect(insight.source).toBe('local_fallback');
    expect(insight.personalInsight).toContain('transport');
    expect(insight.motivationalNudge.length).toBeGreaterThan(0);
    expect(insight.customAction.length).toBeGreaterThan(0);
  });

  it('returns valid InsightResponse for energy driver', () => {
    const insight = buildLocalInsight(MOCK_INPUT, mockResultWithDriver('energy'));
    expect(insight.source).toBe('local_fallback');
    expect(insight.personalInsight).toContain('energy');
  });

  it('returns valid InsightResponse for food driver', () => {
    const insight = buildLocalInsight(MOCK_INPUT, mockResultWithDriver('food'));
    expect(insight.source).toBe('local_fallback');
    expect(insight.personalInsight).toContain('nutrition');
  });

  it('returns valid InsightResponse for consumption driver', () => {
    const insight = buildLocalInsight(MOCK_INPUT, mockResultWithDriver('consumption'));
    expect(insight.source).toBe('local_fallback');
    expect(insight.personalInsight).toContain('shipping');
  });

  it('always returns all required fields', () => {
    const drivers: Array<'transport' | 'energy' | 'food' | 'consumption'> = [
      'transport', 'energy', 'food', 'consumption',
    ];
    for (const driver of drivers) {
      const insight = buildLocalInsight(MOCK_INPUT, mockResultWithDriver(driver));
      expect(isValidInsightResponse(insight)).toBe(true);
    }
  });
});

// --- isValidInsightResponse ---

describe('isValidInsightResponse', () => {
  it('returns true for valid response', () => {
    const valid: InsightResponse = {
      source: 'gemini',
      personalInsight: 'Your transport is high',
      motivationalNudge: 'Keep going!',
      customAction: 'Try the bus.',
    };
    expect(isValidInsightResponse(valid)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidInsightResponse(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidInsightResponse(undefined)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isValidInsightResponse({})).toBe(false);
  });

  it('returns false for missing fields', () => {
    expect(isValidInsightResponse({ personalInsight: 'ok' })).toBe(false);
  });

  it('returns false for empty string fields', () => {
    expect(isValidInsightResponse({
      personalInsight: '',
      motivationalNudge: 'ok',
      customAction: 'ok',
    })).toBe(false);
  });

  it('returns false for non-string fields', () => {
    expect(isValidInsightResponse({
      personalInsight: 123,
      motivationalNudge: 'ok',
      customAction: 'ok',
    })).toBe(false);
  });
});

// --- fetchInsightSafely ---

describe('fetchInsightSafely', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns local fallback when fetch throws (network error)', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('transport'));
    expect(insight.source).toBe('local_fallback');
    expect(insight.personalInsight.length).toBeGreaterThan(0);
    expect(insight.motivationalNudge.length).toBeGreaterThan(0);
    expect(insight.customAction.length).toBeGreaterThan(0);
  });

  it('returns local fallback on non-200 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('energy'));
    expect(insight.source).toBe('local_fallback');
    expect(isValidInsightResponse(insight)).toBe(true);
  });

  it('returns local fallback on invalid JSON response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    });
    const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('food'));
    expect(insight.source).toBe('local_fallback');
    expect(isValidInsightResponse(insight)).toBe(true);
  });

  it('returns local fallback on invalid response shape', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ garbage: true }),
    });
    const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('consumption'));
    expect(insight.source).toBe('local_fallback');
    expect(isValidInsightResponse(insight)).toBe(true);
  });

  it('returns AI insight on valid gemini response', async () => {
    const mockApiResponse = {
      source: 'gemini',
      personalInsight: 'AI says your transport is high.',
      motivationalNudge: 'Keep pushing for greener transit!',
      customAction: 'Take the metro twice this week.',
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockApiResponse),
    });
    const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('transport'));
    expect(insight.source).toBe('gemini');
    expect(insight.personalInsight).toBe('AI says your transport is high.');
    expect(isValidInsightResponse(insight)).toBe(true);
  });

  it('never throws regardless of failure mode', async () => {
    // Test multiple failure scenarios
    const failures = [
      vi.fn().mockRejectedValue(new Error('DNS failure')),
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.reject(new Error('bad json')) }),
    ];

    for (const failingFetch of failures) {
      globalThis.fetch = failingFetch;
      const insight = await fetchInsightSafely(MOCK_INPUT, mockResultWithDriver('transport'));
      expect(isValidInsightResponse(insight)).toBe(true);
    }
  });
});
