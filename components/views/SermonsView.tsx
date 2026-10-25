'use client';

import React, { useState } from 'react';
import { Sermon } from '../../types/pcg';
import { filterSermons, formatPcgDate, formatAudioDuration } from '../../lib/pcg-logic';
import {
  Search,
  Radio,
  Play,
  Video,
  Download,
  Share2,
  Calendar,
  BookOpen,
  User,
  Filter,
  Check,
} from 'lucide-react';

interface SermonsViewProps {
  sermons: Sermon[];
  onPlayAudio: (sermon: Sermon) => void;
  onPlayVideo: (sermon: Sermon) => void;
}

export function SermonsView({ sermons, onPlayAudio, onPlayVideo }: SermonsViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [presbytery, setPresbytery] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only published sermons for public visitors
  const publishedSermons = sermons.filter((s) => s.status === 'published');

  const filtered = filterSermons(publishedSermons, {
    search,
    category,
    presbytery,
    status: 'published',
  });

  const handleShare = (sermon: Sermon) => {
    navigator.clipboard.writeText(window.location.origin + `?sermon=${sermon.id}`);
    setCopiedId(sermon.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          The Living Word
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Sermons & Spiritual Media
        </h1>
        <p className="text-xs text-slate-500">
          Listen, watch, and download inspired biblical expositions from Presbyterian preachers across Ghana.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sermons by title, preacher, scripture, or theme..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
          >
            <option value="all">All Service Categories</option>
            <option value="Sunday Service">Sunday Service</option>
            <option value="Midweek Service">Midweek Service</option>
            <option value="Youth Conference">Youth Conference</option>
            <option value="Communion">Holy Communion</option>
            <option value="Revival">Revival & Deliverance</option>
          </select>

          {/* Presbytery Filter */}
          <select
            value={presbytery}
            onChange={(e) => setPresbytery(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
          >
            <option value="all">All Presbyteries</option>
            <option value="General Assembly">General Assembly (Head Office)</option>
            <option value="Ga Presbytery">Ga Presbytery</option>
            <option value="Asante Presbytery">Asante Presbytery</option>
            <option value="Akuapem Presbytery">Akuapem Presbytery</option>
            <option value="Northern Presbytery">Northern Presbytery</option>
          </select>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong> published sermons
          </span>
          {(search || category !== 'all' || presbytery !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
                setPresbytery('all');
              }}
              className="text-[#C41230] font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Sermons Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Radio className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold font-serif text-slate-700 text-base">No Sermons Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sermon) => (
            <div
              key={sermon.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={sermon.coverImage}
                    alt={sermon.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B3056]/90 backdrop-blur-xs text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded">
                    {sermon.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-[10px] font-mono text-white px-2 py-0.5 rounded">
                    {formatAudioDuration(sermon.durationSeconds)}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    {formatPcgDate(sermon.date)} • {sermon.presbytery}
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B3056]">
                    <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{sermon.speaker}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-[#C41230] shrink-0" />
                    <span>{sermon.scripture}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {sermon.description}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlayAudio(sermon)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3056] text-white text-xs font-bold hover:bg-[#002B49] shadow-xs"
                    title="Play Audio"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Listen</span>
                  </button>

                  {sermon.videoUrl && (
                    <button
                      onClick={() => onPlayVideo(sermon)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C41230] text-white text-xs font-bold hover:bg-[#A30F28] shadow-xs"
                      title="Watch Video"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(sermon)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Share Sermon Link"
                  >
                    {copiedId === sermon.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  {sermon.audioUrl && (
                    <a
                      href={sermon.audioUrl}
                      download={`${sermon.title}.mp3`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Download MP3"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
