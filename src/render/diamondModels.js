import * as THREE from 'three';

export function createDiamondGeometry(shape, size) {
  const radius = size / 2;
  if (shape === 'round') return new THREE.OctahedronGeometry(radius, 2);
  if (shape === 'oval') return new THREE.SphereGeometry(radius, 32, 24).scale(1.35, 1, 1);
  if (shape === 'emerald') return new THREE.BoxGeometry(size * 1.4, size * 0.72, size * 0.5);
  return new THREE.BoxGeometry(size * 1.08, size, size * 0.6);
}

export function createRingGroup({ shape, sizePx }) {
  const group = new THREE.Group();
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(sizePx * 0.52, sizePx * 0.12, 24, 64),
    new THREE.MeshStandardMaterial({ color: '#e5e7eb', metalness: 1, roughness: 0.18 })
  );
  band.rotation.x = Math.PI / 2;

  const diamond = new THREE.Mesh(
    createDiamondGeometry(shape, sizePx * 0.52),
    new THREE.MeshPhysicalMaterial({
      color: '#f5faff',
      transmission: 1,
      ior: 2.4,
      thickness: 0.6,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
    })
  );
  diamond.position.y = sizePx * 0.18;
  group.add(band, diamond);
  return group;
}
