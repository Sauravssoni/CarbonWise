import { CarbonResult } from '../../types';
import { Car, Lightbulb, Soup, ShoppingBag } from 'lucide-react';

interface BiggestDriverCardProps {
  result: CarbonResult;
}

const INSIGHTS = {
  transport: {
    label: 'Transport Commuting',
    icon: Car,
    details: 'Daily motor commuting distances or flights make this your largest impact source. Focus on public transit options, combining car trips, or carpooling.',
  },
  energy: {
    label: 'Home Utilities',
    icon: Lightbulb,
    details: 'Grid power footprint, divided across household metrics, is your primary source. Simple tweaks like cleaning AC filters or washing in cold water can make a major impact.',
  },
  food: {
    label: 'Nutrition & Diet',
    icon: Soup,
    details: 'Heavy meat consumption or frequent food wastage drives this category. Swapping red meats for chicken, or planning zero-waste plant-forwards meals, significantly reduces this weight.',
  },
  consumption: {
    label: 'Retail Consumption',
    icon: ShoppingBag,
    details: 'Online deliveries and clothing purchases create substantial pre-consumer manufacturing carbon. Mending/repairing and consolidating deliveries is your absolute best route here.',
  },
} as const;

export default function BiggestDriverCard({ result }: BiggestDriverCardProps) {
  const driver = result.biggestImpactDriver;
  const config = INSIGHTS[driver] || INSIGHTS.food;
  const Icon = config.icon;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[14rem] border border-slate-800">
      <div>
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-70">
            Biggest Impact Driver
          </span>
          <span className="px-2 py-0.5 bg-white/10 border border-white/5 rounded text-[9px] font-mono opacity-80 uppercase tracking-wider">
            Analysis v2.1
          </span>
        </div>
        
        <p className="text-base sm:text-lg font-semibold leading-snug mt-3">
          {config.label} is your leading source of emissions.
        </p>
        <p className="text-xs opacity-70 mt-2 font-sans leading-relaxed">
          {config.details} Identifying this specific segment gives you immediate, strategic leverage.
        </p>
      </div>

      <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-4">
        <span className="text-[9px] opacity-50 uppercase tracking-[0.2em]">Leverage Detected</span>
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
          <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
