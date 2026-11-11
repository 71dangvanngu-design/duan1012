/**
 * Lightweight, zero-external-dependency ambient audio synthesizer
 * using native Web Audio API to play gentle, nostalgic youth melodies.
 */

class YouthAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private volume = 0.25;

  private melodies: { [key: string]: number[] } = {
    'thanh-xuan': [
      261.63, 329.63, 392.00, 523.25, // C E G C
      293.66, 349.23, 440.00, 523.25, // D F A C
      246.94, 329.63, 392.00, 493.88, // B E G B
      220.00, 261.63, 329.63, 440.00, // A C E A
    ],
    'nang-san-truong': [
      329.63, 392.00, 493.88, 587.33,
      349.23, 440.00, 523.25, 659.25,
      261.63, 329.63, 392.00, 523.25,
      196.00, 246.94, 293.66, 392.00,
    ]
  };

  private currentTrack = 'thanh-xuan';
  private step = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public togglePlay(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.play();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.scheduleNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setTrack(track: 'thanh-xuan' | 'nang-san-truong') {
    this.currentTrack = track;
    this.step = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playTone(freq: number, duration = 1.2) {
    if (!this.ctx || !this.isPlaying) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm chime-like timbre
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Soft envelope
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Audio context error ignore
    }
  }

  private scheduleNextNote() {
    if (!this.isPlaying) return;

    const notes = this.melodies[this.currentTrack] || this.melodies['thanh-xuan'];
    const currentFreq = notes[this.step % notes.length];
    
    // Play root note and soft fifth or octave harmony
    this.playTone(currentFreq, 1.4);
    if (this.step % 2 === 0) {
      this.playTone(currentFreq * 1.5, 1.8);
    }

    this.step++;

    // Nostalgic relaxed tempo (around 800ms per note)
    this.timer = window.setTimeout(() => {
      this.scheduleNextNote();
    }, 780);
  }
}

export const youthAudio = new YouthAudioSynth();
