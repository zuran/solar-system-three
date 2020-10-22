import * as THREE from 'three';
import planetinfo from '../data/planet-info.json5';
import { VRButton } from '../resources/examples/jsm/webxr/VRButton.js';
import jupiterImg from '../assets/2k_jupiter.jpg';
import saturnImg from '../assets/2k_saturn.jpg';
import mercuryImg from '../assets/2k_mercury.jpg';
import venusImg from '../assets/2k_venus_surface.jpg';
import earthImg from '../assets/2k_earth_daymap.jpg';
import marsImg from '../assets/2k_mars.jpg';
import neptuneImg from '../assets/2k_neptune.jpg';
import uranusImg from '../assets/2k_uranus.jpg';
import sunImg from '../assets/sunmap.jpg';
import saturnRingImg from '../assets/2k_saturn_ring_alpha.png';
import skybox from '../assets/milkyway.png';

import { Loader } from 'three';

export default class Main {
  constructor() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(toggleVR, renderer));

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.01;
    const far = 30;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    let isVR = false;
    function toggleVR(isOn) {
      dolly.rotation.y = isOn ? -Math.PI / 2 : 0;
      dolly.rotation.x = isOn ? Math.PI : 0;
      if (isOn) dolly.position.set(-0.5, 1, 0);
      else dolly.position.set(0, 0, 0);

      isVR = isOn;
    }

    camera.position.y = -0.1;
    camera.position.z = -0.5;
    camera.lookAt(0, 0, 0);
    camera.rotation.z = 2 * Math.PI;

    // camera.position.z = 2;
    // camera.position.y = 1;
    // camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const dolly = new THREE.Group();
    dolly.position.set(0, 0, 0);
    scene.add(dolly);
    dolly.add(camera);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;

    {
      const color = 0xffffff;
      const intensity = 0.9;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 0, 0);
      scene.add(light);

      const amblight = new THREE.AmbientLight(color, 0.2);
      scene.add(amblight);
    }

    renderer.render(scene, camera);

    const geom = new THREE.SphereBufferGeometry(0.03, 64, 64);
    const mate = new THREE.MeshStandardMaterial({
      color: 0xccbb00,
      //opacity: 0.5,
      //transparent: true,
    });

    const texLoader = new THREE.TextureLoader();
    //texLoader.load('../assets/2k_jupiter.jpg')
    // render skybox
    const skytex = texLoader.load(skybox, () => {
      const rt = new THREE.WebGLCubeRenderTarget(skytex.image.height);
      rt.fromEquirectangularTexture(renderer, skytex);
      scene.background = rt;
    });

    // const sun = new THREE.Mesh(
    //   geom,
    //   new THREE.MeshBasicMaterial({
    //     color: 0xffc800,
    //     map: texLoader.load(earthImg),
    //   })
    // );
    // sun.rotationPeriod = (planetinfo.bodies[0].rotationPeriod * Math.PI) / 180;
    // sun.rotation.x = (planetinfo.bodies[0].rotationInclination * Math.PI) / 180;
    // scene.add(sun);

    const texMap = {
      Sun: new THREE.MeshBasicMaterial({
        color: 0xffc800,
        map: texLoader.load(sunImg),
      }),
      Mercury: new THREE.MeshStandardMaterial({
        map: texLoader.load(mercuryImg),
      }),
      Venus: new THREE.MeshStandardMaterial({ map: texLoader.load(venusImg) }),
      Earth: new THREE.MeshStandardMaterial({ map: texLoader.load(earthImg) }),
      Mars: new THREE.MeshStandardMaterial({ map: texLoader.load(marsImg) }),
      Jupiter: new THREE.MeshStandardMaterial({
        map: texLoader.load(jupiterImg),
      }),
      Saturn: new THREE.MeshStandardMaterial({
        map: texLoader.load(saturnImg),
      }),
      Uranus: new THREE.MeshStandardMaterial({
        map: texLoader.load(uranusImg),
      }),
      Neptune: new THREE.MeshStandardMaterial({
        map: texLoader.load(neptuneImg),
      }),
    };

    function createPlanets() {
      // planetery scale multipliers - need to massage these to normalize the size somewhat
      const diameterScale = 0.000001;
      const distanceScale = 0.0008;
      const periodScale = 0.003;
      const longitudeScale = Math.PI / 180;

      let planets = [];
      //const astMat = new THREE.MeshPhongMaterial({ color: 0xd2691e });
      const astMat = new THREE.MeshPhongMaterial({ color: 0x886655 });
      const astGeo = new THREE.SphereBufferGeometry(0.001, 8, 8);

      for (let i = 0; i < 200; i++) {
        const asteroid = new THREE.Mesh(astGeo, astMat);

        asteroid.longitude = Math.random() * Math.PI * 2;
        asteroid.distance =
          0.2 + Math.pow(Math.sin(Math.random() * 2 * Math.PI), 2) * 0.25;
        asteroid.period = 4 + Math.random() * 3; //0.5;
        asteroid.rotation.x = Math.random() * Math.PI * 2;
        asteroid.rotation.z = Math.random() * Math.PI * 2;
        asteroid.rotation.y = Math.random() * Math.PI * 2;
        asteroid.position.y = 0.015 - Math.random() * 0.03;
        planets.push(asteroid);
        scene.add(asteroid);
      }
      // loop through bodies and add to scene;
      planetinfo.bodies.forEach((p) => {
        console.log(p.name + ':' + p.diameter);
        //if (p.name == 'Sun') return;
        const geo = new THREE.SphereBufferGeometry(
          p.diameter * diameterScale,
          64,
          64
        );
        const mat = new THREE.MeshPhongMaterial({ color: p.color });
        const planet = new THREE.Mesh(geo, texMap[p.name] || mat);

        if (p.name == 'Saturn') {
          // add ring
          const ringGeo = new THREE.RingBufferGeometry(
            p.diameter * diameterScale * 1.15,
            p.diameter * diameterScale * 1.8,
            64
          );
          const ringMat = new THREE.MeshPhongMaterial({ color: 0x665577 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.x = p.distance * distanceScale;
          ring.distance = p.distance * distanceScale;
          ring.period = p.period * periodScale;
          ring.longitude = p.longitude * longitudeScale;
          ring.dontRotate = true;
          ring.rotation.x =
            -Math.PI / 2 + p.rotationInclination * longitudeScale + Math.PI;
          ring.orbitalInclination = Math.sin(
            p.orbitalInclination * longitudeScale
          );
          planets.push(ring);
          scene.add(ring);
        }
        // test distance and period scales
        planet.position.x = p.distance * distanceScale;
        planet.distance = p.distance * distanceScale;
        planet.period = p.period * periodScale;
        planet.longitude = p.longitude * longitudeScale;
        planet.rotation.x = Math.PI + p.rotationInclination * longitudeScale;
        planet.rotationPeriod = p.rotationPeriod * longitudeScale;
        planet.rotationInclination = p.rotationInclination * longitudeScale;
        planet.orbitalInclination = Math.sin(
          p.orbitalInclination * longitudeScale
        );
        planets.push(planet);
        scene.add(planet);
      });
      // return body array
      return planets;
    }

    const bodies = createPlanets();

    function render(time) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // wiggle the sun
      // sun.position.x = Math.cos(time * 2) * 0.0003;
      // sun.position.z = Math.sin(time * 2) * 0.0003;
      // sun.rotation.y -= (1 / sun.rotationPeriod) * 0.01;

      bodies.forEach((planet) => {
        planet.position.x =
          Math.cos((time * 1) / planet.period + planet.longitude) *
          planet.distance;
        planet.position.z =
          Math.sin((time * 1) / planet.period + planet.longitude) *
          planet.distance;
        if (planet.orbitalInclination)
          planet.position.y =
            Math.sin(time / planet.period) *
            planet.orbitalInclination *
            planet.distance;
        if (!planet.dontRotate && planet.rotationPeriod) {
          planet.rotation.y += (1 / planet.rotationPeriod) * 0.005;
        }
      });

      renderer.render(scene, camera);
      //requestAnimationFrame(render);
    }

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;

      const pixelRatio = window.devicePixelRatio;
      const width = canvas.clientWidth * (isVR ? pixelRatio | 0 : 1);
      const height = canvas.clientHeight * (isVR ? pixelRatio | 0 : 1);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    //requestAnimationFrame(render);
    renderer.setAnimationLoop(render);
  }
}
