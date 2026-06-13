export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsOrDuration: string;  // "10 rep" atau "30 detik"
  restSeconds: number;
  note?: string;
  completed: boolean;
  image?: any;
}

export interface WorkoutSession {
  type: 'cardio' | 'strength' | 'hiit' | 'mix' | 'rest';
  title: string;
  durationMinutes: number;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  phase: 1 | 2 | 3;
  sessions: {
    monday?: WorkoutSession;
    tuesday?: WorkoutSession;
    wednesday?: WorkoutSession;
    thursday?: WorkoutSession;
    friday?: WorkoutSession;
    saturday?: WorkoutSession;
    sunday?: WorkoutSession;
  };
}

export const WORKOUT_PROGRAM: Record<number, WorkoutWeek> = {
  1: {
    phase: 1,
    sessions: {
      monday: {
        type: 'cardio',
        title: 'Kardio Ringan',
        durationMinutes: 30,
        exercises: [
          { id: 'w1_m1', name: 'Jalan cepat', sets: 1, repsOrDuration: '20 menit', restSeconds: 0, note: 'Jaga detak jantung 60-70% max', completed: false },
          { id: 'w1_m2', name: 'Jumping jacks', sets: 3, repsOrDuration: '20 rep', restSeconds: 30, note: 'Lompat ringan tanpa menghentak keras', completed: false },
          { id: 'w1_m3', name: 'High knees', sets: 3, repsOrDuration: '30 detik', restSeconds: 30, note: 'Angkat lutut senyaman mungkin', completed: false },
          { id: 'w1_m4', name: 'Pendinginan jalan santai', sets: 1, repsOrDuration: '5 menit', restSeconds: 0, note: 'Atur napas kembali normal', completed: false },
        ],
      },
      tuesday: {
        type: 'rest',
        title: 'Istirahat Aktif',
        durationMinutes: 0,
        exercises: [
          { id: 'w1_t1', name: 'Jalan santai sore', sets: 1, repsOrDuration: '20-30 menit', restSeconds: 0, note: 'Jalan santai di sekitar rumah', completed: false }
        ]
      },
      wednesday: {
        type: 'strength',
        title: 'Full Body Bodyweight',
        durationMinutes: 35,
        exercises: [
          { id: 'w1_w1', name: 'Squat', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, note: 'Lutut sejajar jari kaki', completed: false },
          { id: 'w1_w2', name: 'Push-up (lutut boleh)', sets: 3, repsOrDuration: '8 rep', restSeconds: 60, note: 'Fokus pada otot dada dan bahu', completed: false },
          { id: 'w1_w3', name: 'Glute bridge', sets: 3, repsOrDuration: '12 rep', restSeconds: 60, note: 'Tahan 2 detik di bagian atas', completed: false },
          { id: 'w1_w4', name: 'Plank', sets: 3, repsOrDuration: '20 detik', restSeconds: 45, note: 'Punggung lurus, perut dikunci', completed: false },
          { id: 'w1_w5', name: 'Superman hold', sets: 3, repsOrDuration: '10 rep', restSeconds: 45, note: 'Angkat dada & kaki sedikit', completed: false },
        ],
      },
      thursday: {
        type: 'rest',
        title: 'Istirahat Aktif',
        durationMinutes: 0,
        exercises: [
          { id: 'w1_th1', name: 'Jalan santai sore', sets: 1, repsOrDuration: '20-30 menit', restSeconds: 0, note: 'Jalan santai di sekitar rumah', completed: false }
        ]
      },
      friday: {
        type: 'mix',
        title: 'Mix Kardio + Core',
        durationMinutes: 30,
        exercises: [
          { id: 'w1_f1', name: 'Jalan cepat', sets: 1, repsOrDuration: '15 menit', restSeconds: 0, note: 'Pemanasan kardio awal', completed: false },
          { id: 'w1_f2', name: 'Crunches', sets: 3, repsOrDuration: '15 rep', restSeconds: 30, note: 'Tekuk lutut, angkat bahu sedikit', completed: false },
          { id: 'w1_f3', name: 'Leg raises', sets: 3, repsOrDuration: '10 rep', restSeconds: 30, note: 'Angkat kaki lurus, tahan punggung bawah', completed: false },
          { id: 'w1_f4', name: 'Mountain climbers', sets: 3, repsOrDuration: '20 detik', restSeconds: 30, note: 'Tarik lutut bergantian dengan terkontrol', completed: false },
        ],
      },
      saturday: {
        type: 'rest',
        title: 'Istirahat',
        durationMinutes: 0,
        exercises: []
      },
      sunday: {
        type: 'rest',
        title: 'Istirahat Penuh',
        durationMinutes: 0,
        exercises: []
      }
    },
  },
  2: {
    phase: 1,
    sessions: {
      monday: {
        type: 'cardio',
        title: 'Kardio Ringan',
        durationMinutes: 30,
        exercises: [
          { id: 'w2_m1', name: 'Jalan cepat', sets: 1, repsOrDuration: '20 menit', restSeconds: 0, note: 'Jaga detak jantung 60-70% max', completed: false },
          { id: 'w2_m2', name: 'Jumping jacks', sets: 3, repsOrDuration: '25 rep', restSeconds: 30, note: 'Lompat ringan tanpa menghentak keras', completed: false },
          { id: 'w2_m3', name: 'High knees', sets: 3, repsOrDuration: '30 detik', restSeconds: 30, note: 'Angkat lutut senyaman mungkin', completed: false },
          { id: 'w2_m4', name: 'Pendinginan jalan santai', sets: 1, repsOrDuration: '5 menit', restSeconds: 0, note: '', completed: false },
        ],
      },
      wednesday: {
        type: 'strength',
        title: 'Full Body Bodyweight',
        durationMinutes: 35,
        exercises: [
          { id: 'w2_w1', name: 'Squat', sets: 3, repsOrDuration: '12 rep', restSeconds: 60, note: 'Lutut sejajar jari kaki', completed: false },
          { id: 'w2_w2', name: 'Push-up (lutut boleh)', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, note: 'Fokus pada otot dada dan bahu', completed: false },
          { id: 'w2_w3', name: 'Glute bridge', sets: 3, repsOrDuration: '15 rep', restSeconds: 60, note: 'Tahan 2 detik di bagian atas', completed: false },
          { id: 'w2_w4', name: 'Plank', sets: 3, repsOrDuration: '25 detik', restSeconds: 45, note: 'Punggung lurus, perut dikunci', completed: false },
          { id: 'w2_w5', name: 'Superman hold', sets: 3, repsOrDuration: '12 rep', restSeconds: 45, note: 'Angkat dada & kaki sedikit', completed: false },
        ],
      },
      friday: {
        type: 'mix',
        title: 'Mix Kardio + Core',
        durationMinutes: 30,
        exercises: [
          { id: 'w2_f1', name: 'Jalan cepat', sets: 1, repsOrDuration: '15 menit', restSeconds: 0, note: 'Pemanasan kardio awal', completed: false },
          { id: 'w2_f2', name: 'Crunches', sets: 3, repsOrDuration: '15 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w2_f3', name: 'Leg raises', sets: 3, repsOrDuration: '12 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w2_f4', name: 'Mountain climbers', sets: 3, repsOrDuration: '25 detik', restSeconds: 30, note: '', completed: false },
        ],
      },
    }
  },
  3: {
    phase: 1,
    sessions: {
      monday: {
        type: 'cardio',
        title: 'Kardio Ringan',
        durationMinutes: 30,
        exercises: [
          { id: 'w3_m1', name: 'Jalan cepat', sets: 1, repsOrDuration: '25 menit', restSeconds: 0, note: 'Jaga detak jantung 60-70% max', completed: false },
          { id: 'w3_m2', name: 'Jumping jacks', sets: 3, repsOrDuration: '30 rep', restSeconds: 30, note: 'Lompat ringan tanpa menghentak keras', completed: false },
          { id: 'w3_m3', name: 'High knees', sets: 3, repsOrDuration: '35 detik', restSeconds: 30, note: 'Angkat lutut senyaman mungkin', completed: false },
          { id: 'w3_m4', name: 'Pendinginan jalan santai', sets: 1, repsOrDuration: '5 menit', restSeconds: 0, note: '', completed: false },
        ],
      },
      wednesday: {
        type: 'strength',
        title: 'Full Body Bodyweight',
        durationMinutes: 35,
        exercises: [
          { id: 'w3_w1', name: 'Squat', sets: 3, repsOrDuration: '12 rep', restSeconds: 60, note: 'Lutut sejajar jari kaki', completed: false },
          { id: 'w3_w2', name: 'Push-up (lutut boleh)', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, note: 'Fokus pada otot dada dan bahu', completed: false },
          { id: 'w3_w3', name: 'Glute bridge', sets: 3, repsOrDuration: '15 rep', restSeconds: 60, note: 'Tahan 2 detik di bagian atas', completed: false },
          { id: 'w3_w4', name: 'Plank', sets: 3, repsOrDuration: '30 detik', restSeconds: 45, note: 'Punggung lurus, perut dikunci', completed: false },
          { id: 'w3_w5', name: 'Superman hold', sets: 3, repsOrDuration: '12 rep', restSeconds: 45, note: 'Angkat dada & kaki sedikit', completed: false },
        ],
      },
      friday: {
        type: 'mix',
        title: 'Mix Kardio + Core',
        durationMinutes: 30,
        exercises: [
          { id: 'w3_f1', name: 'Jalan cepat', sets: 1, repsOrDuration: '15 menit', restSeconds: 0, note: 'Pemanasan kardio awal', completed: false },
          { id: 'w3_f2', name: 'Crunches', sets: 3, repsOrDuration: '20 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w3_f3', name: 'Leg raises', sets: 3, repsOrDuration: '12 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w3_f4', name: 'Mountain climbers', sets: 3, repsOrDuration: '30 detik', restSeconds: 30, note: '', completed: false },
        ],
      },
    }
  },
  4: {
    phase: 1,
    sessions: {
      monday: {
        type: 'cardio',
        title: 'Kardio Ringan',
        durationMinutes: 30,
        exercises: [
          { id: 'w4_m1', name: 'Jalan cepat', sets: 1, repsOrDuration: '25 menit', restSeconds: 0, note: 'Jaga detak jantung 60-70% max', completed: false },
          { id: 'w4_m2', name: 'Jumping jacks', sets: 4, repsOrDuration: '30 rep', restSeconds: 30, note: 'Lompat ringan tanpa menghentak keras', completed: false },
          { id: 'w4_m3', name: 'High knees', sets: 4, repsOrDuration: '35 detik', restSeconds: 30, note: 'Angkat lutut senyaman mungkin', completed: false },
          { id: 'w4_m4', name: 'Pendinginan jalan santai', sets: 1, repsOrDuration: '5 menit', restSeconds: 0, note: '', completed: false },
        ],
      },
      wednesday: {
        type: 'strength',
        title: 'Full Body Bodyweight',
        durationMinutes: 35,
        exercises: [
          { id: 'w4_w1', name: 'Squat', sets: 4, repsOrDuration: '12 rep', restSeconds: 60, note: 'Lutut sejajar jari kaki', completed: false },
          { id: 'w4_w2', name: 'Push-up (lutut boleh)', sets: 4, repsOrDuration: '10 rep', restSeconds: 60, note: 'Fokus pada otot dada dan bahu', completed: false },
          { id: 'w4_w3', name: 'Glute bridge', sets: 4, repsOrDuration: '15 rep', restSeconds: 60, note: 'Tahan 2 detik di bagian atas', completed: false },
          { id: 'w4_w4', name: 'Plank', sets: 4, repsOrDuration: '30 detik', restSeconds: 45, note: 'Punggung lurus, perut dikunci', completed: false },
          { id: 'w4_w5', name: 'Superman hold', sets: 4, repsOrDuration: '12 rep', restSeconds: 45, note: 'Angkat dada & kaki sedikit', completed: false },
        ],
      },
      friday: {
        type: 'mix',
        title: 'Mix Kardio + Core',
        durationMinutes: 30,
        exercises: [
          { id: 'w4_f1', name: 'Jalan cepat', sets: 1, repsOrDuration: '15 menit', restSeconds: 0, note: 'Pemanasan kardio awal', completed: false },
          { id: 'w4_f2', name: 'Crunches', sets: 4, repsOrDuration: '20 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w4_f3', name: 'Leg raises', sets: 4, repsOrDuration: '12 rep', restSeconds: 30, note: '', completed: false },
          { id: 'w4_f4', name: 'Mountain climbers', sets: 4, repsOrDuration: '30 detik', restSeconds: 30, note: '', completed: false },
        ],
      },
    }
  },
  // Program diisi dari minggu 5 ke atas sebagai kerangka, untuk ringkasnya kita akan mengisi data lengkap 1-4
  // dan kerangka default untuk 5-12. Jika pengguna masuk ke minggu 5-12, kita buat data dinamis yang proporsional.
};

