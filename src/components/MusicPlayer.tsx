import React, { useEffect, useState, useRef } from 'react';
import { Music, Play, Pause, VolumeX } from 'lucide-react';
import { globalAudio } from '../utils/audioManager';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to single global audio instance state
    const unsubscribe = globalAudio.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Click/touch outside handler to close panel smoothly without pausing music
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleTogglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPanelOpen((prev) => !prev);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.togglePlay();
  };

  const handleTurnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.pause();
    setIsPanelOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* ── EXPANDED MINIMAL LUXURY CONTROL PANEL (Pop-over) ── */}
      <div
        className={`mb-3 flex items-center gap-1.5 p-1.5 bg-[#060e0a]/95 border border-[#F5E6BE]/30 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 transform origin-bottom-right ${
          isPanelOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Play / Pause Toggle Button */}
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#11221c] border border-[#F5E6BE]/40 hover:border-[#F5E6BE] text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none"
          title={isPlaying && !isMuted ? 'Pause Music' : 'Play Music'}
          aria-label={isPlaying && !isMuted ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying && !isMuted ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>

        {/* Turn Music Off Button */}
        <button
          onClick={handleTurnOff}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#11221c] border border-[#F5E6BE]/40 hover:border-[#F5E6BE] text-[#F5E6BE]/80 hover:text-[#FFF] hover:scale-105 transition-all duration-200 focus:outline-none"
          title="Turn Music Off"
          aria-label="Turn Music Off"
        >
          <VolumeX size={15} />
        </button>
      </div>

      {/* ── SINGLE FLOATING MINIMAL MUSIC ICON BUTTON ── */}
      <button
        onClick={handleTogglePanel}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#060e0a]/90 border border-[#F5E6BE]/40 hover:border-[#F5E6BE] text-[#F5E6BE] shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none group"
        title="Music Controls"
        aria-label="Music Controls"
      >
        {/* Subtle Animated Gold Pulse Halo when Music is Playing */}
        {isPlaying && !isMuted && (
          <span className="absolute inset-0 rounded-full border border-[#F5E6BE]/40 animate-ping opacity-30 pointer-events-none" />
        )}

        {/* Floating Minimal Icon */}
        <Music
          size={18}
          className={`transition-all duration-500 ${
            isPlaying && !isMuted ? 'text-[#F5E6BE] animate-spin' : 'text-[#F5E6BE]/60'
          }`}
          style={isPlaying && !isMuted ? { animationDuration: '6s' } : {}}
        />
      </button>
    </div>
  );
};
