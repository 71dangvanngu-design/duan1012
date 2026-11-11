import React, { useState, useMemo } from 'react';
import { Search, Users, X, Feather, Sparkles, Calendar, BookOpen } from 'lucide-react';
import { ScrapbookMember } from '../../types/scrapbook';

interface ScrapbookMembersProps {
  members: ScrapbookMember[];
}

export const ScrapbookMembers: React.FC<ScrapbookMembersProps> = ({ members }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMember, setActiveModalMember] = useState<ScrapbookMember | null>(null);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  return (
    <div className="py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#38342F]">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1B1B] text-[#B9A58A] border border-[#38342F]">
            <Users className="w-3.5 h-3.5" />
            <span>Đại Gia Đình 10/12</span>
          </span>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#F0EBDD]">
            Những Gương Mặt Thanh Xuân ({members.length})
          </h2>
          <p className="text-sm text-[#A8A29A]">
            Từng bức ảnh Polaroid lưu giữ nụ cười và nét bút độc bản của từng thành viên.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A8A29A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, biệt danh, vai trò..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#1B1B1B] border border-[#38342F] text-sm text-[#F0EBDD] placeholder-[#A8A29A]/60 focus:outline-hidden focus:border-[#B9A58A] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29A] hover:text-[#F0EBDD] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Polaroid Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-[#1B1B1B] rounded-3xl border border-dashed border-[#38342F] p-8 space-y-3">
          <Users className="w-12 h-12 text-[#38342F] mx-auto" />
          <h3 className="font-handwriting text-2xl text-[#F0EBDD]">Không tìm thấy thành viên phù hợp</h3>
          <p className="text-xs text-[#A8A29A]">Hãy thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => {
            // Subtle rotation tilt for scrapbook feel
            const tilts = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-0.8deg]', 'rotate-[1.2deg]'];
            const tiltClass = tilts[idx % tilts.length];

            return (
              <div
                key={member.id}
                onClick={() => setActiveModalMember(member)}
                className={`polaroid-card rounded-2xl cursor-pointer ${tiltClass} flex flex-col justify-between group`}
              >
                {/* Photo container with top washi tape */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#111111] border border-[#38342F]">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Role badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#111111]/85 text-[#B9A58A] border border-[#38342F] backdrop-blur-xs">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Handwritten details at the bottom of the Polaroid */}
                <div className="pt-3.5 space-y-1.5 text-center">
                  <h3 className="font-handwriting font-bold text-2xl text-[#F0EBDD] group-hover:text-[#B9A58A] transition-colors truncate">
                    {member.name}
                  </h3>

                  {member.nickname && (
                    <p className="font-journal text-xs text-[#B9A58A]">
                      "{member.nickname}"
                    </p>
                  )}

                  <p className="font-handwriting text-sm text-[#A8A29A] line-clamp-2 px-1 pt-1 leading-snug">
                    "{member.bio}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Member Detail Modal */}
      {activeModalMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalMember(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#1B1B1B] rounded-3xl border border-[#38342F] p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 washi-tape"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#22201E] text-[#A8A29A] hover:text-[#F0EBDD] cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Names */}
            <div className="text-center space-y-2">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto border-2 border-[#B9A58A] shadow-xl">
                <img
                  src={activeModalMember.avatar}
                  alt={activeModalMember.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22201E] text-[#B9A58A] border border-[#38342F] inline-block mb-1">
                  {activeModalMember.role}
                </span>
                <h3 className="font-handwriting text-3xl font-bold text-[#F0EBDD]">
                  {activeModalMember.name}
                </h3>
                {activeModalMember.nickname && (
                  <p className="font-journal text-sm text-[#B9A58A]">
                    Biệt danh: "{activeModalMember.nickname}"
                  </p>
                )}
              </div>
            </div>

            {/* Handwritten Quote */}
            <div className="notebook-lined p-4 rounded-2xl border border-[#38342F] text-center">
              <span className="text-[10px] font-journal uppercase tracking-wider text-[#B9A58A] block mb-1">
                Châm ngôn thanh xuân
              </span>
              <p className="font-handwriting text-xl text-[#F0EBDD]">
                "{activeModalMember.bio}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#A8A29A] pt-2 border-t border-[#38342F]">
              <span className="font-journal">Thành viên lớp 10/12</span>
              <button
                onClick={() => setActiveModalMember(null)}
                className="px-4 py-1.5 rounded-xl bg-[#B9A58A] text-[#111111] font-bold text-xs hover:bg-[#a89376]"
              >
                Gấp sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
