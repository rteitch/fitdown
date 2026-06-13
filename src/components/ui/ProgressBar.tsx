import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // value between 0 and 1
  height?: number;
  className?: string;
  activeColor?: string; // e.g. "bg-emerald-500"
}

export function ProgressBar({ progress, height = 8, className = '', activeColor = 'bg-emerald-500' }: ProgressBarProps) {
  // Batasi progres antara 0 dan 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = `${clampedProgress * 100}%`;

  return (
    <View 
      style={{ height }} 
      className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}
    >
      <View
        style={{ width: percentage as any, height: '100%' }}
        className={`${activeColor} rounded-full`}
      />
    </View>
  );
}
