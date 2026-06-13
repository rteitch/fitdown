import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Vibration, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppStore, WorkoutLog } from '@/store/useAppStore';
import { getWorkoutForWeek, getExerciseImage } from '@/constants/workoutProgram';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { Image } from 'expo-image';
import * as Location from 'expo-location';

export default function WorkoutTimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dayKey = params.day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  const dateStr = params.date as string;

  const currentWeek = useAppStore((state) => state.currentWeek);
  const addWorkoutLog = useAppStore((state) => state.addWorkoutLog);
  const updateDailyChecklist = useAppStore((state) => state.updateDailyChecklist);
  const incrementStreak = useAppStore((state) => state.incrementStreak);
  const workoutLogs = useAppStore((state) => state.workoutLogs);

  // Ambil data program latihan
  const weeklyProgram = getWorkoutForWeek(currentWeek);
  const session = weeklyProgram.sessions[dayKey];

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Text className="text-slate-500 dark:text-slate-400 font-medium">Sesi tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  const exercises = session.exercises;

  // State Timer
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // States & Refs Pelacakan GPS
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const lastCoordsRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const totalDistanceRef = useRef(0);

  const currentExercise = exercises[currentExerciseIndex];

  // Cari apakah latihan ini durasi atau rep
  const isDurationBased = currentExercise?.repsOrDuration.includes('detik');
  const durationSeconds = isDurationBased 
    ? parseInt(currentExercise.repsOrDuration.replace(/[^0-9]/g, '')) || 30 
    : 0;

  // Detik awal untuk timer (bisa sisa waktu istirahat atau sisa durasi gerakan)
  const [initialSeconds, setInitialSeconds] = useState(isDurationBased ? durationSeconds : 10);
  const { seconds, isRunning, start, pause, reset, progress } = useWorkoutTimer(initialSeconds);

  // Deteksi jika gerakan yang aktif mendukung pelacakan GPS (jalan kaki / lari)
  const lowercaseName = currentExercise?.name.toLowerCase() || '';
  const isGpsSupported = 
    (lowercaseName.includes('jalan') || 
     lowercaseName.includes('walk') || 
     lowercaseName.includes('run') || 
     lowercaseName.includes('jog') || 
     lowercaseName.includes('outdoor')) && 
    !lowercaseName.includes('jumping') && 
    !lowercaseName.includes('stationary');

  // Request perizinan lokasi di awal jika sesi ini memiliki aktivitas jalan/lari
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'web') return;
      
      const hasAnyGpsExercise = exercises.some((e) => {
        const nameLower = e.name.toLowerCase();
        return (nameLower.includes('jalan') || nameLower.includes('walk') || nameLower.includes('run') || nameLower.includes('jog') || nameLower.includes('outdoor')) && 
               !nameLower.includes('jumping') && 
               !nameLower.includes('stationary');
      });
      
      if (hasAnyGpsExercise) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Izin lokasi ditolak');
          }
        } catch (e) {
          console.warn('Gagal meminta izin lokasi:', e);
        }
      }
    };
    
    requestPermission();
  }, [exercises]);

  // Formula Haversine untuk kalkulasi jarak koordinat bumi
  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius bumi (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Hasil dalam km
  };

  // Efek Pelacakan Lokasi secara Real-Time
  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      if (Platform.OS === 'web') return;
      
      if (isGpsSupported && isRunning && !isResting) {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status !== 'granted') return;
          
          if (!isMounted) return;
          
          const sub = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 3000,
              distanceInterval: 5,
            },
            (loc) => {
              if (!isMounted) return;
              const { latitude, longitude, speed } = loc.coords;
              
              // Kecepatan dalam km/jam (speed m/s * 3.6)
              const speedKmH = speed ? Math.max(0, speed * 3.6) : 0;
              setCurrentSpeed(speedKmH);
              
              if (lastCoordsRef.current) {
                const dist = getHaversineDistance(
                  lastCoordsRef.current.latitude,
                  lastCoordsRef.current.longitude,
                  latitude,
                  longitude
                );
                
                // Abaikan noise kecil atau lompatan lokasi GPS yang tidak logis (> 200 meter per 3 detik)
                if (dist > 0.001 && dist < 0.2) {
                  totalDistanceRef.current += dist;
                  setDistance(totalDistanceRef.current);
                }
              }
              
              lastCoordsRef.current = { latitude, longitude };
            }
          );

          if (!isMounted) {
            sub.remove();
          } else {
            subscription = sub;
          }
        } catch (e) {
          console.warn('Gagal watchPosition GPS:', e);
        }
      }
    };

    startTracking();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
      lastCoordsRef.current = null; // Reset baseline koordinat saat jeda timer
    };
  }, [isGpsSupported, isRunning, isResting]);

  // Jalankan timer jika bertipe durasi atau sedang istirahat
  useEffect(() => {
    if (isResting) {
      setInitialSeconds(currentExercise.restSeconds);
      reset(currentExercise.restSeconds);
      start();
    } else if (isDurationBased) {
      setInitialSeconds(durationSeconds);
      reset(durationSeconds);
      start();
    } else {
      // Rep-based: Timer tidak otomatis jalan, tunggu user klik Selesai
      pause();
    }
  }, [currentExerciseIndex, currentSet, isResting]);

  // Efek ketika timer habis (detik === 0)
  useEffect(() => {
    if (seconds === 0 && isRunning) {
      Vibration.vibrate(300);
      handleStateTransition();
    }
  }, [seconds, isRunning]);

  // Transisi Alur Timer
  const handleStateTransition = () => {
    if (isResting) {
      // Selesai istirahat -> Masuk ke latihan set berikutnya atau gerakan berikutnya
      proceedToNextStep();
    } else {
      // Selesai latihan set -> Masuk ke istirahat jika restSeconds > 0
      const hasMoreSets = currentSet < currentExercise.sets;
      const hasMoreExercises = currentExerciseIndex < exercises.length - 1;

      if (currentExercise.restSeconds > 0 && (hasMoreSets || hasMoreExercises)) {
        setIsResting(true);
      } else {
        // Jika tidak ada restSeconds, langsung lanjut set / gerakan berikutnya
        proceedToNextStep();
      }
    }
  };

  const proceedToNextStep = () => {
    const hasMoreSets = currentSet < currentExercise.sets;
    const hasMoreExercises = currentExerciseIndex < exercises.length - 1;

    if (hasMoreSets) {
      setCurrentSet(currentSet + 1);
      setIsResting(false);
    } else if (hasMoreExercises) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      // Latihan selesai!
      handleFinishWorkout();
    }
  };

  // Simpan hasil latihan
  const handleFinishWorkout = () => {
    setIsSessionFinished(true);
    pause();

    const logId = Math.random().toString(36).substring(7);
    const newLog: WorkoutLog = {
      id: logId,
      date: dateStr,
      sessionId: `${currentWeek}_${dayKey}`,
      completedExercises: exercises.map((e) => e.id),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      finished: true,
      distanceKm: totalDistanceRef.current > 0 ? parseFloat(totalDistanceRef.current.toFixed(2)) : undefined,
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
  };

  // Tombol skip / paksa selesai set
  const handleSkipOrComplete = () => {
    Vibration.vibrate(80);
    if (isResting) {
      setIsResting(false);
    } else {
      handleStateTransition();
    }
  };

  if (isSessionFinished) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 px-6 justify-center items-center">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="bg-emerald-500/10 dark:bg-emerald-500/20 p-6 rounded-full mb-6">
          <Ionicons name="trophy" size={64} color="#10B981" />
        </View>
        <Text className="text-3xl font-black text-slate-900 dark:text-white text-center">Kerja Bagus! 🎉</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm text-center mt-3 px-4 leading-relaxed">
          Sesi latihan **{session.title}** telah selesai. Anda selangkah lebih dekat dengan target penurunan berat badan Anda!
        </Text>

        <Pressable
          onPress={() => router.dismiss(2)}
          className="bg-emerald-500 rounded-3xl py-4 px-12 items-center justify-center mt-10 shadow-md shadow-emerald-500/20 active:opacity-90 w-full"
        >
          <Text className="text-white font-extrabold text-base">Kembali ke Latihan</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Cari informasi gerakan berikutnya jika sedang istirahat
  const nextExercise = isResting
    ? (currentSet < currentExercise.sets 
        ? currentExercise 
        : exercises[currentExerciseIndex + 1])
    : null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 justify-between py-6 px-6">
      <Stack.Screen options={{ headerShown: true, title: 'Timer Latihan', headerBackTitle: 'Batal' }} />

      {/* Header Info Gerakan */}
      <View className="items-center mt-4">
        <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {isResting ? 'Waktu Istirahat' : `Gerakan ${currentExerciseIndex + 1} dari ${exercises.length}`}
        </Text>
        <Text className="text-2xl font-black text-slate-900 dark:text-white text-center mt-1.5 px-4 leading-tight">
          {isResting ? 'Istirahat Sejenak' : currentExercise.name}
        </Text>
        <Text className="text-sm font-bold text-emerald-500 mt-2 bg-emerald-500/10 dark:bg-emerald-500/15 px-3.5 py-1.5 rounded-full">
          Set {currentSet} dari {currentExercise.sets}
        </Text>
      </View>

      {/* Konten Utama: Timer/Reps */}
      <View className="items-center my-6 flex-1 justify-center gap-6">
        {isResting || isDurationBased ? (
          // Sesi Durasi: Tampilkan Lingkaran Countdown
          <View className="w-44 h-44 rounded-full border-8 border-slate-100 dark:border-slate-800 items-center justify-center relative bg-white dark:bg-slate-900 shadow-sm shadow-slate-100/50 dark:shadow-none">
            <Text className="text-5xl font-black text-slate-900 dark:text-white">
              {seconds}
            </Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">detik</Text>
          </View>
        ) : (
          // Sesi Reps: Tampilkan Angka Repetisi
          <View className="items-center">
            <Text className="text-6xl font-black text-emerald-500">
              {currentExercise.repsOrDuration}
            </Text>
            <Text className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2 text-center px-8">
              Lakukan gerakan dengan perlahan dan kontrol yang baik.
            </Text>
          </View>
        )}

        {/* Gambar Panduan Gerakan */}
        <Card className="p-3 w-56 h-36 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 justify-center items-center shadow-none rounded-2xl">
          <Image
            source={getExerciseImage(isResting && nextExercise ? nextExercise.name : currentExercise.name)}
            className="w-full h-full"
            contentFit="contain"
          />
        </Card>

        {/* Panel GPS Tracking */}
        {isGpsSupported && !isResting && (
          <View className="flex-row gap-4 w-full px-4 mt-2 justify-center">
            <Card className="flex-1 p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 items-center rounded-2xl shadow-none">
              <View className="flex-row items-center gap-1">
                <Ionicons name="map-outline" size={14} color="#10B981" />
                <Text className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Jarak</Text>
              </View>
              <Text className="text-lg font-black text-slate-800 dark:text-white mt-1">
                {distance.toFixed(2)} <Text className="text-[10px] font-bold text-slate-400">km</Text>
              </Text>
            </Card>
            <Card className="flex-1 p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 items-center rounded-2xl shadow-none">
              <View className="flex-row items-center gap-1">
                <Ionicons name="speedometer-outline" size={14} color="#10B981" />
                <Text className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kecepatan</Text>
              </View>
              <Text className="text-lg font-black text-slate-800 dark:text-white mt-1">
                {currentSpeed.toFixed(1)} <Text className="text-[10px] font-bold text-slate-400">km/h</Text>
              </Text>
            </Card>
          </View>
        )}
      </View>

      {/* Footer & Controls */}
      <View className="mb-6">
        {/* Progress bar sesi keseluruhan */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-slate-400">Total Progres Sesi</Text>
            <Text className="text-xs font-bold text-slate-400">
              {Math.round(((currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / exercises.length) * 100)}%
            </Text>
          </View>
          <ProgressBar
            progress={(currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / exercises.length}
            height={6}
            activeColor="bg-emerald-500"
          />
        </View>

        {/* Gerakan Berikutnya Hint */}
        {isResting && nextExercise && (
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-3xl mb-6 flex-row items-center gap-3">
            <View className="bg-emerald-500/10 p-2 rounded-2xl">
              <Ionicons name="arrow-forward" size={18} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Selanjutnya:</Text>
              <Text className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{nextExercise.name}</Text>
            </View>
          </View>
        )}

        {/* Tombol Kontrol */}
        <View className="flex-row justify-center items-center gap-6">
          {(isResting || isDurationBased) && (
            <Pressable
              onPress={isRunning ? pause : start}
              className={`w-14 h-14 rounded-full items-center justify-center border ${
                isRunning 
                  ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' 
                  : 'bg-emerald-500 border-emerald-500'
              }`}
            >
              <Ionicons 
                name={isRunning ? 'pause' : 'play'} 
                size={22} 
                color={isRunning ? '#475569' : 'white'} 
              />
            </Pressable>
          )}

          <Pressable
            onPress={handleSkipOrComplete}
            className="flex-1 bg-emerald-500 rounded-3xl py-4.5 items-center justify-center flex-row shadow-sm shadow-emerald-500/10 active:opacity-90"
          >
            <Ionicons name={isResting ? 'play-forward' : 'checkmark-done'} size={20} color="white" />
            <Text className="text-white font-extrabold ml-2 text-base">
              {isResting ? 'Lewati Istirahat' : (isDurationBased ? 'Lewati Gerakan' : 'Selesai Set')}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
