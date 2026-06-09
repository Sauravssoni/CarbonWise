/**
 * CarbonWise - Type Definitions
 */

export type CommuteMode = 'Car' | 'Bike' | 'Bus' | 'Metro' | 'Walk' | 'Cycle' | 'Work from home';
export type ACUsageLevel = 'None' | 'Low' | 'Medium' | 'High';
export type DietType = 'Plant-forward' | 'Vegetarian' | 'Eggetarian' | 'Mixed' | 'High meat';
export type FrequencyLevel = 'Rare' | 'Sometimes' | 'Often';
export type ReductionTarget = 5 | 10 | 20; // values in percentage
export type EffortLevel = 'Easy' | 'Balanced' | 'Aggressive';

export interface FootprintInput {
  // Transport
  commuteMode: CommuteMode;
  distancePerDayKm: number;
  carpool: boolean;
  flightsThisMonth?: number;

  // Home Energy
  electricityKwhMonthly: number; // kWh value (or converted from bill estimate)
  acUsage: ACUsageLevel;
  householdSize: number;

  // Food
  dietType: DietType;
  foodWaste: FrequencyLevel;
  eatingOutFrequency: 'Rare' | 'Weekly' | 'Daily';

  // Consumption
  onlineOrdersMonthly: number;
  clothingPurchasesMonthly: number;
  recyclingHabit: FrequencyLevel;

  // Goal
  reductionTarget: ReductionTarget;
  preferredEffort: EffortLevel;
  optionalNote?: string;
}

export interface CategoryBreakdown {
  transport: number; // kg CO2e
  energy: number; // kg CO2e
  food: number; // kg CO2e
  consumption: number; // kg CO2e
}

export interface CategoryPercentages {
  transport: number;
  energy: number;
  food: number;
  consumption: number;
}

export interface CarbonResult {
  dailyTotal: number; // kg CO2e
  weeklyTotal: number; // kg CO2e
  monthlyTotal: number; // kg CO2e
  footprintBand: 'Light' | 'Moderate' | 'High' | 'Very High';
  breakdown: CategoryBreakdown;
  percentages: CategoryPercentages;
  biggestImpactDriver: 'transport' | 'energy' | 'food' | 'consumption';
  input: FootprintInput;
}

export interface ActionItem {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'consumption';
  text: string;
  impactEstimatedKg: number; // estimated saving in kg CO2e/week
  effort: EffortLevel;
  completed: boolean;
  completedAt?: string;
}

export interface VerificationResult {
  valid: boolean;
  errors: string[];
}

export interface CheckInRecord {
  id: string;
  timestamp: string;
  input: FootprintInput;
  result: CarbonResult;
}

export interface LocalHistory {
  checkIns: CheckInRecord[];
  completedActionIds: string[];
  customActions: ActionItem[];
}

export interface AIResponse {
  personalInsight: string;
  motivationalNudge: string;
  customAction: string;
}
