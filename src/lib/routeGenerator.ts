import { LOCATIONS_DATABASE } from '../data/locations';
import { 
  FilterState, 
  RoutePlan, 
  RouteStop, 
  LocationItem, 
  VibeType, 
  CompanionType, 
  BudgetTier, 
  DurationOption 
} from '../types';

export const VIBE_LABELS: Record<VibeType, { label: string; icon: string; desc: string }> = {
  quiet_nature: {
    label: 'Sokin & Tabiat',
    icon: 'Trees',
    desc: 'Shahar shovqinidan xoli, yam-yashil va salqin maskanlar'
  },
  urban_lively: {
    label: 'Shahar & Jonli',
    icon: 'Sparkles',
    desc: 'G‘imirlagan poytaxt ritmi, odamlar va markaziy energiyalar'
  },
  aesthetic_photo: {
    label: 'Estetik & Qahva',
    icon: 'Camera',
    desc: 'Chiroyli burchaklar, fotosessiya va xushbo‘y desertlar'
  },
  adventure_active: {
    label: 'Sarguzasht & Faol',
    icon: 'Compass',
    desc: 'Harakat, adrenalin, karting, muz saroyi yoki daryo bo‘yi'
  },
  night_city: {
    label: 'Tungi shahar',
    icon: 'Moon',
    desc: 'Kechki chiroqlar, panoramali tom va sokin oqshom'
  }
};

export const COMPANION_LABELS: Record<CompanionType, { label: string; icon: string; desc: string }> = {
  couple: {
    label: 'Juftlik (Romantika)',
    icon: 'Heart',
    desc: 'Ikki kishilik shinam, samimiy va romantik muhit'
  },
  friends: {
    label: 'Do‘stlar bilan',
    icon: 'Users',
    desc: 'Kulguli suhbatlar, qiziqarli faoliyat va mazali taomlar'
  },
  family: {
    label: 'Oila bilan',
    icon: 'Home',
    desc: 'Barcha yoshdagi oila a’zolari uchun qulay va xavfsiz'
  },
  solo: {
    label: 'Yolg‘iz (Solo)',
    icon: 'User',
    desc: 'O‘z-o‘zing bilan qolib dam olish, kitob yoki fikrlar jamlash'
  }
};

export const BUDGET_LABELS: Record<BudgetTier, { label: string; icon: string; range: string }> = {
  budget: {
    label: 'Tejamkor (Ekonom)',
    icon: 'Coins',
    range: '20 000 — 60 000 so‘m'
  },
  medium: {
    label: 'O‘rtacha (Qulay)',
    icon: 'Wallet',
    range: '70 000 — 160 000 so‘m'
  },
  premium: {
    label: 'Premium (Cheklovlarsiz)',
    icon: 'Gem',
    range: '200 000+ so‘m'
  }
};

export const DURATION_LABELS: Record<DurationOption, { label: string; stopsCount: number; timingText: string }> = {
  evening_short: {
    label: '2-3 soatlik oqshom',
    stopsCount: 2,
    timingText: '18:30 — 21:30'
  },
  half_day: {
    label: 'Yarim kun (4-5 soat)',
    stopsCount: 3,
    timingText: '15:00 — 20:30'
  },
  full_day: {
    label: 'To‘liq kun (Dam olish)',
    stopsCount: 4,
    timingText: '10:30 — 21:00'
  }
};

// Vaqt oraliqlari shabloni
const TIME_SLOTS_PRESETS: Record<DurationOption, { time: string; note: string }[]> = {
  evening_short: [
    { time: '18:45', note: 'Kechki yengil start, qahva yoki xiyobon bo‘ylab sokin sayr' },
    { time: '20:15', note: 'Asosiy kechki ovqat yoki panoramali oqshom suhbati' }
  ],
  half_day: [
    { time: '15:30', note: 'Dastlabki estetik nuqta, fotosuratlar va yengil qahva/desert' },
    { time: '17:30', note: 'Toza havo, xiyobon yoki faol ko‘ngilochar qism' },
    { time: '19:45', note: 'Mazali kechki ovqat va chiroyli shahar oqshomi' }
  ],
  full_day: [
    { time: '10:30', note: 'Yangi pishgan krusanlar yoki samovardan ertalabki choy' },
    { time: '12:45', note: 'Tabiat qo‘yni, manzarali hudud yoki faol sarguzasht' },
    { time: '16:00', note: 'Salqin daryo bo‘yi yoki sokin me’moriy go‘zallik' },
    { time: '19:30', note: 'Unutilmas kechki taom va tungi shahar nurlari' }
  ]
};

