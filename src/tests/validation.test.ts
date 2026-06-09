/**
 * CarbonWise - Validation Schema Tests (Vitest)
 */

import { describe, it, expect } from 'vitest';
import { FootprintSchema } from '../lib/validation';

const VALID_MOCK_INPUT = {
  commuteMode: 'Car',
  distancePerDayKm: 15,
  carpool: false,
  flightsThisMonth: 1,
  electricityKwhMonthly: 300,
  acUsage: 'Medium',
  householdSize: 3,
  dietType: 'Vegetarian',
  foodWaste: 'Sometimes',
  eatingOutFrequency: 'Weekly',
  onlineOrdersMonthly: 5,
  clothingPurchasesMonthly: 2,
  recyclingHabit: 'Sometimes',
  reductionTarget: 10,
  preferredEffort: 'Balanced',
  optionalNote: 'Commuting green notes',
};

describe('Form Fields and Validation Schema', () => {
  it('passes for complete, valid inputs', () => {
    const res = FootprintSchema.safeParse(VALID_MOCK_INPUT);
    expect(res.success).toBe(true);
  });

  it('rejects an invalid choice of commuteMode', () => {
    const invalidInput = { ...VALID_MOCK_INPUT, commuteMode: 'Rocket' };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });

  it('rejects negative distance bounds', () => {
    const invalidInput = { ...VALID_MOCK_INPUT, distancePerDayKm: -5 };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });

  it('rejects excessive distances', () => {
    const invalidInput = { ...VALID_MOCK_INPUT, distancePerDayKm: 1050 };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });

  it('rejects an invalid household size below 1', () => {
    const invalidInput = { ...VALID_MOCK_INPUT, householdSize: 0 };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });

  it('rejects household sizes exceeding the cap', () => {
    const invalidInput = { ...VALID_MOCK_INPUT, householdSize: 25 };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });

  it('rejects excessive length optional notes', () => {
    const longNote = 'A'.repeat(250);
    const invalidInput = { ...VALID_MOCK_INPUT, optionalNote: longNote };
    const res = FootprintSchema.safeParse(invalidInput);
    expect(res.success).toBe(false);
  });
});
