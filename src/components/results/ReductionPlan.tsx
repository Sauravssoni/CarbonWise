import { useState, useEffect } from 'react';
import { FootprintInput, ActionItem } from '../../types';
import { generateReductionPlan } from '../../lib/recommendation-engine';
import { completeAction, uncompleteAction, getLocalHistory } from '../../lib/storage';
import { useToast } from '../ToastProvider';
import { Sparkles, Trophy, Flame } from 'lucide-react';

interface ReductionPlanProps {
  input: FootprintInput;
  onRefreshHistory: () => void;
}

export default function ReductionPlan({ input, onRefreshHistory }: ReductionPlanProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    const generated = generateReductionPlan(input);
    const history = getLocalHistory();
    
    // Check which items are completed in storage
    const itemsWithCompletion = generated.map((item) => ({
      ...item,
      completed: history.completedActionIds.includes(item.id),
    }));
    
    setItems(itemsWithCompletion);
  }, [input]);

  const handleToggleCompletion = (id: string) => {
    const history = getLocalHistory();
    const isCompleted = history.completedActionIds.includes(id);

    if (isCompleted) {
      uncompleteAction(id);
      showToast('Action removed from commitments.', 'info');
    } else {
      completeAction(id);
      showToast('Action saved. Small changes compound.', 'success');
    }

    // Update local React state
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    onRefreshHistory(); // trigger parent refresh
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Your Reduction Plan</h3>
        <p className="text-xs text-slate-400">
          A targeted roadmap scaled according to your carbon contributors and daily goals.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const typeTags = [
            { label: 'Easiest Action', icon: Sparkles, color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' },
            { label: 'Highest Impact', icon: Trophy, color: 'text-slate-700 bg-slate-50 border border-slate-100' },
            { label: 'Habit Consistency', icon: Flame, color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' },
          ][index] || { label: 'Action Tip', icon: Sparkles, color: 'text-slate-600 bg-slate-50 border border-slate-100' };

          const TagIcon = typeTags.icon;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.completed
                  ? 'border-emerald-200 bg-emerald-50/15'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3 flex-1">
                {/* Mode Tag label */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold ${typeTags.color}`}>
                    <TagIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{typeTags.label}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                    Saving ~{item.impactEstimatedKg.toFixed(1)} kg/wk
                  </span>
                </div>
                {/* Description */}
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {item.text}
                </p>
              </div>

              {/* Toggle switch Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleToggleCompletion(item.id)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-600 text-white select-none shadow-sm hover:bg-emerald-700'
                      : 'border border-slate-200 text-slate-750 hover:bg-slate-50'
                  }`}
                  aria-pressed={item.completed}
                >
                  {item.completed ? '✓ Committed' : 'Take Action'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
