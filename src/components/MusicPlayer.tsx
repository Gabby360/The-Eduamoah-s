import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/wedding-music.wav');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Helper to attempt playing audio
    const attemptPlay = () => {
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay prevented by browser policy - will play on first interaction
          setIsPlaying(false);
        });
    };

    // 1. Attempt immediate autoplay when homepage loads
    attemptPlay();

    // 2. Fallback: Listen to first user interaction on page to play music immediately
    const handleFirstInteraction = () => {
      attemptPlay();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { passive: true });
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    document.addEventListener('scroll', handleFirstInteraction, { passive: true });
    document.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Audio playback error:", err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Sound Wave Equalizer + Control Pill */}
      <div
        onClick={togglePlay}
        className="group cursor-pointer flex items-center gap-3 bg-[#11221c] border border-[#f1c65a]/40 hover:border-[#f1c65a] text-[#FBF7EF] px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        title={isPlaying ? "Pause Wedding Music" : "Play Wedding Music"}
        aria-label="Toggle Wedding Music"
      >
        {/* Animated Music Disc Icon */}
        <div className={`relative flex items-center justify-center text-[#f1c65a]`}>
          <Music
            size={18}
            className={isPlaying ? 'animate-spin' : ''}
            style={{ animationDuration: '4s' }}
          />
        </div>

        {/* Status & Label */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] tracking-[0.2em] text-[#f1c65a] uppercase font-mono leading-none mb-0.5">
            {isPlaying ? 'Now Playing' : 'Background Music'}
          </span>
          <span className="text-xs font-heading tracking-wide text-[#FBF7EF] leading-none">
            Wedding Music
          </span>
        </div>

        {/* Animated Sound Wave Equalizer Bars when Playing */}
        {isPlaying && (
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
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
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
  );
};
