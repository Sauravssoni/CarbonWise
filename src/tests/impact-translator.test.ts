/**
 * CarbonWise - Impact Translator Unit Tests (Vitest)
 */

import { describe, it, expect } from 'vitest';
import { translateCarbonImpact } from '../lib/impact-translator';

describe('Relatable Equivalents Translation Engine', () => {
  it('converts common carbon savings accurately', () => {
    // 10 kg CO2e should convert to:
    // carKmAvoided ~ 55 km
    // smartphoneCharges ~ 1200 charges
    // acHoursSaved ~ 16 hours
    // cupsOfChaiKettleBoils ~ 660 kettles
    const eq = translateCarbonImpact(10);
    
    expect(eq.carKmAvoided).toBe(55.0);
    expect(eq.smartphoneCharges).toBe(1200);
    expect(eq.acHoursSaved).toBe(16.0);
    expect(eq.cupsOfChaiKettleBoils).toBe(660);
  });

  it('handles zero values elegantly without error', () => {
    const eq = translateCarbonImpact(0);
    expect(eq.carKmAvoided).toBe(0);
    expect(eq.smartphoneCharges).toBe(0);
    expect(eq.acHoursSaved).toBe(0);
    expect(eq.cupsOfChaiKettleBoils).toBe(0);
  });

  it('never returns negative values for negative inputs', () => {
    const eq = translateCarbonImpact(-4.5);
    expect(eq.carKmAvoided).toBe(0);
    expect(eq.smartphoneCharges).toBe(0);
    expect(eq.acHoursSaved).toBe(0);
    expect(eq.cupsOfChaiKettleBoils).toBe(0);
  });

  it('scales perfectly to large numbers without clipping', () => {
    const eq = translateCarbonImpact(1250);
    expect(eq.carKmAvoided).toBeGreaterThan(5000);
    expect(eq.smartphoneCharges).toBe(150000);
  });
});
