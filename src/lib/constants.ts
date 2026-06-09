/**
 * CarbonWise - Static Constants, Emission Factors & Translation Factors
 */

// Transport Emission Factors (kg CO2e per km)
export const EMISSION_FACTORS_TRANSPORT = {
  Car: 0.18,
  Bike: 0.08,
  Bus: 0.05,
  Metro: 0.03,
  Walk: 0.0,
  Cycle: 0.0,
  'Work from home': 0.0,
} as const;

// Single flight average (kg CO2e)
export const EMISSION_FACTOR_FLIGHT = 150.0; // Moderate short-haul estimate

// Home Electricity Factor (kg CO2e per kWh)
export const EMISSION_FACTOR_ELECTRICITY = 0.45; // average grid intensity

// Air Conditioning daily addition (kWh of electricity)
export const AC_DAILY_KWH = {
  None: 0,
  Low: 2,
  Medium: 5,
  High: 10,
} as const;

// Food Diet base daily emissions (kg CO2e per day)
export const EMISSION_FACTORS_DIET = {
  'Plant-forward': 1.5,
  Vegetarian: 2.0,
  Eggetarian: 2.3,
  Mixed: 3.5,
  'High meat': 6.0,
} as const;

// Food waste daily emissions (kg CO2e per day)
export const EMISSION_FACTORS_FOOD_WASTE = {
  Rare: 0.0,
  Sometimes: 0.5,
  Often: 1.5,
} as const;

// Eating out daily emissions (kg CO2e per day)
export const EMISSION_FACTORS_EATING_OUT = {
  Rare: 0.0,
  Weekly: 0.3,
  Daily: 1.0,
} as const;

// Consumption Packaging/Transit per online order (kg CO2e)
export const EMISSION_FACTOR_ONLINE_ORDER = 1.2;

// Consumption Manufacturing/Shipping per clothing purchase (kg CO2e)
export const EMISSION_FACTOR_CLOTHING = 8.0;

// Recycling Habit daily multiplier/adjuster (kg CO2e per day)
export const EMISSION_FACTORS_RECYCLING = {
  Rare: 1.0,
  Sometimes: 0.2,
  Often: -0.5,
} as const;

// Footprint Daily Bands (kg CO2e per day)
export const FOOTPRINT_BANDS = {
  Light: {
    max: 5.0,
    label: 'Light',
    description: 'Exceptional! Your footprint is well below critical climate targets.',
  },
  Moderate: {
    max: 12.0,
    label: 'Moderate',
    description: 'Good, but there are distinct opportunities to optimize your lifestyle footprint.',
  },
  High: {
    max: 22.0,
    label: 'High',
    description:
      'Above average. Small, daily choices here can make a massive structural reduction.',
  },
  'Very High': {
    max: Infinity,
    label: 'Very High',
    description: 'Heavy footprint. Substantial potential to slash emissions through simple habits.',
  },
} as const;

// Conversions for relatable equivalents (Per 1 kg of CO2e)
export const TRANSLATION_FACTORS = {
  carKmAvoided: 5.5, // 1 kg CO2e is equivalent to ~5.5 km of car travel
  smartphoneCharges: 120, // 1 kg CO2e is equivalent to ~120 full smartphone charges
  acHoursSaved: 1.6, // 1 kg CO2e is equivalent to ~1.6 hours of split AC operation
  cupsOfChaiKettleBoils: 66, // 1 kg CO2e is equivalent to ~66 times boiling a kettle for tea/coffee
} as const;
