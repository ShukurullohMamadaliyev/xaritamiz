'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  Clock,
  Wallet,
  Calendar,
  Sparkles,
  Car,
  Train,
  Bus,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  Stethoscope,
  Wifi,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Map,
  Plus,
  Check,
  Navigation,
  Users
} from 'lucide-react';
import { LongTripItem, longTripToLocationItem } from '../data/longTrips';
import { LocationItem } from '../types';
import { triggerHaptic } from '../lib/utils';

interface LongTripDetailModalProps {
  trip: LongTripItem | null;
  onClose: () => void;
  onAddToRoute?: (location: LocationItem) => void;
  isAddedToRoute?: boolean;
}

export const LongTripDetailModal: React.FC<LongTripDetailModalProps> = ({
  trip,
  onClose,
  onAddToRoute,
  isAddedToRoute = false
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!trip) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [trip]);

  if (!mounted || !trip) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${trip.lat},${trip.lng}`;
  const yandexMapsUrl = `https://yandex.uz/maps/?pt=${trip.lng},${trip.lat}&z=13&l=map`;

  const getNearbyMapSearchUrl = (query: string) =>
    `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${trip.lat},${trip.lng},12z`;

  const transportModes = [
    {
      key: 'car',
      label: 'Mashina / Taksi',
      icon: <Car className="w-4 h-4" />,
      data: trip.transport.car
    },
    {
      key: 'train',
      label: 'Poyezd (Afrosiyob / Tezyurar)',
      icon: <Train className="w-4 h-4" />,
      data: trip.transport.train
    },
    {
      key: 'bus',
      label: 'Avtobus / Mikroavtobus',
      icon: <Bus className="w-4 h-4" />,
      data: trip.transport.bus
    },
    {
      key: 'plane',
      label: 'Samolyot (Aviareys)',
      icon: <Plane className="w-4 h-4" />,
      data: trip.transport.plane
    }
  ];

  const nearbySections = [
    {
      key: 'hotels',
      title: 'Mehmonxona, Sanatoriy & Kempinglar',
      icon: <Hotel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      data: trip.nearby.hotels,
      mapQuery: `${trip.title} hotel guest house`
    },
    {
      key: 'dining',
      title: 'Oshxonalar, Choyxona & Restoranlar',
      icon: <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      data: trip.nearby.dining,
      mapQuery: `${trip.title} restaurant cafe choyxona`
    },
    {
      key: 'shops',
      title: 'Do‘konlar, Bozor & Suvenirlar',
      icon: <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      data: trip.nearby.shops,
      mapQuery: `${trip.district} market shop`
    },
    {
      key: 'medical',
      title: 'Shifoxona, Klinika & Dorixonalar (Bolnitsa)',
      icon: <Stethoscope className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      data: trip.nearby.medical,
      mapQuery: `${trip.district} hospital pharmacy apteka`
    }
  ];

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
      onClick={() => {
        triggerHaptic('light');
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Yuqori Hero Rasm Qismi */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 bg-zinc-900 overflow-hidden">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />

          {/* Yopish tugmasi */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition cursor-pointer active:scale-95 z-10"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Chap yuqori teglar */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 pr-12">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold border border-emerald-400/30 shadow-sm">
              📍 {trip.region}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-emerald-200 text-[11px] font-semibold border border-white/20">
              {trip.natureLabel}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-300" />
              <span>{trip.crowdLevel}</span>
            </span>
          </div>

          {/* Pastki Sarlavha */}
          <div className="absolute bottom-3.5 left-4 right-4">
            <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 mb-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{trip.district} • Toshkentdan {trip.distanceFromTashkentKm} km</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {trip.title}
            </h2>
          </div>
        </div>

        {/* 2. Scroll bo'ladigan asosiy ma'lumotlar */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5 flex-1">
          
          {/* A. 3 ta Asosiy Ko'rsatkich (Vaqt, Xarajat, Mavsum) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Yetib borish vaqti
                </span>
                <p className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {trip.travelTimeText}
                </p>
                <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                  Masofa: ~{trip.distanceFromTashkentKm} km
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                  Taxminiy xarajat (1 kishi)
                </span>
                <p className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {trip.totalBudgetText}
                </p>
                <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                  Yo‘l + ovqat + kirish
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 block">
                  Eng zo‘r mavsum
                </span>
                <p className="text-xs font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {trip.bestSeason}
                </p>
                <span className="text-[10px] text-zinc-500 dark:text-slate-400">
                  Muhit: {trip.crowdLevel}
                </span>
              </div>
            </div>
          </div>

          {/* B. Joy haqida va Kreativ Insayd-Maslahat */}
          <div className="space-y-2.5 bg-zinc-50/90 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-zinc-200/70 dark:border-slate-800">
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-slate-200 leading-relaxed">
              {trip.shortDesc}
            </p>
            <div className="p-3 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Kreativ Sayohat Tavsiyasi:
                </span>
                <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed mt-0.5">
                  {trip.creativeTip}
                </p>
              </div>
            </div>
          </div>

          {/* C. Transport Pasporti (Mashina, Poyezd, Avtobus, Samolyot) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800 dark:text-slate-100 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Transport Pasporti (Qaysi transport qatnaydi?)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {transportModes.map((mode) => {
                const isAvail = mode.data.available;
                return (
                  <div
                    key={mode.key}
                    className={`p-3 rounded-2xl border transition ${
                      isAvail
                        ? 'bg-white dark:bg-slate-800/80 border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs'
                        : 'bg-zinc-50/70 dark:bg-slate-900/50 border-zinc-200/60 dark:border-slate-800 opacity-85'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isAvail
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              : 'bg-zinc-200/70 dark:bg-slate-800 text-zinc-500'
                          }`}
                        >
                          {mode.icon}
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {mode.label}
                        </span>
                      </div>

                      {isAvail ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Qatnaydi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-slate-800 text-zinc-600 dark:text-slate-400 text-[10px] font-semibold">
                          <XCircle className="w-3 h-3" />
                          <span>Bevosita yo‘q</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-zinc-600 dark:text-slate-300">
                        <span className="text-zinc-400">Vaqti:</span>
                        <span className="font-semibold text-right">{mode.data.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600 dark:text-slate-300">
                        <span className="text-zinc-400">Narxi:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-right">
                          {mode.data.cost}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-slate-400 pt-1 border-t border-zinc-100 dark:border-slate-700/60 leading-snug">
                        {mode.data.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. Yaqin Atrof Infratuzilmasi (Mehmonxona, Oshxona, Do'konlar, Bolnitsa) */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800 dark:text-slate-100 flex items-center gap-1.5">
              <Hotel className="w-4 h-4 text-emerald-600" />
              <span>Yaqin Atrofda Nimalar Bor? (Infratuzilma & Ro‘yxat)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearbySections.map((sec) => {
                const isAvail = sec.data.available;
                return (
                  <div
                    key={sec.key}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-zinc-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-2.5 shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-xl bg-zinc-100 dark:bg-slate-700/70 shrink-0">
                            {sec.icon}
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                            {sec.title}
                          </h4>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAvail
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {isAvail ? 'Bor ✓' : 'Cheklangan !'}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-zinc-700 dark:text-slate-300">
                        {sec.data.statusText}
                      </p>

                      <ul className="space-y-1 pl-1">
                        {sec.data.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] text-zinc-600 dark:text-slate-300 flex items-start gap-1.5 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={getNearbyMapSearchUrl(sec.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerHaptic('light')}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-xl bg-zinc-50 hover:bg-emerald-50 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-zinc-200/70 dark:border-slate-600 transition"
                    >
                      <Map className="w-3 h-3" />
                      <span>Xaritadan yaqinlarini ko‘rish</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Mobil Aloqa va Internet */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200/70 dark:border-slate-700/70 flex items-center gap-2.5 text-xs">
              <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Mobil Aloqa, Internet (4G) & Bankomatlar:
                </span>
                <p className="text-xs font-medium text-zinc-800 dark:text-slate-200">
                  {trip.nearby.connectivity}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Pastki Xarita va Marshrutga Qo'shish Tugmalari */}
        <div className="p-3.5 sm:p-4 bg-zinc-50/90 dark:bg-slate-900/95 border-t border-zinc-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Map className="w-4 h-4 text-emerald-600" />
            <span>Google Xarita</span>
          </a>

          <a
            href={yandexMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-red-500" />
            <span>Yandex Xarita</span>
          </a>

          {onAddToRoute && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                onAddToRoute(longTripToLocationItem(trip));
              }}
              disabled={isAddedToRoute}
              className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                isAddedToRoute
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
              }`}
            >
              {isAddedToRoute ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Marshrutda bor</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Marshrutga qo‘shish</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
