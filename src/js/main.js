import * as THREE from 'three';
import planetinfo from '../data/planet-info.json5';

export default class Main {
  constructor() {
    console.log(planetinfo.bodies[1].name);

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
  
    const scene = new THREE.Scene();
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    //const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
    const geometry = new THREE.SphereBufferGeometry(.1, 32, 32);

    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const material = new THREE.MeshPhongMaterial({color: 0xFFFA00});  // greenish blue
  
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  
    renderer.render(scene, camera);

    function render(time) {
      time *= 0.001;

      if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      sphere.position.x = Math.cos(time) * .5;
      sphere.position.y = Math.sin(time) * .5;

      // cube.rotation.x = time;
      // cube.rotation.y = time;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if(needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    requestAnimationFrame(render);
  }
}