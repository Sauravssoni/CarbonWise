interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
}: FormNavigationProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
      {/* Back button */}
      <div>
        {!isFirst ? (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-all uppercase tracking-wider cursor-pointer"
          >
            Back
          </button>
        ) : (
          <div /> // block balance
        )}
      </div>

      {/* Progress Page indicator */}
      <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase select-none">
        Step {currentStep} / {totalSteps}
      </div>

      {/* Forward or Submit actions */}
      <div>
        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-sm uppercase tracking-wider cursor-pointer"
          >
            {isSubmitting ? 'Analyzing...' : 'Calculate Footprint'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl transition-all shadow-sm uppercase tracking-wider cursor-pointer"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
