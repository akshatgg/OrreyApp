import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';


export class SolarSystem {

    static getInstance() {
        return this.instance;
    }

    constructor(document, scene) {
        const sunscale = 400;
        const scale = 4000;
        const sunRadius =  4.6524e-3 * sunscale; //TODO: Radio multiplicado por 100

        SolarSystem.instance = this;
        // const mercuryRadius = 0.0035*sunRadius*1;
        // const venusRadius = 0.0087*sunRadius*1;
        // const earthRadius = 0.0092*sunRadius*1;
        // const marsRadius = 0.0049*sunRadius*1;
        // const jupiterRadius = 0.1028*sunRadius*1;
        // const saturnRadius = 0.0866*sunRadius*1;
        // const uranusRadius = 0.0367*sunRadius*1;
        // const neptuneRadius = 0.0356*sunRadius*1;

        const mercuryRadius = 1.6310e-5 * scale*3.5;
        const venusRadius = 4.0454e-5 * scale*3.5;
        const earthRadius = 4.2633e-5 * scale*3.5;
        const marsRadius = 2.2714e-5 * scale*3.5;
        const jupiterRadius = 4.7787e-4 * scale;
        const saturnRadius = 4.0287e-4 * scale;
        const uranusRadius = 1.7085e-4 * scale*2;
        const neptuneRadius = 1.655e-4 * scale*2;

        //dwarf planets
        const ceresRadius = 1.6310e-5 * scale*3.5;
        const plutoRadius = 4.0454e-5 * scale*3.5;
        const makemakeRadius = 4.2633e-5 * scale*3.5;
        const haumeaRadius = 2.2714e-5 * scale*3.5;
        const erisRadius = 2.2714e-5 * scale*3.5;

        this.planets = [];
        this.orbits = [];

        this.currentPosition = 0;

        this.sun = new Planet(document, scene, new BasicOrbit(scene, 0, 0, 0, 0, 0x000000),
            "Sun", 3.5*3.5*1.4*(4*Math.PI*sunRadius*sunRadius/3), sunRadius, "resources/textures/sun_texture.jpg",0, "The star at the center of our solar system, the Sun is a massive ball of hot, glowing gas.");

        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 3.87032, 3.78731, 1.59091, 0, 0x9370db, 7*Math.PI/180),
                 "Mercury", 5.4*(4*Math.PI*mercuryRadius*mercuryRadius/3), mercuryRadius, "resources/textures/mercury_texture.jpg", 0.0008, "The smallest planet in our solar system, Mercury is a rocky, barren world with extreme temperatures.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 7.23262, 7.23244, 0.09358, 0, 0xcd853f, 3.4*Math.PI/180),
                "Venus", 5.2*(4*Math.PI*venusRadius*venusRadius/3), venusRadius, "resources/textures/venus_texture.jpg", 0.00065, "Shrouded in thick clouds, Venus is a scorching hot planet with a thick atmosphere that traps heat.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 10, 9.9985, 0.33422, 0, 0x00ced1, 0*Math.PI/180),
                "Earth", 5.5*(4*Math.PI*earthRadius*earthRadius/3), earthRadius, "resources/textures/earth_texture.jpg", 0.0006, "Our home planet, Earth is a terrestrial world with a diverse range of environments and life forms.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 15.2406, 15.17315, 2.8475, 0, 0xff6247, 1.8*Math.PI/180),
                "Mars", 3.9*(4*Math.PI*marsRadius*marsRadius/3), marsRadius, "resources/textures/mars_texture.jpg", 0.0005, "A rocky, barren world with a thin atmosphere, Mars is a potential candidate for supporting life.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 52.0387, 51.97625, 5.0668, 0, 0xffa07a, 1.3*Math.PI/180),
                "Jupiter", 1.3*(4*Math.PI*3.5*3.5*jupiterRadius*jupiterRadius/3), jupiterRadius, "resources/textures/jupiter_texture.jpg", 0.00025, "The largest planet in our solar system, Jupiter is a gas giant with massive storms and a strong magnetic field.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 95.72526, 95.5957, 9.9532, 0, 0xffdead, 2.5*Math.PI/180),
                "Saturn", 0.7*(4*Math.PI*3.5*3.5*saturnRadius*saturnRadius/3), saturnRadius, "resources/textures/saturn_texture.jpg", 0.0002, "Another gas giant, Saturn is known for its stunning ring system and diverse moons.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 191.6477, 191.4359, 17.9612, 0, 0x87cefa, 0.8*Math.PI/180),
                "Uranus", 1.3*(4*Math.PI*3.5*3.5*uranusRadius*uranusRadius/12), uranusRadius, "resources/textures/uranus_texture.jpg", 0.00015, "An icy gas giant with a tilted axis, Uranus has a thin atmosphere and a system of rings and moons.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 300.0001, 299.7553, 28.0462, 0, 0x4682b4, 1.8*Math.PI/180),
                "Neptune", 1.2*(4*Math.PI*3.5*3.5*neptuneRadius*neptuneRadius/12), neptuneRadius, "resources/textures/neptune_texture.jpg", 0.0001, "The farthest planet from the Sun, Neptune is a cold, icy world with strong winds and a few small moons.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 27.658, 27.5737, 2.1573, 0, 0xa9a9a9, 10.587*Math.PI/180),
                "Ceres", 1, ceresRadius, "resources/textures/ceres_texture.jpg", 0.00028, "The largest object in the asteroid belt, Ceres is a dwarf planet with a surface covered in craters and a possible subsurface ocean.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 394.821, 382.4027, 98.2433, 0, 0xa9a9a9, 17.15*Math.PI/180),
                "Pluto", 1, plutoRadius, "resources/textures/pluto_texture.jpg", 0.00009, "A dwarf planet in the Kuiper Belt, Pluto has a highly eccentric orbit and a surface composed of nitrogen ice.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 433.4, 425.5888, 81.9126, 0, 0xa9a9a9, 28.19*Math.PI/180),
                "Haumea", 1, haumeaRadius, "resources/textures/haumea_texture.jpg", 0.000085, "An irregularly shaped dwarf planet in the Kuiper Belt, Haumea has a highly eccentric orbit and a surface composed of water ice.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, -457.9, -452.07486, -72.80, 0, 0xa9a9a9, 28.96*Math.PI/180),
                "Makemake", 1, makemakeRadius, "resources/textures/makemake_texture.jpg", 0.000082, "A dwarf planet in the Kuiper Belt, Makemake has a highly inclined orbit and a surface composed of methane and ethane ices.")
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 676.7, 607.086, 298.945, 0, 0xa9a9a9, -44.187*Math.PI/180),
                "Eris", 1, erisRadius, "resources/textures/eris_texture.jpg", 0.00008, "A dwarf planet in the Kuiper Belt, Eris is slightly larger than Pluto and has a highly eccentric orbit.")
        )
    }

    
    getPlanets() {
        return this.planets;
    }
    


	 


    getAndLogPlanetDescriptionByName(name) {
        const planet = this.planets.find(planet => planet.name === name);
        const description = planet ? planet.description : "Planet not found.";
        console.log(description);
        // const desc = document.getElementById('typewriterText');
        // desc.innerHTML = description 

      return description;
    }

    move(time) {
        // let numPoints = this.orbits[0].getPoints().length;
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].movePlanet(time);
        }
    } 
}



typewriterText