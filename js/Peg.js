class Peg {

    constructor(holeShapes, number) {

        this.x = random(worldWidth);
        this.y = random(worldHeight);
        this.shapes = holeShapes;
        this.number = number;

        this.scale = 0;
        this.maxScale = 0.7;
    }

    update() {

        if (!this.solved && !player.switchedPegRecently && this.collide(player) && player.pegNumber != this.number) {
            player.pegNumber = this.number;
            player.switchedPegRecently = true;
            player.pegSwitchFrameCount = 0;
        }

        if (this.scale < this.maxScale) {
            this.scale += 0.02;
        }
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 100) {
            return true;
        }
    }

    display() {

        this.displayHole(0, 0);
        this.displayHole(-worldWidth, -worldHeight);
        this.displayHole(-worldWidth, 0);
        this.displayHole(-worldWidth, worldHeight);
        this.displayHole(0, -worldHeight);
        this.displayHole(0, 0);
        this.displayHole(0, worldHeight);
        this.displayHole(worldWidth, -worldHeight);
        this.displayHole(worldWidth, 0);
        this.displayHole(worldWidth, worldHeight);
    }

    displayHole(x, y) {

        push();
        translate(x, y);

        push();
        translate(width/2, height/2);
        translate(this.x, this.y);
        fill(palette.black);
        if (this.solved) fill(palette.mid);
        if (player.pegNumber == this.number) fill(palette.dark);
        this.displayShape(this.shapes.first);
        this.displayShape(this.shapes.second);
        this.displayShape(this.shapes.third);
        pop();

        pop();
    }

    displayShape(shape) {

        push();
        scale(this.scale);
        translate(shape[0], shape[1]);
        rotate(shape[5]);
        rect(0, 0, shape[2], shape[3], shape[4]);
        pop();
    }
}