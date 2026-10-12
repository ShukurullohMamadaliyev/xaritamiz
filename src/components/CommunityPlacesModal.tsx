'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PlusCircle,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Send,
  Trash2,
  Navigation,
  ExternalLink,
  Loader2,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { LocationCategory, LocationItem } from '../types';
import { triggerHaptic } from '../lib/utils';

export const ADMIN_TELEGRAM_ID = '7048168954';
const LOCAL_SUBMISSIONS_KEY = 'xaritamiz_community_submissions_v1';
const LOCAL_ADMIN_KEY = 'xaritamiz_verified_admin_id';

export interface ClientCommunitySubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  moderatedAt?: string;
  submittedBy: string;
  submitterTelegramId?: string;
  location: LocationItem;
}

interface CommunityPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'add' | 'admin';
  onApprovedPlacesUpdated?: (places: LocationItem[]) => void;
}

const CATEGORY_OPTIONS: {
  id: LocationCategory;
  label: string;
  defaultImage: string;
}[] = [
  {
    id: 'park_nature',
    label: '🌳 Sokin bog‘, soy bo‘yi yoki yaylov',
    defaultImage: '/places/vuzgorodok-pine-park.jpg'
  },
  {
    id: 'cafe',
    label: '☕ Sokin qahvaxona & Kitob burchagi',
    defaultImage: '/places/qoraqamish-orom-cafe.jpg'
  },
  {
    id: 'restaurant',
    label: '🍽️ Oilaviy oshxona / Milliy choyxona',
    defaultImage: '/places/sagbon-tandir-choyxona.jpg'
  },
  {
    id: 'sightseeing',
    label: '🚶 Piyoda sayr ko‘chasi & Xiyobon',
    defaultImage: '/places/lutfiy-evening-boulevard.jpg'
  },
  {
    id: 'viewpoint',
    label: '🌅 Panorama / Quyosh botishi nuqtasi',
    defaultImage: '/places/bozsuv-meadow-trail.jpg'
  }
];

const DISTRICT_OPTIONS = [
  'Olmazor tumani (Qoraqamish)',
  'Yunusobod tumani',
  'Chilonzor tumani',
  'Mirzo Ulug‘bek tumani',
  'Shayxontohur tumani',
  'Yakkasaroy tumani',
  'Mirobod tumani',
  'Uchtepa tumani',
  'Yashnobod tumani',
  'Sergeli / Yangihayot tumani',
  'Bektemir tumani',
  'Toshkent viloyati (Bo‘stonliq / Parkent / So‘qoq)',
  'Samarqand viloyati',
  'Jizzax viloyati (Zomin)',
  'Buxoro viloyati',
  'Farg‘ona vodiysi (Farg‘ona / Andijon / Namangan)',
  'Qashqadaryo / Surxondaryo',
  'Xorazm / Qoraqalpog‘iston',
  'Navoiy / Sirdaryo'
];

