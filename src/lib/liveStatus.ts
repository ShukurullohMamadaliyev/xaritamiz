import { LocationItem } from '../types';
import { LongTripItem, LONG_TRIPS_DATABASE } from '../data/longTrips';
import { LOCATIONS_DATABASE } from '../data/locations';

export interface LivePlaceStatus {
  isOpen: boolean;
  is24Hours: boolean;
  closingSoon: boolean;
  statusLabel: string;
  statusColor: 'emerald' | 'amber' | 'rose';
  crowdPercent: number;
  crowdLabel: string;
  crowdTone: 'calm' | 'moderate' | 'busy';
}

/**
 * workingHours satrini ("09:00 - 23:00", "24/7", "10:00 - 02:00") tahlil qilib,
 * joriy vaqtda ochiq yoki yopiqligini va jonli gavjumlik darajasini qaytaradi.
 */
export function getLivePlaceStatus(place: LocationItem, nowDate?: Date): LivePlaceStatus {
  const now = nowDate || new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMin;
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  const rawHours = (place.workingHours || '').trim().toLowerCase();
  const is24Hours =
    rawHours.includes('24/7') ||
    rawHours.includes('24 soat') ||
    rawHours.includes('00:00 - 24:00') ||
    place.category === 'park_nature' ||
    place.category === 'viewpoint';

  let isOpen = true;
  let closingSoon = false;
  let statusLabel = 'Hozir ochiq';
  let statusColor: 'emerald' | 'amber' | 'rose' = 'emerald';

  if (is24Hours) {
    isOpen = true;
    statusLabel = rawHours.includes('24/7') ? '24/7 Ochiq' : 'Ochiq hudud (24/7)';
    statusColor = 'emerald';
  } else {
    const match = rawHours.match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);
    if (match) {
      const openH = parseInt(match[1], 10);
      const openM = parseInt(match[2], 10);
      const closeH = parseInt(match[3], 10);
      const closeM = parseInt(match[4], 10);

      const openMins = openH * 60 + openM;
      let closeMins = closeH * 60 + closeM;

      // Agar yopilish vaqti tungi 00:00..05:00 bo'lsa (masalan 10:00 - 02:00)
      if (closeMins <= openMins) {
        closeMins += 24 * 60;
      }

      const adjustedCurrent =
        currentTotalMins < openMins && closeMins > 24 * 60
          ? currentTotalMins + 24 * 60
          : currentTotalMins;

      if (adjustedCurrent >= openMins && adjustedCurrent < closeMins) {
        isOpen = true;
        const minsLeft = closeMins - adjustedCurrent;
        if (minsLeft <= 45) {
          closingSoon = true;
          statusLabel = `Yopilishiga ${minsLeft} daq.`;
          statusColor = 'amber';
        } else {
          statusLabel = `Ochiq (${match[3]}:${match[4]} gacha)`;
          statusColor = 'emerald';
        }
      } else {
        isOpen = false;
        statusLabel = `Yopiq (${match[1]}:${match[2]} da ochiladi)`;
        statusColor = 'rose';
      }
    }
  }

  // Jonli gavjumlik (Live Crowd) hisoblash
  let baseCrowd = 30;
  if (!isOpen) {
    baseCrowd = 0;
  } else if (place.category === 'park_nature' || place.category === 'viewpoint') {
    if (currentHour >= 6 && currentHour <= 10) baseCrowd = 25;
    else if (currentHour >= 17 && currentHour <= 21) baseCrowd = 55;
    else if (currentHour >= 22 || currentHour < 6) baseCrowd = 10;
    else baseCrowd = 35;
  } else if (place.category === 'cafe') {
    if (currentHour >= 9 && currentHour <= 11) baseCrowd = 50;
    else if (currentHour >= 18 && currentHour <= 21) baseCrowd = 65;
    else baseCrowd = 35;
  } else if (place.category === 'restaurant') {
    if (currentHour >= 12 && currentHour <= 14) baseCrowd = 75;
    else if (currentHour >= 19 && currentHour <= 22) baseCrowd = 80;
    else baseCrowd = 35;
  } else {
    baseCrowd = currentHour >= 17 && currentHour <= 22 ? 60 : 35;
  }

  if (isOpen && isWeekend) {
    baseCrowd = Math.min(95, baseCrowd + 12);
  }

  // Joyning ID siga qarab kichik tabiiy farq qo'shamiz
  const idHash = place.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variance = (idHash % 15) - 7;
  const crowdPercent = isOpen ? Math.max(8, Math.min(95, baseCrowd + variance)) : 0;

  let crowdLabel = 'Sokin va bo‘sh';
  let crowdTone: 'calm' | 'moderate' | 'busy' = 'calm';

  if (!isOpen) {
    crowdLabel = 'Hozir yopiq';
    crowdTone = 'calm';
  } else if (crowdPercent <= 40) {
    crowdLabel = `Sokin (~${crowdPercent}% band)`;
    crowdTone = 'calm';
  } else if (crowdPercent <= 70) {
    crowdLabel = `O‘rtacha jonli (~${crowdPercent}% band)`;
    crowdTone = 'moderate';
  } else {
    crowdLabel = `Gavjum (~${crowdPercent}% band)`;
    crowdTone = 'busy';
  }

  return {
    isOpen,
    is24Hours,
    closingSoon,
    statusLabel,
    statusColor,
    crowdPercent,
    crowdLabel,
    crowdTone
  };
}

