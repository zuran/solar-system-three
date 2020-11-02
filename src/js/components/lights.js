import * as THREE from 'three';

export default class Lights {
  constructor(scene) {
    const color = 0xffffff;
    const sunlight = new THREE.PointLight(color, 0.9);
    sunlight.position.set(0, 0, 0);

    const ambientlight = new THREE.AmbientLight(color, 0.2);

    scene.add(ambientlight);
    scene.add(sunlight);
  }
}