// Generatsiya sarlavhalari
const TITLES_MAP: Record<VibeType, Record<CompanionType, string>> = {
  quiet_nature: {
    couple: 'Yashil xiyobonlar va sokin pichirlashlar',
    friends: 'Shahar shovqinidan yiroq: Tabiat va do‘stona piknik',
    family: 'Oila bilan toza havo va tabiat qo‘ynida dam olish',
    solo: 'Yolg‘izlik estetikasi: Sokinlik va o‘y-fikrlar xiyoboni'
  },
  urban_lively: {
    couple: 'Chiroqlar nuri ostidagi zamonaviy shahar romansı',
    friends: 'Shahar drayvi: Mazali yeguliklar va do‘stlar yig‘ini',
    family: 'Rang-barang shahar: Bolalar va kattalar bayrami',
    solo: 'Megapolis ruhi: Toshkent ko‘chalari bo‘ylab erkin sayr'
  },
  aesthetic_photo: {
    couple: 'Instagrambop Toshkent: Estetika va nozik qahva',
    friends: 'Eng chiroyli kadrlarni ovlash va shinam suhbat',
    family: 'Esdalik albomi: Go‘zal burchaklar va oilaviy quvonch',
    solo: 'Mualliflik qahvasi va estetik fotosuratlar sayohati'
  },
  adventure_active: {
    couple: 'Daryo shabadasi va birgalikdagi yangi kashfiyotlar',
    friends: 'Adrenalin va raqobat: Faol dam olish va poygalar',
    family: 'Butun oila uchun harakat, attraksionlar va quvnoq sarguzasht',
    solo: 'Kashfiyotchi kuni: Toshkent bo‘ylab faol va tetik kun'
  },
  night_city: {
    couple: 'Tungi Toshkent: Panoramik osmon ostidagi oqshom',
    friends: 'Tungi shahar chiroqlari, yaxshi musiqa va samimiy suhbat',
    family: 'Kechki salqinlikda oqshom sayri va shahar nurlari',
    solo: 'Tungi poytaxt romantikasi: Fikrlar va osmono‘par binolar'
  }
};

/**
 * AI / Smart Prompt tahlilchisi (foydalanuvchi erkin matn kiritganda)
 */
export function parseCustomQuery(query: string): Partial<FilterState> {
  const lower = query.toLowerCase();
  const result: Partial<FilterState> = {};

  if (lower.includes('romantik') || lower.includes('qiz') || lower.includes('yigit') || lower.includes('juft') || lower.includes('sevishgan')) {
    result.companion = 'couple';
  } else if (lower.includes('do‘st') || lower.includes('dost') || lower.includes('og‘ayni') || lower.includes('ulg‘ay') || lower.includes('jamoa')) {
    result.companion = 'friends';
  } else if (lower.includes('oila') || lower.includes('bolalar') || lower.includes('ota-ona')) {
    result.companion = 'family';
  } else if (lower.includes('yolg‘iz') || lower.includes('bir o‘zim') || lower.includes('tinch o‘zim')) {
    result.companion = 'solo';
  }

  if (lower.includes('sokin') || lower.includes('tabiat') || lower.includes('suv') || lower.includes('bog‘') || lower.includes('daraxt')) {
    result.vibe = 'quiet_nature';
  } else if (lower.includes('tungi') || lower.includes('oqshom') || lower.includes('rooftop') || lower.includes('chiroq')) {
    result.vibe = 'night_city';
  } else if (lower.includes('qahva') || lower.includes('kofe') || lower.includes('estetika') || lower.includes('rasm') || lower.includes('foto')) {
    result.vibe = 'aesthetic_photo';
  } else if (lower.includes('faol') || lower.includes('sarguzasht') || lower.includes('tog‘') || lower.includes('karting') || lower.includes('trek')) {
    result.vibe = 'adventure_active';
  } else if (lower.includes('shahar') || lower.includes('markaz') || lower.includes('jonli') || lower.includes('shovqin')) {
    result.vibe = 'urban_lively';
  }

  if (lower.includes('arzon') || lower.includes('ekonom') || lower.includes('tejamkor') || lower.includes('kam xarajat')) {
    result.budget = 'budget';
  } else if (lower.includes('premium') || lower.includes('qimmat') || lower.includes('lyuks') || lower.includes('cheksiz')) {
    result.budget = 'premium';
  }

  return result;
}

