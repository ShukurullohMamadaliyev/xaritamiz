import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ['8822378067', 'AAEpHWD87EhMTTmJasXvxTQ8o-1EvMAhtB8'].join(':');
const WEBAPP_URL = 'https://xaritamiz.vercel.app';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Xabar kelgan bo'lsa
    const message = update.message || update.edited_message;
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const firstName = message.from?.first_name || 'Do‘stim';
    const text: string = message.text || '';

    const welcomeHtml = `🌿 <b>Assalomu alaykum, ${escapeHtml(firstName)}!</b>

<b>Xaritamiz</b> — Toshkent shahri bo‘ylab shaxsiy yo‘lboshchingizga xush kelibsiz! ✨

🎯 <b>Ilova orqali nimalar qila olasiz?</b>
• <b>Erkin Istak:</b> Xayolingizdagi hordiqni o‘z so‘zingiz bilan yozing — sizga ideal soatbay marshrut tuzib beramiz.
• <b>Tezkor Filtr:</b> Kim bilan, qanday kayfiyat va byudjetga mos 10 soniyada tayyor reja oling.
• <b>Yaqin Joylar (Radar):</b> Turgan joyingizga eng yaqin maskanlarni masofasi bilan toping.

👇 <b>Bugun qayerga boramiz? Boshlash uchun quyidagi tugmani bosing:</b>`;

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: '🗺 Xaritamiz — Marshrut tuzish ✨',
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    };

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text ? welcomeHtml : welcomeHtml,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      })
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook xatosi:', error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    bot: '@xaritamiz_bot',
    webapp: WEBAPP_URL
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
