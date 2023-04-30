class Mine {

    constructor() {

        this.x = random(worldWidth);
        this.y = random(worldHeight);

        this.radius = 0;
        this.targetRadius = random(30, 60);

        this.breatheOffset = random(360);
        this.rotation = random(360);
        this.rotationDirection = random([-1, 1]);

        this.word = random(["POW!", "BANG!", "WHAM!", "ZAP!", "BOOM!", "BAM!","SMASH!", "ZOINKS!"]);
    }

    update() {

        while (this.radius < this.targetRadius) this.radius++;

        this.rotation += this.rotationDirection*0.1;
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius*1.5) {
            return true;
        }
    }

    display() {

        this.displayMine(0, 0);
        this.displayMine(-worldWidth, -worldHeight);
        this.displayMine(-worldWidth, 0);
        this.displayMine(-worldWidth, worldHeight);
        this.displayMine(0, -worldHeight);
        this.displayMine(0, 0);
        this.displayMine(0, worldHeight);
        this.displayMine(worldWidth, -worldHeight);
        this.displayMine(worldWidth, 0);
        this.displayMine(worldWidth, worldHeight);
    }

    displayMine(x, y) {

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
        rotate(this.rotation);

        fill(palette.bad);
        star(0, 0, this.radius + sin(frameCount+this.breatheOffset)*this.radius/5, this.radius*0.8 + sin(frameCount+this.breatheOffset)*this.radius/15, 32);

        stroke(palette.black);
        strokeWeight(this.radius*.2);
        fill(palette.white);
        textSize(this.radius*.7);
        text(this.word, 0, 0);

        pop();

        pop();
    }
}

function star(x, y, radius1, radius2, npoints) {

    angleMode(RADIANS);
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
    angleMode(DEGREES);
}
