'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  Compass,
  Check,
  Copy,
  Download,
  Sparkles
} from 'lucide-react';
import { triggerHaptic } from '../lib/utils';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerNativeInstall?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerNativeInstall
}) => {
  const [mounted, setMounted] = useState(false);
  const [platformTab, setPlatformTab] = useState<'ios' | 'android'>('ios');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [canTgHomeScreen, setCanTgHomeScreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('android')) {
        setPlatformTab('android');
      } else {
        setPlatformTab('ios');
      }

      const tg = (window as any).Telegram?.WebApp;
      if (tg && typeof tg.addToHomeScreen === 'function') {
        setCanTgHomeScreen(true);
      }
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const handleCopyUrl = () => {
    triggerHaptic('success');
    const url = 'https://xaritamiz.vercel.app';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleTelegramAddToHome = () => {
    triggerHaptic('medium');
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && typeof tg.addToHomeScreen === 'function') {
        tg.addToHomeScreen();
      }
    } catch {
      // ignore
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#0d1f17] text-white rounded-t-3xl sm:rounded-3xl border border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yuqori qism: Ilova ikonkasi ko'rinishi va Yopish */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#071510] border-2 border-emerald-400/50 p-1.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <img
                src="/logo-icon.png"
                alt="Xaritamiz"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Bosh ekranga ikonka
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                📲 Telefonga o‘rnatish
              </h3>
              <p className="text-xs text-emerald-200/80">
                Xaritamiz ilovasi bosh ekranda alohida ikonka bo‘lib turadi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-emerald-100 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agar Chrome/Android avto-o'rnatish (beforeinstallprompt) tayyor bo'lsa */}
        {deferredPrompt && onTriggerNativeInstall && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('success');
              onTriggerNativeInstall();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>⚡ Hozir 1 bosishda telefonga o‘rnatish</span>
          </button>
        )}

        {/* Agar Telegram 8.0+ ichida addToHomeScreen funksiyasi mavjud bo'lsa */}
        {canTgHomeScreen && (
          <button
            type="button"
            onClick={handleTelegramAddToHome}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400/50 text-emerald-200 font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>📲 Telegram orqali Bosh ekranga qo‘shish</span>
          </button>
        )}

        {/* Platforma tanlash: iPhone vs Android */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-black/35 border border-emerald-500/25">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setPlatformTab('ios');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              platformTab === 'ios'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-100/75 hover:text-white'
            }`}
          >
            <span>🍎 iPhone ga o‘rnatish</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setPlatformTab('android');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              platformTab === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-100/75 hover:text-white'
            }`}
          >
            <span>🤖 Android ga o‘rnatish</span>
          </button>
        </div>

        {/* 🍎 iPHONE (iOS) BO'YICHA ANIQ QO'LLANMA */}
        {platformTab === 'ios' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/25 space-y-3.5">
            <div>
              <h4 className="text-base font-black text-white">
                iPhone ga o‘rnatish
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Xaritamiz ilovasi bosh ekranda alohida ikonka bo‘lib turadi.
              </p>
            </div>

            {/* Telegram ichidan kirganlar uchun muhim eslatma */}
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-start gap-2.5">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-100 leading-relaxed">
                <b>Telegram ichida bo‘lsangiz:</b> Avval ekranning eng pastki o‘ng burchagidagi{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold">
                  🧭 Kompas (Safari)
                </span>{' '}
                tugmasini (yoki tepada <b>••• → Open in Safari</b>) bosing.
              </p>
            </div>

            {/* 3 ta qadam */}
            <ol className="space-y-3 text-xs sm:text-sm text-emerald-50">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="leading-relaxed">
                  Pastdagi{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    Ulashish <Share className="w-3.5 h-3.5 text-sky-400 inline" /> (⬆️)
                  </span>{' '}
                  tugmasini bosing.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-relaxed">
                  Ochilgan menyudan pastroqqa tushib,{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> «Add to Home Screen»
                  </span>{' '}
                  (yoki <b>«На экран Домой»</b> / <b>«Asosiy ekranga qo‘shish»</b>) ni tanlang.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="leading-relaxed">
                  Yuqori o‘ng burchakdagi{' '}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 font-black text-emerald-200">
                    «Add» («Добавить»)
                  </span>{' '}
                  ni bosing — <b>Xaritamiz</b> ikonkasi bosh ekranga qo‘shiladi!
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* 🤖 ANDROID BO'YICHA ANIQ QO'LLANMA */}
        {platformTab === 'android' && (
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/25 space-y-3.5">
            <div>
              <h4 className="text-base font-black text-white">
                Android ga o‘rnatish
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Xaritamiz ilovasi telefoningiz ekranida alohida ilova bo‘lib turadi.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-start gap-2.5">
              <MoreVertical className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-100 leading-relaxed">
                <b>Telegram ichida bo‘lsangiz:</b> Yuqori o‘ng burchakdagi{' '}
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold">
                  ⋮ (Uch nuqta)
                </span>{' '}
                tugmasini bosib, <b>«Add to Home Screen»</b> yoki <b>«Open in Chrome»</b> ni tanlang.
              </p>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-emerald-50">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="leading-relaxed">
                  Brauzerning yuqori o‘ng burchagidagi{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    <MoreVertical className="w-3.5 h-3.5 text-emerald-400 inline" /> menyu (⋮)
                  </span>{' '}
                  tugmasini bosing.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-relaxed">
                  Ro‘yxatdan{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    📲 «Ilovani o‘rnatish» («Установить приложение»)
                  </span>{' '}
                  yoki <b>«Bosh ekranga qo‘shish»</b> ni tanlang.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="leading-relaxed">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 font-black text-emerald-200">
                    «O‘rnatish» («Установить»)
                  </span>{' '}
                  ni bosing — <b>Xaritamiz</b> ikonkasi asosiy ekranga qo‘shiladi!
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Havolani nusxalash (Safari/Chrome da ochish uchun qulaylik) */}
        <button
          type="button"
          onClick={handleCopyUrl}
          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {copiedUrl ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Havola nusxalandi! Endi Safari yoki Chrome’da oching</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔗 Sayt havolasini nusxalash (Safari / Chrome uchun)</span>
            </>
          )}
        </button>

        {/* Tushunarli tugmasi (Xuddi skrinshotdagidek yashil katta tugma) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition active:scale-98 cursor-pointer"
        >
          Tushunarli
        </button>
      </div>
    </div>,
    document.body
  );
};
