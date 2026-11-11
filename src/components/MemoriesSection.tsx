import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Upload, 
  Heart, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar, 
  User, 
  Filter, 
  Maximize2,
  Share2,
  Check,
  Film
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';

interface MemoriesSectionProps {
  memories: MemoryItem[];
  onAddMemory: (newItem: MemoryItem) => void;
  onLikeMemory: (id: string) => void;
  selectedMemoryForLightbox?: MemoryItem | null;
  onCloseLightbox?: () => void;
  isAddMemoryModalOpen?: boolean;
  setIsAddMemoryModalOpen?: (open: boolean) => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  memories,
  onAddMemory,
  onLikeMemory,
  selectedMemoryForLightbox,
  onCloseLightbox,
  isAddMemoryModalOpen: externalIsAddOpen,
  setIsAddMemoryModalOpen: externalSetIsAddOpen
}) => {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory>('Tất cả');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Local state for add memory modal if not controlled from parent
  const [internalIsAddOpen, setInternalIsAddOpen] = useState(false);
  const isAddOpen = externalIsAddOpen !== undefined ? externalIsAddOpen : internalIsAddOpen;
  const setIsAddOpen = externalSetIsAddOpen || setInternalIsAddOpen;

  // New photo form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Khoảnh khắc thường nhật');
  const [formUrl, setFormUrl] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formDate, setFormDate] = useState('2025-03-10');
  const [formUploader, setFormUploader] = useState('');
  const [formIsVideo, setFormIsVideo] = useState(false);
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const categories: MemoryCategory[] = [
    'Tất cả',
    'Khai giảng',
    '20/11 Tri ân',
    'Cắm trại 26/3',
    'Dã ngoại & Ngoại khóa',
    'Khoảnh khắc thường nhật',
    'Dìm hàng đáng yêu',
    'Video kỷ niệm',
  ];

  const filteredMemories = useMemo(() => {
    if (activeCategory === 'Tất cả') return memories;
    if (activeCategory === 'Video kỷ niệm') {
      return memories.filter((m) => m.isVideo || m.category === 'Video kỷ niệm');
    }
    return memories.filter((m) => m.category === activeCategory);
  }, [memories, activeCategory]);

  // Open Lightbox
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    if (onCloseLightbox) onCloseLightbox();
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredMemories.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredMemories.length - 1 ? prev! + 1 : 0));
  };

  // Handle image file input (base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const fallbackUrl = formUrl.trim() || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop';

    const newItem: MemoryItem = {
      id: 'mem_' + Date.now(),
      title: formTitle,
      category: formCategory,
      url: fallbackUrl,
      date: formDate.split('-').reverse().join('/'),
      caption: formCaption || 'Một khoảnh khắc thanh xuân vô giá cùng 10/12.',
      likes: 1,
      uploader: formUploader.trim() || 'Thành viên 10/12',
      isVideo: formIsVideo,
      videoUrl: formIsVideo ? (formVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ') : undefined,
    };

    onAddMemory(newItem);
    setIsAddOpen(false);

    // Reset fields
    setFormTitle('');
    setFormCaption('');
    setFormUrl('');
    setFormVideoUrl('');
    setFormIsVideo(false);
  };

  const currentLightboxItem = lightboxIndex !== null ? filteredMemories[lightboxIndex] : selectedMemoryForLightbox || null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="py-12 space-y-10">
      
      {/* 1. Section Header & Upload CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              <Camera className="w-3.5 h-3.5 text-rose-600" />
              Thanh Xuân Qua Từng Ống Kính
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-slate-900">
              Góc Kỷ Niệm 10/12
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Thư viện ảnh và video lưu giữ những khoảnh khắc quý giá nhất của 42 thành viên: từ ngày đầu bỡ ngỡ, những đêm lửa trại đến những nụ cười rạng rỡ thường nhật.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-semibold shadow-md shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Tải lên kỷ niệm mới</span>
          </button>
        </div>

        {/* 2. Category Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'Video kỷ niệm' ? '🎬 ' + cat : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Photos & Videos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Camera className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif-title text-lg font-bold text-slate-700">
              Chưa có kỷ niệm nào trong mục này
            </h3>
            <p className="text-sm text-slate-500">
              Hãy là người đầu tiên tải lên bức ảnh hoặc video cho album "{activeCategory}"!
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100"
            >
              + Đăng ảnh ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredMemories.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Media Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Video indicator overlay */}
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Hover expand helper */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-black/60 text-white backdrop-blur-xs">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-base sm:text-lg text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Footer stats & uploader */}
                  <div className="pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeMemory(item.id);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          MODAL 1: Fullscreen Lightbox with Next/Prev
      ======================================================== */}
      {currentLightboxItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseLightbox}
        >
          {/* Previous Button */}
          {filteredMemories.length > 1 && (
            <button
              onClick={handlePrevPhoto}
              className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {filteredMemories.length > 1 && (
            <button
              onClick={handleNextPhoto}
              className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Content Container */}
          <div 
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 px-6 bg-slate-950/80 border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {currentLightboxItem.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • {currentLightboxItem.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                  title="Chia sẻ link"
                >
                  {copiedNotification ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedNotification ? 'Đã sao chép!' : 'Chia sẻ'}</span>
                </button>

                <button
                  onClick={handleCloseLightbox}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Đóng xem toàn màn hình"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] max-h-[65vh] overflow-hidden">
              {currentLightboxItem.isVideo && currentLightboxItem.videoUrl ? (
                <div className="w-full h-full aspect-video max-h-[60vh]">
                  <iframe
                    src={currentLightboxItem.videoUrl}
                    title={currentLightboxItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={currentLightboxItem.url}
                  alt={currentLightboxItem.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop";
                  }}
                  className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />
              )}
            </div>

            {/* Bottom Details Bar */}
            <div className="p-5 sm:p-6 bg-slate-950/90 text-white space-y-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif-title text-lg sm:text-xl font-bold text-white">
                  {currentLightboxItem.title}
                </h3>

                <button
                  onClick={() => onLikeMemory(currentLightboxItem.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs cursor-pointer transition-all active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{currentLightboxItem.likes} Thả tim</span>
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans-body">
                {currentLightboxItem.caption}
              </p>

              {currentLightboxItem.uploader && (
                <div className="text-xs text-slate-400 pt-1">
                  Đăng bởi: <span className="text-sky-300 font-medium">{currentLightboxItem.uploader}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: Add New Memory / Photo Upload
      ======================================================== */}
      {isAddOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsAddOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif-title text-xl font-bold text-slate-900">
                  Gửi Kỷ Niệm Của Bạn Đến 10/12
                </h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMemory} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề bức ảnh / video <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Nụ cười ngày cắm trại 26/3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chủ đề album
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                  >
                    {categories.filter((c) => c !== 'Tất cả').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày chụp
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Upload file or enter Image URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Chọn ảnh từ máy tính / điện thoại
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
                
                <div className="text-center text-xs text-slate-400 font-medium my-1">
                  — hoặc dán link ảnh trực tiếp (URL) —
                </div>

                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />

                {formUrl && (
                  <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <img src={formUrl} alt="Xem trước" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Video toggle option */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVideoCheckbox"
                    checked={formIsVideo}
                    onChange={(e) => setFormIsVideo(e.target.checked)}
                    className="rounded-sm text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="isVideoCheckbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Đây là một Video kỷ niệm (Youtube Embed)
                  </label>
                </div>

                {formIsVideo && (
                  <div>
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="Link embed Youtube (Ví dụ: https://www.youtube.com/embed/...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lời chú thích / Kỷ niệm gắn liền
                </label>
                <textarea
                  rows={3}
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Kể lại câu chuyện vui về bức ảnh này..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên người gửi ảnh
                </label>
                <input
                  type="text"
                  value={formUploader}
                  onChange={(e) => setFormUploader(e.target.value)}
                  placeholder="Ví dụ: Quân Cận, Châu Miu..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  Đăng lên kỷ niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
