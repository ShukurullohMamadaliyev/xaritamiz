import { NextResponse } from 'next/server';
import { LOCATIONS_DATABASE } from '../../../data/locations';
import { LocationItem, LocationCategory, VibeType, CompanionType } from '../../../types';
import { calculateDistanceMeters } from '../../../lib/geoUtils';

export const maxDuration = 30;

// Taqiqlangan so'zlar filtri (diskoteka, bar, tungi klub, spirtli ichimlik va kalyanxonalarni qat'iy bloklash)
const BLOCKED_KEYWORDS = [
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
  'пив',
  'pivo',
  'beer',
  'wine',
  'вино',
  'alko',
  'алко',
  'alcohol',
  'liquor',
  'vodka',
  'водка',
  'cognac',
  'hookah',
  'kalyan',
  'кальян',
  'shisha',
  'вейп',
  'vape',
  'casino',
  'казино',
  'bet',
  'букмекер',
  'strip',
  'karaoke',
  'караоке',
  'lounge bar',
  'restobar',
  'рестобар',
  'tungi'
];

const FALLBACK_IMAGES: Record<string, string[]> = {
  canal_soy: [
    '/places/qoraqamish-soy-walk.jpg',
    '/places/qorasuv-canal-promenade.jpg',
    '/places/oqtepa-bozsuv-embankment.jpg',
    '/places/salor-canal-ecotrail.jpg',
    '/places/damariq-canal-trail.jpg'
  ],
  park_nature: [
    '/places/vuzgorodok-pine-park.jpg',
    '/places/akademgorodok-chinor-alley.jpg',
    '/places/bozsuv-meadow-trail.jpg',
    '/places/burijar-forest-trail.jpg',
    '/places/feruza-green-meadow.jpg',
    '/places/gagarin-pine-alley.jpg'
  ],
  cafe: [
    '/places/qoraqamish-orom-cafe.jpg',
    '/places/buyuk-ipak-coffee.jpg',
    '/places/rakat-cozy-roastery.jpg',
    '/places/maxtumquli-coffee-terrace.jpg',
    '/places/qatortol-coffee-walk.jpg'
  ],
  restaurant: [
    '/places/sagbon-tandir-choyxona.jpg',
    '/places/kokcha-bogiston-choyxona.jpg',
    '/places/choponota-milliy-oshxona.jpg',
    '/places/ohangaron-garden-choyxona.jpg',
    '/places/kushbegi-garden-resto.jpg'
  ],
  walk_street: [
    '/places/lutfiy-evening-boulevard.jpg',
    '/places/rustaveli-tree-boulevard.jpg',
    '/places/bodomzor-chinor-walk.jpg',
    '/places/nurafshon-avenue-walk.jpg'
  ]
};

function isSafeAndPeacefulPlace(name: string, tags: Record<string, string>): boolean {
  const combined = `${name} ${Object.values(tags).join(' ')}`.toLowerCase();
  for (const bad of BLOCKED_KEYWORDS) {
    if (combined.includes(bad)) {
      return false;
    }
  }
  if (tags.amenity === 'bar' || tags.amenity === 'pub' || tags.amenity === 'nightclub' || tags.amenity === 'biergarten' || tags.amenity === 'casino') {
    return false;
  }
  return true;
}