// Fungsi pembantu untuk membuat detail latihan dinamis jika minggu di luar 1-4 diakses
export function getWorkoutForWeek(week: number): WorkoutWeek {
  if (WORKOUT_PROGRAM[week]) {
    return WORKOUT_PROGRAM[week];
  }
  
  // Tentukan fase berdasarkan nomor minggu
  const phase = week <= 4 ? 1 : week <= 8 ? 2 : 3;
  
  if (phase === 2) {
    // Fase 2: 4x seminggu
    return {
      phase: 2,
      sessions: {
        monday: {
          type: 'strength',
          title: 'Kekuatan Upper Body',
          durationMinutes: 40,
          exercises: [
            { id: `w${week}_upper1`, name: 'Push-up reguler', sets: 3, repsOrDuration: '12 rep', restSeconds: 60, completed: false },
            { id: `w${week}_upper2`, name: 'Pike push-up', sets: 3, repsOrDuration: '8 rep', restSeconds: 60, completed: false },
            { id: `w${week}_upper3`, name: 'Chair dips', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, completed: false },
            { id: `w${week}_upper4`, name: 'Plank tap', sets: 3, repsOrDuration: '15 rep', restSeconds: 45, completed: false },
          ]
        },
        tuesday: {
          type: 'hiit',
          title: 'HIIT Sesi Awal',
          durationMinutes: 20,
          exercises: [
            { id: `w${week}_hiit1`, name: 'Jumping jacks', sets: 4, repsOrDuration: '40 detik', restSeconds: 20, completed: false },
            { id: `w${week}_hiit2`, name: 'Squat thrusts', sets: 4, repsOrDuration: '40 detik', restSeconds: 20, completed: false },
            { id: `w${week}_hiit3`, name: 'Mountain climbers', sets: 4, repsOrDuration: '40 detik', restSeconds: 20, completed: false },
            { id: `w${week}_hiit4`, name: 'High knees', sets: 4, repsOrDuration: '40 detik', restSeconds: 20, completed: false },
          ]
        },
        thursday: {
          type: 'strength',
          title: 'Kekuatan Lower Body + Core',
          durationMinutes: 40,
          exercises: [
            { id: `w${week}_lower1`, name: 'Squat', sets: 3, repsOrDuration: '15 rep', restSeconds: 60, completed: false },
            { id: `w${week}_lower2`, name: 'Lunges', sets: 3, repsOrDuration: '10 rep/kaki', restSeconds: 60, completed: false },
            { id: `w${week}_lower3`, name: 'Glute bridge', sets: 3, repsOrDuration: '15 rep', restSeconds: 60, completed: false },
            { id: `w${week}_lower4`, name: 'Bicycle crunches', sets: 3, repsOrDuration: '20 rep', restSeconds: 45, completed: false },
          ]
        },
        friday: {
          type: 'cardio',
          title: 'Kardio Steady State',
          durationMinutes: 30,
          exercises: [
            { id: `w${week}_cardio1`, name: 'Jalan cepat stabil', sets: 1, repsOrDuration: '30 menit', restSeconds: 0, note: 'Jaga detak jantung konstan', completed: false }
          ]
        }
      }
    };
  } else {
    // Fase 3: 5x seminggu
    return {
      phase: 3,
      sessions: {
        monday: {
          type: 'strength',
          title: 'Push Day (Dada, Bahu, Tricep)',
          durationMinutes: 45,
          exercises: [
            { id: `w${week}_push1`, name: 'Decline push-up', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, completed: false },
            { id: `w${week}_push2`, name: 'Pike push-up', sets: 3, repsOrDuration: '10 rep', restSeconds: 60, completed: false },
            { id: `w${week}_push3`, name: 'Diamond push-up', sets: 3, repsOrDuration: '8 rep', restSeconds: 60, completed: false },
            { id: `w${week}_push4`, name: 'Tricep dips', sets: 3, repsOrDuration: '12 rep', restSeconds: 60, completed: false },
          ]
        },
        tuesday: {
          type: 'hiit',
          title: 'HIIT Pembakaran Maksimal',
          durationMinutes: 25,
          exercises: [
            { id: `w${week}_hiit3_1`, name: 'Burpees', sets: 4, repsOrDuration: '30 detik', restSeconds: 15, completed: false },
            { id: `w${week}_hiit3_2`, name: 'Jumping jacks', sets: 4, repsOrDuration: '45 detik', restSeconds: 15, completed: false },
            { id: `w${week}_hiit3_3`, name: 'Squat jumps', sets: 4, repsOrDuration: '30 detik', restSeconds: 15, completed: false },
            { id: `w${week}_hiit3_4`, name: 'Mountain climbers', sets: 4, repsOrDuration: '45 detik', restSeconds: 15, completed: false },
          ]
        },
        wednesday: {
          type: 'strength',
          title: 'Pull Day (Punggung, Bisep)',
          durationMinutes: 45,
          exercises: [
            { id: `w${week}_pull1`, name: 'Superman hold', sets: 3, repsOrDuration: '15 rep', restSeconds: 45, completed: false },
            { id: `w${week}_pull2`, name: 'Prone Y-T-W raises', sets: 3, repsOrDuration: '12 rep', restSeconds: 45, completed: false },
            { id: `w${week}_pull3`, name: 'Plank row (no weights)', sets: 3, repsOrDuration: '15 rep', restSeconds: 45, completed: false },
          ]
        },
        friday: {
          type: 'strength',
          title: 'Leg Day + Core',
          durationMinutes: 50,
          exercises: [
            { id: `w${week}_leg1`, name: 'Squat', sets: 4, repsOrDuration: '15 rep', restSeconds: 60, completed: false },
            { id: `w${week}_leg2`, name: 'Lunges berjalan', sets: 3, repsOrDuration: '12 rep/kaki', restSeconds: 60, completed: false },
            { id: `w${week}_leg3`, name: 'Glute bridge satu kaki', sets: 3, repsOrDuration: '10 rep/kaki', restSeconds: 60, completed: false },
            { id: `w${week}_leg4`, name: 'Plank dengan angkat kaki', sets: 3, repsOrDuration: '30 detik', restSeconds: 45, completed: false },
          ]
        },
        saturday: {
          type: 'cardio',
          title: 'Kardio Steady State',
          durationMinutes: 35,
          exercises: [
            { id: `w${week}_cardio3`, name: 'Jalan cepat / Jogging ringan', sets: 1, repsOrDuration: '35 menit', restSeconds: 0, note: 'Bila sudah turun >5kg, bisa coba jogging selang-seling', completed: false }
          ]
        }
      }
    };
  }
}

