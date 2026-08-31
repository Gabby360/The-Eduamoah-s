// Centralized Single Global HTML5 Audio Engine for Wedding Website

type AudioStateListener = (isPlaying: boolean, isMuted: boolean) => void;

class GlobalAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private targetVolume: number = 0.5; // Comfortable background volume

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.audio) return;

    try {
      // 1. Single Global Audio Instance created and preloaded immediately
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = this.targetVolume;
      this.audio.muted = false;

      // Choose format (MP3 primary with WAV fallback)
      const canPlayMp3 = this.audio.canPlayType('audio/mpeg');
      this.audio.src = canPlayMp3 ? '/wedding-music.mp3' : '/wedding-music.wav';
    } catch (err) {
      console.warn('Global audio init notice:', err);
    }
  }

  public async play(): Promise<boolean> {
    if (!this.audio) return false;

    try {
      this.audio.volume = this.targetVolume;
      this.audio.muted = false;
      
      // Execute synchronous HTML5 audio play directly inside user interaction event handler
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      if (!this.audio.paused && this.audio.currentTime >= 0) {
        this.isPlaying = true;
        this.isMuted = false;
        this.notify();
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Playback gesture notice:', err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public async attemptPlay(): Promise<boolean> {
    return await this.play();
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying && this.audio && !this.audio.paused) {
      this.pause();
    } else {
      this.play();
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
    // Emit current state immediately to subscriber
    listener(this.isPlaying, this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying, this.isMuted));
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getIsMuted() {
    return this.isMuted;
  }
}

export const globalAudio = new GlobalAudioManager();
