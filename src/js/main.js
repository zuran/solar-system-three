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

import { Loader, MathUtils } from 'three';
import PlanetFactory from './planet-factory';

export default class Main {
  constructor() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(toggleVR, renderer));

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.001;
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

    let selectedPlanet = '';

    function centerView() {
      selectedPlanet = '';
      camera.position.y = -0.1;
      camera.position.z = -0.5;
      dolly.position.set(0, 0, 0);
    }

    let cameraTarget = new THREE.Vector3(0, -0.1, -0.5);
    let dollyTarget = new THREE.Vector3(0, 0, 0);

    const centerButton = document.createElement('button');
    centerButton.textContent = 'Center';
    document.body.appendChild(centerButton);
    centerButton.onclick = function () {
      selectedPlanet = '';
      //centerView();
      cameraTarget = new THREE.Vector3(0, -0.1, -0.5);
      dollyTarget = new THREE.Vector3(0, 0, 0);
    };

    const earthButton = document.createElement('button');
    earthButton.textContent = 'Earth';
    document.body.appendChild(earthButton);
    earthButton.onclick = function () {
      selectedPlanet = 'Earth';
    };

    const jupiterButton = document.createElement('button');
    jupiterButton.textContent = 'Jupiter';
    document.body.appendChild(jupiterButton);
    jupiterButton.onclick = function () {
      selectedPlanet = 'Jupiter';
    };

    const mercuryButton = document.createElement('button');
    mercuryButton.textContent = 'Mercury';
    document.body.appendChild(mercuryButton);
    mercuryButton.onclick = function () {
      selectedPlanet = 'Mercury';
    };

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

    const scale = {
      diameter: 0.000001,
      distance: 0.0008,
      period: 0.003,
      radians: Math.PI / 180,
    };

    let tests = [];
    planetinfo.bodies.forEach((p) => {
      let plan = PlanetFactory.createPlanet(scale, p, texMap[p.name]);
      if (p.ringInner) {
        let ring = PlanetFactory.createRing(scale, p);
        scene.add(ring);
        tests.push(ring);
      }
      scene.add(plan);
      tests.push(plan);
    });
    for (let i = 0; i < 2000; i++) {
      let dist = Math.random();

      const p = {
        diameter: 1000,
        longitude: Math.random() * 360,
        distance: dist * (778.6 - 227.9) + 227.9,
        period: dist * (2920 - 1095) + 1095,
        y: Math.random() * 64 - 32,
      };
      let asteroid = PlanetFactory.createAsteroid(scale, p);
      scene.add(asteroid);
      tests.push(asteroid);
    }

    let bodies = tests; // createPlanets();
    //bodies = [...bodies, ...tests];

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

      if (selectedPlanet == '') {
        camera.position.lerp(cameraTarget, 0.01);
        dolly.position.lerp(dollyTarget, 0.01);
      } else {
        const factor = MathUtils.clamp(
          1 / (dolly.position.distanceTo(dollyTarget) * 300),
          0.01,
          1
        );

        camera.position.lerp(cameraTarget, factor);
        dolly.position.lerp(dollyTarget, factor);
      }

      bodies.forEach((planet) => {
        if (planet.name == selectedPlanet) {
          // dolly.position.set(
          //   planet.position.x,
          //   planet.position.y,
          //   planet.position.z
          // );
          // camera.position.y = -0.1 * 7 * planet.diameter;
          // camera.position.z = -0.5 * 7 * planet.diameter;

          cameraTarget = new THREE.Vector3(
            0,
            -0.1 * 7 * planet.diameter,
            -0.5 * 7 * planet.diameter
          );
          dollyTarget = planet.position;
        }

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
