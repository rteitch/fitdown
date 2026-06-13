import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AlarmConfig } from '@/store/useAppStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
    });
  }

  return true;
}

export async function scheduleWorkoutAlarm(
  hour: number,
  minute: number,
  weekdays: number[], // 1=Sun, 2=Mon, ...7=Sat in expo-notifications
  sessionName: string
): Promise<string[]> {
  if (Platform.OS === 'web') return [];
  
  const ids: string[] = [];
  const permission = await requestNotificationPermission();
  if (!permission) return [];

  for (const weekday of weekdays) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏋️ Waktunya Latihan!',
          body: `Sesi hari ini: ${sessionName}. Yuk mulai!`,
          sound: true,
          vibrate: [0, 250, 250, 250],
          data: { type: 'workout' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          hour,
          minute,
          weekday, // 1 = Sunday, 2 = Monday, etc.
        } as any,
      });
      ids.push(id);
    } catch (e) {
      console.warn('Gagal menjadwalkan notifikasi mingguan:', e);
    }
  }

  return ids;
}

export async function scheduleMealAlarm(
  hour: number,
  minute: number,
  mealLabel: string,
  tip: string
): Promise<string> {
  if (Platform.OS === 'web') return '';
  
  const permission = await requestNotificationPermission();
  if (!permission) return '';

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🍱 ${mealLabel}`,
        body: tip,
        sound: true,
        data: { type: 'meal' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      } as any,
    });
    return id;
  } catch (e) {
    console.warn('Gagal menjadwalkan notifikasi harian:', e);
    return '';
  }
}

export async function cancelAllAlarms(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Gagal membatalkan semua notifikasi:', e);
  }
}

// Sinkronisasikan seluruh alarm aktif ke sistem operasi
export async function syncAlarmsWithNotifications(alarms: AlarmConfig[]): Promise<void> {
  if (Platform.OS === 'web') return;
  
  // 1. Batalkan semua alarm lama
  await cancelAllAlarms();
  
  // 2. Daftarkan ulang setiap alarm yang aktif
  for (const alarm of alarms) {
    if (!alarm.enabled) continue;
    
    const [hourStr, minStr] = alarm.time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minStr);
    
    if (isNaN(hour) || isNaN(minute)) continue;

    if (alarm.type === 'workout') {
      // Alarm latihan dijadwalkan mingguan pada hari latihan (Senin:2, Rabu:4, Jumat:6)
      // Catatan: Di store, days menggunakan standard 1=Mon, 3=Wed, 5=Fri
      // Di expo-notifications, 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat.
      // Maka kita perlu memetakan days di store (+1 untuk menyesuaikan jika days 1-indexed ke Mon)
      // Mari kita petakan:
      // Store days: [1,3,5] (Senin, Rabu, Jumat) -> Expo: [2,4,6]
      // Kita lakukan pemetaan days:
      const mappedDays = alarm.days.map(d => {
        // Jika days store menggunakan 0=Sun, 1=Mon, ..., 6=Sat
        // Maka kita tambah 1 menjadi: 1=Sun, 2=Mon, ..., 7=Sat
        return d + 1;
      });
      await scheduleWorkoutAlarm(hour, minute, mappedDays, alarm.label);
    } else if (alarm.type === 'meal') {
      let mealTip = 'Fokus pada porsi dan hindari es teh manis/gorengan!';
      if (alarm.label.includes('Sarapan')) mealTip = 'Nasi 1 centong + telur + sayur. Air putih dulu sebelum makan!';
      if (alarm.label.includes('siang')) mealTip = 'Nasi 1 centong + lauk + sayur berkuah di kantor.';
      if (alarm.label.includes('malam')) mealTip = 'Kurangi nasi malam bertahap, lauk protein tinggi & sayur.';
      
      await scheduleMealAlarm(hour, minute, alarm.label, mealTip);
    } else {
      await scheduleMealAlarm(
        hour,
        minute,
        alarm.label,
        alarm.type === 'sleep' ? 'Kurangi layar HP, persiapan tidur berkualitas.' : 'Ayo jaga rutin penurunan berat badan.'
      );
    }
  }
}
