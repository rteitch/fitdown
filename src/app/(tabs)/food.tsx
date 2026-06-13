import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useAppStore, FoodItem, MealLog, DEFAULT_FOOD_ITEMS } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { formatFriendlyDate } from '@/utils/dateHelper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function FoodTab() {
  const todayStr = new Date().toISOString().split('T')[0];
  const mealLogs = useAppStore((state) => state.mealLogs);
  const updateMealLog = useAppStore((state) => state.updateMealLog);
  const updateDailyChecklist = useAppStore((state) => state.updateDailyChecklist);

  const currentLog = mealLogs[todayStr] || {
    id: todayStr,
    date: todayStr,
    breakfast: { items: DEFAULT_FOOD_ITEMS.breakfast, completedItemIds: [] },
    lunch: { items: DEFAULT_FOOD_ITEMS.lunch, completedItemIds: [] },
    dinner: { items: DEFAULT_FOOD_ITEMS.dinner, completedItemIds: [] },
    snack: { items: DEFAULT_FOOD_ITEMS.snack, completedItemIds: [] },
    waterGlasses: 0,
  };

  const handleToggleFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', itemId: string) => {
    const mealEntry = currentLog[mealType];
    let updatedCompletedIds = [...mealEntry.completedItemIds];

    if (updatedCompletedIds.includes(itemId)) {
      updatedCompletedIds = updatedCompletedIds.filter((id) => id !== itemId);
    } else {
      updatedCompletedIds.push(itemId);
    }

    // Update log makanan
    const updatedMealLog = {
      ...currentLog,
      [mealType]: {
        ...mealEntry,
        items: DEFAULT_FOOD_ITEMS[mealType], // pastikan item terisi
        completedItemIds: updatedCompletedIds,
      },
    };

    updateMealLog(todayStr, updatedMealLog);

    // Update checklist harian jika semua item di waktu makan itu selesai
    const isMealFinished = updatedCompletedIds.length === DEFAULT_FOOD_ITEMS[mealType].length;
    updateDailyChecklist(todayStr, {
      meals: {
        ...useAppStore.getState().dailyChecklists[todayStr]?.meals,
        [mealType]: isMealFinished,
      } as any,
    });
  };

  const handleAdjustWater = (amount: number) => {
    const nextWater = Math.max(0, Math.min(15, currentLog.waterGlasses + amount));
    updateMealLog(todayStr, { waterGlasses: nextWater });

    // Update daily checklist jika air >= 8 gelas
    updateDailyChecklist(todayStr, {
      meals: {
        ...useAppStore.getState().dailyChecklists[todayStr]?.meals,
        water8Glasses: nextWater >= 8,
      } as any,
    });
  };

  // Render Bagian Waktu Makan
  const renderMealSection = (
    title: string,
    key: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    icon: string,
    iconColor: string
  ) => {
    const meal = currentLog[key];
    const items = DEFAULT_FOOD_ITEMS[key];
    const completedIds = meal?.completedItemIds || [];

    return (
      <Card className="mb-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm p-5">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <View className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-950`}>
              <Ionicons name={icon as any} size={18} color={iconColor} />
            </View>
            <Text className="text-base font-extrabold text-slate-900 dark:text-white">{title}</Text>
          </View>
          <Text className="text-xs font-bold text-slate-400">
            {completedIds.length}/{items.length} selesai
          </Text>
        </View>

        <View className="gap-2.5 mt-2">
          {items.map((item) => {
            const isChecked = completedIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => handleToggleFood(key, item.id)}
                className={`flex-row items-center p-3 rounded-2xl border ${
                  isChecked 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-100 dark:border-slate-850'
                }`}
              >
                <View 
                  className={`w-5 h-5 rounded-md border items-center justify-center ${
                    isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-355 bg-white dark:bg-slate-900'
                  }`}
                >
                  {isChecked && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <View className="flex-1 ml-3 pr-2">
                  <Text className={`text-sm font-extrabold ${isChecked ? 'text-slate-400 dark:text-slate-505 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.name}
                  </Text>
                  <Text className="text-xs text-slate-400 mt-0.5">{item.portion}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950 px-5 py-4" showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />

      {/* Header Info Hari */}
      <View className="mb-6 mt-2">
        <Text className="text-xs font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Pencatatan Makan & Minum</Text>
        <Text className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatFriendlyDate(todayStr)}</Text>
      </View>

      {/* Tracker Air Putih */}
      <Card className="mb-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm p-5">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <View className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/20">
              <Ionicons name="water" size={18} color="#06B6D4" />
            </View>
            <View>
              <Text className="text-base font-extrabold text-slate-900 dark:text-white">Pelacak Air Putih</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Target harian: 8 gelas (2 liter)</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable 
              onPress={() => handleAdjustWater(-1)}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 items-center justify-center border border-slate-100 dark:border-slate-850 active:bg-slate-100"
            >
              <Ionicons name="remove" size={18} color="#64748B" />
            </Pressable>
            <Text className="text-2xl font-black text-slate-900 dark:text-white w-8 text-center">{currentLog.waterGlasses}</Text>
            <Pressable 
              onPress={() => handleAdjustWater(1)}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 items-center justify-center border border-slate-100 dark:border-slate-850 active:bg-slate-100"
            >
              <Ionicons name="add" size={18} color="#06B6D4" />
            </Pressable>
          </View>
        </View>

        {/* Visualisasi Gelas Air */}
        <View className="flex-row flex-wrap gap-2.5 justify-center py-2 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100/50 dark:border-slate-850">
          {Array.from({ length: 8 }).map((_, index) => {
            const isDrunk = index < currentLog.waterGlasses;
            return (
              <View key={index} className="items-center p-1">
                <Ionicons 
                  name={isDrunk ? "water" : "water-outline"} 
                  size={26} 
                  color={isDrunk ? "#06B6D4" : "#94A3B8"} 
                />
                <Text className="text-[9px] font-bold text-slate-400 mt-1">Gelas {index + 1}</Text>
              </View>
            );
          })}
          {currentLog.waterGlasses > 8 && (
            <View className="w-full items-center mt-1">
              <Text className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400">
                Luar biasa! +{currentLog.waterGlasses - 8} gelas tambahan tercatat
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Sections Waktu Makan */}
      {renderMealSection('Sarapan Pagi', 'breakfast', 'sunny', '#F59E0B')}
      {renderMealSection('Makan Siang', 'lunch', 'restaurant', '#10B981')}
      {renderMealSection('Camilan Sore', 'snack', 'cafe', '#D97706')}
      {renderMealSection('Makan Malam', 'dinner', 'moon', '#6366F1')}

      {/* Catatan Larangan Diet */}
      <Card className="mb-10 bg-red-500/5 dark:bg-red-500/10 border-red-500/10 dark:border-red-950/30 p-5 rounded-3xl">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="warning-outline" size={20} color="#EF4444" />
          <Text className="text-sm font-black text-red-600 dark:text-red-400">Pantangan Utama Penurunan Berat</Text>
        </View>
        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">
          • **Es Teh Manis & Minuman Gula**: Memiliki kalori cair yang sangat tinggi dan langsung menghentikan proses pembakaran lemak.
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">
          • **Gorengan Berminyak**: Mengandung lemak trans yang tinggi kalori dan memicu peradangan otot/sendi.
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          • **Makan Berat Setelah Jam 20.00**: Tubuh tidak sempat membakar kalori sebelum tidur, sehingga sisa energi langsung disimpan menjadi lemak tubuh saat istirahat.
        </Text>
      </Card>
    </ScrollView>
  );
}
