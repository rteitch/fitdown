import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function IndexGuard() {
  const router = useRouter();
  const userProfile = useAppStore((state) => state.userProfile);

  useEffect(() => {
    // Berikan jeda kecil untuk memastikan Zustand telah terhidrasi dari AsyncStorage
    const timer = setTimeout(() => {
      if (userProfile) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userProfile]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
