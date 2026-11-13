/**
 * Web Audio API Sound Synthesizer for Chiếc Nón Kỳ Diệu
 * 100% Procedural - Hoạt động hoàn toàn Offline không cần file mp3 ngoài
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isMuted = false;
        this.volume = 0.8;
        this.init();
    }

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // Nhạc hiệu Game Show mở màn (Opening Fanfare)
    playIntro() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Fanfare melody notes: C4, G4, E4, G4, C5, E5, D5, C5
        const melody = [
            { f: 261.63, t: 0.0, d: 0.18, type: 'triangle' },
            { f: 392.00, t: 0.2, d: 0.18, type: 'triangle' },
            { f: 329.63, t: 0.4, d: 0.18, type: 'triangle' },
            { f: 392.00, t: 0.6, d: 0.18, type: 'triangle' },
            { f: 523.25, t: 0.8, d: 0.35, type: 'sawtooth' },
            { f: 659.25, t: 1.2, d: 0.35, type: 'sawtooth' },
            { f: 587.33, t: 1.6, d: 0.35, type: 'sawtooth' },
            { f: 523.25, t: 2.0, d: 0.80, type: 'sawtooth' }
        ];

        // Harmonizing brass chords
        const chords = [
            { f: 130.81, t: 0.0, d: 0.75 }, // C3
            { f: 196.00, t: 0.8, d: 0.75 }, // G3
            { f: 130.81, t: 1.6, d: 1.20 }  // C3
        ];

        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = note.type || 'sawtooth';
            osc.frequency.setValueAtTime(note.f, now + note.t);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, now + note.t);

            gain.gain.setValueAtTime(0, now + note.t);
            gain.gain.linearRampToValueAtTime(0.35, now + note.t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + note.t);
            osc.stop(now + note.t + note.d);
        });

        chords.forEach(c => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(c.f, now + c.t);

            gain.gain.setValueAtTime(0.2, now + c.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + c.t);
            osc.stop(now + c.t + c.d);
        });
    }

    // Tiếng click của kim chiếc nón kỳ diệu
    playWheelTick(pitchModifier = 1.0) {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520 * pitchModifier, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // Tiếng quét đèn sân khấu khi chọn người chơi
    playSpotlightScan() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(750, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Khóa đèn trúng thí sinh (Lock-on chime)
    playLockOn() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.3, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.36);
        });
    }

    // Đồng hồ 30 giây tích tắc
    playTimerTick(isUrgent = false) {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isUrgent ? 'sawtooth' : 'sine';
        const freq = isUrgent ? 880 : 440;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.06);

        gain.gain.setValueAtTime(isUrgent ? 0.35 : 0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Hiệu ứng hồi hộp trước khi công bố đáp án (Drumroll & Tension Riser)
    playSuspenseRiser() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Sub bass drone
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(70, now);
        subOsc.frequency.linearRampToValueAtTime(180, now + 2.5);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, now);
        filter.frequency.linearRampToValueAtTime(500, now + 2.5);

        subGain.gain.setValueAtTime(0.1, now);
        subGain.gain.linearRampToValueAtTime(0.45, now + 2.2);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        subOsc.connect(filter);
        filter.connect(subGain);
        subGain.connect(this.masterGain);

        subOsc.start(now);
        subOsc.stop(now + 2.6);

        // Simulated snare drumroll pulses
        const pulses = 30;
        for (let i = 0; i < pulses; i++) {
            const time = now + (i / pulses) * 2.3;
            const noise = this.ctx.createOscillator();
            const nGain = this.ctx.createGain();
            noise.type = 'triangle';
            noise.frequency.setValueAtTime(140 + Math.random() * 60, time);

            nGain.gain.setValueAtTime((i / pulses) * 0.25 + 0.05, time);
            nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

            noise.connect(nGain);
            nGain.connect(this.masterGain);

            noise.start(time);
            noise.stop(time + 0.07);
        }
    }

    // Trả lời đúng (Correct Fanfare & Ding)
    playCorrect() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Bright major chord arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);

            gain.gain.setValueAtTime(0.3, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.52);
        });

        // Bell sparkle
        setTimeout(() => this.playCoinGain(), 350);
    }

    // Trả lời sai (Wrong Buzzer)
    playWrong() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        [140, 148].forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.setValueAtTime(0.35, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.56);
        });
    }

    // Hiệu ứng cộng tiền (Coin / Score gain)
    playCoinGain() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const pings = [987.77, 1318.51];
        pings.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.3, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.36);
        });
    }

    // Hiệu ứng trừ tiền (Penalty / Deduct Score sound)
    playCoinDeduct() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Bắn pháo hoa (Firework blast sound)
    playFireworkBurst() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Deep explosion boom
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.65);

        // Crackling sparkles
        for (let i = 0; i < 6; i++) {
            const delay = 0.1 + Math.random() * 0.4;
            const cOsc = this.ctx.createOscillator();
            const cGain = this.ctx.createGain();
            cOsc.type = 'sine';
            cOsc.frequency.setValueAtTime(1500 + Math.random() * 1500, now + delay);

            cGain.gain.setValueAtTime(0.08, now + delay);
            cGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

            cOsc.connect(cGain);
            cGain.connect(this.masterGain);

            cOsc.start(now + delay);
            cOsc.stop(now + delay + 0.07);
        }
    }
}

// Global Sound Instance
window.sound = new SoundEngine();
