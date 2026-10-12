'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  Image as ImageIcon, 
  RotateCcw, 
  Clock, 
  Wallet, 
  MapPin, 
  Share2, 
  Sparkles,
  Dices,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { RoutePlan } from '../types';
import { LocationCard } from './LocationCard';
import { StoryModal } from './StoryModal';
import { PollModal } from './PollModal';
import { getTelegramShareUrl, triggerHaptic } from '../lib/utils';
import confetti from 'canvas-confetti';

interface RouteResultProps {
  route: RoutePlan;
  onBackToFilter: () => void;
  onRegenerate: () => void;
  onSwapStop: (index: number) => void;
}

export const RouteResult: React.FC<RouteResultProps> = ({
  route,
  onBackToFilter,
  onRegenerate,
  onSwapStop
}) => {
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [splitPeople, setSplitPeople] = useState<number>(3);
  const [includeTaxi, setIncludeTaxi] = useState<boolean>(true);

  const basePerPerson =
    route.numericTotalCost ||
    route.stops.reduce((acc, s) => acc + (s.location.estimatedPrice || 0), 0) ||
    120000;
  const totalTaxiCost = includeTaxi ? route.stops.length * 22000 : 0;
  const totalGroupSom = basePerPerson * splitPeople + totalTaxiCost;
  const perPersonSom = Math.round(totalGroupSom / splitPeople / 5000) * 5000;

  // Confetti trigger
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, [route.id]);

  const handleShareTelegram = () => {
    triggerHaptic('success');
    const origin = typeof window !== 'undefined' ? window.location.href : '';
    const shareUrl = getTelegramShareUrl(route, origin);
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in">
      
      {/* Yuqori navigatsiya va qaytish */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            triggerHaptic('light');
            onBackToFilter();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 p-2 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-zinc-200/80 dark:border-slate-800 backdrop-blur-sm transition active:scale-95 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Filtrlarga qaytish</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onRegenerate();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 p-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 transition active:scale-95 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Boshqa variant</span>
        </button>
      </div>

      {/* Marshrut sarlavhasi va statistikasi */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-200/70 dark:border-slate-800 space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {(route.highlightTag || 'Maxsus Saralangan ✨')
                .replace(/Claude\s*AI\s*Tavsiyasi/gi, 'Maxsus Saralangan')
                .replace(/Claude\s*AI/gi, 'Maxsus')
                .replace(/\bAI\b/gi, '')
                .trim() || 'Maxsus Saralangan ✨'}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {route.stops.length} ta saralangan bekat
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight">
            {route.title?.replace(/Claude\s*AI/gi, 'Xaritamiz')}
          </h1>

          <p className="text-xs text-zinc-500 dark:text-slate-400 font-normal">
            {(route.subtitle || '')
              .replace(/Claude\s*AI/gi, 'Xaritamiz')
              .replace(/\bAI\b/gi, '')
              .trim()}
          </p>
        </div>


        {/* Ko'rsatkichlar (Vaqt va Narx) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-slate-800/60 border border-zinc-100 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/50 dark:border-emerald-900/40">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">Umumiy vaqt</span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{route.totalDurationHours}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 uppercase font-semibold tracking-wider block">Taxminiy chek</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">{route.totalEstimatedCost}</span>
            </div>
          </div>
        </div>

        {/* 🧮 Do'stlar bilan Xarajat Kalkulyatori (Split Bill) */}
        <div className="p-3.5 rounded-2xl bg-zinc-50/90 dark:bg-slate-800/60 border border-zinc-200/70 dark:border-slate-700/70 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>🧮 Do‘stlar bilan Xarajat Kalkulyatori:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIncludeTaxi((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                includeTaxi
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 text-zinc-500 border-zinc-200 dark:border-slate-700'
              }`}
            >
              🚕 O‘rtada Taksi: {includeTaxi ? 'Qo‘shilgan ✓' : 'Qo‘shilmagan'}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSplitPeople(n);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                    splitPeople === n
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-zinc-600 dark:text-slate-300 border border-zinc-200 dark:border-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-[11px] text-zinc-500 ml-1">kishi</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Kishi boshiga ulush:
              </span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                ~{perPersonSom.toLocaleString('uz-UZ')} so‘m
              </span>
            </div>
          </div>
        </div>

        {/* Claude AI Izohi & Tavsiyasi (agar mavjud bo'lsa) */}
        {route.aiComment && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300 block mb-0.5">
                Yo‘lboshchi Maslahati:
              </span>
              <p className="leading-relaxed font-normal">
                &ldquo;{route.aiComment?.replace(/Claude\s*AI/gi, 'Xaritamiz').replace(/\bClaude\b/gi, 'Xaritamiz').replace(/\bAI\b/gi, '').trim()}&rdquo;
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Bekatlar Xronologik Vaqt Chizig'i (Timeline) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Xronologik marshrut rejasi</span>
          </h2>
          <span className="text-[11px] text-gray-400">Ketma-ket tartib</span>
        </div>

        <div className="space-y-6">
          {route.stops.map((stop, index) => (
            <LocationCard
              key={`${stop.location.id}-${index}`}
              stop={stop}
              isLast={index === route.stops.length - 1}
              onSwapStop={() => onSwapStop(index)}
            />
          ))}
        </div>
      </div>

      {/* Taksi eslatmasi */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="leading-relaxed">
          <b>Maslahat:</b> Har bir bekat ostidagi <b>Yandex Go</b> yoki <b>Uklon</b> tugmalari orqali marshrutning aynan o‘sha nuqtasiga bir zumda taksi chaqirishingiz mumkin.
        </p>
      </div>

      {/* Pastki o'rnatilgan Baham Ko'rish Paneli (Sticky Bottom Action Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/92 dark:bg-slate-900/90 backdrop-blur-md border-t border-zinc-100 dark:border-slate-800 py-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">

          
          {/* Telegramga ulashish */}
          <button
            onClick={handleShareTelegram}
            className="flex-1 py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram&apos;ga yuborish</span>
          </button>


          {/* Do'stlar bilan ovoz berish (Poll mode) */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              setShowPollModal(true);
            }}
            title="Guruhda ovoz berish (Poll mode)"
            className="py-3 px-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-100 font-semibold text-xs flex items-center gap-1.5 border border-gray-200/70 dark:border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Guruhda ovoz berish</span>
            <span className="sm:hidden">Ovoz</span>
          </button>

          {/* Instagram Story kartasi */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              setShowStoryModal(true);
            }}
            title="Instagram Stories formati (Karta)"
            className="py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Story kartasi</span>
            <span className="sm:hidden">Story</span>
          </button>

        </div>
      </div>

      {/* Modallar */}
      <StoryModal
        route={route}
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
      />

      <PollModal
        route={route}
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
      />

    </div>
  );
};
