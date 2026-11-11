import React from 'react';
import { Heart, Lock, ArrowUp } from 'lucide-react';
import { ClassInfo } from '../../types/scrapbook';

interface ScrapbookFooterProps {
  classInfo: ClassInfo;
  onNavClick: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const ScrapbookFooter: React.FC<ScrapbookFooterProps> = ({
  classInfo,
  onNavClick,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#38342F] text-[#A8A29A] pt-16 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B1B1B] border border-[#38342F] flex items-center justify-center text-[#B9A58A] font-handwriting font-bold text-xl">
                10/12
              </div>
              <span className="font-handwriting font-bold text-2xl text-[#F0EBDD]">
                Tập thể 10/12
              </span>
            </div>

            <p className="font-handwriting text-lg text-[#B9A58A]">
              "{classInfo.slogan}"
            </p>

            <p className="text-xs text-[#A8A29A] leading-relaxed font-sans-body">
              {classInfo.school} • Niên khóa {classInfo.academicYear}. Lưu giữ thanh xuân một thời không thể lặp lại.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-journal text-sm text-[#F0EBDD] uppercase tracking-wider font-bold">
              Các Trang Kỷ Niệm
            </h4>
            <ul className="space-y-2 text-xs font-sans-body">
              <li>
                <button
                  onClick={() => onNavClick('home')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Trang chủ lớp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Giới thiệu & Slogan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('members')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Danh sách thành viên
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('gallery')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Thư viện ảnh Scrapbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('journal')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Nhật ký thanh xuân
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('activities')}
                  className="hover:text-[#F0EBDD] transition-colors cursor-pointer"
                >
                  Hoạt động & Sự kiện
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: GVCN Contact */}
          <div className="space-y-3">
            <h4 className="font-journal text-sm text-[#F0EBDD] uppercase tracking-wider font-bold">
              Giáo Viên Chủ Nhiệm
            </h4>
            <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-1.5 text-xs">
              <div className="font-handwriting font-bold text-xl text-[#F0EBDD]">
                {classInfo.headTeacher.name}
              </div>
              <p className="text-[#A8A29A]">{classInfo.headTeacher.subject}</p>
              <p className="text-[#B9A58A] font-mono">{classInfo.headTeacher.phone}</p>
              <p className="text-[11px] text-[#A8A29A]">{classInfo.headTeacher.email}</p>
            </div>
          </div>

          {/* Col 4: Admin Portal Entry */}
          <div className="space-y-3">
            <h4 className="font-journal text-sm text-[#F0EBDD] uppercase tracking-wider font-bold">
              Quyền Quản Trị
            </h4>
            <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] space-y-2 text-xs">
              <p className="text-[#A8A29A]">
                Dành cho Ban Cán Sự & Quản trị viên cập nhật ảnh, thành viên và bài viết.
              </p>
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 rounded-xl bg-[#22201E] hover:bg-[#38342F] border border-[#38342F] text-[#B9A58A] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Mở Bảng Điều Khiển' : 'Đăng Nhập Admin'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#38342F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span>Made with love by 10/12</span>
            <Heart className="w-3.5 h-3.5 text-[#B9A58A] fill-[#B9A58A]" />
            <span>• Năm {currentYear}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1B1B] hover:bg-[#22201E] border border-[#38342F] text-[#F0EBDD] cursor-pointer transition-colors"
          >
            <span>Lên đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#B9A58A]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
