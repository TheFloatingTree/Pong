p5.disableFriendlyErrors = false;

let game;
let particle;
let gui;
let deltatimer;

let montserrat;

let version = "2.0";

function preload() {
    montserrat = loadFont('assets/Montserrat.ttf');
}

function setup() {
    game = new Game({windowSize: {w: windowWidth, h: windowHeight}});
    particle = new ParticleManager();
    gui = new Interface();
    deltatimer = new DeltaTimer();

    createCanvas(game.windowSize.w,game.windowSize.h);
    rectMode(CENTER);

    game.init();
}

function draw() {
    background(30);
    gui.update();
    game.update();
    particle.update();
    deltatimer.step();
}

function keyPressed() {
    if (game.gamewon) return;

    if (keyCode === 75) {
        game.input.K = !game.input.K;
    }

    if (keyCode === 80) {
        game.input.P = !game.input.P;
        game.togglePause();
    }
}