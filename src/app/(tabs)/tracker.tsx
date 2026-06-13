import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useAppStore, WeightEntry } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { WeightChart } from '@/components/tracker/WeightChart';
import { MilestoneCard } from '@/components/tracker/MilestoneCard';
import { formatFriendlyDate } from '@/utils/dateHelper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StatsCard } from '@/components/ui/StatsCard';

export default function TrackerTab() {
  const userProfile = useAppStore((state) => state.userProfile);
  const weightEntries = useAppStore((state) => state.weightEntries);
  const addWeightEntry = useAppStore((state) => state.addWeightEntry);
  const deleteWeightEntry = useAppStore((state) => state.deleteWeightEntry);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [error, setError] = useState('');

  if (!userProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Text className="text-slate-500 dark:text-slate-400 font-medium">Memuat data...</Text>
      </View>
    );
  }

  // Cari berat badan saat ini (entri terbaru)
  const latestEntry = weightEntries[weightEntries.length - 1];
  const currentWeight = latestEntry ? latestEntry.weightKg : userProfile.startWeightKg;
  
  // Hitung total penurunan berat badan
  const totalLost = userProfile.startWeightKg - currentWeight;

  // Buka modal input berat badan
  const handleOpenModal = () => {
    setWeightInput(currentWeight.toString());
    setNoteInput('');
    setError('');
    setModalVisible(true);
  };

  // Simpan catatan berat badan baru
  const handleSaveWeight = () => {
    setError('');
    const parsedWeight = parseFloat(weightInput);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Masukkan angka berat badan yang valid.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: WeightEntry = {
      id: Math.random().toString(36).substring(7),
      date: todayStr,
      weightKg: parsedWeight,
      note: noteInput.trim() || undefined,
    };

    addWeightEntry(newEntry);
    setModalVisible(false);
  };

  // Hitung perbedaan dengan timbangan sebelumnya
  const getWeightDifference = (index: number) => {
    if (index === 0) {
      // Dibandingkan dengan berat badan awal onboarding
      const diff = weightEntries[index].weightKg - userProfile.startWeightKg;
      return diff;
    }
    const diff = weightEntries[index].weightKg - weightEntries[index - 1].weightKg;
    return diff;
  };

  // Urutkan entri dari yang terbaru untuk riwayat di bawah
  const sortedEntries = [...weightEntries].reverse();

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950 px-5 py-4" showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />

      {/* Ringkasan Header */}
      <View className="flex-row gap-3 mb-5 mt-2">
        <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Berat Badan Saat Ini</Text>
          <View className="flex-row items-baseline mt-1">
            <Text className="text-2xl font-black text-slate-800 dark:text-white">{currentWeight}</Text>
            <Text className="text-xs font-bold text-slate-400 ml-1">kg</Text>
          </View>
        </Card>

        <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Penurunan</Text>
          <View className="flex-row items-baseline mt-1">
            <Text className={`text-2xl font-black ${totalLost >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalLost >= 0 ? `-${totalLost.toFixed(1)}` : `+${Math.abs(totalLost).toFixed(1)}`}
            </Text>
            <Text className="text-xs font-bold text-slate-400 ml-1">kg</Text>
          </View>
        </Card>
      </View>

      {/* Ringkasan Konsistensi Mingguan */}
      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pl-1">Ringkasan Konsistensi Mingguan</Text>
      <StatsCard />

      {/* Tombol Catat Berat Badan */}
      <Pressable
        onPress={handleOpenModal}
        className="bg-emerald-500 rounded-3xl py-4 items-center justify-center flex-row shadow-sm shadow-emerald-500/10 active:opacity-90 mb-6"
      >
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white font-extrabold ml-1.5 text-base">Catat Berat Badan</Text>
      </Pressable>

      {/* Grafik Berat Badan */}
      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pl-1">Tren Penurunan Berat Badan</Text>
      <Card className="mb-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm p-4 overflow-hidden">
        <WeightChart entries={weightEntries} targetWeight={userProfile.targetWeightKg} />
      </Card>

      {/* Milestone Badges */}
      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 pl-1">Lencana Pencapaian (Milestones)</Text>
      <MilestoneCard 
        startWeight={userProfile.startWeightKg} 
        targetWeight={userProfile.targetWeightKg} 
        currentWeight={currentWeight} 
        entries={weightEntries} 
      />

      {/* Riwayat Berat Badan */}
      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 pl-1">Riwayat Timbangan</Text>
      
      <View className="gap-3 mb-10">
        {sortedEntries.length === 0 ? (
          <Card className="items-center py-6 border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
            <Text className="text-slate-400">Belum ada riwayat timbangan berat badan.</Text>
          </Card>
        ) : (
          sortedEntries.map((entry, index) => {
            // Urutan asli index untuk hitung selisih
            const originalIndex = weightEntries.length - 1 - index;
            const diff = getWeightDifference(originalIndex);
            
            return (
              <Card key={entry.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 flex-row justify-between items-center shadow-sm">
                <View className="flex-row items-center">
                  <View className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl">
                    <Ionicons name="scale-outline" size={20} color="#10B981" />
                  </View>
                  <View className="ml-3.5">
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500">{formatFriendlyDate(entry.date)}</Text>
                    <Text className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{entry.weightKg} kg</Text>
                    {entry.note ? (
                      <Text className="text-[10px] text-slate-400 italic mt-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg">
                        "{entry.note}"
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  {/* Status Selisih */}
                  <View className={`px-2.5 py-1 rounded-full ${
                    diff < 0 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20' 
                      : diff > 0 
                        ? 'bg-red-50 dark:bg-red-950/20' 
                        : 'bg-slate-50 dark:bg-slate-850'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      diff < 0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : diff > 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-slate-500'
                    }`}>
                      {diff < 0 ? `${diff.toFixed(1)} kg` : diff > 0 ? `+${diff.toFixed(1)} kg` : '0.0 kg'}
                    </Text>
                  </View>

                  {/* Tombol Hapus (Jangan izinkan hapus data onboarding berat badan pertama) */}
                  {entry.id !== `w_start_${userProfile.id}` && (
                    <Pressable
                      onPress={() => deleteWeightEntry(entry.id)}
                      className="p-2 bg-red-500/10 dark:bg-red-500/15 rounded-xl active:bg-red-500/20"
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </Pressable>
                  )}
                </View>
              </Card>
            );
          })
        )}
      </View>

      {/* Modal Input Berat Badan */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <Text className="text-lg font-black text-slate-900 dark:text-white text-center mb-4">
              Catat Berat Badan Baru
            </Text>

            {error ? (
              <View className="bg-red-50 border border-red-200 p-3 rounded-2xl mb-4">
                <Text className="text-xs text-red-650 font-bold text-center">{error}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Berat (kg)</Text>
              <TextInput
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="numeric"
                placeholder="103.0"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-extrabold text-2xl text-center"
                autoFocus={true}
              />
            </View>

            <View className="mb-6">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catatan Ringkas (Opsional)</Text>
              <TextInput
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="Misal: Timbang pagi hari setelah buang air"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-medium text-sm"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 py-3.5 rounded-2xl items-center active:bg-slate-200"
              >
                <Text className="text-slate-600 dark:text-slate-350 font-bold">Batal</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveWeight}
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
