import { NextResponse } from 'next/server';
import {
  ADMIN_TELEGRAM_ID,
  BOT_TOKEN,
  WEBAPP_URL,
  escapeHtml,
  moderateCommunitySubmission
} from '../../../lib/communityPlacesStore';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // 1. Inline tugma bosilganda (callback_query — Admin Tasdiqlash / Rad etish)
    if (update.callback_query) {
      const cq = update.callback_query;
      const fromId = String(cq.from?.id || '');
      const data: string = cq.data || '';
      const messageText: string = cq.message?.text || '';
      const chatId = cq.message?.chat?.id;
      const messageId = cq.message?.message_id;

      if (data.startsWith('approve_place:') || data.startsWith('reject_place:')) {
        if (fromId !== ADMIN_TELEGRAM_ID) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: cq.id,
              text: '⛔ Faqat bosh admin (7048168954) tasdiqlay oladi!',
              show_alert: true
            })
          });
          return NextResponse.json({ ok: true });
        }

        const isApprove = data.startsWith('approve_place:');
        const placeId = data.split(':')[1] || '';
        const updatedSub = await moderateCommunitySubmission(
          placeId,
          isApprove ? 'approved' : 'rejected',
          messageText
        );

        const alertText = isApprove
          ? '✅ Tasdiqlandi! Joy Xaritamiz saytiga muvaffaqiyatli qo‘shildi.'
          : '❌ Joy rad etildi va saytga qo‘shilmadi.';

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: cq.id,
            text: alertText,
            show_alert: true
          })
        });

        if (chatId && messageId) {
          const statusBanner = isApprove
            ? `\n\n✅ <b>HOLAT: TASDIQLANDI VA SAYTGA QO‘SHILDI!</b>`
            : `\n\n❌ <b>HOLAT: ADMIN TOMONIDAN RAD ETILDI</b>`;

          const cleanOriginal = messageText
            .replace('👇 Saytga qo‘shish uchun tasdiqlang yoki rad eting:', '')
            .trim();

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${escapeHtml(cleanOriginal)}${statusBanner}`,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '🛡️ Admin Panelni ochish',
                      web_app: {
                        url: `${WEBAPP_URL}/?admin_id=${ADMIN_TELEGRAM_ID}&open_admin=1`
                      }
                    },
                    {
                      text: '🗺 Saytni ochish',
                      web_app: { url: WEBAPP_URL }
                    }
                  ]
                ]
              }
            })
          });
        }

        return NextResponse.json({ ok: true, moderated: updatedSub?.id });
      }
    }

    // 2. Oddiy xabar kelgan bo'lsa
    const message = update.message || update.edited_message;
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const isAdmin = String(chatId) === ADMIN_TELEGRAM_ID || String(message.from?.id) === ADMIN_TELEGRAM_ID;
    const firstName = message.from?.first_name || 'Do‘stim';
    const text: string = message.text || '';

    const welcomeHtml = `🌿 <b>Assalomu alaykum, ${escapeHtml(firstName)}!</b>

<b>Xaritamiz</b> — Toshkent shahri va 12 viloyat bo‘ylab shaxsiy yo‘lboshchingizga xush kelibsiz! ✨

🎯 <b>Ilova orqali nimalar qila olasiz?</b>
• <b>Erkin Istak & Ovozli AI:</b> Xayolingizdagi hordiqni yozing yoki ovozda ayting — sizga ideal marshrut tuzib beramiz.
• <b>Yaqin Joylar & 12 Viloyat:</b> Eng sokin maskanlar, tog‘ sharsharalari va Gastro-Kompas.
• <b>➕ Yangi Sokin Joy Qo‘shish:</b> O‘zingiz bilgan go‘zal joyni rasm va GPS bilan yuboring!${
      isAdmin
        ? `\n\n🛡️ <b>Bosh Admin (ID: ${ADMIN_TELEGRAM_ID}) rejimi faol!</b> Foydalanuvchilar yuborgan yangi joylar shu yerga tasdiqlash tugmasi bilan keladi.`
        : ''
    }

📢 <b>Telegram kanal:</b> https://t.me/xaritamiz_rasmiy
📸 <b>Instagram:</b> https://www.instagram.com/xaritamiz

👇 <b>Bugun qayerga boramiz? Boshlash uchun quyidagi tugmani bosing:</b>`;

    const inlineKeyboard: any[] = [
      [
        {
          text: '🗺 Xaritamiz — Marshrut tuzish ✨',
          web_app: { url: isAdmin ? `${WEBAPP_URL}/?admin_id=${ADMIN_TELEGRAM_ID}` : WEBAPP_URL }
        }
      ]
    ];

    if (isAdmin) {
      inlineKeyboard.push([
        {
          text: '🛡️ Admin Panelni ochish (Moderatsiya)',
          web_app: { url: `${WEBAPP_URL}/?admin_id=${ADMIN_TELEGRAM_ID}&open_admin=1` }
        }
      ]);
    }

    inlineKeyboard.push([
      {
        text: '📢 Telegram kanal',
        url: 'https://t.me/xaritamiz_rasmiy'
      },
      {
        text: '📸 Instagram',
        url: 'https://www.instagram.com/xaritamiz'
      }
    ]);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text ? welcomeHtml : welcomeHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard: inlineKeyboard }
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
    webapp: WEBAPP_URL,
    adminId: ADMIN_TELEGRAM_ID
  });
}
