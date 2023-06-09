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
        this.collisionOff = false;
        this.collisionOffFor = 0;

        this.pegNumber = -1;
        this.switchedPegRecently = false;
        this.pegSwitchFrameCount = 0;

        this.wobblyCircle;
        this.newWobble();
    }

    update() {

        if (!interacted && (controllerLX != 0 || controllerLY != 0)) {
            interacted = true;
            music.play();
        }

        if (!countingTime && !sandboxMode) {
            this.pegNumber = -1;
            this.x = lerp(this.x, width/2, 0.05);
            this.y = lerp(this.y, height/2, 0.05);
            this.cameraX = lerp(this.cameraX, 0, 0.05);
            this.cameraY = lerp(this.cameraY, height/5, 0.05);
            this.velocityX = 0;
            this.velocityY = 0;
            this.wobblyCircle.update();
            return;
        }

        if (menuOpen) return;

        let moveX = true;
        let moveY = true;

        if (this.pegNumber >= 0) {
            this.velocityX += controllerLX*2.5;
            this.velocityY += controllerLY*2.5;
        } else {
            this.velocityX += controllerLX*4.5;
            this.velocityY += controllerLY*4.5;
        }

        let potentialPlayer = {
            x: this.x + this.velocityX,
            y: this.y + this.velocityY,
            radius: this.radius
        };

        if (this.pegNumber >= 0 && !this.collisionOff) {

            let collided = false;

            for (let i = 0; i < holes.length; i++) {
                if (holes[i].collide(potentialPlayer)) {

                    let incidenceAngle = createVector(this.velocityX, this.velocityY).heading();
                    let surfaceAngle = createVector(potentialPlayer.x - holes[i].x, potentialPlayer.y - holes[i].y).heading() + 90;
                    let newAngle = angleReflect(incidenceAngle, surfaceAngle);

                    let v = createVector(this.velocityX, this.velocityY);
                    v.setHeading(newAngle);

                    this.velocityX = v.x;
                    this.velocityY = v.y;

                    collided = true;

                    this.velocityX *= 0.95;
                    this.velocityY *= 0.95;

                    bounceSounds[bounceSoundIndex].play();
                    bounceSoundIndex++;
                    if (bounceSoundIndex >= bounceSounds.length) bounceSoundIndex = 0;

                    break;
                }
            }

            if (!this.switchedPegRecently) {
                for (let i = 0; i < mines.length; i++) {
                    if (mines[i].collide(potentialPlayer)) {

                        let incidenceAngle = createVector(this.velocityX, this.velocityY).heading();
                        let surfaceAngle = createVector(potentialPlayer.x - mines[i].x, potentialPlayer.y - mines[i].y).heading() + 90;
                        let newAngle = angleReflect(incidenceAngle, surfaceAngle);

                        let v = createVector(this.velocityX, this.velocityY);
                        v.setHeading(newAngle);

                        this.velocityX = v.x;
                        this.velocityY = v.y;

                        collided = true;

                        this.velocityX *= 3.95;
                        this.velocityY *= 3.95;

                        if (!sandboxMode) {
                            pegs[this.pegNumber].dead = true;
                            holes[this.pegNumber].dead = true;
                            addShape();

                            powDeadSounds[powDeadSoundIndex].play();
                            powDeadSoundIndex++;
                            if (powDeadSoundIndex >= powDeadSounds.length) powDeadSoundIndex = 0;
                        } else {

                            powSounds[powSoundIndex].play();
                            powSoundIndex++;
                            if (powSoundIndex >= powSounds.length) powSoundIndex = 0;
                        }

                        this.pegNumber = -1;
                        player.switchedPegRecently = true;
                        player.pegSwitchFrameCount = 0;


                        break;
                    }
                }
            }

            if (collided) {
                this.collisionDuration++;

                if (this.collisionDuration > 10) {
                    this.collisionOff = true;
                }
            } else {
                this.collisionDuration = 0;
                this.safeX = this.x;
                this.safeY = this.y;
            }
        } else if (this.collisionOff) {
            this.collisionOffFor++;

            if (this.collisionOffFor > 30) {
                this.collisionOff = false;
                this.collisionOffFor = 0;
            }
        }

        if (moveX) {
            this.x += this.velocityX;
            // this.cameraX += this.velocityX;
        }

        if (moveY) {
            this.y += this.velocityY;
            // this.cameraY += this.velocityY;
        }

        // if (this.cameraX > width/14 || this.cameraX < -width/14) {
        //     this.cameraX -= this.velocityX;
        // }

        // if (this.cameraY > height/14 || this.cameraY < -height/14) {
        //     this.cameraY -= this.velocityY;
        // }

        this.cameraX = lerp(this.cameraX, 0, 0.1);
        this.cameraY = lerp(this.cameraY, 0, 0.1);

        this.velocityX *= 0.95;
        this.velocityY *= 0.95;

        this.x = mod(this.x, worldWidth);
        this.y = mod(this.y, worldHeight);

        if (this.pegNumber >= 0) {
            pegs[this.pegNumber].x = this.x;
            pegs[this.pegNumber].y = this.y;
        } else {
            this.wobblyCircle.update();
        }

        this.pegSwitchFrameCount++;

        if (this.switchedPegRecently && this.pegSwitchFrameCount > 50) {
            this.switchedPegRecently = false;
        }
    }

    newWobble() {

        this.wobblyCircle = new WobblyCircle(this.radius*0.7, 1, this.x, this.y, palette.dark);
    }

    display() {

        if (this.pegNumber >= 0) return;

        shapeLayer.push();
        shapeLayer.translate(width/2, height/2);

        shapeLayer.fill(palette.dark);
        this.wobblyCircle.display();

        shapeLayer.pop();
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

class WobblyCircle {

    constructor(radius, wobble, x, y, colour) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;

        this.offset = (radius+1)/20*wobble;

        this.offsets = [];
        this.offsetDirections = [];

        for (let i = 0; i < 12; i++) {

            this.offsets[i] = random(-this.offset, this.offset);
            this.offsetDirections[i] = random([-1, 1]);
        }
    }

    update() {

        for (let i = 0; i < 12; i++) {

            let currentOffset = this.offsets[i];

            if (currentOffset > this.offset || currentOffset < -this.offset) this.offsetDirections[i] *= -1;

            this.offsets[i] += this.offsetDirections[i]*random(0.2*this.radius/50);
        }
    }

    grow() {

        this.radius++;
    }

    display(offsetX, offsetY, col) {

        let colour = col || this.colour;

        let radius = this.radius;

        if (radius <= 0) return;

        shapeLayer.push();
        shapeLayer.translate(player.x, player.y);
        shapeLayer.translate(this.x + offsetX, this.y + offsetY);
        shapeLayer.angleMode(DEGREES);
        shapeLayer.noStroke();
        shapeLayer.fill(colour);

        shapeLayer.beginShape();

        for (let i = 0; i < 2; i++) {

            shapeLayer.curveVertex(0, -radius+this.offsets[0]);
            shapeLayer.curveVertex(radius*.7+this.offsets[1], -radius*.7+this.offsets[2]);
            shapeLayer.curveVertex(radius+this.offsets[3], 0);
            shapeLayer.curveVertex(radius*.7+this.offsets[4], radius*.7+this.offsets[5]);
            shapeLayer.curveVertex(0, radius+this.offsets[6]);
            shapeLayer.curveVertex(-radius*.7+this.offsets[7], radius*.7+this.offsets[8]);
            shapeLayer.curveVertex(-radius+this.offsets[9], 0);
            shapeLayer.curveVertex(-radius*.7+this.offsets[10], -radius*.7+this.offsets[11]);
        }

        shapeLayer.endShape(CLOSE);

        shapeLayer.pop();
    }
}

function angleReflect(incidenceAngle, surfaceAngle) {
    var a = surfaceAngle * 2 - incidenceAngle;
    return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}
