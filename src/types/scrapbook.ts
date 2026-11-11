export interface ThemeSettings {
  mainBg: string;
  secondaryBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  enableAnimations: boolean;
  enableScrapbookEffects: boolean;
  fontSize?: 'sm' | 'base' | 'lg';
  themePreset?: 'dark-academia' | 'sepia-vintage' | 'midnight-scholar' | 'custom';
}

export type GalleryLayoutType = 'masonry' | 'grid' | 'polaroid' | 'list';
export type GallerySpacingType = 'compact' | 'normal' | 'relaxed';

export interface LayoutSettings {
  galleryLayout: GalleryLayoutType;
  gallerySpacing: GallerySpacingType;
  polaroidTilt: boolean;
  sectionOrder: string[];
  visibleSections: {
    hero: boolean;
    notes: boolean;
    about: boolean;
    members: boolean;
    gallery: boolean;
    journal: boolean;
    activities: boolean;
    [key: string]: boolean;
  };
}

export interface HeadTeacher {
  name: string;
  subject: string;
  avatar: string;
  message: string;
  phone: string;
  email: string;
}

export interface ClassInfo {
  name: string;
  school: string;
  academicYear: string;
  startDate: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  coverImage: string;
  headTeacher: HeadTeacher;
  totalMembers: number;
  classIntroduction: string;
  quoteNotice: string;
}

export interface ScrapbookMember {
  id: string;
  name: string;
  nickname: string;
  role: string;
  avatar: string;
  bio: string;
  birthday: string;
  order: number;
}

export interface ScrapbookAlbum {
  id: string;
  title: string;
  description: string;
  cover?: string;
}

export interface ScrapbookImage {
  id: string;
  title: string;
  caption: string;
  url: string;
  albumId: string;
  date: string;
  frameStyle: 'polaroid' | 'square' | 'landscape' | 'portrait';
  aspectRatio: '1:1' | '4:3' | '3:4' | '16:9';
  isFeatured: boolean;
  order: number;
}

export interface ScrapbookJournal {
  id: string;
  title: string;
  content: string;
  author?: string;
  date: string;
  image?: string;
}

export interface ScrapbookActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image?: string;
}

export interface ScrapbookStore {
  themeSettings: ThemeSettings;
  layoutSettings: LayoutSettings;
  classInfo: ClassInfo;
  members: ScrapbookMember[];
  albums: ScrapbookAlbum[];
  gallery: ScrapbookImage[];
  journals: ScrapbookJournal[];
  activities: ScrapbookActivity[];
}

export interface AdminUser {
  username: string;
  mustChangePassword: boolean;
}
