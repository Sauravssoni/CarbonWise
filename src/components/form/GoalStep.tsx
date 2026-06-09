import { FootprintInput, ReductionTarget, EffortLevel } from '../../types';

interface GoalStepProps {
  data: Partial<FootprintInput>;
  onChange: (val: Partial<FootprintInput>) => void;
}

const TARGETS: { val: ReductionTarget; label: string; details: string }[] = [
  { val: 5, label: 'Standard (5% Off)', details: 'Basic optimization. Equivalent to setting thermostat 1°C lower.' },
  { val: 10, label: 'Balanced (10% Off)', details: 'Sustainable changes, such as adopting one plant-forward lunch.' },
  { val: 20, label: 'Committed (20% Off)', details: 'Substantial habit transformations. Avoids solo driving for local runs.' },
];

const INTENSITY: { val: EffortLevel; label: string; icon: string; desc: string }[] = [
  { val: 'Easy', label: 'Easy Pace', icon: '🦦', desc: 'No-hassle micro-actions' },
  { val: 'Balanced', label: 'Balanced Pace', icon: '🌿', desc: 'Conscious habits to build steady savings' },
  { val: 'Aggressive', label: 'Aggressive Pace', icon: '🚀', desc: 'Bold substitutions for major structural reduction' },
];

export default function GoalStep({ data, onChange }: GoalStepProps) {
  const currentTarget = data.reductionTarget || 10;
  const currentEffort = data.preferredEffort || 'Balanced';
  const currentNote = data.optionalNote || '';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Step 5: Define Your Carbon Goal</h3>
        <p className="text-slate-400 text-xs mt-1">
          Setting concrete targets boosts habit retention by 3x. Choose a manageable starting baseline.
        </p>
      </div>

      {/* Target reduction percentage */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Emissions Reduction Goal <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select target reduction">
          {TARGETS.map((opt) => {
            const isSelected = currentTarget === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ reductionTarget: opt.val })}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex-grow leading-relaxed">{opt.details}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Effort Commitment level */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Conscious Commitment Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select commitment level">
          {INTENSITY.map((opt) => {
            const isSelected = currentEffort === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ preferredEffort: opt.val })}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between w-full">
                  <span>{opt.label}</span>
                  <span className="text-sm" aria-hidden="true">{opt.icon}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Note */}
      <div className="space-y-2">
        <label htmlFor="optional-notes" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Optional Personal Motives <span className="text-slate-400 font-normal text-[10px] normal-case">(Maximum 200 characters)</span>
        </label>
        <textarea
          id="optional-notes"
          rows={3}
          maxLength={200}
          placeholder="E.g., Committing for my children, mending my old clothes, reducing fuel expenses..."
          value={currentNote}
          onChange={(e) => onChange({ optionalNote: e.target.value })}
          className="block w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-850 placeholder-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono leading-relaxed"
        />
        <div className="flex justify-end text-slate-400 text-[10px] uppercase font-bold tracking-wider text-right pr-1">
          {currentNote.length} / 200 characters
        </div>
      </div>
    </div>
  );
}
