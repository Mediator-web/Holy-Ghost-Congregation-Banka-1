'use client';

import React, { useState } from 'react';
import { submitContactMessage } from '../lib/firebase';
import { validateContactForm } from '../lib/pcg-logic';
import { Mail, Send, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface ContactModalProps {
  initialIsPrayer?: boolean;
  onClose: () => void;
}

export function ContactModal({ initialIsPrayer = false, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [presbytery, setPresbytery] = useState('Ga Presbytery');
  const [subject, setSubject] = useState(initialIsPrayer ? 'Intercessory Prayer Request' : '');
  const [message, setMessage] = useState('');
  const [isPrayer, setIsPrayer] = useState(initialIsPrayer);

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
      setTimeout(() => {
        // keep modal open for a moment to let user read confirmation
      }, 500);
    } catch (err: any) {
      setErrors({ form: 'An unexpected error occurred while sending. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#0B3056]">
              {isPrayer ? 'Prayer Request Received' : 'Message Sent Successfully'}
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Thank you, <span className="font-semibold text-slate-800">{name}</span>. Your {isPrayer ? 'prayer petition has been forwarded to the National Prayer Network' : 'message has been submitted to the church administration'}. May the peace of Christ abide with you.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-[#0B3056] text-white font-semibold text-sm hover:bg-[#002B49] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#0B3056]/10 text-[#0B3056] flex items-center justify-center">
                {isPrayer ? <Sparkles className="w-6 h-6 text-amber-600" /> : <Mail className="w-6 h-6 text-[#0B3056]" />}
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0B3056]">
                  {isPrayer ? 'Submit Prayer Petition' : 'Contact Church Administration'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isPrayer
                    ? 'Our ministers and intercessors lift every petition in daily prayer.'
                    : 'Send an inquiry to the General Assembly Head Office or local Presbytery.'}
                </p>
              </div>
            </div>

            {/* Toggle Prayer vs General */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsPrayer(false);
                  if (subject === 'Intercessory Prayer Request') setSubject('');
                }}
                className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                  !isPrayer ? 'bg-white text-[#0B3056] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                General Inquiry
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPrayer(true);
                  if (!subject) setSubject('Intercessory Prayer Request');
                }}
                className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                  isPrayer ? 'bg-[#C41230] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prayer Request
              </button>
            </div>

            {errors.form && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. Kwame Mensah"
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
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. kwame@example.com"
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] bg-white"
                  >
                    <option value="Ga Presbytery">Ga Presbytery</option>
                    <option value="Asante Presbytery">Asante Presbytery</option>
                    <option value="Akuapem Presbytery">Akuapem Presbytery</option>
                    <option value="Akyem Abuakwa">Akyem Abuakwa</option>
                    <option value="Ga West Presbytery">Ga West Presbytery</option>
                    <option value="Central Presbytery">Central Presbytery</option>
                    <option value="Northern Presbytery">Northern Presbytery</option>
                    <option value="Volta Presbytery">Volta Presbytery</option>
                    <option value="Western Presbytery">Western Presbytery</option>
                    <option value="Diaspora / Overseas">Diaspora / Overseas</option>
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
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] ${
                    errors.subject ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Summary of inquiry or prayer request"
                />
                {errors.subject && <p className="text-[11px] text-red-600 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056] resize-none ${
                    errors.message ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder={
                    isPrayer
                      ? 'Share your prayer petition with as much or as little detail as you are comfortable with...'
                      : 'Type your message to the administration...'
                  }
                />
                {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-lg bg-[#0B3056] hover:bg-[#002B49] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : isPrayer ? 'Submit Prayer Petition' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
