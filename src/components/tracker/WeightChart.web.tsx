import React from 'react';
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

  // Jika tidak ada data
  if (entries.length === 0) {
    return (
      <View className="h-44 justify-center items-center">
        <Text className="text-slate-400 dark:text-slate-500 font-semibold text-sm">Tidak ada data berat badan.</Text>
      </View>
    );
  }

  // Tentukan nilai minimum dan maksimum Y agar grafik tidak terlalu kosong
  const weights = entries.map((e) => e.weightKg);
  const maxWeight = Math.max(...weights, targetWeight);
  const minWeight = Math.min(...weights, targetWeight);
  
  const yAxisMax = Math.ceil(maxWeight + 3);
  const yAxisMin = Math.floor(Math.max(0, minWeight - 5));
  const range = yAxisMax - yAxisMin || 1;

  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Hitung posisi titik koordinat
  const points = entries.map((entry, index) => {
    const x = paddingLeft + (index / Math.max(1, entries.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((entry.weightKg - yAxisMin) / range) * chartHeight;
    return { x, y, weight: entry.weightKg, date: entry.date.slice(5) }; // MM-DD
  });

  // Buat path string untuk garis
  let pathD = '';
  if (points.length > 1) {
    pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  // Gridlines Y-axis (4 bagian)
  const gridLines = [];
  const step = range / 4;
  for (let i = 0; i <= 4; i++) {
    const val = yAxisMin + step * i;
    const y = paddingTop + chartHeight - (i / 4) * chartHeight;
    gridLines.push({ y, value: Math.round(val) });
  }

  // Y koordinat untuk target weight
  const yTarget = paddingTop + chartHeight - ((targetWeight - yAxisMin) / range) * chartHeight;

  // Tema warna CSS untuk SVG
  const strokeColor = colorScheme === 'dark' ? '#334155' : '#E2E8F0';
  const textColor = colorScheme === 'dark' ? '#94A3B8' : '#64748B';
  const mainTextColor = colorScheme === 'dark' ? '#E2E8F0' : '#1E293B';

  return (
    <View className="pr-4 py-2 mt-4 items-center justify-center w-full">
      <div style={{ width: '100%', maxWidth: '500px', overflowX: 'auto', padding: '10px' }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          {/* Grid Lines */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={line.y} 
                x2={width - paddingRight} 
                y2={line.y} 
                stroke={strokeColor} 
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text 
                x={paddingLeft - 10} 
                y={line.y + 4} 
                textAnchor="end" 
                fill={textColor} 
                fontSize="10"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600' }}
              >
                {line.value}
              </text>
            </g>
          ))}

          {/* Target Weight Line */}
          {yTarget >= paddingTop && yTarget <= paddingTop + chartHeight && (
            <g>
              <line 
                x1={paddingLeft} 
                y1={yTarget} 
                x2={width - paddingRight} 
                y2={yTarget} 
                stroke="#EF4444" 
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text 
                x={width - paddingRight + 5} 
                y={yTarget + 3} 
                textAnchor="start" 
                fill="#EF4444" 
                fontSize="9"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '700' }}
              >
                Target ({targetWeight} kg)
              </text>
            </g>
          )}

          {/* Main Data Line */}
          {points.length > 1 ? (
            <path 
              d={pathD} 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          ) : null}

          {/* Data Points (Circles and Text Labels) */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="5" 
                fill="#10B981" 
                stroke={colorScheme === 'dark' ? '#0F172A' : '#FFFFFF'} 
                strokeWidth="1.5"
              />
              <text 
                x={p.x} 
                y={p.y - 10} 
                textAnchor="middle" 
                fill={mainTextColor} 
                fontSize="10"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 'bold' }}
              >
                {p.weight}
              </text>
              <text 
                x={p.x} 
                y={height - 10} 
                textAnchor="middle" 
                fill={textColor} 
                fontSize="10"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600' }}
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <View className="flex-row items-center justify-center mt-4 gap-2">
        <View className="w-6 h-0.5 bg-red-500 border-t border-dashed border-red-500" />
        <Text className="text-[10px] font-bold text-red-500 dark:text-red-400">Garis Target: {targetWeight} kg</Text>
      </View>
    </View>
  );
}
