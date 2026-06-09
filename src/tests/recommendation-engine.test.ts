/**
 * CarbonWise - Recommendations Engine Tests (Vitest)
 */

import { describe, it, expect } from 'vitest';
import { generateGreenNextStep, generateReductionPlan } from '../lib/recommendation-engine';
import { FootprintInput } from '../types';

const BASE_INPUT: FootprintInput = {
  commuteMode: 'Walk',
  distancePerDayKm: 0,
  carpool: false,
  flightsThisMonth: 0,
  electricityKwhMonthly: 150,
  acUsage: 'None',
  householdSize: 2,
  dietType: 'Vegetarian',
  foodWaste: 'Rare',
  eatingOutFrequency: 'Rare',
  onlineOrdersMonthly: 1,
  clothingPurchasesMonthly: 0,
  recyclingHabit: 'Sometimes',
  reductionTarget: 10,
  preferredEffort: 'Balanced',
};

describe('Recommendations and Actions Selection Engine', () => {
  it('selects transport commute recommendation for regular car users', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      commuteMode: 'Car',
      distancePerDayKm: 25,
    };
    const step = generateGreenNextStep(input);
    expect(step.category).toBe('transport');
    expect(step.text).toContain('short car trips');
  });

  it('selects home cooling recommendation for moderate or heavy AC users', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      acUsage: 'High',
    };
    const step = generateGreenNextStep(input);
    expect(step.category).toBe('energy');
    expect(step.text).toContain('AC');
  });

  it('selects food swap recommendation for heavy meat consumers', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      dietType: 'High meat',
    };
    const step = generateGreenNextStep(input);
    expect(step.category).toBe('food');
    expect(step.text).toContain('plant-forward');
  });

  it('selects supply chain/delivery consolidation tip for frequent online buyers', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      onlineOrdersMonthly: 8,
    };
    const step = generateGreenNextStep(input);
    expect(step.category).toBe('consumption');
    expect(step.text).toContain('online order');
  });

  it('selects repair/reuse option if apparel purchasing is active', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      clothingPurchasesMonthly: 3,
    };
    const step = generateGreenNextStep(input);
    expect(step.category).toBe('consumption');
    expect(step.text).toContain('Repair');
  });

  it('generates multi-layered reduction plan addressing top driver emissions', () => {
    const input: FootprintInput = {
      ...BASE_INPUT,
      commuteMode: 'Car',
      distancePerDayKm: 60, // Heavy commuter
      preferredEffort: 'Aggressive',
    };

    const plan = generateReductionPlan(input);
    expect(plan.length).toBe(3);
    
    // One of the steps should prioritize transport
    const hasTransport = plan.some(act => act.category === 'transport');
    expect(hasTransport).toBe(true);
  });
});
