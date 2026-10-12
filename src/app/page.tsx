'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { QuizFilter } from '../components/QuizFilter';
import { RouteResult } from '../components/RouteResult';
import { NearMeRadar } from '../components/NearMeRadar';
import { AiRouteFinder } from '../components/AiRouteFinder';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { PassportModal } from '../components/PassportModal';
import { SafetySosModal } from '../components/SafetySosModal';
import { LiveWeatherAdvisor } from '../components/LiveWeatherAdvisor';
import { LongTripDetailModal } from '../components/LongTripDetailModal';
import { GastroCompassModal } from '../components/GastroCompassModal';
import { CommunityPlacesModal, ADMIN_TELEGRAM_ID } from '../components/CommunityPlacesModal';
import { InstallAppModal } from '../components/InstallAppModal';
import { LongTripItem } from '../data/longTrips';
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
import { Sparkles, Compass, MapPin, ArrowRight, Trash2, Bot, SlidersHorizontal, Mountain, ChevronRight, ChevronLeft, Utensils, PlusCircle, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'generator' | 'radar' | 'long_trips'>('ai');
  const [currentRoute, setCurrentRoute] = useState<RoutePlan | null>(null);
  const [musicMood, setMusicMood] = useState<MusicMood>('welcome');
  const [moodRevision, setMoodRevision] = useState<number>(0);

  // Yangi Modallar: Omad Barabani, Sayohat Pasporti, SOS, Gastro-Kompas, Yangi Joy Qo'shish, Telefonga O'rnatish va Admin Panel
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [showGastroModal, setShowGastroModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [communityModalTab, setCommunityModalTab] = useState<'add' | 'admin'>('add');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [communityApprovedPlaces, setCommunityApprovedPlaces] = useState<LocationItem[]>([]);
  const [wheelSelectedTrip, setWheelSelectedTrip] = useState<LongTripItem | null>(null);

  // Yuqori tablar scroll ko'rsatkichi uchun state va ref
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const longTripsBtnRef = useRef<HTMLButtonElement | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [hasSeenLongTrips, setHasSeenLongTrips] = useState(false);

  const updateTabsScrollState = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(maxScroll > 6 && el.scrollLeft < maxScroll - 8);
  };

  // Kirganda foydalanuvchiga o'ng tomonda "Uzoq Safarlar" borligini bildirish uchun yumshoq "peek" animatsiyasi
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateTabsScrollState();

    const handleResize = () => updateTabsScrollState();
    window.addEventListener('resize', handleResize);

    // 700ms dan keyin o'ngga sal surib ko'rsatib, keyin qaytaramiz
    const peekForwardTimer = setTimeout(() => {
      if (!tabsScrollRef.current) return;
      const maxScroll = tabsScrollRef.current.scrollWidth - tabsScrollRef.current.clientWidth;
      if (maxScroll > 10) {
        tabsScrollRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      }
    }, 700);

    const peekBackTimer = setTimeout(() => {
      if (!tabsScrollRef.current) return;
      if (activeTab === 'ai' || activeTab === 'generator') {
        tabsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 2000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(peekForwardTimer);
      clearTimeout(peekBackTimer);
    };
  }, []);

  const handleMoodChange = (nextMood: MusicMood) => {
    setMusicMood(nextMood);
    setMoodRevision(prev => prev + 1);
  };
  
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

      // Admin ID (7048168954) tekshiruvi: Telegram WebApp yoki URL ?admin_id=7048168954
      const tgUserId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : '';
      const urlAdminId = params.get('admin_id') || '';
      const savedAdminId = localStorage.getItem('xaritamiz_verified_admin_id') || '';
      const detectedAdmin =
        tgUserId === ADMIN_TELEGRAM_ID ||
        urlAdminId === ADMIN_TELEGRAM_ID ||
        savedAdminId === ADMIN_TELEGRAM_ID;

      if (detectedAdmin) {
        setIsAdminUser(true);
        localStorage.setItem('xaritamiz_verified_admin_id', ADMIN_TELEGRAM_ID);
      }

      if (params.get('open_admin') === '1' && detectedAdmin) {
        setCommunityModalTab('admin');
        setShowCommunityModal(true);
      }

      // Tasdiqlangan hamjamiyat joylarini yuklash
      fetch(`/api/community-places?adminId=${detectedAdmin ? ADMIN_TELEGRAM_ID : ''}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.approvedPlaces)) {
            setCommunityApprovedPlaces(data.approvedPlaces);
          }
        })
        .catch(() => {
          // ignore
        });

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
        handleMoodChange(detectMoodFromRoute(autoRoute));
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
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
    handleMoodChange(
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
    handleMoodChange(detectMoodFromRoute(surprise));
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
    handleMoodChange('welcome');
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Near Me dan joy qo'shish / olib tashlash
  const handleToggleSavedStop = (location: LocationItem) => {
    if (location.companionTags.includes('couple') && location.vibeTags.includes('aesthetic_photo')) {
      handleMoodChange('romantic');
    } else {
      handleMoodChange(detectMoodFromCategory(location.category));
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
        onSurpriseClick={() => setShowSpinWheel(true)}
        onOpenPassport={() => setShowPassport(true)}
        onOpenSos={() => setShowSos(true)}
        onOpenInstallApp={() => setShowInstallModal(true)}
        onReset={handleReset}
        musicMood={musicMood}
        moodRevision={moodRevision}
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
          <div className="space-y-4 sm:space-y-5">
            
            {/* 4 Rejimli Segmented Control Tab — O'ngga scroll bo'ladigan + Vizual ko'rsatkichlar */}
            <div className="max-w-xl mx-auto space-y-1.5">
              <div className="relative">
                {/* Chapga qaytish ko'rsatkichi (o'ngga scroll qilinganda chiqadi) */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      tabsScrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
                    }}
                    aria-label="Chapga surish"
                    className="sm:hidden absolute left-0 top-0 bottom-0 z-10 pl-1 pr-2.5 flex items-center bg-gradient-to-r from-zinc-200 via-zinc-200/90 to-transparent dark:from-slate-800 dark:via-slate-800/90 rounded-l-2xl text-zinc-700 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-zinc-200/80 dark:border-slate-700 flex items-center justify-center">
                      <ChevronLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </span>
                  </button>
                )}

                <div
                  ref={tabsScrollRef}
                  onScroll={updateTabsScrollState}
                  className="bg-zinc-200/60 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar border border-zinc-200/50 dark:border-slate-700/60 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.06)] scroll-smooth"
                >
                  {/* Tab 1: Erkin Istak */}
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerHaptic('light');
                      setActiveTab('ai');
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 whitespace-nowrap flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                    onClick={(e) => {
                      triggerHaptic('light');
                      setActiveTab('generator');
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 whitespace-nowrap flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                    onClick={(e) => {
                      triggerHaptic('light');
                      setActiveTab('radar');
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 whitespace-nowrap flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'radar'
                        ? 'bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 shadow-sm border border-zinc-100/80 dark:border-white/[0.06]'
                        : 'text-zinc-600 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
                    }`}
                  >
                    <Compass className={`w-3.5 h-3.5 ${activeTab === 'radar' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                    <span>Yaqin Joylar</span>
                  </button>

                  {/* Tab 4: Uzoq Safarlar (12 viloyat) */}
                  <button
                    ref={longTripsBtnRef}
                    type="button"
                    onClick={(e) => {
                      triggerHaptic('medium');
                      setActiveTab('long_trips');
                      setHasSeenLongTrips(true);
                      handleMoodChange('quiet_nature');
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 whitespace-nowrap flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                      activeTab === 'long_trips'
                        ? 'bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-300 shadow-sm border border-zinc-100/80 dark:border-white/[0.06]'
                        : 'text-zinc-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white font-semibold'
                    }`}
                  >
                    <Mountain className={`w-3.5 h-3.5 ${activeTab === 'long_trips' ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span>Uzoq Safarlar</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 leading-none">
                      12 vil.
                    </span>
                  </button>
                </div>

                {/* O'ng tomonda Uzoq Safarlar borligini bildiruvchi suzuvchi tugma (mobil uchun) */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      const el = tabsScrollRef.current;
                      if (el) {
                        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
                      }
                      setActiveTab('long_trips');
                      setHasSeenLongTrips(true);
                      handleMoodChange('quiet_nature');
                    }}
                    aria-label="Uzoq Safarlar bo'limiga o'tish"
                    className="sm:hidden absolute right-0 top-0 bottom-0 z-10 pl-3 pr-1 flex items-center bg-gradient-to-l from-zinc-200 via-zinc-200/95 to-transparent dark:from-slate-800 dark:via-slate-800/95 rounded-r-2xl cursor-pointer"
                  >
                    <span className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold shadow-md shadow-emerald-600/25 animate-pulse">
                      <Mountain className="w-3 h-3" />
                      <ChevronRight className="w-3.5 h-3.5 -ml-0.5" />
                    </span>
                  </button>
                )}
              </div>

              {/* Kichik ishora yozuvi — foydalanuvchi o'ngda "Uzoq Safarlar" borligini darhol bilishi uchun */}
              {activeTab !== 'long_trips' && (
                <div className="flex justify-end px-1">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      const el = tabsScrollRef.current;
                      if (el) {
                        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
                      }
                      setActiveTab('long_trips');
                      setHasSeenLongTrips(true);
                      handleMoodChange('quiet_nature');
                    }}
                    className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 px-2.5 py-1 rounded-full shadow-2xs transition cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>⛰️ 12 viloyat bo‘ylab <b>Uzoq Safarlar</b> — o‘ngga suring yoki bosing</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 🌤️ Jonli Ob-havo va Oltin Soat (Golden Hour) Maslahatchisi */}
            <LiveWeatherAdvisor
              lat={41.3111}
              lng={69.2797}
              locationName="Toshkent"
              compact
            />

            {/* 🍱 Gastro-Kompas & ➕ Yangi Sokin Joy Qo'shish (+ 🛡️ Admin Panel 7048168954 uchun) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setShowGastroModal(true);
                }}
                className="flex-1 min-w-[155px] py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-300/80 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>🍱 Gastro-Kompas (Taomlar)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setCommunityModalTab('add');
                  setShowCommunityModal(true);
                }}
                className="flex-1 min-w-[155px] py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 border border-emerald-300/80 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-200 text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>➕ Sokin joy qo‘shish</span>
              </button>

              {isAdminUser && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    setCommunityModalTab('admin');
                    setShowCommunityModal(true);
                  }}
                  className="py-2.5 px-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>🛡️ Admin Panel</span>
                </button>
              )}
            </div>

            {/* Faol rejim kontenti */}
            {activeTab === 'ai' ? (
              <AiRouteFinder
                onMoodChange={handleMoodChange}
                onRouteGenerated={(route) => {
                  setCurrentRoute(route);
                  handleMoodChange(detectMoodFromRoute(route));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : activeTab === 'generator' ? (
              <QuizFilter
                onGenerate={handleGenerate}
                onSurprise={() => setShowSpinWheel(true)}
                initialFilters={lastFilters}
                onMoodChange={handleMoodChange}
              />
            ) : (
              <NearMeRadar
                mode={activeTab === 'long_trips' ? 'long_trips' : 'radar'}
                onAddToCustomRoute={handleToggleSavedStop}
                savedStops={savedStops}
                onMoodChange={handleMoodChange}
                communityApprovedPlaces={communityApprovedPlaces}
                onOpenAddPlaceModal={() => {
                  setCommunityModalTab('add');
                  setShowCommunityModal(true);
                }}
                onOpenGastroModal={() => setShowGastroModal(true)}
              />
            )}

          </div>
        )}

      </main>

      {/* 🎡 Omad Barabani (Ruletka) Modali */}
      <SpinWheelModal
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        onSelectTashkentPlace={(place) => {
          handleToggleSavedStop(place);
          setActiveTab('radar');
        }}
        onSelectLongTrip={(trip) => {
          setActiveTab('long_trips');
          setWheelSelectedTrip(trip);
        }}
        onSurpriseFullRoute={handleSurprise}
      />

      {/* 🏆 Sayohat Pasporti Modali */}
      <PassportModal
        isOpen={showPassport}
        onClose={() => setShowPassport(false)}
      />

      {/* 🚨 Safar Xavfsizligi (SOS & Yo'l Yordami) Modali */}
      <SafetySosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

      {/* 🍱 Gastro-Kompas Modali */}
      <GastroCompassModal
        isOpen={showGastroModal}
        onClose={() => setShowGastroModal(false)}
      />

      {/* ➕ Yangi Sokin Joy Qo'shish & 🛡️ Admin Panel (7048168954) Modali */}
      <CommunityPlacesModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        initialTab={communityModalTab}
        onApprovedPlacesUpdated={(places) => setCommunityApprovedPlaces(places)}
      />

      {/* 📲 Telefonga O'rnatish (iPhone & Android Bosh ekraniga ikonka) Modali */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onTriggerNativeInstall={async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallModal(false);
          }
        }}
      />

      {/* ⛰️ Barabandan tushgan Uzoq Safar pasporti */}
      <LongTripDetailModal
        trip={wheelSelectedTrip}
        onClose={() => setWheelSelectedTrip(null)}
        onAddToRoute={(loc) => handleToggleSavedStop(loc)}
        isAddedToRoute={
          wheelSelectedTrip ? savedStops.some((s) => s.id === wheelSelectedTrip.id) : false
        }
      />

      {/* Near Me yoki Uzoq Safarlar rejimida tanlangan bekatlar uchun Floating Action Banner */}
      {!currentRoute && (activeTab === 'radar' || activeTab === 'long_trips') && savedStops.length > 0 && (
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
          <span>&copy; 2026 "Xaritamiz" — Toshkent & O‘zbekiston dam olish marshrutlari</span>
          <span className="text-[11px] text-slate-400">Telegram WebApp (TMA) hamkorligida</span>
        </div>
      </footer>

    </div>
  );
}
