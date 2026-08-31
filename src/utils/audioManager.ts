// Centralized Single Global HTML5 Audio Engine for Wedding Website (Mobile iOS & Android Optimized)

export interface AudioDiagnosticState {
  userAgent: string;
  src: string;
  currentSrc: string;
  readyState: number;
  networkState: number;
  paused: boolean;
  muted: boolean;
  volume: number;
  error: { code: number; message: string } | null;
  playResult: string;
}

type AudioStateListener = (
  isPlaying: boolean,
  isMuted: boolean,
  diagnostics: AudioDiagnosticState
) => void;

class GlobalAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private targetVolume: number = 0.5;
  private playResult: string = 'NOT ATTEMPTED YET';

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.audio) return;

    try {
      // 1. Single persistent DOM audio element attached to document body
      const audioEl = document.createElement('audio');
      audioEl.id = 'wedding-global-audio';
      audioEl.setAttribute('playsinline', 'true');
      audioEl.setAttribute('webkit-playsinline', 'true');
      audioEl.loop = true;
      audioEl.preload = 'auto';
      audioEl.volume = this.targetVolume;
      audioEl.muted = false;
      audioEl.style.display = 'none';

      // Primary web-safe source
      audioEl.src = '/wedding-music.mp3';

      if (document.body) {
        document.body.appendChild(audioEl);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(audioEl);
        });
      }

      // Explicitly load buffer immediately so readyState warms up before user click
      audioEl.load();

      this.audio = audioEl;
    } catch (err) {
      console.warn('Audio element init notice:', err);
    }
  }

  public getDiagnostics(): AudioDiagnosticState {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      src: this.audio?.src || '/wedding-music.mp3',
      currentSrc: this.audio?.currentSrc || '',
      readyState: this.audio?.readyState ?? 0,
      networkState: this.audio?.networkState ?? 0,
      paused: this.audio?.paused ?? true,
      muted: this.audio?.muted ?? false,
      volume: this.audio?.volume ?? 0.5,
      error: this.audio?.error ? { code: this.audio.error.code, message: this.audio.error.message } : null,
      playResult: this.playResult,
    };
  }

  // Synchronous play call executing audio.play() on line 1 inside the user click event call stack
  public playDirect(): Promise<boolean> {
    if (!this.audio) {
      this.init();
    }
    if (!this.audio) {
      this.playResult = 'ERROR: HTMLAudioElement not initialized';
      this.notify();
      return Promise.resolve(false);
    }

    // Ensure audible volume and unmuted state synchronously
    this.audio.muted = false;
    this.audio.volume = this.targetVolume;

    // Call audio.play() SYNCHRONOUSLY inside user gesture click event call stack
    const playPromise = this.audio.play();

    if (playPromise === undefined) {
      this.isPlaying = !this.audio.paused;
      this.playResult = this.isPlaying ? 'MUSIC PLAYBACK SUCCESS' : 'PLAY RETURNED UNDEFINED';
      this.notify();
      return Promise.resolve(this.isPlaying);
    }

    return playPromise
      .then(() => {
        this.isPlaying = !this.audio?.paused;
        this.playResult = 'MUSIC PLAYBACK SUCCESS';
        this.notify();
        return true;
      })
      .catch((err: any) => {
        const errName = err?.name || 'UnknownError';
        const errMsg = err?.message || String(err);
        this.isPlaying = false;
        this.playResult = `PLAY REJECTED -> ${errName}: ${errMsg}`;
        console.error('[MOBILE AUDIO PLAY REJECTED]', errName, errMsg);
        this.notify();
        return false;
      });
  }

  public async play(): Promise<boolean> {
    return await this.playDirect();
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.playResult = 'PAUSED';
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying && this.audio && !this.audio.paused) {
      this.pause();
    } else {
      this.playDirect();
    }
  }

  public toggleMute() {
    if (!this.audio) return;
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.notify();
  }

  public subscribe(listener: AudioStateListener) {
    this.listeners.add(listener);
    listener(this.isPlaying, this.isMuted, this.getDiagnostics());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const diag = this.getDiagnostics();
    this.listeners.forEach((listener) => listener(this.isPlaying, this.isMuted, diag));
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getIsMuted() {
    return this.isMuted;
  }
}

export const globalAudio = new GlobalAudioManager();
