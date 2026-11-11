import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar, 
  Maximize2, 
  Sparkles,
  LayoutGrid,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { ScrapbookImage, ScrapbookAlbum, GalleryLayoutType } from '../../types/scrapbook';

interface ScrapbookGalleryProps {
  gallery: ScrapbookImage[];
  albums: ScrapbookAlbum[];
  layoutType?: GalleryLayoutType;
}

export const ScrapbookGallery: React.FC<ScrapbookGalleryProps> = ({
  gallery,
  albums,
  layoutType = 'masonry',
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter gallery by album
  const filteredImages = useMemo(() => {
    if (selectedAlbumId === 'all') return gallery;
    return gallery.filter((img) => img.albumId === selectedAlbumId);
  }, [gallery, selectedAlbumId]);

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredImages.length - 1 ? prev! + 1 : 0));
  };

  return (
    <div className="py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header & Album Tabs */}
      <div className="space-y-6 pb-6 border-b border-[#38342F]">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B1B1B] text-[#B9A58A] border border-[#38342F]">
            <Camera className="w-3.5 h-3.5" />
            <span>Kho Lưu Trữ Hình Ảnh</span>
          </span>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#F0EBDD]">
            Thư Viện Ảnh Scrapbook 10/12
          </h2>
          <p className="text-sm text-[#A8A29A]">
            Từng khoảnh khắc được đóng khung, dán băng keo và lưu giữ trên những trang kỷ niệm.
          </p>
        </div>

        {/* Album Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedAlbumId('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedAlbumId === 'all'
                ? 'bg-[#B9A58A] text-[#111111] font-bold shadow-md'
                : 'bg-[#1B1B1B] text-[#A8A29A] hover:text-[#F0EBDD] border border-[#38342F]'
            }`}
          >
            Tất cả ảnh ({gallery.length})
          </button>

          {albums.map((album) => {
            const count = gallery.filter((img) => img.albumId === album.id).length;
            return (
              <button
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAlbumId === album.id
                    ? 'bg-[#B9A58A] text-[#111111] font-bold shadow-md'
                    : 'bg-[#1B1B1B] text-[#A8A29A] hover:text-[#F0EBDD] border border-[#38342F]'
                }`}
              >
                {album.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Photo Gallery Grid / Masonry */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-16 bg-[#1B1B1B] rounded-3xl border border-dashed border-[#38342F] p-8 space-y-3">
          <Camera className="w-12 h-12 text-[#38342F] mx-auto" />
          <h3 className="font-handwriting text-2xl text-[#F0EBDD]">Chưa có hình ảnh trong album này</h3>
          <p className="text-xs text-[#A8A29A]">Admin có thể thêm ảnh mới trong trang quản trị.</p>
        </div>
      ) : (
        <div
          className={
            layoutType === 'list'
              ? 'space-y-6 max-w-3xl mx-auto'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {filteredImages.map((img, index) => {
            const isPolaroid = img.frameStyle === 'polaroid' || layoutType === 'polaroid';
            const tilt = index % 3 === 0 ? 'rotate-[-1deg]' : index % 3 === 1 ? 'rotate-[1.5deg]' : 'rotate-0';

            return (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(index)}
                className={`group cursor-pointer rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                  isPolaroid
                    ? `polaroid-card washi-tape ${tilt}`
                    : 'bg-[#1B1B1B] border border-[#38342F] p-3 hover:border-[#B9A58A]/80 shadow-lg'
                }`}
              >
                {/* Media frame */}
                <div
                  className={`relative overflow-hidden rounded-xl bg-[#111111] ${
                    img.aspectRatio === '16:9'
                      ? 'aspect-video'
                      : img.aspectRatio === '3:4'
                      ? 'aspect-3/4'
                      : 'aspect-4/3'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Highlight star */}
                  {img.isFeatured && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#111111]/80 text-[#B9A58A] border border-[#B9A58A]/50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#B9A58A]" />
                        <span>Nổi bật</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 rounded-full bg-[#1B1B1B]/90 text-[#F0EBDD] border border-[#38342F]">
                      <Maximize2 className="w-5 h-5 text-[#B9A58A]" />
                    </div>
                  </div>
                </div>

                {/* Handwritten Caption under the photo */}
                <div className="pt-3.5 space-y-1">
                  <h3 className="font-handwriting font-bold text-2xl text-[#F0EBDD] group-hover:text-[#B9A58A] transition-colors leading-tight">
                    {img.title}
                  </h3>
                  {img.caption && (
                    <p className="text-xs text-[#A8A29A] font-sans-body line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  )}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#A8A29A]/80 font-journal">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B9A58A]" />
                      {img.date}
                    </span>
                    <span className="text-[#B9A58A]">✦ Nhấn để xem to</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Prev Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-20 p-3 rounded-full bg-[#1B1B1B]/80 text-[#F0EBDD] hover:bg-[#22201E] border border-[#38342F] cursor-pointer"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-20 p-3 rounded-full bg-[#1B1B1B]/80 text-[#F0EBDD] hover:bg-[#22201E] border border-[#38342F] cursor-pointer"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Container */}
          <div
            className="relative max-w-4xl w-full bg-[#1B1B1B] rounded-3xl overflow-hidden border border-[#38342F] shadow-2xl flex flex-col max-h-[92vh] washi-tape"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 px-6 bg-[#111111] border-b border-[#38342F] text-xs text-[#A8A29A]">
              <div className="flex items-center gap-2">
                <span className="font-handwriting text-lg text-[#B9A58A] font-bold">10/12 Scrapbook</span>
                <span>• {activeImage.date}</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-lg bg-[#22201E] hover:bg-[#38342F] text-[#F0EBDD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] max-h-[65vh] overflow-hidden">
              <img
                src={activeImage.url}
                alt={activeImage.title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Bottom Details */}
            <div className="p-5 sm:p-6 bg-[#1B1B1B] text-[#F0EBDD] space-y-2 border-t border-[#38342F]">
              <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-[#F0EBDD]">
                {activeImage.title}
              </h3>
              {activeImage.caption && (
                <p className="text-sm text-[#A8A29A] font-sans-body leading-relaxed">
                  {activeImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
