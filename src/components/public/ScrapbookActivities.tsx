import React from 'react';
import { Calendar, Tag, Sparkles, MapPin } from 'lucide-react';
import { ScrapbookActivity } from '../../types/scrapbook';

interface ScrapbookActivitiesProps {
  activities: ScrapbookActivity[];
}

export const ScrapbookActivities: React.FC<ScrapbookActivitiesProps> = ({ activities }) => {
  return (
    <div className="py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header */}
      <div className="space-y-2 pb-6 border-b border-[#38342F]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1B1B] text-[#B9A58A] border border-[#38342F]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sự Kiện & Phong Trào</span>
        </span>
        <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#F0EBDD]">
          Hoạt Động Nổi Bật Của 10/12
        </h2>
        <p className="text-sm text-[#A8A29A]">
          Ghi lại những dấu ấn nhiệt huyết trên sân thi đấu, ánh đèn sân khấu và những bữa tiệc sinh nhật ấm áp.
        </p>
      </div>

      {/* 2. Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activities.map((act, index) => {
          return (
            <div
              key={act.id}
              className="bg-[#1B1B1B] border border-[#38342F] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-[#B9A58A]/70 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Media Image */}
                {act.image && (
                  <div className="aspect-16/9 rounded-2xl overflow-hidden bg-[#111111] border border-[#38342F]">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Badge & Date */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-3 py-1 rounded-md font-journal font-semibold bg-[#22201E] text-[#B9A58A] border border-[#38342F]">
                    🏷️ {act.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#A8A29A] font-journal">
                    <Calendar className="w-3.5 h-3.5 text-[#B9A58A]" />
                    {act.date}
                  </span>
                </div>

                <h3 className="font-handwriting text-3xl font-bold text-[#F0EBDD] leading-tight">
                  {act.title}
                </h3>

                <p className="text-sm text-[#A8A29A] font-sans-body leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#38342F] flex items-center justify-between text-xs text-[#A8A29A] font-journal">
                <span>Tập thể lớp 10/12</span>
                <span className="text-[#B9A58A]">✦ Kỷ niệm đẹp</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