function detectDistrictName(lat: number, lng: number, tags: Record<string, string>): string {
  const addrDistrict = tags['addr:district'] || tags['addr:suburb'] || tags['is_in:suburb'];
  if (addrDistrict) return addrDistrict;

  if (lat > 41.345 && lng < 69.245) return 'Olmazor tumani (Qoraqamish)';
  if (lat > 41.345 && lng >= 69.245 && lng < 69.315) return 'Yunusobod tumani';
  if (lat > 41.315 && lng >= 69.315) return 'Mirzo Ulug‘bek (Qorasuv)';
  if (lat <= 41.315 && lat > 41.275 && lng < 69.205) return 'Uchtepa tumani';
  if (lat <= 41.305 && lat > 41.245 && lng >= 69.185 && lng < 69.245) return 'Chilonzor tumani';
  if (lat <= 41.245 && lng < 69.28) return 'Sergeli / Yangihayot';
  if (lat <= 41.27 && lng >= 69.28) return 'Bektemir tumani';
  if (lat > 41.27 && lat <= 41.315 && lng >= 69.305) return 'Yashnobod tumani';
  if (lat > 41.31 && lat <= 41.345 && lng < 69.265) return 'Shayxontohur tumani';
  if (lat > 41.275 && lat <= 41.305 && lng >= 69.245 && lng < 69.27) return 'Yakkasaroy tumani';
  return 'Mirobod tumani';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '41.3111');
  const lng = parseFloat(searchParams.get('lng') || '69.2797');
  const radius = Math.min(parseInt(searchParams.get('radius') || '3500', 10), 6000);

  return discoverNearbyPlaces(lat, lng, radius);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lat = typeof body.lat === 'number' ? body.lat : 41.3111;
    const lng = typeof body.lng === 'number' ? body.lng : 69.2797;
    const radius = Math.min(typeof body.radius === 'number' ? body.radius : 3500, 6000);
    return discoverNearbyPlaces(lat, lng, radius);
  } catch {
    return discoverNearbyPlaces(41.3111, 69.2797, 3500);
  }
}

