import { useEffect, useMemo, useState } from 'react';
import Upload from './components/Upload';
import Controls from './components/Controls';
import Viewer from './components/Viewer';
import { caratToMM } from './utils/caratToMM';
import { estimateQuickScale, scaleFromReference, scaleFromRingSize } from './utils/scaling';
import { createHandDetector, extractRingFingerMetrics, validateHandCapture } from './ml/handDetection';

export default function App() {
  const [image, setImage] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [brightness, setBrightness] = useState(0.5);
  const [settings, setSettings] = useState({ mode: 'quick', shape: 'round', carat: 1.2, debug: false, usSize: 7, referencePx: 0 });

  const mm = useMemo(() => caratToMM(settings.carat, settings.shape), [settings.carat, settings.shape]);
  const pxPerMM = useMemo(() => {
    if (!metrics) return 1;
    if (settings.mode === 'quick') return estimateQuickScale(metrics.fingerWidthPx);
    return scaleFromRingSize(settings.usSize, metrics.fingerWidthPx) || scaleFromReference(settings.referencePx) || estimateQuickScale(metrics.fingerWidthPx);
  }, [settings, metrics]);

  const ringPx = mm.widthMM * pxPerMM;

  useEffect(() => {
    let mounted = true;
    createHandDetector((results) => {
      if (!mounted) return;
      const m = extractRingFingerMetrics(results, 800, 600);
      setMetrics(m);
      const validation = validateHandCapture(m, 0.8);
      setError(validation.ok ? '' : validation.reason);
    }).then((detector) => { window.__caratiqHands = detector; });
    return () => { mounted = false; };
  }, []);

  const loadImage = (file) => {
    const src = URL.createObjectURL(file);
    setImage(src);
    const img = new Image();
    img.onload = async () => {
      const c = document.createElement('canvas');
      c.width = 800; c.height = 600;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let sum = 0; for (let i = 0; i < data.length; i += 4) sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      setBrightness(Math.min(1, Math.max(0, sum / (data.length / 4) / 255)));
      if (window.__caratiqHands) await window.__caratiqHands.send({ image: c });
    };
    img.src = src;
  };

  return (
    <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2"><Viewer image={image} metrics={metrics} ringPx={ringPx} shape={settings.shape} brightness={brightness} debug={settings.debug} /></section>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">CaratIQ</h1>
        <Upload onFile={loadImage} error={error} />
        <Controls settings={settings} onChange={(n) => setSettings((s) => ({ ...s, ...n }))} mmDisplay={mm.display} />
      </section>
    </main>
  );
}
