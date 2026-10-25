export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'PUBLIC_VISITOR';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  presbytery?: string;
  createdAt: string;
  lastLoginAt: string;
}

export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  date: string;
  scripture: string;
  theme: string;
  audioUrl?: string;
  videoUrl?: string;
  coverImage: string;
  durationSeconds: number;
  presbytery: string;
  category: 'Sunday Service' | 'Midweek Service' | 'Revival' | 'Youth Conference' | 'Communion';
  status: PublicationStatus;
  description: string;
  notesUrl?: string;
  downloadsCount: number;
  playsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  time: string;
  venue: string;
  address: string;
  presbytery: string;
  organizer: string;
  speaker?: string;
  description: string;
  bannerUrl: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  registeredCount?: number;
  category: 'General Assembly' | 'Presbytery' | 'Youth Rally' | 'Harvest' | 'Retreat' | 'Training';
  status: PublicationStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'General' | 'Presbytery' | 'Youth' | 'Women' | 'General Assembly' | 'Obituary';
  priority: 'normal' | 'urgent';
  publishedAt: string;
  expiresAt?: string;
  status: PublicationStatus;
  author: string;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  presbytery: string;
  tags: string[];
  publishedAt: string;
  readTimeMinutes: number;
  status: PublicationStatus;
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  eventDate: string;
  description: string;
  coverImage: string;
  category: 'General Assembly' | 'Ordination' | 'Youth Rally' | 'Synod' | 'Church Dedication';
  photos: GalleryPhoto[];
  status: PublicationStatus;
  createdAt: string;
}

export interface Ministry {
  id: string;
  name: string;
  acronym: string;
  motto: string;
  leaderName: string;
  leaderRole: string;
  description: string;
  meetingTimes: string;
  activities: string[];
  bannerImage: string;
  targetGroup: string;
  contactEmail: string;
  status: PublicationStatus;
}

export interface ServiceTime {
  day: string;
  time: string;
  label: string;
}

export interface ChurchBranch {
  id: string;
  name: string;
  presbytery: string;
  district: string;
  address: string;
  city: string;
  region: string;
  ministerInCharge: string;
  associateMinisters?: string[];
  phone: string;
  email: string;
  serviceTimes: ServiceTime[];
  googleMapsQuery?: string;
}

export interface LeadershipProfile {
  id: string;
  name: string;
  title: string;
  roleCategory: 'General Assembly' | 'Presbytery Chairperson' | 'Clerk' | 'Departmental Director';
  bio: string;
  tenure: string;
  photoUrl: string;
  contactEmail: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  presbytery: string;
  subject: string;
  message: string;
  prayerRequest: boolean;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE' | 'LOGIN' | 'SETTING_CHANGE';
  entityType: 'Sermon' | 'Event' | 'Announcement' | 'News' | 'Gallery' | 'Ministry' | 'Branch' | 'Setting' | 'User';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface WebsiteSettings {
  churchName: string;
  motto: string;
  themeYear: string;
  themeTitle: string;
  themeScripture: string;
  themeText: string;
  moderatorName: string;
  clerkName: string;
  headOfficeAddress: string;
  headOfficePhone: string;
  headOfficeEmail: string;
  prayerHotline: string;
  givingDetails: {
    mtnMomo: { number: string; merchantName: string };
    telecelCash: { number: string; merchantName: string };
    bankAccounts: { bank: string; accountName: string; accountNumber: string; branch: string }[];
  };
}
