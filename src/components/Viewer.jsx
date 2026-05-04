import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initThree, adaptLighting } from '../render/threeSetup';
import { createRingGroup } from '../render/diamondModels';

export default function Viewer({ image, metrics, ringPx, shape, brightness, debug }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const state = useRef({});

  useEffect(() => {
    if (!canvasRef.current) return;
    const { renderer, scene, camera } = initThree(canvasRef.current);
    state.current = { renderer, scene, camera };
    const resize = () => {
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    const loop = () => { renderer.render(scene, camera); state.current.raf = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(state.current.raf); window.removeEventListener('resize', resize); renderer.dispose(); };
  }, []);

  useEffect(() => {
    const { scene } = state.current;
    if (!scene || !metrics || !ringPx) return;
    if (state.current.ring) scene.remove(state.current.ring);
    const ring = createRingGroup({ shape, sizePx: ringPx });
    ring.position.set(metrics.ringMcp.x - 400, -(metrics.ringMcp.y - 300), 0);
    ring.rotation.z = metrics.angle;
    ring.rotation.x = metrics.tilt;
    scene.add(ring);
    state.current.ring = ring;
  }, [metrics, ringPx, shape]);

  useEffect(() => { if (state.current.scene) adaptLighting(state.current.scene, brightness); }, [brightness]);

  useEffect(() => {
    const c = overlayRef.current;
    if (!c || !metrics || !debug) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#22d3ee';
    metrics.landmarks.forEach((p) => { ctx.beginPath(); ctx.arc(p.x * c.width, p.y * c.height, 3, 0, Math.PI * 2); ctx.stroke(); });
  }, [metrics, debug]);

  return (
    <div className="relative rounded-2xl border border-zinc-700 overflow-hidden bg-zinc-950 min-h-[460px]">
      {image && <img src={image} alt="hand" className="absolute inset-0 w-full h-full object-contain" />}
      <canvas ref={canvasRef} width={800} height={600} className="absolute inset-0 w-full h-full" />
      {debug && <canvas ref={overlayRef} width={800} height={600} className="absolute inset-0 w-full h-full" />}
    </div>
  );
}
