import React, { useState } from 'react';
import { 
  BookMarked, 
  Users, 
  Image as ImageIcon, 
  BookOpen, 
  Sparkles, 
  Info, 
  Lock, 
  Menu, 
  X,
  Compass,
  Calendar
} from 'lucide-react';

interface PublicNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: BookMarked },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'members', label: 'Thành viên', icon: Users },
    { id: 'gallery', label: 'Thư viện ảnh', icon: ImageIcon },
    { id: 'journal', label: 'Nhật ký thanh xuân', icon: BookOpen },
    { id: 'activities', label: 'Hoạt động lớp', icon: Calendar },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111]/90 backdrop-blur-md border-b border-[#38342F] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo in handwritten journal font */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3.5 group cursor-pointer text-left"
            aria-label="Về trang chủ 10/12"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1B1B1B] border border-[#38342F] group-hover:border-[#B9A58A] flex items-center justify-center text-[#B9A58A] shadow-md transition-all duration-300">
              <span className="font-handwriting font-bold text-2xl tracking-wider">10/12</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-handwriting font-bold text-2xl sm:text-3xl text-[#F0EBDD] tracking-tight group-hover:text-[#B9A58A] transition-colors">
                  Tập thể 10/12
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#22201E] text-[#B9A58A] border border-[#38342F]">
                  2024 - 2027
                </span>
              </div>
              <p className="text-xs text-[#A8A29A] font-journal hidden sm:block">
                Cuốn sổ lưu bút thanh xuân chúng mình
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1B1B1B] text-[#F0EBDD] border border-[#B9A58A]/50 shadow-inner'
                      : 'text-[#A8A29A] hover:text-[#F0EBDD] hover:bg-[#1B1B1B]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9A58A]' : 'text-[#A8A29A]'}`} />
                  <span className="font-sans-body">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isAdminLoggedIn
                  ? 'bg-[#B9A58A] text-[#111111] border-[#B9A58A] hover:bg-[#a69277] shadow-md shadow-[#B9A58A]/20'
                  : 'bg-[#1B1B1B] text-[#A8A29A] border-[#38342F] hover:text-[#F0EBDD] hover:border-[#B9A58A]/60'
              }`}
              title={isAdminLoggedIn ? 'Mở Bảng Quản Trị CMS' : 'Đăng nhập Quản trị viên'}
              aria-label={isAdminLoggedIn ? 'Trang Quản Trị' : 'Đăng nhập Admin'}
            >
              <Lock className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-[#111111]' : 'text-[#B9A58A]'}`} />
              <span>{isAdminLoggedIn ? 'Quản Trị CMS' : 'Admin'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#A8A29A] hover:text-[#F0EBDD] hover:bg-[#1B1B1B] border border-[#38342F] lg:hidden cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#38342F] bg-[#111111]/95 px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1B1B1B] text-[#F0EBDD] border-l-4 border-[#B9A58A]'
                    : 'text-[#A8A29A] hover:bg-[#1B1B1B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9A58A]' : 'text-[#A8A29A]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#38342F]">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#22201E] border border-[#38342F] text-[#B9A58A] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Mở Trang Quản Trị' : 'Đăng Nhập Quản Trị Viên'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
