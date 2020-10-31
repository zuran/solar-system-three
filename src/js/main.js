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
import sunImg from '../assets/2k_sun.jpg';
import plutoImg from '../assets/pluto.jpg';

import saturnRingImg from '../assets/2k_saturn_ring_alpha.png';
import skybox from '../assets/milkyway.jpg';

import ganymedeImg from '../assets/ganymede_4k.jpg';
import callistoImg from '../assets/callisto_4k.jpg';
import europaImg from '../assets/europa_4k.jpg';
import ioImg from '../assets/io_8k.jpg';
import theMoonImg from '../assets/2k_moon.jpg';

import dioneImg from '../assets/saturn/dione_rgb_cyl_www.jpg';
import enceladusImg from '../assets/saturn/enceladus_rgb_cyl_www.jpg';
import iapetusImg from '../assets/saturn/iapetus_rgb_cyl_www.jpg';
import mimasImg from '../assets/saturn/mimas_rgb_cyl_www.jpg';
import rheaImg from '../assets/saturn/rhea_rgb_cyl_www.jpg';
import tethysImg from '../assets/saturn/tethys_rgb_cyl_www.jpg';
import titanImg from '../assets/saturn/titan_texture_map_8k__2018_editon__by_fargetanik_dd05ce1-pre.jpg';

import phobosImg from '../assets/2048_phobos.jpg';
import deimosImg from '../assets/1024_deimos.jpg';

import { Loader, MathUtils } from 'three';
import PlanetFactory from './planet-factory';
import PickHelper from './pick-helper';
import { divide, max, pick, update } from 'lodash';

import * as moment from 'moment';

