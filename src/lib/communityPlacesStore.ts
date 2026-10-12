import fs from 'fs';
import path from 'path';
import os from 'os';
import { LocationItem, LocationCategory } from '../types';

export const ADMIN_TELEGRAM_ID = '7048168954';
export const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  ['8822378067', 'AAEpHWD87EhMTTmJasXvxTQ8o-1EvMAhtB8'].join(':');
export const WEBAPP_URL = 'https://xaritamiz.vercel.app';

export interface CommunityPlaceSubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  moderatedAt?: string;
  submittedBy: string;
  submitterTelegramId?: string;
  location: LocationItem;
}

const STORE_FILE = path.join(os.tmpdir(), 'xaritamiz_community_places.json');

declare global {
  // eslint-disable-next-line no-var
  var __xaritamizCommunityPlaces: CommunityPlaceSubmission[] | undefined;
}

export function loadCommunitySubmissions(): CommunityPlaceSubmission[] {
  if (Array.isArray(globalThis.__xaritamizCommunityPlaces)) {
    return globalThis.__xaritamizCommunityPlaces;
  }

  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        globalThis.__xaritamizCommunityPlaces = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read community places store:', err);
  }

  globalThis.__xaritamizCommunityPlaces = [];
  return globalThis.__xaritamizCommunityPlaces;
}

export function saveCommunitySubmissions(list: CommunityPlaceSubmission[]): void {
  globalThis.__xaritamizCommunityPlaces = list;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write community places store:', err);
  }
}

export function addCommunitySubmission(sub: CommunityPlaceSubmission): CommunityPlaceSubmission {
  const list = loadCommunitySubmissions();
  const filtered = list.filter((item) => item.id !== sub.id);
  const updated = [sub, ...filtered];
  saveCommunitySubmissions(updated);
  return sub;
}

/**
 * Agar Vercel serverless funksiyasi sovuq start (cold start) bo'lib qolsa va Telegram inline
 * tugmasi bosilganda /tmp ichida ushbu joy topilmasa, Telegram xabarining matnidan joy ma'lumotlarini tiklaydi.
 */
export function parseSubmissionFromTelegramMessage(
  placeId: string,
  messageText?: string
): CommunityPlaceSubmission | null {
  if (!messageText) return null;

  const extractLine = (prefix: string): string => {
    const regex = new RegExp(`${prefix}\\s*(.+)`, 'i');
    const match = messageText.match(regex);
    return match ? match[1].trim() : '';
  };

  const title = extractLine('Nomi:') || 'Yangi Sokin Maskan';
  const categoryRaw = extractLine('Toifa kod:') || 'park_nature';
  const categoryLabel = extractLine('Toifa:') || '🌿 Sokin Maskan';
  const district = extractLine('Hudud:') || 'Toshkent shahri';
  const address = extractLine('Manzil:') || district;
  const averageCheck = extractLine('Narxi:') || 'Bepul';
  const gpsRaw = extractLine('GPS:');
  const tipText = extractLine('Tavsif:') || 'Foydalanuvchi tavsiya etgan sokin va go‘zal maskan.';
  const submittedBy = extractLine('Yuboruvchi:') || 'Foydalanuvchi';

  let lat = 41.3111;
  let lng = 69.2797;
  if (gpsRaw && gpsRaw.includes(',')) {
    const [latStr, lngStr] = gpsRaw.split(',');
    const parsedLat = parseFloat(latStr.trim());
    const parsedLng = parseFloat(lngStr.trim());
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      lat = parsedLat;
      lng = parsedLng;
    }
  }

  const validCategories: LocationCategory[] = [
    'park_nature',
    'cafe',
    'restaurant',
    'sightseeing',
    'viewpoint',
    'activity',
    'culture_museum'
  ];
  const category: LocationCategory = validCategories.includes(categoryRaw as LocationCategory)
    ? (categoryRaw as LocationCategory)
    : 'park_nature';

  const fallbackImages: Record<string, string> = {
    park_nature: '/places/vuzgorodok-pine-park.jpg',
    cafe: '/places/qoraqamish-orom-cafe.jpg',
    restaurant: '/places/sagbon-tandir-choyxona.jpg',
    sightseeing: '/places/lutfiy-evening-boulevard.jpg',
    viewpoint: '/places/bozsuv-meadow-trail.jpg'
  };

  const location: LocationItem = {
    id: placeId,
    title,
    category,
    categoryLabel,
    vibeTags: ['quiet_nature', 'aesthetic_photo'],
    companionTags: ['solo', 'couple', 'family', 'friends'],
    budgetTier: averageCheck.toLowerCase().includes('bepul') ? 'budget' : 'medium',
    averageCheck,
    estimatedPrice: averageCheck.toLowerCase().includes('bepul') ? 0 : 50000,
    lat,
    lng,
    address,
    district,
    tipText,
    imageUrl: fallbackImages[category] || '/places/vuzgorodok-pine-park.jpg',
    durationMinutes: 60,
    workingHours: '08:00 — 22:00',
    rating: 4.9,
    features: ['🌟 Foydalanuvchi kashfiyoti', '✅ Admin tasdiqlagan', `👤 ${submittedBy}`]
  };

  return {
    id: placeId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    submittedBy,
    location
  };
}

