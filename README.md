# FitDown 🏃‍♂️💪 — Weight Loss & Workout Tracker

FitDown adalah aplikasi asisten penurunan berat badan dan pelacak latihan harian berbasis **React Native (Expo SDK 56)** dan **TypeScript**. Aplikasi ini dirancang untuk mendampingi pengguna (terutama bagi klasifikasi *Obese Class II*) dalam mencapai berat badan ideal secara konsisten melalui program latihan 12 minggu, pelacak pola makan (diet), pemantau hidrasi, grafik progres berat badan, alarm terjadwal, dan pelacakan GPS secara real-time.

---

## 🚀 Fitur Utama & Struktur Sprint

### 🏁 Sprint 1: Onboarding & Dashboard Personal
* **Formulir Onboarding**: Input nama, jenis kelamin, usia, tinggi badan, berat awal, berat target, jam kerja, serta preferensi waktu latihan.
* **Dashboard BMI Real-Time**: Kalkulasi otomatis BMI (*Body Mass Index*) dan klasifikasi obesitas (misalnya: Obesitas Kelas II pada BMI 36.1) lengkap dengan kartu progres visual menuju berat target.
* **Progres Harian**: Kartu ringkasan aktivitas latihan, diet, dan hidrasi air minum.

### 🏋️‍♂️ Sprint 2: Rencana Latihan & Alarm Cerdas
* **Program Latihan 12 Minggu**: Terbagi menjadi 3 fase terstruktur (Fase 1: Adaptasi, Fase 2: Intensifikasi, Fase 3: Maksimalisasi).
* **Timer Latihan Terintegrasi**: Timer otomatis untuk gerakan berbasis durasi (dalam detik) dan penghitung set/repetisi dengan getaran haptic saat latihan selesai/waktu istirahat habis.
* **Ilustrasi Gerakan Presisi**: Visualisasi panduan postur gerakan spesifik (seperti Squat, Push-up, Plank, Superman, Crunches, Lunges, dll.) tanpa gambar placeholder generik.
* **10 Alarm Bawaan Default**: Alarm terjadwal yang otomatis tersinkronisasi menggunakan `expo-notifications` berdasarkan preferensi jam latihan Anda (Pagi/Sore).

### 🍎 Sprint 3: Diet, Hidrasi & Timbangan Berat Badan
* **Checklist Menu Diet**: 4 sesi waktu makan (Sarapan, Makan Siang, Makan Malam, Cemilan) dengan rekomendasi jenis makanan sehat yang harus dikonsumsi dan dihindari.
* **Pelacak Air Minum**: Perekaman konsumsi air putih dengan visual progress hingga mencapai target harian 8 gelas.
* **Grafik Berat Badan Interaktif**: Tren penurunan berat badan disajikan dalam Line Chart dinamis (menggunakan `react-native-gifted-charts` di mobile dan SVG murni di web).
* **8 Badges Pencapaian (Milestones)**: Penghargaan otomatis (seperti *First Step*, *Consistent*, *Halfway*, hingga *Target Achieved*) yang terbuka saat berat badan Anda turun atau kebiasaan terpenuhi.

### 📅 Sprint 4: Kalender Konsistensi & Statistik Kepatuhan
* **Kalender Konsistensi Warna-Warni**: Indikator visual kebiasaan olahraga harian Anda:
  - 🟢 **Hijau**: Sesi latihan berhasil diselesaikan.
  - ⚪ **Abu-abu**: Hari istirahat terprogram (Rest Day).
  - 🔴 **Merah**: Hari latihan terjadwal yang terlewatkan.
  - 🔵 **Biru**: Hari latihan terjadwal mendatang.
* **Statistik Kepatuhan**: Grafik persentase konsistensi mingguan dan pencatatan rekor *Streak* terpanjang secara otomatis.
* **Dukungan Dark Mode Penuh**: Antarmuka adaptif yang sangat memukau baik dalam mode Terang (*Light Mode*) maupun Gelap (*Dark Mode*).

