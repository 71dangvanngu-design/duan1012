import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Image as ImageIcon, 
  Calendar, 
  BookOpen, 
  Info, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { youthAudio } from '../utils/audioPlayer';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddMemory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenAddMemory
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMusic = () => {
    const state = youthAudio.togglePlay((playing) => setIsPlayingMusic(playing));
    setIsPlayingMusic(state);
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Heart },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'members', label: 'Thành viên', icon: Users },
    { id: 'memories', label: 'Góc kỷ niệm', icon: ImageIcon },
    { id: 'guestbook', label: 'Lưu bút', icon: BookOpen },
    { id: 'schedule', label: 'Thời khóa biểu', icon: Calendar },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            aria-label="Về trang chủ lớp 10/12"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif-title font-bold text-lg tracking-tight">10/12</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-title font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Tập Thể 10/12
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  2024 - 2027
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Thanh xuân mang tên chúng ta
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Background Music Player Toggle */}
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isPlayingMusic ? 'Tắt nhạc thanh xuân' : 'Bật nhạc thanh xuân du dương'}
              aria-label={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="hidden lg:inline">Nhạc thanh xuân</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden lg:inline">Bật nhạc</span>
                </>
              )}
            </button>

            {/* Quick Upload Memory Button */}
            {onOpenAddMemory && (
              <button
                onClick={onOpenAddMemory}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sm shadow-sky-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gửi kỷ niệm</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Mở danh mục menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 flex gap-2">
            {onOpenAddMemory && (
              <button
                onClick={() => {
                  onOpenAddMemory();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-sky-600 text-white text-center shadow-xs"
              >
                + Đăng ảnh kỷ niệm mới
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
