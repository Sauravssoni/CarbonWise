/**
 * CarbonWise - Footprint Form Zod Validation Schema
 */

import { z } from 'zod';

export const CommuteModeSchema = z.enum([
  'Car',
  'Bike',
  'Bus',
  'Metro',
  'Walk',
  'Cycle',
  'Work from home',
]);

export const ACUsageLevelSchema = z.enum(['None', 'Low', 'Medium', 'High']);

export const DietTypeSchema = z.enum([
  'Plant-forward',
  'Vegetarian',
  'Eggetarian',
  'Mixed',
  'High meat',
]);

export const FrequencyLevelSchema = z.enum(['Rare', 'Sometimes', 'Often']);

export const EatingOutFrequencySchema = z.enum(['Rare', 'Weekly', 'Daily']);

export const ReductionTargetSchema = z.union([z.literal(5), z.literal(10), z.literal(20)]);

export const EffortLevelSchema = z.enum(['Easy', 'Balanced', 'Aggressive']);

export const FootprintSchema = z.object({
  // Transport Step
  commuteMode: CommuteModeSchema,
  distancePerDayKm: z
    .number()
    .min(0, 'Distance must be at least 0')
    .max(1000, 'Distance cannot exceed 1000 km/day'),
  carpool: z.boolean(),
  flightsThisMonth: z
    .number()
    .int()
    .min(0, 'Flights must be at least 0')
    .max(100, 'Flights cannot exceed 100/month')
    .optional()
    .default(0),

  // Home Energy Step
  electricityKwhMonthly: z
    .number()
    .min(0, 'Electricity must be at least 0')
    .max(50000, 'Electricity use is unreasonably high'),
  acUsage: ACUsageLevelSchema,
  householdSize: z
    .number()
    .int()
    .min(1, 'Household size must be at least 1')
    .max(20, 'Household size cannot exceed 20'),

  // Food Step
  dietType: DietTypeSchema,
  foodWaste: FrequencyLevelSchema,
  eatingOutFrequency: EatingOutFrequencySchema,

  // Consumption Step
  onlineOrdersMonthly: z
    .number()
    .int()
    .min(0, 'Orders must be at least 0')
    .max(500, 'Online orders cannot exceed 500/month'),
  clothingPurchasesMonthly: z
    .number()
    .int()
    .min(0, 'Clothing purchases must be at least 0')
    .max(100, 'Clothing purchases cannot exceed 100/month'),
  recyclingHabit: FrequencyLevelSchema,

  // Goal Step
  reductionTarget: ReductionTargetSchema,
  preferredEffort: EffortLevelSchema,
  optionalNote: z.string().max(200, 'Note must not exceed 200 characters').optional().default(''),
});

export type FootprintFormType = z.infer<typeof FootprintSchema>;
