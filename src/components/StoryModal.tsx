'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Sparkles, Compass, Check, Share2 } from 'lucide-react';
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

  if (!isOpen) return null;

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
      link.download = `bugun-qayerga-${route.id}.png`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm my-auto">
        
        {/* Yopish tugmasi */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Instagram Story Card (Vizual renderlanadigan qism) */}
        <div
          ref={cardRef}
          className="w-full aspect-[9/16] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(150deg, #051a11 0%, #0c3823 45%, #185834 80%, #05130b 100%)'
          }}
        >
          {/* Bezakli fon nurlari */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Yuqori brending */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-emerald-400/40 flex items-center justify-center shrink-0">
                <img src="/logo-icon.png" alt="Xaritamiz" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider uppercase text-white">Xaritamiz</h4>
                <p className="text-[10px] text-emerald-300/80 leading-none">Tashkent City Guide</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{route.highlightTag}</span>
            </div>
          </div>

          {/* Markaziy marshrut xronikasi */}
          <div className="relative z-10 my-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest">Kechki Reja</p>
              <h2 className="text-lg font-black leading-tight text-white mt-0.5">
                {route.title}
              </h2>
              <p className="text-[11px] text-white/60 mt-1">
                ⏱️ {route.totalDurationHours} • 💰 {route.totalEstimatedCost}
              </p>
            </div>

            {/* Bekatlar ro'yxati */}
            <div className="space-y-2.5 pt-2">
              {route.stops.map((stop) => (
                <div
                  key={stop.stopOrder}
                  className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
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
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
            <div>
              <span className="font-bold text-white">Do‘stlarga ulashing:</span>
              <p className="text-[9px] text-emerald-300">@xaritamiz_bot</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[9px] font-semibold">
                Instagram Story uchun
              </span>
            </div>
          </div>

        </div>

        {/* Yuklab olish / Saqlash tugmasi */}
        <div className="mt-4 flex gap-2">
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
                <span>Instagram Story uchun rasm yuklab olish (PNG)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
