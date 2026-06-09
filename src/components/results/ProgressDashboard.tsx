import { useState } from 'react';
import { LocalHistory } from '../../types';
import { getBestCategoryImproved, getReductionStreak } from '../../lib/storage';
import { formatCO2 } from '../../lib/utils';
import { Calendar, Award, Flame, Zap, Trash2, AlertTriangle } from 'lucide-react';

interface ProgressDashboardProps {
  history: LocalHistory;
  onClear: () => void;
}

export default function ProgressDashboard({ history, onClear }: ProgressDashboardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const currentStreak = getReductionStreak();
  const bestCategory = getBestCategoryImproved();
  const checkInCount = history.checkIns.length;
  const recentCheck = history.checkIns[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-0.5">Local Progress</h3>
          <p className="text-xs text-slate-400">Cached on device. Zero external servers required.</p>
        </div>
        {checkInCount > 0 && !showConfirm && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-all px-3 py-1.5 hover:bg-red-50/50 rounded-xl border border-transparent"
            aria-label="Clear local data"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Clear data</span>
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex gap-2 items-start text-red-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p>This removes local CarbonWise history from this device.</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                onClear();
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirm clear data
            </button>
          </div>
        </div>
      )}

      {checkInCount === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 select-none">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" aria-hidden="true" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">No History Recalled</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your metrics log checks will accumulate here to record lifestyle changes over time.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Custom Weekly Local Progress component from the Sleek Design HTML */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-xs">M</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-xs">T</div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">W</div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-300 text-xs">T</div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-300 text-xs">F</div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Habit Streak</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">{currentStreak} Days Tracked</p>
            </div>
          </div>

          {/* Grid Stat Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Checks</span>
              </div>
              <div className="text-base font-bold text-slate-800">{checkInCount} audits</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Commitments</span>
              </div>
              <div className="text-base font-bold text-slate-800">{history.completedActionIds.length} logged</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Best Area</span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate" title={bestCategory}>{bestCategory}</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Weekly AVG</span>
              </div>
              <div className="text-xs font-bold font-mono text-slate-800">
                {recentCheck ? formatCO2(recentCheck.result.weeklyTotal) : '0.0 kg'}
              </div>
            </div>
          </div>

          {/* Historical Log */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chronology Logs</h4>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white" role="log" tabIndex={0} aria-label="Check-in history log">
              {history.checkIns.map((record) => {
                const dateLabel = new Date(record.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div key={record.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" aria-hidden="true" />
                      <div>
                        <div className="font-bold text-slate-800">{record.result.footprintBand} footprint band</div>
                        <div className="text-xs text-slate-400 mt-0.5">{dateLabel}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-800">
                      {formatCO2(record.result.dailyTotal)}/day
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
