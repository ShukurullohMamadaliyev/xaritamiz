'use client';

import React from 'react';
import { 
  MapPin, 
  Car, 
  Lightbulb, 
  Star, 
  Shuffle, 
  ExternalLink,
  Map,
  Clock
} from 'lucide-react';
import { RouteStop } from '../types';
import { TAXI_PROVIDERS, handleTaxiClick, getYandexMapsUrl, getGoogleMapsUrl, triggerHaptic } from '../lib/utils';

interface LocationCardProps {
  stop: RouteStop;
  isLast: boolean;
  onSwapStop: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  stop,
  isLast,
  onSwapStop
}) => {
  const { location, timeSlot, stopOrder } = stop;

  return (
    <div className="relative pl-6 sm:pl-8 group">
      
      {/* Timeline vertikal chizig'i */}
      {!isLast && (
        <div className="absolute left-[13px] sm:left-[17px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-200 dark:to-emerald-900/40" />
      )}

      {/* Bekat tartib raqami aylana badge */}
      <div className="absolute left-0 top-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-emerald-600/20 ring-4 ring-[#F4FBF7] dark:ring-[#0b0f19] z-10">
        {stopOrder}
      </div>

      {/* Asosiy karta */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-zinc-200/70 dark:border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.07)] hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200">
        
        {/* Yuqori qism: Vaqt va Rasm */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-100 dark:bg-slate-800">
          <img
            src={location.imageUrl}
            alt={location.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Vaqt belgisi */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span>{timeSlot}</span>
          </div>

          {/* Reyting */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-zinc-800 text-xs font-bold border border-white/30 shadow-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{location.rating}</span>
            </div>
          </div>

          {/* Rasm ustidagi nom va manzil */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-white/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/40">
              {location.categoryLabel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
              {location.title}
            </h3>
            <p className="text-[11px] text-zinc-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{location.address} ({location.district}, Toshkent)</span>
            </p>
          </div>
        </div>

        {/* Karta tanasi */}
        <div className="p-3.5 sm:p-4 space-y-3">
          
          {/* Insayd-Maslahat — pastel emerald */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-l-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 p-2.5 rounded-r-xl text-xs flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                Insayd-maslahat:
              </span>
              <p className="text-xs text-emerald-950 dark:text-emerald-200/90 leading-relaxed font-normal">
                &ldquo;{location.tipText}&rdquo;
              </p>
            </div>
          </div>

          {/* Faoliyat xronikasi va chek */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="text-zinc-600 dark:text-slate-400">
              <span className="text-zinc-400 dark:text-slate-500">O&#x2BB;rtacha chek: </span>
              <span className="font-bold text-zinc-900 dark:text-slate-200">{location.averageCheck}</span>
            </div>
            <div className="text-zinc-500 dark:text-slate-400 text-[11px]">
              Ochiq: {location.workingHours}
            </div>
          </div>

          {/* Taksi chaqirish tugmalari (Yandex Go, Uklon, WB, Fasten, MyTaxi) */}
          <div className="pt-1.5 border-t border-zinc-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
              <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Shu manzilga taksi chaqirish:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TAXI_PROVIDERS.map((taxi) => (
                <a
                  key={taxi.id}
                  href={taxi.getUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTaxiClick(location)}
                  className="flex-1 min-w-[82px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-zinc-50 hover:bg-emerald-50/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-800 dark:text-slate-100 border border-zinc-200/80 hover:border-emerald-300 dark:border-slate-700 text-[11px] font-semibold transition text-center active:scale-95"
                  title={`${taxi.label} orqali taksi chaqirish`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${taxi.dotColor}`} />
                  <span>{taxi.label}</span>
                </a>
              ))}
            </div>

            {/* Xarita va Almashtirish tugmalari */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              {/* Yandex Xarita */}
              <a
                href={getYandexMapsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('light')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 border border-zinc-200/70 dark:border-slate-700 text-[11px] font-medium transition text-center active:scale-95"
                title="Yandex Maps'da ko'rish"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600/80 shrink-0" />
                <span className="truncate">Yandex Xarita</span>
              </a>

              {/* Google Maps */}
              <a
                href={getGoogleMapsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('light')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 border border-zinc-200/70 dark:border-slate-700 text-[11px] font-medium transition text-center active:scale-95"
                title="Google Maps'da ochish"
              >
                <Map className="w-3.5 h-3.5 text-emerald-600/80 shrink-0" />
                <span className="truncate">Google Maps</span>
              </a>

              {/* Joyni almashtirish */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  onSwapStop();
                }}
                title="Ushbu bekatni boshqasiga almashtirish"
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-semibold transition cursor-pointer active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Almashtirish</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
