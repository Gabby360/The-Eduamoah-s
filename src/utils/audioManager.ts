// Centralized Single Global HTML5 Audio Engine with Mobile iOS/Android Optimization & Diagnostics

type AudioStateListener = (isPlaying: boolean, isMuted: boolean, lastError?: string) => void;

class GlobalAudioManager {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private lastError: string | undefined = undefined;
  private listeners: Set<AudioStateListener> = new Set();
  private targetVolume: number = 0.5; // Audible background level

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.audio) return;

    try {
      // 1. Create persistent DOM audio element (DOM attachment is crucial for iOS Safari)
      const audioEl = document.createElement('audio');
      audioEl.id = 'wedding-global-audio';
      audioEl.setAttribute('playsinline', 'true');
      audioEl.setAttribute('webkit-playsinline', 'true');
      audioEl.loop = true;
      audioEl.preload = 'auto';
      audioEl.volume = this.targetVolume;
      audioEl.muted = false;
      audioEl.style.display = 'none';

      // Set audio source (MP3 primary with WAV fallback)
      const canPlayMp3 = audioEl.canPlayType('audio/mpeg');
      audioEl.src = canPlayMp3 ? '/wedding-music.mp3' : '/wedding-music.wav';

      // Append to document body so iOS Safari treats it as an active DOM media element
      if (document.body) {
        document.body.appendChild(audioEl);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(audioEl);
        });
      }

      this.audio = audioEl;
      this.logDiagnostics('INIT');
    } catch (err) {
      console.warn('Global audio init notice:', err);
    }
  }

  public logDiagnostics(actionName: string, error?: any) {
    const debugData = {
      action: actionName,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      readyState: this.audio?.readyState, // 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 4=HAVE_ENOUGH_DATA
      networkState: this.audio?.networkState, // 0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE
      paused: this.audio?.paused,
      muted: this.audio?.muted,
      volume: this.audio?.volume,
      currentSrc: this.audio?.currentSrc,
      error: this.audio?.error ? { code: this.audio.error.code, message: this.audio.error.message } : null,
      rejectionError: error ? { name: error.name, message: error.message } : null,
      timestamp: new Date().toISOString(),
    };
    
    console.log(`[AUDIO DEBUG ${actionName}]`, debugData);
    if (typeof window !== 'undefined') {
      (window as any).__AUDIO_DEBUG__ = debugData;
    }
    return debugData;
  }

  public async play(): Promise<boolean> {
    if (!this.audio) {
      this.init();
    }
    if (!this.audio) return false;

    // A. Unlock Web Audio Context for Mobile iOS Safari & Mobile Chrome
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        if (!this.audioCtx) {
          const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
          this.audioCtx = new AudioCtxClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      } catch (err) {
        console.warn('Web Audio Context unlock notice:', err);
      }
    }

    try {
      this.audio.muted = false;
      this.audio.volume = this.targetVolume;

      // Execute synchronous HTML5 audio play directly inside user interaction handler
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      // Verify actual HTML5 audio element playback state
      if (!this.audio.paused && this.audio.currentTime >= 0) {
        this.isPlaying = true;
        this.isMuted = false;
        this.lastError = undefined;
        this.logDiagnostics('PLAY_SUCCESS');
        this.notify();
        return true;
      }

      this.isPlaying = false;
      this.logDiagnostics('PLAY_CHECK_FAILED');
      this.notify();
      return false;
    } catch (err: any) {
      const errorMsg = err?.name ? `${err.name}: ${err.message}` : 'Playback rejected';
      this.lastError = errorMsg;
      this.isPlaying = false;
      this.logDiagnostics('PLAY_REJECTED', err);
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
    this.logDiagnostics('PAUSE');
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
    this.logDiagnostics('TOGGLE_MUTE');
    this.notify();
  }

  public subscribe(listener: AudioStateListener) {
    this.listeners.add(listener);
    // Emit current state immediately to new subscriber
    listener(this.isPlaying, this.isMuted, this.lastError);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying, this.isMuted, this.lastError));
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public getLastError() {
    return this.lastError;
  }
}

export const globalAudio = new GlobalAudioManager();
