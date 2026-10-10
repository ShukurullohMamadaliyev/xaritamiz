'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Sparkles, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { RoutePlan } from '../types';
import { triggerHaptic } from '../lib/utils';

interface StoryModalProps {
  route: RoutePlan;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  route,
  isOpen,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      triggerHaptic('medium');
      setIsExporting(true);
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5
      });
      
      const link = document.createElement('a');
      link.download = `xaritamiz-${route.id}.png`;
      link.href = dataUrl;
      link.click();

      triggerHaptic('success');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Story kartani yuklashda xatolik:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const cleanTag = (route.highlightTag || 'Maxsus Saralangan ✨')
    .replace(/Claude\s*AI\s*Tavsiyasi/gi, 'Maxsus Saralangan')
    .replace(/Claude\s*AI/gi, 'Maxsus')
    .replace(/\bAI\b/gi, '')
    .trim() || 'Maxsus Saralangan ✨';

  const modalContent = (
    <div
      onClick={() => {
        triggerHaptic('light');
        onClose();
      }}
      className="fixed inset-0 z-[100] w-screen h-[100dvh] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] sm:max-w-sm my-auto flex flex-col max-h-[92dvh]"
      >
        {/* Yuqori yopish paneli */}
        <div className="flex items-center justify-between mb-2.5 px-1 shrink-0">
          <span className="text-xs font-bold text-white/90 tracking-wide">
            Instagram va Telegram Story kartasi
          </span>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 9:16 Instagram Story Card (Vizual renderlanadigan qism) */}
        <div
          ref={cardRef}
          className="w-full rounded-3xl p-5 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(150deg, #051a11 0%, #0c3823 45%, #185834 80%, #05130b 100%)',
            minHeight: '420px'
          }}
        >
          {/* Bezakli fon nurlari */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Yuqori brending */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Xaritamiz" className="w-8 h-8 object-contain shrink-0" />
              <div>
                <h4 className="text-xs font-black tracking-wider uppercase text-white">Xaritamiz</h4>
                <p className="text-[10px] text-emerald-300/80 leading-none">Toshkent shahri bo‘ylab</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{cleanTag}</span>
            </div>
          </div>

          {/* Markaziy marshrut xronikasi */}
          <div className="relative z-10 my-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest">Kechki Reja</p>
              <h2 className="text-base sm:text-lg font-black leading-tight text-white mt-0.5">
                {route.title?.replace(/Claude\s*AI/gi, 'Xaritamiz')}
              </h2>
              <p className="text-[11px] text-white/60 mt-1">
                ⏱️ {route.totalDurationHours} • 💰 {route.totalEstimatedCost}
              </p>
            </div>

            {/* Bekatlar ro'yxati */}
            <div className="space-y-2 pt-1">
              {route.stops.map((stop) => (
                <div
                  key={stop.stopOrder}
                  className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {stop.stopOrder}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{stop.location.title}</span>
                      <span className="text-[10px] font-mono text-amber-300 shrink-0 ml-1">{stop.timeSlot}</span>
                    </div>
                    <p className="text-[10px] text-white/70 truncate mt-0.5">
                      💡 {stop.location.tipText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pastki futer va QR chaqiriq */}
          <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
            <div>
              <span className="font-bold text-white">Do‘stlarga ulashing:</span>
              <p className="text-[9px] text-emerald-300">@xaritamiz_bot</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[9px] font-semibold">
                Instagram Story uchun
              </span>
            </div>
          </div>

        </div>

        {/* Yuklab olish / Saqlash tugmasi */}
        <div className="mt-3 flex gap-2 shrink-0">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
          >
            {isExporting ? (
              <span>Rasm yaratilmoqda...</span>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Rasm yuklab olindi!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Story uchun rasm yuklab olish (PNG)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
