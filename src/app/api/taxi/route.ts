import { NextResponse } from 'next/server';

type TaxiAppId = 'yandex' | 'uklon' | 'wb' | 'fasten' | 'mytaxi';

interface TaxiAppConfig {
  name: string;
  color: string;
  androidPackage: string;
  iosStoreId: string;
  iosStoreUrl: string;
  playStoreUrl: string;
  webUrl: string;
  buildSchemeUrl: (lat: string, lng: string, title: string) => string;
  buildAndroidIntent: (lat: string, lng: string, title: string, playStoreUrl: string) => string;
}

const TAXI_CONFIGS: Record<TaxiAppId, TaxiAppConfig> = {
  yandex: {
    name: 'Yandex Go',
    color: '#FC3F1D',
    androidPackage: 'ru.yandex.taxi',
    iosStoreId: '472650686',
    iosStoreUrl: 'https://apps.apple.com/uz/app/yandex-go-taxi-food-delivery/id472650686',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=ru.yandex.taxi',
    webUrl: 'https://go.yandex/',
    buildSchemeUrl: (lat, lng) =>
      `yandextaxi://route?end-lat=${lat}&end-lon=${lng}`,
    buildAndroidIntent: (lat, lng, _title, fallback) =>
      `intent://route?end-lat=${lat}&end-lon=${lng}#Intent;scheme=yandextaxi;package=ru.yandex.taxi;S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  },
  uklon: {
    name: 'Uklon',
    color: '#FFD000',
    androidPackage: 'ua.com.uklontaxi',
    iosStoreId: '654646098',
    iosStoreUrl: 'https://apps.apple.com/uz/app/uklon-more-than-a-taxi/id654646098',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=ua.com.uklontaxi',
    webUrl: 'https://m-uz.uklon.eu/?language=uz',
    buildSchemeUrl: (lat, lng, title) =>
      `uklon://?end_lat=${lat}&end_lng=${lng}&dropoff_lat=${lat}&dropoff_lng=${lng}&lat=${lat}&lng=${lng}&destination_address=${encodeURIComponent(title)}`,
    buildAndroidIntent: (lat, lng, title, fallback) =>
      `intent://route?end_lat=${lat}&end_lng=${lng}&dropoff_lat=${lat}&dropoff_lng=${lng}&lat=${lat}&lng=${lng}&destination_address=${encodeURIComponent(title)}#Intent;scheme=uklon;package=ua.com.uklontaxi;S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  },
  wb: {
    name: 'WB Taxi',
    color: '#CB11AB',
    androidPackage: 'uz.wb.taxi',
    iosStoreId: '6755240054',
    iosStoreUrl: 'https://apps.apple.com/uz/app/wb-taxi/id6755240054',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=uz.wb.taxi',
    webUrl: 'https://taxi.wildberries.uz/',
    buildSchemeUrl: (lat, lng, title) =>
      `wbtaxi://route?end-lat=${lat}&end-lon=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}`,
    buildAndroidIntent: (lat, lng, title, fallback) =>
      `intent://route?end-lat=${lat}&end-lon=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}#Intent;scheme=wbtaxi;package=uz.wb.taxi;S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  },
  fasten: {
    name: 'Fasten',
    color: '#00C853',
    androidPackage: 'com.fasten.taxi.uz',
    iosStoreId: '6578446117',
    iosStoreUrl: 'https://apps.apple.com/uz/app/fasten-uz-safarlar-yetkazish/id6578446117',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fasten.taxi.uz',
    webUrl: 'https://fasten.com/',
    buildSchemeUrl: (lat, lng, title) =>
      `fasten://route?end-lat=${lat}&end-lon=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}`,
    buildAndroidIntent: (lat, lng, title, fallback) =>
      `intent://route?end-lat=${lat}&end-lon=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}#Intent;scheme=fasten;package=com.fasten.taxi.uz;S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  },
  mytaxi: {
    name: 'MyTaxi',
    color: '#FFCC00',
    androidPackage: 'com.uznewmax.mytaxi',
    iosStoreId: '865012817',
    iosStoreUrl: 'https://apps.apple.com/uz/app/mytaxi-taxi-and-delivery/id865012817',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.uznewmax.mytaxi',
    webUrl: 'https://mytaxi.uz/',
    buildSchemeUrl: (lat, lng, title) =>
      `mytaxi://route?end_lat=${lat}&end_lng=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}`,
    buildAndroidIntent: (lat, lng, title, fallback) =>
      `intent://route?end_lat=${lat}&end_lng=${lng}&lat=${lat}&lng=${lng}&address=${encodeURIComponent(title)}#Intent;scheme=mytaxi;package=com.uznewmax.mytaxi;S.browser_fallback_url=${encodeURIComponent(fallback)};end`
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const appParam = (searchParams.get('app') || 'yandex').toLowerCase() as TaxiAppId;
  const lat = searchParams.get('lat') || '41.311081';
  const lng = searchParams.get('lng') || '69.240562';
  const title = searchParams.get('title') || 'Toshkent';
  const address = searchParams.get('address') || '';

  if (appParam === 'yandex') {
    const yandexUrl = `https://3.redirect.appmetrica.yandex.com/route?end-lat=${encodeURIComponent(lat)}&end-lon=${encodeURIComponent(lng)}&app=taxi&appmetrica_tracking_id=1178268795219780156`;
    return NextResponse.redirect(yandexUrl);
  }

  const cfg = TAXI_CONFIGS[appParam] || TAXI_CONFIGS.yandex;
  const schemeUrl = cfg.buildSchemeUrl(lat, lng, title);
  const androidIntentUrl = cfg.buildAndroidIntent(lat, lng, title, cfg.playStoreUrl);
  const fullDestination = address ? `${title} (${address})` : title;

  const html = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>${escapeHtml(cfg.name)} — ${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0b0f19;
      color: #f8fafc;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      width: 100%;
      max-width: 380px;
      background: #161f30;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 28px 22px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 14px;
    }
    h1 {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .dest {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .coords {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 20px;
      font-family: monospace;
    }
    .copied {
      font-size: 12px;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 8px 12px;
      border-radius: 12px;
      margin-bottom: 18px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      margin-bottom: 10px;
      transition: opacity 0.2s;
    }
    .btn-primary {
      background: #10b981;
      color: #ffffff;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.07);
      color: #e2e8f0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${escapeHtml(cfg.name)}</div>
    <h1>Ilova ochilmoqda...</h1>
    <div class="dest">📍 ${escapeHtml(fullDestination)}</div>
    <div class="coords">${escapeHtml(lat)}, ${escapeHtml(lng)}</div>
    <div class="copied">✅ Manzil nomi nusxalandi — ilovada qo‘yishingiz mumkin</div>
    <a id="openBtn" href="${escapeHtml(schemeUrl)}" class="btn btn-primary">${escapeHtml(cfg.name)} ilovasini ochish</a>
    <a id="storeBtn" href="${escapeHtml(cfg.webUrl)}" class="btn btn-secondary">Ilovani yuklab olish (App Store / Google Play)</a>
  </div>
  <script>
    (function() {
      var ua = navigator.userAgent || '';
      var isAndroid = /Android/i.test(ua);
      var isIOS = /iPhone|iPad|iPod/i.test(ua);
      var schemeUrl = ${JSON.stringify(schemeUrl)};
      var androidIntentUrl = ${JSON.stringify(androidIntentUrl)};
      var iosStoreUrl = ${JSON.stringify(cfg.iosStoreUrl)};
      var playStoreUrl = ${JSON.stringify(cfg.playStoreUrl)};
      var webUrl = ${JSON.stringify(cfg.webUrl)};
      var destText = ${JSON.stringify(title)};

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(destText).catch(function(){});
        }
      } catch (e) {}

      var openBtn = document.getElementById('openBtn');
      var storeBtn = document.getElementById('storeBtn');

      if (isAndroid) {
        openBtn.href = androidIntentUrl;
        storeBtn.href = playStoreUrl;
        window.location.replace(androidIntentUrl);
      } else if (isIOS) {
        openBtn.href = schemeUrl;
        storeBtn.href = iosStoreUrl;
        window.location.href = schemeUrl;
        setTimeout(function() {
          if (!document.hidden) {
            window.location.href = iosStoreUrl;
          }
        }, 1600);
      } else {
        openBtn.href = webUrl;
        storeBtn.href = playStoreUrl;
        window.location.replace(webUrl);
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
