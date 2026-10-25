'use client';

import React, { useState } from 'react';
import { PCGLogo } from './PCGLogo';
import {
  Church,
  BookOpen,
  Calendar,
  Newspaper,
  Users,
  MapPin,
  Image as ImageIcon,
  Mail,
  HeartHandshake,
  ShieldAlert,
  Menu,
  X,
  Radio,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types/pcg';

export type PageId =
  | 'home'
  | 'about'
  | 'sermons'
  | 'events'
  | 'news'
  | 'ministries'
  | 'branches'
  | 'gallery'
  | 'contact'
  | 'legal'
  | 'admin';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: UserProfile | null;
  onOpenGiving: () => void;
  onOpenContact: (isPrayer?: boolean) => void;
}

export function Header({
  currentPage,
  onNavigate,
  currentUser,
  onOpenGiving,
  onOpenContact,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Church className="w-4 h-4" /> },
    { id: 'about', label: 'About PCG', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sermons', label: 'Sermons & Media', icon: <Radio className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'news', label: 'News & Communiques', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'ministries', label: 'Ministries', icon: <Users className="w-4 h-4" /> },
    { id: 'branches', label: 'Presbyteries & Branches', icon: <MapPin className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Notice & Pastoral Bar */}
      <div className="bg-[#0B3056] text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#C41230] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              2026 Theme
            </span>
            <span className="font-serif italic text-amber-200 hidden sm:inline">
              “Set Free to Live as Christ’s Ambassadors” (2 Corinthians 5:20)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+233244356789"
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Prayer Hotline:</span>
              <span className="font-mono font-medium">+233 24 435 6789</span>
            </a>

            <button
              onClick={() => onOpenContact(true)}
              className="hover:text-amber-300 transition-colors hidden sm:inline underline underline-offset-2"
            >
              Request Prayer
            </button>

            {currentUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600/90 text-white font-medium hover:bg-emerald-500 transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                <span>Admin ({currentUser.role})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none"
          aria-label="Presbyterian Church of Ghana Home"
        >
          <PCGLogo size="md" />
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0B3056] text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 hover:text-[#0B3056]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => handleNavClick('sermons')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#0B3056] border border-[#0B3056]/30 hover:bg-[#0B3056]/5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#C41230] animate-pulse" />
            Watch / Listen
          </button>

          <button
            onClick={onOpenGiving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#C41230] hover:bg-[#A30F28] text-white shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Tithe & Give
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onOpenGiving}
            className="sm:hidden px-2.5 py-1.5 rounded-md text-xs font-bold bg-[#C41230] text-white flex items-center gap-1"
          >
            <HeartHandshake className="w-3 h-3" />
            Give
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-left font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0B3056] text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-[#C41230]'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenGiving();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#C41230] text-white font-bold text-sm shadow-sm"
            >
              <HeartHandshake className="w-4 h-4" />
              Online Tithes, Offerings & Donations
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
            >
              <ShieldAlert className="w-4 h-4 text-[#0B3056]" />
              {currentUser ? `Admin Portal (${currentUser.role})` : 'Administrative Portal Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
