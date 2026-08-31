import React, { useEffect, useState, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
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

  // Click/touch outside handler to collapse panel back into the single button
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

  // Main single button tap -> toggles panel open/close
  const handleMainButtonTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPanelOpen((prev) => !prev);
  };

  // Play / Pause Action
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    globalAudio.togglePlay();
  };

  // Mute / Unmute Action (does not pause song!)
  const handleMuteUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    globalAudio.toggleMute();
  };

  // Turn Music Off & Close Panel
  const handleTurnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    globalAudio.pause();
    setIsPanelOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40 select-none">
      {/* SINGLE UNIFIED FLOATING LUXURY MUSIC BAR */}
      <div className="flex items-center p-1 bg-[#060e0a]/95 border border-[#F5E6BE]/40 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300">
        
        {/* MAIN SINGLE MUSIC BUTTON (Always visible when closed) */}
        <button
          onClick={handleMainButtonTap}
          className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none"
          title={isPanelOpen ? 'Close Controls' : 'Music Controls'}
          aria-label="Music Controls"
        >
          {/* Subtle Gold Pulse Ring when playing & audible & panel is closed */}
          {isPlaying && !isMuted && !isPanelOpen && (
            <span className="absolute inset-0 rounded-full border border-[#F5E6BE]/40 animate-ping opacity-30 pointer-events-none" />
          )}

          {/* Main Icon: VolumeX when muted, Spinning Music note when playing */}
          {isMuted ? (
            <VolumeX size={18} className="text-[#F5E6BE]/60" />
          ) : (
            <Music
              size={18}
              className={isPlaying ? 'text-[#F5E6BE] animate-spin' : 'text-[#F5E6BE]/70'}
              style={isPlaying ? { animationDuration: '6s' } : {}}
            />
          )}
        </button>

        {/* EXPANDABLE ADDITIONAL CONTROLS (Smooth horizontal reveal when open) */}
        <div
          className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out origin-right ${
            isPanelOpen
              ? 'max-w-[140px] opacity-100 ml-1.5 pr-1'
              : 'max-w-0 opacity-0 ml-0 pr-0 pointer-events-none'
          }`}
        >
          {/* Subtle Divider */}
          <div className="w-[1px] h-4 bg-[#F5E6BE]/20 mr-1" />

          {/* 1. Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#11221c] text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none"
            title={isPlaying && !isMuted ? 'Pause' : 'Play'}
            aria-label={isPlaying && !isMuted ? 'Pause' : 'Play'}
          >
            {isPlaying && !isMuted ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* 2. Mute / Unmute Button */}
          <button
            onClick={handleMuteUnmute}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#11221c] text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={14} className="text-[#F5E6BE]/60" /> : <Volume2 size={14} />}
          </button>

          {/* 3. Close / Turn Music Off Button */}
          <button
            onClick={handleTurnOff}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#11221c] text-[#F5E6BE]/70 hover:text-[#FFF] hover:scale-105 transition-all duration-200 focus:outline-none"
            title="Turn Music Off"
            aria-label="Turn Music Off"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