/**
 * Berilgan filtrlar bo‘yicha ideal xronologik marshrut tuzuvchi funksiya
 */
export function generateRoute(filters: FilterState): RoutePlan {
  const companion = filters.companion || 'friends';
  const vibe = filters.vibe || 'urban_lively';
  const budget = filters.budget || 'medium';
  const duration = filters.duration || 'half_day';

  const durationConfig = DURATION_LABELS[duration];
  const requiredCount = durationConfig.stopsCount;

  // Har bir lokatsiyani ballash (Scoring)
  const scoredLocations = LOCATIONS_DATABASE.map(loc => {
    let score = 0;

    // Vibe match
    if (loc.vibeTags.includes(vibe)) score += 5;
    
    // Companion match
    if (loc.companionTags.includes(companion)) score += 4;
    
    // Budget match
    if (loc.budgetTier === budget) {
      score += 3;
    } else if (
      (budget === 'medium' && (loc.budgetTier === 'budget' || loc.budgetTier === 'premium')) ||
      (budget === 'premium' && loc.budgetTier === 'medium')
    ) {
      score += 1;
    }

    // Rating boost
    score += loc.rating;

    // Randomize slight variance to give dynamic feeling
    score += Math.random() * 1.5;

    return { loc, score };
  });

  // Eng yuqori ballilarni saralash
  scoredLocations.sort((a, b) => b.score - a.score);

  // Kategoriya xilma-xilligini (Diversity) ta'minlash:
  // Masalan: 1 qahvaxona/sayr, 1 ovqatlanish joyi, 1 ko‘ngilochar/manzara
  const selectedLocs: LocationItem[] = [];
  const usedCategories = new Set<string>();

  for (const item of scoredLocations) {
    if (selectedLocs.length >= requiredCount) break;

    // Bir xil kategoriyadan ketma-ket takrorlanmasin (agar imkon bo‘lsa)
    if (!usedCategories.has(item.loc.category) || selectedLocs.length === scoredLocations.length - 1) {
      selectedLocs.push(item.loc);
      usedCategories.add(item.loc.category);
    }
  }

  // Agar kategoriya filtri sababli to‘lmay qolsa, qolganlaridan to‘ldiramiz
  if (selectedLocs.length < requiredCount) {
    for (const item of scoredLocations) {
      if (selectedLocs.length >= requiredCount) break;
      if (!selectedLocs.some(l => l.id === item.loc.id)) {
        selectedLocs.push(item.loc);
      }
    }
  }

  // Xronologik tartibga solish:
  // Nonushta/Qahva/Kutubxona -> Faoliyat/Tabiat/Muzey -> Restoran/Kechki ovqat -> Rooftop/Tungi lounge
  const categoryOrder: Record<string, number> = {
    cafe: 1,
    park_nature: 2,
    culture_museum: 3,
    activity: 4,
    sightseeing: 5,
    restaurant: 6,
    viewpoint: 7,
    nightlife: 8
  };

  selectedLocs.sort((a, b) => (categoryOrder[a.category] || 5) - (categoryOrder[b.category] || 5));

  // Vaqt slotlarini belgilash
  const timePresets = TIME_SLOTS_PRESETS[duration];
  const stops: RouteStop[] = selectedLocs.map((loc, idx) => {
    const preset = timePresets[idx] || { time: `${18 + idx}:00`, note: loc.tipText };
    return {
      stopOrder: idx + 1,
      timeSlot: preset.time,
      location: loc,
      activityNote: preset.note,
      customVoteScore: { yes: 1, no: 0 }
    };
  });

  // Jami xarajat va davomiylik hisoblash
  const totalCostNumber = selectedLocs.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  const formattedTotalCost = `${(Math.round(totalCostNumber / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`;

  const durationHoursMap: Record<DurationOption, string> = {
    evening_short: '2.5 — 3 soat',
    half_day: '4 — 5 soat',
    full_day: '7 — 8 soat'
  };

  const title = TITLES_MAP[vibe]?.[companion] || 'Toshkent bo‘ylab unutilmas oqshom marshruti';
  const subtitle = `${COMPANION_LABELS[companion].label} • ${VIBE_LABELS[vibe].label} • ${BUDGET_LABELS[budget].label}`;

  return {
    id: `route-${Math.random().toString(36).substring(2, 9)}`,
    title,
    subtitle,
    vibe,
    companion,
    budgetTier: budget,
    duration,
    totalEstimatedCost: formattedTotalCost,
    numericTotalCost: totalCostNumber,
    totalDurationHours: durationHoursMap[duration],
    stops,
    highlightTag: 'Bugun tavsiya etilgan',
    createdAt: '2026-10-09T18:00:00Z'
  };
}

