import { CompanionType, LocationCategory, RoutePlan, VibeType } from '../types';

export type MusicMood =
  | 'welcome'
  | 'romantic'
  | 'aesthetic_photo'
  | 'night_city'
  | 'quiet_nature'
  | 'urban_lively';

export interface MoodTrackInfo {
  id: MusicMood;
  label: string;
  shortLabel: string;
  emoji: string;
  src: string;
}

export const MOOD_TRACKS: Record<MusicMood, MoodTrackInfo> = {
  welcome: {
    id: 'welcome',
    label: 'Kirish ohangi',
    shortLabel: 'Kirish',
    emoji: '✨',
    src: '/music/welcome.mp3',
  },
  romantic: {
    id: 'romantic',
    label: 'Romantik oqshom',
    shortLabel: 'Romantik',
    emoji: '💖',
    src: '/music/romantic.mp3',
  },
  aesthetic_photo: {
    id: 'aesthetic_photo',
    label: 'Solo & Estetik qahva',
    shortLabel: 'Solo',
    emoji: '☕',
    src: '/music/solo.mp3',
  },
  night_city: {
    id: 'night_city',
    label: 'Tungi Toshkent',
    shortLabel: 'Tungi',
    emoji: '🌙',
    src: '/music/tungi.mp3',
  },
  quiet_nature: {
    id: 'quiet_nature',
    label: 'Oilaviy & Sokin tabiat',
    shortLabel: 'Oilaviy',
    emoji: '🌿',
    src: '/music/oilaviy.mp3',
  },
  urban_lively: {
    id: 'urban_lively',
    label: 'Do‘stlar bilan',
    shortLabel: 'Do‘stlar',
    emoji: '🔥',
    src: '/music/dostlar.mp3',
  },
};

export function detectMoodFromText(text: string): MusicMood {
  const q = text.toLowerCase();

  if (
    q.includes('romantik') ||
    q.includes('qizim') ||
    q.includes('sevgi') ||
    q.includes('juftlik') ||
    q.includes('ayolim') ||
    q.includes('uchrashuv') ||
    q.includes('sham')
  ) {
    return 'romantic';
  }

  if (
    q.includes('tungi') ||
    q.includes('mashinada') ||
    q.includes('rooftop') ||
    q.includes('bar') ||
    q.includes('panorama') ||
    q.includes('kechki shahar') ||
    q.includes('chiroq')
  ) {
    return 'night_city';
  }

  if (
    q.includes('oila') ||
    q.includes('farzand') ||
    q.includes('bolalar') ||
    q.includes('yomg‘ir') ||
    q.includes("yomg'ir") ||
    q.includes('yomgir') ||
    q.includes('tabiat') ||
    q.includes('bog‘') ||
    q.includes("bog'") ||
    q.includes('ko‘l') ||
    q.includes('daryo') ||
    q.includes('daraxt')
  ) {
    return 'quiet_nature';
  }

  if (
    q.includes('solo') ||
    q.includes('yolg‘iz') ||
    q.includes("yolg'iz") ||
    q.includes('bir o‘zim') ||
    q.includes("bir o'zim") ||
    q.includes('kitob') ||
    q.includes('qahva') ||
    q.includes('kofe') ||
    q.includes('kruassan') ||
    q.includes('estetik') ||
    q.includes('shirinlik')
  ) {
    return 'aesthetic_photo';
  }

  if (
    q.includes('do‘st') ||
    q.includes("do'st") ||
    q.includes('dost') ||
    q.includes('karting') ||
    q.includes('bouling') ||
    q.includes('o‘yin') ||
    q.includes("o'yin") ||
    q.includes('choyxona') ||
    q.includes('shashlik') ||
    q.includes('energiya')
  ) {
    return 'urban_lively';
  }

  return 'aesthetic_photo';
}

export function detectMoodFromFilter(
  companion?: CompanionType | null,
  vibe?: VibeType | null,
  changedField?: 'companion' | 'vibe'
): MusicMood {
  if (changedField === 'companion') {
    if (companion === 'couple') return 'romantic';
    if (companion === 'friends') return 'urban_lively';
    if (companion === 'solo') return 'aesthetic_photo';
    if (companion === 'family') return 'quiet_nature';
  }

  if (vibe === 'night_city') return 'night_city';
  if (vibe === 'quiet_nature') return 'quiet_nature';
  if (vibe === 'adventure_active') return 'urban_lively';
  if (vibe === 'urban_lively') {
    if (companion === 'couple') return 'romantic';
    if (companion === 'family') return 'quiet_nature';
    if (companion === 'solo') return 'aesthetic_photo';
    return 'urban_lively';
  }
  if (vibe === 'aesthetic_photo') {
    if (companion === 'couple') return 'romantic';
    if (companion === 'family') return 'quiet_nature';
    if (companion === 'friends') return 'urban_lively';
    return 'aesthetic_photo';
  }

  if (companion === 'couple') return 'romantic';
  if (companion === 'family') return 'quiet_nature';
  if (companion === 'friends') return 'urban_lively';
  if (companion === 'solo') return 'aesthetic_photo';
  return 'welcome';
}

export function detectMoodFromCategory(category: LocationCategory | 'all'): MusicMood {
  switch (category) {
    case 'cafe':
      return 'aesthetic_photo';
    case 'park_nature':
    case 'culture_museum':
      return 'quiet_nature';
    case 'nightlife':
    case 'viewpoint':
      return 'night_city';
    case 'activity':
    case 'restaurant':
    case 'sightseeing':
      return 'urban_lively';
    default:
      return 'welcome';
  }
}

export function detectMoodFromRoute(route: RoutePlan, promptHint?: string): MusicMood {
  const combinedText = `${route.title || ''} ${route.subtitle || ''} ${route.aiComment || ''} ${promptHint || ''}`;

  if (/romantik|qizim|sevgi|juftlik|uchrashuv/i.test(combinedText)) {
    return 'romantic';
  }
  if (/tungi|mashinada|rooftop|panorama/i.test(combinedText)) {
    return 'night_city';
  }
  if (/oila|bolalar|yomg'ir|yomg‘ir|tabiat|bog'|bog‘|sokin oqshom/i.test(combinedText)) {
    return 'quiet_nature';
  }
  if (/kitob|yolg'iz|yolg‘iz|bir o'zim|bir o‘zim|kruassan/i.test(combinedText)) {
    return 'aesthetic_photo';
  }
  if (/do'st|do‘st|karting|bouling|choyxona/i.test(combinedText)) {
    return 'urban_lively';
  }

  if (route.companion === 'couple') return 'romantic';
  if (route.companion === 'family') return 'quiet_nature';
  if (route.companion === 'solo') return 'aesthetic_photo';
  if (route.companion === 'friends') {
    if (route.vibe === 'night_city') return 'night_city';
    return 'urban_lively';
  }

  if (route.vibe === 'night_city') return 'night_city';
  if (route.vibe === 'quiet_nature') return 'quiet_nature';
  if (route.vibe === 'adventure_active' || route.vibe === 'urban_lively') return 'urban_lively';

  return 'aesthetic_photo';
}
