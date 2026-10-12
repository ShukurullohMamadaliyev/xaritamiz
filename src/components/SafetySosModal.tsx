'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShieldAlert,
  PhoneCall,
  MapPin,
  Send,
  MessageSquare,
  Fuel,
  Zap,
  Wrench,
  Pill,
  Stethoscope,
  Landmark,
  Navigation,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { triggerHaptic } from '../lib/utils';

interface SafetySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLat?: number;
  defaultLng?: number;
  defaultLocationName?: string;
}

const EMERGENCY_NUMBERS = [
  {
    code: '1050',
    title: 'FVV — Favqulodda Qutqaruv',
    subtitle: 'Tog‘, daryo, suv ombori va yo‘lda qutqaruv xizmati',
    badge: 'Eng muhim (Tog‘/Yo‘l)',
    color: 'rose'
  },
  {
    code: '103',
    title: 'Tez Tibbiy Yordam',
    subtitle: 'Shoshilinch shifokor va tez yordam mashinasi',
    badge: '24/7 Bepul',
    color: 'red'
  },
  {
    code: '102',
    title: 'YPX / Ichki Ishlar (Militsiya)',
    subtitle: 'Yo‘l-transport hodisasi va xavfsizlik xizmati',
    badge: '24/7 Tezkor',
    color: 'blue'
  },
  {
    code: '101',
    title: 'Yong‘in va Qutqaruv',
    subtitle: 'Yong‘in xavfsizligi va texnik yordam',
    badge: '24/7',
    color: 'amber'
  },
  {
    code: '+998712000088',
    title: 'Xavfsiz Turizm Call-Markazi',
    subtitle: 'Sayohatchilar uchun ma’lumot va yordam liniyasi',
    badge: 'Turizm SOS',
    color: 'emerald'
  }
];

