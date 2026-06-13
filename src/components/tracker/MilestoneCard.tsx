import React from 'react';
import { View, Text } from 'react-native';
import { WeightEntry } from '@/store/useAppStore';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { formatFriendlyDate } from '@/utils/dateHelper';

interface MilestoneCardProps {
  startWeight: number;
  targetWeight: number;
  currentWeight: number;
  entries: WeightEntry[];
}

interface Milestone {
  id: string;
  label: string;
  targetWeightKg: number;
  badgeName: string;
  icon: string;
  color: string;
}

export function MilestoneCard({ startWeight, targetWeight, currentWeight, entries }: MilestoneCardProps) {
  // Hitung target berat dinamis untuk kelipatan 5 kg
  const milestones: Milestone[] = [
    { id: 'm0', label: 'Start Program', targetWeightKg: startWeight, badgeName: '🚀 Mulai', icon: 'rocket', color: 'text-blue-500 bg-blue-500/10' },
    { id: 'm1', label: 'Turun 5 kg', targetWeightKg: startWeight - 5, badgeName: '🥉 Bronze', icon: 'medal', color: 'text-amber-700 bg-amber-700/10' },
    { id: 'm2', label: 'Turun 10 kg', targetWeightKg: startWeight - 10, badgeName: '🥈 Silver', icon: 'medal', color: 'text-slate-400 bg-slate-400/10' },
    { id: 'm3', label: 'Turun 15 kg', targetWeightKg: startWeight - 15, badgeName: '🥇 Gold', icon: 'medal', color: 'text-amber-500 bg-amber-500/10' },
    { id: 'm4', label: 'Turun 20 kg', targetWeightKg: startWeight - 20, badgeName: '💎 Diamond', icon: 'diamond', color: 'text-cyan-500 bg-cyan-500/10' },
    { id: 'm5', label: 'Turun 25 kg', targetWeightKg: startWeight - 25, badgeName: '🏆 Champion', icon: 'trophy', color: 'text-purple-500 bg-purple-500/10' },
    { id: 'm6', label: 'Turun 30 kg', targetWeightKg: startWeight - 30, badgeName: '👑 King', icon: 'ribbon', color: 'text-rose-500 bg-rose-500/10' },
    { id: 'm7', label: 'Target Ideal', targetWeightKg: targetWeight, badgeName: '🎯 Goal!', icon: 'flag', color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  // Cari tanggal pencapaian dari riwayat berat badan
  const getAchievementDetails = (targetWeightKg: number) => {
    // Cari entri pertama yang nilainya <= targetWeightKg
    // Catatan: Untuk milestone "Start", entri pertama (onboarding) akan langsung membukanya
    const achievedEntry = entries.find((e) => e.weightKg <= targetWeightKg);
    return achievedEntry ? achievedEntry.date : null;
  };

  return (
    <View className="flex-row flex-wrap gap-3.5 mb-6">
      {milestones.map((m) => {
        // Jangan tampilkan target milstone yang lebih ringan atau sama dengan target ideal untuk menghindari duplikasi
        if (m.id !== 'm7' && m.targetWeightKg <= targetWeight) return null;

        const achievedDate = getAchievementDetails(m.targetWeightKg);
        const isUnlocked = !!achievedDate || currentWeight <= m.targetWeightKg;
        
        return (
          <View key={m.id} className="w-[47%]">
            <Card 
              className={`border p-4 h-36 justify-between ${
                isUnlocked 
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                  : 'bg-slate-100/50 dark:bg-slate-950/20 border-transparent opacity-50'
              }`}
            >
              <View className="flex-row justify-between items-start">
                <View className={`p-2 rounded-xl ${isUnlocked ? m.color : 'bg-slate-200 dark:bg-slate-850 text-slate-400'}`}>
                  <Ionicons 
                    name={m.icon as any} 
                    size={20} 
                    color={
                      isUnlocked 
                        ? (m.id === 'm7' ? '#10B981' : 
                           m.id === 'm3' ? '#F59E0B' : 
                           m.id === 'm1' ? '#B45309' : 
                           m.id === 'm4' ? '#06B6D4' : 
                           m.id === 'm0' ? '#3B82F6' : '#EF4444')
                        : '#94A3B8'
                    } 
                  />
                </View>
                {isUnlocked && (
                  <View className="bg-emerald-500/10 rounded-full p-0.5">
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  </View>
                )}
              </View>

              <View className="mt-2">
                <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {m.badgeName}
                </Text>
                <Text className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                  {m.label}
                </Text>
                <Text className="text-[11px] font-semibold text-emerald-500 mt-1">
                  Target: {m.targetWeightKg.toFixed(0)} kg
                </Text>
                
                {isUnlocked && achievedDate && (
                  <Text className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                    Achieved: {formatFriendlyDate(achievedDate)}
                  </Text>
                )}
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
