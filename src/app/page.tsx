'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { QuizFilter } from '../components/QuizFilter';
import { RouteResult } from '../components/RouteResult';
import { NearMeRadar } from '../components/NearMeRadar';
import { AiRouteFinder } from '../components/AiRouteFinder';
import { 
  RoutePlan, 
  FilterState, 
  CompanionType, 
  VibeType, 
  BudgetTier, 
  DurationOption, 
  LocationItem, 
  RouteStop 
} from '../types';
import { generateRoute, generateSurpriseRoute, swapStopInRoute } from '../lib/routeGenerator';
import { triggerHaptic } from '../lib/utils';
import { detectMoodFromCategory, detectMoodFromFilter, detectMoodFromRoute, MusicMood } from '../lib/musicMood';
import { Sparkles, Compass, MapPin, ArrowRight, Trash2, Bot, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'generator' | 'radar'>('ai');
  const [currentRoute, setCurrentRoute] = useState<RoutePlan | null>(null);
  const [musicMood, setMusicMood] = useState<MusicMood>('welcome');
  
  // Near Me orqali foydalanuvchi qo'shgan joylar
  const [savedStops, setSavedStops] = useState<LocationItem[]>([]);

  const [lastFilters, setLastFilters] = useState<FilterState>({
    companion: 'couple',
    vibe: 'aesthetic_photo',
    budget: 'medium',
    duration: 'evening_short'
  });

  // Theme initial sync (default Light Mode)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Telegram WebApp integratsiyasi (agar Telegram ichida ochilsa)
    if (typeof window !== 'undefined') {
      // @ts-expect-error Telegram WebApp obyekti mavjud bo'lishi mumkin
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }

      // URL query params orqali tekshirish
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'radar') {
        setActiveTab('radar');
      } else if (tabParam === 'generator') {
        setActiveTab('generator');
      }

      const c = params.get('c') as CompanionType | null;
      const v = params.get('v') as VibeType | null;
      const b = params.get('b') as BudgetTier | null;
      const d = params.get('d') as DurationOption | null;

      if (c || v || b || d) {
        const filters: FilterState = {
          companion: c || 'couple',
          vibe: v || 'aesthetic_photo',
          budget: b || 'medium',
          duration: d || 'evening_short'
        };
        setLastFilters(filters);
        const autoRoute = generateRoute(filters);
        setCurrentRoute(autoRoute);
        setMusicMood(detectMoodFromRoute(autoRoute));
      }
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const handleGenerate = (filters: FilterState) => {
    setLastFilters(filters);
    const newRoute = generateRoute(filters);
    setCurrentRoute(newRoute);
    setMusicMood(
      filters.customQuery
        ? detectMoodFromRoute(newRoute, filters.customQuery)
        : detectMoodFromFilter(filters.companion, filters.vibe)
    );

    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      if (filters.companion) url.searchParams.set('c', filters.companion);
      if (filters.vibe) url.searchParams.set('v', filters.vibe);
      if (filters.budget) url.searchParams.set('b', filters.budget);
      if (filters.duration) url.searchParams.set('d', filters.duration);
      window.history.replaceState({}, '', url.toString());
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurprise = () => {
    const surprise = generateSurpriseRoute();
    setCurrentRoute(surprise);
    setMusicMood(detectMoodFromRoute(surprise));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapStop = (index: number) => {
    if (!currentRoute) return;
    const updated = swapStopInRoute(currentRoute, index);
    setCurrentRoute(updated);
  };

  const handleReset = () => {
    setCurrentRoute(null);
    setSavedStops([]);
    setMusicMood('welcome');
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Near Me dan joy qo'shish / olib tashlash
  const handleToggleSavedStop = (location: LocationItem) => {
    if (location.companionTags.includes('couple') && location.vibeTags.includes('aesthetic_photo')) {
      setMusicMood('romantic');
    } else {
      setMusicMood(detectMoodFromCategory(location.category));
    }
    setSavedStops(prev => {
      const exists = prev.some(item => item.id === location.id);
      if (exists) {
        return prev.filter(item => item.id !== location.id);
      }
      return [...prev, location];
    });
  };

  // Foydalanuvchi o'zi qo'shgan joylardan marshrut yaratish
  const handleGenerateFromSavedStops = () => {
    if (savedStops.length === 0) return;
    triggerHaptic('success');

    const totalCostNumber = savedStops.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
    const formattedTotalCost = `${(Math.round(totalCostNumber / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`;

    const stops: RouteStop[] = savedStops.map((loc, idx) => ({
      stopOrder: idx + 1,
      timeSlot: `${18 + Math.floor(idx * 1.5)}:${idx % 2 === 0 ? '00' : '30'}`,
      location: loc,
      activityNote: loc.tipText,
      customVoteScore: { yes: 1, no: 0 }
    }));

    const customPlan: RoutePlan = {
      id: `custom-${Math.random().toString(36).substring(2, 9)}`,
      title: 'Mening Tanlangan Marshrutim',
      subtitle: `${savedStops.length} ta yaqin atrofdagi saralangan bekat`,
      vibe: 'urban_lively',
      companion: 'friends',
      budgetTier: 'medium',
      duration: savedStops.length <= 2 ? 'evening_short' : 'half_day',
      totalEstimatedCost: formattedTotalCost,
      numericTotalCost: totalCostNumber,
      totalDurationHours: `${savedStops.length * 1.5} soat`,
      stops,
      highlightTag: 'Maxsus reja',
      createdAt: '2026-10-09T18:00:00Z'
    };

    setCurrentRoute(customPlan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4FBF7] via-[#F9FBFA] to-[#F3F6F4] dark:bg-none dark:bg-[#0b0f19] text-zinc-900 dark:text-slate-100 transition-colors relative">
      
      {/* Dekorativ: Orqa fon yumshoq zumrad nuri */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-100/40 dark:bg-emerald-900/10 blur-[120px] -z-10" />

      
      {/* Sarlavha / Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onSurpriseClick={handleSurprise}
        onReset={handleReset}
        musicMood={musicMood}
      />

      {/* Asosiy Kontent */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-4 sm:pt-6">
        
        {/* Agar hozir marshrut natijasi ko'rsatilayotgan bo'lsa */}
        {currentRoute ? (
          <RouteResult
            route={currentRoute}
            onBackToFilter={() => setCurrentRoute(null)}
            onRegenerate={() => handleGenerate(lastFilters)}
            onSwapStop={handleSwapStop}
          />
        ) : (
          <div className="space-y-6">
            
            {/* 3 Rejimli Segmented Control Tab — Premium Zinc Island */}
            <div className="bg-zinc-200/60 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center border border-zinc-200/50 dark:border-slate-700/60 backdrop-blur-md max-w-lg mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              
              {/* Tab 1: Erkin Istak */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('ai');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? 'bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 shadow-sm border border-zinc-100/80 dark:border-white/[0.06]'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'ai' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                <span>Erkin Istak ✨</span>
              </button>

              {/* Tab 2: 4 Bosqichli Tezkor Filtr */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('generator');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'generator'
                    ? 'bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 shadow-sm border border-zinc-100/80 dark:border-white/[0.06]'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
                }`}
              >
                <SlidersHorizontal className={`w-3.5 h-3.5 ${activeTab === 'generator' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                <span>Tezkor Filtr</span>
              </button>

              {/* Tab 3: Menga Yaqin Joylar */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('radar');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'radar'
                    ? 'bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 shadow-sm border border-zinc-100/80 dark:border-white/[0.06]'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${activeTab === 'radar' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                <span>Yaqin Joylar</span>
              </button>

            </div>


            {/* Faol rejim kontenti */}
            {activeTab === 'ai' ? (
              <AiRouteFinder
                onMoodChange={setMusicMood}
                onRouteGenerated={(route) => {
                  setCurrentRoute(route);
                  setMusicMood(detectMoodFromRoute(route));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : activeTab === 'generator' ? (
              <QuizFilter
                onGenerate={handleGenerate}
                onSurprise={handleSurprise}
                initialFilters={lastFilters}
                onMoodChange={setMusicMood}
              />
            ) : (
              <NearMeRadar
                onAddToCustomRoute={handleToggleSavedStop}
                savedStops={savedStops}
                onMoodChange={setMusicMood}
              />
            )}

          </div>
        )}

      </main>

      {/* Near Me rejimida tanlangan bekatlar uchun Floating Action Banner */}
      {!currentRoute && activeTab === 'radar' && savedStops.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 text-[#111827] dark:text-white backdrop-blur-md rounded-2xl p-3 px-4 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {savedStops.length}
              </span>
              <div>
                <span className="text-xs font-bold block text-gray-900 dark:text-white">Tanlangan bekatlar</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate block max-w-[170px] sm:max-w-xs">
                  {savedStops.map(s => s.title).join(', ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSavedStops([])}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                title="Tozalash"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleGenerateFromSavedStops}
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>Reja tuzish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Futer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-500 mt-auto">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 "Xaritamiz" — Toshkent shahar dam olish marshrutlari</span>
          <span className="text-[11px] text-slate-400">Telegram WebApp (TMA) hamkorligida</span>
        </div>
      </footer>

    </div>
  );
}
