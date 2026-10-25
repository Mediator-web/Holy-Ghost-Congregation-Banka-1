'use client';

import React from 'react';
import {
  Sermon,
  ChurchEvent,
  Announcement,
  NewsArticle,
  Ministry,
  ChurchBranch,
  WebsiteSettings,
} from '../../types/pcg';
import { PageId } from '../Header';
import {
  Play,
  Calendar,
  Radio,
  BookOpen,
  MapPin,
  HeartHandshake,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatPcgDate } from '../../lib/pcg-logic';

interface HomeViewProps {
  settings: WebsiteSettings;
  sermons: Sermon[];
  events: ChurchEvent[];
  announcements: Announcement[];
  news: NewsArticle[];
  ministries: Ministry[];
  branches: ChurchBranch[];
  onNavigate: (page: PageId) => void;
  onPlaySermon: (sermon: Sermon) => void;
  onOpenGiving: () => void;
  onOpenContact: (isPrayer?: boolean) => void;
}

export function HomeView({
  settings,
  sermons,
  events,
  announcements,
  news,
  ministries,
  branches,
  onNavigate,
  onPlaySermon,
  onOpenGiving,
  onOpenContact,
}: HomeViewProps) {
  const publishedSermons = sermons.filter((s) => s.status === 'published').slice(0, 3);
  const publishedEvents = events.filter((e) => e.status === 'published').slice(0, 3);
  const urgentAnnouncements = announcements.filter((a) => a.status === 'published');
  const latestNews = news.filter((n) => n.status === 'published').slice(0, 2);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B3056] via-[#002B49] to-[#081B2E] text-white overflow-hidden py-16 sm:py-24 border-b-4 border-[#C41230]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-[#C41230] animate-pulse" />
              <span>Official Web Portal of the Presbyterian Church of Ghana</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-white">
              That They All <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
                May Be One
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
              Proclaiming the Gospel of Jesus Christ with spiritual devotion, moral discipline, and transformative social service across Ghana and the worldwide diaspora since 1828.
            </p>

            {/* Theme of the Year Banner Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings.themeYear} Church Theme</span>
              </div>
              <div className="font-serif text-lg sm:text-xl font-bold text-white mb-1">
                “{settings.themeTitle}”
              </div>
              <div className="text-slate-300 font-serif italic">
                {settings.themeText} — <strong className="text-amber-200 font-sans not-italic font-bold">{settings.themeScripture}</strong>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('sermons')}
                className="px-6 py-3 rounded-xl bg-[#C41230] hover:bg-[#A30F28] text-white font-bold text-sm shadow-lg shadow-red-950/40 transition-transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Listen to Latest Sermons</span>
              </button>

              <button
                onClick={() => onNavigate('branches')}
                className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Find a Congregation Near You</span>
              </button>

              <button
                onClick={onOpenGiving}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-[#0B3056]" />
                <span>Tithe & Offertory</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Communique or Announcement Bar if present */}
      {urgentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border-l-4 border-[#C41230] p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span className="bg-[#C41230] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 mt-0.5 sm:mt-0">
                Notice
              </span>
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {urgentAnnouncements[0].title}
                </span>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {urgentAnnouncements[0].summary}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs font-bold text-[#0B3056] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Read communique</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Welcome Message from the Moderator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-lg mb-4 bg-slate-100">
              <img
                src="https://picsum.photos/seed/pcg_moderator/800/800"
                alt="Rt. Rev. Dr. Abraham Nana Opare Kwakye"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0B3056]">
              {settings.moderatorName}
            </h3>
            <p className="text-xs text-[#C41230] font-bold uppercase tracking-wider mt-0.5">
              Moderator of the General Assembly
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">Presbyterian Church of Ghana</p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
              Pastoral Welcome
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3056]">
              Grace, Peace, and Warm Christian Greetings
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              On behalf of the General Assembly Council, the presbyters, and the entire Presbyterian fellowship across the length and breadth of Ghana and our overseas mission fields, I welcome you in the blessed name of our Lord and Saviour Jesus Christ.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              As we journey in this season under our guiding theme, <em>“Set Free to Live as Christ’s Ambassadors,”</em> we are called to embody the truth, holiness, and servant leadership of the Kingdom of God. Whether you are seeking a church home, listening to the proclamation of the Word, or joining us in prayer, we pray that your encounter with the living God brings divine transformation to your life.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('about')}
                className="px-4 py-2 rounded-lg bg-[#0B3056] text-white text-xs font-semibold hover:bg-[#002B49] transition-colors"
              >
                Learn About PCG Heritage
              </button>
              <button
                onClick={() => onOpenContact(true)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Send Prayer Request to Moderator’s Desk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Sermons & Proclamations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
              The Living Word
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3056]">
              Latest Sermons & Spiritual Proclamations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('sermons')}
            className="text-xs font-bold text-[#0B3056] hover:text-[#C41230] flex items-center gap-1 transition-colors"
          >
            <span>View All Sermons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={sermon.coverImage}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <button
                  onClick={() => onPlaySermon(sermon)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#C41230]/90 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  aria-label={`Play sermon ${sermon.title}`}
                >
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </button>
                <div className="absolute top-3 left-3 bg-[#0B3056]/90 backdrop-blur-xs text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded">
                  {sermon.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {formatPcgDate(sermon.date)} • {sermon.presbytery}
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#0B3056] transition-colors line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {sermon.speaker}
                  </p>
                  <p className="text-[11px] text-amber-800 font-mono mt-1">
                    📖 {sermon.scripture}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onPlaySermon(sermon)}
                    className="text-xs font-bold text-[#C41230] hover:underline flex items-center gap-1"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Listen Now</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {sermon.playsCount} plays
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Calendar */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
                Church Calendar
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3056]">
                Upcoming Synods, Rallies & Conferences
              </h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-bold text-[#0B3056] hover:text-[#C41230] flex items-center gap-1 transition-colors"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2.5 py-1 rounded bg-[#0B3056] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                      {evt.category}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {evt.presbytery}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-mono text-[#C41230] font-semibold">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.startDate} {evt.endDate ? `to ${evt.endDate}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('events')}
                    className="text-xs font-bold text-[#0B3056] hover:underline"
                  >
                    View Details
                  </button>
                  {evt.registrationRequired && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Registration Open
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministries of PCG (Fellowships) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
            Church Life & Nurture
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3056] mt-1">
            Ministries & Fellowships of PCG
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Every age group and calling finds a home in our structured evangelical, educational, and service fellowships.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ministries.map((min) => (
            <button
              key={min.id}
              onClick={() => onNavigate('ministries')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0B3056] hover:shadow-md transition-all text-center flex flex-col items-center justify-between group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B3056]/5 text-[#0B3056] flex items-center justify-center group-hover:bg-[#0B3056] group-hover:text-white transition-colors mb-2">
                <Users className="w-6 h-6" />
              </div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-[#0B3056]">
                {min.acronym}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                {min.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Church News & Communiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
              Press & Public Relations
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3056]">
              Church News & National Communiques
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-[#0B3056] hover:text-[#C41230] flex items-center gap-1 transition-colors"
          >
            <span>Read All News</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestNews.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 aspect-video sm:aspect-auto bg-slate-900 relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0B3056]/90 text-white text-[10px] font-bold">
                  {article.presbytery}
                </span>
              </div>
              <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatPcgDate(article.publishedAt)} • {article.readTimeMinutes} min read
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 leading-snug mt-1 hover:text-[#0B3056] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('news')}
                    className="text-xs font-bold text-[#C41230] hover:underline"
                  >
                    Read Full Story
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {article.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Congregation Quick Finder CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0B3056] to-[#002B49] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#D4AF37]">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
              Worship With Us This Sunday
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Locate a Presbyterian Congregation Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
              With thousands of local congregations across 21 Presbyteries in Ghana and mission stations in the United Kingdom, Europe, and North America, there is always a church family ready to welcome you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('branches')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5 text-center"
            >
              Search Congregations
            </button>
            <button
              onClick={() => onOpenContact(false)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors text-center"
            >
              Contact Head Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
