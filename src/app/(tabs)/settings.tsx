import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore, AlarmConfig } from '@/store/useAppStore';
import { syncAlarmsWithNotifications, cancelAllAlarms } from '@/utils/notificationHelper';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const router = useRouter();
  const userProfile = useAppStore((state) => state.userProfile);
  const alarms = useAppStore((state) => state.alarms);
  const updateAlarm = useAppStore((state) => state.updateAlarm);
  const resetAppStore = useAppStore((state) => state.resetAppStore);

  // Modal State untuk Time Picker
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<AlarmConfig | null>(null);
  const [hour, setHour] = useState('05');
  const [minute, setMinute] = useState('30');

  if (!userProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Text className="text-slate-500 dark:text-slate-400 font-medium">Memuat data...</Text>
      </View>
    );
  }

  // Handle Toggle Switch Alarm
  const handleToggleAlarm = async (id: string, currentValue: boolean) => {
    const updatedEnabled = !currentValue;
    updateAlarm(id, { enabled: updatedEnabled });
    
    // Sinkronisasikan ke expo-notifications setelah state terupdate
    // Gunakan timeout kecil agar Zustand state selesai diupdate terlebih dahulu
    setTimeout(async () => {
      const latestAlarms = useAppStore.getState().alarms;
      await syncAlarmsWithNotifications(latestAlarms);
    }, 50);
  };

  // Buka Modal Edit Waktu Alarm
  const handleOpenTimePicker = (alarm: AlarmConfig) => {
    setEditingAlarm(alarm);
    const [h, m] = alarm.time.split(':');
    setHour(h);
    setMinute(m);
    setModalVisible(true);
  };

  // Simpan Perubahan Waktu Alarm
  const handleSaveTime = async () => {
    if (!editingAlarm) return;

    // Bersihkan input jam & menit
    let cleanHour = parseInt(hour) || 0;
    let cleanMin = parseInt(minute) || 0;

    // Batasi jam (0-23) & menit (0-59)
    cleanHour = Math.max(0, Math.min(23, cleanHour));
    cleanMin = Math.max(0, Math.min(59, cleanMin));

    const formattedTime = `${cleanHour.toString().padStart(2, '0')}:${cleanMin.toString().padStart(2, '0')}`;

    // Update di store (otomatis aktifkan jika diubah waktunya)
    updateAlarm(editingAlarm.id, { time: formattedTime, enabled: true });
    
    setModalVisible(false);
    setEditingAlarm(null);

    // Sinkronisasikan ke expo-notifications
    setTimeout(async () => {
      const latestAlarms = useAppStore.getState().alarms;
      await syncAlarmsWithNotifications(latestAlarms);
    }, 50);
  };

  // Reset Aplikasi
  const handleResetApp = async () => {
    await cancelAllAlarms();
    resetAppStore();
    router.replace('/onboarding');
  };

  // Menentukan Ikon berdasarkan Tipe Alarm
  const getAlarmIcon = (type: string) => {
    switch (type) {
      case 'wakeup': return 'sunny-outline';
      case 'workout': return 'fitness-outline';
      case 'meal': return 'restaurant-outline';
      case 'sleep': return 'moon-outline';
      default: return 'alarm-outline';
    }
  };

  // Menentukan Warna Ikon
  const getAlarmIconColor = (type: string) => {
    switch (type) {
      case 'wakeup': return 'text-amber-500 bg-amber-500/10';
      case 'workout': return 'text-emerald-500 bg-emerald-500/10';
      case 'meal': return 'text-orange-500 bg-orange-500/10';
      case 'sleep': return 'text-indigo-500 bg-indigo-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  // Mengubah Jam/Menit dengan tombol +/-
  const adjustTime = (type: 'hour' | 'minute', amount: number) => {
    if (type === 'hour') {
      let current = parseInt(hour) || 0;
      let next = (current + amount + 24) % 24;
      setHour(next.toString().padStart(2, '0'));
    } else {
      let current = parseInt(minute) || 0;
      let next = (current + amount + 60) % 60;
      setMinute(next.toString().padStart(2, '0'));
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950 px-5 py-4" showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />

      {/* Profil Ringkas */}
      <Card className="mb-6 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex-row items-center gap-4">
        <View className="bg-emerald-500/10 p-3.5 rounded-full">
          <Ionicons name="person" size={28} color="#10B981" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-black text-slate-900 dark:text-white">{userProfile.name}</Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Target: {userProfile.startWeightKg} kg → {userProfile.targetWeightKg} kg
          </Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Latihan: {userProfile.workoutPreference === 'morning' ? 'Pagi (05:30)' : 'Sore (16:00)'}
          </Text>
        </View>
      </Card>

      {/* Daftar Alarm */}
      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 pl-1">Jadwal Alarm Rutinitas</Text>

      <View className="gap-3 mb-8">
        {alarms.map((alarm) => {
          const iconColorClass = getAlarmIconColor(alarm.type);
          return (
            <Card key={alarm.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm p-4">
              <View className="flex-row justify-between items-center">
                <Pressable 
                  onPress={() => handleOpenTimePicker(alarm)}
                  className="flex-row items-center flex-1"
                >
                  <View className={`p-2.5 rounded-2xl ${iconColorClass}`}>
                    <Ionicons 
                      name={getAlarmIcon(alarm.type)} 
                      size={20} 
                      color={
                        alarm.type === 'workout' ? '#10B981' : 
                        alarm.type === 'wakeup' ? '#F59E0B' :
                        alarm.type === 'meal' ? '#F97316' : '#6366F1'
                      } 
                    />
                  </View>
                  
                  <View className="ml-3.5">
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500">{alarm.label}</Text>
                    <Text className="text-2xl font-black text-slate-800 dark:text-white mt-1">{alarm.time}</Text>
                  </View>
                </Pressable>

                <Switch
                  value={alarm.enabled}
                  onValueChange={() => handleToggleAlarm(alarm.id, alarm.enabled)}
                  trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
                  thumbColor={alarm.enabled ? '#10B981' : '#94A3B8'}
                />
              </View>
            </Card>
          );
        })}
      </View>

      {/* Bahaya / Reset */}
      <Pressable
        onPress={handleResetApp}
        className="bg-red-500 rounded-3xl py-4 items-center justify-center flex-row shadow-sm shadow-red-500/10 active:opacity-90 mb-10"
      >
        <Ionicons name="refresh" size={18} color="white" />
        <Text className="text-white font-extrabold ml-2 text-base">Reset Aplikasi & Profil</Text>
      </Pressable>

      {/* Modal Time Picker Kustom */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <Text className="text-lg font-black text-slate-900 dark:text-white text-center mb-5">
              Edit Waktu: {editingAlarm?.label}
            </Text>

            {/* Time Selector Controls */}
            <View className="flex-row justify-center items-center gap-6 mb-6">
              {/* Hour Control */}
              <View className="items-center">
                <Pressable onPress={() => adjustTime('hour', 1)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mb-2 active:bg-slate-100">
                  <Ionicons name="chevron-up" size={24} color="#10B981" />
                </Pressable>
                <TextInput
                  value={hour}
                  onChangeText={(val) => setHour(val.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  className="text-4xl font-black text-slate-900 dark:text-white text-center w-16 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl"
                  maxLength={2}
                />
                <Pressable onPress={() => adjustTime('hour', -1)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2 active:bg-slate-100">
                  <Ionicons name="chevron-down" size={24} color="#10B981" />
                </Pressable>
              </View>

              <Text className="text-4xl font-black text-slate-400">:</Text>

              {/* Minute Control */}
              <View className="items-center">
                <Pressable onPress={() => adjustTime('minute', 5)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mb-2 active:bg-slate-100">
                  <Ionicons name="chevron-up" size={24} color="#10B981" />
                </Pressable>
                <TextInput
                  value={minute}
                  onChangeText={(val) => setMinute(val.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="numeric"
                  className="text-4xl font-black text-slate-900 dark:text-white text-center w-16 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl"
                  maxLength={2}
                />
                <Pressable onPress={() => adjustTime('minute', -5)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2 active:bg-slate-100">
                  <Ionicons name="chevron-down" size={24} color="#10B981" />
                </Pressable>
              </View>
            </View>

            {/* Modal Actions */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 py-3.5 rounded-2xl items-center active:bg-slate-200"
              >
                <Text className="text-slate-600 dark:text-slate-350 font-bold">Batal</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveTime}
                className="flex-1 bg-emerald-500 py-3.5 rounded-2xl items-center active:opacity-90"
              >
                <Text className="text-white font-extrabold">Simpan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
