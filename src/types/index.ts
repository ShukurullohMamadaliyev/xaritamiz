export type CompanionType = 'couple' | 'friends' | 'family' | 'solo';

export type VibeType = 
  | 'quiet_nature'      // Sokin & Tabiat
  | 'urban_lively'      // Shahar & Jonli
  | 'aesthetic_photo'   // Estetik & Fotosessiya / Qahva
  | 'adventure_active'  // Sarguzasht & Faol
  | 'night_city';       // Tungi shahar

export type BudgetTier = 'budget' | 'medium' | 'premium';

export type DurationOption = 
  | 'evening_short'     // 2-3 soatlik oqshom
  | 'half_day'          // Yarim kun (4-5 soat)
  | 'full_day';         // To'liq kun (8+ soat)

export type LocationCategory = 
  | 'cafe' 
  | 'restaurant' 
  | 'park_nature' 
  | 'sightseeing' 
  | 'activity' 
  | 'culture_museum' 
  | 'nightlife' 
  | 'viewpoint';

export interface LocationItem {
  id: string;
  title: string;
  category: LocationCategory;
  categoryLabel: string;
  vibeTags: VibeType[];
  companionTags: CompanionType[];
  budgetTier: BudgetTier;
  averageCheck: string;
  estimatedPrice: number; // so'mda hisob-kitob uchun
  lat: number;
  lng: number;
  address: string;
  district: string;
  tipText: string; // 1 jumlalik insayd-maslahat
  imageUrl: string;
  durationMinutes: number; // o'rtacha o'tkaziladigan vaqt
  workingHours: string;
  rating: number;
  features: string[];
  distanceMeters?: number;
  distanceText?: string;
  latitude?: number;
  longitude?: number;
  longTripData?: import('../data/longTrips').LongTripItem;
}

export interface RouteStop {
  stopOrder: number;
  timeSlot: string;
  location: LocationItem;
  activityNote: string;
  customVoteScore?: { yes: number; no: number };
}

export interface RoutePlan {
  id: string;
  title: string;
  subtitle: string;
  vibe: VibeType;
  companion: CompanionType;
  budgetTier: BudgetTier;
  duration: DurationOption;
  totalEstimatedCost: string;
  numericTotalCost: number;
  totalDurationHours: string;
  stops: RouteStop[];
  highlightTag: string;
  aiComment?: string;
  createdAt: string;
}

export interface FilterState {
  companion: CompanionType | null;
  vibe: VibeType | null;
  budget: BudgetTier | null;
  duration: DurationOption | null;
  customQuery?: string;
}
