import * as faceapi from "@vladmandic/face-api";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

export async function loadModels(onProgress?: (pct: number) => void): Promise<void> {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    onProgress?.(10);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    onProgress?.(45);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
    onProgress?.(80);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    onProgress?.(100);
    modelsLoaded = true;
  })();

  return loadingPromise;
}

export function areModelsLoaded() {
  return modelsLoaded;
}

export type Point = { x: number; y: number };

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function computeEAR(eye: Point[]): number {
  if (eye.length < 6) return 1;
  const A = dist(eye[1], eye[5]);
  const B = dist(eye[2], eye[4]);
  const C = dist(eye[0], eye[3]);
  return (A + B) / (2.0 * C);
}

function computeSymmetry(landmarks: faceapi.FaceLandmarks68): number {
  const pts = landmarks.positions;
  const nose = pts[30];
  const pairs: [number, number][] = [
    [0, 16], [1, 15], [2, 14], [3, 13], [4, 12], [5, 11],
    [36, 45], [37, 44], [38, 43], [39, 42],
  ];
  let totalDiff = 0;
  for (const [l, r] of pairs) {
    const leftDist = dist(pts[l], nose);
    const rightDist = dist(pts[r], nose);
    totalDiff += Math.abs(leftDist - rightDist) / Math.max(leftDist, rightDist, 1);
  }
  const asymmetry = totalDiff / pairs.length;
  return Math.max(0, Math.min(1, 1 - asymmetry * 10));
}

export interface FrameData {
  faceDetected: boolean;
  faceCount: number;
  confidence: number;
  earLeft: number;
  earRight: number;
  avgEAR: number;
  symmetryScore: number;
  noseX: number;
  noseY: number;
  expression: string;
  expressionScore: number;
}

export interface LiveAnalysis {
  frame: FrameData | null;
  blinkCount: number;
  isBlinking: boolean;
}

const EAR_THRESHOLD = 0.22;
const EAR_CONSEC = 2;

export class FaceAnalyzer {
  private blinkCount = 0;
  private earBelowCount = 0;
  private isBlinking = false;
  private noseTipHistory: Point[] = [];
  private frameHistory: FrameData[] = [];
  private tinyOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 });

  async analyzeFrame(
    source: HTMLVideoElement | HTMLCanvasElement
  ): Promise<LiveAnalysis> {
    if (!modelsLoaded) return { frame: null, blinkCount: this.blinkCount, isBlinking: false };

    const detections = await faceapi
      .detectAllFaces(source, this.tinyOptions)
      .withFaceLandmarks(true)
      .withFaceExpressions();

    if (!detections.length) {
      this.earBelowCount = 0;
      const frame: FrameData = {
        faceDetected: false, faceCount: 0, confidence: 0,
        earLeft: 1, earRight: 1, avgEAR: 1, symmetryScore: 0,
        noseX: 0, noseY: 0, expression: "none", expressionScore: 0,
      };
      this.frameHistory.push(frame);
      return { frame, blinkCount: this.blinkCount, isBlinking: false };
    }

    const d = detections[0];
    const lm = d.landmarks;
    const pts = lm.positions;

    const leftEye = pts.slice(36, 42);
    const rightEye = pts.slice(42, 48);
    const earLeft = computeEAR(leftEye);
    const earRight = computeEAR(rightEye);
    const avgEAR = (earLeft + earRight) / 2;

    if (avgEAR < EAR_THRESHOLD) {
      this.earBelowCount++;
    } else {
      if (this.earBelowCount >= EAR_CONSEC) {
        this.blinkCount++;
        this.isBlinking = false;
      }
      this.earBelowCount = 0;
    }
    this.isBlinking = this.earBelowCount >= EAR_CONSEC;

    const nose = pts[30];
    this.noseTipHistory.push({ x: nose.x, y: nose.y });
    if (this.noseTipHistory.length > 60) this.noseTipHistory.shift();

    const symmetry = computeSymmetry(lm);
    const expressions = d.expressions as Record<string, number>;
    const topExpr = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];

    const frame: FrameData = {
      faceDetected: true,
      faceCount: detections.length,
      confidence: d.detection.score,
      earLeft,
      earRight,
      avgEAR,
      symmetryScore: symmetry,
      noseX: nose.x,
      noseY: nose.y,
      expression: topExpr?.[0] ?? "neutral",
      expressionScore: topExpr?.[1] ?? 0,
    };
    this.frameHistory.push(frame);
    if (this.frameHistory.length > 120) this.frameHistory.shift();

    return { frame, blinkCount: this.blinkCount, isBlinking: this.isBlinking };
  }

  getStats() {
    const faceFrames = this.frameHistory.filter(f => f.faceDetected);
    if (!faceFrames.length) {
      return {
        faceDetected: false, faceCount: 0, blinkCount: 0,
        symmetryScore: 0, landmarkStability: 0,
        faceConfidence: 0, expression: "none",
      };
    }

    const avgSymmetry = faceFrames.reduce((s, f) => s + f.symmetryScore, 0) / faceFrames.length;
    const avgConfidence = faceFrames.reduce((s, f) => s + f.confidence, 0) / faceFrames.length;
    const topExprCounts: Record<string, number> = {};
    faceFrames.forEach(f => { topExprCounts[f.expression] = (topExprCounts[f.expression] || 0) + 1; });
    const topExpr = Object.entries(topExprCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral";

    let stability = 0;
    if (this.noseTipHistory.length > 2) {
      const xVals = this.noseTipHistory.map(p => p.x);
      const yVals = this.noseTipHistory.map(p => p.y);
      const xMean = xVals.reduce((a, b) => a + b) / xVals.length;
      const yMean = yVals.reduce((a, b) => a + b) / yVals.length;
      const xVar = xVals.reduce((s, x) => s + (x - xMean) ** 2, 0) / xVals.length;
      const yVar = yVals.reduce((s, y) => s + (y - yMean) ** 2, 0) / yVals.length;
      stability = Math.sqrt(xVar + yVar) / 10;
    }

    return {
      faceDetected: true,
      faceCount: faceFrames[faceFrames.length - 1]?.faceCount ?? 1,
      blinkCount: this.blinkCount,
      symmetryScore: avgSymmetry,
      landmarkStability: stability,
      faceConfidence: avgConfidence,
      expression: topExpr,
    };
  }

  drawOverlay(
    canvas: HTMLCanvasElement,
    frame: FrameData | null,
    isBlinking: boolean
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!frame?.faceDetected) return;

    const earColor = isBlinking ? "#22c55e" : frame.avgEAR > 0.28 ? "#3b82f6" : "#f59e0b";
    ctx.strokeStyle = earColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.4;
    const w = canvas.width * 0.35;
    const h = canvas.height * 0.48;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(59,130,246,0.85)";
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillText(`EAR: ${frame.avgEAR.toFixed(3)}`, 10, 20);
    ctx.fillText(`Conf: ${(frame.confidence * 100).toFixed(0)}%`, 10, 34);
    ctx.fillText(`Blinks: ${this.blinkCount}`, 10, 48);
    if (isBlinking) {
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 12px 'IBM Plex Mono', monospace";
      ctx.fillText("BLINK DETECTED", 10, canvas.height - 10);
    }
  }

  reset() {
    this.blinkCount = 0;
    this.earBelowCount = 0;
    this.isBlinking = false;
    this.noseTipHistory = [];
    this.frameHistory = [];
  }
}