export const SafetySosModal: React.FC<SafetySosModalProps> = ({
  isOpen,
  onClose,
  defaultLat = 41.3111,
  defaultLng = 69.2797,
  defaultLocationName = 'Joriy joylashuvim'
}) => {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultLat,
    lng: defaultLng
  });
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'found' | 'fallback'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setCoords({ lat: defaultLat, lng: defaultLng });

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setGpsStatus('locating');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5))
          });
          setGpsStatus('found');
        },
        () => {
          setGpsStatus('fallback');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGpsStatus('fallback');
    }
  }, [isOpen, defaultLat, defaultLng]);

  if (!mounted || !isOpen) return null;

  const googleMapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  const shareText = `🚨 Mening joriy joylashuvim (${defaultLocationName}):\n📍 Koordinata: ${coords.lat}, ${coords.lng}\n🗺️ Xaritada ochish: ${googleMapsLink}`;

  const handleShareTelegram = () => {
    triggerHaptic('medium');
    const url = `https://t.me/share/url?url=${encodeURIComponent(googleMapsLink)}&text=${encodeURIComponent(
      `🚨 Mening joriy GPS joylashuvim (${defaultLocationName}): ${coords.lat}, ${coords.lng}`
    )}`;
    window.open(url, '_blank');
  };

  const handleShareSms = () => {
    triggerHaptic('medium');
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
  };

  const handleCopyCoords = () => {
    triggerHaptic('success');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMapSearchUrl = (query: string) =>
    `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},13z`;

  const driverRadarItems = [
    {
      label: 'Zapravka (Benzin / Metan)',
      query: 'gas station zapravka metan benzin',
      icon: <Fuel className="w-4 h-4 text-amber-500" />
    },
    {
      label: 'Elektromobil Quvvatlash (EV)',
      query: 'electric vehicle charging station',
      icon: <Zap className="w-4 h-4 text-emerald-500" />
    },
    {
      label: 'USTA / Vulkanizatsiya / Evakuator',
      query: 'auto repair tire shop car service',
      icon: <Wrench className="w-4 h-4 text-blue-500" />
    },
    {
      label: '24/7 Navbatchi Dorixona',
      query: 'pharmacy apteka 24 hours',
      icon: <Pill className="w-4 h-4 text-rose-500" />
    },
    {
      label: 'Yaqin Shifoxona / Bolnitsa',
      query: 'hospital emergency clinic',
      icon: <Stethoscope className="w-4 h-4 text-red-500" />
    },
    {
      label: 'Eng Yaqin Bankomat (Naqd pul)',
      query: 'ATM bankomat',
      icon: <Landmark className="w-4 h-4 text-purple-500" />
    }
  ];

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top SOS Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 text-white p-4 sm:p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">
                🚨 Xaritamiz Xavfsizlik Qalqoni
              </span>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                Safar Xavfsizligi, SOS & Yo‘l Yordami
              </h2>
              <p className="text-[11px] text-rose-100 mt-0.5">
                Favqulodda raqamlar, GPS ulashish va yaqin zapravka/ustaxonalar
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. GPS Koordinatani Yaqinlarga Yuborish */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-800/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white">
                    📍 GPS Joylashuvni Yaqinlarga Yuborish
                  </h3>
                  <span className="text-[11px] text-zinc-500 dark:text-slate-400">
                    {gpsStatus === 'locating'
                      ? 'Aniq GPS koordinata aniqlanmoqda...'
                      : gpsStatus === 'found'
                        ? `Aniq GPS topildi: ${coords.lat}, ${coords.lng}`
                        : `Koordinata (${defaultLocationName}): ${coords.lat}, ${coords.lng}`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCoords}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-[11px] font-bold text-zinc-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleShareTelegram}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegramdan GPS yuborish</span>
              </button>

              <button
                type="button"
                onClick={handleShareSms}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>SMS orqali (Internet past bo‘lsa)</span>
              </button>
            </div>
          </div>

          {/* 2. Haydovchi va Sayohatchi Radari (Zapravka, EV, Usta, Apteka) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-slate-100 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>⛽ Yo‘lda Tezkor Qidiruv (Joriy nuqtangiz atrofida)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {driverRadarItems.map((item, idx) => (
                <a
                  key={idx}
                  href={getMapSearchUrl(item.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic('light')}
                  className="p-2.5 rounded-2xl bg-zinc-50 hover:bg-emerald-50/70 dark:bg-slate-800/70 dark:hover:bg-slate-800 border border-zinc-200/80 dark:border-slate-700/80 hover:border-emerald-300 flex items-center gap-2 transition"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-zinc-200/60 dark:border-slate-700 shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-slate-200 leading-tight">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 3. 1-Bosishda Favqulodda Raqamlar */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-slate-100 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>📞 Favqulodda Qo‘ng‘iroq (1-bosishda terish)</span>
            </h3>

            <div className="space-y-2">
              {EMERGENCY_NUMBERS.map((num) => (
                <a
                  key={num.code}
                  href={`tel:${num.code}`}
                  onClick={() => triggerHaptic('medium')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-zinc-200/80 dark:border-slate-700/80 hover:border-rose-300 flex items-center justify-between gap-3 transition shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs sm:text-sm shrink-0">
                      {num.code}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate">
                          {num.title}
                        </h4>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[9px] font-bold">
                          {num.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-slate-400 truncate">
                        {num.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Qo‘ng‘iroq</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 4. Tog' va Uzoq Yo'l Oltin Qoidalari */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/50 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tog‘ va dovon (pereval) yo‘llarida eslatma:</span>
            </div>
            <ul className="text-[11px] text-zinc-700 dark:text-slate-300 space-y-1 pl-4 list-disc">
              <li>
                <b>Tormoz tizimi:</b> Tik qiyalikdan tushayotganda faqat tormozni bosib tushmang — uzatmalar qutisini (korobka) pastki bosqichga (`L`, `2` yoki `M1/M2`) o‘tkazing.
              </li>
              <li>
                <b>Soy va dara o‘zanlari:</b> Bahor va yomg‘irli kunlarda dara (kanyon) ichida suv sathi tez ko‘tarilishi mumkin — ob-havoni tekshirib kiring.
              </li>
              <li>
                <b>Yoqilg‘i zaxirasi:</b> Tog‘ hududiga kirishdan oldin kamida yarim bak yoqilg‘i g‘amlab oling.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
