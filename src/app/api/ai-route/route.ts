import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LOCATIONS_DATABASE } from '../../../data/locations';

// Minimal va ixcham joylar ro'yxatini shakllantirish (token tejash va aniqlik uchun)
const PLACES_SUMMARY = LOCATIONS_DATABASE.map(loc => ({
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userPrompt = body.prompt?.trim();

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'Iltimos, o‘z xohishingizni matn ko‘rinishida kiriting' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY topilmadi, lokal fallback ishlatiladi.');
      return handleLocalAiFallback(userPrompt);
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const systemPrompt = `Sen Toshkent bo'yicha eng sinchkov, do'stona va tajribali shahar gidisansan. 
Senga foydalanuvchi xohishi va bizning Toshkent shahrining mavjud lokatsiyalar ro'yxati (JSON) beriladi.

Vazifang: 
1. Faqat va faqat taqdim etilgan lokatsiyalar bazasidagi "id" lardan foydalanib 2 yoki 3 ta joydan iborat mantiqiy, xronologik marshrut tuz (masalan, avval qahva/sayr, keyin kechki ovqat/teatr yoki rooftop).
2. Qat'iy ravishda faqat quyidagi JSON formatida javob qaytar (hech qanday markdown \`\`\`json\`\`\` bloki yoki qo'shimcha so'zlarsiz, toza JSON obyekti bo'lsin):
{
  "routeTitle": "Qisqa chiroyli nom",
  "aiComment": "Nega aynan shu joylar tanlangani va qisqa maslahat (o'zbek tilida, do'stona va iliq ohangda, o'zingni AI yoki bot deb atama, balki shaxsiy shahar yo'lboshchisi sifatida samimiy gapir)",
  "estimatedTotalCost": "Taxminiy sarf-xarajat (masalan: 120 000 — 180 000 so‘m)",
  "stops": [
    {
      "placeId": "bazadagi_joy_id",
      "recommendedTime": "18:45",
      "customTip": "Aynan ushbu reja va foydalanuvchi istagi uchun mos shaxsiy maslahat"
    }
  ]
}`;

    const userMessageContent = `Foydalanuvchi istagi: "${userPrompt}"

Bizning Toshkent shahrining mavjud lokatsiyalar bazasi:
${JSON.stringify(PLACES_SUMMARY)}

Faqat yuqoridagi bazadan mos joylarni tanlab, xronologik tartibda sof JSON javob qaytar:`;

    let responseText = '';

    try {
      // 1-urinish: Claude Sonnet 4.6
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        temperature: 0.5,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessageContent,
          },
        ],
      });

      const firstBlock = message.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        responseText = firstBlock.text.trim();
      }
    } catch (sonnetError) {
      console.warn('Claude Sonnet xatoligi, Haiku modeliga o‘tilmoqda:', sonnetError);
      
      // 2-urinish: Claude Haiku 4.5 (tezkor va tejamkor)
      const messageHaiku = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        temperature: 0.5,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessageContent,
          },
        ],
      });

      const firstBlock = messageHaiku.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        responseText = firstBlock.text.trim();
      }
    }

    // JSON parse qilish va tozalash
    let cleanJson = responseText;
    if (cleanJson.includes('```json')) {
      cleanJson = cleanJson.split('```json')[1].split('```')[0].trim();
    } else if (cleanJson.includes('```')) {
      cleanJson = cleanJson.split('```')[1].split('```')[0].trim();
    }

    const parsedData: AiRouteResponse = JSON.parse(cleanJson);

    // Bazadagi joylar bilan tekshirish (mavjud bo'lmagan id larni filtrlash)
    const validStops = parsedData.stops.filter(stop => 
      LOCATIONS_DATABASE.some(l => l.id === stop.placeId)
    );

    if (validStops.length === 0) {
      return handleLocalAiFallback(userPrompt);
    }

    return NextResponse.json({
      success: true,
      routeTitle: parsedData.routeTitle,
      aiComment: parsedData.aiComment,
      estimatedTotalCost: parsedData.estimatedTotalCost,
      stops: validStops,
      isAiGenerated: true
    });

  } catch (error) {
    console.error('Claude AI Route API xatosi:', error);
    // API yoki parse xatosi bo'lsa xavfsiz intellektual zaxiraga o'tish
    const fallbackPrompt = 'Oqshomgi sokin va shinam shahar sayri';
    return handleLocalAiFallback(fallbackPrompt);
  }
}

/**
 * Agar Claude API tokeni limitga yetsa yoki tarmoq xatosi bo'lsa, aqlli zaxira javob
 */
function handleLocalAiFallback(prompt: string) {
  const lower = prompt.toLowerCase();
  
  let selected = LOCATIONS_DATABASE.slice(0, 3);
  let title = 'Toshkent bo‘ylab shinam oqshom';
  let comment = 'Sizning so‘rovingizga mos ravishda eng shinam va sokin Toshkent maskanlarini jamladik.';

  if (lower.includes('romantik') || lower.includes('qiz') || lower.includes('juft')) {
    selected = LOCATIONS_DATABASE.filter(l => l.companionTags.includes('couple')).slice(0, 3);
    title = 'Romantik oqshom va nozik qahva';
    comment = 'Samimiy suhbat va go‘zal fotosuratlar uchun eng romantik burchaklar saralandi.';
  } else if (lower.includes('do‘st') || lower.includes('dost') || lower.includes('fastfud')) {
    selected = LOCATIONS_DATABASE.filter(l => l.companionTags.includes('friends')).slice(0, 3);
    title = 'Do‘stlar davrasi va shahar drayvi';
    comment = 'Mazali taomlar, qiziqarli ko‘ngilochar va samimiy do‘stlar yig‘ini uchun maxsus reja.';
  } else if (lower.includes('qahva') || lower.includes('kitob') || lower.includes('yolg‘iz')) {
    selected = LOCATIONS_DATABASE.filter(l => l.category === 'cafe' || l.companionTags.includes('solo')).slice(0, 2);
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
