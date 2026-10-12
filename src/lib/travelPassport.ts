import { LongTripItem, LONG_TRIPS_DATABASE as LONG_TRIPS, LongTripNatureType } from '../data/longTrips';
import { LOCATIONS_DATABASE as LOCATIONS } from '../data/locations';

const VISITED_STORAGE_KEY = 'xaritamiz_visited_v1';
const CHECKLIST_PREFIX = 'xaritamiz_checklist_v1_';

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  unlocked: boolean;
  current: number;
  target: number;
}

export interface PassportStats {
  visitedIds: string[];
  tashkentVisitedCount: number;
  tashkentTotalCount: number;
  longTripsVisitedCount: number;
  longTripsTotalCount: number;
  regionsVisitedCount: number;
  totalRegionsCount: number;
  rankTitle: string;
  rankEmoji: string;
  nextRankTitle: string;
  badges: AchievementBadge[];
}

export function getVisitedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VISITED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isPlaceVisited(id: string): boolean {
  return getVisitedIds().includes(id);
}

export function toggleVisitedId(id: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getVisitedIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('xaritamiz-passport-updated', { detail: next }));
  } catch {
    // ignore storage errors
  }
  return next;
}

export function getPassportStats(visitedIdsInput?: string[]): PassportStats {
  const visitedIds = visitedIdsInput ?? getVisitedIds();
  const visitedSet = new Set(visitedIds);

  const tashkentVisited = LOCATIONS.filter((loc) => visitedSet.has(loc.id));
  const longTripsVisited = LONG_TRIPS.filter((trip) => visitedSet.has(trip.id));

  const uniqueRegions = new Set(longTripsVisited.map((t) => t.region));
  if (tashkentVisited.length > 0) {
    uniqueRegions.add('Toshkent shahri');
  }

  const totalVisited = tashkentVisited.length + longTripsVisited.length;

  let rankTitle = 'Yangi Sayohatchi';
  let rankEmoji = '🌱';
  let nextRankTitle = 'Shahar Kashfiyotchisi (3 ta joy)';

  if (totalVisited >= 25) {
    rankTitle = 'O‘zbekiston Afsonasi';
    rankEmoji = '👑';
    nextRankTitle = 'Maksimal daraja!';
  } else if (totalVisited >= 12) {
    rankTitle = 'Karvonboshi Ekspert';
    rankEmoji = '🐪';
    nextRankTitle = 'O‘zbekiston Afsonasi (25 ta joy)';
  } else if (totalVisited >= 6) {
    rankTitle = 'Tajribali Sayyoh';
    rankEmoji = '🧭';
    nextRankTitle = 'Karvonboshi Ekspert (12 ta joy)';
  } else if (totalVisited >= 3) {
    rankTitle = 'Shahar Kashfiyotchisi';
    rankEmoji = '🎒';
    nextRankTitle = 'Tajribali Sayyoh (6 ta joy)';
  } else if (totalVisited >= 1) {
    rankTitle = 'Ilk Qadam Sohibi';
    rankEmoji = '✨';
    nextRankTitle = 'Shahar Kashfiyotchisi (3 ta joy)';
  }

  const natureVisitedCount =
    tashkentVisited.filter((l) => l.category === 'park_nature' || l.category === 'viewpoint').length +
    longTripsVisited.length;

  const badges: AchievementBadge[] = [
    {
      id: 'first-step',
      title: 'Ilk Qadam',
      subtitle: 'Kamida 1 ta maskanga tashrif buyurish',
      icon: '🌱',
      unlocked: totalVisited >= 1,
      current: Math.min(totalVisited, 1),
      target: 1
    },
    {
      id: 'tashkent-explorer',
      title: 'Toshkent Bilimdoni',
      subtitle: 'Toshkentdagi 5 ta sokin yoki madaniy joyga borish',
      icon: '☕',
      unlocked: tashkentVisited.length >= 5,
      current: Math.min(tashkentVisited.length, 5),
      target: 5
    },
    {
      id: 'nature-lover',
      title: 'Tabiat Oshig‘i',
      subtitle: '5 ta bog‘, soy, yaylov yoki tabiat maskanini ko‘rish',
      icon: '🌿',
      unlocked: natureVisitedCount >= 5,
      current: Math.min(natureVisitedCount, 5),
      target: 5
    },
    {
      id: 'mountain-king',
      title: 'Tog‘ va Sharshara Qiroli',
      subtitle: '3 ta uzoq safar (viloyat) maskanini zabt etish',
      icon: '⛰️',
      unlocked: longTripsVisited.length >= 3,
      current: Math.min(longTripsVisited.length, 3),
      target: 3
    },
    {
      id: 'region-conqueror',
      title: 'Viloyatlar Fotihi',
      subtitle: 'Kamida 5 ta turli viloyatda dam olish',
      icon: '🗺️',
      unlocked: uniqueRegions.size >= 5,
      current: Math.min(uniqueRegions.size, 5),
      target: 5
    },
    {
      id: 'grand-master',
      title: 'Xaritamiz Qiroli',
      subtitle: 'Jami 15 ta maskanni Sayohat Pasportiga muhrlash',
      icon: '👑',
      unlocked: totalVisited >= 15,
      current: Math.min(totalVisited, 15),
      target: 15
    }
  ];

  return {
    visitedIds,
    tashkentVisitedCount: tashkentVisited.length,
    tashkentTotalCount: LOCATIONS.length,
    longTripsVisitedCount: longTripsVisited.length,
    longTripsTotalCount: LONG_TRIPS.length,
    regionsVisitedCount: uniqueRegions.size,
    totalRegionsCount: 14,
    rankTitle,
    rankEmoji,
    nextRankTitle,
    badges
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'essential' | 'comfort' | 'nature';
  checked: boolean;
}

export function getSmartChecklistForTrip(trip: LongTripItem): ChecklistItem[] {
  const baseItems: Omit<ChecklistItem, 'checked'>[] = [
    { id: 'id-card', label: 'Shaxsni tasdiqlovchi hujjat (Pasport / ID)', category: 'essential' },
    { id: 'cash', label: 'Naqd pul (tog‘ va qishloqlarda terminal ishlamasligi mumkin)', category: 'essential' },
    { id: 'powerbank', label: 'To‘liq quvvatlangan Powerbank va kabel', category: 'essential' },
    { id: 'offline-map', label: 'Google / Yandex Maps oflayn xaritasi', category: 'essential' },
    { id: 'first-aid', label: 'Kichik tibbiy aptechka (og‘riq qoldiruvchi, plastir)', category: 'essential' }
  ];

  const categoryItems: Record<LongTripNatureType, Omit<ChecklistItem, 'checked'>[]> = {
    waterfall_river: [
      { id: 'non-slip-shoes', label: 'Sirpanmaydigan qulay krossovka yoki treking poyabzali', category: 'nature' },
      { id: 'extra-socks', label: 'Zaxira paypoq va yengil sochiq (suv sachrashi uchun)', category: 'comfort' },
      { id: 'windbreaker', label: 'Shamol va namlikdan himoyalovchi ustki kiyim', category: 'comfort' }
    ],
    mountain_meadow: [
      { id: 'warm-layer', label: 'Issiq sviter yoki kurtka (tog‘da kechqurun havo soviydi)', category: 'nature' },
      { id: 'sunglasses', label: 'Quyosh ko‘zoynagi va SPF krem', category: 'comfort' },
      { id: 'thermos', label: 'Issiq choy yoki qahva uchun termos va pleed', category: 'comfort' }
    ],
    lake_reservoir: [
      { id: 'picnic-mat', label: 'Sohilda o‘tirish uchun qalin pleed yoki gilamcha', category: 'comfort' },
      { id: 'sun-hat', label: 'Bosh kiyim (kepka/panama) va quyosh ko‘zoynagi', category: 'nature' },
      { id: 'water-snacks', label: 'Toza ichimlik suvi va yengil tamaddi', category: 'comfort' }
    ],
    secluded_wild: [
      { id: 'sturdy-boots', label: 'Toshli va qoyali yo‘lak uchun qalin taglikli poyabzal', category: 'nature' },
      { id: 'water-2l', label: 'Kishi boshiga kamida 1.5–2 litr ichimlik suvi', category: 'essential' },
      { id: 'flashlight', label: 'Fonar va issiq ustki kiyim (kechki salqin uchun)', category: 'nature' }
    ],
    historic_lively: [
      { id: 'walking-shoes', label: 'Tarixiy ko‘chalarda uzoq yurish uchun yumshoq poyabzal', category: 'comfort' },
      { id: 'camera-memory', label: 'Telefon / kamera xotirasida bo‘sh joy', category: 'comfort' },
      { id: 'modest-wear', label: 'Ziyoratgohlar uchun qulay va odobli kiyim', category: 'essential' }
    ]
  };

  const merged = [...baseItems, ...(categoryItems[trip.natureType] || categoryItems.mountain_meadow)];

  if (typeof window === 'undefined') {
    return merged.map((item) => ({ ...item, checked: false }));
  }

  try {
    const raw = localStorage.getItem(CHECKLIST_PREFIX + trip.id);
    if (!raw) {
      return merged.map((item) => ({ ...item, checked: false }));
    }
    const savedState: { checkedIds?: string[]; customItems?: ChecklistItem[] } = JSON.parse(raw);
    const checkedSet = new Set(savedState.checkedIds || []);
    const defaultWithState = merged.map((item) => ({
      ...item,
      checked: checkedSet.has(item.id)
    }));
    const customItems = (savedState.customItems || []).map((ci) => ({
      ...ci,
      checked: checkedSet.has(ci.id)
    }));
    return [...defaultWithState, ...customItems];
  } catch {
    return merged.map((item) => ({ ...item, checked: false }));
  }
}

export function saveChecklistForTrip(tripId: string, items: ChecklistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const checkedIds = items.filter((i) => i.checked).map((i) => i.id);
    const customItems = items.filter((i) => i.id.startsWith('custom-'));
    localStorage.setItem(
      CHECKLIST_PREFIX + tripId,
      JSON.stringify({ checkedIds, customItems })
    );
  } catch {
    // ignore
  }
}

