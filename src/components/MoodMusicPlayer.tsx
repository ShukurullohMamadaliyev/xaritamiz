'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VolumeX, Music } from 'lucide-react';
import { MOOD_TRACKS, MusicMood } from '../lib/musicMood';
import { triggerHaptic } from '../lib/utils';

interface MoodMusicPlayerProps {
  mood: MusicMood;
  moodRevision?: number;
  onChangeMood?: (mood: MusicMood) => void;
}

const SOFT_BACKGROUND_VOLUME = 0.22;

export const MoodMusicPlayer: React.FC<MoodMusicPlayerProps> = ({
  mood,
  moodRevision = 0,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMoodToast, setShowMoodToast] = useState(false);
  const prevMoodRef = useRef<MusicMood>(mood);
  const prevRevisionRef = useRef<number>(moodRevision);
  const userMutedRef = useRef(false);
  const trackIndexMapRef = useRef<Record<string, number>>({
    quiet_nature: 0,
  });

  const track = MOOD_TRACKS[mood] || MOOD_TRACKS.welcome;

  // Boshlang'ich avtomatik ijro + birinchi teginishda ishga tushirish (autoplay fallback)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = SOFT_BACKGROUND_VOLUME;

    const tryPlay = () => {
      if (userMutedRef.current || !audioRef.current) return;
      audioRef.current.volume = SOFT_BACKGROUND_VOLUME;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Brauzer birinchi bosishni kutmoqda
        });
    };

    tryPlay();

    const handleFirstInteraction = () => {
      if (!userMutedRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = SOFT_BACKGROUND_VOLUME;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Kayfiyat (mood) o'zgarganda yoki qayta tanlanganda (oilaviy uchun navbatma-navbat) trekni yangilash
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTrack = MOOD_TRACKS[mood] || MOOD_TRACKS.welcome;
    const isDifferentMood = prevMoodRef.current !== mood;
    const isRevisionChanged = prevRevisionRef.current !== moodRevision;
    prevMoodRef.current = mood;
    prevRevisionRef.current = moodRevision;

    if (!isDifferentMood && !isRevisionChanged) return;

    // Agar ushbu kayfiyatda 1 tadan ko'p musiqa bo'lsa (masalan: oilaviy -> oilaviy.mp3 va welcome.mp3), navbat bilan almashtiramiz
    let chosenSrc = nextTrack.src;
    if (nextTrack.sources && nextTrack.sources.length > 1) {
      const currentIdx = trackIndexMapRef.current[mood] ?? 0;
      chosenSrc = nextTrack.sources[currentIdx % nextTrack.sources.length];
      trackIndexMapRef.current[mood] = (currentIdx + 1) % nextTrack.sources.length;
    } else if (!isDifferentMood) {
      // Bitta musiqali bo'lim qayta bosilsa, o'zini davom ettiraveradi
      return;
    }

    setShowMoodToast(true);
    const timer = setTimeout(() => setShowMoodToast(false), 3000);

    audio.src = chosenSrc;
    audio.volume = SOFT_BACKGROUND_VOLUME;

    if (!userMutedRef.current) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }

    return () => clearTimeout(timer);
  }, [mood, moodRevision]);

  // Qo'shiq tugaganda: agar 2 ta musiqa bo'lsa (oilaviy), ikkinchisiga o'tadi; 1 ta bo'lsa qaytadan boshlaydi
  const handleTrackEnded = () => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return;

    const currentTrackInfo = MOOD_TRACKS[mood] || MOOD_TRACKS.welcome;
    if (currentTrackInfo.sources && currentTrackInfo.sources.length > 1) {
      const idx = trackIndexMapRef.current[mood] ?? 0;
      const nextSrc = currentTrackInfo.sources[idx % currentTrackInfo.sources.length];
      trackIndexMapRef.current[mood] = (idx + 1) % currentTrackInfo.sources.length;
      audio.src = nextSrc;
    } else {
      audio.currentTime = 0;
    }
    audio.volume = SOFT_BACKGROUND_VOLUME;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  const toggleMute = () => {
    triggerHaptic('light');
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted || audio.paused) {
      userMutedRef.current = false;
      setIsMuted(false);
      audio.muted = false;
      audio.volume = SOFT_BACKGROUND_VOLUME;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      userMutedRef.current = true;
      setIsMuted(true);
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={MOOD_TRACKS.welcome.src}
        onEnded={handleTrackEnded}
        preload="metadata"
        playsInline
      />

      {/* Navbar ichidagi Musiqa Tugmasi */}
      <button
        type="button"
        onClick={toggleMute}
        title={isMuted ? 'Musiqani yoqish' : `${track.label} (O‘chirish uchun bosing)`}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
          !isMuted && isPlaying
            ? 'bg-emerald-50/90 hover:bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/70 shadow-[0_2px_10px_rgba(16,185,129,0.15)]'
            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800/80 text-zinc-500 dark:text-slate-400 border-zinc-200/70 dark:border-slate-700/60'
        }`}
      >
        {!isMuted && isPlaying ? (
          <>
            <span className="text-xs leading-none">{track.emoji}</span>
            <span className="hidden md:inline max-w-[110px] truncate">
              {track.shortLabel}
            </span>
            {/* Jonli ekvalayzer ustunlari */}
            <span className="flex items-end gap-[2px] h-3 px-0.5">
              <span className="w-[2.5px] bg-emerald-600 dark:bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2.5" />
              <span className="w-[2.5px] bg-emerald-600 dark:bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
              <span className="w-[2.5px] bg-emerald-600 dark:bg-emerald-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-1.5" />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline text-[11px]">Musiqa</span>
          </>
        )}
      </button>

      {/* Kayfiyat musiqasi almashganda suzib chiquvchi chiroyli bildirishnoma */}
      {showMoodToast && !isMuted && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900/90 dark:bg-emerald-950/95 text-white text-xs font-medium shadow-lg border border-white/10 backdrop-blur-md">
            <Music className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            <span>
              Kayfiyat musiqasi: <b>{track.emoji} {track.label}</b>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
