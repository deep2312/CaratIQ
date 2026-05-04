const SHAPE_SPECS = {
  round: { k: 6.45, ratio: [1, 1] },
  oval: { k: 7.15, ratio: [1.35, 1] },
  emerald: { k: 7.35, ratio: [1.4, 1] },
  cushion: { k: 6.85, ratio: [1.08, 1] },
};

export function caratToMM(carat, shape = 'round') {
  const safeCarat = Math.max(0.25, Number(carat || 1));
  const spec = SHAPE_SPECS[shape] || SHAPE_SPECS.round;
  const base = Math.cbrt(safeCarat) * spec.k;
  const [l, w] = spec.ratio;
  return {
    lengthMM: Number((base * l).toFixed(2)),
    widthMM: Number((base * w).toFixed(2)),
    depthMM: Number((base * 0.62).toFixed(2)),
    display: `${(base * l).toFixed(1)} × ${(base * w).toFixed(1)} mm`,
  };
}
