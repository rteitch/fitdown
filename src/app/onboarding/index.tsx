import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore, UserProfile, WeightEntry } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  const router = useRouter();
  const setUserProfile = useAppStore((state) => state.setUserProfile);
  const addWeightEntry = useAppStore((state) => state.addWeightEntry);

  // Form states with default target user values from PRD
  const [name, setName] = useState('Rizal');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('26');
  const [heightCm, setHeightCm] = useState('169');
  const [startWeightKg, setStartWeightKg] = useState('103');
  const [targetWeightKg, setTargetWeightKg] = useState('65');
  const [workStartTime, setWorkStartTime] = useState('07:00');
  const [workEndTime, setWorkEndTime] = useState('15:30');
  const [workoutPreference, setWorkoutPreference] = useState<'morning' | 'evening'>('morning');

  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');

    // Validations
    if (!name.trim()) return setError('Nama tidak boleh kosong.');
    const parsedAge = parseInt(age);
    const parsedHeight = parseFloat(heightCm);
    const parsedStartWeight = parseFloat(startWeightKg);
    const parsedTargetWeight = parseFloat(targetWeightKg);

    if (isNaN(parsedAge) || parsedAge <= 0) return setError('Umur harus angka valid.');
    if (isNaN(parsedHeight) || parsedHeight <= 0) return setError('Tinggi badan harus angka valid.');
    if (isNaN(parsedStartWeight) || parsedStartWeight <= 0) return setError('Berat badan saat ini harus angka valid.');
    if (isNaN(parsedTargetWeight) || parsedTargetWeight <= 0) return setError('Target berat badan harus angka valid.');

    const profileId = Math.random().toString(36).substring(7);
    const todayStr = new Date().toISOString().split('T')[0];

    const profile: UserProfile = {
      id: profileId,
      name: name.trim(),
      gender,
      age: parsedAge,
      heightCm: parsedHeight,
      startWeightKg: parsedStartWeight,
      targetWeightKg: parsedTargetWeight,
      workStartTime,
      workEndTime,
      workoutPreference,
      createdAt: new Date().toISOString(),
    };

    const initialWeight: WeightEntry = {
      id: `w_start_${profileId}`,
      date: todayStr,
      weightKg: parsedStartWeight,
      note: 'Berat awal saat onboarding',
    };

    // Save to global state
    setUserProfile(profile);
    addWeightEntry(initialWeight);

    // Redirect to Dashboard
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          <View className="mb-6 mt-4">
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Fit<Text className="text-emerald-500">Down</Text>
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Mari siapkan profil Anda untuk memulai rencana 12 minggu penurunan berat badan secara terstruktur.
            </Text>
          </View>

          {error ? (
            <View className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-4 mb-5">
              <Text className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</Text>
            </View>
          ) : null}

          {/* Section 1: Profil Personal */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profil Personal</Text>
            
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nama Panggilan</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nama Anda"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Jenis Kelamin</Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setGender('male')}
                  className={`flex-1 items-center justify-center py-3 rounded-2xl border ${
                    gender === 'male'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <Text className={`font-semibold ${gender === 'male' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Laki-laki</Text>
                </Pressable>
                <Pressable
                  onPress={() => setGender('female')}
                  className={`flex-1 items-center justify-center py-3 rounded-2xl border ${
                    gender === 'female'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <Text className={`font-semibold ${gender === 'female' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Perempuan</Text>
                </Pressable>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 mb-2">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Umur (tahun)</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="26"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium"
                />
              </View>
              <View className="flex-1 mb-2">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tinggi (cm)</Text>
                <TextInput
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                  placeholder="169"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium"
                />
              </View>
            </View>
          </View>

          {/* Section 2: Berat & Target */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Target Berat Badan</Text>
            
            <View className="flex-row gap-4">
              <View className="flex-1 mb-2">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Berat Saat Ini (kg)</Text>
                <TextInput
                  value={startWeightKg}
                  onChangeText={setStartWeightKg}
                  keyboardType="numeric"
                  placeholder="103"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium text-emerald-500 text-lg"
                />
              </View>
              <View className="flex-1 mb-2">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Target Akhir (kg)</Text>
                <TextInput
                  value={targetWeightKg}
                  onChangeText={setTargetWeightKg}
                  keyboardType="numeric"
                  placeholder="65"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium text-emerald-500 text-lg"
                />
              </View>
            </View>
            <Text className="text-xs text-slate-400 mt-2 leading-relaxed">
              Target awal penurunan berat badan didasarkan pada target realistis program 12 minggu (laju 0.5 - 1 kg per minggu).
            </Text>
          </View>

          {/* Section 3: Jadwal Kerja & Preferensi Latihan */}
          <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 mb-8 shadow-sm">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Jadwal & Preferensi</Text>
            
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Mulai Kerja</Text>
                <TextInput
                  value={workStartTime}
                  onChangeText={setWorkStartTime}
                  placeholder="07:00"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Selesai Kerja</Text>
                <TextInput
                  value={workEndTime}
                  onChangeText={setWorkEndTime}
                  placeholder="15:30"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-950 dark:text-white font-medium"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Preferensi Waktu Latihan</Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setWorkoutPreference('morning')}
                  className={`flex-1 items-center justify-center py-3 rounded-2xl border ${
                    workoutPreference === 'morning'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <Text className={`font-semibold ${workoutPreference === 'morning' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Pagi (05:30)</Text>
                </Pressable>
                <Pressable
                  onPress={() => setWorkoutPreference('evening')}
                  className={`flex-1 items-center justify-center py-3 rounded-2xl border ${
                    workoutPreference === 'evening'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <Text className={`font-semibold ${workoutPreference === 'evening' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Sore (16:00)</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            onPress={handleSave}
            className="bg-emerald-500 rounded-3xl py-4 items-center justify-center mb-12 shadow-md shadow-emerald-500/20 active:opacity-90"
          >
            <Text className="text-white text-base font-bold">Simpan & Mulai Rencana</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
