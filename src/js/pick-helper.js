import { Raycaster } from 'three';

export default class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
  }

  pick(normalizedPosition, scene, camera) {
    if (this.pickedObject) {
      this.pickedObject = undefined;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
      console.log(this.pickedObject.name);
      if (this.pickedObject.name == 'SaturnRing') {
        this.pickedObject = intersectedObjects[1]
          ? intersectedObjects[1].object
          : this.pickedObject;
      }
      if (this.pickedObject.isClickable) return this.pickedObject.name;
    }
    return undefined;
  }
}
