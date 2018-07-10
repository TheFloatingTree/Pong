class Interface {
    constructor() {
        this.init();
    }

    init() {
        this.notificationText = "pong";
        this.pauseplayText = "Pause (P)";
        this.infoTextOne = "Controls: WASD - Left Player || Arrow Keys - Right Player";
        this.infoTextTwo = game.winningScore.toString() + " points to win, or until timer reaches 0";

        this.one = montserrat.textBounds(this.notificationText, 0, 0, 20);
        this.two = montserrat.textBounds("AI (K)", 0, 0, 20);
        this.three = montserrat.textBounds("thefloatingtree version " + version, 0, 0, 20);
        this.four = montserrat.textBounds("Reset (R)", 0, 0, 20);
        this.five = montserrat.textBounds("Info (I)", 0, 0, 20);
        this.six = montserrat.textBounds("120", 0, 0, 40);
        this.seven = montserrat.textBounds("Pause (P)", 0, 0, 20);
        this.eight = montserrat.textBounds(this.infoTextOne, 0, 0, 20);
        this.nine = montserrat.textBounds(this.infoTextTwo, 0, 0, 20);
    }

    update() {
        this.draw();
    }

    //This is a hardcoded mess right now. Please excuse it
    draw() {
        push();
        //Settings
        noStroke();
        textAlign(CENTER);
        textFont(montserrat);
        //Thing1
        textSize(60);
        fill("rgba(255,255,255,0.2)");
        text(this.notificationText, game.windowSize.w/2, game.windowSize.h/2);

        if (game.gamewon) {
            textSize(20);
            fill("rgba(255,255,255,0.2)");
            text("Play Again (R)", game.windowSize.w/2, game.windowSize.h/2 + 40);
        }

        if (game.gamewon) return;

        //Thing2
        if (game.input.K) {
            textSize(20);
            fill("rgba(255,255,255,0.7)");
            text("AI (K)", game.windowSize.w - this.two.w / 2 - 20, game.windowSize.h - 10);
        } else {
            textSize(20);
            fill("rgba(255,255,255,0.2)");
            text("AI (K)", game.windowSize.w - this.two.w / 2 - 20, game.windowSize.h - 10);
        }
        
        //Thing 4
        if (game.input.R) {
            textSize(20);
            fill("rgba(255,255,255,0.7)");
            text("Reset (R)", game.windowSize.w - this.four.w / 2 - 40 - this.two.w, game.windowSize.h - 10);
        } else {
            textSize(20);
            fill("rgba(255,255,255,0.2)");
            text("Reset (R)", game.windowSize.w - this.four.w / 2 - 40 - this.two.w, game.windowSize.h - 10);
        }
        

        //Thing 5
        if (game.input.I) {
            textSize(20);
            fill("rgba(255,255,255,0.7)");
            text("Info (I)", game.windowSize.w - this.five.w / 2 - 80 - this.two.w -this.four.w - this.seven.w, game.windowSize.h - 10);
            fill("rgba(255,255,255,0.2)");
            text(this.infoTextOne, game.windowSize.w - this.eight.w / 2 - 20, game.windowSize.h - 40 - this.five.h - this.nine.h);
            text(this.infoTextTwo, game.windowSize.w - this.nine.w / 2 - 20, game.windowSize.h - 30 - this.five.h);
        } else {
            textSize(20);
            fill("rgba(255,255,255,0.2)");
            text("Info (I)", game.windowSize.w - this.five.w / 2 - 80 - this.two.w -this.four.w - this.seven.w, game.windowSize.h - 10);
        }
        //Thing 7
        if (game.input.P) {
            textSize(20);
            fill("rgba(255,255,255,0.7)");
            text(this.pauseplayText, game.windowSize.w - this.seven.w / 2 - 60 - this.two.w -this.four.w, game.windowSize.h - 10);
        } else {
            textSize(20);
            fill("rgba(255,255,255,0.2)");
            text(this.pauseplayText, game.windowSize.w - this.seven.w / 2 - 60 - this.two.w -this.four.w, game.windowSize.h - 10);
        }

        //Thing 6
        textSize(40);
        fill("rgba(255,255,255,1)");
        text(game.time, game.windowSize.w/2, this.six.h + 10);

        if (game.paused) {
            textSize(40);
            fill("rgba(255,255,255,0.2)");
            text(game.score.playerOne.toString() + " - " + game.score.playerTwo.toString(), game.windowSize.w/2, game.windowSize.h/2 + 50);
        }
        
        //Thing 3
        textSize(20);
        fill("rgba(255,255,255,0.05)");
        text("thefloatingtree version " + version, this.three.w / 2 + 20, game.windowSize.h - 10);
        pop();
    }
}