'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Sunset, Sparkles, ThermometerSun } from 'lucide-react';

interface LiveWeatherAdvisorProps {
  lat: number;
  lng: number;
  locationName: string;
  compact?: boolean;
}

interface WeatherData {
  tempC: number;
  weatherCode: number;
  windSpeedKmh: number;
  sunsetTime: string;
  goldenHourRange: string;
}

function getWeatherLabelAndAdvice(code: number, temp: number, wind: number): {
  label: string;
  verdictTitle: string;
  verdictDesc: string;
  statusColor: 'emerald' | 'amber' | 'sky';
} {
  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
  const isSnowy = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isCloudy = code >= 1 && code <= 48;

  let label = 'Ochiq va quyoshli';
  if (isSnowy) label = 'Qorli ob-havo';
  else if (isRainy) label = 'Yomg‘irli havo';
  else if (isCloudy) label = 'Yengil bulutli';

  if (isRainy) {
    return {
      label,
      verdictTitle: 'Soyabon oling yoki shinam joy tanlang ☔',
      verdictDesc: 'Yomg‘ir ehtimoli bor — issiq qahvaxona, muzey yoki yopiq ayvonli maskanlar ayni muddao.',
      statusColor: 'amber'
    };
  }

  if (isSnowy || temp < 5) {
    return {
      label,
      verdictTitle: 'Qishki ertak muhiti — qalinroq kiyining 🧣',
      verdictDesc: 'Havo salqin. Issiq choy, termos va shamol o‘tkazmaydigan ustki kiyim bilan sayr juda yoqimli bo‘ladi.',
      statusColor: 'sky'
    };
  }

  if (temp > 34) {
    return {
      label,
      verdictTitle: 'Kechki salqin yoki soy-suv bo‘yi tavsiya etiladi 🌊',
      verdictDesc: 'Kunduzi quyosh faol. Soy bo‘yi, sersoya daraxtzorlar yoki 17:00 dan keyingi sayr eng zo‘r tanlov!',
      statusColor: 'amber'
    };
  }

  if (wind > 25) {
    return {
      label,
      verdictTitle: 'Shabadali havo — yengil ustki kiyim oling 🍃',
      verdictDesc: 'Havo toza, biroq shamol tezligi biroz yuqori. Ochiq tepaliklarda shamolga chidamli kiyim asqotadi.',
      statusColor: 'sky'
    };
  }

  return {
    label,
    verdictTitle: 'Hozir borish va sayr qilish uchun ideal havo! ✅',
    verdictDesc: 'Harorat va shamol me’yorida — ochiq havoda piyoda sayr, piknik va chiroyli kadrlar uchun ayni vaqti.',
    statusColor: 'emerald'
  };
}

export const LiveWeatherAdvisor: React.FC<LiveWeatherAdvisorProps> = ({
  lat,
  lng,
  locationName,
  compact = false
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,weather_code,wind_speed_10m&daily=sunset&timezone=auto&forecast_days=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const tempC = Math.round(data?.current?.temperature_2m ?? 22);
        const weatherCode = data?.current?.weather_code ?? 0;
        const windSpeedKmh = Math.round(data?.current?.wind_speed_10m ?? 8);

        let sunsetTime = '18:30';
        let goldenHourRange = '17:35 – 18:25';

        const rawSunset: string | undefined = data?.daily?.sunset?.[0];
        if (rawSunset && rawSunset.includes('T')) {
          const timePart = rawSunset.split('T')[1];
          if (timePart) {
            sunsetTime = timePart.slice(0, 5);
            const [hh, mm] = sunsetTime.split(':').map(Number);
            if (!isNaN(hh) && !isNaN(mm)) {
              const totalMins = hh * 60 + mm;
              const startMins = Math.max(0, totalMins - 55);
              const sh = String(Math.floor(startMins / 60)).padStart(2, '0');
              const sm = String(startMins % 60).padStart(2, '0');
              goldenHourRange = `${sh}:${sm} – ${sunsetTime}`;
            }
          }
        }

        setWeather({
          tempC,
          weatherCode,
          windSpeedKmh,
          sunsetTime,
          goldenHourRange
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWeather({
          tempC: 21,
          weatherCode: 1,
          windSpeedKmh: 9,
          sunsetTime: '18:20',
          goldenHourRange: '17:25 – 18:20'
        });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (loading || !weather) {
    return (
      <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-zinc-200/70 dark:border-slate-800 animate-pulse flex items-center justify-between text-xs text-zinc-400">
        <span>🌤️ {locationName} jonli ob-havo va Oltin soat yuklanmoqda...</span>
      </div>
    );
  }

  const info = getWeatherLabelAndAdvice(weather.weatherCode, weather.tempC, weather.windSpeedKmh);

  const renderWeatherIcon = () => {
    const code = weather.weatherCode;
    if ((code >= 71 && code <= 77) || code >= 85) {
      return <Snowflake className="w-5 h-5 text-sky-500" />;
    }
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
    if (code >= 1 && code <= 48) {
      return <Cloud className="w-5 h-5 text-amber-500" />;
    }
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  if (compact) {
    return (
      <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-2.5 sm:px-4 border border-emerald-200/70 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center shrink-0">
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-zinc-900 dark:text-white">
                {locationName}: {weather.tempC > 0 ? `+${weather.tempC}°C` : `${weather.tempC}°C`}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-slate-400">• {info.label}</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {info.verdictTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 text-amber-900 dark:text-amber-300 text-[11px] font-semibold">
          <Sunset className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>📸 Oltin soat: <b>{weather.goldenHourRange}</b></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800/70 border border-emerald-200/70 dark:border-slate-700/80 space-y-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-zinc-200/70 dark:border-slate-700 flex items-center justify-center shadow-2xs">
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-zinc-900 dark:text-white">
                {weather.tempC > 0 ? `+${weather.tempC}°C` : `${weather.tempC}°C`}
              </span>
              <span className="text-xs font-semibold text-zinc-600 dark:text-slate-300">
                {info.label}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 dark:text-slate-400 bg-zinc-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                <Wind className="w-3 h-3" />
                {weather.windSpeedKmh} km/s
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-slate-400 block">
              Jonli ob-havo ({locationName})
            </span>
          </div>
        </div>

        {/* Golden hour / Sunset badge */}
        <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center gap-1.5">
          <Sunset className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="text-[10px] leading-tight">
            <span className="font-bold text-amber-900 dark:text-amber-300 block">
              📸 Oltin soat (Eng chiroyli kadr):
            </span>
            <span className="font-extrabold text-amber-700 dark:text-amber-200">
              {weather.goldenHourRange} (Quyosh botishi {weather.sunsetTime})
            </span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-emerald-200/60 dark:border-slate-700/70 flex items-start gap-2">
        <ThermometerSun className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-zinc-900 dark:text-white block">
            {info.verdictTitle}
          </span>
          <span className="text-[11px] text-zinc-600 dark:text-slate-300">
            {info.verdictDesc}
          </span>
        </div>
      </div>
    </div>
  );
};
