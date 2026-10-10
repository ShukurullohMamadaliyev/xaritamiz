import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LOCATIONS_DATABASE } from '../../../data/locations';
import { LONG_TRIPS_DATABASE, LongTripItem } from '../../../data/longTrips';

// Toshkent shahri lokatsiyalari qisqartmasi
const PLACES_SUMMARY = LOCATIONS_DATABASE.map((loc) => ({
  id: loc.id,
  title: loc.title,
  category: loc.category,
  categoryLabel: loc.categoryLabel,
  district: loc.district,
  vibeTags: loc.vibeTags,
  companionTags: loc.companionTags,
  budgetTier: loc.budgetTier,
  averageCheck: loc.averageCheck,
  tipText: loc.tipText
}));

// 12 viloyat uzoq safar maskanlari qisqartmasi (40 ta)
const LONG_TRIPS_SUMMARY = LONG_TRIPS_DATABASE.map((trip) => ({
  id: trip.id,
  title: trip.title,
  region: trip.region,
  district: trip.district,
  natureType: trip.natureType,
  natureLabel: trip.natureLabel,
  crowdLevel: trip.crowdLevel,
  travelTimeText: trip.travelTimeText,
  totalBudgetText: trip.totalBudgetText,
  trainAvailable: trip.transport.train.available,
  busAvailable: trip.transport.bus.available,
  planeAvailable: trip.transport.plane.available,
  hotelsAvailable: trip.nearby.hotels.available,
  creativeTip: trip.creativeTip
}));

interface AiStopResponse {
  placeId: string;
  recommendedTime: string;
  customTip: string;
}

interface AiRouteResponse {
  routeTitle: string;
  aiComment: string;
  estimatedTotalCost: string;
  stops: AiStopResponse[];
}

export const maxDuration = 60;

const LONG_TRIP_KEYWORDS = [
  'uzoq',
  'safar',
  'viloyat',
  'tog‘',
  "tog'",
  'tog ',
  'toglar',
  'sharshara',
  'soy',
  'soyli',
  'yaylov',
  'ko‘l',
  "ko'l",
  'manzara',
  'tabiat qo‘yni',
  'kemping',
  'palatka',
  'o‘tov',
  'samarqand',
  'buxoro',
  'xiva',
  'xorazm',
  'zomin',
  'jizzax',
  'baxmal',
  'aydarko‘l',
  'aydarkol',
  'qashqadaryo',
  'shahrisabz',
  'kitob',
  'hisorak',
  'miraki',
  'maydanak',
  'gelon',
  'surxondaryo',
  'boysun',
  'sangardak',
  'omonxona',
  'darband',
  'farg‘ona',
  'fargona',
  'shohimardon',
  'vodil',
  'rishton',
  'qo‘qon',
  'namangan',
  'chodak',
  'nanay',
  'andijon',
  'xonobod',
  'navoiy',
  'nurota',
  'sarmishsoy',
  'sentob',
  'to‘dako‘l',
  'tudakul',
  'mo‘ynoq',
  'moynoq',
  'orol',
  'nukus',
  'ustyurt',
  'amirsoy',
  'chimyon',
  'chorvoq',
  'urungach',
  'paltau',
  'so‘qoq',
  'suqoq',
  'sukok',
  'kumushkon',
  'lashkerek',
  'sirdaryo',
  'poyezd',
  'samolyot',
  'afrosiyob'
];