// Fungsi pembantu untuk memetakan nama gerakan ke gambar ilustrasi yang sesuai
export function getExerciseImage(name: string): any {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('squat')) {
    return require('@/assets/images/exercises/squat.png');
  }
  if (lowercaseName.includes('push-up') || lowercaseName.includes('pushup') || lowercaseName.includes('dips')) {
    return require('@/assets/images/exercises/pushup.png');
  }
  if (lowercaseName.includes('glute bridge')) {
    return require('@/assets/images/exercises/glute_bridge.png');
  }
  if (lowercaseName.includes('jumping jacks')) {
    return require('@/assets/images/exercises/jumping_jacks.png');
  }
  if (lowercaseName.includes('high knees')) {
    return require('@/assets/images/exercises/high_knees.png');
  }
  if (lowercaseName.includes('mountain climbers')) {
    return require('@/assets/images/exercises/mountain_climbers.png');
  }
  if (lowercaseName.includes('superman') || lowercaseName.includes('prone y-t-w')) {
    return require('@/assets/images/exercises/superman.png');
  }
  if (lowercaseName.includes('crunches') || lowercaseName.includes('crunch')) {
    return require('@/assets/images/exercises/crunches.png');
  }
  if (lowercaseName.includes('leg raise') || lowercaseName.includes('leg raises')) {
    return require('@/assets/images/exercises/leg_raises.png');
  }
  if (lowercaseName.includes('lunges')) {
    return require('@/assets/images/exercises/lunges.png');
  }
  if (lowercaseName.includes('plank')) {
    return require('@/assets/images/exercises/plank.png');
  }
  if (lowercaseName.includes('jalan') || lowercaseName.includes('walk') || lowercaseName.includes('pendinginan') || lowercaseName.includes('jogging')) {
    return require('@/assets/images/exercises/walking.png');
  }
  
  // Default fallback
  return require('@/assets/images/exercises/cardio.png');
}

