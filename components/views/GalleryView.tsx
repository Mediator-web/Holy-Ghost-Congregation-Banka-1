'use client';

import React, { useState } from 'react';
import { GalleryAlbum, GalleryPhoto } from '../../types/pcg';
import { formatPcgDate } from '../../lib/pcg-logic';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GalleryViewProps {
  gallery: GalleryAlbum[];
}

export function GalleryView({ gallery }: GalleryViewProps) {
  const [activePhoto, setActivePhoto] = useState<{
    albumTitle: string;
    photo: GalleryPhoto;
    albumPhotos: GalleryPhoto[];
    index: number;
  } | null>(null);

  const publishedAlbums = gallery.filter((a) => a.status === 'published');

  const handleNext = () => {
    if (!activePhoto) return;
    const nextIdx = (activePhoto.index + 1) % activePhoto.albumPhotos.length;
    setActivePhoto({
      ...activePhoto,
      photo: activePhoto.albumPhotos[nextIdx],
      index: nextIdx,
    });
  };

  const handlePrev = () => {
    if (!activePhoto) return;
    const prevIdx = (activePhoto.index - 1 + activePhoto.albumPhotos.length) % activePhoto.albumPhotos.length;
    setActivePhoto({
      ...activePhoto,
      photo: activePhoto.albumPhotos[prevIdx],
      index: prevIdx,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Visual Chronicles
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Church Photo Gallery
        </h1>
        <p className="text-xs text-slate-500">
          Photographic memories from the General Assembly, synodical gatherings, choral festivals, and parish celebrations.
        </p>
      </div>

      {/* Albums */}
      <div className="space-y-12">
        {publishedAlbums.map((album) => (
          <div key={album.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C41230]">
                  {album.category}
                </span>
                <h2 className="text-xl font-bold font-serif text-slate-900 mt-0.5">
                  {album.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  {album.description}
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatPcgDate(album.eventDate)}</span>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() =>
                    setActivePhoto({
                      albumTitle: album.title,
                      photo,
                      albumPhotos: album.photos,
                      index: idx,
                    })
                  }
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 shadow-xs hover:shadow-md transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                    <p className="text-xs font-medium line-clamp-2 leading-tight">
                      {photo.caption}
                    </p>
                    <span className="text-[10px] text-amber-300 font-mono mt-1">
                      {photo.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors z-10"
            aria-label="Close zoom viewer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-700 bg-black mb-4">
              <img
                src={activePhoto.photo.url}
                alt={activePhoto.photo.caption}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="text-center text-white max-w-xl">
              <span className="text-xs text-amber-400 font-mono block mb-1">
                {activePhoto.albumTitle} ({activePhoto.index + 1} of {activePhoto.albumPhotos.length})
              </span>
              <p className="text-sm font-medium text-slate-200">
                {activePhoto.photo.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
