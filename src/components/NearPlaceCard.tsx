'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Car, 
  Lightbulb, 
  Star, 
  ExternalLink, 
  Map, 
  Plus, 
  Check, 
  Users, 
  Heart, 
  Home, 
  User, 
  Compass,
  Wallet
} from 'lucide-react';
import { LocationItem, CompanionType } from '../types';
import { TAXI_PROVIDERS, handleTaxiClick, getYandexMapsUrl, getGoogleMapsUrl, triggerHaptic } from '../lib/utils';

interface NearPlaceCardProps {
  location: LocationItem;
  onAddToRoute?: (location: LocationItem) => void;
  isAddedToRoute?: boolean;
}

// Monoxrom zumrad-kulrang: barcha teglar bir xil stil
const COMPANION_CONFIG: Record<CompanionType, { label: string; icon: React.ReactNode }> = {
  couple: { label: 'Juftlik', icon: <Heart className="w-3 h-3 text-emerald-700/70" /> },
  friends: { label: "Do\u02BBstlar", icon: <Users className="w-3 h-3 text-emerald-700/70" /> },
  family: { label: 'Oila', icon: <Home className="w-3 h-3 text-emerald-700/70" /> },
  solo: { label: 'Yakka', icon: <User className="w-3 h-3 text-emerald-700/70" /> }
};

const tagCls = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/60';

export const NearPlaceCard: React.FC<NearPlaceCardProps> = ({
  location,
  onAddToRoute,
  isAddedToRoute = false
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    triggerHaptic('success');
    setJustAdded(true);
    if (onAddToRoute) {
      onAddToRoute(location);
    }
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-zinc-200/70 dark:border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.08)] hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      
      {/* Rasm va Masofa belgisi */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-100 dark:bg-slate-800">
        <img
          src={location.imageUrl}
          alt={location.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Masofa nishoni — Frosted glass, monoxrom */}
        {location.distanceText && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs border border-white/40 dark:border-white/10">
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{location.distanceText} yaqin</span>
          </div>
        )}

        {/* Reyting */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-zinc-800 text-xs font-bold border border-white/30 shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{location.rating}</span>
        </div>

        {/* Rasm ustidagi nom va toifa */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-white/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/40">
            {location.categoryLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
            {location.title}
          </h3>
          <p className="text-[11px] text-zinc-200 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{location.address} ({location.district})</span>
          </p>
        </div>
      </div>

      {/* Tanasi */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2.5">
          {/* Teglar: monoxrom zumrad */}
          <div className="flex flex-wrap items-center gap-1.5">
            {location.companionTags.map(tag => {
              const cfg = COMPANION_CONFIG[tag];
              if (!cfg) return null;
              return (
                <span key={tag} className={tagCls}>
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </span>
              );
            })}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 border border-zinc-200/60 dark:border-slate-700 text-[10px] font-medium ml-auto">
              <Wallet className="w-3 h-3 text-zinc-400" />
              <span>{location.averageCheck}</span>
            </span>
          </div>

          {/* Insayd maslahat — pastel emerald */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-l-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 p-2.5 rounded-r-xl text-xs flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-950 dark:text-emerald-200/90 leading-relaxed font-normal">
              &ldquo;{location.tipText}&rdquo;
            </p>
          </div>
        </div>

        {/* Amallar */}
        <div className="pt-2 border-t border-zinc-100 dark:border-slate-800 space-y-2">
          
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-slate-500">
            <Car className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Taksi chaqirish:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TAXI_PROVIDERS.map((taxi) => (
              <a
                key={taxi.id}
                href={taxi.getUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTaxiClick(location)}
                className="flex-1 min-w-[72px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-zinc-50 hover:bg-emerald-50/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-800 dark:text-slate-100 border border-zinc-200/80 hover:border-emerald-300 dark:border-slate-700 text-[11px] font-semibold transition text-center active:scale-95"
                title={`${taxi.label} chaqirish`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${taxi.dotColor}`} />
                <span>{taxi.label}</span>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Yandex Xarita */}
            <a
              href={getYandexMapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 border border-zinc-200/70 dark:border-slate-700 text-[11px] font-medium transition text-center active:scale-95"
              title="Yandex Xaritada ko'rish"
            >
              <ExternalLink className="w-3 h-3 text-emerald-600/80" />
              <span>Yandex Xarita</span>
            </a>

            {/* Google Maps */}
            <a
              href={getGoogleMapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 border border-zinc-200/70 dark:border-slate-700 text-[11px] font-medium transition text-center active:scale-95"
              title="Google Maps'da ochish"
            >
              <Map className="w-3 h-3 text-emerald-600/80" />
              <span>Google Maps</span>
            </a>
          </div>

          {/* Marshrutga qo'shish */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
              justAdded || isAddedToRoute
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                : 'bg-emerald-50/80 hover:bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50 hover:border-emerald-400'
            }`}
          >
            {justAdded || isAddedToRoute ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Rejaga qo&#x2BB;shildi!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Rejamga qo&#x2BB;shish</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
