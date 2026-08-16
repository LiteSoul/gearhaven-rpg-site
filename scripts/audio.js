/* ==========================================================================
   GEARHAVEN: SKYWARD BOUND - PROCEDURAL WEB AUDIO SYNTHESIZER
   Provides 8-bit / 16-bit sound effects & chiptune audio in-browser
   ========================================================================== */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = true; // start muted per browser autoplay policy
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.melodyStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.25;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    if (!this.isMuted) {
      this.playBlip();
      if (!this.bgmPlaying) {
        this.startBGM();
      }
    }
    return !this.isMuted;
  }

  // --- SOUND EFFECTS ---

  // UI Selection Blip
  playBlip() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Mechanical Sword Slash
  playSlash() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Tesla Lightning Shock
  playLightning() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(300, this.ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(950, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(200, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  // Steam Release Pressure Hiss
  playSteam() {
    if (this.isMuted) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  // Repair / Healing Chime (Arpeggio)
  playHeal() {
    if (this.isMuted) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + index * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Boss Explosion Rumble
  playExplosion() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Victory Jingle
  playVictory() {
    if (this.isMuted) return;
    this.init();
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.24 }, // E5
      { f: 587.33, d: 0.12 }, // D5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.45 }  // G5
    ];

    let t = this.ctx.currentTime;
    melody.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + note.d);
      t += note.d * 1.1;
    });
  }

  // Character Voice / Bleep Quote SFX
  playVoice(charId) {
    if (this.isMuted) return;
    this.init();
    let baseFreq = 440;
    let type = 'square';
    if (charId === 'sprocket') { baseFreq = 480; type = 'square'; }
    if (charId === 'electra') { baseFreq = 720; type = 'sine'; }
    if (charId === 'prof_gear') { baseFreq = 260; type = 'sawtooth'; }
    if (charId === 'baron') { baseFreq = 160; type = 'triangle'; }

    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = this.ctx.currentTime + i * 0.07;
      osc.type = type;
      osc.frequency.setValueAtTime(baseFreq + (i % 2 === 0 ? 50 : -30), st);

      gain.gain.setValueAtTime(0.22, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(st);
      osc.stop(st + 0.06);
    }
  }

  // Ambient Chiptune Background Loop (Steampunk Adventure Theme)
  startBGM() {
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;
    
    // Pentatonic / Steampunk Heroic sequence: D minor / A minor cadence
    const notes = [
      293.66, 349.23, 440.00, 523.25, 587.33, 440.00, 349.23, 392.00,
      329.63, 392.00, 493.88, 587.33, 659.25, 493.88, 392.00, 440.00
    ];

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = notes[this.melodyStep % notes.length];
      this.melodyStep++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    }, 240);
  }
}

// Export singleton
window.retroAudio = new RetroAudioEngine();
