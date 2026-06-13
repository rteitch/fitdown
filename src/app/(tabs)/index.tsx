import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getWorkoutForWeek } from '@/constants/workoutProgram';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ActivityCalendar } from '@/components/ui/ActivityCalendar';

export default function DashboardScreen() {
  const router = useRouter();
  const userProfile = useAppStore((state) => state.userProfile);
  const weightEntries = useAppStore((state) => state.weightEntries);
  const currentWeek = useAppStore((state) => state.currentWeek);
  const currentStreak = useAppStore((state) => state.currentStreak);

  // Jika profil belum ada (untuk antisipasi hidrasi lambat)
  if (!userProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Text className="text-slate-500 dark:text-slate-400 font-medium">Memuat data...</Text>
      </View>
    );
  }

  // Timbang berat badan terbaru
  const latestWeightEntry = weightEntries[weightEntries.length - 1];
  const currentWeight = latestWeightEntry ? latestWeightEntry.weightKg : userProfile.startWeightKg;

  // Hitung BMI
  const heightInMeters = userProfile.heightCm / 100;
  const bmi = currentWeight / (heightInMeters * heightInMeters);
  
  let bmiCategory = '';
  let bmiColorClass = '';
  if (bmi < 18.5) {
    bmiCategory = 'Berat Kurang';
    bmiColorClass = 'text-blue-500';
  } else if (bmi < 25) {
    bmiCategory = 'Normal';
    bmiColorClass = 'text-emerald-500';
  } else if (bmi < 30) {
    bmiCategory = 'Berat Lebih';
    bmiColorClass = 'text-amber-500';
  } else {
    bmiCategory = 'Obesitas (Kelas II)';
    bmiColorClass = 'text-red-500';
  }

  // Hitung progres penurunan berat badan
  const totalToLose = userProfile.startWeightKg - userProfile.targetWeightKg;
  const lostSoFar = userProfile.startWeightKg - currentWeight;
  const progressPercent = totalToLose > 0 ? Math.max(0, Math.min(1, lostSoFar / totalToLose)) : 0;

  // Dapatkan hari ini
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayNameIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayIndex = new Date().getDay();
  const todayKey = daysOfWeek[todayIndex] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  
  const weeklyProgram = getWorkoutForWeek(currentWeek);
  const todayWorkout = weeklyProgram.sessions[todayKey];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-950 px-5 py-4"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="auto" />

      {/* Header Salam */}
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Selamat Datang</Text>
          <Text className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Halo, {userProfile.name} 👋</Text>
        </View>
        <Card className="p-3 bg-emerald-500/10 dark:bg-emerald-500/15 border-transparent flex-row items-center rounded-2xl">
          <Ionicons name="flame" size={20} color="#10B981" />
          <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold ml-1.5 text-base">{currentStreak} Hari</Text>
        </Card>
      </View>

      {/* Kartu Ringkasan Berat & Progress */}
      <Card className="mb-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/80">
        <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Progres Penurunan BB</Text>
        
        <View className="flex-row justify-between items-end mb-2">
          <View>
            <Text className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Berat Saat Ini</Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-3xl font-black text-slate-900 dark:text-white">{currentWeight}</Text>
              <Text className="text-sm font-bold text-slate-500 ml-1">kg</Text>
            </View>
          </View>
          
          <View className="items-end">
            <Text className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Target Akhir</Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-xl font-bold text-slate-500 dark:text-slate-400">{userProfile.targetWeightKg}</Text>
              <Text className="text-xs font-bold text-slate-400 ml-0.5">kg</Text>
            </View>
          </View>
        </View>

        <ProgressBar progress={progressPercent} height={10} className="mb-4" />

        <View className="flex-row justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 mt-1">
          <View className="flex-row items-center">
            <Ionicons name="body" size={16} color="#10B981" />
            <Text className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">Indeks Massa Tubuh (BMI)</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm font-black text-slate-950 dark:text-white mr-1.5">{bmi.toFixed(1)}</Text>
            <Text className={`text-xs font-extrabold ${bmiColorClass}`}>({bmiCategory})</Text>
          </View>
        </View>
      </Card>

      {/* Kartu Latihan Hari Ini */}
      <Card className="mb-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/80">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Latihan Hari Ini ({dayNameIndo[todayIndex]})</Text>
          <View className="bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Minggu {currentWeek}</Text>
          </View>
        </View>

        {todayWorkout && todayWorkout.type !== 'rest' && todayWorkout.exercises.length > 0 ? (
          <View>
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{todayWorkout.title}</Text>
            <View className="flex-row items-center mt-2 mb-4">
              <View className="flex-row items-center mr-4">
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-bold ml-1.5">{todayWorkout.durationMinutes} mnt</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="fitness-outline" size={16} color="#64748B" />
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-bold ml-1.5">{todayWorkout.exercises.length} gerakan</Text>
              </View>
            </View>
            
            <Pressable
              onPress={() => router.push('/workout')}
              className="bg-emerald-500 rounded-2xl py-3.5 items-center justify-center flex-row shadow-sm active:opacity-90"
            >
              <Ionicons name="play" size={18} color="white" />
              <Text className="text-white font-bold ml-2">Mulai Latihan Sekarang</Text>
            </Pressable>
          </View>
        ) : (
          <View className="items-center py-4">
            <Ionicons name="cafe-outline" size={42} color="#10B981" />
            <Text className="text-slate-950 dark:text-white font-extrabold mt-3 text-lg">Hari Pemulihan & Istirahat</Text>
            <Text className="text-slate-400 dark:text-slate-500 text-xs text-center mt-1 px-4">
              Tubuh membutuhkan waktu istirahat untuk memulihkan otot. Tetap aktif ringan dengan berjalan kaki.
            </Text>
            <Pressable
              onPress={() => router.push('/workout')}
              className="border border-emerald-500/30 rounded-2xl py-3.5 items-center justify-center flex-row w-full mt-4 active:bg-slate-50 dark:active:bg-slate-800"
            >
              <Text className="text-emerald-500 font-bold">Lihat Rencana Mingguan</Text>
            </Pressable>
          </View>
        )}
      </Card>

      {/* Kalender Aktivitas */}
      <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 pl-1">Kalender Konsistensi</Text>
      <ActivityCalendar />

      {/* Tombol Pintasan Cepat (Quick Actions) */}
      <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-3.5 pl-1">Akses Cepat</Text>
      
      <View className="flex-row gap-3 mb-10">
        <Pressable
          onPress={() => router.push('/tracker')}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-3xl items-center shadow-sm active:opacity-95"
        >
          <View className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-2xl mb-2.5">
            <Ionicons name="scale" size={24} color="#06B6D4" />
          </View>
          <Text className="text-slate-900 dark:text-white font-bold text-xs">Catat BB</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/food')}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-3xl items-center shadow-sm active:opacity-95"
        >
          <View className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-2xl mb-2.5">
            <Ionicons name="restaurant" size={24} color="#F59E0B" />
          </View>
          <Text className="text-slate-900 dark:text-white font-bold text-xs">Checklist Makan</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/settings')}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-3xl items-center shadow-sm active:opacity-95"
        >
          <View className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-2xl mb-2.5">
            <Ionicons name="alarm" size={24} color="#8B5CF6" />
          </View>
          <Text className="text-slate-900 dark:text-white font-bold text-xs">Atur Alarm</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
