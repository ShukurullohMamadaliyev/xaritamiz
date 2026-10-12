'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  MoreHorizontal,
  MoreVertical,
  Compass,
  ExternalLink,
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

const INSTALL_TARGET_URL = 'https://xaritamiz.vercel.app/?install=1';

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerNativeInstall
}) => {
  const [mounted, setMounted] = useState(false);
  const [platformTab, setPlatformTab] = useState<'ios' | 'android'>('ios');
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);
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
      if (tg && (tg.initData || tg.platform !== 'unknown')) {
        setIsInsideTelegram(true);
      }
      if (tg && typeof tg.addToHomeScreen === 'function') {
        setCanTgHomeScreen(true);
      }
    }
  }, []);

  if (!isOpen || !mounted) return null;

  /**
   * 1 bosishda to'g'ridan-to'g'ri Safari (iPhone) yoki Chrome (Android) brauzerini ochish!
   * Telegram Mini App ichida `Telegram.WebApp.openLink` tashqi tizim brauzerini (Safari/Chrome) darhol ochadi.
   */
  const handleOpenInSystemBrowser = () => {
    triggerHaptic('success');
    const tg = (window as any).Telegram?.WebApp;

    // 1. Agar Telegram Mini App ichida bo'lsa — rasmiy openLink funksiyasi Safari/Chrome'ni 1 bosishda ochadi
    if (tg && typeof tg.openLink === 'function') {
      try {
        tg.openLink(INSTALL_TARGET_URL, { try_instant_view: false });
        return;
      } catch {
        // fallback pastda
      }
    }

    // 2. iPhone'da boshqa ichki brauzerda bo'lsa x-safari-https sxemasi orqali Safari'ni ochishga urinish
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) {
      window.location.href = `x-safari-${INSTALL_TARGET_URL}`;
      setTimeout(() => {
        window.open(INSTALL_TARGET_URL, '_blank', 'noopener,noreferrer');
      }, 400);
      return;
    }

    // 3. Android'da Chrome intent orqali ochish
    if (ua.includes('android')) {
      window.location.href =
        'intent://xaritamiz.vercel.app/?install=1#Intent;scheme=https;package=com.android.chrome;end';
      setTimeout(() => {
        window.open(INSTALL_TARGET_URL, '_blank', 'noopener,noreferrer');
      }, 400);
      return;
    }

    window.open(INSTALL_TARGET_URL, '_blank', 'noopener,noreferrer');
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
                iPhone ga o‘rnatish (Safari orqali)
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Xaritamiz ilovasi bosh ekranda alohida ikonka bo‘lib turadi.
              </p>
            </div>

            {/* 1-BOSISHDA SAFARI'DA OCHISH TUGMASI */}
            <button
              type="button"
              onClick={handleOpenInSystemBrowser}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>🧭 Bosib to‘g‘ridan-to‘g‘ri Safari’da ochish</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Safari ichida qilinadigan qadamlar (3 ta nuqta + Ulashish + Add to Home Screen) */}
            <ol className="space-y-3 text-xs sm:text-sm text-emerald-50 pt-1">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="leading-relaxed">
                  Yuqoridagi{' '}
                  <b className="text-sky-300">«🧭 Safari’da ochish»</b> tugmasini bosing (yoki pastki o‘ngdagi 🧭 kompasni bosing).
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-relaxed">
                  Safari ochilgach, pastki paneldagi{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    <MoreHorizontal className="w-3.5 h-3.5 text-emerald-400 inline" /> 3 ta nuqta (•••)
                  </span>{' '}
                  va undan so‘ng{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    Ulashish <Share className="w-3.5 h-3.5 text-sky-400 inline" /> (⬆️)
                  </span>{' '}
                  tugmasini bosing.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="leading-relaxed">
                  Ochilgan menyudan pastga tushib (yoki <b>«Ko‘proq / Ещё •••»</b> ni bosib),{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> «Add to Home Screen»
                  </span>{' '}
                  (<b>«На экран Домой»</b> / <b>«Asosiy ekranga qo‘shish»</b>) ni tanlang.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="leading-relaxed">
                  Yuqori o‘ng burchakdagi{' '}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 font-black text-emerald-200">
                    «Add» («Добавить» / «Qo‘shish»)
                  </span>{' '}
                  tugmasini bosing — <b>Xaritamiz</b> ikonkasi telefoningiz ekraniga tushadi!
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
                Android ga o‘rnatish (Chrome orqali)
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Xaritamiz ilovasi telefoningiz ekranida alohida ilova bo‘lib turadi.
              </p>
            </div>

            {/* 1-BOSISHDA CHROME'DA OCHISH TUGMASI */}
            <button
              type="button"
              onClick={handleOpenInSystemBrowser}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>🌐 Bosib to‘g‘ridan-to‘g‘ri Chrome’da ochish</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </button>

            <ol className="space-y-3 text-xs sm:text-sm text-emerald-50 pt-1">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="leading-relaxed">
                  Yuqoridagi{' '}
                  <b className="text-emerald-300">«🌐 Chrome’da ochish»</b> tugmasini bosing.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-relaxed">
                  Brauzerning yuqori o‘ng burchagidagi{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    <MoreVertical className="w-3.5 h-3.5 text-emerald-400 inline" /> 3 ta nuqta (⋮)
                  </span>{' '}
                  tugmasini bosing.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="leading-relaxed">
                  Menyudan{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 font-black text-white">
                    📲 «Ilovani o‘rnatish» («Установить приложение»)
                  </span>{' '}
                  yoki <b>«Bosh ekranga qo‘shish»</b> ni tanlab, <b>«O‘rnatish»</b> ni bosing!
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Agar Telegram 8.0+ ichida addToHomeScreen funksiyasi mavjud bo'lsa */}
        {canTgHomeScreen && isInsideTelegram && (
          <button
            type="button"
            onClick={handleTelegramAddToHome}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-400/40 text-emerald-200 font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>📲 Yoki Telegram orqali Bosh ekranga qo‘shish</span>
          </button>
        )}

        {/* Tushunarli tugmasi */}
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