async function discoverNearbyPlaces(lat: number, lng: number, radius: number) {
  try {
    // Overpass QL: Foydalanuvchi atrofidagi bog'lar, soylar/kanallar, piyoda ko'chalar, qahvaxonalar va oilaviy oshxonalarni qidirish
    const overpassQuery = `
      [out:json][timeout:12];
      (
        node["leisure"~"park|garden|nature_reserve"]["name"](around:${radius},${lat},${lng});
        way["leisure"~"park|garden|nature_reserve"]["name"](around:${radius},${lat},${lng});
        way["waterway"~"canal|river|stream"]["name"](around:${radius},${lat},${lng});
        way["highway"="pedestrian"]["name"](around:${radius},${lat},${lng});
        node["amenity"="cafe"]["name"](around:${radius},${lat},${lng});
        node["shop"~"bakery|pastry|coffee"]["name"](around:${radius},${lat},${lng});
        node["amenity"="restaurant"]["name"](around:${radius},${lat},${lng});
      );
      out center 45;
    `;

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];

    let elements: any[] = [];

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8500);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: controller.signal
        });
        clearTimeout(timer);

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.elements)) {
            elements = json.elements;
            break;
          }
        }
      } catch {
        // Keyingi endpointga o'tish
      }
    }

    const discovered: LocationItem[] = [];
    const seenNames = new Set<string>(
      LOCATIONS_DATABASE.map((l) => l.title.toLowerCase().trim())
    );

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const tags: Record<string, string> = el.tags || {};
      const rawName = (tags['name:uz'] || tags.name || tags['name:ru'] || '').trim();
      if (!rawName || rawName.length < 3) continue;

      if (!isSafeAndPeacefulPlace(rawName, tags)) continue;

      const normName = rawName.toLowerCase();
      if (seenNames.has(normName)) continue;

      const itemLat = el.lat ?? el.center?.lat;
      const itemLng = el.lon ?? el.center?.lon;
      if (typeof itemLat !== 'number' || typeof itemLng !== 'number') continue;

      // Bazadagi mavjud nuqtalarga juda yaqin (< 90m) bo'lsa dublikat qilmaslik
      const tooCloseToExisting = LOCATIONS_DATABASE.some(
        (existing) => calculateDistanceMeters(itemLat, itemLng, existing.lat, existing.lng) < 90
      );
      if (tooCloseToExisting) continue;

      seenNames.add(normName);

      const district = detectDistrictName(itemLat, itemLng, tags);
      const street = tags['addr:street']
        ? `${tags['addr:street']}${tags['addr:housenumber'] ? `, ${tags['addr:housenumber']}` : ''}`
        : `${district} hududi`;

      let category: LocationCategory = 'park_nature';
      let categoryLabel = '🌳 Yashil xiyobon & Sokin sayrgoh';
      let vibeTags: VibeType[] = ['quiet_nature', 'aesthetic_photo'];
      let companionTags: CompanionType[] = ['solo', 'couple', 'family', 'friends'];
      let averageCheck = 'Bepul';
      let estimatedPrice = 0;
      let tipText =
        'Toza havoda sokin piyoda sayr qilish, xayollarni jamlash va dam olish uchun mahalliy yashil maskan.';
      let imgPool = FALLBACK_IMAGES.park_nature;
      let features = ['🤖 Avto-Bot topdi', 'Sokin muhit', 'Piyoda sayr'];

      if (tags.waterway) {
        category = 'park_nature';
        categoryLabel = '🌊 Soy & Kanal bo‘yi sayrgohi';
        vibeTags = ['quiet_nature', 'aesthetic_photo'];
        averageCheck = 'Bepul';
        estimatedPrice = 0;
        tipText = `${rawName} bo‘yidagi salqin daraxtlar soyasida ertalab yoki kechqurun sokin piyoda yurish juda yoqimli.`;
        imgPool = FALLBACK_IMAGES.canal_soy;
        features = ['🤖 Avto-Bot topdi', 'Soy bo‘yi salqini', 'Piyoda yo‘lak'];
      } else if (tags.highway === 'pedestrian') {
        category = 'sightseeing';
        categoryLabel = '🚶 Piyoda sayr ko‘chasi & Alleya';
        vibeTags = ['quiet_nature', 'urban_lively'];
        averageCheck = 'Bepul (qahva: 25 000 so‘m)';
        estimatedPrice = 25000;
        tipText = `${rawName} bo‘ylab mashinalar shovqinisiz piyoda sayr qiling va atrofdagi shinam burchaklardan zavqlaning.`;
        imgPool = FALLBACK_IMAGES.walk_street;
        features = ['🤖 Avto-Bot topdi', 'Piyoda bulvari', 'Kechki sayr'];
      } else if (tags.amenity === 'cafe' || tags.shop === 'bakery' || tags.shop === 'pastry' || tags.shop === 'coffee') {
        category = 'cafe';
        categoryLabel = '☕ Shinam qahvaxona & Shirinliklar';
        vibeTags = ['aesthetic_photo', 'quiet_nature'];
        averageCheck = '45 000 — 90 000 so‘m';
        estimatedPrice = 60000;
        tipText = `${rawName} — yaqin atrofda xushbo‘y qahva, choy va yangi pishiriqlar bilan sokin suhbat qurish uchun qulay maskan.`;
        imgPool = FALLBACK_IMAGES.cafe;
        features = ['🤖 Avto-Bot topdi', 'Issiq qahva & choy', 'Sokin suhbat'];
      } else if (tags.amenity === 'restaurant') {
        category = 'restaurant';
        categoryLabel = '🍽️ Oilaviy oshxona & Milliy taomlar';
        vibeTags = ['urban_lively', 'quiet_nature'];
        averageCheck = '60 000 — 120 000 so‘m';
        estimatedPrice = 85000;
        tipText = `${rawName} — oila va do‘stlar davrasida mazali tushlik yoki kechki ovqat qilish uchun yaqin atrofdagi saralangan maskan.`;
        imgPool = FALLBACK_IMAGES.restaurant;
        features = ['🤖 Avto-Bot topdi', 'Oilaviy menyu', 'Halol va mazali'];
      }

      const imageUrl = imgPool[discovered.length % imgPool.length];

      discovered.push({
        id: `bot-osm-${el.id || i}`,
        title: rawName,
        category,
        categoryLabel,
        vibeTags,
        companionTags,
        budgetTier: estimatedPrice === 0 ? 'budget' : estimatedPrice <= 70000 ? 'budget' : 'medium',
        averageCheck,
        estimatedPrice,
        lat: itemLat,
        lng: itemLng,
        address: street,
        district,
        tipText,
        imageUrl,
        durationMinutes: 60,
        workingHours: tags.opening_hours || '08:00 — 23:00',
        rating: 4.7,
        features
      });

      if (discovered.length >= 24) break;
    }

    return NextResponse.json({
      success: true,
      botName: 'Xaritamiz Kunlik Avto-Qidiruv Boti',
      scannedAt: new Date().toISOString(),
      center: { lat, lng, radius },
      discoveredCount: discovered.length,
      places: discovered
    });
  } catch (error) {
    console.error('Discover places bot error:', error);
    return NextResponse.json({
      success: true,
      botName: 'Xaritamiz Kunlik Avto-Qidiruv Boti',
      scannedAt: new Date().toISOString(),
      discoveredCount: 0,
      places: []
    });
  }
}
