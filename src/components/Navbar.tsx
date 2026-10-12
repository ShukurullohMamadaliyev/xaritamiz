'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Dices, Trophy, ShieldAlert, Smartphone } from 'lucide-react';
import { triggerHaptic } from '../lib/utils';
import { MoodMusicPlayer } from './MoodMusicPlayer';
import { MusicMood } from '../lib/musicMood';
import { getVisitedIds } from '../lib/travelPassport';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onSurpriseClick: () => void;
  onOpenPassport?: () => void;
  onOpenSos?: () => void;
  onOpenInstallApp?: () => void;
  onReset: () => void;
  musicMood?: MusicMood;
  moodRevision?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  onSurpriseClick,
  onOpenPassport,
  onOpenSos,
  onOpenInstallApp,
  onReset,
  musicMood = 'welcome',
  moodRevision = 0
}) => {
  const [visitedCount, setVisitedCount] = useState(0);

  useEffect(() => {
    const sync = () => setVisitedCount(getVisitedIds().length);
    sync();
    window.addEventListener('xaritamiz-passport-updated', sync);
    return () => window.removeEventListener('xaritamiz-passport-updated', sync);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden backdrop-blur-md border-b bg-white/85 dark:bg-[#0b0f19]/85 border-zinc-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-3xl w-full mx-auto px-2.5 sm:px-4 h-15 sm:h-16 flex items-center justify-between gap-1.5">
        {/* Brand Logo & Name */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onReset();
          }}
          className="flex items-center gap-1.5 sm:gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer shrink-0 min-w-0"
        >
          <img
            src="/logo.png?v=3"
            alt="Xaritamiz"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-brand font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-zinc-950 via-emerald-950 to-emerald-700 dark:from-white dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent truncate">
                Xaritamiz
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                TMA
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] font-semibold text-emerald-800/80 dark:text-emerald-400/80 tracking-normal flex items-center gap-1 leading-none mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Toshkent & 12 vil.</span>
            </p>
          </div>
        </button>

        {/* Action Controls — Mobil ekranda sig'adigan ixcham o'lcham */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 📲 Telefonga o'rnatish tugmasi */}
          {onOpenInstallApp && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onOpenInstallApp();
              }}
              title="Xaritamiz ilovasini telefon ekraniga o'rnatish (iPhone & Android)"
              className="flex items-center gap-1 text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-1.5 rounded-full bg-emerald-600/15 hover:bg-emerald-600/25 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 border border-emerald-500/50 dark:border-emerald-400/50 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden xs:inline sm:inline">Telefonga o‘rnatish</span>
              <span className="xs:hidden sm:hidden">O‘rnatish</span>
            </button>
          )}

          {/* Kayfiyat Musiqasi Pleyeri */}
          <MoodMusicPlayer mood={musicMood} moodRevision={moodRevision} />

          {/* SOS Button */}
          {onOpenSos && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onOpenSos();
              }}
              title="Safar Xavfsizligi va SOS (1050)"
              className="w-7.5 h-7.5 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-full flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 transition active:scale-95 cursor-pointer shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline text-[11px] font-extrabold">SOS</span>
            </button>
          )}

          {/* Sayohat Pasporti Button */}
          {onOpenPassport && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenPassport();
              }}
              title="Sayohat Pasporti va Unvonlar"
              className="w-7.5 h-7.5 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-full flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 transition active:scale-95 cursor-pointer relative shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline text-xs font-semibold">Pasport</span>
              {visitedCount > 0 && (
                <span className=" -top-1 -right-1 sm:static px-1 rounded-full bg-amber-500 text-white text-[9px] font-extrabold leading-tight">
                  {visitedCount}
                </span>
              )}
            </button>
          )}

          {/* Spin Wheel / Roulette Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onSurpriseClick();
            }}
            title="Omad Barabani"
            className="w-7.5 h-7.5 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-full flex items-center justify-center gap-1 bg-white hover:bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 transition active:scale-95 cursor-pointer shrink-0"
          >
            <Dices className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline text-xs font-semibold">Baraban</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTheme();
            }}
            title={darkMode ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-300 border border-zinc-200/60 dark:border-slate-700/60 transition active:scale-95 cursor-pointer shrink-0"
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
