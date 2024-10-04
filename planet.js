import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

export class Planet {
    constructor(document, scene, orbit, name, mass, radius, texturePath, v, description) {
        this.name = name;
        this.orbit = orbit;
        this.radius = radius;
        this.mass = mass;
        this.description = description;
        this.v = v;
        this.orbitComplete = 0;

        this.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePath) });
        this.geometry = new THREE.SphereGeometry(radius, 50, 50);
        this.sphere = new THREE.Mesh(this.geometry, this.material);

        const p = document.createElement('p');
        p.textContent = name;
        const nameLabel = new CSS2DObject(p);
        nameLabel.position.set(0, radius + 0.5, 0);
        this.sphere.add(nameLabel);

        scene.add(this.sphere);
    }

    translate(vec) {
        this.sphere.position.set(vec[0], vec[1], vec[2]);
    }

    getMesh() {
        return this.sphere;
    }

    movePlanet(time) {
        let newPosition = new THREE.Vector3();
        this.orbit.getPoint(this.orbitComplete, newPosition);
        this.sphere.position.copy(newPosition);
        this.orbitComplete = (this.orbitComplete + time * this.v) % 1;
    }

    get pos() {
        return this.sphere.position;
    }

    set pos(vec) {
        this.sphere.position.copy(vec);
    }
}
