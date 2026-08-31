// Centralized Single Global HTML5 Audio Engine for Wedding Website Autoplay

type AudioStateListener = (isPlaying: boolean, isMuted: boolean) => void;

class GlobalAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private targetVolume: number = 0.5; // Pleasant, comfortable background level
  private userInteractionHandler: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.audio) return;

    try {
      // 1. Single Global Audio Instance
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = this.targetVolume;
      this.audio.muted = false;

      // Choose format (MP3 primary with WAV fallback)
      const canPlayMp3 = this.audio.canPlayType('audio/mpeg');
      this.audio.src = canPlayMp3 ? '/wedding-music.mp3' : '/wedding-music.wav';

      // 2. Controlled Autoplay Attempt 1: Immediate on creation
      this.attemptPlay();

      // 3. Controlled Autoplay Attempt 2: When audio data is ready
      const handleCanPlay = () => {
        if (!this.isPlaying) {
          this.attemptPlay();
        }
      };
      this.audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      this.audio.addEventListener('loadeddata', handleCanPlay, { once: true });

      // 4. Fallback listener for first legitimate user interaction (click, pointerdown, touchstart, keydown)
      // NOTE: Scroll trigger has been completely removed per specification
      this.setupFallbackGestureListeners();
    } catch (err) {
      console.warn('Global audio init notice:', err);
    }
  }

  private setupFallbackGestureListeners() {
    this.userInteractionHandler = async () => {
      if (!this.isPlaying) {
        const success = await this.attemptPlay();
        if (success) {
          this.removeFallbackGestureListeners();
        }
      } else {
        this.removeFallbackGestureListeners();
      }
    };

    // Legitimate user activation events ONLY (NO SCROLL)
    const events = ['click', 'pointerdown', 'touchstart', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, this.userInteractionHandler!, { passive: true });
    });
  }

  private removeFallbackGestureListeners() {
    if (!this.userInteractionHandler) return;
    const events = ['click', 'pointerdown', 'touchstart', 'keydown'];
    events.forEach((evt) => {
      window.removeEventListener(evt, this.userInteractionHandler!);
    });
    this.userInteractionHandler = null;
  }

  public async attemptPlay(): Promise<boolean> {
    if (!this.audio) return false;

    try {
      this.audio.volume = this.targetVolume;
      this.audio.muted = false;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      // Verify actual HTML audio playback status
      if (!this.audio.paused && this.audio.currentTime >= 0) {
        this.isPlaying = true;
        this.isMuted = false;
        this.notify();
        this.removeFallbackGestureListeners();
        return true;
      }
      return false;
    } catch {
      // Browser blocked unmuted autoplay - gracefully handle without throwing error
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public async play() {
    return await this.attemptPlay();
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
      this.attemptPlay();
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
    // Emit current state immediately to new subscriber
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
