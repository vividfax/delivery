class Peg {

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

        this.solved = false;
        this.dead = false;

        this.blink = false;
        this.blinkDuration = 0;

        this.numberOfEyes = random([1, 2]);
        this.eyeSpacing = random(35, 55);

        this.sighOffset = random(360);
    }

    update() {

        if (this.dead || this.solved) return;

        if (countingTime && !this.solved && !player.switchedPegRecently && this.collide(player) && player.pegNumber != this.number) {
            player.pegNumber = this.number;
            player.switchedPegRecently = true;
            player.pegSwitchFrameCount = 0;
        }

        if (this.scale < this.maxScale) {
            this.scale += 0.02;
        }

        if (this.blink) {
            this.blinkDuration++;
            if (this.blinkDuration > 10) this.blink = false;
        } else if (random() < 0.005) {
            this.blink = true;
            this.blinkDuration = 0;
        }
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 50) {
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

        let middleX = player.x + player.cameraX;
        let middleY = player.y + player.cameraY;

        // if (this.x + x > middleX + width/2 + 200) return;
        // if (this.x + x < middleX - width/2 - 200) return;
        // if (this.y + y > middleY + height/2 + 200) return;
        // if (this.y + y < middleY - height/2 - 200) return;

        push();
        translate(x, y);
        shadowLayer.push();
        shadowLayer.translate(x, y);
        shapeLayer.push();
        shapeLayer.translate(x, y);

        push();
        translate(width/2, height/2);
        translate(this.x, this.y);
        shadowLayer.push();
        shadowLayer.translate(width/2, height/2);
        shadowLayer.translate(this.x, this.y);
        shapeLayer.push();
        shapeLayer.translate(width/2, height/2);
        shapeLayer.translate(this.x, this.y);

        this.displayShape(this.shapes.first, true);
        this.displayShape(this.shapes.second, true);
        this.displayShape(this.shapes.third, true);

        shapeLayer.fill(palette.mid);
        if (this.dead) shapeLayer.fill(palette.dead);
        if (player.pegNumber == this.number) shapeLayer.fill(palette.dark);

        this.displayShape(this.shapes.first);
        this.displayShape(this.shapes.second);
        this.displayShape(this.shapes.third);

        shapeLayer.scale(this.scale);
        shadowLayer.scale(this.scale);

        if (this.numberOfEyes == 1) {
            this.displayEye(x, y, 0);
        } else if (this.numberOfEyes == 2) {
            this.displayEye(x, y, this.eyeSpacing);
            this.displayEye(x, y, -this.eyeSpacing);
        }

        pop();
        shadowLayer.pop();
        shapeLayer.pop();

        pop();
        shadowLayer.pop();
        shapeLayer.pop();
    }

    displayShape(shape, shadow) {

        if (shadow && !this.dead) {

            shadowLayer.push();
            shadowLayer.scale(this.scale);
            shadowLayer.translate(shape[0], shape[1]+30);
            shadowLayer.rotate(shape[5]);
            shadowLayer.fill(palette.shadow);
            shadowLayer.rect(0, 0, shape[2], shape[3], shape[4]);
            shadowLayer.pop();
            return
        }

        shapeLayer.push();
        shapeLayer.scale(this.scale);
        if (!this.dead) shapeLayer.translate(shape[0], shape[1] + sin(frameCount+this.sighOffset) * 10);
        else shapeLayer.translate(shape[0], shape[1]);
        shapeLayer.rotate(shape[5]);
        shapeLayer.rect(0, 0, shape[2], shape[3], shape[4]);
        shapeLayer.pop();
    }

    displayEye(x, y, xOffset) {

        shadowLayer.fill(palette.shadow);
        shadowLayer.ellipse(xOffset, 50, 60);

        if (this.blink) { // blink
            shapeLayer.fill(palette.mid);
            if (player.pegNumber == this.number) shapeLayer.fill(palette.dark);
            shapeLayer.ellipse(xOffset, 0, 60);
            shapeLayer.fill(palette.black);
            shapeLayer.rect(xOffset, 0, 60, 5, 60);
            // rect(-20, 10, 5, 20, 60);
            // rect(0, 10, 5, 20, 60);
            // rect(20, 10, 5, 20, 60);
            return;
        } else if (this.dead) {
            shapeLayer.fill(palette.dead);
            shapeLayer.ellipse(xOffset, 0, 60);
            shapeLayer.stroke(palette.black);
            shapeLayer.strokeWeight(5);
            shapeLayer.line(xOffset-20, -20, xOffset+20, 20);
            shapeLayer.line(xOffset-20, 20, xOffset+20, -20);
            shapeLayer.noStroke();
            return;
        }

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
        let vec = createVector(playerX-this.x-xOffset, playerY-this.y).normalize().mult(8);

        if (player.pegNumber == this.number) vec = createVector(player.velocityX, player.velocityY).normalize().mult(8);

        shapeLayer.fill(palette.white);
        shapeLayer.ellipse(xOffset, 0, 60);

        shapeLayer.push();
        shapeLayer.translate(vec.x, vec.y);
        shapeLayer.fill(palette.black);
        shapeLayer.ellipse(xOffset, 0, 45);
        shapeLayer.pop();
    }
}