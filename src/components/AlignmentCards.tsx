import { Target, TrendingDown, Leaf, ShieldAlert } from 'lucide-react';

const ALIGN_ITEMS = [
  {
    title: '1. Understand',
    desc: 'Audit daily footprints from transport grids, utilities, and retail consumables.',
    icon: Target,
  },
  {
    title: '2. Track Progress',
    desc: 'Keep checking regularly. Track your reduction streak and improved lifestyle areas.',
    icon: TrendingDown,
  },
  {
    title: '3. Reduce Weight',
    desc: 'Adopt micro-commitments. Form green habits with target carbon metrics.',
    icon: Leaf,
  },
  {
    title: '4. Smarter Path',
    desc: 'Leverage AI carbon insight hubs to outline personalized action roadmaps.',
    icon: ShieldAlert,
  },
];

export default function AlignmentCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {ALIGN_ITEMS.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex flex-col bg-white border border-slate-200 p-6 rounded-3xl hover:shadow-sm transition-all duration-200 text-center sm:text-left justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 mb-4 mx-auto sm:mx-0">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
