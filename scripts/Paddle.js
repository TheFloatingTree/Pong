class Paddle {
    constructor(param) {
        this.pos = param.pos;
        this.vel = {x: 0, y: 0};
        this.player = param.player;
        this.ai = param.ai;
        this.dim = { w: 25, h: 100 };
        this.dimconst = { w: 25, h: 100 };
        this.dimHalf = { w: this.dim.w * 0.5, h: this.dim.h * 0.5 };
        this.speed = 370;
        this.bounciness = 1.5;
        this.ballCollisionCheckFlag = true;
        this.score = 0;
    }

    update() {
        this.ai ? this.aiMove() : this.playerMove();
        this.ballCollisionCheckFlag ? this.checkBallCollision() : this.checkBallCollisionReset();
        this.draw();   
    }

    aiMove() {
        let ballpos = game.ball.pos;
        let ballvel = game.ball.vel;

        if (ballpos.y >= this.pos.y && ballvel.x < 0) {
            this.vel.y += 0.8;
        } 
        else if (ballpos.y < this.pos.y && ballvel.x < 0) {
            this.vel.y += -0.8;
        } else {
            this.vel.y *= 0.79;
        }

        this.vel.y = tconstrain(this.vel.y, -10, 10);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    playerMove() {
        let inputs = game.getInputs(this.player);

        if (this.checkWallCollision(inputs))
            return;
        if (inputs.down)
            this.vel.y = this.speed * deltatimer.deltaTime;
        if (inputs.up)
            this.vel.y = -this.speed * deltatimer.deltaTime;
        if (!inputs.up && !inputs.down)
            this.vel.y *= 0.79;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    checkWallCollision(inputs) {
        if (this.pos.y + this.dimHalf.h > game.windowSize.h && inputs.down)
            return true;
        if (this.pos.y - this.dimHalf.h < 0 && inputs.up)
            return true;
        return false;
    }

    checkBallCollision() {
        let ballpos = game.getBallPos();
        let ballvel = game.getBallVel();
        let ballsize = game.getBallSize();
        //Check if ball is colliding with Paddle
        if (collisionRectangle(this.pos.x, this.pos.y, this.dim.w, this.dim.h, 
            ballpos.x, ballpos.y, ballsize, ballsize)) 
        {
            //Check if ball is beneath paddle && ball is traveling downward
            if (this.pos.y + this.dimHalf.h < ballpos.y && ballvel.y > 0) {
                game.ball.setPosition(game.ball.lastpos.x, game.ball.lastpos.y);
                game.ball.addVelocityX(this.vel.y / this.speed * 1.5);
                game.ball.addVelocityY(this.vel.y / 5);
            }
            //Check if ball is beneath paddle && ball is traveling upward
            else if (this.pos.y + this.dimHalf.h < ballpos.y && ballvel.y < 0) {
                game.ball.setPosition(game.ball.lastpos.x, game.ball.lastpos.y);
                game.ball.flipVelocityY();
                game.ball.addVelocityX(this.vel.y / this.speed * 1.5);
            }
            //Check if ball is atop paddle && ball is traveling downward
            else if (this.pos.y - this.dimHalf.h > ballpos.y && ballvel.y > 0) {
                game.ball.setPosition(game.ball.lastpos.x, game.ball.lastpos.y);
                game.ball.flipVelocityY();
                game.ball.addVelocityX(this.vel.y / this.speed * 1.5);
            }
            //Check if ball is atop paddle && ball is traveling upward
            else if (this.pos.y - this.dimHalf.h > ballpos.y && ballvel.y < 0) {
                game.ball.setPosition(game.ball.lastpos.x, game.ball.lastpos.y);
                game.ball.addVelocityY(this.vel.y / 5);
                game.ball.addVelocityX(this.vel.y / this.speed * 1.5);
            //Else bounce normally
            } else {
                game.ball.setPosition(game.ball.lastpos.x, game.ball.lastpos.y);
                game.ball.flipVelocityX();
                //Check if ball is going upwards
                if (ballvel.y < 0) {
                    game.ball.addVelocityY(-Math.abs(this.vel.y) / this.speed * this.bounciness);
                } else {
                    game.ball.addVelocityY(Math.abs(this.vel.y) / this.speed * this.bounciness);
                }
                //Check if ball is going left
                if (ballvel.x < 0) {
                    game.ball.addVelocityX(-Math.abs(this.vel.y) / this.speed * this.bounciness);
                } else {
                    game.ball.addVelocityX(Math.abs(this.vel.y) / this.speed * this.bounciness);
                }

                game.ball.addVelocityY(this.vel.y / this.speed * 1.5);
                particle.spawnSystem("paddlehit", {pos: {x: ballpos.x, y: ballpos.y}, velmultiplier: this.particleVelocityHelper()});

                game.incrementVolley();
            }
            this.ballCollisionCheckFlag = false;
        }
    }

    particleVelocityHelper() {
        let ballvel = game.getBallVel();
        let ballveltotal = Math.abs(ballvel.x * ballvel.y);
        // console.log((Math.abs(this.vel.y) * game.getVolley() * ballveltotal + 1) / 100);
        return (Math.abs(this.vel.y) * game.getVolley() * ballveltotal + 1) / 100;
    }

    checkBallCollisionReset() {
        let ballpos = game.getBallPos();
        if (this.player == 1) {
            if (ballpos.x >= game.halfWindowSize.w) {
                this.ballCollisionCheckFlag = true;
            }
        } else {
            if (ballpos.x <= game.halfWindowSize.w) {
                this.ballCollisionCheckFlag = true;
            }
        }
    }

    draw() {
        push();
        noStroke();
        fill("white");
        
        //Fancy squishing on paddles
        this.dim.h = (this.dimconst.h * Math.abs(this.vel.y) / 100) + this.dimconst.h;
        this.dim.w = (this.dimconst.w * -Math.abs(this.vel.y) / 120) + this.dimconst.w;

        rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        pop();

        push();
        //Set up Text
        textAlign(CENTER);
        textFont(montserrat);
        textSize((25 * -Math.abs(this.vel.y) / 120) + 25);
        fill(45);
        //Text
        let textData = montserrat.textBounds(this.score.toString(), 0, 0, 25);
        text(this.score, this.pos.x, this.pos.y + textData.h / 2);

        pop();
    }
}