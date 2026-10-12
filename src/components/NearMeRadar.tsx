'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  RotateCcw,
  Search,
  AlertCircle,
  ArrowUpDown,
  Mountain,
  Bot,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { LocationItem, CompanionType } from '../types';
import { LOCATIONS_DATABASE } from '../data/locations';
import { LONG_TRIPS_DATABASE, LongTripItem, LongTripNatureType } from '../data/longTrips';
import { calculateDistanceMeters, formatDistance, getUserLocation, TASHKENT_CENTER } from '../lib/geoUtils';
import { NearPlaceCard } from './NearPlaceCard';
import { LongTripCard } from './LongTripCard';
import { LongTripDetailModal } from './LongTripDetailModal';
import { triggerHaptic } from '../lib/utils';
import { MusicMood } from '../lib/musicMood';

interface NearMeRadarProps {
  mode?: 'radar' | 'long_trips';
  onAddToCustomRoute?: (location: LocationItem) => void;
  savedStops?: LocationItem[];
  onMoodChange?: (mood: MusicMood) => void;
}

type CategoryFilter = 'all' | 'cafe' | 'restaurant' | 'parks' | 'entertainment';

const BOT_STORAGE_KEY = 'xaritamiz_daily_bot_places_v1';

const sectionCls =
  'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-zinc-200/70 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5';

