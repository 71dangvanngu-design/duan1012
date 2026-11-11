import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Heart, Calendar, Clock, Feather, Compass } from 'lucide-react';
import { ClassInfo } from '../../types/scrapbook';

interface ScrapbookHeroProps {
  classInfo: ClassInfo;
  onExplore: () => void;
  onViewMemories: () => void;
}

export const ScrapbookHero: React.FC<ScrapbookHeroProps> = ({
  classInfo,
  onExplore,
  onViewMemories,
}) => {
  // Realtime Clock & Date widget
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate days together from startDate
  const calculateDays = () => {
    const start = new Date(classInfo.startDate || '2024-09-05');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysTogether = calculateDays();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-[#111111]">
      {/* Decorative Dark Academia vintage parchment glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#B9A58A]/10 via-[#38342F]/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B9A58A]/5 blur-3xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Date & Clock Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2.5 px-6 rounded-2xl bg-[#1B1B1B]/70 border border-[#38342F] text-xs text-[#A8A29A]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#B9A58A]" />
            <span className="font-journal capitalize">{dateStr || 'Tháng 11 năm 2026'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#22201E] border border-[#38342F] text-[#B9A58A] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đã bên nhau {daysTogether} ngày thanh xuân</span>
            </span>

            <div className="flex items-center gap-1.5 text-[#F0EBDD] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#B9A58A]" />
              <span>{timeStr || '08:00:00'}</span>
            </div>
          </div>
        </div>

        {/* Hero Grid: Left Content & Right Polaroid Cover */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Slogan, and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* School Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B1B1B] border border-[#38342F] text-[#B9A58A] text-xs font-medium">
              <Feather className="w-3.5 h-3.5" />
              <span>{classInfo.school} • Niên khóa {classInfo.academicYear}</span>
            </div>

            {/* Handwritten Main Heading */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="font-handwriting font-bold text-5xl sm:text-6xl text-[#B9A58A]">
                  10/12
                </span>
                <span className="h-px w-16 bg-[#38342F] hidden sm:block" />
              </div>

              <h1 className="font-handwriting text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F0EBDD] leading-tight">
                {classInfo.heroTitle}
              </h1>

              <p className="font-handwriting italic text-2xl sm:text-3xl text-[#B9A58A] font-medium">
                "{classInfo.heroSubtitle}"
              </p>
            </div>

            {/* Body Description */}
            <p className="text-base sm:text-lg text-[#A8A29A] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans-body">
              {classInfo.heroDescription}
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#B9A58A] hover:bg-[#a89376] text-[#111111] font-bold text-base shadow-lg shadow-[#B9A58A]/15 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <span>Khám phá lớp mình</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewMemories}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#1B1B1B] hover:bg-[#22201E] text-[#F0EBDD] font-semibold text-base border border-[#38342F] hover:border-[#B9A58A]/60 shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Heart className="w-4 h-4 text-[#B9A58A] fill-[#B9A58A]/30" />
                <span>Xem kỷ niệm</span>
              </button>
            </div>

            {/* Class Stats Counter Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-[#38342F]">
              <div className="bg-[#1B1B1B]/80 p-3.5 rounded-2xl border border-[#38342F] text-center">
                <span className="block text-[11px] uppercase tracking-wider text-[#A8A29A] font-journal">Sĩ Số Lớp</span>
                <span className="font-handwriting text-3xl font-bold text-[#F0EBDD]">{classInfo.totalMembers}</span>
                <span className="block text-[10px] text-[#A8A29A]">Mảnh ghép yêu thương</span>
              </div>

              <div className="bg-[#1B1B1B]/80 p-3.5 rounded-2xl border border-[#38342F] text-center">
                <span className="block text-[11px] uppercase tracking-wider text-[#A8A29A] font-journal">GVCN</span>
                <span className="font-handwriting text-2xl font-bold text-[#B9A58A] truncate block">
                  {classInfo.headTeacher.name.replace('Cô ', '')}
                </span>
                <span className="block text-[10px] text-[#A8A29A]">Môn Ngữ Văn</span>
              </div>

              <div className="bg-[#1B1B1B]/80 p-3.5 rounded-2xl border border-[#38342F] text-center">
                <span className="block text-[11px] uppercase tracking-wider text-[#A8A29A] font-journal">Niên Khóa</span>
                <span className="font-handwriting text-2xl font-bold text-[#F0EBDD]">{classInfo.academicYear}</span>
                <span className="block text-[10px] text-[#A8A29A]">3 năm gắn bó</span>
              </div>

              <div className="bg-[#1B1B1B]/80 p-3.5 rounded-2xl border border-[#38342F] text-center">
                <span className="block text-[11px] uppercase tracking-wider text-[#A8A29A] font-journal">Khoảnh Khắc</span>
                <span className="font-handwriting text-3xl font-bold text-[#B9A58A]">1000+</span>
                <span className="block text-[10px] text-[#A8A29A]">Kỷ niệm vô giá</span>
              </div>
            </div>

          </div>

          {/* Right Column: Polaroid Class Photo Frame with Washi Tape */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Polaroid Frame */}
              <div className="polaroid-card washi-tape rounded-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-[#111111]">
                  <img
                    src={classInfo.coverImage}
                    alt="Tập thể lớp 10/12"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-journal text-[#B9A58A] bg-black/60 px-2.5 py-1 rounded-md border border-[#38342F]">
                      Ảnh bìa tập thể 10/12
                    </span>
                  </div>
                </div>

                {/* Handwritten Polaroid Caption */}
                <div className="pt-3 text-center space-y-1">
                  <p className="font-handwriting text-2xl font-bold text-[#F0EBDD]">
                    "Dưới bầu trời năm ấy, chúng mình gặp nhau..."
                  </p>
                  <p className="text-[11px] text-[#A8A29A] font-journal">
                    10/12 • THPT Chuyên Nguyễn Huệ
                  </p>
                </div>
              </div>

              {/* Decorative Wax Seal / Slogan Sticker */}
              <div className="absolute -bottom-5 -right-3 bg-[#22201E] border border-[#B9A58A] px-4 py-2 rounded-2xl shadow-xl rotate-[-4deg] text-xs font-handwriting text-[#B9A58A] flex items-center gap-1.5">
                <span>✦ Thanh xuân mang tên chúng ta ✦</span>
              </div>
            </div>
          </div>

        </div>

        {/* Handwritten Class Note on Lined Notebook Paper */}
        <div className="notebook-lined p-6 sm:p-8 rounded-3xl border border-[#38342F] shadow-2xl space-y-3 relative">
          <div className="flex items-center gap-2 text-[#B9A58A] text-xs font-bold uppercase tracking-wider">
            <Feather className="w-4 h-4 text-[#B9A58A]" />
            <span className="font-journal text-sm">Lời nhắn gửi của tập thể 10/12</span>
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#F0EBDD] leading-relaxed">
            "{classInfo.quoteNotice}"
          </p>

          <div className="flex items-center justify-between text-xs text-[#A8A29A] pt-2 border-t border-[#38342F]/50">
            <span className="font-journal">Trích từ cuốn sổ lưu bút trang đầu tiên</span>
            <span className="font-handwriting text-lg text-[#B9A58A]">~ Tập thể 10/12 dấu yêu ~</span>
          </div>
        </div>

      </div>
    </section>
  );
};
