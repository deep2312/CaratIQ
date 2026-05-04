import { Hands } from '@mediapipe/hands';

const LANDMARK = {
  RING_MCP: 13,
  RING_PIP: 14,
  MIDDLE_MCP: 9,
  PINKY_MCP: 17,
};

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export async function createHandDetector(onResults) {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults(onResults);
  return hands;
}

export function extractRingFingerMetrics(results, width, height) {
  const hand = results?.multiHandLandmarks?.[0];
  if (!hand) return null;

  const toPx = (p) => ({ x: p.x * width, y: p.y * height, z: p.z * width });
  const ringMcp = toPx(hand[LANDMARK.RING_MCP]);
  const ringPip = toPx(hand[LANDMARK.RING_PIP]);
  const middleMcp = toPx(hand[LANDMARK.MIDDLE_MCP]);
  const pinkyMcp = toPx(hand[LANDMARK.PINKY_MCP]);

  const fingerWidthPx = dist(middleMcp, pinkyMcp) * 0.52;
  const vector = { x: ringPip.x - ringMcp.x, y: ringPip.y - ringMcp.y };
  const angle = Math.atan2(vector.y, vector.x);
  const tilt = Math.min(0.45, Math.abs(hand[LANDMARK.RING_PIP].z - hand[LANDMARK.RING_MCP].z) * 5);

  return { ringMcp, ringPip, fingerWidthPx, angle, tilt, landmarks: hand };
}

export function validateHandCapture(metrics, imageSharpness = 1) {
  if (!metrics) return { ok: false, reason: 'No hand detected' };
  if (imageSharpness < 0.12) return { ok: false, reason: 'Image too blurry' };
  if (Math.abs(metrics.angle) > 1.8) return { ok: false, reason: 'Rotate hand to flatter angle' };
  return { ok: true, reason: 'Valid hand detected' };
}
