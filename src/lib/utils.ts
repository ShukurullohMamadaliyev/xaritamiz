import { RoutePlan, LocationItem } from '../types';

export type TaxiProviderId = 'yandex' | 'uklon';

export interface TaxiProviderInfo {
  id: TaxiProviderId;
  label: string;
  dotColor: string;
  getUrl: (location: LocationItem) => string;
}

/**
 * Yandex Go taksi chaqirish havolasi
 */
export function getYandexGoUrl(location: LocationItem): string {
  return `https://3.redirect.appmetrica.yandex.com/route?end-lat=${location.lat}&end-lon=${location.lng}&app=taxi&appmetrica_tracking_id=1178268795219780156`;
}

/**
 * Uklon taksi chaqirish havolasi (Universal OneLink + koordinatalar)
 */
export function getUklonUrl(location: LocationItem): string {
  const dp = `uklon://?end_lat=${location.lat}&end_lng=${location.lng}&dropoff_lat=${location.lat}&dropoff_lng=${location.lng}&lat=${location.lat}&lng=${location.lng}&destination_address=${encodeURIComponent(location.title)}`;
  return `https://uklonapp.onelink.me/Ptvs/pwa?af_dp=${encodeURIComponent(dp)}&end_lat=${location.lat}&end_lng=${location.lng}&dropoff_lat=${location.lat}&dropoff_lng=${location.lng}&lat=${location.lat}&lng=${location.lng}&address=${encodeURIComponent(location.title)}`;
}

export const TAXI_PROVIDERS: TaxiProviderInfo[] = [
  {
    id: 'yandex',
    label: 'Yandex Go',
    dotColor: 'bg-red-500',
    getUrl: getYandexGoUrl
  },
  {
    id: 'uklon',
    label: 'Uklon',
    dotColor: 'bg-amber-400',
    getUrl: getUklonUrl
  }
];

export function handleTaxiClick(location: LocationItem) {
  triggerHaptic('light');
  if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(location.title).catch(() => {});
  }
}

/**
 * Yandex Xarita havolasi
 */
export function getYandexMapsUrl(location: LocationItem): string {
  return `https://yandex.uz/maps/?pt=${location.lng},${location.lat}&z=16&l=map&text=${encodeURIComponent(location.title)}`;
}

/**
 * Google Maps havolasi
 */
export function getGoogleMapsUrl(location: LocationItem): string {
  return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
}

/**
 * Telegramda ulashish havolasini yaratish
 */
export function getTelegramShareUrl(route: RoutePlan, originUrl: string): string {
  const text = `🗺️ *Xaritamiz — ${route.title}*\n\n` +
    `✨ Muhit: ${route.subtitle}\n` +
    `⏱️ Vaqt: ${route.totalDurationHours}\n` +
    `💰 Taxminiy sarf: ${route.totalEstimatedCost}\n\n` +
    `📍 *Marshrut bekatlari:*\n` +
    route.stops.map(s => `${s.stopOrder}. ${s.timeSlot} — ${s.location.title} (${s.location.categoryLabel})`).join('\n') +
    `\n\n👇 To‘liq marshrut va xaritani ko‘rish yoki ovoz berish uchun oching:`;

  const shareParams = new URLSearchParams({
    url: originUrl,
    text: text
  });

  return `https://t.me/share/url?${shareParams.toString()}`;
}

/**
 * Telegram WebApp Haptic feedback simulyatsiyasi / haqiqiysi
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium') {
  if (typeof window !== 'undefined') {
    // @ts-expect-error Telegram WebApp window obyekti
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      if (type === 'success' || type === 'warning') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    } else if ('vibrate' in navigator) {
      try {
        navigator.vibrate(type === 'heavy' ? 40 : 20);
      } catch {
        // ignore
      }
    }
  }
}