export const NearMeRadar: React.FC<NearMeRadarProps> = ({
  mode = 'radar',
  onAddToCustomRoute,
  savedStops = [],
  onMoodChange
}) => {
  const isLongTripsMode = mode === 'long_trips';

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(TASHKENT_CENTER);
  const [locationName, setLocationName] = useState<string>('Toshkent Markazi (Amir Temur xiyoboni)');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [selectedTripForModal, setSelectedTripForModal] = useState<LongTripItem | null>(null);

  // Bot orqali har kuni va joriy koordinata bo'yicha topilgan yangi joylar
  const [botPlaces, setBotPlaces] = useState<LocationItem[]>([]);
  const [isBotScanning, setIsBotScanning] = useState<boolean>(false);
  const [lastBotScanTime, setLastBotScanTime] = useState<string>('Bugun');

  // Toshkent Near Me filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType | 'all'>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Uzoq safarlar filters
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedNatureType, setSelectedNatureType] = useState<LongTripNatureType | 'all'>('all');

  // Kunlik Bot keshini o'qish
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const todayStr = new Date().toISOString().slice(0, 10);
        if (parsed.date === todayStr && Array.isArray(parsed.places)) {
          setBotPlaces(parsed.places);
          setLastBotScanTime(parsed.timeLabel || 'Bugun');
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Joriy koordinata atrofidagi yangi joylarni Avto-Bot orqali qidirib qo'shish
  const runBotDiscovery = useCallback(async (lat: number, lng: number) => {
    setIsBotScanning(true);
    try {
      const res = await fetch(`/api/discover-places?lat=${lat}&lng=${lng}&radius=3500`);
      const data = await res.json();
      if (data.success && Array.isArray(data.places) && data.places.length > 0) {
        setBotPlaces((prev) => {
          const map = new Map<string, LocationItem>();
          prev.forEach((p) => map.set(p.id, p));
          data.places.forEach((p: LocationItem) => map.set(p.id, p));
          const merged = Array.from(map.values());
          try {
            const now = new Date();
            const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            setLastBotScanTime(timeLabel);
            localStorage.setItem(
              BOT_STORAGE_KEY,
              JSON.stringify({
                date: now.toISOString().slice(0, 10),
                timeLabel,
                places: merged.slice(0, 120)
              })
            );
          } catch {
            // ignore
          }
          return merged;
        });
      }
    } catch (e) {
      console.warn('Avto-Bot qidiruvida xatolik:', e);
    } finally {
      setIsBotScanning(false);
    }
  }, []);

  const handleDetectLocation = async () => {
    setIsLocating(true);
    setGeoError(null);
    triggerHaptic('medium');

    try {
      const coords = await getUserLocation();
      setUserCoords(coords);
      setLocationName('Sizning joriy joylashuvingiz');
      triggerHaptic('success');
      runBotDiscovery(coords.lat, coords.lng);
    } catch (err) {
      console.warn('Geolokatsiya olishda xatolik:', err);
      setGeoError('Joylashuvni aniqlashga ruxsat berilmadi. Toshkent markazi asos qilib olindi.');
      setUserCoords(TASHKENT_CENTER);
      setLocationName(TASHKENT_CENTER.name);
      triggerHaptic('warning');
      runBotDiscovery(TASHKENT_CENTER.lat, TASHKENT_CENTER.lng);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!isLongTripsMode) {
      handleDetectLocation();
    }
  }, [isLongTripsMode]);

  const handleSelectTashkentCenter = () => {
    triggerHaptic('light');
    setUserCoords(TASHKENT_CENTER);
    setLocationName(TASHKENT_CENTER.name);
    setGeoError(null);
    runBotDiscovery(TASHKENT_CENTER.lat, TASHKENT_CENTER.lng);
  };

  const handleResetFilters = () => {
    triggerHaptic('light');
    if (isLongTripsMode) {
      setSelectedRegion('all');
      setSelectedNatureType('all');
      setSearchQuery('');
    } else {
      setSelectedCategory('all');
      setSelectedCompanion('all');
      setMaxRadiusKm(0);
      setSearchQuery('');
    }
  };

  const categoryChips: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'Barchasi' },
    { id: 'parks', label: '🌊 Soy, Yaylov & Xiyobonlar' },
    { id: 'cafe', label: '☕ Qahvaxona & Shirinlik' },
    { id: 'restaurant', label: '🍽️ Restoran & Choyxona' },
    { id: 'entertainment', label: '🎡 Sayrgoh & Madaniyat' }
  ];

  const companionChips: { id: CompanionType | 'all'; label: string }[] = [
    { id: 'all', label: 'Barchasiga mos' },
    { id: 'solo', label: 'Yolgʻiz (Sokin)' },
    { id: 'couple', label: 'Juftlik' },
    { id: 'friends', label: 'Doʻstlar bilan' },
    { id: 'family', label: 'Oila bilan' }
  ];

  const radiusOptions: { km: number; label: string }[] = [
    { km: 0, label: 'Cheksiz' },
    { km: 2, label: '< 2 km' },
    { km: 4, label: '< 4 km' },
    { km: 7, label: '< 7 km' },
    { km: 12, label: '< 12 km' }
  ];

  const natureTypeChips: { id: LongTripNatureType | 'all'; label: string }[] = [
    { id: 'all', label: '✨ Barchasi (40 ta)' },
    { id: 'waterfall_river', label: '💦 Sharshara & Soyli' },
    { id: 'mountain_meadow', label: '🏔️ Tog‘ & Yaylovli' },
    { id: 'lake_reservoir', label: '🌊 Ko‘l & Suv bo‘yi' },
    { id: 'secluded_wild', label: '⛺ Yolg‘iz & Yovvoyi tabiat' },
    { id: 'historic_lively', label: '🏛️ Tarixiy & Gavjum' }
  ];

  const regionChips: string[] = useMemo(() => {
    const uniqueRegions = Array.from(new Set(LONG_TRIPS_DATABASE.map((t) => t.region)));
    return ['all', ...uniqueRegions];
  }, []);

  // Asosiy 121 ta Toshkent bazasi + Avto-Bot topgan joylar birlashmasi
  const allTashkentPlaces = useMemo(() => {
    return [...LOCATIONS_DATABASE, ...botPlaces];
  }, [botPlaces]);

  const sortedAndFilteredPlaces = useMemo(() => {
    const withDistances: LocationItem[] = allTashkentPlaces.map((place) => {
      const distMeters = calculateDistanceMeters(
        userCoords.lat,
        userCoords.lng,
        place.lat,
        place.lng
      );
      return {
        ...place,
        distanceMeters: distMeters,
        distanceText: formatDistance(distMeters)
      };
    });

    withDistances.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

    return withDistances.filter((place) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = place.title.toLowerCase().includes(query);
        const matchDistrict = place.district.toLowerCase().includes(query);
        const matchAddress = place.address.toLowerCase().includes(query);
        const matchLabel = place.categoryLabel.toLowerCase().includes(query);
        if (!matchTitle && !matchDistrict && !matchAddress && !matchLabel) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cafe' && place.category !== 'cafe') return false;
        if (selectedCategory === 'restaurant' && place.category !== 'restaurant') return false;
        if (
          selectedCategory === 'parks' &&
          place.category !== 'park_nature' &&
          place.category !== 'viewpoint'
        )
          return false;
        if (
          selectedCategory === 'entertainment' &&
          !['activity', 'sightseeing', 'culture_museum'].includes(place.category)
        )
          return false;
      }

      if (selectedCompanion !== 'all') {
        if (!place.companionTags.includes(selectedCompanion)) return false;
      }

      if (maxRadiusKm > 0) {
        const maxMeters = maxRadiusKm * 1000;
        if ((place.distanceMeters || 0) > maxMeters) return false;
      }

      return true;
    });
  }, [allTashkentPlaces, userCoords, selectedCategory, selectedCompanion, maxRadiusKm, searchQuery]);

  const filteredLongTrips = useMemo(() => {
    return LONG_TRIPS_DATABASE.filter((trip) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = trip.title.toLowerCase().includes(q);
        const matchRegion = trip.region.toLowerCase().includes(q);
        const matchDistrict = trip.district.toLowerCase().includes(q);
        const matchDesc = trip.shortDesc.toLowerCase().includes(q);
        if (!matchTitle && !matchRegion && !matchDistrict && !matchDesc) return false;
      }

      if (selectedRegion !== 'all' && trip.region !== selectedRegion) {
        return false;
      }

      if (selectedNatureType !== 'all' && trip.natureType !== selectedNatureType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedNatureType]);

  const activeFiltersCount = isLongTripsMode
    ? (selectedRegion !== 'all' ? 1 : 0) +
      (selectedNatureType !== 'all' ? 1 : 0) +
      (searchQuery.trim() ? 1 : 0)
    : (selectedCategory !== 'all' ? 1 : 0) +
      (selectedCompanion !== 'all' ? 1 : 0) +
      (maxRadiusKm > 0 ? 1 : 0) +
      (searchQuery.trim() ? 1 : 0);

  const chipActive = 'bg-emerald-600 text-white shadow-xs';
  const chipInactive =
    'bg-zinc-100 hover:bg-zinc-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-300';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-16">
      {/* 1. Radar / Uzoq Safarlar Boshqaruv Paneli */}
      <div className={sectionCls}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
              {isLongTripsMode ? (
                <Mountain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Compass className="w-4 h-4" style={{ animation: 'spin 8s linear infinite' }} />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                {isLongTripsMode ? '12 Viloyat — Uzoq Safarlar' : 'Near Me Radari'}
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                {isLongTripsMode
                  ? 'O‘zbekiston bo‘ylab 40 ta eng zo‘r tog‘, sharshara, ko‘l va tarixiy maskanlar'
                  : locationName}
              </p>
            </div>
          </div>

          {/* Faqat Yaqin Joylar rejimida: Joriy GPS va Markaz tugmalari */}
          {!isLongTripsMode && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
                title="GPS orqali joylashuvni yangilash"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
                <span>{isLocating ? 'Aniqlanmoqda...' : 'Joriy GPS'}</span>
              </button>

              <button
                type="button"
                onClick={handleSelectTashkentCenter}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 text-xs font-medium transition border border-zinc-200/60 dark:border-slate-700 cursor-pointer active:scale-95"
                title="Toshkent markaziga o'tish"
              >
                Markaz
              </button>
            </div>
          )}
        </div>

        {/* Kunlik Avto-Qidiruv Boti status qatori */}
        {!isLongTripsMode && (
          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold">Kunlik Avto-Bot faol: </span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  {LOCATIONS_DATABASE.length} ta asosiy + {botPlaces.length} ta bot topgan sokin joylar (So‘nggi tekshiruv: {lastBotScanTime})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                runBotDiscovery(userCoords.lat, userCoords.lng);
              }}
              disabled={isBotScanning}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-[11px] font-bold hover:bg-emerald-100/50 transition cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3 h-3 ${isBotScanning ? 'animate-spin' : ''}`} />
              <span>{isBotScanning ? 'Bot qidirmoqda...' : 'Shu atrofni skanerlash'}</span>
            </button>
          </div>
        )}

        {/* Xatolik xabari */}
        {!isLongTripsMode && geoError && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        {/* Qidiruv */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isLongTripsMode
                ? 'Viloyat, tog‘, sharshara yoki joy nomi bo‘yicha qidirish (masalan: Zomin, Sangardak, Samarqand)...'
                : 'Mahalla, soy, bog‘ yoki joy nomi boʻyicha qidirish (masalan: Qoraqamish, Qorasuv, Bo‘zsuv, Lutfiy, Sergeli)...'
            }
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-zinc-50/70 dark:bg-slate-800/50 border border-zinc-200/80 dark:border-slate-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Filtrlar Paneli */}
      {isLongTripsMode ? (
        <div className={sectionCls}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-slate-300">
              <Mountain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>12 viloyat bo‘ylab saralangan 40 ta maskan (ustiga bosib pasportini oching)</span>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tozalash ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Tabiat va muhit turi */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Tabiat & Muhit turi:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {natureTypeChips.map((chip) => {
                const isSelected = selectedNatureType === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedNatureType(chip.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                      isSelected ? chipActive : chipInactive
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12 Viloyat filtri */}
          <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Hudud / Viloyat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {regionChips.map((region) => {
                const isSelected = selectedRegion === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedRegion(region);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer active:scale-95 ${
                      isSelected ? chipActive : chipInactive
                    }`}
                  >
                    {region === 'all'
                      ? 'Barcha 12 viloyat'
                      : region.replace(' viloyati', '').replace(' Respublikasi', '')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={sectionCls}>
          {/* Yuqori: Saralash holati va Reset */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Masofa boʻyicha tartiblangan (eng yaqinidan)</span>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tozalash ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* A. Toifalar */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Toifa:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categoryChips.map((chip) => {
                const isSelected = selectedCategory === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCategory(chip.id);
                      if (chip.id === 'cafe') onMoodChange?.('aesthetic_photo');
                      else if (chip.id === 'parks') onMoodChange?.('quiet_nature');
                      else if (chip.id === 'entertainment' || chip.id === 'restaurant')
                        onMoodChange?.('urban_lively');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                      isSelected ? chipActive : chipInactive
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Hamroh teglari */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Kim bilan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {companionChips.map((chip) => {
                const isSelected = selectedCompanion === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCompanion(chip.id);
                      if (chip.id === 'couple') onMoodChange?.('romantic');
                      else if (chip.id === 'friends') onMoodChange?.('urban_lively');
                      else if (chip.id === 'family') onMoodChange?.('quiet_nature');
                      else if (chip.id === 'solo') onMoodChange?.('aesthetic_photo');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                      isSelected ? chipActive : chipInactive
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Masofa radiusi */}
          <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-semibold uppercase tracking-wider">
                Maksimal masofa radiusi:
              </span>
              <span className="font-medium text-zinc-700 dark:text-slate-300">
                {maxRadiusKm === 0 ? 'Barcha masofalar' : `${maxRadiusKm} km gacha`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {radiusOptions.map((opt) => {
                const isSelected = maxRadiusKm === opt.km;
                return (
                  <button
                    key={opt.km}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setMaxRadiusKm(opt.km);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                      isSelected ? chipActive : chipInactive
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Natijalar Ro'yxati */}
      {isLongTripsMode ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-600" />
              <span>Uzoq safar maskanlari ({filteredLongTrips.length} ta)</span>
            </h3>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Batafsil ko‘rish uchun ustiga bosing
            </span>
          </div>

          {filteredLongTrips.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-zinc-200/70 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100/50">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-slate-200">
                Ushbu filtr bo‘yicha uzoq safar maskani topilmadi
              </h4>
              <button
                onClick={handleResetFilters}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Barcha 40 ta joyni ko‘rsatish</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredLongTrips.map((trip, idx) => (
                <LongTripCard
                  key={trip.id}
                  trip={trip}
                  index={idx}
                  onSelectTrip={(t) => setSelectedTripForModal(t)}
                  onAddToRoute={onAddToCustomRoute}
                  isAddedToRoute={savedStops.some((s) => s.id === trip.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Topilgan yaqin joylar ({sortedAndFilteredPlaces.length} ta)</span>
            </h3>
            <span className="text-[11px] text-zinc-400">Eng yaqindan uzoqqa</span>
          </div>

          {sortedAndFilteredPlaces.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-zinc-200/70 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100/50">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-slate-200">
                Belgilangan filtrlar boʻyicha joy topilmadi
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Radiusni kengaytiring yoki filtrlarni tozalab qayta urinib koʻring.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Barcha filtrlarni tozalash</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedAndFilteredPlaces.map((place) => (
                <NearPlaceCard
                  key={place.id}
                  location={place}
                  onAddToRoute={onAddToCustomRoute}
                  isAddedToRoute={savedStops.some((s) => s.id === place.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Batafsil Uzoq Safar Pasporti Modali */}
      <LongTripDetailModal
        trip={selectedTripForModal}
        onClose={() => setSelectedTripForModal(null)}
        onAddToRoute={onAddToCustomRoute}
        isAddedToRoute={
          selectedTripForModal
            ? savedStops.some((s) => s.id === selectedTripForModal.id)
            : false
        }
      />
    </div>
  );
};
