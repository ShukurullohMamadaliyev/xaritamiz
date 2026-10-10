'use client';

import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageCircle, Share2, Copy } from 'lucide-react';
import { RoutePlan } from '../types';
import { triggerHaptic } from '../lib/utils';

interface PollModalProps {
  route: RoutePlan;
  isOpen: boolean;
  onClose: () => void;
}

export const PollModal: React.FC<PollModalProps> = ({
  route,
  isOpen,
  onClose
}) => {
  // Har bir bekat uchun ovozlar holati
  const [votes, setVotes] = useState<Record<number, { yes: number; no: number; userChoice?: 'yes' | 'no' }>>(() => {
    const initial: Record<number, { yes: number; no: number }> = {};
    route.stops.forEach(s => {
      // Mock boshlang'ich ovozlar do'stlar uchun
      initial[s.stopOrder] = { 
        yes: Math.floor(Math.random() * 3) + 2, 
        no: Math.floor(Math.random() * 2) 
      };
    });
    return initial;
  });

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleVote = (stopOrder: number, choice: 'yes' | 'no') => {
    triggerHaptic('medium');
    setVotes(prev => {
      const current = prev[stopOrder] || { yes: 0, no: 0 };
      if (current.userChoice === choice) return prev; // allaqachon tanlangan

      const isSwitching = current.userChoice !== undefined;
      let newYes = current.yes;
      let newNo = current.no;

      if (isSwitching) {
        if (choice === 'yes') {
          newYes += 1;
          newNo -= 1;
        } else {
          newNo += 1;
          newYes -= 1;
        }
      } else {
        if (choice === 'yes') newYes += 1;
        else newNo += 1;
      }

      return {
        ...prev,
        [stopOrder]: {
          yes: Math.max(0, newYes),
          no: Math.max(0, newNo),
          userChoice: choice
        }
      };
    });
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareToTelegramGroup = () => {
    triggerHaptic('success');
    const text = `🗳️ *Do‘stlar, bugungi oqshom bo‘yicha kelishib olaylik!*\n\n` +
      `Taklif qilingan reja: *${route.title}*\n` +
      route.stops.map(s => `• ${s.timeSlot} — ${s.location.title}`).join('\n') +
      `\n\nQaysi joylarga boramiz? Havolaga kirib ovoz bering va fikringizni bildiring! 👇`;
    
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank');
  };

  const handleCopyLink = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto space-y-5">
        
        {/* Yopish tugmasi */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sarlavha */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/40 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guruhda ovoz berish (Poll mode)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white">
            Do‘stlar bilan kelishish
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1">
            Marshrutdagi har bir joy bo‘yicha ovoz bering va guruh a’zolarining fikrini jamlang:
          </p>
        </div>

        {/* Bekatlar bo'yicha ovoz berish ro'yxati */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {route.stops.map((stop) => {
            const stopVote = votes[stop.stopOrder] || { yes: 0, no: 0 };
            const total = stopVote.yes + stopVote.no;
            const yesPercent = total > 0 ? Math.round((stopVote.yes / total) * 100) : 50;

            return (
              <div
                key={stop.stopOrder}
                className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {stop.stopOrder}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white leading-tight">
                        {stop.location.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {stop.timeSlot} • {stop.location.categoryLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ovoz berish tugmalari */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleVote(stop.stopOrder, 'yes')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      stopVote.userChoice === 'yes'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                    <span>Boramiz ({stopVote.yes})</span>
                  </button>

                  <button
                    onClick={() => handleVote(stop.stopOrder, 'no')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      stopVote.userChoice === 'no'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>Boshqasi ({stopVote.no})</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${yesPercent}%` }}
                  />
                  <div 
                    className="bg-rose-400 h-full transition-all duration-300"
                    style={{ width: `${100 - yesPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Ma’qullandi: {yesPercent}%</span>
                  <span>Jami: {total} kishi</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Telegram Guruhiga ulashish tugmasi */}
        <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleShareToTelegramGroup}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram guruhiga ovoz berish uchun yuborish</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Havoladan nusxa olindi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Havoladan nusxa olish</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
