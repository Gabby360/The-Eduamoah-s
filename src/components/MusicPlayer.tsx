import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Helper to attempt unmuted audio playback & Web Audio pipeline unlock
    const attemptPlay = async (): Promise<boolean> => {
      if (!audioRef.current) return false;
      try {
        // Unlock Web Audio Context for iOS Safari & Mobile Chrome
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
          const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtxClass();
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        }

        audioRef.current.volume = 0.85;
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsMuted(false);
        return true;
      } catch {
        // Fallback: try muted background playback
        try {
          audioRef.current.muted = true;
          await audioRef.current.play();
          setIsPlaying(true);
          setIsMuted(true);
        } catch {
          setIsPlaying(false);
        }
        return false;
      }
    };

    // 1. Attempt immediate playback on page load
    attemptPlay();

    // 2. Persistent user activation gesture listener for Desktop & Mobile Phones
    const handleUserGesture = async () => {
      if (audioRef.current && audioRef.current.muted) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.85;
      }
      const success = await attemptPlay();
      if (success) {
        removeListeners();
      }
    };

    // Mobile & Desktop activation events: touchstart, touchend, pointerdown, click, scroll, keydown
    const events = ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll', 'keydown'];
    const addListeners = () => {
      events.forEach((evt) => window.addEventListener(evt, handleUserGesture, { passive: true }));
    };
    const removeListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserGesture));
    };

    addListeners();

    return () => {
      removeListeners();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused && !audio.muted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 0.85;
      audio.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* HTML5 Audio Element with dual MP3/WAV sources for instant mobile streaming */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/wedding-music.mp3" type="audio/mpeg" />
        <source src="/wedding-music.wav" type="audio/wav" />
      </audio>

      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {/* Sound Wave Equalizer + Control Pill */}
        <div
          onClick={togglePlay}
          className="group cursor-pointer flex items-center gap-3 bg-[#11221c] border border-[#f1c65a]/40 hover:border-[#f1c65a] text-[#FBF7EF] px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          title={isPlaying ? "Pause Wedding Music" : "Play Wedding Music"}
          aria-label="Toggle Wedding Music"
        >
          {/* Animated Music Disc Icon */}
          <div className="relative flex items-center justify-center text-[#f1c65a]">
            <Music
              size={18}
              className={isPlaying ? 'animate-spin' : ''}
              style={{ animationDuration: '4s' }}
            />
          </div>

          {/* Status & Label */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] tracking-[0.2em] text-[#f1c65a] uppercase font-mono leading-none mb-0.5">
              {isPlaying && !isMuted ? 'Now Playing' : 'Background Music'}
            </span>
            <span className="text-xs font-heading tracking-wide text-[#FBF7EF] leading-none">
              Wedding Music
            </span>
          </div>

          {/* Animated Sound Wave Equalizer Bars when Playing */}
          {isPlaying && !isMuted && (
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <span className="w-0.5 bg-[#f1c65a] rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#f1c65a] rounded-full animate-[bounce_1.2s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#f1c65a] rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#f1c65a] rounded-full animate-[bounce_1.0s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Play/Pause Icon Button */}
          <button
            className="p-1 rounded-full text-[#f1c65a] hover:text-[#FFF] transition-colors focus:outline-none"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying && !isMuted ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
        </div>

        {/* Mute/Unmute Quick Toggle Button */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="p-2.5 bg-[#11221c] border border-[#f1c65a]/40 hover:border-[#f1c65a] text-[#f1c65a] hover:text-[#FFF] rounded-full shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>
    </>
  );
};



