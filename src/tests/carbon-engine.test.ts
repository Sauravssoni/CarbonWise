/**
 * CarbonWise - Carbon Calculations Engine Tests (Vitest)
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDailyTransport,
  calculateDailyEnergy,
  calculateDailyFood,
  calculateDailyConsumption,
  calculateFootprint,
} from '../lib/carbon-engine';
import { FootprintInput } from '../types';

describe('Carbon Calculation Formulas', () => {
  it('calculates transport emissions considering distance, mode, and carpool factor', () => {
    // Car = 0.18 kg CO2e / km. Solo commute of 20 km = 3.6 kg CO2e + 0 flights
    const soloCar = calculateDailyTransport('Car', 20, false, 0);
    expect(soloCar).toBeCloseTo(3.6);

    // Car share (carpooling) should split the emissions (halve it = 0.09 kg CO2e / km). 20 km commute = 1.8 kg CO2e
    const carpool = calculateDailyTransport('Car', 20, true, 0);
    expect(carpool).toBeCloseTo(1.8);

    // Cycling / Walking should be zero emissions
    const walk = calculateDailyTransport('Walk', 50, false, 0);
    expect(walk).toBe(0.0);
  });

  it('calculates correct flight additions corresponding to monthly flight count', () => {
    // 2 flights * 150 kg CO2e each / 30 days = +10 kg CO2e/day + Walk (0) = 10.0
    const flightCommute = calculateDailyTransport('Walk', 0, false, 2);
    expect(flightCommute).toBe(10.0);
  });

  it('calculates home electricity and AC use divided by household size', () => {
    // Grid factor 0.45. 300 kWh electricity = 135 kg CO2e. Daily electricity = 4.5.
    // AC medium = +5 kWh/day * 0.45 = +2.25 kg. Total daily household = 6.75 kg CO2e
    // Household size of 3 -> split should equal 2.25 kg CO2e per person
    const energyBase = calculateDailyEnergy(300, 'Medium', 3);
    expect(energyBase).toBeCloseTo(2.25);
  });

  it('calculates food emissions matching diet choices, out-of-home eating, and waste', () => {
    // Vegetarian (2.0) + Waste Sometimes (0.5) + Restaurants Weekly (0.3) = 2.8
    const foodVal = calculateDailyFood('Vegetarian', 'Sometimes', 'Weekly');
    expect(foodVal).toBe(2.8);
  });

  it('calculates consumption emissions from clothing, shipping, offset by recycling', () => {
    // 5 online orders * 1.2 = 6 kg CO2e. 1 clothing piece * 8.0 = 8 kg CO2e.
    // Monthly purchases = 14 kg CO2e. Daily purchases = 14 / 30 = 0.467 kg CO2e.
    // Recycling habit Rare = +1.0 kg/day. Total = ~1.467 kg CO2e/day
    const consumptionRare = calculateDailyConsumption(5, 1, 'Rare');
    expect(consumptionRare).toBeCloseTo(1.467, 3);
  });

  it('aggregates category breakdowns, detects highest category driver, and ensures percentages sum to 100', () => {
    const input: FootprintInput = {
      commuteMode: 'Car',
      distancePerDayKm: 50, // very high transport
      carpool: false,
      flightsThisMonth: 0,
      electricityKwhMonthly: 100,
      acUsage: 'None',
      householdSize: 4,
      dietType: 'Plant-forward', // low food
      foodWaste: 'Rare',
      eatingOutFrequency: 'Rare',
      onlineOrdersMonthly: 0,
      clothingPurchasesMonthly: 0,
      recyclingHabit: 'Often',
      reductionTarget: 10,
      preferredEffort: 'Balanced',
    };

    const result = calculateFootprint(input);
    expect(result.biggestImpactDriver).toBe('transport');
    
    const sumPercent = result.percentages.transport + 
                       result.percentages.energy + 
                       result.percentages.food + 
                       result.percentages.consumption;
    expect(sumPercent).toBeCloseTo(100.0, 1);
  });

  it('proves that recycling habit reduces consumption footprint compared to rare sorting', () => {
    const rareRecycling = calculateDailyConsumption(5, 1, 'Rare');
    const oftenRecycling = calculateDailyConsumption(5, 1, 'Often');
    expect(oftenRecycling).toBeLessThan(rareRecycling);
  });

  it('guarantees that zero or negative input values are clamped and never produce negative emissions', () => {
    const zeroTransport = calculateDailyTransport('Walk', -10, false, -5);
    expect(zeroTransport).toBe(0.0);

    const zeroEnergy = calculateDailyEnergy(-100, 'None', -2);
    expect(zeroEnergy).toBe(0.0);

    const zeroConsumption = calculateDailyConsumption(-5, -2, 'Often');
    expect(zeroConsumption).toBe(0.0);
  });
});

