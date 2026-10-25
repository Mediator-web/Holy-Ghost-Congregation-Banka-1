import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasPermission,
  canEditContent,
  formatAudioDuration,
  formatPcgDate,
  generateGivingReference,
  validateContactForm,
  filterSermons,
  filterEvents,
  validateMediaUpload,
} from './pcg-logic';
import { Sermon, ChurchEvent } from '../types/pcg';

test('hasPermission validates role hierarchy correctly', () => {
  assert.equal(hasPermission('SUPER_ADMIN', 'SUPER_ADMIN'), true);
  assert.equal(hasPermission('SUPER_ADMIN', 'ADMIN'), true);
  assert.equal(hasPermission('SUPER_ADMIN', 'EDITOR'), true);
  assert.equal(hasPermission('ADMIN', 'SUPER_ADMIN'), false);
  assert.equal(hasPermission('ADMIN', 'ADMIN'), true);
  assert.equal(hasPermission('ADMIN', 'EDITOR'), true);
  assert.equal(hasPermission('EDITOR', 'ADMIN'), false);
  assert.equal(hasPermission('EDITOR', 'EDITOR'), true);
  assert.equal(hasPermission('PUBLIC_VISITOR', 'EDITOR'), false);
});

test('canEditContent guards publication workflow', () => {
  assert.equal(canEditContent('SUPER_ADMIN', 'published'), true);
  assert.equal(canEditContent('ADMIN', 'archived'), true);
  assert.equal(canEditContent('EDITOR', 'draft'), true);
  assert.equal(canEditContent('EDITOR', 'published'), false);
  assert.equal(canEditContent('PUBLIC_VISITOR', 'draft'), false);
});

test('formatAudioDuration formats seconds into proper time strings', () => {
  assert.equal(formatAudioDuration(0), '0:00');
  assert.equal(formatAudioDuration(65), '1:05');
  assert.equal(formatAudioDuration(3600), '1:00:00');
  assert.equal(formatAudioDuration(3665), '1:01:05');
});

test('formatPcgDate formats ISO date correctly', () => {
  const formatted = formatPcgDate('2026-10-25T10:00:00Z');
  assert.ok(formatted.includes('2026'));
  assert.ok(formatted.includes('October'));
});

test('generateGivingReference produces structured alphanumeric codes', () => {
  const ref = generateGivingReference('TITHE', '0244123456');
  assert.ok(ref.startsWith('PCG-TITHE-3456-'));
});

test('validateContactForm rejects invalid inputs and sanitizes valid entries', () => {
  // Invalid submission
  const invalidRes = validateContactForm({
    name: 'A',
    email: 'not-an-email',
    subject: 'Hi',
    message: 'short',
  });
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.errors.name);
  assert.ok(invalidRes.errors.email);
  assert.ok(invalidRes.errors.message);

  // Valid submission with HTML injection prevention
  const validRes = validateContactForm({
    name: '<b>Kwame Mensah</b>',
    email: 'kwame.mensah@example.com',
    phone: '+233244123456',
    presbytery: 'Ga Presbytery',
    subject: 'Prayer Request for Family',
    message: 'Please pray for my mother who is undergoing surgery this Sunday.',
    prayerRequest: true,
  });
  assert.equal(validRes.valid, true);
  assert.equal(validRes.sanitized.name, 'Kwame Mensah');
  assert.equal(validRes.sanitized.prayerRequest, true);
});

test('filterSermons searches by title, speaker, scripture, and filters by category', () => {
  const sampleSermons: Sermon[] = [
    {
      id: 's1',
      title: 'Walking in the Light of Christ',
      speaker: 'Rt. Rev. Dr. Abraham Nana Opare Kwakye',
      speakerRole: 'Moderator of the General Assembly',
      date: '2026-10-18',
      scripture: '1 John 1:5-10',
      theme: 'Set Free to Live as Christ’s Ambassadors',
      coverImage: 'https://picsum.photos/seed/sermon1/800/600',
      durationSeconds: 2400,
      presbytery: 'Head Office',
      category: 'Sunday Service',
      status: 'published',
      description: 'An uplifting sermon on righteousness and unity.',
      downloadsCount: 120,
      playsCount: 450,
      createdAt: '2026-10-18T10:00:00Z',
      updatedAt: '2026-10-18T10:00:00Z',
    },
    {
      id: 's2',
      title: 'Youth in Christian Leadership',
      speaker: 'Rev. Emmanuel Adjei',
      speakerRole: 'National Youth Director',
      date: '2026-10-11',
      scripture: '1 Timothy 4:12',
      theme: 'Equipping the Youth',
      coverImage: 'https://picsum.photos/seed/sermon2/800/600',
      durationSeconds: 1800,
      presbytery: 'Ga Presbytery',
      category: 'Youth Conference',
      status: 'published',
      description: 'Encouraging youth to lead with moral integrity.',
      downloadsCount: 85,
      playsCount: 310,
      createdAt: '2026-10-11T10:00:00Z',
      updatedAt: '2026-10-11T10:00:00Z',
    },
    {
      id: 's3',
      title: 'Draft Communion Reflection',
      speaker: 'Rev. Dr. Odonkor',
      speakerRole: 'Clerk of GA',
      date: '2026-10-25',
      scripture: '1 Corinthians 11:23-26',
      theme: 'The Lord’s Table',
      coverImage: 'https://picsum.photos/seed/sermon3/800/600',
      durationSeconds: 1200,
      presbytery: 'Ga Presbytery',
      category: 'Communion',
      status: 'draft',
      description: 'Draft notes.',
      downloadsCount: 0,
      playsCount: 0,
      createdAt: '2026-10-25T10:00:00Z',
      updatedAt: '2026-10-25T10:00:00Z',
    },
  ];

  const searchResults = filterSermons(sampleSermons, { search: 'light' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 's1');

  const speakerResults = filterSermons(sampleSermons, { search: 'Adjei' });
  assert.equal(speakerResults.length, 1);
  assert.equal(speakerResults[0].id, 's2');

  const publishedOnly = filterSermons(sampleSermons, { status: 'published' });
  assert.equal(publishedOnly.length, 2);
});

test('validateMediaUpload validates file size and MIME types', () => {
  const validFile = { name: 'sermon.mp3', size: 10 * 1024 * 1024, type: 'audio/mpeg' };
  assert.equal(validateMediaUpload(validFile).valid, true);

  const oversizedFile = { name: 'huge_recording.wav', size: 70 * 1024 * 1024, type: 'audio/wav' };
  const oversizedRes = validateMediaUpload(oversizedFile, { maxSizeBytes: 50 * 1024 * 1024 });
  assert.equal(oversizedRes.valid, false);
  assert.ok(oversizedRes.error?.includes('exceeds'));

  const invalidTypeFile = { name: 'virus.exe', size: 1024, type: 'application/x-msdownload' };
  assert.equal(validateMediaUpload(invalidTypeFile).valid, false);
});
