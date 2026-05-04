const RING_SIZE_TO_DIAMETER_MM = {
  4: 14.8, 5: 15.7, 6: 16.5, 7: 17.3, 8: 18.1, 9: 18.9, 10: 19.8,
};

export function estimateQuickScale(fingerWidthPx) {
  const avgRingFingerWidthMM = 17.6;
  return fingerWidthPx > 0 ? fingerWidthPx / avgRingFingerWidthMM : 1;
}

export function scaleFromRingSize(usSize, fingerWidthPx) {
  const mm = RING_SIZE_TO_DIAMETER_MM[usSize];
  if (!mm || fingerWidthPx <= 0) return null;
  return fingerWidthPx / mm;
}

export function scaleFromReference(referenceWidthPx, referenceWidthMM = 85.6) {
  if (!referenceWidthPx || referenceWidthPx <= 0) return null;
  return referenceWidthPx / referenceWidthMM;
}
