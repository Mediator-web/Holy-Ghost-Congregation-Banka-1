'use client';

import React, { useState } from 'react';
import { WebsiteSettings } from '../../types/pcg';
import { validateContactForm } from '../../lib/pcg-logic';
import { submitContactMessage } from '../../lib/firebase';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';

interface ContactViewProps {
  settings: WebsiteSettings;
  onOpenPrayerModal: () => void;
}

export function ContactView({ settings, onOpenPrayerModal }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [presbytery, setPresbytery] = useState('Ga Presbytery');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isPrayer, setIsPrayer] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateContactForm({
      name,
      email,
      phone,
      presbytery,
      subject,
      message,
      prayerRequest: isPrayer,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage(validation.sanitized);
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrors({ form: 'An error occurred while sending message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Contact PCG & Prayer Requests
        </h1>
        <p className="text-xs text-slate-500">
          Reach the General Assembly Head Office, connect with pastoral care, or submit an intercessory prayer petition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B3056] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border-t-4 border-[#D4AF37]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Head Office
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-1">
                General Assembly Headquarters
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                The central administrative secretariat overseeing all 21 Presbyteries and ecumenical partners.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C41230] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Physical Address:</strong>
                  <span className="text-slate-300 leading-relaxed">{settings.headOfficeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Office Telephones:</strong>
                  <span className="text-slate-300 font-mono">{settings.headOfficePhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">General Inquiries:</strong>
                  <span className="text-slate-300">{settings.headOfficeEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Secretariat Hours:</strong>
                  <span className="text-slate-300">Monday – Friday: 8:00 AM – 5:00 PM GMT</span>
                </div>
              </div>
            </div>
          </div>

          {/* 24/7 Pastoral Prayer Banner */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <span>Emergency Pastoral & Prayer Hotline</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Facing illness, bereavement, or urgent spiritual distress? Reach our pastoral counseling desk 24 hours a day.
            </p>
            <div className="text-lg font-mono font-bold text-[#0B3056]">
              {settings.prayerHotline}
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#0B3056]">
                Thank You for Reaching Out
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your submission has been recorded in the real-time church secretariat database. A designated ministry officer or prayer intercessor will attend to your message.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 rounded-lg bg-[#0B3056] text-white text-xs font-bold hover:bg-[#002B49]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold font-serif text-[#0B3056]">
                  {isPrayer ? 'Submit Prayer Petition' : 'Send an Administrative Message'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  All messages are treated with utmost Christian confidentiality.
                </p>
              </div>

              {/* Inquiry vs Prayer Toggle */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold mb-6">
                <button
                  type="button"
                  onClick={() => setIsPrayer(false)}
                  className={`flex-1 py-2 rounded-lg text-center transition-all ${
                    !isPrayer
                      ? 'bg-white text-[#0B3056] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  General Church Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrayer(true)}
                  className={`flex-1 py-2 rounded-lg text-center transition-all ${
                    isPrayer
                      ? 'bg-[#C41230] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Intercessory Prayer Request
                </button>
              </div>

              {errors.form && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                        errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="e.g. Ama Serwaa"
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="e.g. ama@example.com"
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
                      placeholder="e.g. 0244123456"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Presbytery / Region
                    </label>
                    <select
                      value={presbytery}
                      onChange={(e) => setPresbytery(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] bg-white"
                    >
                      <option value="Ga Presbytery">Ga Presbytery</option>
                      <option value="Asante Presbytery">Asante Presbytery</option>
                      <option value="Akuapem Presbytery">Akuapem Presbytery</option>
                      <option value="Northern Presbytery">Northern Presbytery</option>
                      <option value="General Assembly">General Assembly (Head Office)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                      errors.subject ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Brief subject of inquiry or prayer request"
                  />
                  {errors.subject && <p className="text-[11px] text-red-600 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] resize-none ${
                      errors.message ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Please write your message or prayer petition..."
                  />
                  {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#0B3056] hover:bg-[#002B49] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : isPrayer ? 'Send Prayer Petition' : 'Submit Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
