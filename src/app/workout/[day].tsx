import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppStore, WorkoutLog } from '@/store/useAppStore';
import { getWorkoutForWeek, getExerciseImage } from '@/constants/workoutProgram';
import { Card } from '@/components/ui/Card';
import { Image } from 'expo-image';
import { formatFriendlyDate } from '@/utils/dateHelper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dayKey = params.day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  const dateStr = params.date as string;

  const currentWeek = useAppStore((state) => state.currentWeek);
  const workoutLogs = useAppStore((state) => state.workoutLogs);
  const addWorkoutLog = useAppStore((state) => state.addWorkoutLog);
  const updateDailyChecklist = useAppStore((state) => state.updateDailyChecklist);
  const incrementStreak = useAppStore((state) => state.incrementStreak);

  // Ambil program latihan
  const weeklyProgram = getWorkoutForWeek(currentWeek);
  const session = weeklyProgram.sessions[dayKey];

  // Menyimpan daftar ID latihan yang diselesaikan secara lokal di halaman ini
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Mengambil log yang sudah tersimpan untuk mencocokkan status checklist
  const existingLog = workoutLogs.find((log) => log.date === dateStr && log.finished);
  const isCompleted = !!existingLog;

  useEffect(() => {
    if (existingLog) {
      setCompletedExercises(existingLog.completedExercises);
    }
  }, [existingLog]);

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Text className="text-slate-500 dark:text-slate-400 font-medium">Sesi tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  const isRest = session.type === 'rest';

  // Toggle checklist gerakan secara manual
  const toggleExercise = (exerciseId: string) => {
    if (isCompleted) return; // Tidak bisa diubah jika sudah diselesaikan
    
    let updated: string[];
    if (completedExercises.includes(exerciseId)) {
      updated = completedExercises.filter((id) => id !== exerciseId);
    } else {
      updated = [...completedExercises, exerciseId];
    }
    setCompletedExercises(updated);
  };

  // Menyelesaikan latihan secara manual
  const handleFinishManual = () => {
    const logId = Math.random().toString(36).substring(7);
    const newLog: WorkoutLog = {
      id: logId,
      date: dateStr,
      sessionId: `${currentWeek}_${dayKey}`,
      completedExercises: completedExercises,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      finished: true,
    };

    addWorkoutLog(newLog);
    updateDailyChecklist(dateStr, {
      workout: { warmup: true, mainSession: true, cooldown: true }
    });

    // Tambah streak jika hari ini belum pernah latihan
    const hasWorkoutToday = workoutLogs.some((l) => l.date === dateStr && l.finished);
    if (!hasWorkoutToday) {
      incrementStreak();
    }

    router.back();
  };

  const startTimerWorkout = () => {
    router.push({
      pathname: '/workout/timer',
      params: { day: dayKey, date: dateStr }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: session.title,
          headerBackTitle: 'Kembali',
          headerShadowVisible: false,
        }} 
      />

      <ScrollView className="flex-1 px-5 py-4" showsVerticalScrollIndicator={false}>
        {/* Info Header */}
        <View className="mb-6 mt-2">
          <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {formatFriendlyDate(dateStr)} • MINGGU {currentWeek}
          </Text>
          <Text className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {session.title}
          </Text>
          
          {!isRest && (
            <View className="flex-row items-center mt-3 gap-4">
              <View className="flex-row items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-3 py-1.5 rounded-full">
                <Ionicons name="time" size={16} color="#10B981" />
                <Text className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1.5">{session.durationMinutes} Menit</Text>
              </View>
              <View className="flex-row items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-3 py-1.5 rounded-full">
                <Ionicons name="fitness" size={16} color="#10B981" />
                <Text className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1.5">{session.exercises.length} Gerakan</Text>
              </View>
            </View>
          )}
        </View>

        {isRest ? (
          <Card className="items-center py-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
            <Ionicons name="cafe" size={56} color="#10B981" />
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white mt-4">Waktunya Istirahat</Text>
            <Text className="text-slate-400 dark:text-slate-500 text-sm text-center mt-2 px-6 leading-relaxed">
              Hari ini tidak ada sesi latihan berat. Fokus pada pemulihan tubuh Anda. Anda bisa berjalan kaki santai selama 20-30 menit untuk menjaga metabolisme tubuh tetap aktif.
            </Text>
            {session.exercises.length > 0 && (
              <View className="w-full mt-6 border-t border-slate-100 dark:border-slate-850 pt-5 px-4">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Saran Aktivitas:</Text>
                {session.exercises.map((ex) => (
                  <View key={ex.id} className="flex-row items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
                    <Ionicons name="walk" size={20} color="#10B981" />
                    <View className="flex-1">
                      <Text className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{ex.name}</Text>
                      <Text className="text-xs text-slate-400 mt-0.5">{ex.repsOrDuration}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        ) : (
          <View className="mb-10">
            {/* Daftar Gerakan */}
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 pl-1">Daftar Gerakan Latihan</Text>
            
            <View className="gap-3.5 mb-8">
              {session.exercises.map((exercise) => {
                const isChecked = completedExercises.includes(exercise.id) || isCompleted;
                return (
                  <Card 
                    key={exercise.id}
                    onPress={() => toggleExercise(exercise.id)}
                    className={`bg-white dark:bg-slate-900 border ${
                      isChecked 
                        ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5' 
                        : 'border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Pressable 
                        onPress={() => toggleExercise(exercise.id)}
                        className={`w-6 h-6 rounded-lg border items-center justify-center ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950'
                        }`}
                      >
                        {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
                      </Pressable>
                      
                      <View className="flex-1 ml-4 pr-2">
                        <Text className={`text-base font-extrabold ${isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-850 dark:text-slate-150'}`}>
                          {exercise.name}
                        </Text>
                        <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                          {exercise.sets} Set x {exercise.repsOrDuration} • Istirahat {exercise.restSeconds}s
                        </Text>
                        {exercise.note ? (
                          <Text className="text-xs italic text-slate-400 mt-1.5 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-xl">
                            💡 {exercise.note}
                          </Text>
                        ) : null}
                      </View>

                      <Image
                        source={getExerciseImage(exercise.name)}
                        className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950"
                        contentFit="contain"
                      />
                    </View>
                  </Card>
                );
              })}
            </View>

            {/* Actions */}
            {isCompleted ? (
              <Card className="bg-emerald-500/10 dark:bg-emerald-500/15 border-transparent p-4 items-center flex-row justify-center mb-6">
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold ml-2">
                  Sesi Latihan Ini Telah Selesai!{existingLog?.distanceKm ? ` (${existingLog.distanceKm} km)` : ''}
                </Text>
              </Card>
            ) : (
              <View className="gap-3 mb-12">
                <Pressable
                  onPress={startTimerWorkout}
                  className="bg-emerald-500 rounded-3xl py-4 items-center justify-center flex-row shadow-md shadow-emerald-500/10 active:opacity-90"
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text className="text-white font-extrabold ml-2 text-base">Mulai Latihan dengan Timer</Text>
                </Pressable>

                <Pressable
                  onPress={handleFinishManual}
                  disabled={completedExercises.length === 0}
                  className={`border border-emerald-500 rounded-3xl py-4 items-center justify-center flex-row active:bg-slate-100 dark:active:bg-slate-850 ${
                    completedExercises.length === 0 ? 'opacity-40' : ''
                  }`}
                >
                  <Ionicons name="checkmark-done" size={20} color="#10B981" />
                  <Text className="text-emerald-500 font-bold ml-2 text-base">Selesaikan secara Manual</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
