import { addDays, startOfWeek, format } from 'date-fns';

// Dapatkan daftar tanggal (YYYY-MM-DD) untuk hari Senin s/d Minggu di minggu kalender saat ini
export function getWeekDates(date: Date = new Date()): Record<string, string> {
  // Mulai minggu dari hari Senin (opsi { weekStartsOn: 1 })
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  
  return {
    monday: format(monday, 'yyyy-MM-dd'),
    tuesday: format(addDays(monday, 1), 'yyyy-MM-dd'),
    wednesday: format(addDays(monday, 2), 'yyyy-MM-dd'),
    thursday: format(addDays(monday, 3), 'yyyy-MM-dd'),
    friday: format(addDays(monday, 4), 'yyyy-MM-dd'),
    saturday: format(addDays(monday, 5), 'yyyy-MM-dd'),
    sunday: format(addDays(monday, 6), 'yyyy-MM-dd'),
  };
}

// Format tanggal ke bentuk bahasa Indonesia yang ramah (misal: "Senin, 15 Jun")
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    
    const dayIndo = dayNames[date.getDay()];
    const dateNum = date.getDate();
    const monthIndo = monthNames[date.getMonth()];
    
    return `${dayIndo}, ${dateNum} ${monthIndo}`;
  } catch (e) {
    return dateStr;
  }
}
