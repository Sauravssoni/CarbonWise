import { FootprintInput, CommuteMode } from '../../types';
import { Plane } from 'lucide-react';

interface TransportStepProps {
  data: Partial<FootprintInput>;
  onChange: (val: Partial<FootprintInput>) => void;
}

const COMMUTE_OPTIONS: { mode: CommuteMode; label: string; description: string; icon: string }[] = [
  { mode: 'Car', label: 'Car (Gas/Diesel)', description: 'Solo or share commutes', icon: '🚙' },
  { mode: 'Bike', label: 'Motorbike', description: 'Two-wheel motor transit', icon: '🛵' },
  { mode: 'Bus', label: 'Public Bus', description: 'City bus connections', icon: '🚌' },
  { mode: 'Metro', label: 'Metro or Train', description: 'Low-impact electric rail', icon: '🚇' },
  { mode: 'Walk', label: 'Walking', description: 'Zero emission pace', icon: '🚶' },
  { mode: 'Cycle', label: 'Cycling', description: 'Active human power', icon: '🚲' },
  { mode: 'Work from home', label: 'Telecommute', description: 'No physical commute', icon: '💻' },
];

export default function TransportStep({ data, onChange }: TransportStepProps) {
  const currentMode = data.commuteMode || 'Walk';
  const currentDistance = data.distancePerDayKm ?? 0;
  const currentCarpool = !!data.carpool;
  const currentFlights = data.flightsThisMonth ?? 0;

  return (
    <fieldset className="space-y-6 border-none p-0 m-0">
      <legend className="sr-only">Step 1: Commuting and Transport</legend>
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Step 1: Commuting & Transport</h3>
        <p className="text-slate-400 text-xs mt-1">
          Transportation lifestyle accounts for nearly 30% of individual emissions globally.
        </p>
      </div>

      {/* Commute Mode Select */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Primary Commute Mode <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup" aria-label="Select commute mode">
          {COMMUTE_OPTIONS.map((opt) => {
            const isSelected = currentMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => onChange({ commuteMode: opt.mode })}
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
                  <div className="text-xs text-slate-400 mt-0.5 leading-normal">{opt.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Slider / Input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label id="distance-label" htmlFor="distance-slider" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Daily Commute Distance <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
            {currentDistance} km/day
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <input
            id="distance-slider"
            aria-labelledby="distance-label"
            type="range"
            min="0"
            max="150"
            step="1"
            value={currentDistance}
            onChange={(e) => onChange({ distancePerDayKm: Math.min(1000, Number(e.target.value)) })}
            className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
          />
          <input
            id="distance-input"
            aria-label="Daily commute distance in kilometers"
            type="number"
            min="0"
            max="1000"
            value={currentDistance}
            onChange={(e) => onChange({ distancePerDayKm: Math.min(1000, Math.max(0, Number(e.target.value))) })}
            className="w-24 text-center border border-slate-200 rounded-xl px-2 py-1.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Carpooling Switch */}
      {currentMode === 'Car' && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Regular vehicle ride-share?</div>
            <p className="text-xs text-slate-400 leading-normal mt-0.5">Shared transport splits the daily fuel output factor.</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ carpool: !currentCarpool })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus:outline-none ${
              currentCarpool ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
            role="switch"
            aria-checked={currentCarpool}
            aria-label={`Carpool: ${currentCarpool ? 'enabled' : 'disabled'}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                currentCarpool ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}

      {/* Optional flights */}
      <div className="space-y-3">
        <label htmlFor="flights-input" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
          Flights Taken This Month <span className="text-slate-400 font-normal text-xs normal-case">(Optional)</span>
        </label>
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-sm">
          <Plane className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            id="flights-input"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={currentFlights || ''}
            onChange={(e) => onChange({ flightsThisMonth: Math.min(100, Math.max(0, Number(e.target.value))) })}
            className="block w-full bg-transparent text-xs text-slate-800 border-none outline-none focus:ring-0 placeholder-slate-400"
          />
        </div>
        <p className="text-xs text-slate-400 tracking-wide uppercase">Appending +150 kg CO2e is computed per short-haul flight.</p>
      </div>
    </fieldset>
  );
}
