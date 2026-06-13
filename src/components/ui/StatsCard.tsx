import React from 'react';
import { View, Text } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { getWorkoutForWeek } from '@/constants/workoutProgram';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { getWeekDates } from '@/utils/dateHelper';

export function StatsCard() {
  const workoutLogs = useAppStore((state) => state.workoutLogs);
  const mealLogs = useAppStore((state) => state.mealLogs);
  const currentWeek = useAppStore((state) => state.currentWeek);

  // 1. Kepatuhan Latihan Minggu Ini
  const weekDates = getWeekDates();
  const weekDatesList = Object.values(weekDates);
  
  // Hitung berapa sesi yang diselesaikan minggu ini
  const completedWorkoutsThisWeek = workoutLogs.filter(
    (log) => weekDatesList.includes(log.date) && log.finished
  ).length;

  // Total sesi terjadwal minggu ini (abaikan rest)
  const weeklyProgram = getWorkoutForWeek(currentWeek);
  const totalScheduledWorkoutsThisWeek = Object.values(weeklyProgram.sessions).filter(
    (session) => session && session.type !== 'rest'
  ).length;

  const workoutCompliancePercent = totalScheduledWorkoutsThisWeek > 0
    ? Math.round((completedWorkoutsThisWeek / totalScheduledWorkoutsThisWeek) * 100)
    : 100;

  // 2. Kepatuhan Makan Hari Ini
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMealLog = mealLogs[todayStr];
  
  let mealsCompletedTodayCount = 0;
  if (todayMealLog) {
    if (todayMealLog.breakfast?.completedItemIds?.length === todayMealLog.breakfast?.items?.length && todayMealLog.breakfast?.items?.length > 0) mealsCompletedTodayCount++;
    if (todayMealLog.lunch?.completedItemIds?.length === todayMealLog.lunch?.items?.length && todayMealLog.lunch?.items?.length > 0) mealsCompletedTodayCount++;
    if (todayMealLog.dinner?.completedItemIds?.length === todayMealLog.dinner?.items?.length && todayMealLog.dinner?.items?.length > 0) mealsCompletedTodayCount++;
    if (todayMealLog.snack?.completedItemIds?.length === todayMealLog.snack?.items?.length && todayMealLog.snack?.items?.length > 0) mealsCompletedTodayCount++;
  }
  const mealCompliancePercent = Math.round((mealsCompletedTodayCount / 4) * 100);

  // 3. Rata-rata Air Putih (7 Hari Terakhir)
  const allMealLogs = Object.values(mealLogs);
  const last7DaysLogs = allMealLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  const totalWaterGlasses = last7DaysLogs.reduce((acc, log) => acc + (log.waterGlasses || 0), 0);
  const averageWaterGlasses = last7DaysLogs.length > 0
    ? (totalWaterGlasses / last7DaysLogs.length).toFixed(1)
    : '0.0';

  return (
    <View className="flex-row gap-3 mb-6">
      {/* Kepatuhan Latihan */}
      <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm items-center">
        <View className="bg-emerald-500/10 p-2 rounded-xl mb-2">
          <Ionicons name="barbell-outline" size={18} color="#10B981" />
        </View>
        <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Latihan W{currentWeek}</Text>
        <Text className="text-lg font-black text-slate-900 dark:text-white mt-1">
          {workoutCompliancePercent}%
        </Text>
        <Text className="text-[9px] text-slate-400 mt-0.5 text-center">
          {completedWorkoutsThisWeek}/{totalScheduledWorkoutsThisWeek} selesai
        </Text>
      </Card>

      {/* Kepatuhan Makan */}
      <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm items-center">
        <View className="bg-amber-500/10 p-2 rounded-xl mb-2">
          <Ionicons name="restaurant-outline" size={18} color="#F59E0B" />
        </View>
        <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Makan Hari Ini</Text>
        <Text className="text-lg font-black text-slate-900 dark:text-white mt-1">
          {mealCompliancePercent}%
        </Text>
        <Text className="text-[9px] text-slate-400 mt-0.5 text-center">
          {mealsCompletedTodayCount}/4 waktu makan
        </Text>
      </Card>

      {/* Rata-rata Air Putih */}
      <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm items-center">
        <View className="bg-cyan-500/10 p-2 rounded-xl mb-2">
          <Ionicons name="water-outline" size={18} color="#06B6D4" />
        </View>
        <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Rata-rata Air</Text>
        <Text className="text-lg font-black text-slate-900 dark:text-white mt-1">
          {averageWaterGlasses}
        </Text>
        <Text className="text-[9px] text-slate-400 mt-0.5 text-center">
          gelas / hari (W1)
        </Text>
      </Card>
    </View>
  );
}
