//CREATE SYSTEMS
function loadSystems() {
    
    particle.createSystem("paddlehit", {
        lifeTime: 5,
        spawnBehavior: function () {
            [...Array(3)].forEach(() => this.spawnParticle());
        },
        setup: function () {
            this.pos = this.dynamicparameters.pos;
            this.velmultiplier = this.dynamicparameters.velmultiplier;
            //Shoehorn in extra data into position object
            this.pos = {x: this.pos.x, y: this.pos.y, vm: this.velmultiplier};
        },
        particleOptions: {
            lifeTime: 40,
            setup: function () {
                this.color = "rgba(255, 255, 255, 0.5)";
                this.vel = {x: 0, y: 0};
                this.speed = 50 * this.pos.vm;
                this.size = random(3, 10);
                this.sizedecay = 0.17;
                this.friction = 0.80;
            
                this.speed = tconstrain(this.speed, 0, 30);
                
                this.vel.x = random(-this.speed, this.speed);
                this.vel.y = random(-this.speed, this.speed);
            },
            movement: function () {
                this.vel.x *= this.friction;
                this.vel.y *= this.friction;
                this.pos.x += this.vel.x;
                this.pos.y += this.vel.y;
                this.size -= this.sizedecay;
            },
            draw: function () {
                push();
                noStroke();
                
                let transparency = map(this.lifeTime, 0, 40, 0, 1);
                this.color = "rgba(255, 255, 255, " + transparency + ")";
                
                fill(this.color);
                rect(this.pos.x, this.pos.y, this.size, this.size);
                pop();
            }
        }
    });

    particle.createSystem("score", {
        lifeTime: 4,
        spawnBehavior: function () {
            [...Array(7)].forEach(() => this.spawnParticle());
        },
        setup: function () {
            this.pos = this.dynamicparameters.pos;
        },
        particleOptions: {
            lifeTime: 70,
            setup: function () {
                this.color = "rgba(255, 255, 255, 0.5)";
                this.vel = {x: 0, y: 0};
                this.speed = 30;
                this.size = random(3, 13);
                this.sizedecay = 0.10;
                this.friction = 0.85;
                
                this.vel.x = random(-this.speed, this.speed);
                this.vel.y = random(-this.speed, this.speed);
            },
            movement: function () {
                this.vel.x *= this.friction;
                this.vel.y *= this.friction;
                this.pos.x += this.vel.x;
                this.pos.y += this.vel.y;
                this.size -= this.sizedecay;
            },
            draw: function () {
                push();
                noStroke();
                
                let transparency = map(this.lifeTime, 0, 40, 0, 1);
                this.color = "rgba(255, 255, 255, " + transparency + ")";
                
                fill(this.color);
                rect(this.pos.x, this.pos.y, this.size, this.size);
                pop();
            }
        }
    });

    particle.createSystem("balltrail", {
          lifeTime: 400,
          spawnBehavior: function () {
              [...Array(1)].forEach(() => this.spawnParticle());
          },
          movement: function () {
              let ballpos = game.getBallPos();
              this.pos.x = ballpos.x;
              this.pos.y = ballpos.y;

              this.lifeTime = 400;

              if (game.gamewon) this.lifeTime = 0;
          },
          particleOptions: {
              lifeTime: 40,
              setup: function () {
                  let ballvel = game.getBallVel();
                  let volley = game.getVolley();
                  let mod = (Math.abs(ballvel.x * ballvel.y) * volley + 1) / 10;

                  this.color = "rgba(255, 255, 255, 0.5)";
                  this.vel = {x: 0, y: 0};
                  this.speed = tconstrain(10 * mod, 0, 10);
                  this.size = random(3, tconstrain(100 * mod, 0, 15));
                  this.sizedecay = 0.17;
                  this.friction = 0.80;
                  
                  this.vel.x = random(-this.speed, this.speed);
                  this.vel.y = random(-this.speed, this.speed);
              },
              movement: function () {
                  this.vel.x *= this.friction;
                  this.vel.y *= this.friction;
                  this.pos.x += this.vel.x;
                  this.pos.y += this.vel.y;
                  this.size -= this.sizedecay;
              },
              draw: function () {
                  push();
                  noStroke();
                  
                  let transparency = map(this.lifeTime, 0, 40, 0, 1);
                  this.color = "rgba(255, 255, 255, " + transparency + ")";
                  
                  fill(this.color);
                  ellipse(this.pos.x, this.pos.y, this.size, this.size);
                  pop();
              }
          }
      });

      particle.createSystem("paddletrail", {
        lifeTime: 400,
        spawnBehavior: function () {
            [...Array(1)].forEach(() => this.spawnParticle());
        },
        movement: function () {
            //Run getter functions for paddle position and dimension
            this.pos = this.dynamicparameters.pos();
            this.dim = this.dynamicparameters.dim();
            //Shoehorn dimension data into position object for passdown to particle
            this.pos = {x: this.pos.x, y: this.pos.y, w: this.dim.w, h: this.dim.h};
            this.lifeTime = 400;
        },
        particleOptions: {
            lifeTime: 20,
            setup: function () {
                this.color = "rgba(255, 255, 255, 0.5)";
                this.vel = {x: 0, y: 0};
                this.speed = 3;
                this.size = random(2, 5);
                this.sizedecay = 0.17;
                this.friction = 0.80;

                this.pos = randomInArea(this.pos.x, this.pos.y, this.pos.w, this.pos.h);
                
                this.vel.x = random(-this.speed, this.speed);
                this.vel.y = random(-this.speed, this.speed);
            },
            movement: function () {
                this.vel.x *= this.friction;
                this.vel.y *= this.friction;
                this.pos.x += this.vel.x;
                this.pos.y += this.vel.y;
                this.size -= this.sizedecay;
            },
            draw: function () {
                push();
                noStroke();
                
                let transparency = map(this.lifeTime, 0, 20, 0, 1);
                this.color = "rgba(255, 255, 255, " + transparency + ")";
                
                fill(this.color);
                rect(this.pos.x, this.pos.y, this.size, this.size);
                pop();
            }
        }
    });
}