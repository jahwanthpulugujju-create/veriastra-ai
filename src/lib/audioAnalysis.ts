export interface AudioAnalysisResult {
  spectralFlatness: number;
  f0Regularity: number;
  energy: number;
  spectralCentroid: number;
  zcr: number;
  duration: number;
  score: number;
}

export class AudioAnalyzer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private _isRecording = false;

  get isRecording() { return this._isRecording; }

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      source.connect(this.analyser);

      this.chunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
      this.mediaRecorder.start(100);
      this._isRecording = true;
      return true;
    } catch {
      return false;
    }
  }

  getRealtimeLevel(): number {
    if (!this.analyser) return 0;
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) sum += Math.abs(v - 128);
    return sum / buf.length / 128;
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(128);
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buf);
    return buf;
  }

  async stop(): Promise<AudioAnalysisResult> {
    this._isRecording = false;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(this.defaultResult());
        return;
      }
      this.mediaRecorder.onstop = async () => {
        if (this.stream) this.stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(this.chunks, { type: "audio/webm" });
        const result = await this.analyzeBlob(blob);
        if (this.audioCtx) this.audioCtx.close();
        resolve(result);
      };
      this.mediaRecorder.stop();
    });
  }

  private defaultResult(): AudioAnalysisResult {
    return { spectralFlatness: 0.2, f0Regularity: 0.4, energy: 0.5, spectralCentroid: 0.5, zcr: 0.3, duration: 0, score: 70 };
  }

  private async analyzeBlob(blob: Blob): Promise<AudioAnalysisResult> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      await ctx.close();

      const raw = decoded.getChannelData(0);
      const duration = decoded.duration;

      const energy = this.computeRmsEnergy(raw);
      const zcr = this.computeZCR(raw);
      const { flatness, centroid } = this.computeSpectralFeatures(raw, decoded.sampleRate);
      const f0Reg = this.computeF0Regularity(raw, decoded.sampleRate);

      const score = this.computeScore({ flatness, f0Reg, energy, zcr });

      return {
        spectralFlatness: flatness,
        f0Regularity: f0Reg,
        energy,
        spectralCentroid: centroid,
        zcr,
        duration,
        score,
      };
    } catch {
      return this.defaultResult();
    }
  }

  private computeRmsEnergy(samples: Float32Array): number {
    let sum = 0;
    for (const s of samples) sum += s * s;
    return Math.sqrt(sum / samples.length);
  }

  private computeZCR(samples: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < samples.length; i++) {
      if ((samples[i] >= 0) !== (samples[i - 1] >= 0)) crossings++;
    }
    return crossings / samples.length;
  }

  private computeSpectralFeatures(samples: Float32Array, sampleRate: number): { flatness: number; centroid: number } {
    const fftSize = 1024;
    const chunk = samples.slice(0, Math.min(samples.length, fftSize * 8));
    const step = Math.floor(chunk.length / fftSize);
    const mags: number[] = [];
    for (let i = 0; i < fftSize; i++) {
      mags.push(Math.abs(chunk[i * step] || 0) + 1e-10);
    }
    const logMeans = mags.map(Math.log);
    const logMean = logMeans.reduce((a, b) => a + b) / logMeans.length;
    const arithmeticMean = mags.reduce((a, b) => a + b) / mags.length;
    const geometricMean = Math.exp(logMean);
    const flatness = Math.min(1, geometricMean / arithmeticMean);

    let weightedFreq = 0, magSum = 0;
    for (let i = 0; i < fftSize; i++) {
      const freq = (i * sampleRate) / (2 * fftSize);
      weightedFreq += freq * mags[i];
      magSum += mags[i];
    }
    const centroid = magSum > 0 ? (weightedFreq / magSum) / (sampleRate / 2) : 0.5;

    return { flatness: Math.min(1, flatness * 2), centroid };
  }

  private computeF0Regularity(samples: Float32Array, sampleRate: number): number {
    const windowSize = Math.floor(sampleRate * 0.025);
    const hopSize = Math.floor(sampleRate * 0.010);
    const f0Estimates: number[] = [];

    for (let start = 0; start + windowSize < samples.length && f0Estimates.length < 100; start += hopSize) {
      const window = samples.slice(start, start + windowSize);
      const acf: number[] = [];
      const maxLag = Math.floor(sampleRate / 60);
      const minLag = Math.floor(sampleRate / 400);
      for (let lag = minLag; lag < Math.min(maxLag, windowSize / 2); lag++) {
        let sum = 0;
        for (let i = 0; i + lag < windowSize; i++) sum += window[i] * window[i + lag];
        acf.push(sum);
      }
      if (acf.length === 0) continue;
      let maxIdx = 0;
      for (let i = 1; i < acf.length; i++) if (acf[i] > acf[maxIdx]) maxIdx = i;
      const lag0 = maxIdx + Math.floor(sampleRate / 400);
      if (lag0 > 0) f0Estimates.push(sampleRate / lag0);
    }

    if (f0Estimates.length < 3) return 0.4;
    const mean = f0Estimates.reduce((a, b) => a + b) / f0Estimates.length;
    const variance = f0Estimates.reduce((s, v) => s + (v - mean) ** 2, 0) / f0Estimates.length;
    const cv = Math.sqrt(variance) / (mean || 1);
    return Math.max(0, Math.min(1, 1 - cv * 2));
  }

  private computeScore({ flatness, f0Reg, energy, zcr }: { flatness: number; f0Reg: number; energy: number; zcr: number }): number {
    let score = 100;
    if (flatness > 0.4) score -= 30;
    else if (flatness > 0.25) score -= 15;
    if (f0Reg > 0.85) score -= 25;
    else if (f0Reg > 0.7) score -= 12;
    if (energy < 0.05) score -= 20;
    if (zcr > 0.4) score -= 10;
    return Math.max(0, Math.min(100, score));
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this._isRecording = false;
  }
}
