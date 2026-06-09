/**
 * CarbonWise - Safe Client-Side LocalStorage Persistence
 */

import { CheckInRecord, FootprintInput, CarbonResult, LocalHistory } from '../types';

const STORAGE_KEY = 'carbonwise_state_v1';

const DEFAULT_STATE: LocalHistory = {
  checkIns: [],
  completedActionIds: [],
  customActions: [],
};

/**
 * Checks if localStorage is available and accessible
 */
function getSafeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    // Some sandboxed frames throw on accessing the property itself
    const storage = window.localStorage;
    if (!storage) return null;
    return storage;
  } catch {
    return null;
  }
}



// In-Memory fallback for server environments or testing
let memoryState: LocalHistory = { ...DEFAULT_STATE };

/**
 * Loads the user profile history and actions state
 */
export function getLocalHistory(): LocalHistory {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return memoryState;
  }
  
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATE, checkIns: [], completedActionIds: [], customActions: [] };
    }
    const parsed = JSON.parse(raw);
    
    // Integrity checks for corrupt data
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_STATE, checkIns: [], completedActionIds: [], customActions: [] };
    }
    
    return {
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      completedActionIds: Array.isArray(parsed.completedActionIds) ? parsed.completedActionIds : [],
      customActions: Array.isArray(parsed.customActions) ? parsed.customActions : [],
    };
  } catch (err) {
    // Graceful recovery from corrupt storage formats
    return { ...DEFAULT_STATE, checkIns: [], completedActionIds: [], customActions: [] };
  }
}

/**
 * Saves the history state back to local storage
 */
export function saveLocalHistory(state: LocalHistory): void {
  const storage = getSafeLocalStorage();
  if (!storage) {
    memoryState = { ...state };
    return;
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Fail-safe
  }
}

/**
 * Adds a new check-in to the user's history log
 */
export function addCheckIn(input: FootprintInput, result: CarbonResult): CheckInRecord {
  const history = getLocalHistory();
  
  const newRecord: CheckInRecord = {
    id: `chk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    input: JSON.parse(JSON.stringify(input)),
    result: JSON.parse(JSON.stringify(result)),
  };
  
  history.checkIns.unshift(newRecord); // Prepend so most recent is first
  saveLocalHistory(history);
  return newRecord;
}

/**
 * Records completion of an action
 */
export function completeAction(actionId: string): void {
  const history = getLocalHistory();
  if (!history.completedActionIds.includes(actionId)) {
    history.completedActionIds.push(actionId);
    saveLocalHistory(history);
  }
}

/**
 * Removes a completed action mark
 */
export function uncompleteAction(actionId: string): void {
  const history = getLocalHistory();
  history.completedActionIds = history.completedActionIds.filter(id => id !== actionId);
  saveLocalHistory(history);
}

/**
 * Resets all dashboard data
 */
export function clearStorageData(): void {
  try {
    const storage = getSafeLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    // Fail-safe
  }
  memoryState = {
    checkIns: [],
    completedActionIds: [],
    customActions: [],
  };
}

/**
 * Calculates current action streak based on total completed action counts
 * or sequential daily check-ins
 */
export function getReductionStreak(): number {
  const history = getLocalHistory();
  
  // Return the count of successfully saved green action completions
  return history.completedActionIds.length;
}

/**
 * Analyzes check-in history to determine if a category has shown the most improvement
 */
export function getBestCategoryImproved(): string {
  const history = getLocalHistory();
  if (history.checkIns.length < 2) return 'None (Keep checking in)';
  
  // Compare oldest vs newest check-in to find the category with the largest drop in emissions
  const newest = history.checkIns[0].result.breakdown;
  const oldest = history.checkIns[history.checkIns.length - 1].result.breakdown;
  
  const differences = {
    transport: oldest.transport - newest.transport,
    energy: oldest.energy - newest.energy,
    food: oldest.food - newest.food,
    consumption: oldest.consumption - newest.consumption,
  };
  
  let bestCat = 'None';
  let maxReduction = 0;
  
  for (const [cat, val] of Object.entries(differences)) {
    if (val > maxReduction) {
      maxReduction = val;
      bestCat = cat;
    }
  }
  
  if (bestCat === 'None' || maxReduction <= 0.05) {
    return 'Stable (Steady Progress)';
  }
  
  // Format to standard category names
  return bestCat.charAt(0).toUpperCase() + bestCat.slice(1);
}