export default class Main {
  constructor() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(toggleVR, renderer));

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.001;
    const far = 1000;
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
      infoTitle.textContent = '';
      dataPanel.innerHTML = '';
      cameraTarget = new THREE.Vector3(0, -0.1, -0.5);
      dollyTarget = new THREE.Vector3(0, 0, 0);
    };

    let date = new Date(2020, 0);

    const infoPanel = document.createElement('div');
    infoPanel.style.position = 'absolute';
    infoPanel.style.width = '320px';
    //infoPanel.style.height = '250px';
    //infoPanel.style.padding = '12px 6px';
    infoPanel.style.border = '1px solid #fff';
    infoPanel.style.borderRadius = '4px';
    infoPanel.style.left = '32px';
    infoPanel.style.top = '32px';
    infoPanel.style.backgroundColor = 'rgba(16,16,16,0.8)';
    infoPanel.style.color = '#ddd';
    infoPanel.style.font = 'normal 30px sans-serif';

    const infoTitle = document.createElement('div');
    infoTitle.textContent = '';
    infoTitle.style.textAlign = 'center';
    infoTitle.style.height = '30px';
    infoTitle.style.padding = '10px';
    infoTitle.style.borderBottom = '1px solid #fff';

    const dataPanel = document.createElement('div');
    dataPanel.style.padding = '10px';
    dataPanel.style.fontSize = '15px';
    dataPanel.id = 'dataPanel';

    function getInfoPanel(info, isMoon, planetName) {
      const panel = document.createElement('div');
      panel.style.padding = '20px';

      const pDiameter = document.createElement('div');
      const pPeriod = document.createElement('div');
      const pDistance = document.createElement('div');
      const pRotationPeriod = document.createElement('div');
      const pRotationInclination = document.createElement('div');
      const pOrbitalInclination = document.createElement('div');

      pDiameter.textContent =
        'Diameter: ' + info.ogDiameter.toLocaleString() + ' km';
      pPeriod.textContent =
        'Orbital period: ' + info.period.toLocaleString() + ' days';
      pDistance.textContent =
        'Avg. distance from ' +
        (isMoon ? planetName : 'Sun') +
        ': ' +
        Math.round(info.ogDistance * 1000000).toLocaleString() +
        ' km';
      pRotationPeriod.textContent =
        'Rotation period: ' + info.rotationPeriod.toLocaleString() + ' hrs';
      pRotationInclination.textContent =
        'Obliquity: ' + info.ogObliquity.toLocaleString() + '°';
      pOrbitalInclination.textContent =
        'Oribital inclination: ' +
        info.orbitalInclination.toLocaleString() +
        '°';

      const isSun = info.name == 'Sun';

      panel.appendChild(pDiameter);
      if (!isSun) panel.appendChild(pPeriod);
      if (!isSun) panel.appendChild(pDistance);
      panel.appendChild(pRotationPeriod);
      panel.appendChild(pRotationInclination);
      if (!isSun) panel.appendChild(pOrbitalInclination);

      return panel;
      /*
      name: 'Mercury',
      diameter: 4879, // km
      period: 88, // Earth days
      distance: 57.9, // 10^6 km
      color: 0xba4a00,
      longitude: 262, // degrees
      rotationPeriod: 1407.6, // hours
      rotationInclination: 0.034, // degrees
      orbitalInclination: 7, // degrees
      */
    }

    document.body.appendChild(infoPanel);
    infoPanel.appendChild(infoTitle);
    infoPanel.appendChild(dataPanel);

    const dateBox = document.createElement('div');
    document.body.appendChild(dateBox);
    dateBox.textContent = date.toLocaleDateString('en-gb', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    dateBox.style.position = 'absolute';
    dateBox.style.bottom = '20px';
    dateBox.style.padding = '12px 6px';
    dateBox.style.borderRadius = '4px';
    dateBox.style.background = 'rgba(0,0,0,0.1)';
    dateBox.style.color = '#fff';
    dateBox.style.font = 'normal 20px sans-serif';
    dateBox.style.textAlign = 'center';
    dateBox.style.opacity = '0.5';
    dateBox.style.outline = 'none';
    dateBox.style.zIndex = '999';
    dateBox.style.right = 'calc(50% - 400px)';
    dateBox.style.width = '300px';

    centerButton.style.position = 'absolute';
    centerButton.style.bottom = '20px';
    centerButton.style.padding = '12px 6px';
    centerButton.style.border = '1px solid #fff';
    centerButton.style.borderRadius = '4px';
    centerButton.style.background = 'rgba(0,0,0,0.1)';
    centerButton.style.color = '#fff';
    centerButton.style.font = 'normal 40px sans-serif';
    centerButton.style.textAlign = 'center';
    centerButton.style.opacity = '0.5';
    centerButton.style.outline = 'none';
    centerButton.style.zIndex = '999';
    centerButton.style.left = 'calc(50% - 250px)';
    centerButton.style.width = '150px';

    let updateInfo = false;

    const earthButton = document.createElement('button');
    earthButton.textContent = 'Earth';
    document.body.appendChild(earthButton);
    earthButton.onclick = function () {
      selectedPlanet = 'Earth';
      updateInfo = true;
    };

    const jupiterButton = document.createElement('button');
    jupiterButton.textContent = 'Jupiter';
    document.body.appendChild(jupiterButton);
    jupiterButton.onclick = function () {
      selectedPlanet = 'Jupiter';
      updateInfo = true;
    };

    const mercuryButton = document.createElement('button');
    mercuryButton.textContent = 'Mercury';
    document.body.appendChild(mercuryButton);
    mercuryButton.onclick = function () {
      selectedPlanet = 'Mercury';
      updateInfo = true;
    };

    const saturnButton = document.createElement('button');
    saturnButton.textContent = 'Saturn';
    document.body.appendChild(saturnButton);
    saturnButton.onclick = function () {
      selectedPlanet = 'Saturn';
      updateInfo = true;
    };

    const uranusButton = document.createElement('button');
    uranusButton.textContent = 'Uranus';
    document.body.appendChild(uranusButton);
    uranusButton.onclick = function () {
      selectedPlanet = 'Uranus';
      updateInfo = true;
    };

    const neptuneButton = document.createElement('button');
    neptuneButton.textContent = 'Neptune';
    document.body.appendChild(neptuneButton);
    neptuneButton.onclick = function () {
      selectedPlanet = 'Neptune';
      updateInfo = true;
    };

    const plutoButton = document.createElement('button');
    plutoButton.textContent = 'Pluto';
    document.body.appendChild(plutoButton);
    plutoButton.onclick = function () {
      selectedPlanet = 'Pluto';
      updateInfo = true;
    };

    // camera.position.z = 2;
    // camera.position.y = 1;
    // camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const dolly = new THREE.Group();
    dolly.position.set(0, 0, 0);
    scene.add(dolly);
    dolly.add(camera);

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

    const texLoader = new THREE.TextureLoader();
    // render skybox
    const skytex = texLoader.load(skybox, () => {
      const rt = new THREE.WebGLCubeRenderTarget(skytex.image.height);
      rt.fromEquirectangularTexture(renderer, skytex);
      scene.background = rt;
    });

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
      Ganymede: new THREE.MeshStandardMaterial({
        map: texLoader.load(ganymedeImg),
      }),
      Callisto: new THREE.MeshStandardMaterial({
        map: texLoader.load(callistoImg),
      }),
      Europa: new THREE.MeshStandardMaterial({
        map: texLoader.load(europaImg),
      }),
      Io: new THREE.MeshStandardMaterial({
        map: texLoader.load(ioImg),
      }),
      // Saturn moons
      Dione: new THREE.MeshStandardMaterial({
        map: texLoader.load(dioneImg),
      }),
      Enceladus: new THREE.MeshStandardMaterial({
        map: texLoader.load(enceladusImg),
      }),
      Iapetus: new THREE.MeshStandardMaterial({
        map: texLoader.load(iapetusImg),
      }),
      Mimas: new THREE.MeshStandardMaterial({
        map: texLoader.load(mimasImg),
      }),
      Rhea: new THREE.MeshStandardMaterial({
        map: texLoader.load(rheaImg),
      }),
      Tethys: new THREE.MeshStandardMaterial({
        map: texLoader.load(tethysImg),
      }),
      Titan: new THREE.MeshStandardMaterial({
        map: texLoader.load(titanImg),
      }),
      Deimos: new THREE.MeshStandardMaterial({
        map: texLoader.load(deimosImg),
      }),
      Phobos: new THREE.MeshStandardMaterial({
        map: texLoader.load(phobosImg),
      }),
      'The Moon': new THREE.MeshStandardMaterial({
        map: texLoader.load(theMoonImg),
      }),
      Pluto: new THREE.MeshStandardMaterial({
        map: texLoader.load(plutoImg),
      }),
    };

    const scale = {
      diameter: 0.000002,
      distance: 0.0008,
      period: 0.003,
      radians: Math.PI / 180,
    };

    let tests = [];
    planetinfo.bodies.forEach((p) => {
      p.ogDiameter = p.diameter;
      p.ogDistance = p.distance;
      p.ogObliquity = p.rotationInclination;

      let plan = PlanetFactory.createPlanet(scale, p, texMap[p.name]);
      if (p.ringInner) {
        let ring = PlanetFactory.createRing(scale, p);
        scene.add(ring);
        tests.push(ring);
        ring = PlanetFactory.createRing(scale, p);
        ring.rotation.y = Math.PI;
        scene.add(ring);
        tests.push(ring);
      }

      plan.info = p;
      scene.add(plan);
      tests.push(plan);

      if (p.moons) {
        let minMoonPeriod = 100000;
        let minMoonDiameter = 100000;
        let minMoonAct = 100000;
        p.moons.forEach((m) => {
          minMoonPeriod = Math.min(minMoonPeriod, m.period);
          minMoonAct = Math.min(minMoonAct, m.distance);
          minMoonDiameter = Math.min(minMoonDiameter, m.diameter);
        });

        p.moons.forEach((m) => {
          const periodScale = 184 / minMoonPeriod;
          const diameterScale = 300 / minMoonDiameter;

          m.ogDiameter = m.diameter;
          m.ogDistance = m.distance;
          m.ogObliquity = m.rotationInclination;

          m.rotationInclination += p.rotationInclination;
          m.diameter = Math.max(m.diameter * diameterScale, m.diameter);
          m.distance =
            p.diameter * (scale.diameter / 2 / scale.distance) + // planet radius
            m.diameter * (scale.diameter / 2 / scale.distance) + // moon radius
            m.distance + // moon distance
            m.diameter * // scale distance to closest moon
              (scale.diameter / scale.distance) *
              (m.distance / minMoonAct) *
              0.2;

          //m.period = m.period * periodScale;
          let moon = PlanetFactory.createPlanet(
            scale,
            m,
            texMap[m.name] || texMap['Mercury']
          );
          moon.orbitalInclination += plan.rotationInclination;

          moon.info = m;
          moon.isMoon = true;
          moon.planet = plan;
          scene.add(moon);
          tests.push(moon);
        });
      }
    });
    for (let i = 0; i < 200; i++) {
      let dist = Math.random();

      // Get range between Mars and Jupiter
      const dMin =
        planetinfo.bodies[4].distance +
        (planetinfo.bodies[4].diameter / 1000) * 2;
      const dMax =
        planetinfo.bodies[5].distance -
        (planetinfo.bodies[5].diameter / 1000) * 2;

      const p = {
        diameter: 1000,
        longitude: Math.random() * 360,
        distance: dist * (dMax - dMin) + dMin,
        period: dist * (2920 - 1095) + 1095,
        y: Math.random() * 32 - 16,
      };
      let asteroid = PlanetFactory.createAsteroid(scale, p);
      scene.add(asteroid);
      tests.push(asteroid);
    }

    let bodies = tests; // createPlanets();
    //bodies = [...bodies, ...tests];

    let bodyScale = 1;
    let distanceScale = 1;
    const growButton = document.createElement('button');
    growButton.textContent = 'Grow';
    document.body.appendChild(growButton);
    growButton.onclick = function () {
      bodyScale *= 1.1;
      distanceScale *= 1.05;

      bodies.forEach((planet) => {
        //if (planet.name != 'Sun')
        planet.scale.set(bodyScale, bodyScale, bodyScale);
        planet.distance *= distanceScale;
      });
    };

    function getCanvasRelativePosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    }

    const pickHelper = new PickHelper();

    function setPickPosition(event) {
      const pos = getCanvasRelativePosition(event);
      const pickPosition = {
        x: (pos.x / canvas.width) * 2 - 1,
        y: (pos.y / canvas.height) * -2 + 1,
      };
      selectedPlanet = pickHelper.pick(pickPosition, scene, camera);
      if (selectedPlanet) {
        infoTitle.textContent = selectedPlanet;
        updateInfo = true;
      }
    }

    window.addEventListener('mousedown', setPickPosition);

    window.addEventListener(
      'touchstart',
      (event) => {
        //event.preventDefault();
        setPickPosition(event.touches[0]);
      },
      { passive: false }
    );

    let lastTime = 0;
    let planetOrbitClock = 0;
    let moonOrbitClock = 0;
    let rotationClock = 0;
    let clock = 0;

    let moonOrbitScale = 0.000005;
    let planetOrbitScale = 0.00005;
    let rotationScale = 0.000005;

    function render(time) {
      const timeDiff = time - lastTime;
      lastTime = time;

      clock += timeDiff * 0.000005;
      planetOrbitClock += timeDiff * planetOrbitScale;
      moonOrbitClock += timeDiff * moonOrbitScale;
      rotationClock += timeDiff * rotationScale;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      if (!isVR) {
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
      }

      bodies.forEach((planet) => {
        if (planet.name == 'Earth') {
          const val =
            (planetOrbitClock / planet.period / (Math.PI * 2)) *
            360 *
            (365.25 / 360);
          let dt = moment('2020-01-01');
          dt.add(val, 'day');

          let dateRep = 'Earth Date: ' + dt.format('DD MMM YYYY');
          dateBox.textContent = dateRep;
        }

        if (planet.name == selectedPlanet) {
          if (updateInfo) {
            updateInfo = false;
            infoTitle.textContent = selectedPlanet;
            dataPanel.innerHTML = getInfoPanel(
              planet.info,
              planet.isMoon,
              planet.isMoon ? planet.planet.name : ''
            ).innerHTML;
          }

          cameraTarget = new THREE.Vector3(
            0,
            -0.1 * 4 * planet.diameter,
            -0.5 * 4 * planet.diameter
          );
          dollyTarget = planet.position;
        }

        const bClock = planet.isMoon ? moonOrbitClock : planetOrbitClock;

        planet.position.x =
          Math.cos((bClock * 1) / planet.period + planet.longitude) *
          planet.distance;
        planet.position.z =
          Math.sin((bClock * 1) / planet.period + planet.longitude) *
          planet.distance;

        if (planet.orbitalInclination) {
          planet.position.y =
            -Math.sin(bClock / planet.period + planet.longitude) *
            planet.orbitalInclination *
            planet.distance;
        }

        if (!planet.dontRotate && planet.rotationPeriod) {
          planet.rotation.y += (1 / planet.rotationPeriod) * 0.005;
        }

        if (planet.isMoon) {
          planet.position.x += planet.planet.position.x;
          planet.position.z += planet.planet.position.z;
          planet.position.y += planet.planet.position.y;
          //if (planet.orbitalInclination)
          //  planet.position.y += planet.planet.position.y;
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
