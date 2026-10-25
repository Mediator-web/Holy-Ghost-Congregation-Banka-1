'use client';

import React, { useState } from 'react';
import { WebsiteSettings } from '../types/pcg';
import { generateGivingReference } from '../lib/pcg-logic';
import {
  HeartHandshake,
  Smartphone,
  Building2,
  Copy,
  Check,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface GivingModalProps {
  settings: WebsiteSettings;
  onClose: () => void;
}

export function GivingModal({ settings, onClose }: GivingModalProps) {
  const [givingType, setGivingType] = useState<'TITHE' | 'OFFERING' | 'THANKSGIVING' | 'WELFARE' | 'MISSION'>('TITHE');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('50');
  const [congregation, setCongregation] = useState('Ebenezer Congregation, Osu');
  const [channel, setChannel] = useState<'momo' | 'telecel' | 'bank'>('momo');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const referenceCode = generateGivingReference(givingType, phone || '0244123456');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close giving portal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#C41230]/10 text-[#C41230] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-[#0B3056]">
              Stewardship & Online Giving
            </h3>
            <p className="text-xs text-slate-500">
              “Every man according as he purposeth in his heart, so let him give” (2 Cor 9:7)
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Giving Purpose
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'TITHE', label: 'Tithe (10%)' },
              { id: 'OFFERING', label: 'Sunday Offering' },
              { id: 'THANKSGIVING', label: 'Thanksgiving' },
              { id: 'MISSION', label: 'Church Mission' },
              { id: 'WELFARE', label: 'Welfare / Needy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setGivingType(cat.id as any)}
                className={`py-2 px-3 rounded-lg font-medium border text-center transition-all ${
                  givingType === cat.id
                    ? 'bg-[#0B3056] text-white border-[#0B3056] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount & Congregational Affiliation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (GHS)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Phone Number (MoMo)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
              placeholder="e.g. 0244123456"
            />
          </div>
        </div>

        {/* Channel Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setChannel('momo')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                channel === 'momo'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-5 h-5 text-amber-600" />
              <span className="text-xs">MTN MoMo</span>
            </button>

            <button
              onClick={() => setChannel('telecel')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                channel === 'telecel'
                  ? 'border-red-500 bg-red-50 text-red-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-5 h-5 text-red-600" />
              <span className="text-xs">Telecel Cash</span>
            </button>

            <button
              onClick={() => setChannel('bank')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                channel === 'bank'
                  ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-xs">Bank Wire</span>
            </button>
          </div>
        </div>

        {/* Channel Details Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          {channel === 'momo' && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Merchant Name:</span>
                <span className="font-bold text-slate-800">
                  {settings.givingDetails.mtnMomo.merchantName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">MoMo Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {settings.givingDetails.mtnMomo.number}
                  </span>
                  <button
                    onClick={() => copyToClipboard(settings.givingDetails.mtnMomo.number, 'momo-num')}
                    className="text-slate-400 hover:text-slate-700"
                    title="Copy number"
                  >
                    {copiedKey === 'momo-num' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Dial <span className="font-mono font-bold text-slate-800">*170#</span> &gt; Transfer Money &gt; Enter number &gt; Enter Reference below.
              </p>
            </div>
          )}

          {channel === 'telecel' && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Merchant Name:</span>
                <span className="font-bold text-slate-800">
                  {settings.givingDetails.telecelCash.merchantName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Telecel Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {settings.givingDetails.telecelCash.number}
                  </span>
                  <button
                    onClick={() => copyToClipboard(settings.givingDetails.telecelCash.number, 'telecel-num')}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {copiedKey === 'telecel-num' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Dial <span className="font-mono font-bold text-slate-800">*110#</span> &gt; Send Money &gt; Enter number &gt; Reference below.
              </p>
            </div>
          )}

          {channel === 'bank' && (
            <div className="space-y-3 text-xs">
              {settings.givingDetails.bankAccounts.map((acct, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-200 last:border-b-0">
                  <div className="font-bold text-slate-800 text-sm">{acct.bank}</div>
                  <div className="flex justify-between text-slate-600 mt-1">
                    <span>Account Name:</span>
                    <span className="font-medium">{acct.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 mt-1">
                    <span>Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0B3056]">{acct.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(acct.accountNumber, `bank-${idx}`)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        {copiedKey === `bank-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Branch: {acct.branch}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Reference Code Generator */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Required Payment Reference
            </span>
            <span className="font-mono text-sm font-bold text-amber-950">
              {referenceCode}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(referenceCode, 'ref-code')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
          >
            {copiedKey === 'ref-code' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Ref</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official PCG National Accounts Verified & Secured</span>
        </div>
      </div>
    </div>
  );
}
