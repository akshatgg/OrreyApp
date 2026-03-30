import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

export class GravityField {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.gridSize = options.gridSize || 80;
        this.segments = options.segments || 120;
        this.strength = options.strength || 2.0;
        this.yOffset = options.yOffset || -1.0;

        const vertexCount = (this.segments + 1) * (this.segments + 1);

        // Create plane geometry and remap from XY to XZ plane
        this.geometry = new THREE.PlaneGeometry(this.gridSize, this.gridSize, this.segments, this.segments);
        const posArr = this.geometry.attributes.position.array;

        this.basePositions = new Float32Array(posArr.length);

        for (let i = 0; i < vertexCount; i++) {
            const idx = i * 3;
            this.basePositions[idx]     = posArr[idx];       // x stays
            this.basePositions[idx + 1] = 0;                 // y = 0 (flat base)
            this.basePositions[idx + 2] = posArr[idx + 1];   // old y -> z

            posArr[idx + 2] = posArr[idx + 1];               // z = old y
            posArr[idx + 1] = this.yOffset;                  // y = base offset
        }

        this.geometry.attributes.position.needsUpdate = true;

        // Add vertex colors
        const colors = new Float32Array(vertexCount * 3);
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.material = new THREE.MeshBasicMaterial({
            wireframe: true,
            vertexColors: true,
            transparent: true,
            opacity: options.opacity || 0.7,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.mesh.visible = false; // default OFF
        scene.add(this.mesh);

        this.positionAttr = this.geometry.attributes.position;
        this.colorAttr = this.geometry.attributes.color;

        // Pre-allocate bodies array to avoid per-frame allocation
        this._bodies = [];
    }

    update(sun, planets) {
        if (!this.mesh.visible) return;

        const posArr = this.positionAttr.array;
        const colorArr = this.colorAttr.array;
        const vertexCount = (this.segments + 1) * (this.segments + 1);

        // Extract body data into plain objects for fast access
        const bodies = this._bodies;
        bodies.length = 0;
        bodies.push({ x: sun.pos.x, y: sun.pos.y, z: sun.pos.z, mass: sun.mass });
        for (let i = 0; i < planets.length; i++) {
            const p = planets[i];
            bodies.push({ x: p.pos.x, y: p.pos.y, z: p.pos.z, mass: p.mass });
        }
        const bodyCount = bodies.length;

        let maxPhi = 0;

        // First pass: compute gravitational potential per vertex
        for (let i = 0; i < vertexCount; i++) {
            const idx = i * 3;
            const vx = this.basePositions[idx];
            const vz = this.basePositions[idx + 2];

            let phi = 0;
            for (let b = 0; b < bodyCount; b++) {
                const body = bodies[b];
                const dx = vx - body.x;
                const dz = vz - body.z;
                const distSq = dx * dx + dz * dz;
                const dist = Math.max(Math.sqrt(distSq), 0.5);
                phi += Math.log(1.0 + body.mass / dist);
            }

            if (phi > maxPhi) maxPhi = phi;
            // Temporarily store raw phi in Y
            posArr[idx + 1] = phi;
        }

        // Second pass: normalize, apply displacement and colors
        const invMaxPhi = maxPhi > 0 ? 1.0 / maxPhi : 1.0;

        for (let i = 0; i < vertexCount; i++) {
            const idx = i * 3;
            const phi = posArr[idx + 1];
            const t = phi * invMaxPhi; // 0..1

            // Displacement
            posArr[idx + 1] = this.yOffset - t * this.strength;

            // Color gradient: dark purple -> teal -> cyan -> white
            // R channel
            if (t < 0.3) {
                colorArr[idx] = 0.02 + t * 0.267;
            } else if (t < 0.65) {
                colorArr[idx] = 0.10 + (t - 0.3) * 0.571;
            } else {
                colorArr[idx] = 0.30 + (t - 0.65) * 2.0;
            }

            // G channel
            if (t < 0.3) {
                colorArr[idx + 1] = 0.01 + t * 0.633;
            } else if (t < 0.65) {
                colorArr[idx + 1] = 0.20 + (t - 0.3) * 1.714;
            } else {
                colorArr[idx + 1] = 0.80 + (t - 0.65) * 0.571;
            }

            // B channel
            if (t < 0.3) {
                colorArr[idx + 2] = 0.08 + t * 0.9;
            } else if (t < 0.65) {
                colorArr[idx + 2] = 0.35 + (t - 0.3) * 1.857;
            } else {
                colorArr[idx + 2] = 1.0;
            }
        }

        this.positionAttr.needsUpdate = true;
        this.colorAttr.needsUpdate = true;
    }

    setVisible(visible) {
        this.mesh.visible = visible;
    }

    setStrength(strength) {
        this.strength = strength;
    }

    setGridSize(newSize) {
        this.gridSize = newSize;
        this.geometry.dispose();

        const vertexCount = (this.segments + 1) * (this.segments + 1);
        const geo = new THREE.PlaneGeometry(newSize, newSize, this.segments, this.segments);
        const posArr = geo.attributes.position.array;

        this.basePositions = new Float32Array(posArr.length);
        for (let i = 0; i < vertexCount; i++) {
            const idx = i * 3;
            this.basePositions[idx]     = posArr[idx];
            this.basePositions[idx + 1] = 0;
            this.basePositions[idx + 2] = posArr[idx + 1];
            posArr[idx + 2] = posArr[idx + 1];
            posArr[idx + 1] = this.yOffset;
        }
        geo.attributes.position.needsUpdate = true;

        const colors = new Float32Array(vertexCount * 3);
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.mesh.geometry = geo;
        this.geometry = geo;
        this.positionAttr = geo.attributes.position;
        this.colorAttr = geo.attributes.color;
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }
}
