class Hole {

    constructor(holeShapes, number) {

        this.x = random(worldWidth);
        this.y = random(worldHeight);

        while (dist(player.x, player.y, this.x, this.y) < 200) {

            this.x = random(worldWidth);
            this.y = random(worldHeight);
        }

        this.shapes = holeShapes;
        this.number = number;

        this.scale = 0;
        this.maxScale = 0.6;

        this.randoms = [];
        this.randomInt = 0;
        this.getRandoms();

        this.solved = false;
    }

    update() {

        if (this.solved) return;

        if (this.number == player.pegNumber && this.fit(player)) {
            player.pegNumber = -1;
            pegs[this.number].solved = true;
            this.solved = true;
            addShape();
            player.newWobble();
        }

        if (this.scale < this.maxScale) {
            this.scale += 0.02;
        }
    }

    fit(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 50) {
            return true;
        }
    }

    collide(collider) {

        if (!pegs[this.number].solved) return;

        if (dist(collider.x, collider.y, this.x, this.y) < 70) {
            return true;
        }
    }

    getRandoms() {

        for (let i = 0; i < 3*10; i++) {
            this.randoms.push(random(50, 255));
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

        let middleX = player.x + player.cameraX;
        let middleY = player.y + player.cameraY;

        if (this.x + x > middleX + width/2 + 200) return;
        if (this.x + x < middleX - width/2 - 200) return;
        if (this.y + y > middleY + height/2 + 200) return;
        if (this.y + y < middleY - height/2 - 200) return;

        push();
        translate(x, y);

        push();
        translate(width/2, height/2);
        translate(this.x, this.y);

        this.displayShape(this.shapes.first, 0);
        this.displayShape(this.shapes.second, 0);
        this.displayShape(this.shapes.third, 0);

        if (this.solved) {

            for (let i = 1; i < 5; i++) {
                this.displayShape(this.shapes.first, i);
                this.displayShape(this.shapes.second, i);
                this.displayShape(this.shapes.third, i);
                this.randomInt += 3;
            }
            this.randomInt = 0;
        }

        pop();

        pop();
    }

    displayShape(shape, tier) {

        push();
        scale(this.scale);
        translate(shape[0], shape[1]);
        rotate(shape[5]);

        this.displayRings(shape, tier);

        pop();
    }

    displayRings(shape, tier) {

        if (this.solved) {

            let s = 1 - tier*0.2;

            scale(s);
            fill(this.randoms[this.randomInt], this.randoms[this.randomInt+1], this.randoms[this.randomInt+2]);

            if (tier == 0) fill(palette.white);

        } else {
            fill(palette.black);
        }
        rect(0, 0, shape[2], shape[3], shape[4]);
    }
}