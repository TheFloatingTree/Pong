class ParticleManager {
    constructor() {
        this.systems = [];
        this.particleSystems = [];
        this.particleCount = 0;
        this.logParticleCountFlag = false;
    }

    createSystem(name, obj) {
        obj.name = name;
        this.systems.push(obj);
    }
    
    printSystems() {
      for(let i = 0; i < this.systems.length; i++) {
        console.log(i + ": " + this.systems[i].name);
      }
    }

    getSystem(name) {
        let output;
        for (let i = 0; i < this.systems.length; i++) {
            if (this.systems[i].name == name) {
                output = clone(this.systems[i]);
            }
        }
        return output;
    }

    spawnSystem(name, dynamicparameters) {
        this.particleSystems.push(new ParticleSystem(this.getSystem(name), dynamicparameters));
    }

    toggleParticleCountLog() {
        this.logParticleCountFlag ? this.logParticleCountFlag = false : this.logParticleCountFlag = true;
    }

    reset() {
        this.particleSystems = [];
    }

    update() {
        this.particleCount = 0;
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            this.particleSystems[i].update();
            this.particleCount += this.particleSystems[i].particles.length;

            //Check for death
            if (this.particleSystems[i].lifeTime <= 0) {
                this.particleSystems[i].emitterActive = false;
                if (this.particleSystems[i].particles.length <= 0) {
                    this.particleSystems.splice(i, 1);
                }
            }
        }
        if (this.logParticleCountFlag) console.log(this.particleCount)
    }
}

class ParticleSystem {
    constructor({
        //DEFAULT VALUES
        pos = {
            x: 0,
            y: 0
        },
        lifeTime = 500,
        emitterActive = true,
        setup = function () {
            //Empty
        },
        movement = function () {
            //Empty
        },
        spawnBehavior = function () {
            if (frameCount % 5 === 0) {
                this.spawnParticle();
            }
        },
        deathBehavior = function (particle) {
            return particle.lifeTime <= 0 ? true : false;
        },
        particleOptions = {
            //Empty
        }
    } = {}, dynamicparameters) {

        //PARTICLE ARRAY
        this.particles = [];

        //SET VALUES
        this.pos = pos;
        this.lifeTime = lifeTime;
        this.emitterActive = emitterActive;
        this.movement = movement;
        this.spawnBehavior = spawnBehavior;
        this.deathBehavior = deathBehavior;
        this.particleOptions = particleOptions;
        this.dynamicparameters = dynamicparameters;
        this.setup = setup;

        this.setup();
    }

    spawnParticle() {
        //Set new particle position to system's position
        this.particleOptions.pos = this.pos;
        //Clone particle from template
        let optionsClone = clone(this.particleOptions);
        //Spawn the particle
        this.particles.push(new Particle(
            optionsClone
        ));
    }

    update() {
        //MANAGE PARTICLE SYSTEM
        this.movement();
        if (this.emitterActive) {
            this.spawnBehavior()
        }
        this.lifeTime--;

        //MANAGE PARTICLES
        for (let i = this.particles.length - 1; i >= 0; i--) {
            //Draw and update particles
            this.particles[i].update();
            this.particles[i].draw();

            //Death behavior check
            if (this.deathBehavior(this.particles[i])) {
                this.particles.splice(i, 1);
            }
        }
    }
}

class Particle {
    constructor({
        //DEFAULT VALUES
        pos = {
            x: 0,
            y: 0
        },
        size = 10,
        lifeTime = 500,
        setup = function () {
            //Empty
        },
        movement = function () {
            this.pos.y++;
        },
        draw = function () {
            push();
            stroke("black");
            fill("white");
            rect(this.pos.x, this.pos.y, this.size, this.size);
            pop();
        }
    } = {}) {

        //SET VALUES
        this.pos = pos;
        this.size = size;
        this.lifeTime = lifeTime;
        this.movement = movement;
        this.draw = draw;
        this.setup = setup;

        this.setup();
    }

    draw() {
        this.draw();
    }

    update() {
        this.lifeTime--;
        this.movement();
    }
}