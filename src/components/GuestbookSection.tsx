import React, { useState } from 'react';
import { 
  BookOpen, 
  Send, 
  Heart, 
  Sparkles, 
  Smile, 
  Tag, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryNote } from '../types';

interface GuestbookSectionProps {
  notes: MemoryNote[];
  onAddNote: (note: MemoryNote) => void;
  onLikeNote: (id: string) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  notes,
  onAddNote,
  onLikeNote,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [roleOrTag, setRoleOrTag] = useState('');
  const [content, setContent] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('✨');
  const [selectedColor, setSelectedColor] = useState<MemoryNote['colorTheme']>('pink');
  const [selectedSticker, setSelectedSticker] = useState('❤️');

  const emojis = ['✨', '🌸', '👓', '📚', '🎒', '🎨', '🔥', '💖', '⭐', '🎈'];
  const stickers = ['❤️', '🔥', '✨', '💐', '🎓', '💯', '🌈', '🎉'];

  const colorThemes: { key: MemoryNote['colorTheme']; label: string; bgClass: string; borderClass: string }[] = [
    { key: 'yellow', label: 'Vàng nắng', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
    { key: 'pink', label: 'Hồng phấn', bgClass: 'bg-rose-50', borderClass: 'border-rose-200' },
    { key: 'blue', label: 'Xanh trời', bgClass: 'bg-sky-50', borderClass: 'border-sky-200' },
    { key: 'green', label: 'Xanh mint', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' },
    { key: 'purple', label: 'Tím mộng mơ', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    const newNote: MemoryNote = {
      id: 'note_' + Date.now(),
      authorName: authorName.trim(),
      roleOrTag: roleOrTag.trim() || 'Thành viên 10/12',
      avatarEmoji,
      content: content.trim(),
      colorTheme: selectedColor,
      likes: 1,
      date: new Date().toLocaleDateString('vi-VN'),
      stickers: [selectedSticker, '💖'],
    };

    onAddNote(newNote);

    // Youth celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti blocked
    }

    // Reset inputs
    setContent('');
    setRoleOrTag('');
  };

  return (
    <div className="py-12 space-y-12">
      
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 border border-pink-200">
            <BookOpen className="w-3.5 h-3.5 text-pink-600" />
            Lưu Bút Tuổi Học Trò
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-slate-900">
            Bức Tường Kỷ Niệm 10/12
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-sans-body">
            Gửi gắm một lời nhắn nhủ, một lời chúc thi tốt hay một lời xin lỗi đáng yêu gửi đến bạn bè và thầy cô cùng lớp!
          </p>
        </div>
      </section>

      {/* 2. Interactive Note Creator */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <h2 className="font-serif-title font-bold text-lg text-slate-900">
              Dán Giấy Nhớ Kỷ Niệm Mới
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên hoặc biệt danh của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ví dụ: Châu Miu, Ẩn danh tổ 3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chức vụ hoặc vị trí
                </label>
                <input
                  type="text"
                  value={roleOrTag}
                  onChange={(e) => setRoleOrTag(e.target.value)}
                  placeholder="Ví dụ: Bí thư, Bàn 3 tổ 2..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nội dung dòng lưu bút <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết một lời chúc, một cảm xúc thanh xuân gửi tới tập thể 10/12..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Customization Options: Emoji & Color & Sticker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Emoji avatar selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Biểu tượng cảm xúc
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {emojis.slice(0, 6).map((emo) => (
                    <button
                      type="button"
                      key={emo}
                      onClick={() => setAvatarEmoji(emo)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                        avatarEmoji === emo
                          ? 'bg-sky-100 border-2 border-sky-600 scale-110'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Màu giấy nhớ
                </label>
                <div className="flex items-center gap-2">
                  {colorThemes.map((col) => (
                    <button
                      type="button"
                      key={col.key}
                      onClick={() => setSelectedColor(col.key)}
                      title={col.label}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        col.key === 'yellow' ? 'bg-amber-200' :
                        col.key === 'pink' ? 'bg-rose-200' :
                        col.key === 'blue' ? 'bg-sky-200' :
                        col.key === 'green' ? 'bg-emerald-200' : 'bg-purple-200'
                      } ${selectedColor === col.key ? 'scale-125 border-slate-900 shadow-xs' : 'border-white'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Sticker selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sticker đính kèm
                </label>
                <div className="flex items-center gap-1.5">
                  {stickers.slice(0, 5).map((stk) => (
                    <button
                      type="button"
                      key={stk}
                      onClick={() => setSelectedSticker(stk)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-transform cursor-pointer ${
                        selectedSticker === stk ? 'bg-slate-200 scale-110' : 'hover:bg-slate-100'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời nhắn lên bảng</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Wall of Notes (Lưới Sticky Notes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const themeConfig = {
              yellow: 'bg-amber-50/90 border-amber-200 text-slate-800 shadow-amber-100',
              pink: 'bg-rose-50/90 border-rose-200 text-slate-800 shadow-rose-100',
              blue: 'bg-sky-50/90 border-sky-200 text-slate-800 shadow-sky-100',
              green: 'bg-emerald-50/90 border-emerald-200 text-slate-800 shadow-emerald-100',
              purple: 'bg-purple-50/90 border-purple-200 text-slate-800 shadow-purple-100',
            }[note.colorTheme] || 'bg-amber-50 border-amber-200 text-slate-800';

            return (
              <div
                key={note.id}
                className={`relative p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 ${themeConfig}`}
              >
                {/* Top Pin / Sticker decorative icon */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-white/70 shadow-2xs">
                      {note.avatarEmoji}
                    </span>
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-slate-900 leading-tight">
                        {note.authorName}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {note.roleOrTag}
                      </span>
                    </div>
                  </div>

                  {note.stickers && note.stickers.length > 0 && (
                    <div className="flex gap-1 text-lg">
                      {note.stickers.map((stk, idx) => (
                        <span key={idx}>{stk}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note message */}
                <p className="font-serif-title italic text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  "{note.content}"
                </p>

                {/* Footer with date and like heart action */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60">
                  <span>{note.date}</span>

                  <button
                    onClick={() => onLikeNote(note.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white text-rose-600 font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{note.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
