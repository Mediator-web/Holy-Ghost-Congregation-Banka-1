'use client';

import React, { useState } from 'react';
import {
  UserProfile,
  UserRole,
  Sermon,
  ChurchEvent,
  Announcement,
  NewsArticle,
  GalleryAlbum,
  Ministry,
  ChurchBranch,
  LeadershipProfile,
  WebsiteSettings,
  AuditLog,
  ContactMessage,
  PublicationStatus,
} from '../types/pcg';
import {
  signInAdmin,
  signOutAdmin,
  createSermon,
  updateSermon,
  deleteSermon,
  createEvent,
  updateEvent,
  deleteEvent,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createNews,
  updateNews,
  deleteNews,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  updateMinistry,
  createBranch,
  updateBranch,
  deleteBranch,
  updateLeadership,
  updateSettings,
  updateMessageStatus,
  uploadMediaWithProgress,
  resetToSeedData,
  syncSeedDataToLiveFirebase,
  firebaseConfig,
  isLiveFirebaseConfigured,
} from '../lib/firebase';
import { hasPermission, canEditContent, validateMediaUpload, formatPcgDate } from '../lib/pcg-logic';
import {
  Shield,
  ShieldCheck,
  Lock,
  LogOut,
  LayoutDashboard,
  Radio,
  Calendar,
  Bell,
  Newspaper,
  Image as ImageIcon,
  Users,
  MapPin,
  Award,
  Settings,
  Mail,
  History,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
  settings: WebsiteSettings;
  sermons: Sermon[];
  events: ChurchEvent[];
  announcements: Announcement[];
  news: NewsArticle[];
  gallery: GalleryAlbum[];
  ministries: Ministry[];
  branches: ChurchBranch[];
  leadership: LeadershipProfile[];
  messages: ContactMessage[];
  auditLogs: AuditLog[];
  onClose: () => void;
}

type AdminTab =
  | 'overview'
  | 'sermons'
  | 'events'
  | 'announcements'
  | 'news'
  | 'gallery'
  | 'ministries'
  | 'branches'
  | 'leadership'
  | 'settings'
  | 'messages'
  | 'audit';