/**
 * Rasm ranglari (RGB histogramma) asosida u qanday manzara ekanligini aniqlab,
 * O'zbekistondagi eng o'xshash Toshkent va 12 viloyat joylarini topib beradi.
 */
export interface ImageAnalysisResult {
  detectedSceneTitle: string;
  detectedSceneDesc: string;
  dominantMood: string;
  colorTags: string[];
  matchedLongTrips: { trip: LongTripItem; similarity: number; reason: string }[];
  matchedTashkent: { place: LocationItem; similarity: number; reason: string }[];
}

export function analyzeImagePixels(
  rAvg: number,
  gAvg: number,
  bAvg: number,
  brightness: number,
  greenRatio: number,
  blueRatio: number,
  warmRatio: number
): ImageAnalysisResult {
  // 1. Feruza ko'l / sharshara / suv manzarasi (Blue + Cyan/Green yuqori)
  if (blueRatio > 0.28 && gAvg >= rAvg) {
    const trips = LONG_TRIPS_DATABASE.filter(
      (t) => t.natureType === 'lake_reservoir' || t.natureType === 'waterfall_river'
    ).slice(0, 4);
    const tashkent = LOCATIONS_DATABASE.filter(
      (l) =>
        l.title.toLowerCase().includes('soy') ||
        l.title.toLowerCase().includes('kanal') ||
        l.title.toLowerCase().includes('ko‘l') ||
        l.category === 'park_nature'
    ).slice(0, 3);

    return {
      detectedSceneTitle: '🏞️ Feruza Ko‘l, Daryo yoki Sharshara Manzarasi',
      detectedSceneDesc:
        'Rasmda suv havzasi, moviy osmon va tog‘/tabiat uyg‘unligi aniqlandi. O‘zbekistonda xuddi shunday kadr va muhit beradigan maskanlar:',
      dominantMood: 'quiet_nature',
      colorTags: ['Feruza suv', 'Tog‘ ko‘li', 'Salqin qirg‘oq'],
      matchedLongTrips: trips.map((trip, i) => ({
        trip,
        similarity: 96 - i * 3,
        reason: `${trip.region}dagi eng tiniq suvli va rasmdagiga juda o‘xshash manzara`
      })),
      matchedTashkent: tashkent.map((place, i) => ({
        place,
        similarity: 91 - i * 3,
        reason: 'Toshkent ichida suv bo‘yida sokin sayr qilish uchun eng yaqin muqobil'
      }))
    };
  }

  // 2. Yashil yaylov, o'rmon, tog' archazori yoki sersoya bog' (Green yuqori)
  if (greenRatio > 0.26 || (gAvg > rAvg + 8 && gAvg > bAvg)) {
    const trips = LONG_TRIPS_DATABASE.filter(
      (t) => t.natureType === 'mountain_meadow' || t.natureType === 'waterfall_river'
    ).slice(0, 4);
    const tashkent = LOCATIONS_DATABASE.filter((l) => l.category === 'park_nature').slice(0, 3);

    return {
      detectedSceneTitle: '🌿 Yashil Yaylov, Tog‘ Archazori va Sokin Tabiat',
      detectedSceneDesc:
        'Rasmda boy yashillik, daraxtzor yoki alp yaylovi ohanglari ustunlik qilmoqda. Xuddi shunday yashil tabiat maskanlari:',
      dominantMood: 'quiet_nature',
      colorTags: ['Zumrad yashillik', 'Alp yaylovi', 'O‘rmon havosi'],
      matchedLongTrips: trips.map((trip, i) => ({
        trip,
        similarity: 95 - i * 2,
        reason: `${trip.region}ning yashil archazor va keng yaylov manzarasi`
      })),
      matchedTashkent: tashkent.map((place, i) => ({
        place,
        similarity: 92 - i * 3,
        reason: 'Toshkentdagi eng yashil va sersoya ekopark / bog‘ muhiti'
      }))
    };
  }

  // 3. Tungi chiroqlar yoki kechki shahar / qorong'u atmosfera (Brightness past)
  if (brightness < 85) {
    const trips = LONG_TRIPS_DATABASE.filter(
      (t) => t.natureType === 'historic_lively' || t.natureType === 'secluded_wild'
    ).slice(0, 3);
    const tashkent = LOCATIONS_DATABASE.filter(
      (l) => l.vibeTags.includes('night_city') || l.category === 'viewpoint'
    ).slice(0, 4);

    return {
      detectedSceneTitle: '🌙 Kechki Chiroqlar, Panorama yoki Yulduzli Osmon',
      detectedSceneDesc:
        'Rasmda kechki atmosfera, iliq chiroqlar yoki tungi osmon kontrastlari aniqlandi. Kechki sayr va tungi kadrlar uchun eng mos joylar:',
      dominantMood: 'romantic',
      colorTags: ['Kechki chiroqlar', 'Tungi panorama', 'Sokin oqshom'],
      matchedLongTrips: trips.map((trip, i) => ({
        trip,
        similarity: 93 - i * 3,
        reason: 'Kechki illyuminatsiya yoki yulduzli osmoni bilan mashhur maskan'
      })),
      matchedTashkent: tashkent.map((place, i) => ({
        place,
        similarity: 94 - i * 2,
        reason: 'Toshkentda kechki payt eng chiroyli ko‘rinadigan manzarali maskan'
      }))
    };
  }

  // 4. Qizg'ish-oltin kanyon, quyosh botishi yoki shinam estetik qahvaxona (Warm/Red/Amber yuqori)
  if (warmRatio > 0.32 || rAvg > bAvg + 25) {
    const trips = LONG_TRIPS_DATABASE.filter(
      (t) => t.natureType === 'secluded_wild' || t.natureType === 'historic_lively'
    ).slice(0, 4);
    const tashkent = LOCATIONS_DATABASE.filter(
      (l) => l.category === 'cafe' || l.vibeTags.includes('aesthetic_photo')
    ).slice(0, 4);

    return {
      detectedSceneTitle: '🌅 Oltin Soat, Kanyon yoki Shinam Estetik Maskan',
      detectedSceneDesc:
        'Rasmda iliq qahrabo-oltin ranglar (quyosh botishi, qizil qoyalar yoki shinam interyer) aniqlandi. Bunday kadr uchun eng mos joylar:',
      dominantMood: 'romantic',
      colorTags: ['Oltin soat', 'Estetik kadr', 'Iliq atmosfera'],
      matchedLongTrips: trips.map((trip, i) => ({
        trip,
        similarity: 94 - i * 3,
        reason: `${trip.region}dagi quyosh botishi va dramatik relefli maskan`
      })),
      matchedTashkent: tashkent.map((place, i) => ({
        place,
        similarity: 93 - i * 2,
        reason: 'Iliq chiroqli, estetik fotosessiya va qahva uchun top joy'
      }))
    };
  }

  // 5. Universal tog' va tarixiy-estetik manzara
  const trips = LONG_TRIPS_DATABASE.slice(0, 4);
  const tashkent = LOCATIONS_DATABASE.filter(
    (l) => l.vibeTags.includes('aesthetic_photo') || l.category === 'park_nature'
  ).slice(0, 4);

  return {
    detectedSceneTitle: '⛰️ Panoramali Tabiat va Estetik Sayr Maskani',
    detectedSceneDesc:
      'Rasمدagi yorug‘lik va kompozitsiyaga O‘zbekistonning eng fotogenik tog‘ hamda shahar maskanlari mos keladi:',
    dominantMood: 'solo',
    colorTags: ['Panoramali kadr', 'Ochiq havo', 'Top lokatsiya'],
    matchedLongTrips: trips.map((trip, i) => ({
      trip,
      similarity: 92 - i * 2,
      reason: `${trip.region}ning eng go‘zal va ko‘p suratga olinadigan maskani`
    })),
    matchedTashkent: tashkent.map((place, i) => ({
      place,
      similarity: 90 - i * 2,
      reason: 'Toshkentdagi eng chiroyli fon va sokin muhitga ega maskan'
    }))
  };
}