function isLongTripQuery(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return LONG_TRIP_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: Request) {
  let userPrompt = '';
  try {
    const body = await req.json();
    userPrompt = body.prompt?.trim() || '';

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'Iltimos, o‘z xohishingizni matn ko‘rinishida kiriting' },
        { status: 400 }
      );
    }

    const wantLongTrips = isLongTripQuery(userPrompt);
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return wantLongTrips
        ? handleLocalLongTripFallback(userPrompt)
        : handleLocalAiFallback(userPrompt);
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = wantLongTrips
      ? `Sen O'zbekistonning 12 viloyati bo'ylab eng tajribali, ijodkor sayohat yo'lboshchisisan.
Senga foydalanuvchining uzoq safar haqidagi istagi va bizning 40 ta eng zo'r uzoq safar maskanlarimiz ro'yxati (JSON) beriladi.

Vazifang:
1. Foydalanuvchi so'roviga eng mos keladigan **3 yoki 4 ta** uzoq safar maskanini ("id" orqali) tanlab ber (masalan: sharsharali, soyli, yaylovli, tog'li, yolg'iz tabiat yoki gavjum tarixiy shaharlar).
2. Har bir tanlangan maskan uchun "recommendedTime" qismida necha soatda borilishi yoki qachon yo'lga chiqish ma'qulligini yoz (masalan: "07:00 • 2.5 soatlik yo'l").
3. "customTip" qismida u yerga qaysi transportlar (mashina, poyezd, avtobus, samolyot) qatnashi, yaqinida mehmonxona/oshxona/do'kon/shifoxona bor-yo'qligi va kreativ maslahatni yoz.
4. Qat'iy ravishda faqat quyidagi toza JSON formatida javob qaytar:
{
  "routeTitle": "Uzoq safar sarlavhasi (masalan: 12 Viloyat: Eng Zo'r 4 ta Sharsharali va Tog'li Maskan)",
  "aiComment": "Nega aynan ushbu 3-4 ta uzoq safar varianti tanlangani, transport va xarajat bo'yicha do'stona tavsiya",
  "estimatedTotalCost": "O'rtacha 1 kishilik safar byudjeti (masalan: 350 000 — 850 000 so'm)",
  "stops": [
    {
      "placeId": "bazadagi_joy_id",
      "recommendedTime": "Yo'l vaqti",
      "customTip": "Transport, mehmonxona va sayohat siri"
    }
  ]
}`
      : `Sen Toshkent bo'yicha eng sinchkov, do'stona va tajribali shahar gidisansan. 
Senga foydalanuvchi xohishi va bizning Toshkent shahrining mavjud lokatsiyalar ro'yxati (JSON) beriladi.

Vazifang: 
1. Faqat va faqat taqdim etilgan lokatsiyalar bazasidagi "id" lardan foydalanib 2 yoki 3 ta joydan iborat mantiqiy, xronologik marshrut tuz.
2. Qat'iy ravishda faqat quyidagi JSON formatida javob qaytar:
{
  "routeTitle": "Qisqa chiroyli nom",
  "aiComment": "Nega aynan shu joylar tanlangani va qisqa maslahat (o'zbek tilida, samimiy ohangda)",
  "estimatedTotalCost": "Taxminiy sarf-xarajat (masalan: 120 000 — 180 000 so‘m)",
  "stops": [
    {
      "placeId": "bazadagi_joy_id",
      "recommendedTime": "18:45",
      "customTip": "Aynan ushbu reja va foydalanuvchi istagi uchun mos shaxsiy maslahat"
    }
  ]
}`;

    const userMessageContent = wantLongTrips
      ? `Foydalanuvchi istagi: "${userPrompt}"

Bizning 12 viloyat bo'ylab 40 ta uzoq safar maskanlarimiz bazasi:
${JSON.stringify(LONG_TRIPS_SUMMARY)}

Faqat yuqoridagi bazadan foydalanuvchi so'roviga eng mos 3 yoki 4 ta variantni tanlab, sof JSON javob qaytar:`
      : `Foydalanuvchi istagi: "${userPrompt}"

Bizning Toshkent shahrining mavjud lokatsiyalar bazasi:
${JSON.stringify(PLACES_SUMMARY)}

Faqat yuqoridagi bazadan mos joylarni tanlab, xronologik tartibda sof JSON javob qaytar:`;

    let responseText = '';

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1100,
        temperature: 0.5,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessageContent }]
      });

      const firstBlock = message.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        responseText = firstBlock.text.trim();
      }
    } catch (sonnetError) {
      console.warn('Claude Sonnet xatoligi, Haiku modeliga o‘tilmoqda:', sonnetError);
      const messageHaiku = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1100,
        temperature: 0.5,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessageContent }]
      });

      const firstBlock = messageHaiku.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        responseText = firstBlock.text.trim();
      }
    }

    let cleanJson = responseText;
    if (cleanJson.includes('```json')) {
      cleanJson = cleanJson.split('```json')[1].split('```')[0].trim();
    } else if (cleanJson.includes('```')) {
      cleanJson = cleanJson.split('```')[1].split('```')[0].trim();
    }

    const parsedData: AiRouteResponse = JSON.parse(cleanJson);

    const validStops = parsedData.stops.filter(
      (stop) =>
        LOCATIONS_DATABASE.some((l) => l.id === stop.placeId) ||
        LONG_TRIPS_DATABASE.some((t) => t.id === stop.placeId)
    );

    if (validStops.length === 0) {
      return wantLongTrips
        ? handleLocalLongTripFallback(userPrompt)
        : handleLocalAiFallback(userPrompt);
    }

    return NextResponse.json({
      success: true,
      routeTitle: parsedData.routeTitle,
      aiComment: parsedData.aiComment,
      estimatedTotalCost: parsedData.estimatedTotalCost,
      stops: validStops,
      isAiGenerated: true,
      isLongTripRoute: wantLongTrips
    });
  } catch (error) {
    console.error('Claude AI Route API xatosi:', error);
    const fallbackPrompt = userPrompt || 'Oqshomgi sokin va shinam shahar sayri';
    return isLongTripQuery(fallbackPrompt)
      ? handleLocalLongTripFallback(fallbackPrompt)
      : handleLocalAiFallback(fallbackPrompt);
  }
}

