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
  Users,
  Calculator,
  Camera,
  Backpack,
  Send,
  Trophy
} from 'lucide-react';
import { LongTripItem, longTripToLocationItem } from '../data/longTrips';
import { LocationItem } from '../types';
import { triggerHaptic } from '../lib/utils';
import { LiveWeatherAdvisor } from './LiveWeatherAdvisor';
import {
  ChecklistItem,
  getPhotoSpotsForTrip,
  getSmartChecklistForTrip,
  isPlaceVisited,
  saveChecklistForTrip,
  toggleVisitedId
} from '../lib/travelPassport';

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

  // Split Bill Calculator state
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [splitTransport, setSplitTransport] = useState<'shared_car' | 'public'>('shared_car');
  const [withHotel, setWithHotel] = useState<boolean>(false);

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  // Visited Passport state
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!trip) return;
    setChecklist(getSmartChecklistForTrip(trip));
    setVisited(isPlaceVisited(trip.id));

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

  // Split Bill calculation
  // Shared car round-trip fuel + road cost based on distance (~1200 so'm per km roundtrip)
  const roundTripKm = trip.distanceFromTashkentKm * 2;
  const totalCarFuelCost = Math.max(120000, Math.round((roundTripKm * 1300) / 10000) * 10000);
  const perPersonPublicTransport = Math.round((trip.estimatedPrice * 0.45) / 10000) * 10000;
  const perPersonFoodAndEntry = Math.round((trip.estimatedPrice * 0.55) / 10000) * 10000;
  const perPersonHotelNight = withHotel ? 200000 : 0;

  const totalGroupCost =
    splitTransport === 'shared_car'
      ? totalCarFuelCost + (perPersonFoodAndEntry + perPersonHotelNight) * peopleCount
      : (perPersonPublicTransport + perPersonFoodAndEntry + perPersonHotelNight) * peopleCount;

  const perPersonSplitCost = Math.round(totalGroupCost / peopleCount / 5000) * 5000;

  const handleShareSplitToTelegram = () => {
    triggerHaptic('success');
    const text = [
      `⛰️ *${trip.title}* (${trip.region}) — Do‘stlar bilan safar hisob-kitobi!`,
      `👥 Ishtirokchilar: *${peopleCount} kishi*`,
      `🚗 Transport: *${splitTransport === 'shared_car' ? 'Mashinada (benzin o‘rtada)' : 'Poyezd / Avtobus / Taksi'}*`,
      `🏨 Yotoq: *${withHotel ? '1 kecha tunab qolish bilan' : '1 kunlik (tunashsiz)'}*`,
      `💰 Jami o‘rtada: *${totalGroupCost.toLocaleString('uz-UZ')} so‘m*`,
      `👉 *Kishi boshiga:* *${perPersonSplitCost.toLocaleString('uz-UZ')} so‘mdan!*`,
      `📍 Masofa: Toshkentdan ~${trip.distanceFromTashkentKm} km (${trip.travelTimeText})`
    ].join('\n');

    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleToggleChecklistItem = (id: string) => {
    triggerHaptic('light');
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    saveChecklistForTrip(trip.id, updated);
  };

  const handleAddCustomCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCheckItem.trim();
    if (!trimmed) return;
    triggerHaptic('light');
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      category: 'comfort',
      checked: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    saveChecklistForTrip(trip.id, updated);
    setNewCheckItem('');
  };

  const checkedCount = checklist.filter((i) => i.checked).length;
  const checklistPct = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0;
  const photoSpots = getPhotoSpotsForTrip(trip);

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
            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                toggleVisitedId(trip.id);
                setVisited((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-bold border flex items-center gap-1 transition cursor-pointer ${
                visited
                  ? 'bg-amber-500 text-white border-amber-300 shadow-sm'
                  : 'bg-black/50 text-white border-white/25 hover:bg-black/70'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>{visited ? 'Pasportda: Bordim ✓' : 'Bordim deb belgilash'}</span>
            </button>
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

          {/* A2. Jonli Ob-havo va Oltin Soat (Golden Hour) Maslahatchisi */}
          <LiveWeatherAdvisor
            lat={trip.lat}
            lng={trip.lng}
            locationName={trip.title}
          />

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

          {/* B2. Do'stlar bilan Xarajat Kalkulyatori (Split Bill) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>🧮 Do‘stlar bilan Xarajat Kalkulyatori (O‘rtada)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Split Bill
              </span>
            </div>

            {/* Odamlarni tanlash */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 dark:text-slate-300 font-medium">Necha kishi ketasizlar?</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{peopleCount} kishi</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setPeopleCount(num);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      peopleCount === num
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-zinc-700 dark:text-slate-300 border border-zinc-200 dark:border-slate-700'
                    }`}
                  >
                    {num} {num === 1 ? 'kishi' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport va Tunash tanlovi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex bg-zinc-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSplitTransport('shared_car')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    splitTransport === 'shared_car'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-zinc-500'
                  }`}
                >
                  🚗 Mashina (benzin o‘rtada)
                </button>
                <button
                  type="button"
                  onClick={() => setSplitTransport('public')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    splitTransport === 'public'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-zinc-500'
                  }`}
                >
                  🚆 Poyezd / Taksi
                </button>
              </div>

              <div className="flex bg-zinc-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setWithHotel(false)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    !withHotel
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-zinc-500'
                  }`}
                >
                  ☀️ 1 kunlik borib-kelish
                </button>
                <button
                  type="button"
                  onClick={() => setWithHotel(true)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    withHotel
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'text-zinc-500'
                  }`}
                >
                  🌙 Tunab qolish (+dach/otel)
                </button>
              </div>
            </div>

            {/* Natija va Do'stlarga ulashish */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Kishi boshiga tushadigan ulush:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">
                    {perPersonSplitCost.toLocaleString('uz-UZ')} so‘m
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    (Jami {peopleCount} kishiga: {totalGroupCost.toLocaleString('uz-UZ')} so‘m)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShareSplitToTelegram}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Guruhga tashlash</span>
              </button>
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

          {/* C2. 📸 Eng Chiroyli Kadr Nuqtalari (Photo Spots) */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800 dark:text-slate-100 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>📸 Rasmga Tushish Burchaklari (Photo Spots)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {photoSpots.map((spot, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                      {idx + 1}. {spot.title}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    ⏰ Eng zo‘r vaqt: {spot.bestTime}
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-slate-300 leading-snug">
                    💡 <b>Kadr siri:</b> {spot.angleTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* C3. 🎒 Interaktiv Yo'l Xaltasi (Checklist) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Backpack className="w-4 h-4 text-emerald-600" />
                  <span>🎒 Yo‘l Xaltasi (Nimalar olish kerak?)</span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                  Safarga chiqishdan oldin tayyor narsalarni belgilab chiqing
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                {checkedCount}/{checklist.length} ({checklistPct}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-slate-700 overflow-hidden">
              <div
                style={{ width: `${checklistPct}%` }}
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              />
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChecklistItem(item.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-zinc-500 dark:text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border-zinc-200/80 dark:border-slate-700 text-zinc-800 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-zinc-300 dark:border-slate-600'
                    }`}
                  >
                    {item.checked && <Check className="w-3 h-3" />}
                  </span>
                  <span className="leading-snug">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Add custom checklist item */}
            <form onSubmit={handleAddCustomCheckItem} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="Yana nima olasiz? (masalan: Kabob sixlari...)"
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                + Qo‘shish
              </button>
            </form>
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
