import { Leaf } from 'lucide-react';

interface HeroProps {
  onStartCheck: () => void;
  onTryDemo: () => void;
}

export default function Hero({ onStartCheck, onTryDemo }: HeroProps) {
  return (
    <div className="relative overflow-hidden py-16 sm:py-20 text-center space-y-6 select-none animate-fade-in">
      {/* Visual glowing ring wrapper */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Brand visual Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider mx-auto select-none">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Carbon Impact Awareness</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-semibold text-slate-900 tracking-tight leading-none mt-4">
          CarbonWise
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl font-light text-slate-700 tracking-tight max-w-xl mx-auto">
          Understand your daily footprints, and trim down emissions structure one realistic action
          at a time.
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto px-4 uppercase tracking-wider">
          Estimating transport, energy, nutrition and consumer goods under DEFRA-compliant
          benchmarks.
        </p>
      </div>

      {/* Hero CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto px-4 z-10 relative">
        <button
          type="button"
          onClick={onStartCheck}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98] text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
        >
          Check My Footprint
        </button>

        <button
          type="button"
          onClick={onTryDemo}
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
        >
          Explore Demo Profile
        </button>
      </div>
    </div>
  );
}
