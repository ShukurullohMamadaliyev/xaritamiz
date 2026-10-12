'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, CheckCircle2, MapPin, Mountain, Compass, Sparkles, Check } from 'lucide-react';
import { getPassportStats, toggleVisitedId, PassportStats } from '../lib/travelPassport';
import { LOCATIONS_DATABASE as LOCATIONS } from '../data/locations';
import { LONG_TRIPS_DATABASE as LONG_TRIPS } from '../data/longTrips';
import { triggerHaptic } from '../lib/utils';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<PassportStats | null>(null);
  const [tab, setTab] = useState<'badges' | 'tashkent' | 'regions'>('badges');

  const refresh = () => {
    setStats(getPassportStats());
  };

  useEffect(() => {
    setMounted(true);
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener('xaritamiz-passport-updated', handleUpdate);
    return () => window.removeEventListener('xaritamiz-passport-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen]);

  if (!mounted || !isOpen || !stats) return null;

  const visitedSet = new Set(stats.visitedIds);
  const totalVisited = stats.tashkentVisitedCount + stats.longTripsVisitedCount;

  const handleToggle = (id: string) => {
    triggerHaptic('light');
    toggleVisitedId(id);
    refresh();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-700 text-white p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {stats.rankEmoji}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Trophy className="w-3 h-3 text-amber-300" />
                <span>Sayohat Pasporti</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black leading-tight">
                {stats.rankTitle}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Keyingi daraja: <b>{stats.nextRankTitle}</b>
              </p>
            </div>
          </div>

          {/* 3 Summary Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
              <span className="text-base sm:text-lg font-black block">
                {stats.tashkentVisitedCount} <span className="text-xs font-normal opacity-75">/ {stats.tashkentTotalCount}</span>
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold">Toshkent joylari</span>
            </div>
            <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
              <span className="text-base sm:text-lg font-black block">
                {stats.longTripsVisitedCount} <span className="text-xs font-normal opacity-75">/ {stats.longTripsTotalCount}</span>
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold">Uzoq safarlar</span>
            </div>
            <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
              <span className="text-base sm:text-lg font-black block">
                {stats.regionsVisitedCount} <span className="text-xs font-normal opacity-75">/ 13</span>
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold">Viloyat & Hudud</span>
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-4 pt-3 bg-zinc-50 dark:bg-slate-900 border-b border-zinc-200/70 dark:border-slate-800 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setTab('badges')}
            className={`flex-1 py-2 px-2.5 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer ${
              tab === 'badges'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/70'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-slate-400'
            }`}
          >
            🏆 Unvonlar ({stats.badges.filter((b) => b.unlocked).length}/{stats.badges.length})
          </button>

          <button
            type="button"
            onClick={() => setTab('regions')}
            className={`flex-1 py-2 px-2.5 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer ${
              tab === 'regions'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/70'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-slate-400'
            }`}
          >
            ⛰️ 12 Viloyat ({stats.longTripsVisitedCount})
          </button>

          <button
            type="button"
            onClick={() => setTab('tashkent')}
            className={`flex-1 py-2 px-2.5 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer ${
              tab === 'tashkent'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/70'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-slate-400'
            }`}
          >
            🏙️ Toshkent ({stats.tashkentVisitedCount})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {tab === 'badges' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                Borgan joylaringizni kartochkalar ustidagi <b>&ldquo;Bordim ✓&rdquo;</b> tugmasi yoki shu oynadagi ro‘yxat orqali belgilab boring va maxsus unvonlarni oching!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stats.badges.map((badge) => {
                  const pct = Math.min(100, Math.round((badge.current / badge.target) * 100));
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border transition ${
                        badge.unlocked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs'
                          : 'bg-zinc-50/70 dark:bg-slate-800/40 border-zinc-200/70 dark:border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center gap-1">
                              <span>{badge.title}</span>
                            </h4>
                            <p className="text-[11px] text-zinc-500 dark:text-slate-400 leading-snug mt-0.5">
                              {badge.subtitle}
                            </p>
                          </div>
                        </div>
                        {badge.unlocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                            Ochildi ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-400 shrink-0">
                            {badge.current}/{badge.target}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 w-full h-1.5 rounded-full bg-zinc-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all ${
                            badge.unlocked ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'regions' && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 dark:text-slate-400 mb-2">
                12 viloyat bo‘ylab borgan maskanlaringizni belgilang:
              </p>
              {LONG_TRIPS.map((trip) => {
                const visited = visitedSet.has(trip.id);
                return (
                  <div
                    key={trip.id}
                    onClick={() => handleToggle(trip.id)}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                      visited
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/60 border-zinc-200/70 dark:border-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {trip.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 dark:text-slate-400 block">
                          📍 {trip.region} • {trip.district}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 transition ${
                        visited
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 dark:bg-slate-700 text-zinc-600 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{visited ? 'Bordim ✓' : 'Belgilash'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'tashkent' && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 dark:text-slate-400 mb-2">
                Toshkent shahrida borgan sevimli maskanlaringizni belgilang:
              </p>
              {LOCATIONS.map((loc) => {
                const visited = visitedSet.has(loc.id);
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleToggle(loc.id)}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                      visited
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/60 border-zinc-200/70 dark:border-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={loc.imageUrl}
                        alt={loc.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {loc.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 dark:text-slate-400 block">
                          📍 {loc.district} • {loc.averageCheck}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 transition ${
                        visited
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 dark:bg-slate-700 text-zinc-600 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{visited ? 'Bordim ✓' : 'Belgilash'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-50 dark:bg-slate-900 border-t border-zinc-200/70 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-zinc-500 dark:text-slate-400">
            Jami muhrlangan joylar: <b className="text-emerald-700 dark:text-emerald-400">{totalVisited} ta</b>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
