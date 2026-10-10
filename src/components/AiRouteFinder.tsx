'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Lightbulb,
  Loader2,
  Heart,
  Users,
  BookOpen,
  Moon,
  CloudRain,
  Mountain,
  Compass
} from 'lucide-react';
import { RoutePlan, RouteStop } from '../types';
import { LOCATIONS_DATABASE } from '../data/locations';
import { LONG_TRIPS_DATABASE, longTripToLocationItem } from '../data/longTrips';
import { triggerHaptic } from '../lib/utils';
import { detectMoodFromRoute, detectMoodFromText, MusicMood } from '../lib/musicMood';

interface AiRouteFinderProps {
  onRouteGenerated: (route: RoutePlan) => void;
  onMoodChange?: (mood: MusicMood) => void;
}

export const AiRouteFinder: React.FC<AiRouteFinderProps> = ({
  onRouteGenerated,
  onMoodChange
}) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickIdeas: { label: string; prompt: string; icon: React.ReactNode }[] = [
    {
      label: '🏔️ Uzoq safar: Sharshara & Tog‘lar',
      prompt:
        'Uzoq safarlarga 12 viloyat bo‘ylab sharsharali, soyli va tog‘li eng zo‘r manzarali joylardan 4 ta variant chiqarib ber',
      icon: <Mountain className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: '⛺ Uzoq safar: Yolg‘iz tabiat & Ko‘llar',
      prompt:
        'Uzoq safarga shovqindan uzoq yolg‘iz tabiat qo‘ynidagi ko‘lli, yaylovli va kanyonli 4 ta maskan tavsiya qil',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: 'Romantik oqshom',
      prompt:
        'Qizim bilan romantik sokin oqshom, chiroyli qahvaxona va quyosh botishida fotosessiya',
      icon: <Heart className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: 'Mashinada tungi shahar',
      prompt:
        'Mashinada oqshom shahar aylanib, qahva ichib, panoramali tunda sokin suhbatlashadigan joy',
      icon: <Moon className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: 'Doʻstlar bilan choyxona & oʻyin',
      prompt:
        'Doʻstlar bilan toʻyib goʻsht yeb, keyin karting yoki bouling oʻynash, energiya toʻla oqshom',
      icon: <Users className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: 'Yolgʻiz qahva va kitob',
      prompt:
        'Bir oʻzim tinchgina kitob oʻqib, mazali shirinlik va xushboʻiy kapuchino ichib dam oladigan maskan',
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    },
    {
      label: 'Yomgʻirli sokin oqshom',
      prompt:
        'Hozir havo salqin va yomgʻirli, shinam deraza oldida iliq choy ichib, sokin suhbatlashadigan joy',
      icon: <CloudRain className="w-3.5 h-3.5 text-emerald-700/70 dark:text-emerald-500" />
    }
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    triggerHaptic('medium');
    onMoodChange?.(detectMoodFromText(promptText.trim()));
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText.trim() })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Marshrut tuzishda xatolik yuz berdi');
      }

      const mergedStops: RouteStop[] = [];
      let hasLongTrip = Boolean(data.isLongTripRoute);

      data.stops.forEach(
        (
          aiStop: { placeId: string; recommendedTime: string; customTip: string },
          index: number
        ) => {
          const foundLocation = LOCATIONS_DATABASE.find((l) => l.id === aiStop.placeId);
          if (foundLocation) {
            mergedStops.push({
              stopOrder: index + 1,
              timeSlot: aiStop.recommendedTime || `${18 + index}:30`,
              location: {
                ...foundLocation,
                tipText: aiStop.customTip || foundLocation.tipText
              },
              activityNote: aiStop.customTip || foundLocation.tipText,
              customVoteScore: { yes: 1, no: 0 }
            });
            return;
          }

          const foundLongTrip = LONG_TRIPS_DATABASE.find((t) => t.id === aiStop.placeId);
          if (foundLongTrip) {
            hasLongTrip = true;
            const converted = longTripToLocationItem(foundLongTrip);
            mergedStops.push({
              stopOrder: index + 1,
              timeSlot: aiStop.recommendedTime || foundLongTrip.travelTimeText,
              location: {
                ...converted,
                tipText: aiStop.customTip || foundLongTrip.creativeTip
              },
              activityNote: aiStop.customTip || foundLongTrip.creativeTip,
              customVoteScore: { yes: 1, no: 0 }
            });
          }
        }
      );

      if (mergedStops.length === 0) {
        throw new Error('Mos lokatsiyalar topilmadi, iltimos qayta urinib koʻring');
      }

      const totalCostNumber = mergedStops.reduce(
        (acc, curr) => acc + curr.location.estimatedPrice,
        0
      );

      const generatedPlan: RoutePlan = {
        id: `route-${Math.random().toString(36).substring(2, 9)}`,
        title:
          data.routeTitle ||
          (hasLongTrip
            ? '12 Viloyat Bo‘yicha Uzoq Safar Variantlari'
            : 'Toshkent Bo‘yicha Maxsus Marshrut'),
        subtitle: hasLongTrip
          ? `Xaritamiz • 12 Viloyat Uzoq Safarlar • ${mergedStops.length} ta saralangan variant`
          : `Xaritamiz • Toshkent shahri • ${mergedStops.length} ta saralangan bekat`,
        vibe: hasLongTrip ? 'quiet_nature' : 'aesthetic_photo',
        companion: 'friends',
        budgetTier: 'medium',
        duration: hasLongTrip ? 'full_day' : mergedStops.length <= 2 ? 'evening_short' : 'half_day',
        totalEstimatedCost:
          data.estimatedTotalCost ||
          `${(Math.round(totalCostNumber / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`,
        numericTotalCost: totalCostNumber,
        totalDurationHours: hasLongTrip
          ? '1–2 kunlik safar'
          : `${mergedStops.length * 1.5} soat`,
        stops: mergedStops,
        highlightTag: hasLongTrip ? '12 Viloyat Uzoq Safar 🏔️' : 'Maxsus Saralangan ✨',
        aiComment: data.aiComment,
        createdAt: '2026-10-10T18:00:00Z'
      };

      triggerHaptic('success');
      onMoodChange?.(detectMoodFromRoute(generatedPlan, promptText.trim()));
      onRouteGenerated(generatedPlan);
    } catch (err: any) {
      console.error('Marshrut olishda xatolik:', err);
      setErrorMessage(
        err.message || 'Server bilan bog‘lanishda xatolik yuz berdi. Qayta urinib ko‘ring.'
      );
      triggerHaptic('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChip = (text: string) => {
    triggerHaptic('light');
    setPromptText(text);
    onMoodChange?.(detectMoodFromText(text));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Sarlavha & Intro */}
      <div className="text-center pt-2 pb-1 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Toshkent & 12 Viloyat Yo‘lboshchingiz</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Xayolingizdagi hordiqni yozing
        </h1>
        <p className="text-sm text-zinc-500 dark:text-slate-400 max-w-md mx-auto">
          Toshkent bo‘ylab oqshom rejasini yoki 12 viloyat bo‘ylab uzoq safar (tog‘, sharshara,
          soy, ko‘l) istagingizni yozing — Xaritamiz eng mos variantlarni chiqarib beradi.
        </p>
      </div>

      {/* Input va So'rov Formasi */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-zinc-200/70 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative rounded-xl bg-zinc-50/70 dark:bg-slate-800/50 border border-zinc-200/80 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all p-3">
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Masalan: Uzoq safarlarga sharsharali, soyli va tog‘li joylardan 4 ta variant chiqarib ber... yoki: Qizim bilan qahva ichib sokin suhbatlashadigan joy kerak..."
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none resize-none transition leading-relaxed"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-zinc-200/60 dark:border-slate-700/50">
              <span className="text-[11px] text-zinc-400 font-medium">
                80 ta Toshkent + 40 ta Uzoq safar (12 viloyat)
              </span>
              <button
                type="submit"
                disabled={isLoading || !promptText.trim()}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saralanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Marshrut tuzish</span>
                    <Send className="w-3 h-3 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-300">
              {errorMessage}
            </div>
          )}
        </form>

        {/* Tezkor g'oyalar (Chips) */}
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600/70" />
            <span>Tezkor gʻoyalar (bosib tanlang):</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickIdeas.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectChip(idea.prompt)}
                disabled={isLoading}
                className="flex items-center gap-1.5 bg-zinc-50 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-700 border border-zinc-200/60 hover:border-emerald-200 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 dark:border-slate-700 dark:hover:border-emerald-800 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer active:scale-95"
              >
                {idea.icon}
                <span>{idea.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-5 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm space-y-4 animate-pulse backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-md w-3/4" />
              <div className="h-3 bg-zinc-100 dark:bg-slate-800 rounded-md w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-16 bg-zinc-50 dark:bg-slate-800/60 rounded-2xl" />
            <div className="h-16 bg-zinc-50 dark:bg-slate-800/60 rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
