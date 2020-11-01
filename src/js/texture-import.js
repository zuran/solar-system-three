import * as THREE from 'three';

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

export default class TextureImporter {
  static importTextures() {
    const textures = {};
    textures.jupiterImg = jupiterImg;
    textures.saturnImg = saturnImg;
    textures.mercuryImg = mercuryImg;
    textures.venusImg = venusImg;
    textures.earthImg = earthImg;
    textures.marsImg = marsImg;
    textures.neptuneImg = neptuneImg;
    textures.uranusImg = uranusImg;
    textures.sunImg = sunImg;
    textures.plutoImg = plutoImg;
    textures.saturnRingImg = saturnRingImg;
    textures.skybox = skybox;
    textures.ganymedeImg = ganymedeImg;
    textures.callistoImg = callistoImg;
    textures.europaImg = europaImg;
    textures.ioImg = ioImg;
    textures.theMoonImg = theMoonImg;
    textures.dioneImg = dioneImg;
    textures.enceladusImg = enceladusImg;
    textures.iapetusImg = iapetusImg;
    textures.mimasImg = mimasImg;
    textures.rheaImg = rheaImg;
    textures.tethysImg = tethysImg;
    textures.titanImg = titanImg;
    textures.phobosImg = phobosImg;
    textures.deimosImg = deimosImg;

    return textures;
  }

  static getTexMap() {
    const texLoader = new THREE.TextureLoader();

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
    return texMap;
  }
}
