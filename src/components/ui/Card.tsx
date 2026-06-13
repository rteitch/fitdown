import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, className = '', style, onPress }: CardProps) {
  const containerClass = `bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm shadow-slate-100 dark:shadow-none ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          style,
          { opacity: pressed ? 0.92 : 1, transform: pressed ? [{ scale: 0.99 }] : [{ scale: 1 }] }
        ]}
        className={containerClass}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={style} className={containerClass}>
      {children}
    </View>
  );
}
