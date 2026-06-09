/**
 * CarbonWise - Recommendation and Action Planner
 */

import { FootprintInput, ActionItem } from '../types.js';

/**
 * Generates the primary "One Green Next Step" based on the user's footprint profiles.
 */
export function generateGreenNextStep(input: FootprintInput): ActionItem {
  // Determine highest priority driver based on input values

  // 1. CAR COMMUTER
  if (input.commuteMode === 'Car' && input.distancePerDayKm > 0) {
    return {
      id: 'step-transport-carpool-short',
      category: 'transport',
      text: 'Replace two short car trips with metro, biking, or walking this week.',
      impactEstimatedKg: Math.round(5 * 0.18 * 10) / 10, // ~0.9 kg saved
      effort: 'Easy',
      completed: false,
    };
  }

  // 2. AC INTENSIVE
  if (input.acUsage === 'High' || input.acUsage === 'Medium') {
    return {
      id: 'step-energy-ac-trim',
      category: 'energy',
      text: 'Reduce home AC use by 1 hour on 3 nights this week.',
      impactEstimatedKg: 1.8, // 3h * 0.6kg CO2e
      effort: 'Easy',
      completed: false,
    };
  }

  // 3. HIGH MEAT DIET
  if (input.dietType === 'High meat' || input.dietType === 'Mixed') {
    return {
      id: 'step-food-plant-dinner',
      category: 'food',
      text: 'Swap a meat-heavy dish for one completely plant-forward dinner this week.',
      impactEstimatedKg: 2.2, // standard meat vs vegan meal offset
      effort: 'Easy',
      completed: false,
    };
  }

  // 4. ACTIVE ONLINE SHOPPER
  if (input.onlineOrdersMonthly > 4) {
    return {
      id: 'step-consumption-combine',
      category: 'consumption',
      text: 'Combine multiple online orders into a single consolidated delivery block.',
      impactEstimatedKg: 1.2, // avoiding 1 package transit
      effort: 'Easy',
      completed: false,
    };
  }

  // 5. APPAREL PURCHASER OR LOW RECYCLER
  if (input.clothingPurchasesMonthly > 1 || input.recyclingHabit === 'Rare') {
    return {
      id: 'step-consumption-repair',
      category: 'consumption',
      text: 'Repair, mend, or reuse one household item instead of buying its replacement.',
      impactEstimatedKg: 4.0, // avoiding half a garment manufacture
      effort: 'Easy',
      completed: false,
    };
  }

  // Default Fallback next step
  return {
    id: 'step-food-waste-mealprep',
    category: 'food',
    text: 'Plan meals in advance to reduce food waste down to zero for three consecutive days.',
    impactEstimatedKg: 1.5,
    effort: 'Easy',
    completed: false,
  };
}

/**
 * Generates three structured levels of actions: Easiest, Highest-Impact, and Consistency
 */
export function generateReductionPlan(input: FootprintInput): ActionItem[] {
  const plan: ActionItem[] = [];

  // 1. EASIEST (Low effort, quick payback)
  if (input.foodWaste === 'Often' || input.foodWaste === 'Sometimes') {
    plan.push({
      id: 'plan-easy-waste',
      category: 'food',
      text: 'Set up an "Eat Me First" shelf in your fridge to consume leftovers before they spoil.',
      impactEstimatedKg: 1.0,
      effort: 'Easy',
      completed: false,
    });
  } else {
    plan.push({
      id: 'plan-easy-unplug',
      category: 'energy',
      text: 'Unplug stand-by appliances (chargers, microwave, TV) when leaving for work.',
      impactEstimatedKg: 0.8,
      effort: 'Easy',
      completed: false,
    });
  }

  // 2. HIGHEST-IMPACT (Addresses their largest potential source)
  // Determine which is their heaviest raw input
  const travelDailyEmissions = input.distancePerDayKm * (input.commuteMode === 'Car' ? 0.18 : 0.05);
  const clothesMonthlyEmissions = input.clothingPurchasesMonthly * 8.0;

  if (travelDailyEmissions > 5) {
    plan.push({
      id: 'plan-impact-transport',
      category: 'transport',
      text:
        input.commuteMode === 'Car'
          ? 'Car-share, carpool, or take the bus for your primary commute on two days.'
          : 'Optimize flight emissions by choosing direct flights or rail connections for your next holiday.',
      impactEstimatedKg: Math.round(travelDailyEmissions * 2 * 10) / 10,
      effort: 'Aggressive',
      completed: false,
    });
  } else if (input.dietType === 'High meat') {
    plan.push({
      id: 'plan-impact-diet',
      category: 'food',
      text: 'Adopt a meat-free rule for all weekday lunches (Monday through Friday).',
      impactEstimatedKg: 8.5,
      effort: 'Aggressive',
      completed: false,
    });
  } else if (input.electricityKwhMonthly > 400) {
    plan.push({
      id: 'plan-impact-energy',
      category: 'energy',
      text: 'Switch to energy-efficient LED light bulbs and clean your AC filter to boost efficiency by 15%.',
      impactEstimatedKg: 5.2,
      effort: 'Balanced',
      completed: false,
    });
  } else if (clothesMonthlyEmissions > 15) {
    plan.push({
      id: 'plan-impact-shopping',
      category: 'consumption',
      text: 'Implement a strict "No New Clothes Month" challenge or purchase exclusively pre-owned apparel.',
      impactEstimatedKg: 12.0,
      effort: 'Aggressive',
      completed: false,
    });
  } else {
    // General high-impact fallback
    plan.push({
      id: 'plan-impact-energy-led',
      category: 'energy',
      text: 'Wash your laundry in cold water instead of hot and air-dry items on lines.',
      impactEstimatedKg: 3.5,
      effort: 'Balanced',
      completed: false,
    });
  }

  // 3. CONSISTENCY ACTION (Medium effort, requires building a habit)
  if (input.preferredEffort === 'Aggressive') {
    plan.push({
      id: 'plan-consistency-transit',
      category: 'transport',
      text: 'Commit to zero solo-driving inside city limits for short trips of under 3 km.',
      impactEstimatedKg: 6.0,
      effort: 'Aggressive',
      completed: false,
    });
  } else if (input.eatingOutFrequency === 'Daily' || input.eatingOutFrequency === 'Weekly') {
    plan.push({
      id: 'plan-consistency-cook',
      category: 'food',
      text: 'Cook one extra home-prepared meal from scratch on weekends to minimize packaging waste.',
      impactEstimatedKg: 2.5,
      effort: 'Balanced',
      completed: false,
    });
  } else {
    plan.push({
      id: 'plan-consistency-recycle',
      category: 'consumption',
      text: 'Sort all dry recyclables (paper, glass, metals) and drop them exclusively at recycling bins.',
      impactEstimatedKg: 3.0,
      effort: 'Balanced',
      completed: false,
    });
  }

  return plan;
}
