class Peg {

    constructor(holeShapes, number) {

        this.x = random(worldWidth);
        this.y = random(worldHeight);
        this.shapes = holeShapes;
        this.number = number;

        this.scale = 0;
        this.maxScale = 0.5;

        this.solved = false;
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

        if (this.solved) return;

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
        fill(palette.black);
        if (player.pegNumber == this.number) fill(palette.dark);
        this.displayShape(this.shapes.first);
        this.displayShape(this.shapes.second);
        this.displayShape(this.shapes.third);

        scale(this.scale);
        this.displayEye(x, y);
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

    displayEye(x, y) {

        let playerX = player.x;
        let playerY = player.y;

        if (x > 0) {
            playerX -= worldWidth;
        } else if (x < 0) {
            playerX += worldWidth;
        }

        if (y > 0) {
            playerY -= worldHeight;
        } else if (y < 0) {
            playerY += worldHeight;
        }
        let vec = createVector(playerX-this.x, playerY-this.y).normalize().mult(8);

        if (player.pegNumber == this.number) vec = createVector(player.velocityX, player.velocityY).normalize().mult(8);

        fill(palette.white);
        ellipse(0, 0, 60);

        translate(vec.x, vec.y);
        fill(palette.black);
        ellipse(0, 0, 45);
    }
}