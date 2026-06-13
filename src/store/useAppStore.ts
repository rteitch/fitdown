import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  workStartTime: string;   // "07:00"
  workEndTime: string;     // "15:30"
  workoutPreference: 'morning' | 'evening';
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;            // "YYYY-MM-DD"
  weightKg: number;
  note?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;            // "YYYY-MM-DD"
  sessionId: string;
  completedExercises: string[];  // exercise IDs
  startTime: string;
  endTime: string;
  finished: boolean;
  distanceKm?: number;     // jarak tempuh (km) untuk latihan luar ruangan
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  category: 'carbs' | 'protein' | 'vegetable' | 'fruit' | 'fat';
  isRecommended: boolean;
  isAvoided: boolean;
}

export interface MealEntry {
  items: FoodItem[];
  completedItemIds: string[];
  note?: string;
}

export interface MealLog {
  id: string;
  date: string;            // "YYYY-MM-DD"
  breakfast: MealEntry;
  lunch: MealEntry;
  dinner: MealEntry;
  snack: MealEntry;
  waterGlasses: number;
}

export interface AlarmConfig {
  id: string;
  label: string;
  time: string;            // "05:30"
  enabled: boolean;
  days: number[];          // [1,2,3,4,5] = Senin-Jumat (0=Sun, 1=Mon, ..., 6=Sat)
  sound: string;
  vibrate: boolean;
  type: 'wakeup' | 'workout' | 'meal' | 'sleep' | 'generic';
}

export interface DailyChecklist {
  date: string;            // "YYYY-MM-DD"
  workout: {
    warmup: boolean;
    mainSession: boolean;
    cooldown: boolean;
  };
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snack: boolean;
    water8Glasses: boolean;
    noSugaryDrink: boolean;
  };
  habits: {
    sleepBefore2230: boolean;
    noEatingAfter2000: boolean;
    activeBreak: boolean;
  };
}

// Default menu makanan harian sesuai PRD
export const DEFAULT_FOOD_ITEMS: Record<string, FoodItem[]> = {
  breakfast: [
    { id: 'b1', name: 'Nasi putih 1 centong / oatmeal', portion: '1 porsi sedang', category: 'carbs', isRecommended: true, isAvoided: false },
    { id: 'b2', name: 'Telur rebus / ceplok tanpa minyak', portion: '1-2 butir', category: 'protein', isRecommended: true, isAvoided: false },
    { id: 'b3', name: 'Sayur tumis / lalapan kangkung/bayam', portion: '1 porsi sedang', category: 'vegetable', isRecommended: true, isAvoided: false },
    { id: 'b4', name: 'Air putih hangat sebelum sarapan', portion: '1-2 gelas', category: 'vegetable', isRecommended: true, isAvoided: false },
  ],
  lunch: [
    { id: 'l1', name: 'Nasi putih 1-1.5 centong', portion: '1 porsi', category: 'carbs', isRecommended: true, isAvoided: false },
    { id: 'l2', name: 'Telur rebus / balado / dadar', portion: '1-2 butir', category: 'protein', isRecommended: true, isAvoided: false },
    { id: 'l3', name: 'Sayur berkuah (sop / bening bayam / capcay)', portion: '1 porsi', category: 'vegetable', isRecommended: true, isAvoided: false },
    { id: 'l4', name: 'Tempe / tahu bakar', portion: '1-2 potong', category: 'protein', isRecommended: true, isAvoided: false },
  ],
  snack: [
    { id: 's1', name: 'Buah segar (pisang / jeruk / apel / pepaya)', portion: '1 porsi', category: 'fruit', isRecommended: true, isAvoided: false },
    { id: 's2', name: 'Kacang tanah / kacang rebus', portion: '1 genggam', category: 'fat', isRecommended: true, isAvoided: false },
    { id: 's3', name: 'Yogurt plain tanpa gula tambahan', portion: '1 cup', category: 'protein', isRecommended: true, isAvoided: false },
  ],
  dinner: [
    { id: 'd1', name: 'Nasi putih 1 centong (atau jagung/ubi)', portion: '1 porsi kecil', category: 'carbs', isRecommended: true, isAvoided: false },
    { id: 'd2', name: 'Lauk protein (ikan/ayam/telur rebus/tahu)', portion: '1 porsi', category: 'protein', isRecommended: true, isAvoided: false },
    { id: 'd3', name: 'Sayur tumis / lalapan kukus', portion: '1 porsi', category: 'vegetable', isRecommended: true, isAvoided: false },
  ],
};

// Alarms Default
const DEFAULT_ALARMS: AlarmConfig[] = [
  { id: 'a1', label: 'Bangun pagi', time: '05:15', enabled: true, days: [1,2,3,4,5], sound: 'default', vibrate: true, type: 'wakeup' },
  { id: 'a2', label: 'Mulai latihan pagi', time: '05:30', enabled: true, days: [1,3,5], sound: 'default', vibrate: true, type: 'workout' },
  { id: 'a3', label: 'Berangkat kerja', time: '07:00', enabled: false, days: [1,2,3,4,5], sound: 'default', vibrate: true, type: 'generic' },
  { id: 'a4', label: 'Sarapan (Makan pertama)', time: '08:00', enabled: true, days: [1,2,3,4,5,6,0], sound: 'default', vibrate: true, type: 'meal' },
  { id: 'a5', label: 'Makan siang', time: '12:00', enabled: true, days: [1,2,3,4,5,6,0], sound: 'default', vibrate: true, type: 'meal' },
  { id: 'a6', label: 'Pulang kerja', time: '15:30', enabled: false, days: [1,2,3,4,5], sound: 'default', vibrate: true, type: 'generic' },
  { id: 'a7', label: 'Latihan sore', time: '16:00', enabled: false, days: [1,3,5], sound: 'default', vibrate: true, type: 'workout' },
  { id: 'a8', label: 'Makan malam', time: '19:00', enabled: true, days: [1,2,3,4,5,6,0], sound: 'default', vibrate: true, type: 'meal' },
  { id: 'a9', label: 'Persiapan tidur', time: '21:00', enabled: true, days: [1,2,3,4,5,6,0], sound: 'default', vibrate: true, type: 'sleep' },
  { id: 'a10', label: 'Waktu tidur', time: '22:00', enabled: true, days: [1,2,3,4,5,6,0], sound: 'default', vibrate: true, type: 'sleep' },
];

