import { CarbonResult } from '../../types';
import { FOOTPRINT_BANDS } from '../../lib/constants';
import { formatCO2 } from '../../lib/utils';
import { Shield, Sparkles } from 'lucide-react';

interface CarbonSnapshotProps {
  result: CarbonResult;
}

export default function CarbonSnapshot({ result }: CarbonSnapshotProps) {
  const { dailyTotal, weeklyTotal, monthlyTotal, footprintBand } = result;
  const bandInfo = FOOTPRINT_BANDS[footprintBand];

  // Sleek style mappings matching the specified band
  const bandStyles = {
    Light: {
      text: 'text-emerald-700',
      border: 'border-emerald-100 bg-emerald-50/50',
      badge: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    },
    Moderate: {
      text: 'text-amber-600',
      border: 'border-amber-100 bg-amber-50/50',
      badge: 'bg-amber-50 border-amber-100 text-amber-600',
    },
    High: {
      text: 'text-orange-600',
      border: 'border-orange-100 bg-orange-50/50',
      badge: 'bg-orange-50 border-orange-100 text-orange-600',
    },
    'Very High': {
      text: 'text-red-600',
      border: 'border-red-100 bg-red-50/50',
      badge: 'bg-red-50 border-red-100 text-red-600',
    },
  }[footprintBand];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Carbon Snapshot</h3>
        
        {/* Core Sleek Metric Display */}
        <div className="flex flex-col items-center justify-center text-center py-6 border-y border-slate-100 bg-slate-50/40 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Estimated Footprint</span>
          <div className="flex items-baseline gap-1 select-all">
            <span className="text-6xl sm:text-7xl font-light text-slate-900 tracking-tighter">
              {dailyTotal.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-slate-500">kg CO2e</span>
          </div>
          
          <div className={`mt-4 px-4 py-1 rounded-full border flex items-center gap-2 select-none ${bandStyles.badge}`}>
            <span className="text-xs font-semibold uppercase tracking-wider">{footprintBand} Band</span>
          </div>
        </div>
      </div>

      {/* Grid containing other projections */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Output</div>
          <div className="text-lg font-bold text-slate-800 mt-1 select-all">
            {formatCO2(weeklyTotal)}
          </div>
        </div>
        <div className="p-3 bg-slate-50/30 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Output</div>
          <div className="text-lg font-bold text-slate-800 mt-1 select-all">
            {formatCO2(monthlyTotal)}
          </div>
        </div>
      </div>

      {/* Feedback description card */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${bandStyles.border}`}>
        <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${bandStyles.text}`} aria-hidden="true" />
        <div>
          <div className={`font-bold text-xs ${bandStyles.text}`}>Assessment: {bandInfo.label}</div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {bandInfo.description} Lowering your emissions through high-impact action choices will optimize your profile index.
          </p>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-wider">
          CarbonWise educational values represent estimates based on static models.
        </p>
      </div>
    </div>
  );
}
