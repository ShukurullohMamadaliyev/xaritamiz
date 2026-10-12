'use client';

import React, { useState, useRef } from 'react';
import {
  Brain,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Mountain,
  Compass,
  ArrowRight,
  X,
  HeartPulse,
  Check
} from 'lucide-react';
import { LocationItem, RoutePlan, RouteStop } from '../types';
import { LongTripItem, LONG_TRIPS_DATABASE, longTripToLocationItem } from '../data/longTrips';
import { LOCATIONS_DATABASE } from '../data/locations';
import { analyzeImagePixels, ImageAnalysisResult } from '../lib/liveStatus';
import { MusicMood } from '../lib/musicMood';
import { triggerHaptic } from '../lib/utils';

interface MoodAndVisualFinderProps {
  onRouteGenerated: (route: RoutePlan) => void;
  onSelectLongTrip: (trip: LongTripItem) => void;
  onMoodChange?: (mood: MusicMood) => void;
}

interface MoodPrescription {
  id: string;
  emoji: string;
  label: string;
  subLabel: string;
  musicMood: MusicMood;
  therapyTitle: string;
  therapyAdvice: string;
  scienceNote: string;
  tashkentFilter: (loc: LocationItem) => boolean;
  regionFilter: (trip: LongTripItem) => boolean;
}

const MOOD_PRESCRIPTIONS: MoodPrescription[] = [
  {
    id: 'burnout',
    emoji: '😮‍💨',
    label: 'Charchadim / Boshim qotdi',
    subLabel: 'Antistress & Miya dam olishi',
    musicMood: 'quiet_nature',
    therapyTitle: '🌊 Suv shovqini va yashil daraxtlar terapiyasi (Blue & Green Mind)',
    therapyAdvice:
      'Aqliy charchoq paytida gavjum joylar charchoqni ikki barobar oshiradi. Sizga hozir oqar suv (soy/kanal) bo‘yi, sersoya daraxtzor va ko‘k choy ichib sokin o‘tirish eng tez kuchni tiklaydi.',
    scienceNote: 'Oqar suv tovushi kortizol (stress gormoni) darajasini 20 daqiqada 28% ga pasaytiradi.',
    tashkentFilter: (loc) =>
      loc.category === 'park_nature' ||
      loc.title.toLowerCase().includes('soy') ||
      loc.title.toLowerCase().includes('kanal') ||
      loc.vibeTags.includes('quiet_nature'),
    regionFilter: (trip) =>
      trip.natureType === 'waterfall_river' || trip.natureType === 'lake_reservoir'
  },
  {
    id: 'anxious',
    emoji: '😤',
    label: 'Asabiyman / Yolg‘iz qolay',
    subLabel: 'Raqamli detoks & Sokinlik',
    musicMood: 'aesthetic_photo',
    therapyTitle: '🌲 Yolg‘iz tabiat, baland panorama va sukunat terapiyasi',
    therapyAdvice:
      'Shovqin va odamlardan uzoqroq bo‘lgan keng ufq, baland tepalik yoki sokin xiyobonda 40 daqiqa piyoda yurish asab tolalarini to‘liq tinchlantiradi.',
    scienceNote: 'Keng ufqqa (panoramaga) qarash ko‘z va miya zo‘riqishini darhol yechadi.',
    tashkentFilter: (loc) =>
      loc.companionTags.includes('solo') &&
      (loc.category === 'park_nature' || loc.category === 'viewpoint'),
    regionFilter: (trip) =>
      trip.crowdLevel === 'Yolg‘iz & Sokin' || trip.natureType === 'secluded_wild'
  },
  {
    id: 'creative',
    emoji: '💡',
    label: 'Ilhom va G‘oya kerak',
    subLabel: 'Estetika, Qahva & Kreativ',
    musicMood: 'aesthetic_photo',
    therapyTitle: '☕ Estetik muhit, xushbo‘y qahva va me’moriy go‘zallik',
    therapyAdvice:
      'Yangi g‘oyalar tug‘ilishi uchun miyaga yangi vizual-estetik stimul kerak. Chiroyli interyerli qahvaxona, kitob burchagi yoki tarixiy maskan sizga ilhom beradi.',
    scienceNote: 'Yengil qahvaxona shovqini (~65 dB) kreativ fikrlashni kuchaytirishi isbotlangan.',
    tashkentFilter: (loc) =>
      loc.category === 'cafe' ||
      loc.category === 'culture_museum' ||
      loc.vibeTags.includes('aesthetic_photo'),
    regionFilter: (trip) =>
      trip.natureType === 'historic_lively' || trip.natureType === 'mountain_meadow'
  },
  {
    id: 'warm_love',
    emoji: '🥰',
    label: 'Mehrim to‘lib turibdi',
    subLabel: 'Romantika yoki Oila davrasi',
    musicMood: 'romantic',
    therapyTitle: '🌅 Oltin soat, iliq chiroqlar va samimiy suhbat',
    therapyAdvice:
      'Yaqin insoningiz yoki oilangiz bilan quyosh botishini kuzatish, keyin esa shinam restoranda shirin suhbat qurish oksitotsin (baxt gormoni)ni oshiradi.',
    scienceNote: 'Birgalikda yangi go‘zal joyni kashf etish munosabatlarni yanada mustahkamlaydi.',
    tashkentFilter: (loc) =>
      loc.companionTags.includes('couple') || loc.companionTags.includes('family'),
    regionFilter: (trip) =>
      trip.natureType === 'mountain_meadow' || trip.natureType === 'lake_reservoir'
  },
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Energiyam to‘la / Drive',
    subLabel: 'Harakat, Tog‘ & Do‘stlar',
    musicMood: 'urban_lively',
    therapyTitle: '⛰️ Faol sarguzasht, baland cho‘qqilar va jonli muhit',
    therapyAdvice:
      'Ichki energiyangiz yuqori paytda uni faol sayr, tog‘ trekingi yoki do‘stlar bilan jonli maskanlarga yo‘naltiring — bu endorfin portlashini beradi!',
    scienceNote: 'Tabiatda faol harakat qilish uyqu sifatini va haftalik motivatsiyani 2 barobar oshiradi.',
    tashkentFilter: (loc) =>
      loc.vibeTags.includes('adventure_active') || loc.vibeTags.includes('urban_lively'),
    regionFilter: (trip) =>
      trip.natureType === 'waterfall_river' || trip.natureType === 'mountain_meadow'
  },
  {
    id: 'night_chill',
    emoji: '🌙',
    label: 'Tungi sokinlik & Sayr',
    subLabel: 'Kechki shahar va yulduzlar',
    musicMood: 'night_city',
    therapyTitle: '✨ Tungi shahar chiroqlari va sokin kechki havo',
    therapyAdvice:
      'Kunduzgi shovqin tinganidan so‘ng yoritilgan xiyobonlar, kechki panorama nuqtalari va issiq choy bilan o‘yga cho‘mish uchun eng go‘zal vaqt.',
    scienceNote: 'Kechki 30 daqiqalik sokin sayr chuqur va tinch uyquni ta’minlaydi.',
    tashkentFilter: (loc) =>
      loc.vibeTags.includes('night_city') || loc.category === 'viewpoint' || loc.category === 'park_nature',
    regionFilter: (trip) =>
      trip.natureType === 'historic_lively' || trip.natureType === 'secluded_wild'
  }
];