interface AppState {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  // Weight Tracker
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (id: string) => void;

  // Workout Logs
  workoutLogs: WorkoutLog[];
  addWorkoutLog: (log: WorkoutLog) => void;
  currentWeek: number;
  currentPhase: 1 | 2 | 3;
  setCurrentWeek: (week: number) => void;
  setCurrentPhase: (phase: 1 | 2 | 3) => void;

  // Food / Meal Logs
  mealLogs: Record<string, MealLog>; // key: "YYYY-MM-DD"
  updateMealLog: (date: string, log: Partial<MealLog>) => void;

  // Alarms
  alarms: AlarmConfig[];
  updateAlarm: (id: string, config: Partial<AlarmConfig>) => void;

  // Daily Checklists
  dailyChecklists: Record<string, DailyChecklist>; // key: "YYYY-MM-DD"
  updateDailyChecklist: (date: string, update: Partial<DailyChecklist>) => void;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // App Reset
  resetAppStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User Profile
      userProfile: null,
      setUserProfile: (profile) => {
        // Otomatis aktifkan alarm pagi / sore sesuai preferensi user
        const preference = profile?.workoutPreference;
        set((state) => ({
          userProfile: profile,
          alarms: state.alarms.map((a) => {
            if (a.id === 'a2') { // Latihan pagi
              return { ...a, enabled: preference === 'morning' };
            }
            if (a.id === 'a7') { // Latihan sore
              return { ...a, enabled: preference === 'evening' };
            }
            return a;
          })
        }));
      },

      // Weight Tracker
      weightEntries: [],
      addWeightEntry: (entry) =>
        set((state) => {
          const filtered = state.weightEntries.filter((e) => e.date !== entry.date);
          const updated = [...filtered, entry].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          return { weightEntries: updated };
        }),
      deleteWeightEntry: (id) =>
        set((state) => ({
          weightEntries: state.weightEntries.filter((e) => e.id !== id),
        })),

      // Workout Logs
      workoutLogs: [],
      addWorkoutLog: (log) =>
        set((state) => ({ workoutLogs: [...state.workoutLogs, log] })),
      currentWeek: 1,
      currentPhase: 1,
      setCurrentWeek: (week) => set({ currentWeek: week }),
      setCurrentPhase: (phase) => set({ currentPhase: phase }),

      // Food / Meal Logs
      mealLogs: {},
      updateMealLog: (date, log) =>
        set((state) => {
          const currentLog = state.mealLogs[date] || {
            id: date,
            date,
            breakfast: { items: DEFAULT_FOOD_ITEMS.breakfast, completedItemIds: [] },
            lunch: { items: DEFAULT_FOOD_ITEMS.lunch, completedItemIds: [] },
            dinner: { items: DEFAULT_FOOD_ITEMS.dinner, completedItemIds: [] },
            snack: { items: DEFAULT_FOOD_ITEMS.snack, completedItemIds: [] },
            waterGlasses: 0,
          };
          return {
            mealLogs: {
              ...state.mealLogs,
              [date]: { ...currentLog, ...log },
            },
          };
        }),

      // Alarms
      alarms: DEFAULT_ALARMS,
      updateAlarm: (id, config) =>
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id ? { ...a, ...config } : a
          ),
        })),

      // Daily Checklists
      dailyChecklists: {},
      updateDailyChecklist: (date, update) =>
        set((state) => {
          const currentCheck = state.dailyChecklists[date] || {
            date,
            workout: { warmup: false, mainSession: false, cooldown: false },
            meals: {
              breakfast: false,
              lunch: false,
              dinner: false,
              snack: false,
              water8Glasses: false,
              noSugaryDrink: false,
            },
            habits: { sleepBefore2230: false, noEatingAfter2000: false, activeBreak: false },
          };
          
          // Gabungkan update dengan deep merge sederhana
          const merged = {
            date,
            workout: { ...currentCheck.workout, ...update.workout },
            meals: { ...currentCheck.meals, ...update.meals },
            habits: { ...currentCheck.habits, ...update.habits },
          };

          return {
            dailyChecklists: {
              ...state.dailyChecklists,
              [date]: merged,
            },
          };
        }),

      // Streaks
      currentStreak: 0,
      longestStreak: 0,
      incrementStreak: () =>
        set((state) => {
          const nextStreak = state.currentStreak + 1;
          return {
            currentStreak: nextStreak,
            longestStreak: Math.max(state.longestStreak, nextStreak),
          };
        }),
      resetStreak: () => set({ currentStreak: 0 }),
      
      // Reset App
      resetAppStore: () => set({
        userProfile: null,
        weightEntries: [],
        workoutLogs: [],
        mealLogs: {},
        alarms: DEFAULT_ALARMS,
        dailyChecklists: {},
        currentStreak: 0,
        currentWeek: 1,
        currentPhase: 1,
      })
    }),
    {
      name: 'fitdown-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
