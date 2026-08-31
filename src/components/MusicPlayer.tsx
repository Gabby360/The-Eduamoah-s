import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sliders } from 'lucide-react';
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

  // Click/touch outside handler to close panel smoothly without changing playback or mute state
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

  // PRIMARY SPEAKER BUTTON: Direct 1-Tap Mute / Unmute Toggle (Does NOT pause or reset audio)
  const handleSpeakerTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    globalAudio.toggleMute();
  };

  // MINI OPTIONS TRIGGER: Toggles expanded control panel
  const handleTogglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPanelOpen((prev) => !prev);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    globalAudio.togglePlay();
  };

  const handleTurnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
          title={isPlaying ? 'Pause Music' : 'Play Music'}
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
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

      {/* ── MAIN FLOATING BUTTON GROUP (SPEAKER MUTE TOGGLE + MINI PANEL TRIGGER) ── */}
      <div className="flex items-center gap-1 p-1 bg-[#060e0a]/90 border border-[#F5E6BE]/40 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:scale-105">
        
        {/* PRIMARY SPEAKER BUTTON (Direct 1-Tap Mute/Unmute Toggle) */}
        <button
          onClick={handleSpeakerTap}
          className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#F5E6BE] hover:text-[#FFF] transition-all duration-300 focus:outline-none"
          title={isMuted ? 'Unmute Music (🔊)' : 'Mute Music (🔇)'}
          aria-label={isMuted ? 'Unmute Music' : 'Mute Music'}
        >
          {/* Subtle Animated Gold Pulse Halo when Audible & Playing */}
          {isPlaying && !isMuted && (
            <span className="absolute inset-0 rounded-full border border-[#F5E6BE]/40 animate-ping opacity-30 pointer-events-none" />
          )}

          {/* Icon state synchronized with audio.muted */}
          {isMuted ? (
            <VolumeX size={19} className="text-[#F5E6BE]/60" />
          ) : (
            <Volume2 size={19} className="text-[#F5E6BE]" />
          )}
        </button>

        {/* MINI EXPAND OPTIONS TRIGGER */}
        <button
          onClick={handleTogglePanel}
          className="flex items-center justify-center w-6 h-10 rounded-full text-[#F5E6BE]/50 hover:text-[#F5E6BE] transition-colors focus:outline-none pr-1"
          title="Music Controls"
          aria-label="Music Controls"
        >
          <Sliders size={13} />
        </button>
      </div>
    </div>
  );
};
