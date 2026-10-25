'use client';

import React, { useState, useEffect } from 'react';
import { Header, PageId } from '../components/Header';
import { Footer } from '../components/Footer';
import { AudioPlayerModal } from '../components/AudioPlayerModal';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { GivingModal } from '../components/GivingModal';
import { ContactModal } from '../components/ContactModal';
import { AdminDashboard } from '../components/AdminDashboard';

// Views
import { HomeView } from '../components/views/HomeView';
import { AboutView } from '../components/views/AboutView';
import { SermonsView } from '../components/views/SermonsView';
import { EventsView } from '../components/views/EventsView';
import { NewsView } from '../components/views/NewsView';
import { MinistriesView } from '../components/views/MinistriesView';
import { BranchesView } from '../components/views/BranchesView';
import { GalleryView } from '../components/views/GalleryView';
import { ContactView } from '../components/views/ContactView';
import { LegalView } from '../components/views/LegalView';

// Types & Firebase
import {
  UserProfile,
  WebsiteSettings,
  Sermon,
  ChurchEvent,
  Announcement,
  NewsArticle,
  GalleryAlbum,
  Ministry,
  ChurchBranch,
  LeadershipProfile,
  ContactMessage,
  AuditLog,
} from '../types/pcg';
import {
  INITIAL_SETTINGS,
  INITIAL_SERMONS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NEWS,
  INITIAL_MINISTRIES,
  INITIAL_BRANCHES,
  INITIAL_GALLERY,
  INITIAL_LEADERSHIP,
  INITIAL_AUDIT_LOGS,
} from '../lib/seed-data';
import {
  subscribeToSettings,
  subscribeToSermons,
  subscribeToEvents,
  subscribeToAnnouncements,
  subscribeToNews,
  subscribeToMinistries,
  subscribeToBranches,
  subscribeToGallery,
  subscribeToLeadership,
  subscribeToContactMessages,
  subscribeToAuditLogs,
  subscribeToAuth,
} from '../lib/firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Real-time Database State
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [sermons, setSermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [ministries, setMinistries] = useState<Ministry[]>(INITIAL_MINISTRIES);
  const [branches, setBranches] = useState<ChurchBranch[]>(INITIAL_BRANCHES);
  const [gallery, setGallery] = useState<GalleryAlbum[]>(INITIAL_GALLERY);
  const [leadership, setLeadership] = useState<LeadershipProfile[]>(INITIAL_LEADERSHIP);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals
  const [activeAudioSermon, setActiveAudioSermon] = useState<Sermon | null>(null);
  const [activeVideoSermon, setActiveVideoSermon] = useState<Sermon | null>(null);
  const [givingModalOpen, setGivingModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [isPrayerMode, setIsPrayerMode] = useState(false);

  // Subscribe to all real-time collections on mount
  useEffect(() => {
    const unsubAuth = subscribeToAuth((u) => setCurrentUser(u));
    const unsubSettings = subscribeToSettings((s) => setSettings(s));
    const unsubSermons = subscribeToSermons((s) => setSermons(s));
    const unsubEvents = subscribeToEvents((e) => setEvents(e));
    const unsubAnn = subscribeToAnnouncements((a) => setAnnouncements(a));
    const unsubNews = subscribeToNews((n) => setNews(n));
    const unsubMin = subscribeToMinistries((m) => setMinistries(m));
    const unsubBranches = subscribeToBranches((b) => setBranches(b));
    const unsubGallery = subscribeToGallery((g) => setGallery(g));
    const unsubLead = subscribeToLeadership((l) => setLeadership(l));
    const unsubMsg = subscribeToContactMessages((m) => setMessages(m));
    const unsubAudit = subscribeToAuditLogs((a) => setAuditLogs(a));

    return () => {
      unsubAuth();
      unsubSettings();
      unsubSermons();
      unsubEvents();
      unsubAnn();
      unsubNews();
      unsubMin();
      unsubBranches();
      unsubGallery();
      unsubLead();
      unsubMsg();
      unsubAudit();
    };
  }, []);

  const openContactWithMode = (isPrayer: boolean = false) => {
    setIsPrayerMode(isPrayer);
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#C41230] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onOpenGiving={() => setGivingModalOpen(true)}
        onOpenContact={openContactWithMode}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            settings={settings}
            sermons={sermons}
            events={events}
            announcements={announcements}
            news={news}
            ministries={ministries}
            branches={branches}
            onNavigate={setCurrentPage}
            onPlaySermon={(s) => setActiveAudioSermon(s)}
            onOpenGiving={() => setGivingModalOpen(true)}
            onOpenContact={openContactWithMode}
          />
        )}

        {currentPage === 'about' && (
          <AboutView leadership={leadership} onOpenContact={() => openContactWithMode(false)} />
        )}

        {currentPage === 'sermons' && (
          <SermonsView
            sermons={sermons}
            onPlayAudio={(s) => setActiveAudioSermon(s)}
            onPlayVideo={(s) => setActiveVideoSermon(s)}
          />
        )}

        {currentPage === 'events' && <EventsView events={events} />}

        {currentPage === 'news' && <NewsView news={news} announcements={announcements} />}

        {currentPage === 'ministries' && (
          <MinistriesView ministries={ministries} onOpenContact={() => openContactWithMode(false)} />
        )}

        {currentPage === 'branches' && <BranchesView branches={branches} />}

        {currentPage === 'gallery' && <GalleryView gallery={gallery} />}

        {currentPage === 'contact' && (
          <ContactView settings={settings} onOpenPrayerModal={() => openContactWithMode(true)} />
        )}

        {currentPage === 'legal' && <LegalView />}

        {currentPage === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            settings={settings}
            sermons={sermons}
            events={events}
            announcements={announcements}
            news={news}
            gallery={gallery}
            ministries={ministries}
            branches={branches}
            leadership={leadership}
            messages={messages}
            auditLogs={auditLogs}
            onClose={() => setCurrentPage('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onOpenGiving={() => setGivingModalOpen(true)}
        onOpenContact={() => openContactWithMode(false)}
      />

      {/* Audio Sermon Streaming Modal */}
      {activeAudioSermon && (
        <AudioPlayerModal sermon={activeAudioSermon} onClose={() => setActiveAudioSermon(null)} />
      )}

      {/* Video Sermon Modal */}
      {activeVideoSermon && (
        <VideoPlayerModal sermon={activeVideoSermon} onClose={() => setActiveVideoSermon(null)} />
      )}

      {/* Giving & Stewardship Modal */}
      {givingModalOpen && (
        <GivingModal settings={settings} onClose={() => setGivingModalOpen(false)} />
      )}

      {/* Contact & Prayer Request Modal */}
      {contactModalOpen && (
        <ContactModal initialIsPrayer={isPrayerMode} onClose={() => setContactModalOpen(false)} />
      )}
    </div>
  );
}
