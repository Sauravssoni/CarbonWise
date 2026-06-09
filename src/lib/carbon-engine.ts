/**
 * CarbonWise - Deterministic Carbon Engine
 */

import { FootprintInput, CarbonResult, CategoryBreakdown, CategoryPercentages } from '../types';
import {
  EMISSION_FACTORS_TRANSPORT,
  EMISSION_FACTOR_FLIGHT,
  EMISSION_FACTOR_ELECTRICITY,
  AC_DAILY_KWH,
  EMISSION_FACTORS_DIET,
  EMISSION_FACTORS_FOOD_WASTE,
  EMISSION_FACTORS_EATING_OUT,
  EMISSION_FACTOR_ONLINE_ORDER,
  EMISSION_FACTOR_CLOTHING,
  EMISSION_FACTORS_RECYCLING,
  FOOTPRINT_BANDS,
} from './constants';
import { clampValue } from './sanitize';

/**
 * Calculates daily Transport emissions in kg CO2e
 */
export function calculateDailyTransport(
  commuteMode: FootprintInput['commuteMode'],
  distanceKm: number,
  carpool: boolean,
  flightsMonthly: number = 0
): number {
  const modeFactor = EMISSION_FACTORS_TRANSPORT[commuteMode] ?? 0;
  const multiplier = (commuteMode === 'Car' && carpool) ? 0.5 : 1.0;
  
  const dailyCommuteEmission = distanceKm * modeFactor * multiplier;
  const dailyFlightEmission = (flightsMonthly * EMISSION_FACTOR_FLIGHT) / 30.0;
  
  return clampValue(dailyCommuteEmission + dailyFlightEmission, 0, 1000);
}

/**
 * Calculates daily, per-capita Home Energy emissions in kg CO2e
 */
export function calculateDailyEnergy(
  electricityKwh: number,
  acUsage: FootprintInput['acUsage'],
  householdSize: number
): number {
  const normHouseholdSize = clampValue(householdSize, 1, 20);
  
  const monthlyElectricityEmissions = electricityKwh * EMISSION_FACTOR_ELECTRICITY;
  const dailyElectricityEmissions = monthlyElectricityEmissions / 30.0;
  
  // AC emissions
  const dailyAcKwh = AC_DAILY_KWH[acUsage] ?? 0;
  const dailyAcEmissions = dailyAcKwh * EMISSION_FACTOR_ELECTRICITY;
  
  // Split energy emissions across household size
  const totalDailyEnergy = (dailyElectricityEmissions + dailyAcEmissions) / normHouseholdSize;
  
  return clampValue(totalDailyEnergy, 0, 1000);
}

/**
 * Calculates daily Food emissions in kg CO2e
 */
export function calculateDailyFood(
  dietType: FootprintInput['dietType'],
  foodWaste: FootprintInput['foodWaste'],
  eatingOut: FootprintInput['eatingOutFrequency']
): number {
  const dietBase = EMISSION_FACTORS_DIET[dietType] ?? 2.0;
  const wasteBase = EMISSION_FACTORS_FOOD_WASTE[foodWaste] ?? 0.0;
  const eatingOutBase = EMISSION_FACTORS_EATING_OUT[eatingOut] ?? 0.0;
  
  return clampValue(dietBase + wasteBase + eatingOutBase, 0, 100);
}

/**
 * Calculates daily Consumption emissions in kg CO2e
 */
export function calculateDailyConsumption(
  onlineOrders: number,
  clothingPurchases: number,
  recyclingHabit: FootprintInput['recyclingHabit']
): number {
  const ordersMonthlyEmissions = onlineOrders * EMISSION_FACTOR_ONLINE_ORDER;
  const clothingMonthlyEmissions = clothingPurchases * EMISSION_FACTOR_CLOTHING;
  
  const dailyPurchaseEmissions = (ordersMonthlyEmissions + clothingMonthlyEmissions) / 30.0;
  const recyclingAdj = EMISSION_FACTORS_RECYCLING[recyclingHabit] ?? 0.2;
  
  // Total can be offset by positive recycling but shouldn't drop below 0
  return clampValue(dailyPurchaseEmissions + recyclingAdj, 0, 200);
}

/**
 * Process a check-in input, generating the comprehensive carbon analysis result.
 */
export function calculateFootprint(input: FootprintInput): CarbonResult {
  const transport = calculateDailyTransport(
    input.commuteMode,
    input.distancePerDayKm,
    input.carpool,
    input.flightsThisMonth
  );
  
  const energy = calculateDailyEnergy(
    input.electricityKwhMonthly,
    input.acUsage,
    input.householdSize
  );
  
  const food = calculateDailyFood(
    input.dietType,
    input.foodWaste,
    input.eatingOutFrequency
  );
  
  const consumption = calculateDailyConsumption(
    input.onlineOrdersMonthly,
    input.clothingPurchasesMonthly,
    input.recyclingHabit
  );
  
  const dailyTotal = transport + energy + food + consumption;
  const weeklyTotal = dailyTotal * 7.0;
  const monthlyTotal = dailyTotal * 30.0;
  
  // Percentages mapping
  const breakdown: CategoryBreakdown = { transport, energy, food, consumption };
  const percentages: CategoryPercentages = {
    transport: dailyTotal > 0 ? (transport / dailyTotal) * 100 : 0,
    energy: dailyTotal > 0 ? (energy / dailyTotal) * 100 : 0,
    food: dailyTotal > 0 ? (food / dailyTotal) * 100 : 0,
    consumption: dailyTotal > 0 ? (consumption / dailyTotal) * 100 : 0,
  };
  
  // Determine footprintband
  let footprintBand: CarbonResult['footprintBand'] = 'Moderate';
  if (dailyTotal < FOOTPRINT_BANDS.Light.max) {
    footprintBand = 'Light';
  } else if (dailyTotal < FOOTPRINT_BANDS.Moderate.max) {
    footprintBand = 'Moderate';
  } else if (dailyTotal < FOOTPRINT_BANDS.High.max) {
    footprintBand = 'High';
  } else {
    footprintBand = 'Very High';
  }
  
  // Determine biggest driver
  let biggestImpactDriver: CarbonResult['biggestImpactDriver'] = 'food';
  let maxVal = food;
  
  if (transport > maxVal) {
    maxVal = transport;
    biggestImpactDriver = 'transport';
  }
  if (energy > maxVal) {
    maxVal = energy;
    biggestImpactDriver = 'energy';
  }
  if (consumption > maxVal) {
    maxVal = consumption;
    biggestImpactDriver = 'consumption';
  }
  
  return {
    dailyTotal,
    weeklyTotal,
    monthlyTotal,
    footprintBand,
    breakdown,
    percentages,
    biggestImpactDriver,
    input: { ...input },
  };
}
