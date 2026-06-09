import { useState, useCallback } from 'react';
import { FootprintInput, CarbonResult, LocalHistory } from './types';
import { addCheckIn, getLocalHistory, clearStorageData } from './lib/storage';
import { calculateFootprint } from './lib/carbon-engine';
import { ToastProvider, useToast } from './components/ToastProvider';
import Hero from './components/Hero';
import AlignmentCards from './components/AlignmentCards';
import FootprintForm from './components/FootprintForm';
import ResultsDashboard from './components/ResultsDashboard';
import { Leaf } from 'lucide-react';

type AppViewState = 'landing' | 'form' | 'results';

// Preset high-integrity test profile for the Demo CTA
const DEMO_COMPUTE_INPUT: FootprintInput = {
  commuteMode: 'Car',
  distancePerDayKm: 35,
  carpool: false,
  flightsThisMonth: 1,
  electricityKwhMonthly: 360,
  acUsage: 'Medium',
  householdSize: 2,
  dietType: 'Mixed',
  foodWaste: 'Sometimes',
  eatingOutFrequency: 'Weekly',
  onlineOrdersMonthly: 5,
  clothingPurchasesMonthly: 2,
  recyclingHabit: 'Sometimes',
  reductionTarget: 10,
  preferredEffort: 'Balanced',
  optionalNote: 'Demonstration footprint profile.',
};

function MainAppShell() {
  const { showToast } = useToast();
  const [view, setView] = useState<AppViewState>('landing');
  // Initialize state directly from local storage for SPA
  const [localHistory, setLocalHistory] = useState<LocalHistory>(() => getLocalHistory());

  const [activeInput, setActiveInput] = useState<FootprintInput | null>(() => {
    return localHistory.checkIns.length > 0 ? localHistory.checkIns[0].input : null;
  });

  const [activeResult, setActiveResult] = useState<CarbonResult | null>(() => {
    return localHistory.checkIns.length > 0 ? localHistory.checkIns[0].result : null;
  });

  const refreshCachedState = useCallback(() => {
    const historicalData = getLocalHistory();
    setLocalHistory(historicalData);
  }, []);

  // Removed effect that caused synchronous setState warnings

  const handleFormSubmission = (input: FootprintInput, result: CarbonResult) => {
    // Save to LocalStorage
    addCheckIn(input, result);
    setActiveInput(input);
    setActiveResult(result);
    refreshCachedState();
    setView('results');
    showToast('Your carbon footprint has been computed successfully!');
  };

  const handleLaunchDemo = () => {
    const computedResult = calculateFootprint(DEMO_COMPUTE_INPUT);

    // Commit check in immediately to fulfill flow requirements
    addCheckIn(DEMO_COMPUTE_INPUT, computedResult);
    setActiveInput(DEMO_COMPUTE_INPUT);
    setActiveResult(computedResult);
    refreshCachedState();
    setView('results');
    showToast('Loaded demo profile. Small actions compound!');
  };

  const handleClearEverything = () => {
    clearStorageData();
    setActiveInput(null);
    setActiveResult(null);
    refreshCachedState();
    setView('landing');
    showToast('All local storage profile data wiped.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased text-slate-900">
      {/* Skip to main content link for keyboard and screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Upper Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm leading-none">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 outline-none hover:opacity-90 transition-all font-sans"
            aria-label="Logo and go home"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-800">CarbonWise</span>
          </button>

          {/* Core navigation anchors */}
          <nav
            className="hidden md:flex gap-6 text-sm font-medium text-slate-500"
            aria-label="Main navigation"
          >
            <button
              onClick={() => {
                setView('landing');
              }}
              className={`hover:text-slate-800 transition-colors ${view === 'landing' ? 'text-emerald-600' : ''}`}
              aria-current={view === 'landing' ? 'page' : undefined}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setView('form');
              }}
              className={`hover:text-slate-800 transition-colors ${view === 'form' ? 'text-emerald-600' : ''}`}
              aria-current={view === 'form' ? 'page' : undefined}
            >
              Footprint Wizard
            </button>
            {localHistory.checkIns.length > 0 && (
              <button
                onClick={() => {
                  setView('results');
                }}
                className={`hover:text-slate-800 transition-colors ${view === 'results' ? 'text-emerald-600' : ''}`}
                aria-current={view === 'results' ? 'page' : undefined}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Quick Stats shortcut or indicator */}
          <div className="flex items-center gap-3">
            {localHistory.checkIns.length > 0 ? (
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 select-none">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Metrics Active
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 select-none">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Ready to Check
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 sm:py-12 flex flex-col justify-center"
      >
        {view === 'landing' && (
          <div className="space-y-12 animate-fade-in">
            <Hero onStartCheck={() => setView('form')} onTryDemo={handleLaunchDemo} />
            <hr className="border-t border-slate-200" />
            <div className="space-y-6">
              <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest select-none">
                Core Pillar Alignment Solution
              </h3>
              <AlignmentCards />
            </div>
          </div>
        )}

        {view === 'form' && (
          <div className="max-w-2xl mx-auto w-full">
            <FootprintForm
              onSubmitSuccess={handleFormSubmission}
              onCancel={() => setView('landing')}
              initialData={activeInput || undefined}
            />
          </div>
        )}

        {view === 'results' && activeInput && activeResult && (
          <ResultsDashboard
            input={activeInput}
            result={activeResult}
            onNewCheckIn={() => setView('form')}
            onRefreshHistory={refreshCachedState}
            onClearHistory={handleClearEverything}
            localHistory={localHistory}
          />
        )}
      </main>

      {/* Deep Footer branding metadata */}
      <footer className="h-14 px-8 border-t border-slate-200 bg-slate-100 flex items-center justify-center text-center select-none leading-none">
        <p className="text-xs text-slate-400 uppercase tracking-widest">
          CarbonWise provides educational estimates, not official carbon accounting.
          <span className="mx-2">•</span>
          Calculation Factors: DEFRA 2023, IEA Emission Factors v1.4
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppShell />
    </ToastProvider>
  );
}
