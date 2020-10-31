import {
  Mesh,
  MeshPhongMaterial,
  RingBufferGeometry,
  SphereBufferGeometry,
} from 'three';

const AsteroidColor = 0x886655;
const RingColor = 0xc5bbb2;
const AsteroidSegments = 4;
const PlanetSegments = 64;

export default class PlanetFactory {
  static createPlanets(scale, props, texturedMaterials) {}

  static createAsteroids(scale, props, count) {}

  static createAsteroid(scale, props) {
    const geometry = new SphereBufferGeometry(
      (props.diameter * scale.diameter) / 2,
      AsteroidSegments,
      AsteroidSegments
    );
    const material = new MeshPhongMaterial({ color: AsteroidColor });
    const asteroid = new Mesh(geometry, material);

    asteroid.position.y = props.y * scale.distance;

    asteroid.name = 'Asteroid';
    asteroid.distance = props.distance * scale.distance;
    asteroid.period = props.period * scale.period;
    asteroid.longitude = props.longitude * scale.radians;
    asteroid.dontRotate = true;

    asteroid.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    return asteroid;
  }

  static createRing(scale, props) {
    const geometry = new RingBufferGeometry(
      (props.diameter * scale.diameter) / 2 +
        (props.ringInner * scale.diameter) / 2,
      (props.diameter * scale.diameter) / 2 +
        (props.ringOuter * scale.diameter) / 2,
      PlanetSegments
    );
    const material = new MeshPhongMaterial({
      color: RingColor,
      opacity: 0.6,
      transparent: true,
    });
    const ring = new Mesh(geometry, material);

    ring.position.x = props.distance * scale.distance;
    ring.rotation.x =
      -Math.PI / 2 + props.rotationInclination * scale.radians + Math.PI;

    ring.name = props.name + 'Ring';
    ring.distance = props.distance * scale.distance;
    ring.period = props.period * scale.period;
    ring.longitude = props.longitude * scale.radians;
    ring.dontRotate = true;
    ring.orbitalInclination = Math.sin(
      props.orbitalInclination * scale.radians
    );

    return ring;
  }

  static createPlanet(scale, props, texturedMaterial) {
    const diameter =
      props.name == 'Sun' ? props.diameter / 34.8175 : props.diameter;
    const geometry = new SphereBufferGeometry(
      (diameter * scale.diameter) / 2,
      PlanetSegments,
      PlanetSegments
    );
    const material =
      texturedMaterial || new MeshPhongMaterial({ color: props.color });
    const planet = new Mesh(geometry, material);

    planet.position.x = props.distance * scale.distance;
    planet.rotation.x = Math.PI + props.rotationInclination * scale.radians;

    planet.isClickable = true;
    planet.name = props.name;
    planet.diameter = diameter * scale.diameter;
    planet.distance = props.distance * scale.distance;
    planet.period = props.period * scale.period;
    planet.longitude = props.longitude * scale.radians;
    planet.rotationPeriod = props.rotationPeriod * scale.radians;
    planet.rotationInclination = props.rotationInclination * scale.radians;
    planet.orbitalInclination = Math.sin(
      props.orbitalInclination * scale.radians
    );

    return planet;
  }
}
