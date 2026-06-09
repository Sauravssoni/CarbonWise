import { useState } from 'react';
import { FootprintInput, ACUsageLevel } from '../../types';

interface EnergyStepProps {
  data: Partial<FootprintInput>;
  onChange: (val: Partial<FootprintInput>) => void;
}

const AC_OPTIONS: { val: ACUsageLevel; label: string; details: string; icon: string }[] = [
  {
    val: 'None',
    label: 'No AC / Off',
    details: 'No active electrical cooling used',
    icon: '❄️ Off',
  },
  { val: 'Low', label: 'Low Usage', details: 'Eco mode or under 2 hours/day', icon: '🍃 Low' },
  {
    val: 'Medium',
    label: 'Medium Usage',
    details: 'Normal cooling cycle (2-6 hours/day)',
    icon: '💨 Med',
  },
  {
    val: 'High',
    label: 'Heavy Usage',
    details: 'Extensive running (over 6 hours/day)',
    icon: '⚡ High',
  },
];

export default function EnergyStep({ data, onChange }: EnergyStepProps) {
  const [inputType, setInputType] = useState<'kwh' | 'bill'>('kwh');
  const [rawBillValue, setRawBillValue] = useState<number>(60); // default $60

  const currentSize = data.householdSize ?? 1;
  const currentKwh = data.electricityKwhMonthly ?? 150;
  const currentAc = data.acUsage ?? 'None';

  // Handling conversion from bill to kWh if selected (Assume $0.20 per kWh)
  const handleBillChange = (val: number) => {
    setRawBillValue(val);
    const convertedKwh = Math.round(val / 0.2);
    onChange({ electricityKwhMonthly: convertedKwh });
  };

  return (
    <fieldset className="space-y-6 animate-fade-in border-none p-0 m-0">
      <legend className="sr-only">Step 2: Home Utilities</legend>
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
          Step 2: Home Utilities
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          Grid energy consumption remains a principal generator of emissions. Shared homes divide
          this impact.
        </p>
      </div>

      {/* Input Toggle (Direct vs Bill) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Monthly Power Account Input
        </label>
        <div className="flex bg-slate-100 rounded-2xl p-1 gap-1 max-w-xs">
          <button
            type="button"
            onClick={() => setInputType('kwh')}
            className={`flex-1 text-center py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              inputType === 'kwh'
                ? 'bg-white text-slate-805 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Direct kWh
          </button>
          <button
            type="button"
            onClick={() => setInputType('bill')}
            className={`flex-1 text-center py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              inputType === 'bill'
                ? 'bg-white text-slate-805 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Bill Estimate ($)
          </button>
        </div>
      </div>

      {/* Direct kWh Slider */}
      {inputType === 'kwh' ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label
              id="kwh-label"
              htmlFor="kwh-slider"
              className="text-xs font-bold text-slate-600 uppercase tracking-wider"
            >
              Monthly Electricity Consumed <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
              {currentKwh} kWh
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <input
              id="kwh-slider"
              aria-labelledby="kwh-label"
              type="range"
              min="0"
              max="1500"
              step="10"
              value={currentKwh}
              onChange={(e) => onChange({ electricityKwhMonthly: Number(e.target.value) })}
              className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <input
              id="kwh-input"
              aria-label="Direct kWh"
              type="number"
              min="0"
              max="50000"
              value={currentKwh}
              onChange={(e) =>
                onChange({
                  electricityKwhMonthly: Math.min(50000, Math.max(0, Number(e.target.value))),
                })
              }
              className="w-24 text-center border border-slate-200 rounded-xl px-2 py-1.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label
              id="bill-label"
              htmlFor="bill-slider"
              className="text-xs font-bold text-slate-600 uppercase tracking-wider"
            >
              Estimated Monthly Bill ($) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
              ${rawBillValue} / month
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <input
              id="bill-slider"
              aria-labelledby="bill-label"
              type="range"
              min="0"
              max="300"
              step="5"
              value={rawBillValue}
              onChange={(e) => handleBillChange(Number(e.target.value))}
              className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <input
              id="bill-input"
              aria-label="Estimated monthly bill"
              type="number"
              min="0"
              max="5000"
              value={rawBillValue}
              onChange={(e) =>
                handleBillChange(Math.min(5000, Math.max(0, Number(e.target.value))))
              }
              className="w-24 text-center border border-slate-200 rounded-xl px-2 py-1.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            Tariff factor is calculated at an average state benchmark of $0.20 per kWh.
          </p>
        </div>
      )}

      {/* Household sizes */}
      <div className="space-y-3">
        <label
          htmlFor="household-input"
          className="block text-xs font-bold text-slate-600 uppercase tracking-wider"
        >
          Household Occupancy Size <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-xs">
          <input
            id="household-input"
            type="number"
            min="1"
            max="20"
            value={currentSize}
            onChange={(e) =>
              onChange({
                householdSize: Math.min(20, Math.max(1, Math.round(Number(e.target.value)))),
              })
            }
            className="block w-full bg-transparent text-xs text-slate-800 border-none outline-none focus:ring-0 text-center font-bold font-mono"
          />
        </div>
        <p className="text-xs text-slate-405 uppercase tracking-wide">
          Utility weight metrics are divided evenly across household members.
        </p>
      </div>

      {/* AC usage choice */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Average Air Conditioning Usage <span className="text-red-500">*</span>
        </label>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Select AC level"
        >
          {AC_OPTIONS.map((opt) => {
            const isSelected = currentAc === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange({ acUsage: opt.val })}
                className={`flex items-start text-left p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/15 text-emerald-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-750'
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>{opt.label}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                      {opt.icon}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-normal">{opt.details}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
