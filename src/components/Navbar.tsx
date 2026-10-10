'use client';

import React from 'react';
import Image from 'next/image';
import { Moon, Sun, Dices } from 'lucide-react';
import { triggerHaptic } from '../lib/utils';
import { MoodMusicPlayer } from './MoodMusicPlayer';
import { MusicMood } from '../lib/musicMood';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onSurpriseClick: () => void;
  onReset: () => void;
  musicMood?: MusicMood;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  onSurpriseClick,
  onReset,
  musicMood = 'welcome'
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/85 dark:bg-[#0b0f19]/85 border-zinc-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          onClick={() => {
            triggerHaptic('light');
            onReset();
          }}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95 cursor-pointer"
        >
          {/* Logotip: toza shaffof PNG, ramkasiz */}
          <img
            src="/logo.png?v=2"
            alt="Xaritamiz"
            width={44}
            height={44}
            className="w-11 h-11 object-contain shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-brand font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-zinc-950 via-emerald-950 to-emerald-700 dark:from-white dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Xaritamiz
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-[0_1px_3px_rgba(5,150,105,0.08)]">
                TMA
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800/80 dark:text-emerald-400/80 tracking-normal flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse"></span>
              <span>Toshkent shahri bo‘ylab</span>
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Kayfiyat Musiqasi Pleyeri */}
          <MoodMusicPlayer mood={musicMood} />

          {/* Roulette Button — emerald border pill */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onSurpriseClick();
            }}
            title="Tasodifiy sarguzasht marshruti (Roulette)"
            className="flex items-center gap-1.5 text-xs font-medium px-3 sm:px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 transition active:scale-95 shadow-xs cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Taqdirga topshirish</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTheme();
            }}
            title={darkMode ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
            className="w-8.5 h-8.5 rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800/80 text-zinc-600 dark:text-slate-300 border border-zinc-200/60 dark:border-slate-700/60 transition active:scale-95 cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
