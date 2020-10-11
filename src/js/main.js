import * as THREE from 'three';
import planetinfo from '../data/planet-info.json5';

export default class Main {
  constructor() {
    console.log(planetinfo.bodies[1].name);

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.01;
    const far = 30;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = .1;
    camera.position.y = -.5;
    camera.lookAt(0,0,0);
  
    const scene = new THREE.Scene();
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;

    {
      const color = 0xFFFFFF;
      const intensity = .5;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 0, 0);
      scene.add(light);

      const amblight = new THREE.AmbientLight(color, 0.3);
      scene.add(amblight);
    }

    renderer.render(scene, camera);

    const geom = new THREE.SphereBufferGeometry(0.03, 64, 64);
    const mate = new THREE.MeshBasicMaterial({
      color: 0xccbb00,
      //opacity: 0.5,
      //transparent: true,
    });
    const sun = new THREE.Mesh(geom, mate);
    scene.add(sun);

    function createPlanets() {
      // planetery scale multipliers - need to massage these to normalize the size somewhat
      const diameterScale = 0.0000005;
      const distanceScale = 0.0008;
      const periodScale = 0.002;

      let planets = [];
      // loop through bodies and add to scene;
      planetinfo.bodies.forEach(p => {
        if(p.name == 'Sun') return;
        const geo = new THREE.SphereBufferGeometry(p.diameter * diameterScale, 64, 64);
        const mat = new THREE.MeshPhongMaterial({color: p.color});
        const planet = new THREE.Mesh(geo, mat);
        // test distance and period scales
        planet.position.x = p.distance * distanceScale;
        planet.distance = p.distance * distanceScale;
        planet.period = p.period * periodScale;
        planets.push(planet);
        scene.add(planet);
      });
      // return body array
      return planets;
    }

    const bodies = createPlanets();

    function render(time) {
      time *= 0.001;

      if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // wiggle the sun
      sun.position.x = Math.cos(time * 2) * .0003;
      sun.position.y = Math.sin(time * 2) * .0003;
      

      bodies.forEach(planet => {
        planet.position.x = Math.cos(time * 1/planet.period) * planet.distance;
        planet.position.y = Math.sin(time * 1/planet.period) * planet.distance;
      });

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