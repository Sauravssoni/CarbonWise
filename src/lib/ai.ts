/**
 * CarbonWise - isolated AI helper using the modern @google/genai SDK
 */

import { GoogleGenAI, Type } from '@google/genai';
import { FootprintInput, CarbonResult, AIResponse } from '../types';

// Deterministic engine fallback
export function getDeterministicInsight(input: FootprintInput, result: CarbonResult): AIResponse {
  const driver = result.biggestImpactDriver;
  
  if (driver === 'transport') {
    return {
      personalInsight: `Your transport choices represent your biggest leverage point, driven by a travel total of ${input.distancePerDayKm || 0} km/day.`,
      motivationalNudge: `Every active carbon-free trip you take helps avoid harmful greenhouse emissions. Small actions build sustainable compound savings!`,
      customAction: `Try carpooling or taking bus/metro transit for your primary commute on 2 days this week.`,
    };
  } else if (driver === 'energy') {
    return {
      personalInsight: `Home energy utility usage (${input.electricityKwhMonthly || 0} kWh) partitioned per capita represents your biggest footprint component.`,
      motivationalNudge: `Trimming standby draws and keeping cooling efficiency high protects both our climate and household finances.`,
      customAction: `Reduce home AC use by one hour and wash your next batch of laundry in cold water.`,
    };
  } else if (driver === 'consumption') {
    return {
      personalInsight: `Manufacturing and shipping your monthly deliveries and clothing represents a heavy pre-consumer carbon footprint.`,
      motivationalNudge: `Repairing and consolidating orders directly avoids energy-intensive manufacturing cycles. Repair first, purchase second!`,
      customAction: `Postpone buying any non-urgent retail apparel and combine your next online orders into one batch delivery limit.`,
    };
  } else {
    // food fallback
    return {
      personalInsight: `Your nutrition style (${input.dietType}) and eating cadence are your principal footprint contributors.`,
      motivationalNudge: `Plant-forward recipes use a fraction of the land, water, and resources of conventional ingredients. Good cooking, good impact.`,
      customAction: `Swap meat for a completely vegetable-forward dinner on three days this week.`,
    };
  }
}

/**
 * Filter any overclaiming or certified words to maintain educational correctness
 */
function sanitizeAiResponse(response: AIResponse): AIResponse {
  const sanitizeText = (txt: string) => {
    return txt
      .replace(/\bexact emissions\b/gi, 'educational estimates')
      .replace(/\bexact carbon footprint\b/gi, 'approximate carbon footprint')
      .replace(/\bcertified\b/gi, 'estimated')
      .replace(/\bofficial accounting\b/gi, 'educational estimates')
      .replace(/\bguaranteed emissions\b/gi, 'approximate emissions');
  };

  return {
    personalInsight: sanitizeText(response.personalInsight).slice(0, 300),
    motivationalNudge: sanitizeText(response.motivationalNudge).slice(0, 300),
    customAction: sanitizeText(response.customAction).slice(0, 150),
  };
}

/**
 * Executes a Gemini 3.5 Flash chat call safely, validating the response schema
 * and failing back gracefully on any error/timeout.
 */
export async function getAiInsight(
  input: FootprintInput,
  result: CarbonResult,
  apiKey?: string
): Promise<{ source: string } & AIResponse> {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return {
      source: 'deterministic',
      ...getDeterministicInsight(input, result),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a carbon footprint expert. Analyze this individual's lifestyle:
- Commute: ${input.commuteMode} for ${input.distancePerDayKm} km/day (Carpool: ${input.carpool ? 'Yes' : 'No'})
- Air Travel: ${input.flightsThisMonth} flights this month
- Home Energy: Electricity use ${input.electricityKwhMonthly} kWh/month, AC level is ${input.acUsage}, and household size is ${input.householdSize}
- Food Diet: ${input.dietType}, waste: ${input.foodWaste}, eat out: ${input.eatingOutFrequency}
- Consumption: ${input.onlineOrdersMonthly} online packages and ${input.clothingPurchasesMonthly} apparel buys per month, recycling habit is ${input.recyclingHabit}
- Reduction Target Goal: ${input.reductionTarget}%, Preferred Effort: ${input.preferredEffort}. Extra Notes: ${input.optionalNote || 'None'}

Provide educational carbon footprint feedback. Do NOT express guilt or shaming, no political rants, no fake precision, no unsupported claims, use short practical language.
Return a JSON object conforming exactly to this schema:
{
  "personalInsight": string (A tailored, compact advice highlighting their top footprint driver and why it matters under 300 chars),
  "motivationalNudge": string (A supportive, highly positive sentence matching their preferred level of effort: ${input.preferredEffort}, under 300 chars),
  "customAction": string (A highly direct activity they can do this week, e.g. 'Commute on rail twice', under 150 chars)
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInsight: {
              type: Type.STRING,
              description: 'Educational estimate context. No overclaiming words allowed.',
            },
            motivationalNudge: {
              type: Type.STRING,
              description: 'Friendly, encouraging nudge matching user effort commitment level.',
            },
            customAction: {
              type: Type.STRING,
              description: 'Actionable weekly habit swap tip.',
            },
          },
          required: ['personalInsight', 'motivationalNudge', 'customAction'],
        },
      },
    });

    const parsedContent = JSON.parse(response.text || '{}');
    if (parsedContent.personalInsight && parsedContent.motivationalNudge && parsedContent.customAction) {
      const sanitized = sanitizeAiResponse({
        personalInsight: String(parsedContent.personalInsight),
        motivationalNudge: String(parsedContent.motivationalNudge),
        customAction: String(parsedContent.customAction),
      });
      return {
        source: 'gemini',
        ...sanitized,
      };
    }
    
    throw new Error('AI response is missing standard JSON properties.');
  } catch (error) {
    // Graceful fallback
    return {
      source: 'deterministic_fallback',
      ...getDeterministicInsight(input, result),
    };
  }
}
