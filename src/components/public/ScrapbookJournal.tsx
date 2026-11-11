import React from 'react';
import { BookOpen, Calendar, User, Feather, Quote } from 'lucide-react';
import { ScrapbookJournal as IScrapbookJournal } from '../../types/scrapbook';

interface ScrapbookJournalProps {
  journals: IScrapbookJournal[];
}

export const ScrapbookJournal: React.FC<ScrapbookJournalProps> = ({ journals }) => {
  return (
    <div className="py-12 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1B1B] text-[#B9A58A] border border-[#38342F]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Những Trang Viết Đầy Xúc Cảm</span>
        </span>
        <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#F0EBDD]">
          Nhật Ký Thanh Xuân 10/12
        </h2>
        <p className="text-sm text-[#A8A29A]">
          Nơi lưu lại những dòng tâm sự, câu chuyện chưa kể và ký ức một thời áo trắng tinh khôi.
        </p>
      </div>

      {/* 2. Journal Pages (Notebook style) */}
      <div className="space-y-10">
        {journals.map((entry, index) => {
          return (
            <article
              key={entry.id}
              className="notebook-lined p-8 sm:p-12 rounded-3xl border border-[#38342F] shadow-2xl space-y-6 relative washi-tape"
            >
              {/* Top metadata stamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#38342F]/60">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#111111] border border-[#38342F] flex items-center justify-center text-[#B9A58A] font-handwriting font-bold text-lg">
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[#A8A29A] font-journal">
                    <Calendar className="w-3.5 h-3.5 text-[#B9A58A]" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {entry.author && (
                  <div className="flex items-center gap-1.5 text-xs text-[#B9A58A] font-journal bg-[#111111]/80 px-3 py-1 rounded-lg border border-[#38342F]">
                    <Feather className="w-3 h-3" />
                    <span>Người chắp bút: {entry.author}</span>
                  </div>
                )}
              </div>

              {/* Title & Content */}
              <div className="space-y-4">
                <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-[#F0EBDD] leading-tight">
                  {entry.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className={entry.image ? 'md:col-span-8' : 'md:col-span-12'}>
                    <p className="font-handwriting text-xl sm:text-2xl text-[#F0EBDD] leading-relaxed whitespace-pre-wrap">
                      "{entry.content}"
                    </p>
                  </div>

                  {entry.image && (
                    <div className="md:col-span-4 polaroid-card rounded-2xl rotate-1">
                      <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#111111]">
                        <img
                          src={entry.image}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-journal text-center text-[11px] text-[#A8A29A] pt-2">
                        Ảnh đính kèm trang viết
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom sign-off */}
              <div className="pt-4 flex items-center justify-between text-xs text-[#A8A29A] border-t border-[#38342F]/60">
                <span className="font-journal">Lưu giữ tại THPT Chuyên Nguyễn Huệ</span>
                <span className="font-handwriting text-lg text-[#B9A58A]">~ 10/12 Mãi Bên Nhau ~</span>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
