class Hole {

    constructor(holeShapes, number) {

        this.x = random(worldWidth);
        this.y = random(worldHeight);
        this.shapes = holeShapes;
        this.number = number;

        this.scale = 0;
        this.maxScale = 0.7;
    }

    update() {

        if (this.number == player.pegNumber && this.fit(player)) {
            player.pegNumber = -1;
            pegs[this.number].solved = true;
            pegs[this.number].x = this.x;
            pegs[this.number].y = this.y;
            addShape();
        }

        if (this.scale < this.maxScale) {
            this.scale += 0.02;
        }
    }

    fit(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 20) {
            return true;
        }
    }

    display() {

        this.displayPeg(0, 0);
        this.displayPeg(-worldWidth, -worldHeight);
        this.displayPeg(-worldWidth, 0);
        this.displayPeg(-worldWidth, worldHeight);
        this.displayPeg(0, -worldHeight);
        this.displayPeg(0, 0);
        this.displayPeg(0, worldHeight);
        this.displayPeg(worldWidth, -worldHeight);
        this.displayPeg(worldWidth, 0);
        this.displayPeg(worldWidth, worldHeight);
    }


    displayPeg(x, y) {

        push();
        translate(x, y);

        push();
        translate(width/2, height/2);
        translate(this.x, this.y);
        fill(palette.white);
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