class DeltaTimer {
    constructor() {
        this.deltaTime = 0;
        this.currentTime;
        this.lastTime;

        this.init();
    }

    init() {
        this.currentTime = new Date().getTime();
        this.lastTime = new Date().getTime();
    }

    step() {
        this.currentTime = new Date().getTime();
        this.deltaTime = (this.currentTime - this.lastTime) / 1000;
        this.lastTime = this.currentTime;
    }
}