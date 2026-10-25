'use client';

import React, { useState } from 'react';
import { ChurchEvent } from '../../types/pcg';
import { filterEvents } from '../../lib/pcg-logic';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface EventsViewProps {
  events: ChurchEvent[];
}

export function EventsView({ events }: EventsViewProps) {
  const [timeframe, setTimeframe] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [registeredEventId, setRegisteredEventId] = useState<string | null>(null);

  const publishedEvents = events.filter((e) => e.status === 'published');

  const filtered = filterEvents(publishedEvents, {
    search,
    timeframe,
    category,
  });

  const handleRegister = (evt: ChurchEvent) => {
    setRegisteredEventId(evt.id);
    setTimeout(() => setRegisteredEventId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Church Calendar
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Church Events & Assemblies
        </h1>
        <p className="text-xs text-slate-500">
          Stay informed about national synods, presbytery rallies, retreats, and harvest celebrations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Timeframe selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('upcoming')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeframe === 'upcoming'
                  ? 'bg-[#0B3056] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeframe === 'all'
                  ? 'bg-[#0B3056] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setTimeframe('past')}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeframe === 'past'
                  ? 'bg-[#0B3056] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, venue, or speaker..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
          >
            <option value="all">All Categories</option>
            <option value="General Assembly">General Assembly</option>
            <option value="Youth Rally">Youth Rally</option>
            <option value="Harvest">Harvest Thanksgiving</option>
            <option value="Retreat">Retreat / Seminar</option>
            <option value="Training">Training & Ordination</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold font-serif text-slate-700 text-base">No Events Scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">
            No events match your current filter selections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#0B3056] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                    {evt.category}
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">
                    {evt.presbytery}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-900 leading-snug">
                  {evt.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-mono">
                  <div className="flex items-center gap-2 text-[#C41230] font-semibold">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{evt.startDate} {evt.endDate ? `to ${evt.endDate}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.venue} — {evt.address}</span>
                  </div>
                </div>

                {evt.speaker && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0B3056]">
                    <User className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Speaker / Host: {evt.speaker}</span>
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Organized by: <strong className="text-slate-700">{evt.organizer}</strong>
                </span>

                {evt.registrationRequired && (
                  <div>
                    {registeredEventId === evt.id ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registered!</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt)}
                        className="px-4 py-2 rounded-lg bg-[#C41230] hover:bg-[#A30F28] text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Register to Attend
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
