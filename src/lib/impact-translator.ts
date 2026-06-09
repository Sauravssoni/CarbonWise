/**
 * CarbonWise - Relatable Carbon Impact Translator
 */

import { TRANSLATION_FACTORS } from './constants.js';

export interface RelatableEquivalents {
  carKmAvoided: number;
  smartphoneCharges: number;
  acHoursSaved: number;
  cupsOfChaiKettleBoils: number;
}

/**
 * Translates a weight of CO2e saving (in kg) to relatable equivalents.
 * Ensures zero and large values are handled elegantly with no negative values.
 */
export function translateCarbonImpact(kgCO2e: number): RelatableEquivalents {
  const safeKg = Math.max(0, kgCO2e);
  
  return {
    carKmAvoided: Math.round(safeKg * TRANSLATION_FACTORS.carKmAvoided * 10) / 10,
    smartphoneCharges: Math.round(safeKg * TRANSLATION_FACTORS.smartphoneCharges),
    acHoursSaved: Math.round(safeKg * TRANSLATION_FACTORS.acHoursSaved * 10) / 10,
    cupsOfChaiKettleBoils: Math.round(safeKg * TRANSLATION_FACTORS.cupsOfChaiKettleBoils),
  };
}
