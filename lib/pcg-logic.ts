import { UserRole, PublicationStatus, Sermon, ChurchEvent, NewsArticle } from '../types/pcg';

/**
 * Checks role-based permission hierarchy:
 * SUPER_ADMIN > ADMIN > EDITOR > PUBLIC_VISITOR
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    PUBLIC_VISITOR: 0,
    EDITOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

/**
 * Validates if a user can edit an item based on its status and the user's role.
 * - Editors can edit drafts and submitted items, but cannot delete or change security settings.
 * - Admins and Super Admins can edit and publish any item.
 */
export function canEditContent(userRole: UserRole, currentStatus?: PublicationStatus): boolean {
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return true;
  }
  if (userRole === 'EDITOR') {
    return currentStatus === 'draft' || currentStatus === undefined;
  }
  return false;
}

/**
 * Formats duration in seconds into 'MM:SS' or 'HH:MM:SS'
 */
export function formatAudioDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || isNaN(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${formattedMins}:${formattedSecs}`;
  }
  return `${mins}:${formattedSecs}`;
}

/**
 * Formats an ISO date into standard Presbyterian bulletin date format (e.g. Sunday, 25 October 2026)
 */
export function formatPcgDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Generates an automated unique giving reference for Ghanaian Mobile Money or Bank deposits
 * Format: PCG-{TYPE}-{TIMESTAMP}-{SUFFIX}
 */
export function generateGivingReference(
  givingType: 'TITHE' | 'OFFERING' | 'THANKSGIVING' | 'WELFARE' | 'MISSION',
  phone: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-4) || '0000';
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `PCG-${givingType}-${cleanPhone}-${timestamp}`;
}

/**
 * Contact message validation and sanitization
 */
export interface ContactValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: {
    name: string;
    email: string;
    phone: string;
    presbytery: string;
    subject: string;
    message: string;
    prayerRequest: boolean;
  };
}

export function validateContactForm(input: {
  name?: string;
  email?: string;
  phone?: string;
  presbytery?: string;
  subject?: string;
  message?: string;
  prayerRequest?: boolean;
}): ContactValidationResult {
  const errors: Record<string, string> = {};

  const name = (input.name || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  const phone = (input.phone || '').trim();
  const presbytery = (input.presbytery || 'General').trim();
  const subject = (input.subject || '').trim();
  const message = (input.message || '').trim();
  const prayerRequest = Boolean(input.prayerRequest);

  if (!name || name.length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (phone && !/^[+0-9\s-]{9,16}$/.test(phone)) {
    errors.phone = 'Please provide a valid phone number (e.g. 0244123456 or +233244123456).';
  }

  if (!subject || subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (!message || message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  // Basic anti-spam check (honeypot or suspicious repetitive URLs)
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) {
    errors.message = 'Too many external links detected. Please remove promotional links.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: name.replace(/<[^>]*>?/gm, ''),
      email,
      phone,
      presbytery,
      subject: subject.replace(/<[^>]*>?/gm, ''),
      message: message.replace(/<[^>]*>?/gm, ''),
      prayerRequest,
    },
  };
}

/**
 * Filter sermons with search query, category, presbytery, and status
 */
export function filterSermons(
  sermons: Sermon[],
  filters: {
    search?: string;
    category?: string;
    presbytery?: string;
    status?: PublicationStatus | 'all';
  }
): Sermon[] {
  return sermons.filter((sermon) => {
    // Status filter
    if (filters.status && filters.status !== 'all' && sermon.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && sermon.category !== filters.category) {
      return false;
    }

    // Presbytery filter
    if (filters.presbytery && filters.presbytery !== 'all' && sermon.presbytery !== filters.presbytery) {
      return false;
    }

    // Text search filter
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      const matchTitle = sermon.title.toLowerCase().includes(q);
      const matchSpeaker = sermon.speaker.toLowerCase().includes(q);
      const matchScripture = sermon.scripture.toLowerCase().includes(q);
      const matchTheme = sermon.theme.toLowerCase().includes(q);
      const matchDescription = sermon.description.toLowerCase().includes(q);

      if (!matchTitle && !matchSpeaker && !matchScripture && !matchTheme && !matchDescription) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter events by upcoming / past / all and text search
 */
export function filterEvents(
  events: ChurchEvent[],
  filters: {
    search?: string;
    timeframe?: 'all' | 'upcoming' | 'past';
    presbytery?: string;
    category?: string;
  }
): ChurchEvent[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return events.filter((evt) => {
    // Timeframe
    if (filters.timeframe === 'upcoming') {
      if (evt.startDate < todayStr) return false;
    } else if (filters.timeframe === 'past') {
      if (evt.startDate >= todayStr) return false;
    }

    // Presbytery
    if (filters.presbytery && filters.presbytery !== 'all' && evt.presbytery !== filters.presbytery) {
      return false;
    }

    // Category
    if (filters.category && filters.category !== 'all' && evt.category !== filters.category) {
      return false;
    }

    // Search query
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchVenue = evt.venue.toLowerCase().includes(q);
      const matchSpeaker = (evt.speaker || '').toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);

      if (!matchTitle && !matchVenue && !matchSpeaker && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validates media uploads before sending to Cloud Storage
 */
export function validateMediaUpload(
  file: { name: string; size: number; type: string },
  options: {
    allowedTypes?: string[];
    maxSizeBytes?: number;
  } = {}
): { valid: boolean; error?: string } {
  const allowed = options.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'video/mp4',
    'application/pdf',
  ];

  const max = options.maxSizeBytes || 50 * 1024 * 1024; // 50MB default

  if (!file.name || !file.size) {
    return { valid: false, error: 'Empty file detected.' };
  }

  if (file.size > max) {
    const maxMb = Math.round(max / (1024 * 1024));
    return { valid: false, error: `File size exceeds the maximum limit of ${maxMb}MB.` };
  }

  const isTypeAllowed = allowed.some((t) => {
    if (t.endsWith('/*')) {
      return file.type.startsWith(t.replace('/*', ''));
    }
    return file.type === t;
  });

  if (!isTypeAllowed) {
    return { valid: false, error: `Unsupported file type: ${file.type || 'unknown'}. Allowed: ${allowed.join(', ')}` };
  }

  return { valid: true };
}
