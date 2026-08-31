import React, { useEffect, useState, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { globalAudio } from '../utils/audioManager';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to single global audio instance state
    const unsubscribe = globalAudio.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });

    // Track scroll position to transition from beside Hero title to floating corner control
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
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

  const isAudioActive = isPlaying && !isMuted;

  return (
    <div
      ref={containerRef}
      className={`select-none transition-all duration-500 z-40 ${
        isScrolledPastHero
          ? 'fixed bottom-5 right-4 sm:bottom-8 sm:right-8 left-auto top-auto'
          : 'fixed top-[calc(100vh-148px)] left-[calc(50%+115px)] sm:left-[calc(50%+150px)] md:left-[calc(50%+220px)] lg:left-[calc(50%+270px)] xl:left-[calc(50%+325px)]'
      }`}
    >
      <style>{`
        /* Smooth Gentle Vertical Floating Animation (4-8px) when music is playing */
        @keyframes musicFloatGentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-music-gentle-float {
          animation: musicFloatGentle 3.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-music-gentle-float {
            animation: none !important;
          }
        }
      `}</style>

      {/* SINGLE UNIFIED COMPACT LUXURY MUSIC CAPSULE (Beside THE EDUAMOAH'S, Expands Vertically Upward) */}
      <div
        className={`flex flex-col-reverse items-center p-0.5 bg-[#060e0a]/95 border border-[#F5E6BE]/40 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 ${
          isAudioActive ? 'animate-music-gentle-float' : ''
        }`}
      >
        {/* MAIN SINGLE COMPACT MUSIC BUTTON (w-8 h-8 = 32px) */}
        <button
          onClick={handleMainButtonTap}
          className="relative flex items-center justify-center w-8 h-8 rounded-full text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none shrink-0 z-10"
          title={isPanelOpen ? 'Close Controls' : 'Music Controls'}
          aria-label="Music Controls"
        >
          {/* Subtle Gold Pulse Ring when playing & audible & panel is closed */}
          {isAudioActive && !isPanelOpen && (
            <span className="absolute inset-0 rounded-full border border-[#F5E6BE]/40 animate-ping opacity-30 pointer-events-none" />
          )}

          {/* Main Icon: VolumeX when muted, Spinning Music note when playing */}
          {isMuted ? (
            <VolumeX size={15} className="text-[#F5E6BE]/60" />
          ) : (
            <Music
              size={15}
              className={isPlaying ? 'text-[#F5E6BE] animate-spin' : 'text-[#F5E6BE]/70'}
              style={isPlaying ? { animationDuration: '6s' } : {}}
            />
          )}
        </button>

        {/* EXPANDABLE COMPACT ADDITIONAL CONTROLS (Unfolds Vertically Upward) */}
        <div
          className={`flex flex-col-reverse items-center gap-1.5 overflow-hidden transition-all duration-300 ease-out origin-bottom ${
            isPanelOpen
              ? 'max-h-[140px] opacity-100 mb-1 pt-1.5'
              : 'max-h-0 opacity-0 mb-0 pt-0 pointer-events-none'
          }`}
        >
          {/* 3. Close / Turn Music Off Button */}
          <button
            onClick={handleTurnOff}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#11221c] text-[#F5E6BE]/70 hover:text-[#FFF] hover:scale-105 transition-all duration-200 focus:outline-none shrink-0"
            title="Turn Music Off"
            aria-label="Turn Music Off"
          >
            <X size={12} />
          </button>

          {/* 2. Mute / Unmute Button */}
          <button
            onClick={handleMuteUnmute}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#11221c] text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none shrink-0"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Mute Sound"
          >
            {isMuted ? <VolumeX size={12} className="text-[#F5E6BE]/60" /> : <Volume2 size={12} />}
          </button>

          {/* 1. Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#11221c] text-[#F5E6BE] hover:scale-105 transition-all duration-200 focus:outline-none shrink-0"
            title={isPlaying && !isMuted ? 'Pause' : 'Play'}
            aria-label="Play"
          >
            {isPlaying && !isMuted ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>

          {/* Subtle Horizontal Divider */}
          <div className="w-3.5 h-[1px] bg-[#F5E6BE]/20 mb-0.5" />
        </div>
      </div>
    </div>
  );
};
