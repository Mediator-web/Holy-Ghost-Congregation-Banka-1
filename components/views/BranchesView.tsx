'use client';

import React, { useState } from 'react';
import { ChurchBranch } from '../../types/pcg';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Search,
  ExternalLink,
  Church,
} from 'lucide-react';

interface BranchesViewProps {
  branches: ChurchBranch[];
}

export function BranchesView({ branches }: BranchesViewProps) {
  const [selectedPresbytery, setSelectedPresbytery] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = branches.filter((branch) => {
    if (selectedPresbytery !== 'all' && branch.presbytery !== selectedPresbytery) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = branch.name.toLowerCase().includes(q);
      const matchCity = branch.city.toLowerCase().includes(q);
      const matchDistrict = branch.district.toLowerCase().includes(q);
      const matchMinister = branch.ministerInCharge.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchDistrict && !matchMinister) return false;
    }
    return true;
  });

  const presbyteriesList = [
    'all',
    'Ga Presbytery',
    'Ga West Presbytery',
    'Asante Presbytery',
    'Akuapem Presbytery',
    'Northern Presbytery',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Presbyteries & Congregations
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Church Branches Directory
        </h1>
        <p className="text-xs text-slate-500">
          Find your nearest Presbyterian congregation, check Sunday divine service times, and connect with parish ministers.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by congregation name, city, district, or minister..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
          />
        </div>

        <select
          value={selectedPresbytery}
          onChange={(e) => setSelectedPresbytery(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
        >
          <option value="all">All Presbyteries</option>
          <option value="Ga Presbytery">Ga Presbytery (Accra / Osu / Tema)</option>
          <option value="Ga West Presbytery">Ga West Presbytery (Kaneshie / Weija)</option>
          <option value="Asante Presbytery">Asante Presbytery (Kumasi)</option>
          <option value="Akuapem Presbytery">Akuapem Presbytery (Akropong)</option>
          <option value="Northern Presbytery">Northern Presbytery (Tamale)</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:shadow-md hover:border-[#0B3056] transition-all"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>{branch.presbytery}</span>
                  <span className="font-semibold text-amber-800">{branch.district}</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-[#0B3056]">
                  {branch.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C41230] shrink-0" />
                  <span>{branch.address}, {branch.city}</span>
                </div>
              </div>

              {/* Minister in Charge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-[#0B3056]" />
                  <span>Minister: {branch.ministerInCharge}</span>
                </div>
                {branch.associateMinisters && branch.associateMinisters.length > 0 && (
                  <div className="text-[11px] text-slate-500 pl-5">
                    Assoc: {branch.associateMinisters.join(', ')}
                  </div>
                )}
              </div>

              {/* Service Times */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Worship & Divine Service Times:
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {branch.serviceTimes.map((st, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-600 font-sans text-[11px]">{st.label}</span>
                      <span className="font-bold text-[#0B3056]">{st.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`tel:${branch.phone}`}
                className="flex items-center gap-1 text-slate-600 hover:text-[#0B3056]"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono">{branch.phone}</span>
              </a>

              <a
                href={`mailto:${branch.email}`}
                className="flex items-center gap-1 text-slate-600 hover:text-[#0B3056]"
              >
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Email</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
