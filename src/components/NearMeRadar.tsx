'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  Search, 
  AlertCircle, 
  ArrowUpDown
} from 'lucide-react';
import { LocationItem, CompanionType, LocationCategory } from '../types';
import { LOCATIONS_DATABASE } from '../data/locations';
import { calculateDistanceMeters, formatDistance, getUserLocation, TASHKENT_CENTER } from '../lib/geoUtils';
import { NearPlaceCard } from './NearPlaceCard';
import { triggerHaptic } from '../lib/utils';

interface NearMeRadarProps {
  onAddToCustomRoute?: (location: LocationItem) => void;
  savedStops?: LocationItem[];
}

type CategoryFilter = 'all' | 'cafe' | 'restaurant' | 'entertainment' | 'parks';

// Unified card section style
const sectionCls = 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-zinc-200/70 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5';

export const NearMeRadar: React.FC<NearMeRadarProps> = ({
  onAddToCustomRoute,
  savedStops = []
}) => {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(TASHKENT_CENTER);
  const [locationName, setLocationName] = useState<string>('Toshkent Markazi (Amir Temur xiyoboni)');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType | 'all'>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDetectLocation = async () => {
    setIsLocating(true);
    setGeoError(null);
    triggerHaptic('medium');

    try {
      const coords = await getUserLocation();
      setUserCoords(coords);
      setLocationName('Sizning joriy joylashuvingiz');
      triggerHaptic('success');
    } catch (err) {
      console.warn('Geolokatsiya olishda xatolik:', err);
      setGeoError('Joylashuvni aniqlashga ruxsat berilmadi. Toshkent markazi asos qilib olindi.');
      setUserCoords(TASHKENT_CENTER);
      setLocationName(TASHKENT_CENTER.name);
      triggerHaptic('warning');
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    handleDetectLocation();
  }, []);

  const handleSelectTashkentCenter = () => {
    triggerHaptic('light');
    setUserCoords(TASHKENT_CENTER);
    setLocationName(TASHKENT_CENTER.name);
    setGeoError(null);
  };

  const handleResetFilters = () => {
    triggerHaptic('light');
    setSelectedCategory('all');
    setSelectedCompanion('all');
    setMaxRadiusKm(0);
    setSearchQuery('');
  };

  const categoryChips: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'Barchasi' },
    { id: 'restaurant', label: 'Restoran & Kafe' },
    { id: 'cafe', label: 'Qahvaxonalar' },
    { id: 'parks', label: "Bog\u02BElar & Sayrgoh" },
    { id: 'entertainment', label: "Ko\u02BBngilochar & O\u02BByin" }
  ];

  const companionChips: { id: CompanionType | 'all'; label: string }[] = [
    { id: 'all', label: 'Barchasiga mos' },
    { id: 'couple', label: 'Juftlik' },
    { id: 'friends', label: "Do\u02BBstlar bilan" },
    { id: 'family', label: 'Oila bilan' },
    { id: 'solo', label: "Yakka o\u02BBzi" }
  ];

  const radiusOptions: { km: number; label: string }[] = [
    { km: 0, label: 'Cheksiz' },
    { km: 1, label: '< 1 km' },
    { km: 3, label: '< 3 km' },
    { km: 5, label: '< 5 km' },
    { km: 10, label: '< 10 km' }
  ];

  const sortedAndFilteredPlaces = useMemo(() => {
    const withDistances: LocationItem[] = LOCATIONS_DATABASE.map(place => {
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

    return withDistances.filter(place => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = place.title.toLowerCase().includes(query);
        const matchDistrict = place.district.toLowerCase().includes(query);
        const matchAddress = place.address.toLowerCase().includes(query);
        if (!matchTitle && !matchDistrict && !matchAddress) return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cafe' && place.category !== 'cafe') return false;
        if (selectedCategory === 'restaurant' && place.category !== 'restaurant') return false;
        if (selectedCategory === 'parks' && place.category !== 'park_nature' && place.category !== 'viewpoint') return false;
        if (selectedCategory === 'entertainment' && !['activity', 'sightseeing', 'nightlife', 'culture_museum'].includes(place.category)) return false;
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
  }, [userCoords, selectedCategory, selectedCompanion, maxRadiusKm, searchQuery]);

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCompanion !== 'all' ? 1 : 0) +
    (maxRadiusKm > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Chip style helpers
  const chipActive = 'bg-emerald-600 text-white shadow-xs';
  const chipInactive = 'bg-zinc-100 hover:bg-zinc-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-300';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-16">
      
      {/* 1. Radar Boshqaruvi va Joylashuv Paneli */}
      <div className={sectionCls}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {/* Compass icon — monoxrom zumrad */}
            <div className="w-9 h-9 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" style={{ animation: 'spin 8s linear infinite' }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                Near Me Radari
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400">
                {locationName}
              </p>
            </div>
          </div>

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
        </div>

        {/* Xatolik xabari */}
        {geoError && (
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
            placeholder="Joy nomi yoki tuman bo&#x2BC;yicha qidirish (masalan: Shevchenko, Anhor, Chorsu)..."
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
      <div className={sectionCls}>
        
        {/* Yuqori: Saralash holati va Reset */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Masofa bo&#x2BC;yicha tartiblangan (eng yaqinidan)</span>
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
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Toifa:</span>
          <div className="flex flex-wrap gap-1.5">
            {categoryChips.map(chip => {
              const isSelected = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => { triggerHaptic('light'); setSelectedCategory(chip.id); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${isSelected ? chipActive : chipInactive}`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* B. Hamroh teglari */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Kim bilan:</span>
          <div className="flex flex-wrap gap-1.5">
            {companionChips.map(chip => {
              const isSelected = selectedCompanion === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => { triggerHaptic('light'); setSelectedCompanion(chip.id); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${isSelected ? chipActive : chipInactive}`}
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
            <span className="font-semibold uppercase tracking-wider">Maksimal masofa radiusi:</span>
            <span className="font-medium text-zinc-700 dark:text-slate-300">
              {maxRadiusKm === 0 ? 'Barcha masofalar' : `${maxRadiusKm} km gacha`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {radiusOptions.map(opt => {
              const isSelected = maxRadiusKm === opt.km;
              return (
                <button
                  key={opt.km}
                  type="button"
                  onClick={() => { triggerHaptic('light'); setMaxRadiusKm(opt.km); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${isSelected ? chipActive : chipInactive}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Natijalar Ro'yxati */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Topilgan joylar ({sortedAndFilteredPlaces.length} ta)</span>
          </h3>
          <span className="text-[11px] text-zinc-400">Eng yaqindan uzoqqa</span>
        </div>

        {sortedAndFilteredPlaces.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-zinc-200/70 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100/50">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-zinc-800 dark:text-slate-200">
              Belgilangan filtrlar bo&#x2BC;yicha joy topilmadi
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Radiusni kengaytiring yoki filtrlarni tozalab qayta urinib ko&#x2BC;ring.
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
                isAddedToRoute={savedStops.some(s => s.id === place.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