export const MoodAndVisualFinder: React.FC<MoodAndVisualFinderProps> = ({
  onRouteGenerated,
  onSelectLongTrip,
  onMoodChange
}) => {
  const [activeSubMode, setActiveSubMode] = useState<'none' | 'mood' | 'photo'>('none');
  const [selectedMood, setSelectedMood] = useState<MoodPrescription | null>(null);

  // Image analyzer state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageResult, setImageResult] = useState<ImageAnalysisResult | null>(null);

  const handlePickMood = (m: MoodPrescription) => {
    triggerHaptic('medium');
    setSelectedMood(m);
    onMoodChange?.(m.musicMood);
  };

  const handleBuildMoodRoute = (destinationType: 'tashkent' | 'regions') => {
    if (!selectedMood) return;
    triggerHaptic('success');

    if (destinationType === 'tashkent') {
      const candidates = LOCATIONS_DATABASE.filter(selectedMood.tashkentFilter);
      const pool = candidates.length >= 3 ? candidates : LOCATIONS_DATABASE;
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);

      const stops: RouteStop[] = shuffled.map((loc, idx) => ({
        stopOrder: idx + 1,
        timeSlot: `${17 + idx}:30`,
        location: loc,
        activityNote: loc.tipText,
        customVoteScore: { yes: 1, no: 0 }
      }));

      const totalCost = stops.reduce((acc, s) => acc + s.location.estimatedPrice, 0);

      const plan: RoutePlan = {
        id: `mood-${Date.now()}`,
        title: `${selectedMood.emoji} ${selectedMood.label} — Antistress Reja`,
        subtitle: selectedMood.therapyTitle,
        vibe: 'quiet_nature',
        companion: 'solo',
        budgetTier: 'medium',
        duration: 'evening_short',
        totalEstimatedCost: `${(Math.round(totalCost / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`,
        numericTotalCost: totalCost,
        totalDurationHours: '3–4 soat',
        stops,
        highlightTag: 'Kayfiyat Terapiyasi 🧠',
        aiComment: `${selectedMood.therapyAdvice} (${selectedMood.scienceNote})`,
        createdAt: new Date().toISOString()
      };

      onRouteGenerated(plan);
    } else {
      const candidates = LONG_TRIPS_DATABASE.filter(selectedMood.regionFilter);
      const pool = candidates.length >= 3 ? candidates : LONG_TRIPS_DATABASE;
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);

      const stops: RouteStop[] = shuffled.map((trip, idx) => {
        const loc = longTripToLocationItem(trip);
        return {
          stopOrder: idx + 1,
          timeSlot: trip.travelTimeText,
          location: loc,
          activityNote: trip.creativeTip,
          customVoteScore: { yes: 1, no: 0 }
        };
      });

      const totalCost = stops.reduce((acc, s) => acc + s.location.estimatedPrice, 0);

      const plan: RoutePlan = {
        id: `mood-reg-${Date.now()}`,
        title: `${selectedMood.emoji} 12 Viloyat Tabiat Terapiyasi`,
        subtitle: selectedMood.therapyTitle,
        vibe: 'quiet_nature',
        companion: 'friends',
        budgetTier: 'medium',
        duration: 'full_day',
        totalEstimatedCost: `${(Math.round(totalCost / 10000) * 10000).toLocaleString('uz-UZ')} so‘m`,
        numericTotalCost: totalCost,
        totalDurationHours: '1–2 kunlik safar',
        stops,
        highlightTag: '12 Viloyat Antistress 🏔️',
        aiComment: `${selectedMood.therapyAdvice} (${selectedMood.scienceNote})`,
        createdAt: new Date().toISOString()
      };

      onRouteGenerated(plan);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic('medium');
    setAnalyzingImage(true);
    setActiveSubMode('photo');

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No ctx');

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let greenPixels = 0;
        let bluePixels = 0;
        let warmPixels = 0;
        const totalPixels = size * size;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          rSum += r;
          gSum += g;
          bSum += b;

          if (g > r + 12 && g > b + 8) greenPixels++;
          if (b > r + 15 && b >= g - 10) bluePixels++;
          if (r > b + 30 && g > b) warmPixels++;
        }

        const rAvg = rSum / totalPixels;
        const gAvg = gSum / totalPixels;
        const bAvg = bSum / totalPixels;
        const brightness = (rAvg + gAvg + bAvg) / 3;

        const result = analyzeImagePixels(
          rAvg,
          gAvg,
          bAvg,
          brightness,
          greenPixels / totalPixels,
          bluePixels / totalPixels,
          warmPixels / totalPixels
        );

        setTimeout(() => {
          setImageResult(result);
          setAnalyzingImage(false);
          triggerHaptic('success');
          onMoodChange?.(result.dominantMood as MusicMood);
        }, 650);
      } catch {
        const fallback = analyzeImagePixels(120, 150, 140, 136, 0.3, 0.2, 0.2);
        setImageResult(fallback);
        setAnalyzingImage(false);
      }
    };
    img.src = objectUrl;
  };

  return (
    <div className="space-y-3">
      {/* 2 ta Kreativ Tugma: Kayfiyat Skaneri va Rasm Orqali Topish */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveSubMode((prev) => (prev === 'mood' ? 'none' : 'mood'));
          }}
          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
            activeSubMode === 'mood'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
              : 'bg-white/85 dark:bg-slate-900/85 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border-zinc-200/80 dark:border-slate-800 text-zinc-900 dark:text-white'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubMode === 'mood'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            <Brain className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-extrabold block truncate">🧠 Kayfiyat Skaneri</span>
            <span
              className={`text-[10px] block truncate ${
                activeSubMode === 'mood' ? 'text-emerald-100' : 'text-zinc-500 dark:text-slate-400'
              }`}
            >
              Charchoq va stressga mos joy
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            if (activeSubMode !== 'photo') {
              setActiveSubMode('photo');
            } else {
              fileInputRef.current?.click();
            }
          }}
          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
            activeSubMode === 'photo'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
              : 'bg-white/85 dark:bg-slate-900/85 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border-zinc-200/80 dark:border-slate-800 text-zinc-900 dark:text-white'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubMode === 'photo'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400'
            }`}
          >
            <Camera className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-extrabold block truncate">📸 Rasm orqali topish</span>
            <span
              className={`text-[10px] block truncate ${
                activeSubMode === 'photo' ? 'text-emerald-100' : 'text-zinc-500 dark:text-slate-400'
              }`}
            >
              Rasm yuklang — o‘xshash joy
            </span>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* PANEL 1: 🧠 KAYFIYAT SKANERI (ANTISTRESS TERAPIYA) */}
      {activeSubMode === 'mood' && (
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200/80 dark:border-slate-800 shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white">
                Hozirgi ichki holatingiz va energiyangiz qanday?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubMode('none')}
              className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MOOD_PRESCRIPTIONS.map((m) => {
              const isSelected = selectedMood?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handlePickMood(m)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-zinc-50/80 dark:bg-slate-800/60 border-zinc-200/70 dark:border-slate-700/70 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-lg mb-0.5">{m.emoji}</div>
                  <div className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
                    {m.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-slate-400 mt-0.5">
                    {m.subLabel}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5 animate-fade-in">
              <div className="text-xs font-extrabold text-emerald-950 dark:text-emerald-200">
                {selectedMood.therapyTitle}
              </div>
              <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">
                {selectedMood.therapyAdvice}
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                🔬 <b>Ilmiy fakt:</b> {selectedMood.scienceNote}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleBuildMoodRoute('tashkent')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>🏙️ Toshkent Antistress Marshruti</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuildMoodRoute('regions')}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Mountain className="w-3.5 h-3.5" />
                  <span>⛰️ 12 Viloyat Tabiat Terapiyasi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: 📸 RASM YUKLAB O'XSHASH JOYNI TOPISH */}
      {activeSubMode === 'photo' && (
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white">
                📸 Rasm yuklang — O‘zbekistondan xuddi shunday joy topamiz!
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubMode('none')}
              className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/70 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer bg-emerald-50/40 dark:bg-slate-800/40 transition"
          >
            {previewUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 text-left">
                <img
                  src={previewUrl}
                  alt="Yuklangan rasm"
                  className="w-20 h-20 rounded-xl object-cover border border-emerald-300 shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                    {analyzingImage ? 'Rasm tahlil qilinmoqda...' : 'Vizual tahlil tayyor!'}
                  </span>
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white">
                    {imageResult?.detectedSceneTitle || 'Manzara rangi va muhiti o‘rganilmoqda...'}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                    Boshqa rasm yuklash uchun shu yerga bosing
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-1.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-white">
                  Instagram, Telegram yoki galereyangizdagi rasmni tanlang
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                  Tog‘, ko‘l, sharshara, o‘rmon yoki chiroyli kafe rasmini yuklasangiz, O‘zbekistondagi eng o‘xshash joylarni chiqarib beradi
                </p>
              </div>
            )}
          </div>

          {imageResult && !analyzingImage && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-zinc-600 dark:text-slate-300">
                {imageResult.detectedSceneDesc}
              </p>

              {/* 12 Viloyat O'xshash Maskanlari */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  ⛰️ 12 Viloyat bo‘ylab eng o‘xshash maskanlar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {imageResult.matchedLongTrips.map(({ trip, similarity, reason }) => (
                    <div
                      key={trip.id}
                      onClick={() => {
                        triggerHaptic('medium');
                        onSelectLongTrip(trip);
                      }}
                      className="p-2.5 rounded-xl bg-zinc-50 hover:bg-emerald-50/60 dark:bg-slate-800/70 border border-zinc-200/80 dark:border-slate-700 flex items-center gap-2.5 cursor-pointer transition"
                    >
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                            {similarity}% o‘xshash
                          </span>
                          <span className="text-[10px] text-zinc-400 truncate">{trip.region}</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {trip.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 dark:text-slate-400 line-clamp-1">
                          {reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toshkent ichidagi o'xshash maskanlar */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-slate-400 block">
                  🏙️ Toshkent shahri ichidagi eng yaqin muqobillar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {imageResult.matchedTashkent.map(({ place, similarity }) => (
                    <div
                      key={place.id}
                      className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-800/50 border border-zinc-200/70 dark:border-slate-700 flex items-center gap-2"
                    >
                      <img
                        src={place.imageUrl}
                        alt={place.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-emerald-600 block">
                          {similarity}% mos • {place.district}
                        </span>
                        <h5 className="text-[11px] font-bold text-zinc-900 dark:text-white truncate">
                          {place.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
