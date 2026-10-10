'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Wallet,
  Car,
  Train,
  Bus,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  Stethoscope,
  ChevronRight,
  Plus,
  Check,
  Users
} from 'lucide-react';
import { LongTripItem, longTripToLocationItem } from '../data/longTrips';
import { LocationItem } from '../types';
import { triggerHaptic } from '../lib/utils';

interface LongTripCardProps {
  trip: LongTripItem;
  index: number;
  onSelectTrip: (trip: LongTripItem) => void;
  onAddToRoute?: (location: LocationItem) => void;
  isAddedToRoute?: boolean;
}

export const LongTripCard: React.FC<LongTripCardProps> = ({
  trip,
  index,
  onSelectTrip,
  onAddToRoute,
  isAddedToRoute = false
}) => {
  return (
    <div
      onClick={() => {
        triggerHaptic('medium');
        onSelectTrip(trip);
      }}
      className="group bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm rounded-2xl border border-zinc-200/80 dark:border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(5,150,105,0.1)] hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* 1. Rasm qismi */}
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-slate-800">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />

          {/* Tartib raqami va Hudud */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-sm">
              {index + 1}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
              {trip.region}
            </span>
          </div>

          {/* Gavjumlik darajasi */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-bold border border-white/40 flex items-center gap-1 shadow-2xs">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>{trip.crowdLevel}</span>
            </span>
          </div>

          {/* Rasm ustidagi sarlavha va tabiat turi */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/95 backdrop-blur-md px-2 py-0.5 rounded-full mb-1">
              {trip.natureLabel}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug line-clamp-2">
              {trip.title}
            </h3>
            <p className="text-[11px] text-zinc-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">
                {trip.district} • Toshkentdan {trip.distanceFromTashkentKm} km
              </span>
            </p>
          </div>
        </div>

        {/* 2. Karta tanasi */}
        <div className="p-3.5 space-y-3">
          {/* Vaqt va Xarajat qatori */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                <Clock className="w-3 h-3 shrink-0" />
                <span>Necha soatda:</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-900 dark:text-white mt-0.5 line-clamp-1">
                {trip.travelTimeText}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                <Wallet className="w-3 h-3 shrink-0" />
                <span>O‘rtacha xarajat:</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-900 dark:text-white mt-0.5 line-clamp-1">
                {trip.totalBudgetText}
              </p>
            </div>
          </div>

          {/* Qisqa tavsif */}
          <p className="text-xs text-zinc-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {trip.shortDesc}
          </p>

          {/* Qatnaydigan transportlar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Qatnaydigan transportlar:
            </span>
            <div className="grid grid-cols-4 gap-1">
              <div
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                  trip.transport.car.available
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50'
                    : 'bg-zinc-100 dark:bg-slate-800/50 text-zinc-400 border-zinc-200/50 dark:border-slate-800 line-through'
                }`}
                title={trip.transport.car.details}
              >
                <Car className="w-3 h-3 shrink-0" />
                <span className="truncate">Mashina</span>
              </div>

              <div
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                  trip.transport.train.available
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50'
                    : 'bg-zinc-100/70 dark:bg-slate-800/40 text-zinc-400 dark:text-slate-500 border-zinc-200/50 dark:border-slate-800'
                }`}
                title={trip.transport.train.details}
              >
                <Train className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {trip.transport.train.available ? 'Poyezd ✓' : 'Poyezd ✕'}
                </span>
              </div>

              <div
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                  trip.transport.bus.available
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50'
                    : 'bg-zinc-100/70 dark:bg-slate-800/40 text-zinc-400 dark:text-slate-500 border-zinc-200/50 dark:border-slate-800'
                }`}
                title={trip.transport.bus.details}
              >
                <Bus className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {trip.transport.bus.available ? 'Avtobus ✓' : 'Avtobus ✕'}
                </span>
              </div>

              <div
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                  trip.transport.plane.available
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50'
                    : 'bg-zinc-100/70 dark:bg-slate-800/40 text-zinc-400 dark:text-slate-500 border-zinc-200/50 dark:border-slate-800'
                }`}
                title={trip.transport.plane.details}
              >
                <Plane className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {trip.transport.plane.available ? 'Samolyot ✓' : 'Uchoq ✕'}
                </span>
              </div>
            </div>
          </div>

          {/* Yaqin atrofdagi infratuzilma (Mehmonxona, Oshxona, Do'kon, Bolnitsa) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-100 dark:border-slate-800/80 text-[10px]">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                trip.nearby.hotels.available
                  ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <Hotel className="w-3 h-3 text-emerald-600" />
              <span>Mehmonxona: {trip.nearby.hotels.available ? 'Bor' : 'Kemping'}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                trip.nearby.dining.available
                  ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <Utensils className="w-3 h-3 text-amber-600" />
              <span>Oshxona: {trip.nearby.dining.available ? 'Bor' : 'Piknik'}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                trip.nearby.shops.available
                  ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <ShoppingBag className="w-3 h-3 text-blue-600" />
              <span>Do‘kon: {trip.nearby.shops.available ? 'Bor' : 'Yo‘q'}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                trip.nearby.medical.available
                  ? 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <Stethoscope className="w-3 h-3 text-rose-600" />
              <span>Bolnitsa: {trip.nearby.medical.available ? 'Bor' : 'Uzoqroq'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pastki tugmalar */}
      <div className="px-3.5 pb-3.5 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('medium');
            onSelectTrip(trip);
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
        >
          <span>Batafsil pasportni ko‘rish</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {onAddToRoute && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('success');
              onAddToRoute(longTripToLocationItem(trip));
            }}
            disabled={isAddedToRoute}
            title="Marshrutga qo‘shish"
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition cursor-pointer active:scale-95 ${
              isAddedToRoute
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-zinc-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 border border-zinc-200/70 dark:border-slate-700'
            }`}
          >
            {isAddedToRoute ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
