'use client';

import React from 'react';
import { PCGLogo } from './PCGLogo';
import { PageId } from './Header';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenGiving: () => void;
  onOpenContact: () => void;
}

export function Footer({ onNavigate, onOpenGiving, onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#081B2E] text-slate-300 border-t-4 border-[#C41230]">
      {/* Top Banner - Presbyterian Confession of Faith */}
      <div className="bg-[#0B3056] py-6 px-4 sm:px-6 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
              Presbyterian Confession of Faith
            </span>
            <p className="font-serif italic text-white text-base sm:text-lg mt-1">
              “One Lord, One Faith, One Baptism, One God and Father of all.”
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGiving}
              className="px-5 py-2.5 rounded-lg bg-[#C41230] hover:bg-[#A30F28] text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
            >
              Support Church Missions
            </button>
            <button
              onClick={() => onNavigate('sermons')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-600 transition-colors flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              Sermon Archive
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About & Motto */}
        <div className="space-y-4">
          <PCGLogo size="md" light showText={true} />
          <p className="text-xs leading-relaxed text-slate-400 mt-3">
            The Presbyterian Church of Ghana is a historic reformed church established in 1828 by the Basel Evangelical Missionary Society. With over one million members across 21 Presbyteries in Ghana and overseas, we proclaim the unadulterated Gospel of Jesus Christ.
          </p>
          <div className="pt-2 text-xs text-amber-300/90 font-mono">
            Motto: <span className="font-serif italic font-semibold">“Ut Omnes Unum Sint”</span> (That They All May Be One)
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2 mb-4">
            Church Portals
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-amber-300 transition-colors"
              >
                Historical Heritage & 1828 Basel Mission
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('sermons')}
                className="hover:text-amber-300 transition-colors"
              >
                Sermons & Audio Messages
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('events')}
                className="hover:text-amber-300 transition-colors"
              >
                General Assembly & Synods
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('news')}
                className="hover:text-amber-300 transition-colors"
              >
                Pastoral Letters & Communiques
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('ministries')}
                className="hover:text-amber-300 transition-colors"
              >
                Fellowships (YPG, Women, Men, Choirs)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('branches')}
                className="hover:text-amber-300 transition-colors"
              >
                Presbyteries & District Directory
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('gallery')}
                className="hover:text-amber-300 transition-colors"
              >
                Church Photo Albums & Archives
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Key Presbyteries */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2 mb-4">
            Presbyteries of PCG
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-slate-300">Ga Presbytery</span>
            <span className="text-slate-300">Asante Presbytery</span>
            <span className="text-slate-300">Akuapem Presbytery</span>
            <span className="text-slate-300">Akyem Abuakwa</span>
            <span className="text-slate-300">Ga West Presbytery</span>
            <span className="text-slate-300">Central Presbytery</span>
            <span className="text-slate-300">Northern Presbytery</span>
            <span className="text-slate-300">Volta Presbytery</span>
            <span className="text-slate-300">Western Presbytery</span>
            <span className="text-slate-300">Brong Ahafo</span>
            <span className="text-slate-300">North America</span>
            <span className="text-slate-300">Europe Presbytery</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('branches')}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
            >
              <span>Explore all 21 Presbyteries</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Col 4: Head Office & Pastoral Contact */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2 mb-4">
            General Assembly Head Office
          </h4>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-[#C41230] shrink-0 mt-0.5" />
            <span>Kukuhill Road, Osu, P.O. Box 1800, Accra, Ghana</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>+233 30 276 2207 / +233 30 276 2208</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span>info@pcgonline.org</span>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenContact}
              className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold text-center border border-slate-700 transition-colors"
            >
              Send Pastoral Message or Prayer Request
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800 bg-[#051321] py-4 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <span>© 1828 – {new Date().getFullYear()} Presbyterian Church of Ghana (PCG). All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('legal')}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Privacy Policy & Terms
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
