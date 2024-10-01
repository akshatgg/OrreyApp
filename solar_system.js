import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';

export class SolarSystem {
    constructor(document, scene) {
        const sunscale = 400;
        const scale = 4000;
        const sunRadius =  4.6524e-3 * sunscale;

        const mercuryRadius = 1.6310e-5 * scale * 3.5;
        const venusRadius = 4.0454e-5 * scale * 3.5;
        const earthRadius = 4.2633e-5 * scale * 3.5;
        const marsRadius = 2.2714e-5 * scale * 3.5;
        const jupiterRadius = 4.7787e-4 * scale;
        const saturnRadius = 4.0287e-4 * scale;
        const uranusRadius = 1.7085e-4 * scale * 2;
        const neptuneRadius = 1.655e-4 * scale * 2;

        // Dwarf planets
        const ceresRadius = 1.6310e-5 * scale * 3.5;
        const plutoRadius = 4.0454e-5 * scale * 3.5;
        const makemakeRadius = 4.2633e-5 * scale * 3.5;
        const haumeaRadius = 2.2714e-5 * scale * 3.5;
        const erisRadius = 2.2714e-5 * scale * 3.5;

        this.planets = [];
        this.orbits = [];
        this.currentPosition = 0;

        this.sun = new Planet(
            document,
            scene,
            new BasicOrbit(scene, 0, 0, 0, 0, 0x000000),
            "Sun",
            3.5 * 3.5 * 1.4 * (4 * Math.PI * sunRadius * sunRadius / 3),
            sunRadius,
            "resources/textures/sun_texture.jpg",
            null,
            "The Sun is the star at the center of the Solar System. It's a nearly perfect sphere of hot plasma."
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 3.87032, 3.78731, 1.59091, 0, 0x9370db, 7 * Math.PI / 180),
                "Mercury",
                5.4 * (4 * Math.PI * mercuryRadius * mercuryRadius / 3),
                mercuryRadius,
                "resources/textures/mercury_texture.jpg",
                0.0008,
                "Mercury is the smallest planet in the Solar System and closest to the Sun. It has a very thin atmosphere."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 7.23262, 7.23244, 0.09358, 0, 0xcd853f, 3.4 * Math.PI / 180),
                "Venus",
                5.2 * (4 * Math.PI * venusRadius * venusRadius / 3),
                venusRadius,
                "resources/textures/venus_texture.jpg",
                0.00065,
                "Venus is similar in size and structure to Earth, but it has a thick, toxic atmosphere and extreme temperatures."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 10, 9.9985, 0.33422, 0, 0x00ced1, 0 * Math.PI / 180),
                "Earth",
                5.5 * (4 * Math.PI * earthRadius * earthRadius / 3),
                earthRadius,
                "resources/textures/earth_texture.jpg",
                0.0006,
                "Earth is the only planet known to support life, with vast oceans and diverse ecosystems."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 15.2406, 15.17315, 2.8475, 0, 0xff6247, 1.8 * Math.PI / 180),
                "Mars",
                3.9 * (4 * Math.PI * marsRadius * marsRadius / 3),
                marsRadius,
                "resources/textures/mars_texture.jpg",
                0.0005,
                "Mars, the Red Planet, has the tallest volcano in the Solar System and may have had liquid water in the past."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 52.0387, 51.97625, 5.0668, 0, 0xffa07a, 1.3 * Math.PI / 180),
                "Jupiter",
                1.3 * (4 * Math.PI * 3.5 * 3.5 * jupiterRadius * jupiterRadius / 3),
                jupiterRadius,
                "resources/textures/jupiter_texture.jpg",
                0.00025,
                "Jupiter is the largest planet in the Solar System, known for its Great Red Spot, a giant storm."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 95.72526, 95.5957, 9.9532, 0, 0xffdead, 2.5 * Math.PI / 180),
                "Saturn",
                0.7 * (4 * Math.PI * 3.5 * 3.5 * saturnRadius * saturnRadius / 3),
                saturnRadius,
                "resources/textures/saturn_texture.jpg",
                0.0002,
                "Saturn is famous for its stunning ring system, composed of ice and rock particles."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 191.6477, 191.4359, 17.9612, 0, 0x87cefa, 0.8 * Math.PI / 180),
                "Uranus",
                1.3 * (4 * Math.PI * 3.5 * 3.5 * uranusRadius * uranusRadius / 12),
                uranusRadius,
                "resources/textures/uranus_texture.jpg",
                0.00015,
                "Uranus is unique due to its tilted axis, causing extreme seasonal changes."
            )
        );

        this.planets.push(
            new Planet(
                document, 
                scene, 
                new BasicOrbit(scene, 301.8048, 301.78972, 5.8689, 0, 0x1e90ff, 1.8 * Math.PI / 180),
                "Neptune",
                1.6 * (4 * Math.PI * 3.5 * 3.5 * neptuneRadius * neptuneRadius / 12),
                neptuneRadius,
                "resources/textures/neptune_texture.jpg",
                0.0001,
                "Neptune is the farthest planet from the Sun and has the strongest winds in the Solar System."
            )
        );

        // Similarly, you can add descriptions for dwarf planets...
        this.planets.push(
            new Planet(
                document,
                scene,
                new BasicOrbit(scene, 27.658, 27.5737, 2.1573, 0, 0xa9a9a9, 10.587 * Math.PI / 180),
                "Ceres",
                1,
                ceresRadius,
                "resources/textures/ceres_texture.jpg",
                0.00028,
                "Ceres is the largest object in the asteroid belt and classified as a dwarf planet."
            )
        );

        // Add other dwarf planets with their descriptions...
    }

    getPlanets() {
        return this.planets;
    }

    move(time) {
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].movePlanet(time);
        }
    }
}
