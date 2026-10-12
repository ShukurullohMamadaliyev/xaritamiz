'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Dices, Sparkles, MapPin, Mountain, Compass, RotateCw, ArrowRight, ExternalLink } from 'lucide-react';
import { LOCATIONS_DATABASE as LOCATIONS } from '../data/locations';
import { LONG_TRIPS_DATABASE as LONG_TRIPS, LongTripItem } from '../data/longTrips';
import { LocationItem } from '../types';
import { triggerHaptic } from '../lib/utils';
import confetti from 'canvas-confetti';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTashkentPlace: (place: LocationItem) => void;
  onSelectLongTrip: (trip: LongTripItem) => void;
  onSurpriseFullRoute: () => void;
}

const WHEEL_SEGMENTS_TASHKENT = [
  { label: '🌊 Soy & Suv', color: '#059669' },
  { label: '☕ Estetik Kafe', color: '#0d9488' },
  { label: '🌳 Yashil Park', color: '#10b981' },
  { label: '🍽️ Milliy Taom', color: '#047857' },
  { label: '🚶 Sayr Ko‘cha', color: '#14b8a6' },
  { label: '🏛️ Madaniy Maskan', color: '#065f46' },
  { label: '🌿 Sokin Yaylov', color: '#34d399' },
  { label: '✨ Top Manzarali', color: '#0f766e' }
];

const WHEEL_SEGMENTS_REGIONS = [
  { label: '🌊 Sharsharalar', color: '#059669' },
  { label: '⛰️ Baland Tog‘lar', color: '#0284c7' },
  { label: '🏞️ Feruza Ko‘llar', color: '#0d9488' },
  { label: '🏜️ Kanyon & Dara', color: '#d97706' },
  { label: '🌿 Sokin Yaylov', color: '#10b981' },
  { label: '🏛️ Qadimiy Shahar', color: '#7c3aed' },
  { label: '🌲 O‘rmon & Archazor', color: '#047857' },
  { label: '🏕️ Yulduzli Osmon', color: '#0f766e' }
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onSelectTashkentPlace,
  onSelectLongTrip,
  onSurpriseFullRoute
}) => {
  const [mounted, setMounted] = useState(false);
  const [wheelMode, setWheelMode] = useState<'tashkent' | 'regions'>('tashkent');
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonTashkent, setWonTashkent] = useState<LocationItem | null>(null);
  const [wonTrip, setWonTrip] = useState<LongTripItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const segments = wheelMode === 'tashkent' ? WHEEL_SEGMENTS_TASHKENT : WHEEL_SEGMENTS_REGIONS;

  const handleSpin = () => {
    if (spinning) return;
    triggerHaptic('medium');
    setSpinning(true);
    setWonTashkent(null);
    setWonTrip(null);

    const extraSpins = 5 + Math.floor(Math.random() * 4); // 5..8 full turns
    const randomAngle = Math.floor(Math.random() * 360);
    const nextRotation = rotation + extraSpins * 360 + randomAngle;
    setRotation(nextRotation);

    setTimeout(() => {
      setSpinning(false);
      triggerHaptic('success');

      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.55 }
        });
      } catch {
        // ignore
      }

      if (wheelMode === 'tashkent') {
        const randomPlace = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        setWonTashkent(randomPlace);
      } else {
        const randomTrip = LONG_TRIPS[Math.floor(Math.random() * LONG_TRIPS.length)];
        setWonTrip(randomTrip);
      }
    }, 3000);
  };

  const conicGradient = segments
    .map((seg, idx) => {
      const start = idx * 45;
      const end = (idx + 1) * 45;
      return `${seg.color} ${start}deg ${end}deg`;
    })
    .join(', ');

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={() => {
        if (!spinning) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/80 dark:border-slate-800 shadow-2xl overflow-y-auto p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-tight">
                🎡 Omad Barabani (Ruletka)
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                Qayerga borishni bilmayapsizmi? Barabanni aylantiring!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher: Toshkent vs 12 Viloyat */}
        <div className="bg-zinc-100 dark:bg-slate-800 p-1 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              if (spinning) return;
              triggerHaptic('light');
              setWheelMode('tashkent');
              setWonTashkent(null);
              setWonTrip(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              wheelMode === 'tashkent'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-zinc-500 dark:text-slate-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>🏙️ Toshkent ({LOCATIONS.length} joy)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (spinning) return;
              triggerHaptic('light');
              setWheelMode('regions');
              setWonTashkent(null);
              setWonTrip(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              wheelMode === 'regions'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-zinc-500 dark:text-slate-400'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>⛰️ 12 Viloyat (40 joy)</span>
          </button>
        </div>

        {/* Visual Spinning Wheel */}
        <div className="relative flex flex-col items-center justify-center py-2">
          {/* Top Pointer Arrow */}
          <div className="z-20 -mb-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-500 drop-shadow-md" />

          {/* Wheel Circle */}
          <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-emerald-900 via-emerald-600 to-amber-400 shadow-xl">
            <div
              style={{
                background: `conic-gradient(${conicGradient})`,
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 3s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
              }}
              className="w-full h-full rounded-full relative overflow-hidden border-4 border-white/90 dark:border-slate-900"
            >
              {segments.map((seg, idx) => {
                const angle = idx * 45 + 22.5;
                return (
                  <div
                    key={idx}
                    style={{
                      transform: `rotate(${angle}deg)`
                    }}
                    className="absolute inset-0 flex justify-center pt-4 pointer-events-none"
                  >
                    <span className="text-[10px] font-extrabold text-white drop-shadow-xs tracking-tight bg-black/20 px-1.5 py-0.5 rounded-full h-fit">
                      {seg.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Spin Button */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={spinning}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white dark:bg-slate-900 border-4 border-emerald-500 shadow-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition hover:scale-105"
            >
              <RotateCw className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 ${spinning ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {spinning ? 'Aylanmoqda' : 'Aylantir!'}
              </span>
            </button>
          </div>
        </div>

        {/* Winner Result Card: Toshkent */}
        {wonTashkent && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/70 space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <img
                src={wonTashkent.imageUrl}
                alt={wonTashkent.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-emerald-200 dark:border-emerald-800"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold mb-1">
                  🎉 Omadingizga tushdi!
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                  {wonTashkent.title}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{wonTashkent.district} • {wonTashkent.averageCheck}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">
              {wonTashkent.tipText}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('success');
                  onSelectTashkentPlace(wonTashkent);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Marshrutga qo‘shish</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${wonTashkent.lat},${wonTashkent.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-bold text-zinc-800 dark:text-white flex items-center gap-1"
              >
                <span>Xarita</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Winner Result Card: 12 Regions Long Trip */}
        {wonTrip && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/70 space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <img
                src={wonTrip.imageUrl}
                alt={wonTrip.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-emerald-200 dark:border-emerald-800"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold mb-1">
                  🎉 Uzoq safar g‘olibi • {wonTrip.region}
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                  {wonTrip.title}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-slate-300">
                  {wonTrip.travelTimeText} • {wonTrip.totalBudgetText}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">
              {wonTrip.shortDesc}
            </p>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                onSelectLongTrip(wonTrip);
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>To‘liq pasporti, transport va mehmonxonalarni ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom quick action for full surprise route */}
        <div className="pt-2 border-t border-zinc-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-zinc-500 dark:text-slate-400">
            Yoki tayyor 3 bekatli marshrut xohlaysizmi?
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onSurpriseFullRoute();
              onClose();
            }}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Tayyor syurpriz reja</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
