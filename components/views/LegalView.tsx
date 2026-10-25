'use client';

import React from 'react';
import { ShieldCheck, Lock, FileText, HeartHandshake } from 'lucide-react';

export function LegalView() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Governance & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3056]">
          Privacy Policy & Terms of Use
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: October 2026 • General Assembly Secretariat, Accra, Ghana
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#0B3056] flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            1. Privacy Policy & Data Protection
          </h2>
          <p>
            The Presbyterian Church of Ghana (PCG) is committed to safeguarding personal information collected through our official websites, congregational registries, and administrative portals in accordance with the Ghana Data Protection Act, 2012 (Act 843).
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>We do not sell, rent, or distribute personal information to commercial third parties.</li>
            <li>Information gathered through Contact and Prayer Request forms is accessible only to authorized ministers and intercessors sworn to pastoral confidentiality.</li>
            <li>You may request removal or modification of your congregational data by contacting <code>privacy@pcgonline.org</code>.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-serif font-bold text-[#0B3056] flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#C41230]" />
            2. Online Giving, Tithes & Stewardship Compliance
          </h2>
          <p>
            All electronic offerings, tithes, thanksgiving gifts, and mission donations processed via Mobile Money (MTN MoMo, Telecel Cash) or bank transfers are directed exclusively to verified institutional accounts registered under the General Assembly Council of the Presbyterian Church of Ghana.
          </p>
          <p>
            Congregants receive transaction confirmation and reference codes. If you believe an unauthorized transfer occurred or require official donation receipts for fiscal audits, notify the National Department of Finance at <code>finance@pcgonline.org</code>.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-serif font-bold text-[#0B3056] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0B3056]" />
            3. Copyright & Media Permissions
          </h2>
          <p>
            All sermons, liturgical orders of service, hymns, Presbyterian logos, Basel Mission archival records, and photographs hosted on this platform are intellectual property of the Presbyterian Church of Ghana.
          </p>
          <p>
            Audio sermons and publications may be downloaded and shared for non-commercial spiritual nurture and personal study. Commercial reproduction or unauthorized broadcasting without prior written consent from the General Assembly Council is strictly prohibited.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-serif font-bold text-[#0B3056] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            4. Child Safeguarding in Ministries
          </h2>
          <p>
            In alignment with the PCG Child Protection Policy, all photographs and videos involving children from the Children’s Service and Junior Youth are monitored to protect minor identities.
          </p>
        </div>
      </div>
    </div>
  );
}