### 🛰️ Sprint 5: Pelacakan GPS & Jarak Tempuh Lari/Jalan (Terbaru)
* **Permintaan Izin Lokasi Perangkat**: Permintaan izin native akses lokasi (*foreground location permission*) secara otomatis ketika memulai latihan luar ruangan.
* **Pelacakan Jarak Real-Time**: Penghitungan jarak tempuh kumulatif secara real-time menggunakan **Haversine Formula** pada latihan jalan atau lari (misal: Jalan Cepat, Jalan Santai, Jogging, dan Lari).
* **Speedometer Real-Time**: Menampilkan kecepatan lari/jalan Anda saat ini (dalam km/jam) di dalam UI Timer.
* **Keamanan Memori & Anti-Leak**: Pemantauan lokasi dibersihkan secara bersih (*unsubscribed*) saat latihan dijeda, rest-time, atau halaman ditutup untuk menghemat baterai HP.
* **Riwayat Berbasis Jarak**: Informasi total jarak latihan disimpan ke `WorkoutLog` dan ditampilkan di samping lencana "Selesai" di riwayat latihan (misal: `Selesai • 2.5 km`).

---

## 🛠️ Teknologi yang Digunakan

* **Core Framework**: React Native & Expo (SDK 56)
* **Bahasa Pemrograman**: TypeScript (Type-safe)
* **Navigation / Routing**: Expo Router v3 (File-based Routing)
* **State Management**: Zustand (dengan persistence `AsyncStorage`)
* **Styling**: TailwindCSS via NativeWind v4 (CSS fleksibel & responsif)
* **Charts & Grafik**: `react-native-gifted-charts` & SVG murni untuk Web
* **API Perangkat (Native)**: 
  - `expo-location` (GPS Tracking)
  - `expo-notifications` (Sinkronisasi Alarm)
  - `expo-image` (Image Caching)

---

## 📦 Cara Memulai

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) di perangkat Anda.

### 1. Instalasi Dependensi
Clone repository ini dan jalankan perintah berikut di direktori utama proyek untuk menginstal seluruh pustaka yang dibutuhkan:
```bash
npm install
```

Atau gunakan file referensi kebutuhan instalasi jika ada modul tambahan:
```bash
pip install -r requirements.txt
```

### 2. Menjalankan Aplikasi

* **Menjalankan Expo Dev Server**:
  ```bash
  npm run start
  ```
  *Gunakan aplikasi **Expo Go** di HP Android atau iOS Anda untuk memindai kode QR yang muncul.*

* **Menjalankan di Simulator iOS**:
  ```bash
  npm run ios
  ```

* **Menjalankan di Emulator Android**:
  ```bash
  npm run android
  ```

* **Menjalankan di Browser (Web)**:
  ```bash
  npm run web
  ```

---

## 📂 Struktur Proyek Utama

```text
fitdown/
├── assets/                  # Aset gambar panduan gerakan & ikon aplikasi
├── src/
│   ├── app/                 # Halaman-halaman rute (Expo Router)
│   │   ├── (tabs)/          # Navigasi tab (Dashboard, Workout, Food, Tracker, Settings)
│   │   ├── onboarding/      # Layar formulir pendaftaran pengguna baru
│   │   └── workout/         # Layar detail gerakan dan Timer latihan (GPS)
│   ├── components/          # Komponen UI umum, kartu statistik, & grafik timbangan
│   ├── constants/           # Konstanta program latihan 12 minggu & pemetaan ilustrasi
│   ├── hooks/               # Custom react hooks (timer latihan, dll.)
│   ├── store/               # Global state (Zustand persistent store)
│   └── utils/               # Fungsi pembantu tanggal (timezone-safe) & konversi
├── requirements.txt         # Daftar paket instalasi proyek
└── tsconfig.json            # Konfigurasi TypeScript
```

---

## 🧪 Verifikasi Kode
Untuk memverifikasi kesesuaian tipe data TypeScript pada seluruh proyek, jalankan:
```bash
npx tsc --noEmit
```
Jika tidak ada output kesalahan, kompilasi kode Anda dijamin 100% aman dan bebas dari masalah tipe data TypeScript.
