import { FootprintInput, DietType, FrequencyLevel } from '../../types';

interface FoodStepProps {
  data: Partial<FootprintInput>;
  onChange: (val: Partial<FootprintInput>) => void;
}

const DIET_OPTIONS: { val: DietType; label: string; description: string; icon: string }[] = [
  { val: 'Plant-forward', label: 'Plant-forward (Vegan)', description: 'Entirely plant-based or dairy/egg exclusionary', icon: '🌱' },
  { val: 'Vegetarian', label: 'Vegetarian', description: 'No red or white meat, includes dairy/plants', icon: '🥑' },
  { val: 'Eggetarian', description: 'Consumes dairy and eggs, excludes red/white meats', label: 'Eggetarian', icon: '🍳' },
  { val: 'Mixed', label: 'Mixed (Regular)', description: 'Average balanced diet with poultry/fish/red meat', icon: '🍱' },
  { val: 'High meat', label: 'High Meat', description: 'Heavy daily consumption of poultry, beef, or pork', icon: '🥩' },
];

const WASTE_OPTIONS: { val: FrequencyLevel; label: string; description: string }[] = [
  { val: 'Rare', label: 'Rare / Zero Waste', description: 'Leftovers composted, careful planning' },
  { val: 'Sometimes', label: 'Sometimes', description: 'Occasionally discard leftovers or vegetables' },
  { val: 'Often', label: 'Often Waste', description: 'Regular food waste or clearing shelf additions' },
];

const EATING_OUT_OPTIONS: { val: 'Rare' | 'Weekly' | 'Daily'; label: string; desc: string }[] = [
  { val: 'Rare', label: 'Cook at Home', desc: 'Rare dining out or container waste' },
  { val: 'Weekly', label: '1-3 Times / Week', desc: 'Moderate deliveries or restaurant packets' },
  { val: 'Daily', label: 'Almost Daily', desc: 'Frequent takeout, packaging and food miles' },
];

export default function FoodStep({ data, onChange }: FoodStepProps) {
  const currentDiet = data.dietType || 'Vegetarian';
  const currentWaste = data.foodWaste || 'Sometimes';
  const currentOut = data.eatingOutFrequency || 'Weekly';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Step 3: Food & Nutrition</h3>
        <p className="text-slate-400 text-xs mt-1">
          Agriculture and nutrition emit nearly a quarter of global carbon emissions. Diet choices can cut this in half.
        </p>
      </div>

      {/* Diet Type */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Primary Diet Choice <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup" aria-label="Select diet choice">
          {DIET_OPTIONS.map((opt) => {
            const isSelected = currentDiet === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ dietType: opt.val })}
                className={`flex items-start text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <span className="text-2xl mr-3 mt-1 select-none" aria-hidden="true">{opt.icon}</span>
                <div>
                  <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-404 mt-0.5 leading-relaxed">{opt.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Waste */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Typical Food & Ingredients Waste <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select food waste frequency">
          {WASTE_OPTIONS.map((opt) => {
            const isSelected = currentWaste === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ foodWaste: opt.val })}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed mt-1">{opt.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dining Out */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Takeaway & Dining Out Frequency <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select dining out frequency">
          {EATING_OUT_OPTIONS.map((opt) => {
            const isSelected = currentOut === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ eatingOutFrequency: opt.val })}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
