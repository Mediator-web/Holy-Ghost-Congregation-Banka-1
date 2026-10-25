'use client';

import React, { useState } from 'react';
import { Ministry } from '../../types/pcg';
import {
  Users,
  Clock,
  Sparkles,
  Mail,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface MinistriesViewProps {
  ministries: Ministry[];
  onOpenContact: () => void;
}

export function MinistriesView({ ministries, onOpenContact }: MinistriesViewProps) {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(ministries[0] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Church Life & Nurture
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Ministries & Fellowships
        </h1>
        <p className="text-xs text-slate-500">
          From Sunday school children to venerated presbyters, discover how God is using our generational fellowships to nurture disciples for Christ.
        </p>
      </div>

      {/* Grid of Ministries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ministries.map((min) => (
          <div
            key={min.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#0B3056] transition-all"
          >
            <div>
              <div className="aspect-[16/10] bg-slate-900 relative">
                <img
                  src={min.bannerImage}
                  alt={min.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute top-3 left-3 bg-[#0B3056]/90 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {min.acronym}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {min.name}
                  </h3>
                  <p className="text-xs text-[#C41230] font-semibold italic mt-0.5">
                    “{min.motto}”
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{min.meetingTimes}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Audience: <strong>{min.targetGroup}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {min.description}
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Core Activities:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {min.activities.map((act, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">Leadership</span>
                <span className="font-semibold text-slate-800">{min.leaderName}</span>
              </div>

              <button
                onClick={onOpenContact}
                className="px-3.5 py-1.5 rounded-lg bg-[#0B3056] hover:bg-[#002B49] text-white font-bold transition-colors shadow-xs"
              >
                Join Fellowship
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
