import React from 'react';
import { 
  Users, 
  Calendar, 
  Heart, 
  Sparkles, 
  Feather, 
  Mail, 
  Phone, 
  BookOpen, 
  Flame,
  Award
} from 'lucide-react';
import { ClassInfo } from '../../types/scrapbook';

interface ScrapbookAboutProps {
  classInfo: ClassInfo;
}

export const ScrapbookAbout: React.FC<ScrapbookAboutProps> = ({ classInfo }) => {
  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header & Slogan */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1B1B1B] text-[#B9A58A] border border-[#38342F]">
          <Feather className="w-3.5 h-3.5" />
          <span>Về Ngôi Nhà Chung 10/12</span>
        </span>

        <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#F0EBDD]">
          Chuyện Kể Về 42 Mảnh Ghép Thanh Xuân
        </h2>

        <p className="text-sm sm:text-base text-[#A8A29A] leading-relaxed font-sans-body">
          {classInfo.classIntroduction}
        </p>

        {/* Slogan Banner in Calligraphy Frame */}
        <div className="pt-2">
          <div className="inline-block p-4 sm:px-8 sm:py-4 rounded-2xl bg-[#1B1B1B] border border-[#38342F] shadow-lg">
            <span className="block text-[11px] uppercase tracking-wider text-[#A8A29A] font-journal mb-1">
              Khẩu Hiệu Lớp Chúng Mình
            </span>
            <p className="font-handwriting text-2xl sm:text-3xl font-bold text-[#B9A58A] flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-[#B9A58A] fill-[#B9A58A]/30" />
              <span>"{classInfo.slogan}"</span>
              <Flame className="w-5 h-5 text-[#B9A58A] fill-[#B9A58A]/30" />
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-3 relative washi-tape-angle">
          <div className="w-12 h-12 rounded-2xl bg-[#22201E] border border-[#38342F] text-[#B9A58A] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
            Sĩ Số: {classInfo.totalMembers} Thành Viên
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A29A] leading-relaxed">
            42 bạn trẻ đầy ắp hoài bão, tinh thần đoàn kết tuyệt đối trong mọi giờ học, kỳ thi và các giải đấu cấp trường.
          </p>
          <div className="pt-2 text-xs font-journal text-[#B9A58A]">
            Tổ 1 • Tổ 2 • Tổ 3 • Tổ 4 & Ban cán sự
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-3 relative washi-tape-angle">
          <div className="w-12 h-12 rounded-2xl bg-[#22201E] border border-[#38342F] text-[#B9A58A] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
            Niên Khóa: {classInfo.academicYear}
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A29A] leading-relaxed">
            Hành trình 3 năm cấp 3 tại {classInfo.school}. Nơi mỗi ngày đến lớp là một trang kỷ niệm đẹp nhất của tuổi 16, 17, 18.
          </p>
          <div className="pt-2 text-xs font-journal text-[#B9A58A]">
            Lớp 10 ➔ Lớp 11 ➔ Lớp 12
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#1B1B1B] border border-[#38342F] space-y-3 relative washi-tape-angle">
          <div className="w-12 h-12 rounded-2xl bg-[#22201E] border border-[#38342F] text-[#B9A58A] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
            Bảng Vàng Thành Tích
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A29A] leading-relaxed">
            Giải Nhất Kéo co 26/3, Giải Nhì Văn nghệ Tri ân 20/11, Báo tường Đặc sắc nhất khối 10 và Chi đoàn Vững mạnh Xuất sắc.
          </p>
          <div className="pt-2 text-xs font-journal text-[#B9A58A]">
            Học hết mình • Chơi nhiệt tình
          </div>
        </div>
      </div>

      {/* 3. Head Teacher Scrapbook Card */}
      <div className="rounded-3xl bg-[#1B1B1B] border border-[#38342F] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Portrait in vintage photo frame */}
          <div className="lg:col-span-4 text-center">
            <div className="relative inline-block polaroid-card rounded-2xl">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden bg-[#111111]">
                <img
                  src={classInfo.headTeacher.avatar}
                  alt={classInfo.headTeacher.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-3">
                <span className="font-handwriting font-bold text-xl text-[#F0EBDD]">
                  {classInfo.headTeacher.name}
                </span>
                <p className="text-xs text-[#B9A58A] font-journal mt-0.5">
                  Giáo viên Chủ nhiệm • {classInfo.headTeacher.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher's Handwritten Note on Lined Paper */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#B9A58A] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-[#B9A58A] fill-[#B9A58A]/30" />
              <span className="font-journal text-sm">Lời Dặn Dò Yêu Thương Của Cô Chủ Nhiệm</span>
            </div>

            <div className="notebook-lined p-6 rounded-2xl border border-[#38342F] shadow-inner">
              <p className="font-handwriting text-xl sm:text-2xl text-[#F0EBDD] leading-relaxed">
                "{classInfo.headTeacher.message}"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A8A29A] leading-relaxed font-sans-body">
              Không chỉ là người giảng dạy từng áng văn lay động lòng người, cô còn là người luôn che chở, thấu hiểu từng tâm tư và tiếp thêm sức mạnh cho 42 học trò 10/12 vững bước trên con đường tương lai.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#A8A29A]">
              <div className="flex items-center gap-2 bg-[#22201E] px-3.5 py-2 rounded-xl border border-[#38342F]">
                <Mail className="w-4 h-4 text-[#B9A58A]" />
                <span>Email: {classInfo.headTeacher.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#22201E] px-3.5 py-2 rounded-xl border border-[#38342F]">
                <Phone className="w-4 h-4 text-[#B9A58A]" />
                <span>Hotline GVCN: {classInfo.headTeacher.phone}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
