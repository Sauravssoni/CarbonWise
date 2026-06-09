import { useState, useEffect } from 'react';
import { FootprintInput, CarbonResult, LocalHistory } from '../types';
import { InsightResponse, fetchInsightSafely } from '../lib/insight-client';
import CarbonSnapshot from './results/CarbonSnapshot';
import CategoryBreakdown from './results/CategoryBreakdown';
import BiggestDriverCard from './results/BiggestDriverCard';
import GreenNextStep from './results/GreenNextStep';
import ReductionPlan from './results/ReductionPlan';
import ImpactTranslator from './results/ImpactTranslator';
import ProgressDashboard from './results/ProgressDashboard';
import CalculationTransparency from './results/CalculationTransparency';
import { Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';

interface ResultsDashboardProps {
  input: FootprintInput;
  result: CarbonResult;
  onNewCheckIn: () => void;
  onRefreshHistory: () => void;
  localHistory: LocalHistory;
}

export default function ResultsDashboard({
  input,
  result,
  onNewCheckIn,
  onRefreshHistory,
  localHistory,
}: ResultsDashboardProps) {
  const [aiInsight, setAiInsight] = useState<InsightResponse | null>(null);
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInsight(): Promise<void> {
      setLoadingInsight(true);
      const insight = await fetchInsightSafely(input, result);
      if (!cancelled) {
        setAiInsight(insight);
        setLoadingInsight(false);
      }
    }

    loadInsight();
    return () => { cancelled = true; };
  }, [input, result]);

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Navigation and Actions */}
      <div className="flex justify-between items-center gap-4 flex-wrap pb-3 border-b border-slate-200">
        <button
          onClick={onNewCheckIn}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Footprint Wizard</span>
        </button>

        <button
          onClick={onNewCheckIn}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-100 rounded-full text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Check in again</span>
        </button>
      </div>

      {/* AI Smart feedback block */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
        {/* Ambient indicator */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none select-none" />

        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" aria-hidden="true" />
          <span>Smart Carbon Insights Hub</span>
        </div>

        {loadingInsight ? (
          <div className="space-y-2.5" role="alert" aria-live="polite">
            <div className="h-3.5 bg-slate-850 rounded w-11/12 animate-pulse" />
            <div className="h-3.5 bg-slate-850 rounded w-10/12 animate-pulse" />
            <div className="h-3.5 bg-slate-850 rounded w-8/12 animate-pulse" />
          </div>
        ) : aiInsight ? (
          <div className="space-y-4">
            <blockquote className="text-sm font-semibold text-slate-100 leading-relaxed font-sans italic">
              "{aiInsight.personalInsight}"
            </blockquote>
            <p className="text-xs text-slate-400 leading-relaxed">
              {aiInsight.motivationalNudge}
            </p>
            {aiInsight.customAction && (
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded uppercase tracking-wider select-none">
                  Task Suggestion
                </span>
                <span className="text-xs font-semibold text-slate-200">"{aiInsight.customAction}"</span>
              </div>
            )}
            {aiInsight.source !== 'gemini' && (
              <p className="text-[10px] text-slate-400 italic">
                CarbonWise generated this using transparent local rules, so your results still work without an AI key.
              </p>
            )}
            <div className="flex justify-end pt-1 text-[8px] text-slate-500 uppercase tracking-wider select-none">
              {aiInsight.source === 'gemini' ? 'AI-enhanced insight' : 'Local deterministic insight'}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 leading-relaxed uppercase tracking-wider">
            Compiling lifestyle dynamic audit...
          </div>
        )}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Footprint Snapshots & Drivers */}
        <div className="flex flex-col gap-6">
          <CarbonSnapshot result={result} />
          <BiggestDriverCard result={result} />
        </div>

        {/* Center Column: Categories Breakdown & Analogies */}
        <div className="flex flex-col gap-6">
          <CategoryBreakdown result={result} />
          <ImpactTranslator savingsKg={result.dailyTotal} />
          <CalculationTransparency />
        </div>

        {/* Right Column: Actions & Progress Tracking */}
        <div className="flex flex-col gap-6">
          <GreenNextStep input={input} onRefreshHistory={onRefreshHistory} />
          <ProgressDashboard history={localHistory} onClear={onRefreshHistory} />
          <ReductionPlan input={input} onRefreshHistory={onRefreshHistory} />
        </div>
      </div>
    </div>
  );
}