/**
 * Uzoq safarlar uchun aqlli 3-4 ta variant saralab beruvchi funksiya
 */
function handleLocalLongTripFallback(prompt: string) {
  const lower = prompt.toLowerCase();

  // Har bir 40 ta maskanga so'rovga moslik balli beramiz
  const scored: { trip: LongTripItem; score: number }[] = LONG_TRIPS_DATABASE.map((trip) => {
    let score = 0;
    const hay = `${trip.title} ${trip.region} ${trip.district} ${trip.natureLabel} ${trip.crowdLevel} ${trip.shortDesc} ${trip.creativeTip}`.toLowerCase();

    // Viloyat yoki joy nomi aniq yozilgan bo'lsa
    const words = lower.split(/[\s,.\-!?]+/).filter((w) => w.length >= 4);
    for (const w of words) {
      if (hay.includes(w)) score += 5;
    }

    if ((lower.includes('sharshara') || lower.includes('soy')) && trip.natureType === 'waterfall_river') {
      score += 12;
    }
    if ((lower.includes('tog') || lower.includes('yaylov') || lower.includes('archa')) && trip.natureType === 'mountain_meadow') {
      score += 10;
    }
    if ((lower.includes('ko‘l') || lower.includes("ko'l") || lower.includes('plyaj') || lower.includes('suv')) && trip.natureType === 'lake_reservoir') {
      score += 12;
    }
    if ((lower.includes('yolg‘iz') || lower.includes("yolg'iz") || lower.includes('tinch') || lower.includes('sokin') || lower.includes('yovvoyi')) && (trip.natureType === 'secluded_wild' || trip.crowdLevel.includes('Yolg‘iz'))) {
      score += 11;
    }
    if ((lower.includes('gavjum') || lower.includes('tarix') || lower.includes('shahar')) && (trip.natureType === 'historic_lively' || trip.crowdLevel.includes('Gavjum'))) {
      score += 11;
    }
    if (lower.includes('poyezd') && trip.transport.train.available) {
      score += 8;
    }
    if (lower.includes('samolyot') && trip.transport.plane.available) {
      score += 8;
    }
    if (lower.includes('avtobus') && trip.transport.bus.available) {
      score += 6;
    }
    if ((lower.includes('arzon') || lower.includes('byudjet')) && trip.estimatedPrice <= 350000) {
      score += 7;
    }

    return { trip, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Agar ballar 0 bo'lsa (umumiy "uzoq safar" deyilgan bo'lsa), eng rang-barang 4 ta top maskanni beramiz
  let selected: LongTripItem[];
  if (scored[0].score === 0) {
    selected = [
      LONG_TRIPS_DATABASE.find((t) => t.id === 'zaamin-national-park')!,
      LONG_TRIPS_DATABASE.find((t) => t.id === 'sangardak-waterfall')!,
      LONG_TRIPS_DATABASE.find((t) => t.id === 'urungach-jade-lakes')!,
      LONG_TRIPS_DATABASE.find((t) => t.id === 'shohimardon-kubbon-lake')!
    ].filter(Boolean);
  } else {
    selected = scored.slice(0, 4).map((s) => s.trip);
  }

  let title = '12 Viloyat Bo‘ylab 4 ta Eng Zo‘r Uzoq Safar Varianti';
  let comment =
    'So‘rovingizga binoan O‘zbekistonning eng manzarali, sharsharali, tog‘li va betakror 4 ta uzoq safar maskanini saraladik. Har bir kartaning ichida qatnaydigan transportlar (mashina, poyezd, avtobus, samolyot), yaqin mehmonxona, oshxona, do‘kon va shifoxonalar ro‘yxati keltirilgan!';

  if (lower.includes('sharshara') || lower.includes('soy')) {
    title = 'Sharsharali va Soyli 4 ta Eng Go‘zal Safar Maskani';
    comment =
      'Muzdek tog‘ sharsharalari va zilol soylar bo‘yida hordiq chiqarish uchun eng zo‘r 4 ta viloyat maskani. Pasport tugmasini bosib transport va mehmonxonalar ro‘yxatini ko‘rishingiz mumkin.';
  } else if (lower.includes('yolg‘iz') || lower.includes("yolg'iz") || lower.includes('sokin')) {
    title = 'Shovqindan Yiroq 4 ta Yolg‘iz va Yovvoyi Tabiat Maskani';
    comment =
      'Shahar shovqinidan butkul uzilib, sokin tog‘ qishloqlari, kanyonlar va yulduzli osmon ostida dam olish uchun 4 ta noyob maskan.';
  } else if (lower.includes('ko‘l') || lower.includes("ko'l")) {
    title = 'Feruza Ko‘llar va Suv Bo‘yidagi 4 ta Eng Zo‘r Maskan';
    comment =
      'Zيلol tog‘ ko‘llari va suv omborlari bo‘yida qayiqda suzish hamda dam olish uchun 4 ta ajoyib variant.';
  }

  const stops: AiStopResponse[] = selected.map((trip, idx) => ({
    placeId: trip.id,
    recommendedTime: `${idx + 1}-variant • ${trip.travelTimeText}`,
    customTip: `${trip.creativeTip} (Transport: Mashina ✓${trip.transport.train.available ? ', Poyezd ✓' : ''}${trip.transport.bus.available ? ', Avtobus ✓' : ''}${trip.transport.plane.available ? ', Samolyot ✓' : ''})`
  }));

  const minPrice = Math.min(...selected.map((t) => t.estimatedPrice));
  const maxPrice = Math.max(...selected.map((t) => t.estimatedPrice));

  return NextResponse.json({
    success: true,
    routeTitle: title,
    aiComment: comment,
    estimatedTotalCost: `${minPrice.toLocaleString('uz-UZ')} — ${maxPrice.toLocaleString('uz-UZ')} so‘m (tanlangan variantga qarab)`,
    stops,
    isAiGenerated: true,
    isLongTripRoute: true
  });
}

/**
 * Toshkent shahri uchun zaxira javob
 */
function handleLocalAiFallback(prompt: string) {
  const lower = prompt.toLowerCase();

  let selected = LOCATIONS_DATABASE.slice(0, 3);
  let title = 'Toshkent bo‘ylab shinam oqshom';
  let comment =
    'Sizning so‘rovingizga mos ravishda eng shinam va sokin Toshkent maskanlarini jamladik.';

  if (lower.includes('romantik') || lower.includes('qiz') || lower.includes('juft')) {
    selected = LOCATIONS_DATABASE.filter((l) => l.companionTags.includes('couple')).slice(0, 3);
    title = 'Romantik oqshom va nozik qahva';
    comment = 'Samimiy suhbat va go‘zal fotosuratlar uchun eng romantik burchaklar saralandi.';
  } else if (lower.includes('do‘st') || lower.includes('dost') || lower.includes('fastfud')) {
    selected = LOCATIONS_DATABASE.filter((l) => l.companionTags.includes('friends')).slice(0, 3);
    title = 'Do‘stlar davrasi va shahar drayvi';
    comment =
      'Mazali taomlar, qiziqarli ko‘ngilochar va samimiy do‘stlar yig‘ini uchun maxsus reja.';
  } else if (lower.includes('qahva') || lower.includes('kitob') || lower.includes('yolg‘iz')) {
    selected = LOCATIONS_DATABASE.filter(
      (l) => l.category === 'cafe' || l.companionTags.includes('solo')
    ).slice(0, 2);
    title = 'Sokin qahva va shaxsiy vaqt';
    comment = 'Xushbo‘y kapuchino, shinam stol va xotirjam mutolaa uchun eng maqbul maskanlar.';
  }

  const times = ['18:30', '19:45', '21:15'];
  const stops: AiStopResponse[] = selected.map((loc, idx) => ({
    placeId: loc.id,
    recommendedTime: times[idx] || '20:00',
    customTip: loc.tipText
  }));

  const totalCostNumber = selected.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  return NextResponse.json({
    success: true,
    routeTitle: title,
    aiComment: comment,
    estimatedTotalCost: `${(Math.round(totalCostNumber / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`,
    stops: stops,
    isAiGenerated: true
  });
}
