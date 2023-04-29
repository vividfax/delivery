class Player {

    constructor() {

        this.x = width/2;
        this.y = height/2;
        this.cameraX = 0;
        this.cameraY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 30;

        this.collisionDuration = 0;
        this.safeX = this.x;
        this.safeY = this.y;

        this.hasKey = false;

        this.pegNumber = -1;
        this.switchedPegRecently = false;
        this.pegSwitchFrameCount = 0;
    }

    update() {

        let moveX = true;
        let moveY = true;

        if (this.pegNumber >= 0) {
            this.velocityX += controllerLX*2.5;
            this.velocityY += controllerLY*2.5;
        } else {
            this.velocityX += controllerLX*4.5;
            this.velocityY += controllerLY*4.5;
        }

        // if (this.x+this.velocityX < this.radius/2 || this.x+this.velocityX > width-this.radius/2) moveX = false;
        // if (this.y+this.velocityY < this.radius/2 || this.y+this.velocityY > height-this.radius/2) moveY = false;

        if (moveX) {
            this.x += this.velocityX;
            this.cameraX -= this.velocityX;
        }

        if (moveY) {
            this.y += this.velocityY;
            this.cameraY -= this.velocityY;
        }

        if (this.cameraX > width/4 || this.cameraX < -width/4) {
            this.cameraX += this.velocityX;
        }

        if (this.cameraY > height/4 || this.cameraY < -height/4) {
            this.cameraY += this.velocityY;
        }

        this.velocityX *= 0.95;
        this.velocityY *= 0.95;

        this.x = mod(this.x, worldWidth);
        this.y = mod(this.y, worldHeight);

        if (this.pegNumber >= 0) {
            pegs[this.pegNumber].x = this.x;
            pegs[this.pegNumber].y = this.y;
        }

        this.pegSwitchFrameCount++;

        if (this.switchedPegRecently && this.pegSwitchFrameCount > 50) {
            this.switchedPegRecently = false;
        }
    }

    reset() {

        this.velocityX = 0;
        this.velocityY = 0;
        this.x = pathMaker.startX;
        this.y = pathMaker.startY;
    }

    display() {

        if (this.pegNumber >= 0) return;

        push();
        translate(width/2, height/2);
        fill(palette.dark);
        ellipse(this.x, this.y, this.radius);
        pop();
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
}
