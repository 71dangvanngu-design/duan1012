import React from 'react';
import { Heart, ArrowUp, Mail, Phone, MapPin, Sparkles, Instagram, Facebook } from 'lucide-react';
import { CLASS_INFO } from '../data/mockData';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Class Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-serif-title font-bold text-lg shadow-md shadow-sky-500/20">
                10/12
              </div>
              <div>
                <span className="font-serif-title font-bold text-lg text-white block">
                  Tập Thể 10/12
                </span>
                <span className="text-xs text-sky-400 font-medium">
                  Niên khóa {CLASS_INFO.academicYears}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans-body">
              "10/12 – Thanh xuân mang tên chúng ta." Không gian lưu giữ ký ức, tình bạn và những ước mơ tươi đẹp nhất của thời áo trắng.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Facebook lớp"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Instagram lớp"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick('home')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Trang chủ lớp 10/12
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Giới thiệu & Slogan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('members')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Danh sách 42 thành viên
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('memories')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Album ảnh & Video kỷ niệm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('guestbook')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Bức tường lưu bút học trò
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('schedule')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Thời khóa biểu & Lịch trực nhật
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: School Info */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
              Trường Lớp
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{CLASS_INFO.school}</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Phòng học: P.302 (Tầng 3 Nhà B)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Email lớp: tapthe1012@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Teacher & Hotline */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
              Liên Hệ GVCN
            </h4>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="font-serif-title font-bold text-white text-sm">
                {CLASS_INFO.headTeacher.name}
              </div>
              <div className="text-slate-400">
                {CLASS_INFO.headTeacher.subject}
              </div>
              <div className="flex items-center gap-2 text-sky-400 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span>{CLASS_INFO.headTeacher.phone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© 2024 - 2027 Tập thể lớp 10/12. Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>và tình yêu tuổi học trò.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Lên đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
