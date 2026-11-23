'use client';

// Web Audio API ASMR Sound Engine (Zero external audio files, 100% reliable, zero latency)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rm_sfx_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Generate a 1-second white noise buffer for friction/paper sounds
        const bufferSize = this.ctx.sampleRate;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rm_sfx_enabled', String(val));
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playSwitch();
    }
    return this.enabled;
  }

  // Cursor movement sound disabled
  public playCursorDrift(_speed: number = 1) {}
  public playPencilSketch(_speed: number = 1) {}

  // One-time crisp paper / card lift sound when grabbing an item
  public playCardPick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx || !this.noiseBuffer) return;

    try {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const freq = 2600 + (Math.random() - 0.5) * 400;
      filter.frequency.setValueAtTime(freq, ctx.currentTime);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      const gain = ctx.createGain();
      const vol = 0.012;
      const dur = 0.035;

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start();
      src.stop(ctx.currentTime + dur + 0.005);
    } catch {}
  }

  public playDragRustle(_speed: number = 1) {
    this.playCardPick();
  }

  // Soft tactile hover tick (vintage Braun / Teenage Engineering encoder tick)
  public playHover() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.018);

      gain.gain.setValueAtTime(0.028, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {}
  }

  // Satisfying mechanical keyboard click (Cherry MX Brown / tactile keycap switch)
  public playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.055, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);

      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(260, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

      subGain.gain.setValueAtTime(0.035, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();
      subOsc.stop(ctx.currentTime + 0.055);
    } catch {}
  }

  // Toggle switch click (like toggling a metal latch or radio switch)
  public playSwitch() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {}
  }

  // Pleasant, soft Polaroid / card tap when bouncing or landing (NO heavy bass, crisp & light)
  public playThud(intensity: number = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const clamped = Math.min(Math.max(intensity, 0.25), 1.2);

      // 1. Soft resonant body knock (warm midrange wood/card tap, NOT a subwoofer boom)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Crisp mid-range drop: 580Hz down to 260Hz in 28ms
      const startFreq = 580 + Math.random() * 80;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.028);

      const tapVol = 0.022 * clamped;
      gain.gain.setValueAtTime(tapVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);

      // 2. Micro paper surface contact "tick"
      if (this.noiseBuffer) {
        const nSrc = ctx.createBufferSource();
        nSrc.buffer = this.noiseBuffer;

        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(3600, ctx.currentTime);
        nFilter.Q.setValueAtTime(3.5, ctx.currentTime);

        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.012 * clamped, ctx.currentTime);
        nGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

        nSrc.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(ctx.destination);
        nSrc.start();
        nSrc.stop(ctx.currentTime + 0.02);
      }
    } catch {}
  }
}

export const sound = new SoundEngine();
