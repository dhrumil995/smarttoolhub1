import { safeStorage } from './storage';

/**
 * Apple-style Micro-Haptics & Audio Feedback Engine
 * Synthesizes ultra-low-latency, elegant UI sounds using the native Web Audio API
 * and triggers device vibration on supported hardware (iOS/Android/trackpads).
 * 
 * Persistent intensity levels:
 * - 'high': Full crisp harmonic audio micro-clicks + prominent device vibration
 * - 'low':  Subtle whisper-quiet audio + gentle micro-tap vibration
 * - 'off':  Completely silent, zero vibration
 */

export type HapticIntensity = 'high' | 'low' | 'off';

class SoundHapticEngine {
  private ctx: AudioContext | null = null;
  private intensity: HapticIntensity = 'high';
  private listeners: Set<(intensity: HapticIntensity) => void> = new Set();

  constructor() {
    // 1. Check primary persistent intensity setting
    const storedIntensity = safeStorage.getItem('smarttoolhub_haptic_intensity');
    if (storedIntensity === 'high' || storedIntensity === 'low' || storedIntensity === 'off') {
      this.intensity = storedIntensity;
    } else {
      // 2. Backwards-compatibility fallback to legacy boolean sound setting
      const legacySound = safeStorage.getItem('smarttoolhub_sound_enabled');
      if (legacySound === 'false') {
        this.intensity = 'off';
      } else {
        this.intensity = 'high';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Safe device tactile vibration wrapper
   */
  private triggerVibrate(pattern: number | number[]) {
    try {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  public getIntensity(): HapticIntensity {
    return this.intensity;
  }

  public setIntensity(val: HapticIntensity) {
    this.intensity = val;
    safeStorage.setItem('smarttoolhub_haptic_intensity', val);
    safeStorage.setItem('smarttoolhub_sound_enabled', val !== 'off' ? 'true' : 'false');
    this.notifyListeners();
  }

  public cycleIntensity(): HapticIntensity {
    let next: HapticIntensity;
    if (this.intensity === 'high') {
      next = 'low';
    } else if (this.intensity === 'low') {
      next = 'off';
    } else {
      next = 'high';
    }
    this.setIntensity(next);
    if (next !== 'off') {
      this.playTap(next);
    }
    return next;
  }

  public isEnabled(): boolean {
    return this.intensity !== 'off';
  }

  public setEnabled(val: boolean) {
    this.setIntensity(val ? 'high' : 'off');
  }

  public toggle(): boolean {
    const next = this.intensity === 'off' ? 'high' : 'off';
    this.setIntensity(next);
    if (next !== 'off') {
      this.playTap(next);
    }
    return next !== 'off';
  }

  public subscribe(listener: (intensity: HapticIntensity) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.intensity);
      } catch (_) {}
    });
  }

  /**
   * Preview a specific haptic level immediately without changing saved setting
   */
  public playTestFeedback(level: HapticIntensity) {
    if (level === 'off') return;
    this.playTap(level);
  }

  /**
   * Subtle Apple Trackpad / Taptic click
   */
  public playTap(overrideIntensity?: HapticIntensity) {
    const level = overrideIntensity || this.intensity;
    if (level === 'off') return;

    // Physical vibration
    if (level === 'high') {
      this.triggerVibrate(22);
    } else {
      this.triggerVibrate(8);
    }

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';

      if (level === 'high') {
        osc.frequency.setValueAtTime(155, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.035);
        gain.gain.setValueAtTime(0.085, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      } else {
        // Low: Gentle micro-click
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.028);
        gain.gain.setValueAtTime(0.028, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (level === 'high' ? 0.035 : 0.028));
    } catch (_) {}
  }

  /**
   * Soft selection / key toggle
   */
  public playSelect(overrideIntensity?: HapticIntensity) {
    const level = overrideIntensity || this.intensity;
    if (level === 'off') return;

    if (level === 'high') {
      this.triggerVibrate([14, 18, 14]);
    } else {
      this.triggerVibrate(6);
    }

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';

      if (level === 'high') {
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.045);
        gain.gain.setValueAtTime(0.065, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.032);
        gain.gain.setValueAtTime(0.022, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (level === 'high' ? 0.045 : 0.032));
    } catch (_) {}
  }

  /**
   * Elegant Apple harmonic success chord
   */
  public playSuccess(overrideIntensity?: HapticIntensity) {
    const level = overrideIntensity || this.intensity;
    if (level === 'off') return;

    if (level === 'high') {
      this.triggerVibrate([15, 35, 25]);
    } else {
      this.triggerVibrate(12);
    }

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Chord frequencies
      const freqs = level === 'high' 
        ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 full chord
        : [523.25, 659.25, 783.99];        // C5, E5, G5 light chord

      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * (level === 'high' ? 0.04 : 0.03);
        const duration = level === 'high' ? 0.28 : 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const baseGain = level === 'high' ? 0.045 : 0.018;
        gain.gain.setValueAtTime(baseGain / (idx + 1), startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (_) {}
  }
}

export const haptics = new SoundHapticEngine();
