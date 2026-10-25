'use client';

import React from 'react';
import { Sermon } from '../types/pcg';
import { X, Calendar, User, BookOpen, Share2 } from 'lucide-react';
import { formatPcgDate } from '../lib/pcg-logic';

interface VideoPlayerModalProps {
  sermon: Sermon | null;
  onClose: () => void;
}

export function VideoPlayerModal({ sermon, onClose }: VideoPlayerModalProps) {
  if (!sermon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#081B2E] text-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-700 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors z-10"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Embed / Responsive Container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-4 border border-slate-800">
          <iframe
            src={sermon.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={sermon.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#C41230] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {sermon.category}
            </span>
            <span className="text-xs text-amber-300 font-mono">
              {sermon.presbytery}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatPcgDate(sermon.date)}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {sermon.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
            <User className="w-4 h-4 text-amber-400" />
            <span>{sermon.speaker}</span>
            <span className="text-xs text-slate-400">({sermon.speakerRole})</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scripture Reading: {sermon.scripture}</span>
            </div>
            <p className="italic text-slate-400">Theme: {sermon.theme}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {sermon.description}
          </p>
        </div>
      </div>
    </div>
  );
}
