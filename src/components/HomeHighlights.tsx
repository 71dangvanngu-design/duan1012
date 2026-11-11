import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  MapPin, 
  Clock, 
  Quote, 
  RefreshCw, 
  ArrowRight, 
  Sparkles,
  Camera,
  ChevronRight
} from 'lucide-react';
import { Announcement, ClassEvent, MemoryItem } from '../types';
import { INSPIRING_QUOTES } from '../data/mockData';
import { getDaysUntilEvent } from '../utils/classUtils';

interface HomeHighlightsProps {
  announcements: Announcement[];
  events: ClassEvent[];
  memories: MemoryItem[];
  onViewAllAnnouncements?: () => void;
  onViewAllEvents: () => void;
  onViewAllMemories: () => void;
  onSelectMemory: (item: MemoryItem) => void;
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({
  announcements,
  events,
  memories,
  onViewAllEvents,
  onViewAllMemories,
  onSelectMemory,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length);
  };

  const currentQuote = INSPIRING_QUOTES[quoteIndex];
  const featuredMemories = memories.slice(0, 4);

  return (
    <div className="py-12 space-y-16">
      
      {/* 1. Class Spotlight & Quote of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-2 text-center md:text-left">
              <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300">
                <Quote className="w-8 h-8" />
              </div>
            </div>
            <div className="md:col-span-8 space-y-3 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300 flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Thông điệp thanh xuân mỗi ngày
              </span>
              <p className="font-serif-title italic text-lg sm:text-2xl text-slate-100 font-medium leading-relaxed">
                "{currentQuote.quote}"
              </p>
              <p className="text-sm text-sky-200 font-medium">
                — {currentQuote.author}
              </p>
            </div>
            <div className="md:col-span-2 text-center md:text-right">
              <button
                onClick={nextQuote}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer active:scale-95"
                title="Đổi thông điệp khác"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi câu khác</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grid: Announcements (Thông báo mới) & Upcoming Events (Sự kiện sắp diễn ra) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Latest Announcements */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-slate-900">
                    Bảng Tin & Thông Báo Lớp
                  </h2>
                  <p className="text-xs text-slate-500">Cập nhật tin tức quan trọng từ Ban Cán Sự & GVCN</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {announcements.slice(0, 3).map((item) => {
                const tagColors = {
                  'Quan trọng': 'bg-rose-100 text-rose-800 border-rose-200',
                  'Lịch thi': 'bg-amber-100 text-amber-800 border-amber-200',
                  'Hoạt động': 'bg-sky-100 text-sky-800 border-sky-200',
                  'Tin vui': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                }[item.tag] || 'bg-slate-100 text-slate-800';

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tagColors}`}>
                          {item.tag}
                        </span>
                        {item.isPinned && (
                          <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                            📌 Ghim
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                    </div>

                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>Người đăng: <strong className="text-slate-700 font-semibold">{item.author}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Widget */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-slate-900">
                    Sự Kiện Sắp Tới
                  </h2>
                  <p className="text-xs text-slate-500">Đếm ngược những cột mốc đáng nhớ</p>
                </div>
              </div>
              <button
                onClick={onViewAllEvents}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem lịch</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((event) => {
                const daysLeft = getDaysUntilEvent(event.date);

                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex items-start gap-3.5"
                  >
                    <div className="flex-shrink-0 w-16 p-2 rounded-xl bg-sky-50 border border-sky-100 text-center">
                      <span className="block text-[10px] uppercase font-semibold text-sky-600">
                        {event.date.slice(5, 7) ? `Tháng ${event.date.slice(5, 7)}` : 'Sự kiện'}
                      </span>
                      <span className="block font-serif-title text-xl font-bold text-slate-900 leading-tight">
                        {event.date.slice(8, 10)}
                      </span>
                      <span className={`block text-[9px] font-bold px-1 py-0.5 rounded-md mt-1 ${
                        daysLeft > 0 
                          ? 'bg-amber-100 text-amber-800' 
                          : daysLeft === 0 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {daysLeft > 0 ? `Còn ${daysLeft} ngày` : daysLeft === 0 ? 'Hôm nay' : 'Đã qua'}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {event.category}
                        </span>
                      </div>
                      <h4 className="font-serif-title font-bold text-sm sm:text-base text-slate-900 truncate">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Memories Gallery Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900">
                Khoảnh Khắc Đáng Nhớ Của 10/12
              </h2>
              <p className="text-sm text-slate-500">Mỗi tấm ảnh là một câu chuyện thanh xuân không bao giờ quên</p>
            </div>
          </div>
          <button
            onClick={onViewAllMemories}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <span>Xem tất cả album</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMemories.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectMemory(photo)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {photo.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white font-medium">Bấm để xem ảnh phóng to</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-serif-title font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {photo.caption}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                  <span>{photo.date}</span>
                  <span className="text-rose-500 font-semibold">❤️ {photo.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
