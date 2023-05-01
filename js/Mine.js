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
        // this.colours = [color("#FFEBD6"), color("#FFBF00"), color("#B30027"), color("#FFBF00"), color("#FFEBD6")];
        this.colours = [color("#FFBF00"), color("#B30027"), color("#FFEBD6"), color("#B30027"), color("#FFBF00")];

        this.coloursOffset = int(random(3));
        this.colourLerp = 0;
        this.colourLerpPercent = 0;
        this.currentColour = 0;
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

        shapeLayer.push();
        shapeLayer.translate(x, y);

        shapeLayer.push();
        shapeLayer.translate(width/2, height/2);
        shapeLayer.translate(this.x, this.y);
        shapeLayer.rotate(this.rotation);

        let colour = lerpColor(this.colours[this.colourLerp], this.colours[this.colourLerp+1], this.colourLerpPercent);
        this.colourLerpPercent += 0.02;
        if (this.colourLerpPercent >= 1) {
            this.colourLerpPercent = 0;
            this.colourLerp++;
            if (this.colourLerp >= 4) this.colourLerp = 0;
        }

        shapeLayer.fill(colour);
        star(0, 0, this.radius + sin(frameCount+this.breatheOffset)*this.radius/5, this.radius*0.8 + sin(frameCount+this.breatheOffset)*this.radius/15, 32);

        // if (player.pegNumber >= 0) {
            shapeLayer.stroke(palette.black);
            shapeLayer.strokeWeight(this.radius*.2);
            shapeLayer.fill(palette.white);
            shapeLayer.textFont(comicFont);
            shapeLayer.textSize(this.radius*.7);
            shapeLayer.text(this.word, 0, 0);
        // }

        shapeLayer.pop();

        shapeLayer.pop();
    }
}

function star(x, y, radius1, radius2, npoints) {

    shapeLayer.angleMode(RADIANS);
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    shapeLayer.beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + shapeLayer.cos(a) * radius2;
        let sy = y + shapeLayer.sin(a) * radius2;
        shapeLayer.vertex(sx, sy);
        sx = x + shapeLayer.cos(a + halfAngle) * radius1;
        sy = y + shapeLayer.sin(a + halfAngle) * radius1;
        shapeLayer.vertex(sx, sy);
    }
    shapeLayer.endShape(CLOSE);
    shapeLayer.angleMode(DEGREES);
}
