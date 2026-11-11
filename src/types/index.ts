export interface Member {
  id: string;
  name: string;
  nickname: string;
  role: string; // "Lớp trưởng", "Bí thư", "Lớp phó học tập", "Tổ trưởng", "Thành viên", etc.
  team: 'Ban cán sự' | 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  avatar: string;
  birthday: string; // YYYY-MM-DD
  zodiac?: string;
  quote: string;
  hobbies: string[];
  dreamJob?: string;
  funFact?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
  };
}

export type MemoryCategory = 
  | 'Tất cả' 
  | 'Khai giảng' 
  | '20/11 Tri ân' 
  | 'Cắm trại 26/3' 
  | 'Dã ngoại & Ngoại khóa' 
  | 'Khoảnh khắc thường nhật' 
  | 'Dìm hàng đáng yêu' 
  | 'Video kỷ niệm';

export interface MemoryItem {
  id: string;
  title: string;
  category: MemoryCategory;
  url: string;
  date: string;
  caption: string;
  likes: number;
  isVideo?: boolean;
  videoUrl?: string;
  uploader?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'Quan trọng' | 'Lịch thi' | 'Hoạt động' | 'Tin vui';
  author: string;
  isPinned?: boolean;
}

export interface ClassEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  category: 'Phong trào' | 'Học tập' | 'Kỷ niệm' | 'Sinh nhật';
  badge: string;
}

export interface MemoryNote {
  id: string;
  authorName: string;
  roleOrTag: string;
  avatarEmoji: string;
  content: string;
  colorTheme: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  likes: number;
  date: string;
  stickers?: string[];
}

export interface SchedulePeriod {
  period: number;
  subject: string;
  teacher: string;
  room?: string;
}

export interface DaySchedule {
  dayName: string;
  dayShort: string;
  morning: SchedulePeriod[];
  dutyTeam: string;
  note?: string;
}
