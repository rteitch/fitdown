import React from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { View, Text, useColorScheme } from 'react-native';
import { WeightEntry } from '@/store/useAppStore';
import { Colors } from '@/constants/colors';

interface WeightChartProps {
  entries: WeightEntry[];
  targetWeight: number;
}

export function WeightChart({ entries, targetWeight }: WeightChartProps) {
  const colorScheme = (useColorScheme() || 'light') as 'light' | 'dark';
  const themeColors = Colors[colorScheme];

  // Map data untuk LineChart
  const chartData = entries.map((e) => ({
    value: e.weightKg,
    label: e.date.slice(5), // Ambil "MM-DD" dari "YYYY-MM-DD"
    dataPointText: `${e.weightKg}`,
    labelTextStyle: { color: themeColors.textSecondary, fontSize: 10, fontWeight: '600' as any },
  }));

  // Jika tidak ada data
  if (entries.length === 0) {
    return (
      <View className="h-44 justify-center items-center">
        <Text className="text-slate-400 dark:text-slate-500 font-semibold text-sm">Tidak ada data berat badan.</Text>
      </View>
    );
  }

  // Tentukan nilai minimum dan maksimum Y agar grafik tidak terlalu kosong di batas atas/bawah
  const weights = entries.map((e) => e.weightKg);
  const maxWeight = Math.max(...weights, targetWeight);
  const minWeight = Math.min(...weights, targetWeight);
  
  // Padding Y axis agar visualisasi grafis seimbang
  const yAxisMax = Math.ceil(maxWeight + 3);
  const yAxisMin = Math.floor(Math.max(0, minWeight - 5));

  return (
    <View className="pr-4 py-2 mt-4 items-center justify-center">
      <LineChart
        data={chartData}
        height={180}
        spacing={entries.length > 5 ? 240 / entries.length : 50}
        color="#10B981"
        thickness={3}
        dataPointsColor="#10B981"
        dataPointsRadius={5}
        textColor={themeColors.text}
        textFontSize={10}
        textShiftY={-12}
        textShiftX={-4}
        yAxisColor="transparent"
        xAxisColor={themeColors.border}
        hideRules={false}
        rulesColor={colorScheme === 'dark' ? '#334155' : '#F1F5F9'}
        yAxisTextStyle={{ color: themeColors.textSecondary, fontSize: 10, fontWeight: '600' }}
        yAxisSide={0} // Kiri
        maxValue={yAxisMax}
        mostNegativeValue={yAxisMin}
        stepValue={Math.ceil((yAxisMax - yAxisMin) / 4)}
        noOfSections={4}
        showReferenceLine1
        referenceLine1Position={targetWeight}
        referenceLine1Config={{
          color: '#EF4444',
          thickness: 1.5,
          type: 'dashed',
          dashWidth: 4,
          dashGap: 4,
        }}
      />
      <View className="flex-row items-center justify-center mt-4 gap-2">
        <View className="w-6 h-0.5 bg-red-500 border-t border-dashed border-red-500" />
        <Text className="text-[10px] font-bold text-red-500 dark:text-red-400">Garis Target: {targetWeight} kg</Text>
      </View>
    </View>
  );
}
