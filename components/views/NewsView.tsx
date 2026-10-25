'use client';

import React, { useState } from 'react';
import { NewsArticle, Announcement } from '../../types/pcg';
import { formatPcgDate } from '../../lib/pcg-logic';
import {
  Newspaper,
  Bell,
  Calendar,
  Clock,
  User,
  Search,
  BookOpen,
  ChevronRight,
  X,
  Share2,
  Check,
} from 'lucide-react';

interface NewsViewProps {
  news: NewsArticle[];
  announcements: Announcement[];
}

export function NewsView({ news, announcements }: NewsViewProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'news' | 'announcements'>('all');
  const [copied, setCopied] = useState(false);

  const publishedNews = news.filter((n) => n.status === 'published');
  const publishedAnnouncements = announcements.filter((a) => a.status === 'published');

  const filteredNews = publishedNews.filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.excerpt.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.presbytery.toLowerCase().includes(q)
    );
  });

  const filteredAnnouncements = publishedAnnouncements.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    );
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Press & Pastoral Notices
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          News, Communiques & Notices
        </h1>
        <p className="text-xs text-slate-500">
          Official communiques from the General Assembly, national pastoral releases, and synodical reports.
        </p>
      </div>

      {/* Filter and Tab controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold w-full sm:w-auto">
          <button
            onClick={() => setTab('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all ${
              tab === 'all'
                ? 'bg-[#0B3056] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setTab('announcements')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all ${
              tab === 'announcements'
                ? 'bg-[#0B3056] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Communiques ({publishedAnnouncements.length})
          </button>
          <button
            onClick={() => setTab('news')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all ${
              tab === 'news'
                ? 'bg-[#0B3056] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Articles ({publishedNews.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news & notices..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
          />
        </div>
      </div>

      {/* Announcements section */}
      {(tab === 'all' || tab === 'announcements') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C41230]" />
            <h2 className="text-xl font-bold font-serif text-[#0B3056]">
              Official Notices & Communiques
            </h2>
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0B3056] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-xs font-semibold text-amber-800">{ann.category}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatPcgDate(ann.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#0B3056] shrink-0">
                  <span>Read Full Notice</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News Articles section */}
      {(tab === 'all' || tab === 'news') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#0B3056]" />
            <h2 className="text-xl font-bold font-serif text-[#0B3056]">
              Church News & Development Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-900 relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#0B3056]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                      {article.presbytery}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{formatPcgDate(article.publishedAt)}</span>
                      <span>{article.readTimeMinutes} min read</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug hover:text-[#0B3056] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">By {article.author}</span>
                  <span className="font-bold text-[#C41230] flex items-center gap-1">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-slate-100">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="px-2 py-0.5 rounded bg-[#0B3056] text-white font-bold text-[10px]">
                  {selectedArticle.presbytery}
                </span>
                <span>{formatPcgDate(selectedArticle.publishedAt)}</span>
                <span>•</span>
                <span>{selectedArticle.author}</span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="prose prose-sm max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
                {selectedArticle.content}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticle.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-semibold"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Detail Reader Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded bg-[#C41230] text-white text-[10px] font-bold uppercase">
                {selectedAnnouncement.priority} Notice
              </span>
              <span className="text-xs font-semibold text-amber-800">
                {selectedAnnouncement.category}
              </span>
            </div>

            <h2 className="text-xl font-bold font-serif text-slate-900 mb-2 leading-snug">
              {selectedAnnouncement.title}
            </h2>

            <div className="text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-slate-100">
              Published: {formatPcgDate(selectedAnnouncement.publishedAt)} • Issued by:{' '}
              {selectedAnnouncement.author}
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              <p className="font-semibold text-slate-900 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                {selectedAnnouncement.summary}
              </p>
              <p>{selectedAnnouncement.content}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 rounded-lg bg-[#0B3056] text-white text-xs font-semibold"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
