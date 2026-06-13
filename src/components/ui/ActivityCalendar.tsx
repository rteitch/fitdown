import React, { useState } from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { getWorkoutForWeek } from '@/constants/workoutProgram';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  getDay, 
  differenceInCalendarDays,
  parseISO,
  isBefore,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

export function ActivityCalendar() {
  const colorScheme = useColorScheme() || 'light';
  const userProfile = useAppStore((state) => state.userProfile);
  const workoutLogs = useAppStore((state) => state.workoutLogs);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  if (!userProfile) return null;

  const createdAt = parseISO(userProfile.createdAt);
  const today = new Date();

  // Handler Ganti Bulan
  const handlePrevMonth = () => {
    setCurrentMonthDate(subMonths(currentMonthDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(addMonths(currentMonthDate, 1));
  };

  // Generate Hari di Bulan Ini
  const startOfCurrMonth = startOfMonth(currentMonthDate);
  const endOfCurrMonth = endOfMonth(currentMonthDate);
  const daysInMonth = eachDayOfInterval({ start: startOfCurrMonth, end: endOfCurrMonth });

  // Cari padding kosong untuk hari Senin di awal bulan (0=Sun, 1=Mon, ..., 6=Sat)
  // Kita ingin baris dimulai dari Senin (Monday starts).
  // getDay() mengembalikan 0 untuk Minggu, 1 untuk Senin, dst.
  const startDayIndex = (getDay(startOfCurrMonth) + 6) % 7; // Monday = 0, Sunday = 6

  // Nama Bulan Indo
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthTitle = `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;

  // Hitung status hari kalender
  const getDayStatus = (date: Date): 'success' | 'rest' | 'missed' | 'pending' | 'future' => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = isSameDay(date, today);
    const isPast = isBefore(date, today) && !isToday;

    // 1. Sukses jika ada log latihan yang selesai
    const hasFinishedLog = workoutLogs.some((l) => l.date === dateStr && l.finished);
    if (hasFinishedLog) return 'success';

    // 2. Jika hari di masa depan, statusnya netral/future
    if (!isPast && !isToday) return 'future';

    // 3. Cari nomor minggu dari tanggal pendaftaran user
    const diffDays = differenceInCalendarDays(date, createdAt);
    const weekNum = Math.floor(diffDays / 7) + 1;

    // Jika di luar rentang program 12 minggu
    if (weekNum < 1 || weekNum > 12) return 'rest';

    // Dapatkan sesi latihan hari itu
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const weekdayName = daysOfWeek[date.getDay()] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    
    const weeklyProgram = getWorkoutForWeek(weekNum);
    const session = weeklyProgram?.sessions[weekdayName];

    // Jika hari istirahat program
    if (!session || session.type === 'rest') return 'rest';

    // Jika hari latihan program, belum selesai, dan sudah lewat -> Missed
    if (isPast) return 'missed';

    // Jika hari latihan program, belum selesai, dan hari ini -> Pending
    return 'pending';
  };

  // Render Sel Hari
  const renderDayCell = (date: Date, index: number) => {
    const status = getDayStatus(date);
    const dateNum = format(date, 'd');
    const isToday = isSameDay(date, today);

    let bgClass = 'bg-slate-50 dark:bg-slate-950 border-transparent';
    let textClass = 'text-slate-700 dark:text-slate-350';

    if (status === 'success') {
      bgClass = 'bg-emerald-500 border-emerald-500';
      textClass = 'text-white font-bold';
    } else if (status === 'rest') {
      bgClass = 'bg-slate-100 dark:bg-slate-800 border-transparent';
      textClass = 'text-slate-400 dark:text-slate-500';
    } else if (status === 'missed') {
      bgClass = 'bg-red-500 border-red-500';
      textClass = 'text-white font-bold';
    } else if (status === 'pending') {
      bgClass = 'bg-blue-500/10 border-blue-500/30';
      textClass = 'text-blue-500 font-extrabold';
    }

    return (
      <View 
        key={`day-${index}`} 
        className={`w-[12%] aspect-square items-center justify-center rounded-2xl border ${bgClass} ${
          isToday && status !== 'success' && status !== 'missed' ? 'border-slate-400 dark:border-slate-500' : ''
        }`}
      >
        <Text className={`text-xs ${textClass}`}>{dateNum}</Text>
      </View>
    );
  };

  // Header nama hari
  const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm p-5 mb-6">
      {/* Month Navigation */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-black text-slate-800 dark:text-white">{monthTitle}</Text>
        <View className="flex-row gap-2">
          <Pressable onPress={handlePrevMonth} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 active:bg-slate-100">
            <Ionicons name="chevron-back" size={16} color="#64748B" />
          </Pressable>
          <Pressable onPress={handleNextMonth} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 active:bg-slate-100">
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </Pressable>
        </View>
      </View>

      {/* Days of week labels */}
      <View className="flex-row justify-between mb-2 px-1">
        {dayLabels.map((lbl, idx) => (
          <Text key={idx} className="w-[12%] text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {lbl}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-row flex-wrap gap-x-[2.6%] gap-y-2 justify-start px-1">
        {/* Render empty slots for padding */}
        {Array.from({ length: startDayIndex }).map((_, idx) => (
          <View key={`empty-${idx}`} className="w-[12%] aspect-square bg-transparent" />
        ))}

        {/* Render actual days */}
        {daysInMonth.map((day, idx) => renderDayCell(day, idx))}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center items-center gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-850">
        <View className="flex-row items-center">
          <View className="w-3.5 h-3.5 bg-emerald-500 rounded-md mr-1.5" />
          <Text className="text-[10px] font-bold text-slate-450 dark:text-slate-400">Selesai</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3.5 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md mr-1.5" />
          <Text className="text-[10px] font-bold text-slate-450 dark:text-slate-400">Istirahat</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3.5 h-3.5 bg-red-500 rounded-md mr-1.5" />
          <Text className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Terlewat</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3.5 h-3.5 bg-blue-500/20 border border-blue-550/30 rounded-md mr-1.5" />
          <Text className="text-[10px] font-bold text-slate-450 dark:text-slate-400">Jadwal</Text>
        </View>
      </View>
    </Card>
  );
}