export const CommunityPlacesModal: React.FC<CommunityPlacesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'add',
  onApprovedPlacesUpdated
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'admin'>(initialTab);

  // Admin verification state (only 7048168954)
  const [currentTelegramId, setCurrentTelegramId] = useState<string>('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [showAdminLoginBox, setShowAdminLoginBox] = useState<boolean>(false);
  const [adminInputId, setAdminInputId] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LocationCategory>('park_nature');
  const [district, setDistrict] = useState(DISTRICT_OPTIONS[0]);
  const [address, setAddress] = useState('');
  const [averageCheck, setAverageCheck] = useState('Bepul');
  const [tipText, setTipText] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [lat, setLat] = useState<number>(41.3111);
  const [lng, setLng] = useState<number>(69.2797);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Submission status
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Submissions list (for user status & admin moderation)
  const [submissions, setSubmissions] = useState<ClientCommunitySubmission[]>([]);
  const [loadingAdminList, setLoadingAdminList] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      // 1. Check Telegram WebApp user ID
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const tgId = tgUser?.id ? String(tgUser.id) : '';
      if (tgUser?.first_name && !submittedBy) {
        setSubmittedBy(
          `${tgUser.first_name}${tgUser.username ? ` (@${tgUser.username})` : ''}`
        );
      }

      // 2. Check URL query ?admin_id=7048168954
      const params = new URLSearchParams(window.location.search);
      const urlAdminId = params.get('admin_id') || '';
      const savedAdminId = localStorage.getItem(LOCAL_ADMIN_KEY) || '';

      const effectiveId = tgId || urlAdminId || savedAdminId;
      setCurrentTelegramId(effectiveId);

      if (effectiveId === ADMIN_TELEGRAM_ID) {
        setIsAdminUnlocked(true);
        localStorage.setItem(LOCAL_ADMIN_KEY, ADMIN_TELEGRAM_ID);
      }

      if (params.get('open_admin') === '1' && effectiveId === ADMIN_TELEGRAM_ID) {
        setActiveTab('admin');
      }
    }
  }, []);

  useEffect(() => {
    if (initialTab === 'admin' && isAdminUnlocked) {
      setActiveTab('admin');
    } else if (initialTab === 'add') {
      setActiveTab('add');
    }
  }, [initialTab, isAdminUnlocked]);

  const syncWithServer = async (adminOverrideId?: string) => {
    setLoadingAdminList(true);
    try {
      const localRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      const localList: ClientCommunitySubmission[] = localRaw ? JSON.parse(localRaw) : [];

      const activeAdminId =
        adminOverrideId || (isAdminUnlocked ? ADMIN_TELEGRAM_ID : currentTelegramId);

      const res = await fetch('/api/community-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          adminId: activeAdminId,
          submissions: localList
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.allSubmissions)) {
          setSubmissions(data.allSubmissions);
          localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(data.allSubmissions));
        } else {
          setSubmissions(localList);
        }
        if (Array.isArray(data.approvedPlaces)) {
          onApprovedPlacesUpdated?.(data.approvedPlaces);
        }
      }
    } catch {
      // Fallback to local
      try {
        const localRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
        if (localRaw) setSubmissions(JSON.parse(localRaw));
      } catch {
        // ignore
      }
    } finally {
      setLoadingAdminList(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      syncWithServer();
    }
  }, [isOpen, isAdminUnlocked]);

  if (!isOpen || !mounted) return null;

  const handleCaptureGps = () => {
    triggerHaptic('medium');
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setSubmitError('Brauzeringizda GPS aniqlash imkoni yo‘q.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setGpsCaptured(true);
        setGpsLoading(false);
        triggerHaptic('success');
      },
      () => {
        setGpsLoading(false);
        setSubmitError(
          'GPS ruxsati berilmadi. Koordinatani qo‘lda kiritishingiz yoki standart nuqtani qoldirishingiz mumkin.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    triggerHaptic('light');

    const img = new Image();
    const objUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxW = 640;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        setImagePreview(compressedDataUrl);
      }
      URL.revokeObjectURL(objUrl);
    };

    img.src = objUrl;
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    if (adminInputId.trim() === ADMIN_TELEGRAM_ID) {
      setIsAdminUnlocked(true);
      setCurrentTelegramId(ADMIN_TELEGRAM_ID);
      localStorage.setItem(LOCAL_ADMIN_KEY, ADMIN_TELEGRAM_ID);
      setAdminLoginError(null);
      setShowAdminLoginBox(false);
      setActiveTab('admin');
      syncWithServer(ADMIN_TELEGRAM_ID);
    } else {
      setAdminLoginError(
        `⛔ Ruxsat berilmadi! Admin panel faqat Bosh Admin (ID: ${ADMIN_TELEGRAM_ID}) uchun ochiq.`
      );
    }
  };

  const handleSubmitPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccessMsg(null);

    if (!title.trim() || title.trim().length < 3) {
      setSubmitError('Iltimos, joy nomini kiriting (kamida 3 ta harf).');
      return;
    }

    setSubmitting(true);
    triggerHaptic('medium');

    const selectedCatObj =
      CATEGORY_OPTIONS.find((c) => c.id === category) || CATEGORY_OPTIONS[0];
    const numericPrice = averageCheck.toLowerCase().includes('bepul')
      ? 0
      : parseInt(averageCheck.replace(/\D/g, ''), 10) || 50000;

    try {
      const res = await fetch('/api/community-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          title: title.trim(),
          category,
          categoryLabel: selectedCatObj.label,
          district,
          address: address.trim() || `${district} hududi`,
          averageCheck: averageCheck.trim() || 'Bepul',
          estimatedPrice: numericPrice,
          lat,
          lng,
          tipText:
            tipText.trim() ||
            'Foydalanuvchi tomonidan tavsiya etilgan sokin va bahavo maskan.',
          imageUrl: imagePreview || selectedCatObj.defaultImage,
          submittedBy: submittedBy.trim() || 'Xaritamiz foydalanuvchisi',
          submitterTelegramId: currentTelegramId || undefined,
          adminDirectApprove: false
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Yuborishda xatolik yuz berdi.');
        setSubmitting(false);
        return;
      }

      const newSub: ClientCommunitySubmission = data.submission;
      const updatedList = [newSub, ...submissions.filter((s) => s.id !== newSub.id)];
      setSubmissions(updatedList);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));

      triggerHaptic('success');
      setSubmitSuccessMsg(
        '⏳ Joyingiz qabul qilindi! Bosh Admin (Telegram bot va Admin panel) orqali tasdiqlangandan keyin saytga qo‘shiladi.'
      );

      // Clear form
      setTitle('');
      setAddress('');
      setTipText('');
      setImagePreview(null);
    } catch {
      setSubmitError('Tarmoq xatoligi yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModerate = async (
    sub: ClientCommunitySubmission,
    newStatus: 'approved' | 'rejected' | 'deleted'
  ) => {
    if (!isAdminUnlocked) return;
    triggerHaptic('medium');

    try {
      const res = await fetch('/api/community-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'moderate',
          adminId: ADMIN_TELEGRAM_ID,
          placeId: sub.id,
          status: newStatus,
          submissionSnapshot: sub
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.allSubmissions)) {
          setSubmissions(data.allSubmissions);
          localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(data.allSubmissions));
        }
        if (Array.isArray(data.approvedPlaces)) {
          onApprovedPlacesUpdated?.(data.approvedPlaces);
        }
        triggerHaptic('success');
      }
    } catch {
      // Fallback local update
      const next =
        newStatus === 'deleted'
          ? submissions.filter((s) => s.id !== sub.id)
          : submissions.map((s) => (s.id === sub.id ? { ...s, status: newStatus } : s));
      setSubmissions(next);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(next));
      onApprovedPlacesUpdated?.(
        next.filter((x) => x.status === 'approved').map((x) => x.location)
      );
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                ➕ Yangi "Sokin Joy" Qo‘shish
              </h3>
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                O‘zingiz bilgan yashirin bog‘, soy bo‘yi yoki sokin maskanni rasm va GPS bilan ulashing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-slate-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Yuqori Tablar: Joy qo'shish va Admin Panel (faqat 7048168954 ga ochiq) */}
        <div className="flex items-center justify-between gap-2 bg-zinc-100 dark:bg-slate-800/90 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('add');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'add'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-zinc-600 dark:text-slate-400'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>➕ Joy qo‘shish</span>
          </button>

          {isAdminUnlocked ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('admin');
                syncWithServer(ADMIN_TELEGRAM_ID);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🛡️ Admin Panel ({ADMIN_TELEGRAM_ID})</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setShowAdminLoginBox((prev) => !prev);
              }}
              className="py-2 px-3 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-slate-400 hover:text-zinc-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              title="Bosh Admin (7048168954) uchun kirish"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Admin ID tekshiruvi oynasi (agar brauzerdan kirgan bo'lsa) */}
        {showAdminLoginBox && !isAdminUnlocked && (
          <form
            onSubmit={handleUnlockAdmin}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-zinc-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Bosh Admin Paneliga kirish (Faqat Telegram ID orqali)
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={adminInputId}
                onChange={(e) => setAdminInputId(e.target.value)}
                placeholder="Telegram ID kiriting..."
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 text-xs font-semibold outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Ochish
              </button>
            </div>
            {adminLoginError && (
              <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                {adminLoginError}
              </p>
            )}
          </form>
        )}

        {/* TAB 1: FOYDALANUVCHI JOY QO'SHISH FORMASI */}
        {activeTab === 'add' && (
          <div className="space-y-4">
            {/* Moderatsiya eslatmasi */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                <b>Muhim qoida:</b> Siz qo‘shgan joy avtomatik ravishda <b>Bosh Adminning Telegram botiga</b> va <b>Admin Panelga</b> yuboriladi. <b>Admin tasdiqlagandan keyin</b> barcha foydalanuvchilar uchun saytga qo‘shiladi!
              </div>
            </div>

            {submitSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400/80 dark:border-emerald-700 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Adminga muvaffaqiyatli yuborildi!</span>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {submitSuccessMsg}
                </p>
              </div>
            )}

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-300">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmitPlace} className="space-y-3.5">
              {/* 1. Joy nomi va Toifa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    📍 Sokin joy nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Qoraqamish bo‘yidagi chinorzor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    🗂 Joy toifasi *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LocationCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Hudud va Manzil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    🏙 Tuman yoki Viloyat *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    {DISTRICT_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    📌 Aniq mo‘ljal / ko‘cha
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masalan: 2/4 dahasi, soy ko‘prigi yonida"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* 3. GPS Lokatsiya va Rasm yuklash */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      GPS Lokatsiya
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={gpsLoading}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      gpsCaptured
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100/50'
                    }`}
                  >
                    {gpsLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>GPS aniqlanmoqda...</span>
                      </>
                    ) : gpsCaptured ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>GPS aniqlandi ({lat.toFixed(3)}, {lng.toFixed(3)})</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>📍 Hozirgi GPS joyimni belgilash</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rasm yuklash */}
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200/80 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-extrabold text-zinc-800 dark:text-slate-200 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    Joy rasmi (Galereya / Kamera)
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-700 text-xs font-bold text-zinc-700 dark:text-slate-200 hover:border-emerald-400 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{imagePreview ? 'Boshqa rasm tanlash' : '📸 Rasm yuklash'}</span>
                    </button>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-9 h-9 rounded-xl object-cover border border-emerald-400 shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Narxi va Ism */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    💰 O‘rtacha xarajat
                  </label>
                  <select
                    value={averageCheck}
                    onChange={(e) => setAverageCheck(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Bepul">Bepul (Tabiat / Sayrgoh)</option>
                    <option value="25 000 — 50 000 so‘m">25 000 — 50 000 so‘m (Hamyonbop)</option>
                    <option value="50 000 — 100 000 so‘m">50 000 — 100 000 so‘m (O‘rtacha)</option>
                    <option value="100 000 — 200 000 so‘m">100 000 — 200 000 so‘m</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                    👤 Sizning ismingiz (yoki @username)
                  </label>
                  <input
                    type="text"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    placeholder="Masalan: Sardor (@sardor_uz)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* 5. Tavsif */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-slate-300 mb-1">
                  💬 Bu joy nimasi bilan sokin va yoqimli? (Tavsiya) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={tipText}
                  onChange={(e) => setTipText(e.target.value)}
                  placeholder="Masalan: Kechqurun odam kam bo‘ladi, soy bo‘yida o‘rindiqlar bor, oilaviy yoki yolg‘iz sayr uchun juda sokin joy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition active:scale-98 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adminga yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>📤 Admin tasdiqlashiga yuborish</span>
                  </>
                )}
              </button>
            </form>

            {/* Foydalanuvchining o'zi yuborgan joylari holati */}
            {submissions.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Yuborilgan joylar holati:
                </span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {submissions.slice(0, 5).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-slate-800/70 border border-zinc-200/70 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-zinc-900 dark:text-white truncate">
                          {sub.location.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {sub.location.district} • {sub.submittedBy}
                        </p>
                      </div>

                      {sub.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold shrink-0">
                          ⏳ Admin tasdiqlashi kutilmoqda
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold shrink-0">
                          ✅ Tasdiqlangan (Saytda)
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold shrink-0">
                          ❌ Rad etilgan
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOSH ADMIN PANELI (Faqat 7048168954 uchun) */}
        {activeTab === 'admin' && isAdminUnlocked && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-black block">
                    Bosh Admin Moderatsiya Paneli (ID: {ADMIN_TELEGRAM_ID})
                  </span>
                  <span className="text-[11px] text-emerald-200/80">
                    Kutilmoqda: <b>{pendingCount} ta</b> • Tasdiqlangan: <b>{approvedCount} ta</b>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncWithServer(ADMIN_TELEGRAM_ID)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAdminList ? 'animate-spin' : ''}`} />
                <span>Yangilash</span>
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-slate-800/40 border border-dashed border-zinc-200 dark:border-slate-700 space-y-2">
                <Sparkles className="w-7 h-7 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-zinc-700 dark:text-slate-300">
                  Hozircha foydalanuvchilardan yangi joy kelib tushmagan.
                </p>
                <p className="text-[11px] text-zinc-500">
                  Yangi joy qo‘shilishi bilan Telegram botingizga (7048168954) va shu panelga chiqadi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const loc = sub.location;
                  const mapUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
                  return (
                    <div
                      key={sub.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        sub.status === 'pending'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                          : sub.status === 'approved'
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-zinc-50 dark:bg-slate-800/50 border-zinc-200 dark:border-slate-700 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={loc.imageUrl}
                            alt={loc.title}
                            className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {sub.status === 'pending' && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase">
                                  ⏳ Kutilmoqda
                                </span>
                              )}
                              {sub.status === 'approved' && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                                  ✅ Tasdiqlangan
                                </span>
                              )}
                              {sub.status === 'rejected' && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase">
                                  ❌ Rad etilgan
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-zinc-500">
                                👤 {sub.submittedBy}
                              </span>
                            </div>

                            <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                              {loc.title}
                            </h4>
                            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              {loc.categoryLabel} • {loc.district} • {loc.averageCheck}
                            </p>
                          </div>
                        </div>

                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>GPS</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <p className="text-xs text-zinc-700 dark:text-slate-300 leading-relaxed">
                        {loc.tipText}
                      </p>

                      {/* Admin Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {sub.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleModerate(sub, 'approved')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✅ Tasdiqlash (Saytga qo‘shish)</span>
                          </button>
                        )}

                        {sub.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleModerate(sub, 'rejected')}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>❌ Rad etish</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleModerate(sub, 'deleted')}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          title="Butunlay o‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