export interface PhotoSpotTip {
  title: string;
  bestTime: string;
  angleTip: string;
}

export function getPhotoSpotsForTrip(trip: LongTripItem): PhotoSpotTip[] {
  switch (trip.natureType) {
    case 'waterfall_river':
      return [
        {
          title: `${trip.title} — pastki suv sachrash nuqtasi`,
          bestTime: '10:00 – 13:30 (quyosh nuri suv tomchilarida kamalak hosil qilganda)',
          angleTip: 'Telefonni pastroq burchakdan (0.5x ultra-wide rejimda) ushlab, sharshara to‘liq balandligini kadrga oling.'
        },
        {
          title: 'Soy bo‘yidagi katta silliq xarsangtoshlar usti',
          bestTime: '16:30 – 18:00 (yumshoq yon yorug‘lik)',
          angleTip: 'Live Photo yoki sekin zatvor (Long Exposure) rejimida suvni ipakdek oqayotgan qilib tushiring.'
        }
      ];
    case 'lake_reservoir':
      return [
        {
          title: `${trip.title} — yuqori qirg‘oq panoramasi`,
          bestTime: '08:30 – 10:30 (suv yuzasi oyna kabi sokin va feruza rangda bo‘lganda)',
          angleTip: 'Suv aksini (refleksiya) olish uchun kamerani suv yuzasiga yaqinlashtirib gorizontal kadr oling.'
        },
        {
          title: 'Quyosh botishidagi qirg‘oq silueti',
          bestTime: 'Oltin soat (quyosh botishidan 45 daqiqa oldin)',
          angleTip: 'Quyoshga qarshi (kontruzel) turib, suv ustidagi oltin shu’lalar fonida portret oling.'
        }
      ];
    case 'secluded_wild':
      return [
        {
          title: `${trip.title} — qoya chetidagi panorama nuqtasi`,
          bestTime: '16:30 – 18:15 (qoyalar qizg‘ish-oltin rangga kirganda)',
          angleTip: 'Keng burchakda (0.5x) dara chuqurligini ko‘rsatib, uzoqdan siluet ko‘rinishida suratga tushing.'
        },
        {
          title: 'Yovvoyi tabiat va yorug‘lik yo‘lagi',
          bestTime: '11:30 – 14:00 yoki yulduzli oqshom',
          angleTip: 'Ekspozitsiyani sal pasaytirib (-0.7 EV), tosh va relef teksturasini dramatik qilib tushiring.'
        }
      ];
    case 'historic_lively':
      return [
        {
          title: `${trip.title} — asosiy peshtoq va moviy gumbazlar foni`,
          bestTime: '07:00 – 09:00 (odamlar kam va yorug‘lik mayin payt)',
          angleTip: 'Me’moriy simmetriyani ushlash uchun kadr markazida turib, pastdan yuqoriga qarab suratga oling.'
        },
        {
          title: 'Kechki chiroqlar (illyuminatsiya) yoqilgan vaqt',
          bestTime: '18:30 – 20:00 (osmon to‘q ko‘k "Blue Hour" bo‘lganda)',
          angleTip: 'Tungi rejim (Night Mode) yordamida iliq chiroqlar va moviy osmon uyg‘unligini muhrlang.'
        }
      ];
    default:
      return [
        {
          title: `${trip.title} — eng baland manzarali tepalik`,
          bestTime: 'Oltin soat (16:45 – 18:00 oralig‘i)',
          angleTip: 'Orqa fonda tog‘ tizmalari va keng yaylov ko‘rinadigan qilib 3x portret yoki 0.5x panorama rejimida tushing.'
        },
        {
          title: 'Tabiat qo‘ynidagi choy / piknik burchagi (Aesthetic POV)',
          bestTime: '11:00 – 16:00',
          angleTip: 'Old planda piyoladagi choy yoki pleed, orqa planda esa xiralashgan (Portrait mode) tabiat manzarasini oling.'
        }
      ];
  }
}
