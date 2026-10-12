'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Utensils,
  MapPin,
  Clock,
  Wallet,
  Sparkles,
  ExternalLink,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { GASTRO_COMPASS_DATABASE, GastroDishItem } from '../data/gastroCompas';
import { triggerHaptic } from '../lib/utils';

interface GastroCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGION_FILTERS = [
  { id: 'all', label: '🇺🇿 Barchasi' },
  { id: 'tashkent_city', label: '🏙 Toshkent sh.' },
  { id: 'tashkent_region', label: '⛰️ Bo‘stonliq & So‘qoq' },
  { id: 'samarkand', label: '🕌 Samarqand' },
  { id: 'jizzakh', label: '🌲 Jizzax & Zomin' },
  { id: 'bukhara', label: '🏛 Buxoro' },
  { id: 'fergana', label: '🌿 Vodiy (Farg‘ona/Andijon/Namangan)' },
  { id: 'qashqadaryo', label: '🥩 Qashqadaryo & Boysun' },
  { id: 'khorezm', label: '🏰 Xorazm (Xiva)' },
  { id: 'navoiy', label: '🐟 Aydarko‘l & Sirdaryo' }
];

export const GastroCompassModal: React.FC<GastroCompassModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const filteredDishes: GastroDishItem[] =
    selectedRegion === 'all'
      ? GASTRO_COMPASS_DATABASE
      : GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === selectedRegion);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-amber-200/80 dark:border-amber-800/50 shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  🍱 Gastro-Kompas: Qayerda Nima Yeyish Kerak?
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                Toshkent va 12 viloyatning eng mashhur shohona taomlari, porsiya narxlari va sirlari
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hudud filtrlari */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Hududni tanlang:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGION_FILTERS.map((rf) => {
              const active = selectedRegion === rf.id;
              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedRegion(rf.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer active:scale-95 ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25'
                      : 'bg-zinc-100 hover:bg-amber-50 text-zinc-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {rf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Taomlar ro'yxati */}
        <div className="space-y-3.5">
          {filteredDishes.map((dish) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${dish.famousSpots[0]} ${dish.regionName}`
            )}`;
            const yandexMapsUrl = `https://yandex.uz/maps/?pt=${dish.lng},${dish.lat}&z=14&l=map`;

            return (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-slate-800/90 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-2xl shrink-0">
                      {dish.emoji}
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        <MapPin className="w-3 h-3" />
                        {dish.regionName}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-snug">
                        {dish.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-xs">
                      <Wallet className="w-3.5 h-3.5" />
                      {dish.priceRange}
                    </span>
                    <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-zinc-500 dark:text-slate-400 mt-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{dish.bestTime}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">
                  {dish.description}
                </p>

                {/* Mashhur tayyorlanadigan maskanlar */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    📍 Qayerda eng zo‘r tayyorlanadi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.famousSpots.map((spot, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-zinc-200/80 dark:border-slate-700 text-[11px] font-bold text-zinc-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        {spot}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mahalliy sirli maslahat */}
                <div className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed">
                    <b>Mahalliy sir:</b> {dish.secretTip}
                  </p>
                </div>

                {/* Xaritada ochish tugmalari */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {dish.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerHaptic('light')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition shadow-xs"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Google Xarita</span>
                    </a>
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerHaptic('light')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 text-[11px] font-bold transition"
                    >
                      <span>Yandex</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};
