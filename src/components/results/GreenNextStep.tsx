import { FootprintInput, ActionItem } from '../../types';
import { generateGreenNextStep } from '../../lib/recommendation-engine';
import { completeAction, getLocalHistory } from '../../lib/storage';
import { useToast } from '../ToastProvider';
import { Leaf, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GreenNextStepProps {
  input: FootprintInput;
  onRefreshHistory: () => void;
}

export default function GreenNextStep({ input, onRefreshHistory }: GreenNextStepProps) {
  const { showToast } = useToast();
  const [action, setAction] = useState<ActionItem | null>(null);

  useEffect(() => {
    // Generate the personalized green action item based on input values
    const generated = generateGreenNextStep(input);
    
    // Check if it is already completed in current local history
    const history = getLocalHistory();
    const isDone = history.completedActionIds.includes(generated.id);
    
    setAction({ ...generated, completed: isDone });
  }, [input]);

  if (!action) return null;

  const handleCommit = () => {
    if (!action) return;
    
    // Persist completion
    completeAction(action.id);
    setAction((prev) => prev ? { ...prev, completed: true } : null);
    
    // Trigger Success Callback Toasts
    showToast('Action saved. Small changes compound.');
    onRefreshHistory(); // update streak or progress widgets
  };

  const isHighImpact = action.impactEstimatedKg >= 3.5;

  return (
    <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100/50 flex-1 flex flex-col justify-between min-h-[14rem] border border-emerald-500">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-85">
          One Green Next Step
        </span>
        <h3 className="text-xl sm:text-2xl font-light mt-2 leading-tight">
          {action.text}
        </h3>
        
        {/* Dynamic tagging system */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white/20 rounded text-[9px] font-bold uppercase tracking-wider">
            {isHighImpact ? 'High Value' : 'Quick Win'}
          </span>
          <span className="px-2 py-1 bg-white/20 rounded text-[9px] font-bold uppercase tracking-wider">
            {action.impactEstimatedKg.toFixed(1)} kg saved / wk
          </span>
        </div>
      </div>

      <div>
        {action.completed ? (
          <div className="w-full bg-emerald-800/40 text-emerald-100 border border-emerald-500/30 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 select-none">
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Committed for this week</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCommit}
            className="w-full bg-white text-emerald-700 font-bold py-3 px-4 rounded-2xl hover:bg-emerald-50 transition-colors shadow-md active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
            I'll do this
          </button>
        )}
      </div>
    </div>
  );
}
