import { CarbonResult } from '../../types';
import { CATEGORY_COLORS, formatCO2 } from '../../lib/utils';
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
          const colors = CATEGORY_COLORS[catKey];
          const rawWeight = breakdown[catKey] || 0;
          const percent = Math.round(percentages[catKey] || 0);
          const Icon = schema.icon;

          // Align progress bars and track colors to Sleek slate and emerald palettes
          const barColor = catKey === 'transport' ? 'bg-emerald-500' : 'bg-slate-400';

          return (
            <div key={catKey} className="space-y-2">
              <div className="flex justify-between items-baseline text-xs font-semibold">
                <span className="text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-500 uppercase tracking-wide" />
                  {schema.label}
                </span>
                <span className="text-slate-900 font-mono">
                  {formatCO2(rawWeight)} ({percent}%)
                </span>
              </div>

              {/* Progressive track layout */}
              <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
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
