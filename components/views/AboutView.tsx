'use client';

import React from 'react';
import { LeadershipProfile } from '../../types/pcg';
import {
  BookOpen,
  History,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Globe,
  Sparkles,
  MapPin,
  Mail,
} from 'lucide-react';

interface AboutViewProps {
  leadership: LeadershipProfile[];
  onOpenContact: () => void;
}

export function AboutView({ leadership, onOpenContact }: AboutViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C41230]">
          Heritage, Doctrine & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#0B3056]">
          The Presbyterian Church of Ghana
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          A historic reformed Christian denomination rooted in apostolic faith, liturgical reverence, educational excellence, and healthcare since 1828.
        </p>
      </div>

      {/* 1828 Basel Mission Historic Timeline */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B3056]/10 text-[#0B3056] flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#0B3056]">
              Our Historic Heritage (1828 to Present)
            </h2>
            <p className="text-xs text-slate-500">
              The founding of the Church through the Basel Evangelical Missionary Society.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#C41230] text-sm block mb-1">
                1828: Arrival at Christianborg Castle, Osu
              </span>
              <p>
                On 18 December 1828, four pioneer missionaries sent by the Basel Evangelical Missionary Society—Karl F. Salbach, Gottlieb Holzwarth, Johannes Henke, and Johannes Gottlieb Schmid—landed at the Gold Coast. Though tropical fever claimed their lives within months, the foundation of the faith was planted in the soil of Ghana.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#C41230] text-sm block mb-1">
                1835: Andreas Riis Moves to Akropong-Akuapem
              </span>
              <p>
                Surviving missionary Andreas Riis ventured into the Akuapem ridge at Akropong. Welcomed by Omanhene Nana Addo Dankwa I, he laid the cornerstone for rural evangelism, community sanitation, coffee cultivation, and classical education in the indigenous Akan language.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#C41230] text-sm block mb-1">
                1843: Arrival of the West Indian Christian Settlers
              </span>
              <p>
                In 1843, 24 Jamaican Moravian Christians (including families of Rochester, Miller, Hall, and Mullings) arrived to demonstrate Christian domestic life and agricultural industry. Their descendants became ministers, catechists, and headmasters across Ghana.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#C41230] text-sm block mb-1">
                1918 – 1926: Autonomy & The Synod of Kyebi
              </span>
              <p>
                During World War I, the Scottish Mission assumed oversight of the Church. In 1918, the historic Synod of Kyebi was convened, ordaining indigenous Ghanaian moderators and clerks. In 1926, the Church officially adopted the name <em>Presbyterian Church of the Gold Coast</em> (now <em>Presbyterian Church of Ghana</em>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Reformed Beliefs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B3056] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">Our Vision</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To be a Christ-centered, self-sustaining, and growing church, impacting world society through the unadulterated Word of God.
          </p>
        </div>

        <div className="bg-[#C41230] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">Our Mission</h3>
          <p className="text-xs text-slate-100 leading-relaxed">
            To uphold the centrality of the Word of God and through the enablement of the Holy Spirit, adopt a holistic approach to evangelism through healing, education, and socio-economic transformation.
          </p>
        </div>

        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">Core Values</h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Godliness & Moral Integrity</li>
            <li>Biblical Presbyterian Discipline</li>
            <li>Holistic Christian Stewardship</li>
            <li>Hard Work and Humility</li>
            <li>Mutual Respect and Inclusiveness</li>
          </ul>
        </div>
      </section>

      {/* Reformed Theological Heritage */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
            Theological Foundations
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0B3056] mt-1">
            What Presbyterians Believe
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            We adhere to the historic reformed confessions and the ecumenical creeds of the Church.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Sola Scriptura</h4>
            <p className="text-slate-600 leading-relaxed">
              Scripture alone is the final and supreme authority in all matters of faith, doctrine, and church governance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Sola Gratia & Fide</h4>
            <p className="text-slate-600 leading-relaxed">
              Salvation is by grace alone through faith in the finished work of our Lord Jesus Christ on Calvary, not by human merit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-sm">The Sacraments</h4>
            <p className="text-slate-600 leading-relaxed">
              We administer two biblical sacraments: Baptism (infant and believer) and the Lord’s Supper (Holy Communion).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Presbyterian Polity</h4>
            <p className="text-slate-600 leading-relaxed">
              Representative governance through Kirk Sessions, District Sessions, Presbyteries, and the General Assembly.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Council */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C41230]">
            Church Governance
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0B3056] mt-1">
            Leadership of the General Assembly
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            The elected servants guiding the spiritual and administrative oversight of the Presbyterian Church of Ghana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] font-bold text-[#C41230] uppercase tracking-wider mb-0.5">
                  {leader.roleCategory}
                </div>
                <h4 className="text-sm font-bold font-serif text-slate-900">{leader.name}</h4>
                <p className="text-xs font-semibold text-[#0B3056] mt-0.5">{leader.title}</p>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {leader.bio}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{leader.tenure}</span>
                <span className="text-[#0B3056] font-semibold">{leader.contactEmail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
