class Ball {
    constructor() {
        this.pos = { x: canvas.x, y: canvas.y };
        this.lastpos = {x: 0, y: 0};
        this.size = 20;
        this.speed = 400;
        this.vel = {x: 0, y: 0};
        this.checkWallCollisionFlag = true;
        this.invisible = false;

        this.color = "white";

        this.init();
    }

    init() {
        this.getRandomVelocity();
    }

    update() {
        this.move();
        this.checkWallCollisionFlag ? this.checkWallCollision() : this.checkWallCollisionReset();
        this.draw();
        this.lastpos = this.pos;
    }

    move() {
        this.pos.x += this.vel.x * this.speed * deltatimer.deltaTime;
        this.pos.y += this.vel.y * this.speed * deltatimer.deltaTime;
    }

    getRandomVelocity() {
        let bool = randomBool() ? 0 : canvas.w;
        this.vel = getVector( this.pos.x, this.pos.y, bool, random(0, canvas.h) );
    }

    checkWallCollision() {
        //Right and Left walls
        if (this.pos.x - this.size / 2 < 0) {
            particle.spawnSystem("paddlehit", {pos: {x: this.pos.x, y: this.pos.y}});
            game.incrementPlayerTwoScore();
            game.reset();
            particle.spawnSystem("score", {pos: {x: this.pos.x, y: this.pos.y}});
            game.resetPaddleFlags();
            return;
        }
        if (this.pos.x + this.size / 2 > game.windowSize.w) {
            particle.spawnSystem("paddlehit", {pos: {x: this.pos.x, y: this.pos.y}});
            game.incrementPlayerOneScore();
            particle.spawnSystem("score", {pos: {x: this.pos.x, y: this.pos.y}});
            game.reset();
            game.resetPaddleFlags();
            return;
        }
        //Top and Bottom walls
        if (this.pos.y + this.size / 2 > game.windowSize.h || this.pos.y - this.size / 2 < 0) {
            this.setPosition(this.lastpos.x, this.lastpos.y);
            particle.spawnSystem("paddlehit", {pos: {x: this.pos.x, y: this.pos.y}});
            this.flipVelocityY();
            game.resetPaddleFlags();
            this.checkWallCollisionFlag = false;
        }
    }

    // resetHelper() {
    //     if (!this.invisible) {
    //         game.reset();
    //     } else {
    //         game.deleteInviBall();
    //         game.spawnInviBall();
    //     }
    // }

    checkWallCollisionReset() {
        this.checkWallCollisionFlag = true;
    }

    flipVelocityX() {
        this.vel.x = -this.vel.x;
    }

    flipVelocityY() {
        this.vel.y = -this.vel.y
    }

    addVelocityX(amount) {
        this.vel.x += amount;
    }
    
    addVelocityY(amount) {
        this.vel.y += amount;
    }

    setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    draw() {
        push();
        noStroke();
        fill(this.color);

        if (!this.invisible) ellipse(this.pos.x, this.pos.y, this.size, this.size);
        pop();
    }
}