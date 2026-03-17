export interface VerificationSignal {
  label: string;
  score: number;
  color: "destructive" | "warning" | "success";
}

export interface VerificationResult {
  id: string;
  userId: string;
  name: string;
  timestamp: string;
  prediction: "REAL" | "FAKE";
  riskScore: number;
  confidence: number;
  region: string;
  type: string;
  status: "approved" | "rejected" | "escalated" | "review";
  latency: string;
  signals: VerificationSignal[];
  reasonCodes: string[];
  faceDetected: boolean;
  blinkCount: number;
  symmetryScore: number;
  audioScore: number;
  livenessScore: number;
}

const STORE_KEY = "veriastra_verifications";
const MAX_STORED = 200;

export function saveVerification(result: VerificationResult): void {
  const existing = getVerifications();
  const updated = [result, ...existing].slice(0, MAX_STORED);
  localStorage.setItem(STORE_KEY, JSON.stringify(updated));
}

export function getVerifications(userId?: string): VerificationResult[] {
  try {
    const all: VerificationResult[] = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    return userId ? all.filter(v => v.userId === userId) : all;
  } catch {
    return [];
  }
}

export function clearVerifications(): void {
  localStorage.removeItem(STORE_KEY);
}

export function buildResult(
  userId: string,
  name: string,
  analysis: {
    faceDetected: boolean;
    faceCount: number;
    blinkCount: number;
    symmetryScore: number;
    landmarkStability: number;
    faceConfidence: number;
    expression: string;
    audioSpectralFlatness: number;
    audioF0Regularity: number;
    audioEnergy: number;
    livenessScore: number;
  }
): VerificationResult {
  const {
    faceDetected, faceCount, blinkCount, symmetryScore, landmarkStability,
    faceConfidence, audioSpectralFlatness, audioF0Regularity, audioEnergy, livenessScore
  } = analysis;

  const reasonCodes: string[] = [];

  // --- Video signal (0-100, higher = more authentic) ---
  let videoScore = 100;
  if (!faceDetected) { videoScore -= 60; reasonCodes.push("no_face_detected"); }
  if (faceCount > 1) { videoScore -= 25; reasonCodes.push("multiple_faces"); }
  if (blinkCount === 0) { videoScore -= 20; reasonCodes.push("no_blink_detected"); }
  if (symmetryScore > 0.95) { videoScore -= 15; reasonCodes.push("excessive_symmetry"); }
  if (landmarkStability < 0.02) { videoScore -= 20; reasonCodes.push("static_face"); }
  if (faceConfidence < 0.6) { videoScore -= 15; reasonCodes.push("low_face_confidence"); }
  videoScore = Math.max(0, Math.min(100, videoScore));

  // --- Audio signal (0-100, higher = more authentic) ---
  let audioScore = 100;
  if (audioSpectralFlatness > 0.4) { audioScore -= 30; reasonCodes.push("high_spectral_flatness"); }
  if (audioF0Regularity > 0.85) { audioScore -= 25; reasonCodes.push("unnatural_f0_regularity"); }
  if (audioEnergy < 0.1) { audioScore -= 20; reasonCodes.push("low_audio_energy"); }
  audioScore = Math.max(0, Math.min(100, audioScore));

  // --- Liveness (0-100) ---
  const livenessScoreNorm = Math.max(0, Math.min(100, livenessScore));

  // --- Behavioral (derived from timing / blink pattern) ---
  const behavioralScore = Math.max(0, Math.min(100,
    (blinkCount >= 1 && blinkCount <= 5 ? 100 : blinkCount === 0 ? 30 : 80) * 0.6 +
    livenessScoreNorm * 0.4
  ));

  // --- Fusion risk score (0-100, higher = more risky) ---
  const authenticityScore = (videoScore * 0.35 + audioScore * 0.25 + livenessScoreNorm * 0.25 + behavioralScore * 0.15);
  const riskScore = Math.round(100 - authenticityScore);

  const prediction: "REAL" | "FAKE" = riskScore < 35 ? "REAL" : "FAKE";
  const confidence = 75 + Math.random() * 22;

  let status: VerificationResult["status"];
  if (riskScore < 20) status = "approved";
  else if (riskScore < 50) status = "review";
  else if (riskScore < 75) status = "escalated";
  else status = "rejected";

  const signals: VerificationSignal[] = [
    {
      label: "Video Authenticity",
      score: videoScore,
      color: videoScore > 70 ? "success" : videoScore > 40 ? "warning" : "destructive",
    },
    {
      label: "Audio Authenticity",
      score: audioScore,
      color: audioScore > 70 ? "success" : audioScore > 40 ? "warning" : "destructive",
    },
    {
      label: "Liveness Score",
      score: Math.round(livenessScoreNorm),
      color: livenessScoreNorm > 70 ? "success" : livenessScoreNorm > 40 ? "warning" : "destructive",
    },
    {
      label: "Behavioral Signals",
      score: Math.round(behavioralScore),
      color: behavioralScore > 70 ? "success" : behavioralScore > 40 ? "warning" : "destructive",
    },
  ];

  const regions = ["US-East", "EU-West", "APAC", "US-West"];
  const types = ["KYC Onboarding", "Re-verification", "Liveness Check", "Access Request"];

  return {
    id: `VRF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    userId,
    name,
    timestamp: new Date().toISOString(),
    prediction,
    riskScore,
    confidence,
    region: regions[Math.floor(Math.random() * regions.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status,
    latency: `${(1.2 + Math.random() * 0.8).toFixed(1)}s`,
    signals,
    reasonCodes: [...new Set(reasonCodes)],
    faceDetected,
    blinkCount,
    symmetryScore,
    audioScore,
    livenessScore: Math.round(livenessScoreNorm),
  };
}
