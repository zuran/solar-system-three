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
import skyboxImg from '../assets/milkyway.jpg';

import phobosImg from '../assets/2048_phobos.jpg';
import deimosImg from '../assets/1024_deimos.jpg';

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

const textures = [
  // Skybox
  { name: 'SkyBox', image: skyboxImg },

  // Sun and Planets
  { name: 'Sun', image: sunImg, isBasic: true },
  { name: 'Mercury', image: mercuryImg },
  { name: 'Venus', image: venusImg },
  { name: 'Earth', image: earthImg },
  { name: 'Mars', image: marsImg },
  { name: 'Jupiter', image: jupiterImg },
  { name: 'Saturn', image: saturnImg },
  { name: 'Uranus', image: uranusImg },
  { name: 'Neptune', image: neptuneImg },
  { name: 'Pluto', image: plutoImg },

  // Moons - Earth
  { name: 'The Moon', image: theMoonImg },
  // Moons - Mars
  { name: 'Phobos', image: phobosImg },
  { name: 'Deimos', image: deimosImg },
  // Moons - Jupiter
  { name: 'Ganymede', image: ganymedeImg },
  { name: 'Callisto', image: callistoImg },
  { name: 'Europa', image: europaImg },
  { name: 'Io', image: ioImg },
  // Moons - Saturn
  { name: 'Dione', image: dioneImg },
  { name: 'Enceladus', image: enceladusImg },
  { name: 'Iapetus', image: iapetusImg },
  { name: 'Mimas', image: mimasImg },
  { name: 'Rhea', image: rheaImg },
  { name: 'Tethys', image: tethysImg },
  { name: 'Titan', image: titanImg },
];

function createTextureMap(loader, textures, basicMaterial, standardMaterial) {
  let textureMap = {};
  textures.forEach((t) => {
    textureMap[t.name] = t.isBasic
      ? new basicMaterial({ map: loader.load(t.image) })
      : new standardMaterial({ map: loader.load(t.image) });
  });
  return textureMap;
}

export { textures, createTextureMap };
