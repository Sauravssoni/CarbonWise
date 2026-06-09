import { FootprintInput, FrequencyLevel } from '../../types';

interface ConsumptionStepProps {
  data: Partial<FootprintInput>;
  onChange: (val: Partial<FootprintInput>) => void;
}

const RECYCLE_OPTIONS: { val: FrequencyLevel; label: string; description: string; icon: string }[] = [
  { val: 'Rare', label: 'Rare / Mixed Garbage', description: 'Combine all items into standard waste bins', icon: '🗑️' },
  { val: 'Sometimes', label: 'Active Sorting', description: 'Recycle standard drink packages, cans, and cartons', icon: '♻️' },
  { val: 'Often', label: 'Zero Waste Driven', description: 'Composting, garment repairs, and mindful buying habits', icon: '🛠️' },
];

export default function ConsumptionStep({ data, onChange }: ConsumptionStepProps) {
  const currentOrders = data.onlineOrdersMonthly ?? 0;
  const currentClothing = data.clothingPurchasesMonthly ?? 0;
  const currentRecycling = data.recyclingHabit ?? 'Sometimes';

  return (
    <fieldset className="space-y-6 animate-fade-in border-none p-0 m-0">
      <legend className="sr-only">Step 4: Consumption and Purchases</legend>
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Step 4: Consumption & Purchases</h3>
        <p className="text-slate-400 text-xs mt-1">
          Manufacturing and conveying daily goods requires significant pre-consumer plant power.
        </p>
      </div>

      {/* Online orders per month */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label id="orders-label" htmlFor="orders-slider" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Monthly Online Deliveries <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
            {currentOrders} deliveries
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <input
            id="orders-slider"
            aria-labelledby="orders-label"
            type="range"
            min="0"
            max="40"
            step="1"
            value={currentOrders}
            onChange={(e) => onChange({ onlineOrdersMonthly: Number(e.target.value) })}
            className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
          />
          <input
            id="orders-input"
            aria-label="Monthly online deliveries"
            type="number"
            min="0"
            max="500"
            value={currentOrders}
            onChange={(e) => onChange({ onlineOrdersMonthly: Math.min(500, Math.max(0, Number(e.target.value))) })}
            className="w-24 text-center border border-slate-200 rounded-xl px-2 py-1.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Apparel shopping */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label id="clothing-label" htmlFor="clothing-slider" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Monthly Apparel Purchases <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
            {currentClothing} items
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <input
            id="clothing-slider"
            aria-labelledby="clothing-label"
            type="range"
            min="0"
            max="15"
            step="1"
            value={currentClothing}
            onChange={(e) => onChange({ clothingPurchasesMonthly: Number(e.target.value) })}
            className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
          />
          <input
            id="clothing-input"
            aria-label="Monthly apparel purchases"
            type="number"
            min="0"
            max="100"
            value={currentClothing}
            onChange={(e) => onChange({ clothingPurchasesMonthly: Math.min(100, Math.max(0, Number(e.target.value))) })}
            className="w-24 text-center border border-slate-200 rounded-xl px-2 py-1.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-wide">Adding a standard cotton outfit carries ~8 kg direct CO2e output.</p>
      </div>

      {/* Recycling Tendency */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Recycling & Repair Mindset <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select recycling tendency">
          {RECYCLE_OPTIONS.map((opt) => {
            const isSelected = currentRecycling === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ recyclingHabit: opt.val })}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 flex-grow leading-relaxed">{opt.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
