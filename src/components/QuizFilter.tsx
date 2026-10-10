'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Home, 
  User, 
  Trees, 
  Sparkles, 
  Camera, 
  Compass, 
  Moon, 
  Coins, 
  Wallet, 
  Gem, 
  Clock, 
  CalendarDays, 
  SunMedium, 
  Wand2, 
  Dices,
  ArrowRight,
  Flame,
  Search
} from 'lucide-react';
import { 
  CompanionType, 
  VibeType, 
  BudgetTier, 
  DurationOption, 
  FilterState 
} from '../types';
import { parseCustomQuery } from '../lib/routeGenerator';
import { triggerHaptic } from '../lib/utils';
import { detectMoodFromFilter, MusicMood } from '../lib/musicMood';

interface QuizFilterProps {
  onGenerate: (filters: FilterState) => void;
  onSurprise: () => void;
  initialFilters?: FilterState;
  onMoodChange?: (mood: MusicMood) => void;
}

export const QuizFilter: React.FC<QuizFilterProps> = ({
  onGenerate,
  onSurprise,
  initialFilters,
  onMoodChange
}) => {
  const [companion, setCompanion] = useState<CompanionType>(initialFilters?.companion || 'couple');
  const [vibe, setVibe] = useState<VibeType>(initialFilters?.vibe || 'aesthetic_photo');
  const [budget, setBudget] = useState<BudgetTier>(initialFilters?.budget || 'medium');
  const [duration, setDuration] = useState<DurationOption>(initialFilters?.duration || 'evening_short');
  
  const [customText, setCustomText] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ikonka — tanlanmagan holat: neytral zumrad-kulrang
  // Tanlangan holat: to'q zumrad fon, oq ikonka (CSS orqali kontrollanadi)
  const iconCls = (isSelected: boolean) =>
    isSelected
      ? 'w-5 h-5 text-white'
      : 'w-5 h-5 text-emerald-700/70 dark:text-emerald-500/80';

  const iconWrapCls = (isSelected: boolean) =>
    isSelected
      ? 'p-2 rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20 shrink-0'
      : 'p-2 rounded-xl bg-emerald-50/80 border border-emerald-100/40 dark:bg-emerald-950/30 dark:border-emerald-900/30 shrink-0';

  // 1. Kim bilan?
  const companionOptions: { id: CompanionType; label: string; desc: string; icon: (sel: boolean) => React.ReactNode }[] = [
    {
      id: 'couple',
      label: 'Juftlik',
      desc: 'Romantik & samimiy',
      icon: (sel) => <Heart className={iconCls(sel)} />
    },
    {
      id: 'friends',
      label: "Do\u02BBstlar bilan",
      desc: "Quvnoq & faol davra",
      icon: (sel) => <Users className={iconCls(sel)} />
    },
    {
      id: 'family',
      label: 'Oila',
      desc: 'Barcha uchun qulay',
      icon: (sel) => <Home className={iconCls(sel)} />
    },
    {
      id: 'solo',
      label: "Yolg\u02BBiz (Solo)",
      desc: 'Sokinlik & fikrlar',
      icon: (sel) => <User className={iconCls(sel)} />
    }
  ];

  // 2. Qanday vibe / muhit?
  const vibeOptions: { id: VibeType; label: string; desc: string; icon: (sel: boolean) => React.ReactNode; badge?: string }[] = [
    {
      id: 'quiet_nature',
      label: 'Sokin & Tabiat',
      desc: "Salqin daryo bo\u02BByi, o\u02BBrmon va bog\u02BElar",
      icon: (sel) => <Trees className={iconCls(sel)} />
    },
    {
      id: 'urban_lively',
      label: 'Jonli & Shahar',
      desc: "Markaziy ritm, yorqin ko\u02BBchalar",
      icon: (sel) => <Sparkles className={iconCls(sel)} />,
      badge: 'Trend'
    },
    {
      id: 'aesthetic_photo',
      label: 'Estetik & Qahva',
      desc: 'Fotosessiya, shinam kafelar, kruassan',
      icon: (sel) => <Camera className={iconCls(sel)} />,
      badge: 'Sevimli'
    },
    {
      id: 'adventure_active',
      label: 'Sarguzasht & Faol',
      desc: "Karting, tog\u02BB sayri, adrenalin",
      icon: (sel) => <Compass className={iconCls(sel)} />
    },
    {
      id: 'night_city',
      label: 'Tungi shahar',
      desc: 'Panoramali rooftop, oqshom chiroqlari',
      icon: (sel) => <Moon className={iconCls(sel)} />
    }
  ];

  // 3. Byudjet
  const budgetOptions: { id: BudgetTier; label: string; range: string; icon: (sel: boolean) => React.ReactNode }[] = [
    {
      id: 'budget',
      label: 'Tejamkor (Ekonom)',
      range: "20 000 — 60 000 so\u02BBm",
      icon: (sel) => <Coins className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    },
    {
      id: 'medium',
      label: "O\u02BBrtacha (Qulay)",
      range: "70 000 — 160 000 so\u02BBm",
      icon: (sel) => <Wallet className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    },
    {
      id: 'premium',
      label: 'Cheklovlarsiz (Premium)',
      range: "200 000+ so\u02BBm",
      icon: (sel) => <Gem className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    }
  ];

  // 4. Vaqt oralig'i
  const durationOptions: { id: DurationOption; label: string; desc: string; icon: (sel: boolean) => React.ReactNode }[] = [
    {
      id: 'evening_short',
      label: '2-3 soatlik oqshom',
      desc: '2 ta bekat (Kechki sayr & ovqat)',
      icon: (sel) => <Clock className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    },
    {
      id: 'half_day',
      label: 'Yarim kun (4-5 soat)',
      desc: '3 ta bekat (Qahva, faoliyat & oqshom)',
      icon: (sel) => <SunMedium className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    },
    {
      id: 'full_day',
      label: 'Butun dam olish kuni',
      desc: "4 ta to\u02BBliq bekat (10:30 dan 21:00 gacha)",
      icon: (sel) => <CalendarDays className={`w-4 h-4 ${sel ? 'text-white' : 'text-emerald-700/70 dark:text-emerald-500/70'}`} />
    }
  ];

  // Aktiv kartochka stillari (universal)
  const activeCard = 'bg-emerald-50/40 dark:bg-emerald-950/30 border-2 border-emerald-600 shadow-[0_8px_25px_rgba(5,150,105,0.12)] -translate-y-0.5';
  const inactiveCard = 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-zinc-200/70 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-[0_8px_25px_rgba(5,150,105,0.06)] hover:-translate-y-0.5';

  // Form submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerHaptic('success');
    setIsLoading(true);

    let finalFilters: FilterState = {
      companion,
      vibe,
      budget,
      duration,
      customQuery: customText.trim() || undefined
    };

    if (customText.trim()) {
      const parsed = parseCustomQuery(customText.trim());
      finalFilters = { ...finalFilters, ...parsed };
    }

    setTimeout(() => {
      setIsLoading(false);
      onGenerate(finalFilters);
    }, 450);
  };

  const handleApplyQuickPrompt = (prompt: string) => {
    setCustomText(prompt);
    triggerHaptic('light');
    const parsed = parseCustomQuery(prompt);
    if (parsed.companion) setCompanion(parsed.companion);
    if (parsed.vibe) setVibe(parsed.vibe);
    if (parsed.budget) setBudget(parsed.budget);
  };

  // Section sarlavhasi
  const SectionHeader = ({ step, title, hint }: { step: number; title: string; hint: string }) => (
    <div className="flex items-center justify-between mb-4">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[11px] font-bold">{step}</span>
        {title}
      </label>
      <span className="text-[11px] text-zinc-400 font-medium">{hint}</span>
    </div>
  );

  // Section wrapper
  const sectionCls = 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-zinc-200/70 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 pb-12">
      
      {/* Hero Intro Banner */}
      <div className="text-center pt-2 pb-1 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40">
          <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>Aqlli shahar marshrutlari generatori</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          Bugun qayerga boramiz?
        </h1>
        <p className="text-sm text-zinc-500 dark:text-slate-400 max-w-md mx-auto">
          20 ta savolsiz — bor-yo&#x2BB;g&#x2BB;i 4 ta tezkor tanlov orqali soatbay tayyor dam olish rejasini oling.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* BOSQICH 1: Kim bilan? */}
        <section className={sectionCls}>
          <SectionHeader step={1} title="Kim bilan borasiz?" hint="Format" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {companionOptions.map((opt) => {
              const isSelected = companion === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setCompanion(opt.id);
                    onMoodChange?.(detectMoodFromFilter(opt.id, vibe, 'companion'));
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${isSelected ? activeCard : inactiveCard}`}
                >
                  <div className={`mb-2 ${iconWrapCls(isSelected)}`}>
                    {opt.icon(isSelected)}
                  </div>
                  <span className={`text-sm font-bold tracking-tight leading-tight ${isSelected ? 'text-zinc-900 dark:text-emerald-200' : 'text-zinc-900 dark:text-slate-200'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-slate-500 font-normal mt-0.5 leading-snug">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* BOSQICH 2: Qanday vibe/muhit? */}
        <section className={sectionCls}>
          <SectionHeader step={2} title="Qanday kayfiyat & muhit?" hint="Vibe" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {vibeOptions.map((opt) => {
              const isSelected = vibe === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setVibe(opt.id);
                    onMoodChange?.(detectMoodFromFilter(companion, opt.id, 'vibe'));
                  }}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${isSelected ? activeCard : inactiveCard}`}
                >
                  <div className={iconWrapCls(isSelected)}>
                    {opt.icon(isSelected)}
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-zinc-900 dark:text-emerald-200' : 'text-zinc-900 dark:text-slate-200'}`}>
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-slate-500 font-normal mt-0.5 line-clamp-1">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* BOSQICH 3: Byudjet */}
        <section className={sectionCls}>
          <SectionHeader step={3} title="Byudjet darajasi (bir kishiga)" hint="Hamyon" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {budgetOptions.map((opt) => {
              const isSelected = budget === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => { triggerHaptic('light'); setBudget(opt.id); }}
                  className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${isSelected ? activeCard : inactiveCard}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-zinc-900 dark:text-emerald-200' : 'text-zinc-900 dark:text-slate-200'}`}>
                      {opt.label}
                    </span>
                    <div className={`p-1 rounded-lg ${isSelected ? 'bg-emerald-600/20' : 'bg-emerald-50/80 dark:bg-emerald-950/30'}`}>
                      {opt.icon(isSelected)}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-slate-400 font-normal">
                    {opt.range}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* BOSQICH 4: Vaqt oralig'i */}
        <section className={sectionCls}>
          <SectionHeader step={4} title="Qancha vaqtingiz bor?" hint="Davomiylik" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {durationOptions.map((opt) => {
              const isSelected = duration === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => { triggerHaptic('light'); setDuration(opt.id); }}
                  className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${isSelected ? activeCard : inactiveCard}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-zinc-900 dark:text-emerald-200' : 'text-zinc-900 dark:text-slate-200'}`}>
                      {opt.label}
                    </span>
                    <div className={`p-1 rounded-lg ${isSelected ? 'bg-emerald-600/20' : 'bg-emerald-50/80 dark:bg-emerald-950/30'}`}>
                      {opt.icon(isSelected)}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-slate-500 font-normal">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* AI / Smart Prompt Qatlami (Optional) */}
        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-dashed border-zinc-300/80 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAiInput(!showAiInput)}
              className="text-xs font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{showAiInput ? 'Erkin yozuvni yashirish' : 'Nostandart istak bormi? (O‘z so‘zingiz bilan)'}</span>
            </button>
            <span className="text-[10px] text-zinc-400">Erkin qidiruv</span>
          </div>

          {showAiInput && (
            <div className="mt-3 space-y-2.5 pt-2 border-t border-zinc-200 dark:border-slate-700/60">
              <div className="relative">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Masalan: Mashinada oqshom aylanib, sokin qahva ichadigan joy..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 text-zinc-900 dark:text-slate-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-zinc-400" />
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Romantik sokin qahva va chiroyli rasm',
                  "Do\u02BBstlar bilan to\u02BByib ovqatlanib, karting uchish",
                  "Oila bilan toza havo va salqin ko\u02BBl"
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyQuickPrompt(item)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-700 transition cursor-pointer"
                  >
                    &ldquo;{item}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Harakat Tugmalari */}
        <div className="space-y-3 pt-1">
          
          {/* Asosiy tugma */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Marshrut tuzilmoqda...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Marshrutni tuzish</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* "Taqdirga topshirish" (Roulette) */}
          <button
            type="button"
            onClick={() => { triggerHaptic('heavy'); onSurprise(); }}
            className="w-full py-3 px-4 rounded-2xl bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700/80 text-zinc-700 dark:text-slate-200 text-sm font-semibold border border-zinc-200/70 dark:border-slate-700 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-xs backdrop-blur-sm"
          >
            <Dices className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>O&#x2BB;ylab o&#x2BB;tirish shart emas — Taqdirga topshirish 🎲</span>
          </button>

        </div>

      </form>
    </div>
  );
};
