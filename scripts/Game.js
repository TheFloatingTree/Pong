class Game {
    constructor(param) {
        //System variables
        this.windowSize     = param.windowSize;
        this.halfWindowSize = { w: this.windowSize.w * 0.5, h: this.windowSize.h * 0.5 };
        this.gameObj        = [];
        this.input          = { UP_ARROW: false, DOWN_ARROW: false, W: false, S: false, K: false, R: false, I: false, P: false };
        //Game variables
        this.volley         = 0;
        this.score          = {playerOne: 0, playerTwo: 0};
        this.time           = 0;
        //Flags
        this.paused = false;
        this.gamewon = false;
        //Editable
        this.timeconst      = 200;
        this.winningScore   = 7;
    }

    init() {
        //Assign time to timeconst
        this.time = this.timeconst;
        //Assign variables to paddle and ball objects
        this.paddleOne  = new Paddle({ pos: { x: 50, y: this.halfWindowSize.h }, ai: false, player: 1 })
        this.paddleTwo  = new Paddle({ pos: { x: this.windowSize.w - 50, y: this.halfWindowSize.h }, ai: false, player: 2 })
        this.ball       = new Ball();
        //Push paddles and ball to update array
        this.gameObj.push(this.ball);
        this.gameObj.push(this.paddleOne);
        this.gameObj.push(this.paddleTwo);

        this.startTimer();
        
        //Setup Particles
        loadSystems();
        particle.spawnSystem("balltrail");
        particle.spawnSystem("paddletrail", {pos: function () {return game.paddleOne.pos}, dim: function () {return game.paddleOne.dim}});
        particle.spawnSystem("paddletrail", {pos: function () {return game.paddleTwo.pos}, dim: function () {return game.paddleTwo.dim}});
    }
    
    update() {
        this.handleEvents();
        this.toggleAI();
        this.toggleReset();
        if (!this.paused) {
            this.checkScore();
            this.checkTimer();
            for (let i = this.gameObj.length - 1; i >= 0; i--) {
                this.gameObj[i].update();
            }
        } 
    }

    pause() {
        this.paused = true;
        gui.notificationText = "paused";
        this.stopTimer();
    }

    play() {
        this.paused = false;
        gui.notificationText = "pong";
        this.startTimer();
    }

    checkTimer() {
        if (this.time <= 0) {
            this.checkScoreAtTimerEnd();
            this.stopTimer();
        }
    }

    startTimer() {
        this.timer = setInterval(function () {
            game.time--;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    checkScore() {
        if (this.score.playerOne >= this.winningScore) {
            this.paused = true;
            this.gamewon = true;
            gui.notificationText = "left player wins";
            this.stopTimer();
        }
        if (this.score.playerTwo >= this.winningScore) {
            this.paused = true;
            this.gamewon = true;
            gui.notificationText = "right player wins";
            this.stopTimer();
        }
    }

    checkScoreAtTimerEnd() {
        if (this.score.playerOne > this.score.playerTwo) {
            this.paused = true;
            this.gamewon = true;
            gui.notificationText = "left player wins";
        }
        if (this.score.playerOne < this.score.playerTwo) {
            this.paused = true;
            this.gamewon = true;
            gui.notificationText = "right player wins";
        }
        if (this.score.playerOne == this.score.playerTwo) {
            this.paused = true;
            this.gamewon = true;
            gui.notificationText = "tied";
        }
    }

    reset() {
        removeFromArray(this.ball, this.gameObj);

        this.ball = new Ball(); //Easily accessible ball object
        this.gameObj.push(this.ball);

        this.volley = 0;
    }

    fullReset() {
        this.gameObj = [];

        this.paddleOne  = new Paddle({ pos: { x: 50, y: this.halfWindowSize.h }, ai: false, player: 1 })
        this.paddleTwo  = new Paddle({ pos: { x: this.windowSize.w - 50, y: this.halfWindowSize.h }, ai: false, player: 2 })
        this.ball       = new Ball();
        //Push paddles and ball to update array
        this.gameObj.push(this.ball);
        this.gameObj.push(this.paddleOne);
        this.gameObj.push(this.paddleTwo);

        this.stopTimer();

        this.volley = 0;
        this.time = this.timeconst;
        this.score = {playerOne: 0, playerTwo: 0};

        if (!this.paused) this.startTimer();
        if (this.gamewon) {
            this.play();
            particle.reset();
            particle.spawnSystem("balltrail");
            particle.spawnSystem("paddletrail", {pos: function () {return game.paddleOne.pos}, dim: function () {return game.paddleOne.dim}});
            particle.spawnSystem("paddletrail", {pos: function () {return game.paddleTwo.pos}, dim: function () {return game.paddleTwo.dim}});
        }

        this.gamewon = false;
    }

    //Player Events

    toggleAI() {
        if (this.input.K) {
            this.paddleOne.ai = true;
        } else {
            this.paddleOne.ai = false;
        }
    }

    toggleReset() {
        if (this.input.R) {
            this.fullReset();
        }
    }

    togglePause() {
        if (this.input.P) {
            this.pause();
        } else if (!this.input.P) {
            this.play();
        }
    }

    //Helper functions

    incrementVolley() {
        this.volley++;
    }

    incrementPlayerOneScore() {
        this.paddleOne.score++;
        this.score.playerOne++;
    }

    incrementPlayerTwoScore() {
        this.paddleTwo.score++;
        this.score.playerTwo++;
    }

    //Getter functions

    getInputs(player) {
        let playerOne = {up: this.input.W, down: this.input.S};
        let playerTwo = {up: this.input.UP_ARROW, down: this.input.DOWN_ARROW};

        if (player == 1) {
            return playerOne;
        } else {
            return playerTwo;
        }
    }

    getBallPos() {
        return this.ball.pos;
    }

    getBallVel() {
        return this.ball.vel;
    }

    getBallSize() {
        return this.ball.size;
    }

    getVolley() {
        return this.volley;
    }

    resetPaddleFlags() {
        this.paddleOne.ballCollisionCheckFlag = true;
        this.paddleTwo.ballCollisionCheckFlag = true;
    }

    //Input

    handleEvents() {
        if (keyIsDown(UP_ARROW)) {
            this.input.DOWN_ARROW = false;
            this.input.UP_ARROW = true;
        }
        else if (keyIsDown(DOWN_ARROW)) {
            this.input.DOWN_ARROW = true;
            this.input.UP_ARROW = false;
        }
        else {
            this.input.DOWN_ARROW = false;
            this.input.UP_ARROW = false;
        }
        if (keyIsDown(87)) {
            this.input.S = false;
            this.input.W = true;
        }
        else if (keyIsDown(83)) {
            this.input.S = true;
            this.input.W = false;
        } else {
            this.input.S = false;
            this.input.W = false;
        }

        if (keyIsDown(82)) {
            this.input.R = true;
        } else {
            this.input.R = false;
        }

        if (keyIsDown(73)) {
            this.input.I = true;
        } else {
            this.input.I = false;
        }
    }
}