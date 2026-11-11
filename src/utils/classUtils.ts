import { Member } from '../types';

/**
 * Calculates number of days passed since school start date (e.g., 2024-09-05)
 */
export function calculateDaysTogether(startDateStr: string, referenceDate?: Date): number {
  const start = new Date(startDateStr);
  const current = referenceDate ? new Date(referenceDate) : new Date();
  
  // Set both to midnight UTC for fair day calculation
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcCurrent = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  
  const diffTime = utcCurrent - utcStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 ? diffDays : 0;
}

/**
 * Determines Western Zodiac sign based on birthday YYYY-MM-DD
 */
export function calculateZodiac(birthday: string): string {
  if (!birthday) return 'Bảo Bình';
  const parts = birthday.split('-');
  if (parts.length < 3) return 'Song Tử';
  
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Bạch Dương (Aries)';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Kim Ngưu (Taurus)';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Song Tử (Gemini)';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cự Giải (Cancer)';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Sư Tử (Leo)';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Xử Nữ (Virgo)';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Thiên Bình (Libra)';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return 'Bọ Cạp (Scorpio)';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Nhân Mã (Sagittarius)';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Ma Kết (Capricorn)';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Bảo Bình (Aquarius)';
  return 'Song Ngư (Pisces)';
}

/**
 * Normalizes Vietnamese string for accent-insensitive search
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Filter members by search query (name, nickname, role, hobbies) and team
 */
export function filterMembers(
  members: Member[],
  query: string,
  teamFilter: string
): Member[] {
  const normalizedQuery = removeVietnameseAccents(query);

  return members.filter((member) => {
    // Team check
    if (teamFilter !== 'Tất cả') {
      if (teamFilter === 'Ban cán sự') {
        if (member.team !== 'Ban cán sự' && !member.role.includes('Lớp') && !member.role.includes('Bí thư')) {
          return false;
        }
      } else if (member.team !== teamFilter) {
        return false;
      }
    }

    if (!normalizedQuery) return true;

    const nameMatch = removeVietnameseAccents(member.name).includes(normalizedQuery);
    const nicknameMatch = removeVietnameseAccents(member.nickname).includes(normalizedQuery);
    const roleMatch = removeVietnameseAccents(member.role).includes(normalizedQuery);
    const hobbyMatch = member.hobbies.some((h) =>
      removeVietnameseAccents(h).includes(normalizedQuery)
    );

    return nameMatch || nicknameMatch || roleMatch || hobbyMatch;
  });
}

/**
 * Calculates days remaining until an event
 */
export function getDaysUntilEvent(eventDateStr: string, referenceDate?: Date): number {
  const target = new Date(eventDateStr);
  const current = referenceDate ? new Date(referenceDate) : new Date();

  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const utcCurrent = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());

  const diffDays = Math.ceil((utcTarget - utcCurrent) / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats YYYY-MM-DD or ISO string into readable Vietnamese format
 */
export function formatVietnameseDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
