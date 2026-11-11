import React from 'react';
import { Sparkles, ArrowRight, Heart, Users, Calendar, Award } from 'lucide-react';
import { CLASS_INFO } from '../data/mockData';
import { calculateDaysTogether } from '../utils/classUtils';

interface HeroSectionProps {
  onExploreClass: () => void;
  onViewMemories: () => void;
  memberCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClass,
  onViewMemories,
  memberCount
}) => {
  const daysTogether = calculateDaysTogether(CLASS_INFO.startDate);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* Decorative ambient background blur orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-sky-200/50 via-blue-200/30 to-amber-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-sky-300/20 blur-2xl rounded-full -z-10" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-amber-200/20 blur-2xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Slogan, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-medium shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{CLASS_INFO.school} • Niên khóa {CLASS_INFO.academicYears}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                WELCOME TO <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700">
                  10/12
                </span>
              </h1>
              <p className="font-serif-title italic text-2xl sm:text-3xl text-sky-800/90 font-medium">
                "{CLASS_INFO.message}"
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans-body">
              {CLASS_INFO.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClass}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-semibold text-base shadow-lg shadow-sky-600/25 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Khám phá lớp mình</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onViewMemories}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200/90 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Xem kỷ niệm</span>
              </button>
            </div>

            {/* Counter badges: Số ngày thanh xuân & Thành viên */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/80">
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-sky-100 shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-sky-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Đã bên nhau</span>
                </div>
                <div className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
                  {daysTogether}
                </div>
                <div className="text-[11px] text-slate-500">Ngày thanh xuân</div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-blue-100 shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Sĩ số</span>
                </div>
                <div className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
                  {memberCount}
                </div>
                <div className="text-[11px] text-slate-500">Mảnh ghép diệu kỳ</div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-100 shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">GVCN</span>
                </div>
                <div className="font-serif-title text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  Cô Mai Lan
                </div>
                <div className="text-[11px] text-slate-500">Người mẹ hiền thứ 2</div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-100 shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Kỷ niệm</span>
                </div>
                <div className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
                  1000+
                </div>
                <div className="text-[11px] text-slate-500">Nụ cười & hoài niệm</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame / Class Photo Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main class hero photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 group bg-gradient-to-tr from-sky-700 via-blue-800 to-indigo-900">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
                  alt="Tập thể lớp 10/12 trong ngày khai giảng"
                  onError={(e) => {
                    // Fallback to high availability friendship sunset photo
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                    Ảnh lưu niệm tập thể
                  </span>
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Ngày đầu tiên chúng mình là 10/12
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    "Dưới bầu trời xanh năm ấy, chúng ta gặp gỡ..."
                  </p>
                </div>
              </div>

              {/* Small floating polaroid card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 rotate-[-4deg] hover:rotate-0 transition-transform duration-300 w-48">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop"
                  alt="Nụ cười thanh xuân"
                  className="w-full h-28 object-cover rounded-xl"
                />
                <p className="font-serif-title text-center text-xs text-slate-800 font-semibold mt-2">
                  Tri ân 20/11 ✨
                </p>
              </div>

              {/* Floating Slogan sticker */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold px-4 py-2 rounded-2xl shadow-lg rotate-3 text-xs flex items-center gap-1.5 border-2 border-white">
                <span>🔥 10/12 Cháy hết mình</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
