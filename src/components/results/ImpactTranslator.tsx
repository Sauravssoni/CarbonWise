import { translateCarbonImpact } from '../../lib/impact-translator';
import { Car, BatteryCharging, Fan, Coffee } from 'lucide-react';

interface ImpactTranslatorProps {
  savingsKg: number; // usually week target or daily sum
}

export default function ImpactTranslator({ savingsKg }: ImpactTranslatorProps) {
  // Translate savings to equivalents
  const normSavings = savingsKg || 7.5; // fallback weight for illustration if zero input
  const eq = translateCarbonImpact(normSavings);

  const CARDS = [
    {
      title: 'Car Travel',
      metric: `${eq.carKmAvoided} km`,
      desc: 'of average gasoline car driving emissions offset.',
      icon: Car,
      accent: 'text-emerald-600',
    },
    {
      title: 'Phone Charges',
      metric: `${eq.smartphoneCharges.toLocaleString()} charges`,
      desc: 'runs a typical mobile lithium battery cycle.',
      icon: BatteryCharging,
      accent: 'text-slate-600',
    },
    {
      title: 'Air Cooling',
      metric: `${eq.acHoursSaved} hours`,
      desc: 'electrical consumption of a standard AC system.',
      icon: Fan,
      accent: 'text-slate-600',
    },
    {
      title: 'Kettle Boils',
      metric: `${eq.cupsOfChaiKettleBoils.toLocaleString()} boils`,
      desc: 'power used to boil an electric water kettle completely.',
      icon: Coffee,
      accent: 'text-emerald-600',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Lifestyle Impact Translator</h3>
        <p className="text-xs text-slate-500">
          How avoiding <span className="font-bold underline underline-offset-2 text-emerald-600">{normSavings.toFixed(1)} kg CO2e</span> weekly translates into physical resource metrics:
        </p>
      </div>

      {/* Grid wrap with dashed border or clean outline elements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</span>
                <div className="p-1 rounded-lg bg-white border border-slate-200">
                  <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-4">
                <div className={`text-lg font-bold tracking-tight ${card.accent}`}>{card.metric}</div>
                <p className="text-xs text-slate-400 leading-normal mt-1">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
