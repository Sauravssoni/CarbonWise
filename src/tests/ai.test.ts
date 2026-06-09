import { describe, it, expect } from 'vitest';
import { getDeterministicInsight, getAiInsight } from '../lib/ai';
import { FootprintInput, CarbonResult } from '../types';

const mockInput: FootprintInput = {
  commuteMode: 'Car',
  distancePerDayKm: 40,
  carpool: false,
  flightsThisMonth: 1,
  electricityKwhMonthly: 400,
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
};

const mockResult: CarbonResult = {
  dailyTotal: 12.5,
  weeklyTotal: 87.5,
  monthlyTotal: 375,
  footprintBand: 'High',
  breakdown: {
    transport: 6.2,
    energy: 3.8,
    food: 1.5,
    consumption: 1.0,
  },
  percentages: {
    transport: 49.6,
    energy: 30.4,
    food: 12.0,
    consumption: 8.0,
  },
  biggestImpactDriver: 'transport',
  input: mockInput,
};

describe('AI Insight & Fallback Engine Tests', () => {
  it('correctly matches deterministic recommendations to the biggest driver category', () => {
    const insight = getDeterministicInsight(mockInput, mockResult);
    expect(insight.personalInsight).toContain('transport');
    expect(insight.customAction).toContain('carpooling');

    const foodResult: CarbonResult = {
      ...mockResult,
      biggestImpactDriver: 'food',
    };
    const foodInsight = getDeterministicInsight(mockInput, foodResult);
    expect(foodInsight.personalInsight).toContain('nutrition');
    expect(foodInsight.customAction).toContain('vegetable');
  });

  it('gracefully falls back to deterministic recommendations if no API key is supplied', async () => {
    const res = await getAiInsight(mockInput, mockResult, '');
    expect(res.source).toBe('deterministic');
    expect(res.personalInsight).toContain('transport');
  });

  it('recovers completely with deterministic backup when invalid key causes a query error', async () => {
    const res = await getAiInsight(mockInput, mockResult, 'INVALID_API_KEY');
    expect(res.source).toBe('deterministic_fallback');
    expect(res.personalInsight).toContain('transport');
  });
});
