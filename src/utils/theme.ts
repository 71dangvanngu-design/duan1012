import { ThemeSettings } from '../types/scrapbook';

export const THEME_PRESETS: Record<string, Partial<ThemeSettings>> = {
  'dark-academia': {
    mainBg: '#111111',
    secondaryBg: '#1B1B1B',
    textPrimary: '#F0EBDD',
    textSecondary: '#A8A29A',
    accentColor: '#B9A58A',
    borderColor: '#38342F',
    headingFont: "'Caveat', cursive, sans-serif",
    bodyFont: "'Nunito', 'Be Vietnam Pro', system-ui, sans-serif",
  },
  'sepia-vintage': {
    mainBg: '#181512',
    secondaryBg: '#241f1a',
    textPrimary: '#F5EBD7',
    textSecondary: '#B8AA97',
    accentColor: '#C69766',
    borderColor: '#3D342A',
    headingFont: "'Patrick Hand', cursive, sans-serif",
    bodyFont: "'Nunito', sans-serif",
  },
  'midnight-scholar': {
    mainBg: '#0D1117',
    secondaryBg: '#161B22',
    textPrimary: '#E6EDF3',
    textSecondary: '#8B949E',
    accentColor: '#79C0FF',
    borderColor: '#30363D',
    headingFont: "'Playfair Display', serif, sans-serif",
    bodyFont: "'Be Vietnam Pro', sans-serif",
  },
  'forest-notebook': {
    mainBg: '#0F1715',
    secondaryBg: '#16221F',
    textPrimary: '#E8F0EC',
    textSecondary: '#9BB0A5',
    accentColor: '#7EB693',
    borderColor: '#263934',
    headingFont: "'Caveat', cursive, sans-serif",
    bodyFont: "'Nunito', sans-serif",
  },
};

export function applyTheme(theme?: ThemeSettings) {
  if (!theme || typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme.mainBg) root.style.setProperty('--bg-main', theme.mainBg);
  if (theme.secondaryBg) root.style.setProperty('--bg-sec', theme.secondaryBg);
  if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
  if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);
  if (theme.accentColor) root.style.setProperty('--accent', theme.accentColor);
  if (theme.borderColor) root.style.setProperty('--border', theme.borderColor);

  if (theme.headingFont) {
    root.style.setProperty('--font-hand', theme.headingFont);
  }
  if (theme.bodyFont) {
    root.style.setProperty('--font-body', theme.bodyFont);
  }

  // Font size scale
  if (theme.fontSize === 'sm') {
    root.style.setProperty('--font-size-base', '14px');
  } else if (theme.fontSize === 'lg') {
    root.style.setProperty('--font-size-base', '18px');
  } else {
    root.style.setProperty('--font-size-base', '16px');
  }
}
