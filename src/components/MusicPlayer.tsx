import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { globalAudio } from '../utils/audioManager';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Subscribe to single global audio instance state
    const unsubscribe = globalAudio.subscribe((playing, muted, lastError) => {
      setIsPlaying(playing);
      setIsMuted(muted);
      setErrorMsg(lastError);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.togglePlay();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.toggleMute();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Sound Wave Equalizer + Control Pill */}
      <div
        onClick={togglePlay}
        className="group cursor-pointer flex items-center gap-3 bg-[#11221c] border border-[#f1c65a]/40 hover:border-[#f1c65a] text-[#FBF7EF] px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        title={isPlaying ? "Pause Wedding Music" : errorMsg ? `Playback Notice: ${errorMsg}` : "Play Wedding Music"}
        aria-label="Toggle Wedding Music"
      >
        {/* Animated Music Disc Icon */}
        <div className="relative flex items-center justify-center text-[#f1c65a]">
          <Music
            size={18}
            className={isPlaying && !isMuted ? 'animate-spin' : ''}
            style={{ animationDuration: '4s' }}
          />
        </div>

        {/* Status & Label */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] tracking-[0.2em] text-[#f1c65a] uppercase font-mono leading-none mb-0.5">
            {isPlaying && !isMuted ? 'Now Playing' : errorMsg ? 'Tap to Play' : 'Background Music'}
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
  );
};