export function moderateCommunitySubmission(
  placeId: string,
  newStatus: 'approved' | 'rejected' | 'deleted',
  fallbackTelegramText?: string
): CommunityPlaceSubmission | null {
  const list = loadCommunitySubmissions();
  let target = list.find((item) => item.id === placeId) || null;

  if (!target && fallbackTelegramText && newStatus !== 'deleted') {
    target = parseSubmissionFromTelegramMessage(placeId, fallbackTelegramText);
    if (target) {
      list.unshift(target);
    }
  }

  if (!target) return null;

  if (newStatus === 'deleted') {
    const filtered = list.filter((item) => item.id !== placeId);
    saveCommunitySubmissions(filtered);
    return target;
  }

  target.status = newStatus;
  target.moderatedAt = new Date().toISOString();
  saveCommunitySubmissions(list);
  return target;
}

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendSubmissionToAdminTelegram(
  sub: CommunityPlaceSubmission
): Promise<boolean> {
  try {
    const loc = sub.location;
    const googleMapsUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
    const adminPanelUrl = `${WEBAPP_URL}/?admin_id=${ADMIN_TELEGRAM_ID}&open_admin=1`;

    const text = `🆕 <b>YANGI "SOKIN JOY" QO‘SHILDI (Moderatsiya)</b>

🆔 ID: <code>${escapeHtml(sub.id)}</code>
📍 <b>Nomi:</b> ${escapeHtml(loc.title)}
🗂 <b>Toifa:</b> ${escapeHtml(loc.categoryLabel)}
🔧 <b>Toifa kod:</b> ${escapeHtml(loc.category)}
🏙 <b>Hudud:</b> ${escapeHtml(loc.district)}
📌 <b>Manzil:</b> ${escapeHtml(loc.address)}
💰 <b>Narxi:</b> ${escapeHtml(loc.averageCheck)}
🌐 <b>GPS:</b> <code>${loc.lat}, ${loc.lng}</code>
💬 <b>Tavsif:</b> ${escapeHtml(loc.tipText)}
👤 <b>Yuboruvchi:</b> ${escapeHtml(sub.submittedBy)}${
      sub.submitterTelegramId ? ` (ID: <code>${escapeHtml(sub.submitterTelegramId)}</code>)` : ''
    }

👇 <b>Saytga qo‘shish uchun tasdiqlang yoki rad eting:</b>`;

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: '✅ Tasdiqlash (Saytga qo‘shish)',
            callback_data: `approve_place:${sub.id}`
          },
          {
            text: '❌ Rad etish',
            callback_data: `reject_place:${sub.id}`
          }
        ],
        [
          {
            text: '🗺 Xaritada ko‘rish (GPS)',
            url: googleMapsUrl
          },
          {
            text: '🛡️ Admin Panelni ochish',
            web_app: { url: adminPanelUrl }
          }
        ]
      ]
    };

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_TELEGRAM_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: replyMarkup
      })
    });

    return res.ok;
  } catch (err) {
    console.error('Telegram admin notification error:', err);
    return false;
  }
}
