import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { getWorkoutForWeek } from '@/constants/workoutProgram';
import { getWeekDates, formatFriendlyDate } from '@/utils/dateHelper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function WorkoutTab() {
  const router = useRouter();
  const currentWeek = useAppStore((state) => state.currentWeek);
  const setCurrentWeek = useAppStore((state) => state.setCurrentWeek);
  const workoutLogs = useAppStore((state) => state.workoutLogs);
  
  // Ambil tanggal-tanggal untuk minggu ini
  const weekDates = getWeekDates();

  // Daftar hari berurutan
  const days: { key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'; name: string }[] = [
    { key: 'monday', name: 'Senin' },
    { key: 'tuesday', name: 'Selasa' },
    { key: 'wednesday', name: 'Rabu' },
    { key: 'thursday', name: 'Kamis' },
    { key: 'friday', name: 'Jumat' },
    { key: 'saturday', name: 'Sabtu' },
    { key: 'sunday', name: 'Minggu' },
  ];

  const weeklyProgram = getWorkoutForWeek(currentWeek);

  // Ambil log latihan selesai pada tanggal tertentu
  const getCompletedWorkoutLog = (dateStr: string) => {
    return workoutLogs.find((log) => log.date === dateStr && log.finished);
  };

  const handleDayPress = (dayKey: string, dateStr: string) => {
    router.push({
      pathname: '/workout/[day]',
      params: { day: dayKey, date: dateStr }
    });
  };

  // Navigasi Minggu
  const handlePrevWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    if (currentWeek < 12) setCurrentWeek(currentWeek + 1);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950 px-5 py-4" showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />

      {/* Selector Minggu */}
      <View className="flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-4 mb-6 mt-2 shadow-sm">
        <Pressable 
          onPress={handlePrevWeek} 
          disabled={currentWeek === 1}
          className={`p-2 rounded-xl ${currentWeek === 1 ? 'opacity-30' : 'active:bg-slate-50 dark:active:bg-slate-800'}`}
        >
          <Ionicons name="chevron-back" size={20} color={currentWeek === 1 ? '#94A3B8' : '#10B981'} />
        </Pressable>
        
        <View className="items-center">
          <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Program Latihan</Text>
          <Text className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Minggu {currentWeek} dari 12</Text>
        </View>

        <Pressable 
          onPress={handleNextWeek} 
          disabled={currentWeek === 12}
          className={`p-2 rounded-xl ${currentWeek === 12 ? 'opacity-30' : 'active:bg-slate-50 dark:active:bg-slate-800'}`}
        >
          <Ionicons name="chevron-forward" size={20} color={currentWeek === 12 ? '#94A3B8' : '#10B981'} />
        </Pressable>
      </View>

      {/* List Hari Latihan */}
      <View className="gap-4 mb-10">
        {days.map((day) => {
          const session = weeklyProgram.sessions[day.key];
          const dateStr = weekDates[day.key];
          const completedLog = getCompletedWorkoutLog(dateStr);
          const isCompleted = !!completedLog;
          
          if (!session) return null;

          const isRest = session.type === 'rest';

          return (
            <Card
              key={day.key}
              onPress={() => handleDayPress(day.key, dateStr)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <Text className="text-sm font-black text-slate-900 dark:text-white">{day.name}</Text>
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500">•</Text>
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500">{formatFriendlyDate(dateStr)}</Text>
                  </View>

                  <Text className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                    {session.title}
                  </Text>

                  {!isRest && (
                    <View className="flex-row items-center mt-2.5 gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#94A3B8" />
                        <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">{session.durationMinutes} mnt</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="fitness-outline" size={14} color="#94A3B8" />
                        <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">{session.exercises.length} gerakan</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Status Badge */}
                <View>
                  {isCompleted ? (
                    <View className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 px-3 py-1.5 rounded-full flex-row items-center">
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                        Selesai{completedLog?.distanceKm ? ` • ${completedLog.distanceKm} km` : ''}
                      </Text>
                    </View>
                  ) : isRest ? (
                    <View className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full flex-row items-center">
                      <Ionicons name="cafe-outline" size={14} color="#94A3B8" />
                      <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Istirahat</Text>
                    </View>
                  ) : (
                    <View className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 px-3 py-1.5 rounded-full flex-row items-center">
                      <Ionicons name="play-outline" size={14} color="#3B82F6" />
                      <Text className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1">Mulai</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}
