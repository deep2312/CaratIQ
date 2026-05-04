import * as THREE from 'three';

export function initThree(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
  camera.position.set(0, 0, 120);

  const hemi = new THREE.HemisphereLight('#ffffff', '#4b5563', 1.1);
  const key = new THREE.DirectionalLight('#fff', 1.4);
  key.position.set(20, 20, 40);
  scene.add(hemi, key);

  return { renderer, scene, camera };
}

export function adaptLighting(scene, normalizedBrightness) {
  const factor = 0.8 + normalizedBrightness * 0.8;
  scene.children.forEach((node) => {
    if (node.isLight) node.intensity = (node.type === 'DirectionalLight' ? 1.2 : 1.0) * factor;
  });
}
