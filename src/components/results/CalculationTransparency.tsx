import { HelpCircle, Info, ShieldAlert } from 'lucide-react';

export default function CalculationTransparency() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
        <HelpCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-0.5">Calculation Transparency</h3>
          <p className="text-xs text-slate-400">Deterministic factors backed by educational references.</p>
        </div>
      </div>

      {/* Required Public Disclaimer Copy */}
      <div className="p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-800 font-medium leading-relaxed">
          CarbonWise provides educational estimates based on transparent assumptions. It is designed for awareness and habit change, not official greenhouse gas accounting. Note that all calculated emission values are approximate.
        </p>
      </div>

      {/* Grid factors details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Commutes Factor */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Transport & Flights (approx.)</span>
            <span className="text-[10px] text-slate-400 font-mono normal-case">kg CO2e/km</span>
          </h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed font-mono">
            <li>Solo Car Travel: <span className="text-slate-800 font-semibold font-sans">0.18</span></li>
            <li>Carpool / Shared Car: <span className="text-slate-800 font-semibold font-sans">0.09</span> (halves normal car factor per rider)</li>
            <li>Motorbike: <span className="text-slate-800 font-semibold font-sans">0.08</span></li>
            <li>Public Bus: <span className="text-slate-800 font-semibold font-sans">0.05</span></li>
            <li>Metro Electric Rail: <span className="text-slate-800 font-semibold font-sans">0.03</span></li>
            <li>Walking / Cycling: <span className="text-slate-800 font-semibold font-sans">0.00</span></li>
            <li>Flight leg multiplier: <span className="text-slate-800 font-semibold font-sans">+150 kg CO2e</span> per short-haul flight</li>
          </ul>
        </div>

        {/* Home utilities */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Power & AC intensity (approx.)</span>
            <span className="text-[10px] text-slate-400 font-mono normal-case">kg CO2e/unit</span>
          </h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed font-mono">
            <li>AC Low Mode: <span className="text-slate-800 font-semibold font-sans">+0.9 kg/day</span></li>
            <li>AC Medium Mode: <span className="text-slate-800 font-semibold font-sans">+2.25 kg/day</span></li>
            <li>AC High Mode: <span className="text-slate-800 font-semibold font-sans">+4.5 kg/day</span></li>
            <li>Direct Power Grid average: <span className="text-slate-800 font-semibold font-sans">0.45 kg CO2e per kWh</span></li>
            <li>Household dividing logic: Total electricity usage divided evenly across all family members.</li>
          </ul>
        </div>

        {/* Diet factors */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Dietary Benchmarks</span>
            <span className="text-[10px] text-slate-400 font-mono normal-case">kg CO2e/day</span>
          </h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed font-mono">
            <li>Plant-forward (Vegan): <span className="text-slate-800 font-semibold font-sans">1.5</span></li>
            <li>Vegetarian: <span className="text-slate-800 font-semibold font-sans">2.0</span></li>
            <li>Eggetarian: <span className="text-slate-800 font-semibold font-sans">2.3</span></li>
            <li>Regular Mixed Diet: <span className="text-slate-800 font-semibold font-sans">3.5</span></li>
            <li>High Meat Diet: <span className="text-slate-800 font-semibold font-sans">6.0</span></li>
          </ul>
        </div>

        {/* Consumables facts */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Goods & Recycling</span>
            <span className="text-[10px] text-slate-400 font-mono normal-case">kg CO2e/item</span>
          </h4>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed font-mono">
            <li>Online Deliveries: <span className="text-slate-800 font-semibold font-sans">1.2 (shipping logistics)</span></li>
            <li>Clothing Purchases: <span className="text-slate-800 font-semibold font-sans">8.0 (manufacture footprint)</span></li>
            <li>Recycling Offset Offset: <span className="text-emerald-600 font-bold font-sans">-0.5 credit</span> (mindful offset mending/recycling habit)</li>
            <li>Minimal Sorting additions: <span className="text-slate-800 font-semibold font-sans">+1.0 scale factor</span></li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 tracking-wide uppercase leading-normal">
          Calculations incorporate DEFRA 2023, IEA Emission Factors v1.4, IPCC and CoolClimate references. All final metrics are educational estimations, not certified carbon credits.
        </p>
      </div>
    </div>
  );
}