export function AdminDashboard({
  currentUser,
  settings,
  sermons,
  events,
  announcements,
  news,
  gallery,
  ministries,
  branches,
  leadership,
  messages,
  auditLogs,
  onClose,
}: AdminDashboardProps) {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin View
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PublicationStatus>('all');

  // Modal / Form States
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string; title: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const triggerFeedback = (msg: string, isError: boolean = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const res = await signInAdmin(email, password);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setActiveTab('overview');
  };

  // If not logged in, show secure login portal
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0B3056] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#0B3056]">
              PCG Administrative Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized personnel sign-in for content and presbytery management
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pcgonline.org"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3056]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg bg-[#0B3056] hover:bg-[#002B49] text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 block mb-1.5">
              Available Test Role Credentials:
            </span>
            <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@pcgonline.org');
                  setPassword('Presby2026!');
                }}
                className="block text-left text-[#0B3056] hover:underline"
              >
                • <strong>SUPER_ADMIN:</strong> admin@pcgonline.org / Presby2026!
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('ga.editor@pcgonline.org');
                  setPassword('Presby2026!');
                }}
                className="block text-left text-blue-700 hover:underline"
              >
                • <strong>ADMIN:</strong> ga.editor@pcgonline.org / Presby2026!
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('editor@pcgonline.org');
                  setPassword('Presby2026!');
                }}
                className="block text-left text-slate-700 hover:underline"
              >
                • <strong>EDITOR:</strong> editor@pcgonline.org / Presby2026!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: 'sermons' | 'events' | 'gallery' | 'news') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaUpload(file);
    if (!validation.valid) {
      triggerFeedback(validation.error || 'Invalid file format.', true);
      return;
    }

    setUploadProgress(0);
    try {
      const res = await uploadMediaWithProgress(file, folder, (p) => setUploadProgress(p));
      setUploadedUrl(res.url);
      setUploadProgress(null);
      triggerFeedback(`Media "${file.name}" uploaded successfully!`);
    } catch (err: any) {
      setUploadProgress(null);
      triggerFeedback('Upload failed: ' + err.message, true);
    }
  };

  // Content deletion execution
  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'sermon') await deleteSermon(itemToDelete.id, currentUser);
      if (itemToDelete.type === 'event') await deleteEvent(itemToDelete.id, currentUser);
      if (itemToDelete.type === 'announcement') await deleteAnnouncement(itemToDelete.id, currentUser);
      if (itemToDelete.type === 'news') await deleteNews(itemToDelete.id, currentUser);
      if (itemToDelete.type === 'gallery') await deleteGalleryAlbum(itemToDelete.id, currentUser);
      if (itemToDelete.type === 'branch') await deleteBranch(itemToDelete.id, currentUser);

      triggerFeedback(`Deleted "${itemToDelete.title}" successfully.`);
      setItemToDelete(null);
    } catch (err: any) {
      triggerFeedback('Failed to delete item: ' + err.message, true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Admin Controls & Status Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold font-serif text-[#0B3056]">
              PCG Administrative Dashboard
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                currentUser.role === 'SUPER_ADMIN'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : currentUser.role === 'ADMIN'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Signed in as <span className="font-semibold text-slate-700">{currentUser.displayName}</span> ({currentUser.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Firebase vs Demo indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              isLiveFirebaseConfigured
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
            title={
              isLiveFirebaseConfigured
                ? `Connected to Live Firebase Project: ${firebaseConfig.projectId}`
                : 'Running in resilient simulated Realtime engine. Configure .env.local to attach live GCP project.'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveFirebaseConfigured ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              {isLiveFirebaseConfigured
                ? `Firebase Live: ${firebaseConfig.projectId}`
                : 'Simulated Realtime Engine'}
            </span>
          </div>

          {isLiveFirebaseConfigured && currentUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={async () => {
                const res = await syncSeedDataToLiveFirebase();
                if (res.success) {
                  triggerFeedback(`Live Realtime Database (${firebaseConfig.projectId}) successfully seeded!`);
                } else {
                  triggerFeedback('Sync note: ' + res.message, true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
              title="Populate your live Firebase Realtime Database with initial PCG records"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Sync to {firebaseConfig.projectId} RTDB</span>
            </button>
          )}

          {currentUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => {
                if (window.confirm('Reset all church database records back to the initial Presbyterian seed data?')) {
                  resetToSeedData();
                  triggerFeedback('Database reset to Presbyterian seed records.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              title="Reset sample records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Global Action Toasts */}
      {actionSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-medium flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm font-medium flex items-center gap-2 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2 mb-6 scrollbar-none text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
          { id: 'sermons', label: `Sermons (${sermons.length})`, icon: <Radio className="w-3.5 h-3.5" /> },
          { id: 'events', label: `Events (${events.length})`, icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: <Bell className="w-3.5 h-3.5" /> },
          { id: 'news', label: `News (${news.length})`, icon: <Newspaper className="w-3.5 h-3.5" /> },
          { id: 'gallery', label: `Gallery (${gallery.length})`, icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: 'ministries', label: `Ministries (${ministries.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'branches', label: `Branches (${branches.length})`, icon: <MapPin className="w-3.5 h-3.5" /> },
          { id: 'leadership', label: `Leadership (${leadership.length})`, icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'messages', label: `Messages (${messages.filter(m => m.status === 'unread').length} unread)`, icon: <Mail className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
          { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: <History className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0B3056] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ----------------- TAB: OVERVIEW ----------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Total Sermons
              </div>
              <div className="text-3xl font-bold font-serif text-[#0B3056] mt-2">
                {sermons.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {sermons.filter((s) => s.status === 'published').length} Published Live
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Active Events
              </div>
              <div className="text-3xl font-bold font-serif text-[#C41230] mt-2">
                {events.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Including General Assembly
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Announcements & News
              </div>
              <div className="text-3xl font-bold font-serif text-slate-800 mt-2">
                {announcements.length + news.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Presbytery & Synod Releases
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Unread Messages
              </div>
              <div className="text-3xl font-bold font-serif text-amber-600 mt-2">
                {messages.filter((m) => m.status === 'unread').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Petitions & Inquiries
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('sermon');
                }}
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#0B3056]" />
                Add New Sermon
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('event');
                }}
                className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-900 hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#C41230]" />
                Schedule Church Event
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('announcement');
                }}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-700" />
                Post Announcement
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('branch');
                }}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                Register Branch
              </button>
            </div>
          </div>

          {/* Recent Audit Logs Snapshot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Recent Security & Content Audit Trail
              </h3>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs text-blue-600 hover:underline"
              >
                View all ({auditLogs.length})
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'UPDATE' || log.action === 'PUBLISH'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'DELETE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.entityType}:</span>
                    <span className="text-slate-600 truncate max-w-xs md:max-w-md">{log.details}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: SERMONS ----------------- */}
      {activeTab === 'sermons' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#0B3056]">
                Manage Sermons & Media
              </h3>
              <p className="text-xs text-slate-500">
                Create, publish, edit, or archive audio and video sermon messages.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setModalType('sermon');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B3056] text-white text-xs font-bold hover:bg-[#002B49] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Sermon
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-3">Title & Speaker</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sermons.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">{sermon.title}</div>
                      <div className="text-slate-500 text-[11px]">
                        {sermon.speaker} • {sermon.scripture}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {sermon.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{sermon.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sermon.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sermon.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sermon.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(sermon);
                            setModalType('sermon');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Sermon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {currentUser.role !== 'EDITOR' && (
                          <button
                            onClick={() =>
                              setItemToDelete({ type: 'sermon', id: sermon.id, title: sermon.title })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Sermon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB: EVENTS ----------------- */}
      {activeTab === 'events' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#0B3056]">
                Manage Church Events
              </h3>
              <p className="text-xs text-slate-500">
                General Assembly, Presbytery rallies, synods, retreats, and harvest dates.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setModalType('event');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C41230] text-white text-xs font-bold hover:bg-[#a50f28] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Schedule Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-3">Event Title & Venue</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Presbytery</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">{evt.title}</div>
                      <div className="text-slate-500 text-[11px]">{evt.venue}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {evt.startDate} {evt.endDate ? `to ${evt.endDate}` : ''}
                    </td>
                    <td className="py-3 px-3">{evt.presbytery}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {evt.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(evt);
                            setModalType('event');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {currentUser.role !== 'EDITOR' && (
                          <button
                            onClick={() =>
                              setItemToDelete({ type: 'event', id: evt.id, title: evt.title })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB: ANNOUNCEMENTS ----------------- */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#0B3056]">
                Announcements & Communiques
              </h3>
              <p className="text-xs text-slate-500">
                Official notices from the Moderator, Clerk, and General Assembly Council.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setModalType('announcement');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B3056] text-white text-xs font-bold hover:bg-[#002B49] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">{ann.category}</span>
                    <span className="text-[11px] text-slate-400">
                      {formatPcgDate(ann.publishedAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{ann.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ann.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ann.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(ann);
                      setModalType('announcement');
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {currentUser.role !== 'EDITOR' && (
                    <button
                      onClick={() =>
                        setItemToDelete({ type: 'announcement', id: ann.id, title: ann.title })
                      }
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB: MESSAGES INBOX ----------------- */}
      {activeTab === 'messages' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-serif text-[#0B3056]">
              Pastoral Inquiries & Prayer Requests Inbox
            </h3>
            <p className="text-xs text-slate-500">
              Review petitions submitted by church members and the general public.
            </p>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No messages received yet. Submit one through the public Prayer Request button to test real-time synchronization.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    msg.status === 'unread'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                      <span className="text-xs text-slate-500 font-mono">({msg.email})</span>
                      {msg.prayerRequest && (
                        <span className="px-2 py-0.5 rounded bg-[#C41230] text-white text-[10px] font-bold">
                          PRAYER PETITION
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      <select
                        value={msg.status}
                        onChange={async (e) => {
                          await updateMessageStatus(msg.id, e.target.value as any, currentUser);
                          triggerFeedback(`Status updated to ${e.target.value}`);
                        }}
                        className="text-xs border rounded px-2 py-1 bg-white font-medium"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mb-1">
                    Subject: {msg.subject}
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB: SETTINGS ----------------- */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
          <h3 className="text-lg font-bold font-serif text-[#0B3056] mb-1">
            Church Website & Giving Configuration
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Official Presbyterian Church of Ghana general settings, theme scripture, and MoMo credentials.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateSettings(settings, currentUser.email);
              triggerFeedback('Website configuration saved successfully.');
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Church Name</label>
                <input
                  type="text"
                  value={settings.churchName}
                  onChange={(e) => (settings.churchName = e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Motto</label>
                <input
                  type="text"
                  value={settings.motto}
                  onChange={(e) => (settings.motto = e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme of the Year</label>
                <input
                  type="text"
                  value={settings.themeTitle}
                  onChange={(e) => (settings.themeTitle = e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme Scripture</label>
                <input
                  type="text"
                  value={settings.themeScripture}
                  onChange={(e) => (settings.themeScripture = e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
              <input
                type="text"
                value={settings.headOfficeAddress}
                onChange={(e) => (settings.headOfficeAddress = e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Firebase Live Project Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Firebase Live Integration Status</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  {isLiveFirebaseConfigured ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block">Project ID:</span>
                  <span className="font-bold text-slate-800">{firebaseConfig.projectId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Auth Domain:</span>
                  <span className="font-bold text-slate-800">{firebaseConfig.authDomain}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Realtime Database:</span>
                  <span className="font-bold text-slate-800 truncate block">{firebaseConfig.databaseURL}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Cloud Storage Bucket:</span>
                  <span className="font-bold text-slate-800">{firebaseConfig.storageBucket}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={currentUser.role === 'EDITOR'}
                className="px-5 py-2.5 rounded-lg bg-[#0B3056] text-white font-bold hover:bg-[#002B49] transition-colors disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------- TAB: AUDIT LOGS ----------------- */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-serif text-[#0B3056]">
              System Audit Logs & Security Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable log of administrator actions, content publication, and privilege updates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800">{log.actorEmail}</span>
                      <span className="text-[10px] text-slate-400 block font-sans">({log.actorRole})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'UPDATE' || log.action === 'PUBLISH'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'DELETE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{log.entityType}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- CREATE / EDIT SERMON MODAL ----------------- */}
      {modalType === 'sermon' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-6">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#0B3056] mb-4">
              {editingItem ? 'Edit Sermon' : 'Create New Sermon'}
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const title = form.title.value;
                const speaker = form.speaker.value;
                const speakerRole = form.speakerRole.value;
                const scripture = form.scripture.value;
                const theme = form.theme.value;
                const category = form.category.value;
                const status = form.status.value;
                const presbytery = form.presbytery.value;
                const description = form.description.value;

                try {
                  if (editingItem) {
                    await updateSermon(
                      editingItem.id,
                      {
                        title,
                        speaker,
                        speakerRole,
                        scripture,
                        theme,
                        category,
                        status,
                        presbytery,
                        description,
                        coverImage: uploadedUrl || editingItem.coverImage,
                      },
                      currentUser
                    );
                    triggerFeedback('Sermon updated successfully.');
                  } else {
                    await createSermon(
                      {
                        title,
                        speaker,
                        speakerRole,
                        scripture,
                        theme,
                        category,
                        status,
                        presbytery,
                        description,
                        date: new Date().toISOString().split('T')[0],
                        coverImage: uploadedUrl || 'https://picsum.photos/seed/pcg_sermon_new/800/500',
                        durationSeconds: 2400,
                        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                      },
                      currentUser
                    );
                    triggerFeedback('New sermon created successfully.');
                  }
                  setModalType(null);
                  setUploadedUrl('');
                } catch (err: any) {
                  triggerFeedback(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sermon Title *</label>
                <input
                  name="title"
                  defaultValue={editingItem?.title || ''}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preacher Name *</label>
                  <input
                    name="speaker"
                    defaultValue={editingItem?.speaker || 'Rt. Rev. Dr. Abraham Nana Opare Kwakye'}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preacher Title / Role</label>
                  <input
                    name="speakerRole"
                    defaultValue={editingItem?.speakerRole || 'Moderator of the General Assembly'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scripture *</label>
                  <input
                    name="scripture"
                    defaultValue={editingItem?.scripture || '2 Corinthians 5:17-21'}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Theme *</label>
                  <input
                    name="theme"
                    defaultValue={editingItem?.theme || 'Set Free to Live as Christ’s Ambassadors'}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingItem?.category || 'Sunday Service'}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Sunday Service">Sunday Service</option>
                    <option value="Midweek Service">Midweek Service</option>
                    <option value="Youth Conference">Youth Conference</option>
                    <option value="Communion">Communion</option>
                    <option value="Revival">Revival</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Presbytery</label>
                  <input
                    name="presbytery"
                    defaultValue={editingItem?.presbytery || 'General Assembly'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'published'}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Media Upload Simulation */}
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Cover Photo or Audio (Cloud Storage)
                </label>
                <input
                  type="file"
                  accept="image/*,audio/*"
                  onChange={(e) => handleFileUpload(e, 'sermons')}
                  className="text-xs"
                />
                {uploadProgress !== null && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">Uploading: {uploadProgress}%</span>
                  </div>
                )}
                {uploadedUrl && (
                  <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Media file ready to attach</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem?.description || ''}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B3056] text-white font-bold hover:bg-[#002B49]"
                >
                  Save Sermon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- CONFIRM DELETE DIALOG ----------------- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-serif">Confirm Deletion</h4>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-800">"{itemToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
