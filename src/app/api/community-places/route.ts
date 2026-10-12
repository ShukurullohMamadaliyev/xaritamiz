import { NextResponse } from 'next/server';
import {
  ADMIN_TELEGRAM_ID,
  CommunityPlaceSubmission,
  addCommunitySubmission,
  loadCommunitySubmissions,
  moderateCommunitySubmission,
  saveCommunitySubmissions,
  sendSubmissionToAdminTelegram
} from '../../../lib/communityPlacesStore';
import { LocationCategory, LocationItem } from '../../../types';

const BANNED_WORDS = [
  'bar',
  'pub',
  'club',
  'nightclub',
  'disco',
  'disko',
  'диско',
  'клуб',
  'бар',
  'паб',
  'pivo',
  'beer',
  'wine',
  'alko',
  'vodka',
  'kalyan',
  'кальян',
  'hookah',
  'shisha',
  'karaoke',
  'караоке',
  'casino'
];

function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((w) => lower.includes(w));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get('adminId') || '';
  const all = loadCommunitySubmissions();

  const approvedLocations: LocationItem[] = all
    .filter((item) => item.status === 'approved')
    .map((item) => item.location);

  if (adminId === ADMIN_TELEGRAM_ID) {
    return NextResponse.json({
      success: true,
      isAdmin: true,
      approvedPlaces: approvedLocations,
      allSubmissions: all
    });
  }

  return NextResponse.json({
    success: true,
    isAdmin: false,
    approvedPlaces: approvedLocations
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || 'submit';

    // 1. Yangi joy yuborish (Foydalanuvchi yoki Admin tomonidan)
    if (action === 'submit') {
      const title = String(body.title || '').trim();
      const district = String(body.district || 'Toshkent shahri').trim();
      const address = String(body.address || district).trim();
      const category = (body.category || 'park_nature') as LocationCategory;
      const categoryLabel = String(body.categoryLabel || '🌿 Sokin Maskan').trim();
      const averageCheck = String(body.averageCheck || 'Bepul').trim();
      const estimatedPrice = typeof body.estimatedPrice === 'number' ? body.estimatedPrice : 0;
      const lat = typeof body.lat === 'number' ? body.lat : 41.3111;
      const lng = typeof body.lng === 'number' ? body.lng : 69.2797;
      const tipText = String(
        body.tipText || 'Foydalanuvchi tomonidan tavsiya etilgan sokin va go‘zal maskan.'
      ).trim();
      const imageUrl = String(body.imageUrl || '/places/vuzgorodok-pine-park.jpg');
      const workingHours = String(body.workingHours || '08:00 — 22:00').trim();
      const submittedBy = String(body.submittedBy || 'Xaritamiz foydalanuvchisi').trim();
      const submitterTelegramId = body.submitterTelegramId
        ? String(body.submitterTelegramId)
        : undefined;
      const adminDirectApprove =
        body.adminDirectApprove === true && submitterTelegramId === ADMIN_TELEGRAM_ID;

      if (!title || title.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Joy nomi kamida 3 ta harfdan iborat bo‘lishi kerak.' },
          { status: 400 }
        );
      }

      if (containsBannedWord(`${title} ${tipText} ${categoryLabel}`)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Xaritamiz faqat sokin, oilaviy va madaniy dam olish maskanlarini qabul qiladi (bar, diskoteka va tungi klublar taqiqlangan).'
          },
          { status: 400 }
        );
      }

      const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const location: LocationItem = {
        id,
        title,
        category,
        categoryLabel,
        vibeTags: ['quiet_nature', 'aesthetic_photo'],
        companionTags: ['solo', 'couple', 'family', 'friends'],
        budgetTier: estimatedPrice === 0 || estimatedPrice <= 60000 ? 'budget' : 'medium',
        averageCheck,
        estimatedPrice,
        lat,
        lng,
        address,
        district,
        tipText,
        imageUrl,
        durationMinutes: 60,
        workingHours,
        rating: 4.9,
        features: [
          '🌟 Foydalanuvchi kashfiyoti',
          '✅ Admin tasdiqlagan',
          `👤 ${submittedBy}`
        ]
      };

      const submission: CommunityPlaceSubmission = {
        id,
        status: adminDirectApprove ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        moderatedAt: adminDirectApprove ? new Date().toISOString() : undefined,
        submittedBy,
        submitterTelegramId,
        location
      };

      addCommunitySubmission(submission);

      // Telegram orqali Bosh Adminga (7048168954) Tasdiqlash / Rad etish tugmalari bilan yuborish
      const telegramSent = await sendSubmissionToAdminTelegram(submission);

      return NextResponse.json({
        success: true,
        telegramSent,
        submission,
        message: adminDirectApprove
          ? 'Admin sifatida joy darhol tasdiqlandi va saytga qo‘shildi!'
          : 'Joyingiz qabul qilindi va Bosh Admin (Telegram bot + Admin panel) tekshiruviga yuborildi. Tasdiqlangandan so‘ng saytda ko‘rinadi!'
      });
    }

    // 2. Admin Paneldan Tasdiqlash / Rad etish / O'chirish (faqat 7048168954 uchun)
    if (action === 'moderate') {
      const adminId = String(body.adminId || '');
      if (adminId !== ADMIN_TELEGRAM_ID) {
        return NextResponse.json(
          { success: false, error: 'Faqat Bosh Admin (7048168954) bu amalni bajara oladi!' },
          { status: 403 }
        );
      }

      const placeId = String(body.placeId || '');
      const newStatus = body.status as 'approved' | 'rejected' | 'deleted';

      // Agar clientda ushbu submission obyektining to'liq nusxasi bo'lsa va server cold-start bo'lgan bo'lsa, avval tiklaymiz
      if (body.submissionSnapshot && newStatus !== 'deleted') {
        const list = loadCommunitySubmissions();
        if (!list.some((x) => x.id === placeId)) {
          list.unshift(body.submissionSnapshot as CommunityPlaceSubmission);
          saveCommunitySubmissions(list);
        }
      }

      const updated = moderateCommunitySubmission(placeId, newStatus);
      const all = loadCommunitySubmissions();

      return NextResponse.json({
        success: true,
        updated,
        allSubmissions: all,
        approvedPlaces: all.filter((x) => x.status === 'approved').map((x) => x.location)
      });
    }

    // 3. Client va Server keshini sinxronlash
    if (action === 'sync') {
      const clientSubmissions: CommunityPlaceSubmission[] = Array.isArray(body.submissions)
        ? body.submissions
        : [];
      const serverList = loadCommunitySubmissions();
      const map = new Map<string, CommunityPlaceSubmission>();

      for (const item of serverList) {
        map.set(item.id, item);
      }
      for (const cItem of clientSubmissions) {
        if (!cItem || !cItem.id) continue;
        const existing = map.get(cItem.id);
        if (!existing) {
          map.set(cItem.id, cItem);
        } else if (existing.status === 'pending' && cItem.status !== 'pending') {
          map.set(cItem.id, cItem);
        }
      }

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveCommunitySubmissions(merged);

      const adminId = String(body.adminId || '');
      return NextResponse.json({
        success: true,
        approvedPlaces: merged.filter((x) => x.status === 'approved').map((x) => x.location),
        allSubmissions: adminId === ADMIN_TELEGRAM_ID ? merged : undefined
      });
    }

    return NextResponse.json({ success: false, error: 'Noma’lum amal' }, { status: 400 });
  } catch (err) {
    console.error('Community places API error:', err);
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
