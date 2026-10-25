'use client';

import React from 'react';

interface PCGLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export function PCGLogo({ className = '', size = 'md', showText = true, light = false }: PCGLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Presbyterian Church of Ghana Emblem Graphic */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B3056] via-[#002B49] to-[#081B2E] border-2 border-[#D4AF37] shadow-md p-1.5 overflow-hidden`}
      >
        {/* Burning Bush & Cross Symbolism */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring Gold */}
          <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="3" opacity="0.8" />
          
          {/* Presbyterian Red Cross */}
          <rect x="44" y="16" width="12" height="68" rx="2" fill="#C41230" />
          <rect x="22" y="34" width="56" height="12" rx="2" fill="#C41230" />
          
          {/* Golden Flame / Burning Bush "Nec Tamen Consumebatur" */}
          <path
            d="M50 20 C42 32, 34 44, 38 58 C42 68, 58 68, 62 58 C66 44, 58 32, 50 20 Z"
            fill="#FBBF24"
            opacity="0.9"
          />
          <path
            d="M50 28 C45 36, 40 44, 43 54 C46 60, 54 60, 57 54 C60 44, 55 36, 50 28 Z"
            fill="#EF4444"
          />
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          
          {/* Open Bible Motif at bottom */}
          <path
            d="M32 72 Q50 68 50 78 Q50 68 68 72 L65 82 Q50 78 50 86 Q50 78 35 82 Z"
            fill="#FFFFFF"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-black tracking-tight leading-none ${
                light ? 'text-white' : 'text-[#0B3056]'
              } ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base'}`}
            >
              PRESBYTERIAN CHURCH
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#C41230] text-white tracking-widest uppercase">
              GHANA
            </span>
          </div>
          <span
            className={`font-sans tracking-wider uppercase font-semibold text-[10px] mt-0.5 ${
              light ? 'text-amber-300' : 'text-amber-800'
            }`}
          >
            That They All May Be One • Est. 1828
          </span>
        </div>
      )}
    </div>
  );
}
