// Centralized HTML5 & Web Audio Manager for Immediate Automatic Wedding Music Playback

type AudioStateListener = (isPlaying: boolean, isMuted: boolean) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private hasAttemptedAutoplay: boolean = false;
  private targetVolume: number = 0.85;
  private fadeInterval: number | null = null;
  private gestureHandler: (() => void) | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.audio) return;

    try {
      this.audio = new Audio('/wedding-music.wav');
      this.audio.loop = true;
      this.audio.preload = 'auto';

      // 1. Listen for initial user activity on page to lift muted lock seamlessly
      this.setupGestureListeners();

      // 2. Immediate Automatic Play attempt on page load
      this.attemptAutoplay();
    } catch (err) {
      console.warn('Audio initialization notice:', err);
    }
  }

  private setupGestureListeners() {
    this.gestureHandler = () => {
      this.unmuteAndPlay();
    };

    const events = ['pointerdown', 'touchstart', 'mousedown', 'click', 'keydown', 'scroll', 'mousemove', 'wheel'];
    events.forEach((evt) => {
      window.addEventListener(evt, this.gestureHandler!, { passive: true, once: true });
    });
  }

  private removeGestureListeners() {
    if (!this.gestureHandler) return;
    const events = ['pointerdown', 'touchstart', 'mousedown', 'click', 'keydown', 'scroll', 'mousemove', 'wheel'];
    events.forEach((evt) => {
      window.removeEventListener(evt, this.gestureHandler!);
    });
    this.gestureHandler = null;
  }

  public async attemptAutoplay() {
    if (!this.audio || this.hasAttemptedAutoplay) return;
    this.hasAttemptedAutoplay = true;

    // Strategy 1: Attempt immediate unmuted autoplay on load
    try {
      this.audio.volume = this.targetVolume;
      this.audio.muted = false;
      await this.audio.play();
      this.isPlaying = true;
      this.isMuted = false;
      this.notify();
      this.removeGestureListeners();
      return;
    } catch {
      // Unmuted autoplay blocked by browser policy
    }

    // Strategy 2: Muted Autoplay on load (Browsers 100% allow muted auto-start!)
    try {
      this.audio.muted = true;
      await this.audio.play();
      this.isPlaying = true;
      this.isMuted = true;
      this.notify();
      // Track is now automatically streaming in background. Next movement/scroll unmutes it instantly!
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }

  public async unmuteAndPlay() {
    if (!this.audio) return;

    // Resume Web Audio Context if present
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    }

    try {
      this.audio.muted = false;
      this.isMuted = false;
      this.audio.volume = this.targetVolume;

      if (this.audio.paused) {
        await this.audio.play();
      }

      this.isPlaying = true;
      this.notify();
      this.removeGestureListeners();
    } catch (err) {
      console.warn('Playback error:', err);
    }
  }

  public async play() {
    await this.unmuteAndPlay();
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying && !this.audio?.paused) {
      this.pause();
    } else {
      this.unmuteAndPlay();
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

export const audioManager = new AudioManager();
