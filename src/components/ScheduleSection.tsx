import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  Sparkles, 
  MapPin, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { WEEKLY_SCHEDULE } from '../data/mockData';

export const ScheduleSection: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const activeDay = WEEKLY_SCHEDULE[selectedDayIndex];

  return (
    <div className="py-12 space-y-12">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            Học Tập & Nề Nếp
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-slate-900">
            Thời Khóa Biểu & Lịch Trực Nhật
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-sans-body">
            Theo dõi lịch học các ngày trong tuần và phân công trực nhật của từng tổ để luôn sẵn sàng cho mỗi buổi đến trường.
          </p>
        </div>
      </section>

      {/* 2. Interactive Day Selector Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {WEEKLY_SCHEDULE.map((day, idx) => (
            <button
              key={day.dayShort}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDayIndex === idx
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-600/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{day.dayName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                selectedDayIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                5 Tiết
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Daily Content: Periods List & Duty Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Timetable Periods */}
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">
                  Lịch Học Buổi Sáng
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-slate-900">
                  {activeDay.dayName}
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
                07:15 - 11:30
              </span>
            </div>

            {/* Periods */}
            <div className="space-y-3">
              {activeDay.morning.map((p) => (
                <div
                  key={p.period}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-serif-title font-bold text-sm">
                      T{p.period}
                    </div>
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-slate-900">
                        {p.subject}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Giáo viên: <strong className="text-slate-700 font-semibold">{p.teacher}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {p.room || 'P.302'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Day Note / Reminders */}
            {activeDay.note && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Lưu ý trong ngày:</strong>
                  <span>{activeDay.note}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Duty Team & Classroom Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Cleaning Duty Roster */}
            <div className="rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 border border-sky-100 shadow-md p-6 space-y-4">
              <div className="flex items-center gap-2 text-sky-700">
                <Users className="w-5 h-5 text-sky-600" />
                <h4 className="font-serif-title font-bold text-lg text-slate-900">
                  Lịch Trực Nhật Hôm Nay
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-2">
                <span className="text-xs text-slate-500 font-medium">Đơn vị trực nhật:</span>
                <p className="font-serif-title font-bold text-base text-sky-800">
                  {activeDay.dutyTeam}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block">Nhiệm vụ trực nhật:</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Đến sớm 15 phút mở cửa, lau bảng và giặt khăn lau.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Kê bàn ghế ngay ngắn, cắm hoa trên bàn giáo viên.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Cuối buổi tắt quạt, tắt điện và đổ rác đúng nơi quy định.</span>
                </div>
              </div>
            </div>

            {/* Quick Tip Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-6 space-y-3 text-xs text-slate-600">
              <span className="font-serif-title font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                Mẹo học tập 10/12
              </span>
              <p className="leading-relaxed">
                "Chuẩn bị bài vở kỹ trước mỗi buổi học, mượn vở bạn bù bài nếu nghỉ ốm và đừng ngần ngại hỏi thầy cô hoặc các bạn trong ban cán sự khi gặp bài toán khó nhé!"
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
