import * as THREE from 'three';
import planetinfo from '../data/planet-info.json5';
import {VRButton} from '../resources/examples/jsm/webxr/VRButton.js';

export default class Main {
  constructor() {
    console.log(planetinfo.bodies[1].name);

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(adjustForVR, renderer));
  
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.01;
    const far = 30;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    let isVR = false;
    function adjustForVR() {
      dolly.rotation.y = -Math.PI/2;
      dolly.rotation.x = Math.PI;
      dolly.position.set(-.5, 1, 0);
      
      isVR = true;
    }

    const sunShader = `
      #include <common>  

      uniform vec3 iResolution;
      uniform float iTime;

      vec2 random2(vec2 p) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord )
      {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 st = fragCoord/iResolution.xy;
        st.x *= iResolution.x/iResolution.y;
        vec3 color = vec3(0.);
        
        st *= 50.;
        vec2 i_st = floor(st);
        vec2 f_st = fract(st);
        
        float m_dist = 1.;
        for(int y = -1; y <=1; y++) {
            for(int x = -1; x <=1; x++) {
                vec2 neighbor = vec2(float(x),float(y));
                
                vec2 point = random2(i_st + neighbor);
                
                point = 0.5 + 0.5*sin(iTime + 6.2831*point);
                vec2 diff = neighbor + point - f_st;
                float dist = length(diff);
                m_dist = min(m_dist,dist);
            }
        }
        
        color += m_dist * vec3(.8,.7,0);
        color += (1.-m_dist) * vec3(.7,.2,.2);
    
        // Output to screen
        fragColor = vec4(color,1.0);
      }
          
      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;


    //camera.position.z = 2;
    //camera.position.y = 0;

    camera.position.y = -.1;
    camera.position.z = -.5;
    camera.lookAt(0,0,0);  
    camera.rotation.z = 2*Math.PI;
    
    const scene = new THREE.Scene();
  
    const dolly = new THREE.Group();
    dolly.position.set(0, 0, 0);
    scene.add(dolly);
    dolly.add(camera);


    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;

    {
      const color = 0xFFFFFF;
      const intensity = .7;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 0, 0);
      scene.add(light);

      const amblight = new THREE.AmbientLight(color, 0.2);
      scene.add(amblight);
    }

    renderer.render(scene, camera);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
    };

    const sun_material = new THREE.ShaderMaterial({
      fragmentShader: sunShader,
      uniforms,
    });

    const geom = new THREE.SphereBufferGeometry(0.03, 64, 64);
    const mate = new THREE.MeshBasicMaterial({
      color: 0xccbb00,
      //opacity: 0.5,
      //transparent: true,
    });
    const sun = new THREE.Mesh(geom, sun_material);
    scene.add(sun);

    function createPlanets() {
      // planetery scale multipliers - need to massage these to normalize the size somewhat
      const diameterScale = 0.0000005;
      const distanceScale = 0.0008;
      const periodScale = 0.003;
      const longitudeScale = Math.PI / 180;

      let planets = [];

      for(let i = 0; i < 200; i++) {
        const astGeo = new THREE.SphereBufferGeometry(0.001, 8, 8);
        const astMat = new THREE.MeshPhongMaterial({color: 0xD2691E});
        const asteroid = new THREE.Mesh(astGeo, astMat);

        asteroid.longitude = Math.random() * Math.PI * 2;
        asteroid.distance = 0.2 + Math.pow(
          Math.sin(Math.random() * 2 * Math.PI), 2) * 0.25
        asteroid.period = 5 + Math.random() * 3;//0.5;
        asteroid.rotation.x = Math.random() * Math.PI * 2;
        asteroid.rotation.z = Math.random() * Math.PI * 2;
        asteroid.rotation.y = Math.random() * Math.PI * 2;
        asteroid.position.y = .015 - Math.random() * .03;
        planets.push(asteroid);
        scene.add(asteroid);
      }
      // loop through bodies and add to scene;
      planetinfo.bodies.forEach(p => {
        if(p.name == 'Sun') return;
        const geo = new THREE.SphereBufferGeometry(p.diameter * diameterScale, 64, 64);
        const mat = new THREE.MeshPhongMaterial({color: p.color});
        const planet = new THREE.Mesh(geo, mat);

        if(p.name == 'Saturn') {
          // add ring
          const ringGeo = new THREE.RingBufferGeometry(p.diameter * diameterScale * 1.15, p.diameter * diameterScale * 1.8, 64);
          const ringMat = new THREE.MeshPhongMaterial({color: p.color * .9});
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.x = p.distance * distanceScale;
          ring.distance = p.distance * distanceScale;
          ring.period = p.period * periodScale;
          ring.longitude = p.longitude * longitudeScale;
          ring.rotation.x = Math.PI/6;
          //ring.rotation.y = Math.PI / 2;          
          planets.push(ring);
          scene.add(ring);
        }
        // test distance and period scales
        planet.position.x = p.distance * distanceScale;
        planet.distance = p.distance * distanceScale;
        planet.period = p.period * periodScale;
        planet.longitude = p.longitude * longitudeScale;
        planets.push(planet);
        scene.add(planet);
      });
      // return body array
      return planets;
    }

    const bodies = createPlanets();

    function render(time) {
      time *= 0.001;

      // sun material
      uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
      uniforms.iTime.value = time;

      if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // wiggle the sun
      sun.position.x = Math.cos(time * 2) * .0003;
      sun.position.z = Math.sin(time * 2) * .0003;
      

      bodies.forEach(planet => {
        planet.position.x = Math.cos(time * 1/planet.period + planet.longitude) * planet.distance;
        planet.position.z = Math.sin(time * 1/planet.period + planet.longitude) * planet.distance;
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
      if(needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    //requestAnimationFrame(render);
    renderer.setAnimationLoop(render);
  }
}