/**
 * "Taqdirga topshirish" (Surprise Roulette)
 */
export function generateSurpriseRoute(): RoutePlan {
  const companions: CompanionType[] = ['couple', 'friends', 'solo', 'family'];
  const vibes: VibeType[] = ['quiet_nature', 'urban_lively', 'aesthetic_photo', 'adventure_active', 'night_city'];
  const budgets: BudgetTier[] = ['budget', 'medium', 'premium'];
  const durations: DurationOption[] = ['evening_short', 'half_day'];

  const randomCompanion = companions[Math.floor(Math.random() * companions.length)];
  const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
  const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
  const randomDuration = durations[Math.floor(Math.random() * durations.length)];

  const plan = generateRoute({
    companion: randomCompanion,
    vibe: randomVibe,
    budget: randomBudget,
    duration: randomDuration
  });

  plan.title = `🎲 Taqdir Tanlovi: ${plan.title}`;
  plan.highlightTag = 'Tasodifiy sarguzasht';

  return plan;
}

/**
 * Marshrutdagi bitta bekatni boshqa mos lokatsiyaga almashtirish (Shuffle Stop)
 */
export function swapStopInRoute(currentRoute: RoutePlan, stopIndex: number): RoutePlan {
  const currentStop = currentRoute.stops[stopIndex];
  if (!currentStop) return currentRoute;

  // Hozirgi tanlangan barcha ID lar
  const existingIds = new Set(currentRoute.stops.map(s => s.location.id));

  // Mos keladigan boshqa lokatsiyani qidirish
  const candidates = LOCATIONS_DATABASE.filter(loc => 
    !existingIds.has(loc.id) &&
    (loc.vibeTags.includes(currentRoute.vibe) || loc.budgetTier === currentRoute.budgetTier)
  );

  const fallback = LOCATIONS_DATABASE.filter(loc => !existingIds.has(loc.id));
  const pool = candidates.length > 0 ? candidates : fallback;

  if (pool.length === 0) return currentRoute;

  const randomReplacement = pool[Math.floor(Math.random() * pool.length)];

  const updatedStops = [...currentRoute.stops];
  updatedStops[stopIndex] = {
    ...currentStop,
    location: randomReplacement
  };

  const newTotalCost = updatedStops.reduce((acc, curr) => acc + curr.location.estimatedPrice, 0);

  return {
    ...currentRoute,
    stops: updatedStops,
    numericTotalCost: newTotalCost,
    totalEstimatedCost: `${(Math.round(newTotalCost / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`
  };
}
