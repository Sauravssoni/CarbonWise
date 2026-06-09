import { CarbonResult } from '../../types';
import { formatCO2 } from '../../lib/utils';
import { Car, Lightbulb, Soup, ShoppingBag } from 'lucide-react';

interface CategoryBreakdownProps {
  result: CarbonResult;
}

const CATEGORY_MAP = {
  transport: { label: 'Transport', icon: Car, desc: 'Commuting & airline transit' },
  energy: { label: 'Home Energy', icon: Lightbulb, desc: 'Electricity & cooling loads' },
  food: { label: 'Food & Dining', icon: Soup, desc: 'Diet and food waste profile' },
  consumption: { label: 'Consumption', icon: ShoppingBag, desc: 'Online purchases & goods' },
} as const;

export default function CategoryBreakdown({ result }: CategoryBreakdownProps) {
  const { breakdown, percentages } = result;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Category Breakdown</h3>
        <p className="text-xs text-slate-400">Daily weight distribution calculated by activity segment.</p>
      </div>

      {/* Categories stack items */}
      <div className="space-y-5">
        {(Object.keys(CATEGORY_MAP) as Array<keyof typeof CATEGORY_MAP>).map((catKey) => {
          const schema = CATEGORY_MAP[catKey];
          const rawWeight = breakdown[catKey] || 0;
          const percent = Math.round(percentages[catKey] || 0);
          const Icon = schema.icon;

          return (
            <div key={catKey} className="space-y-2">
              <div className="flex justify-between items-baseline text-xs font-semibold">
                <span className="text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-500 uppercase tracking-wide" aria-hidden="true" />
                  {schema.label}
                </span>
                <span className="text-slate-900 font-mono">
                  {formatCO2(rawWeight)} ({percent}%)
                </span>
              </div>

              {/* Progressive track layout */}
              <div
                className="h-2 bg-slate-100 rounded-full w-full overflow-hidden"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${schema.label}: ${percent}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-300 bg-emerald-500"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic font-sans leading-none">{schema.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
