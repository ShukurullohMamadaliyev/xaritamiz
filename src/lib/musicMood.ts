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
    label: 'Yoqimli kirish • Chill',
    shortLabel: 'Chill Lounge',
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
    label: 'Estetik & Qahva',
    shortLabel: 'Kafe Jazz',
    emoji: '☕',
    src: '/music/aesthetic_photo.mp3',
  },
  night_city: {
    id: 'night_city',
    label: 'Tungi Toshkent',
    shortLabel: 'Tungi shahar',
    emoji: '🌙',
    src: '/music/night_city.mp3',
  },
  quiet_nature: {
    id: 'quiet_nature',
    label: 'Sokin tabiat & Bog‘',
    shortLabel: 'Sokin tabiat',
    emoji: '🌿',
    src: '/music/quiet_nature.mp3',
  },
  urban_lively: {
    id: 'urban_lively',
    label: 'Do‘stlar & Drayv',
    shortLabel: 'Quvnoq ritm',
    emoji: '🔥',
    src: '/music/urban_lively.mp3',
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
    q.includes('kitob') ||
    q.includes('qahva') ||
    q.includes('kofe') ||
    q.includes('kruassan') ||
    q.includes('estetik') ||
    q.includes('yolg‘iz') ||
    q.includes("yolg'iz") ||
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
    return companion === 'couple' ? 'romantic' : 'urban_lively';
  }
  if (vibe === 'aesthetic_photo') {
    return companion === 'couple' ? 'romantic' : 'aesthetic_photo';
  }

  if (companion === 'couple') return 'romantic';
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
  const textMood = detectMoodFromText(combinedText);

  // Agar matnda aniq kalit so'z bo'lsa (masalan: romantik, tungi, yomg'ir, do'stlar, kitob)
  if (
    /romantik|qizim|sevgi|juftlik|uchrashuv/i.test(combinedText)
  ) {
    return 'romantic';
  }
  if (/tungi|mashinada|rooftop|panorama/i.test(combinedText)) {
    return 'night_city';
  }
  if (/yomg'ir|yomg‘ir|tabiat|bog'|bog‘|sokin oqshom/i.test(combinedText)) {
    return 'quiet_nature';
  }
  if (/kitob|yolg'iz|yolg‘iz|kruassan/i.test(combinedText)) {
    return 'aesthetic_photo';
  }
  if (/do'st|do‘st|karting|bouling|choyxona/i.test(combinedText)) {
    return 'urban_lively';
  }

  if (route.companion === 'couple') {
    return 'romantic';
  }

  if (route.vibe === 'night_city') return 'night_city';
  if (route.vibe === 'quiet_nature') return 'quiet_nature';
  if (route.vibe === 'adventure_active' || route.vibe === 'urban_lively') return 'urban_lively';
  if (route.vibe === 'aesthetic_photo') return textMood;

  return 'aesthetic_photo';
}
