class Party {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.confettiNumber = 30;
        this.confetti = [];

        for (let i = 0; i < this.confettiNumber; i++) {
            this.confetti.push({
                x: this.x,
                y: this.y,
                velocityX: random(-1, 1),
                velocityY: random(-1, 1),
                rotation: random(90),
                rotationDirection: random([-1, 1]),
                size: 1,
                colour: color(random(50, 255), random(50, 255), random(50, 255))
            });
        }
    }

    update() {

        for (let i = 0; i < this.confettiNumber; i++) {
            this.confetti[i].x += this.confetti[i].velocityX * 15;
            this.confetti[i].y += this.confetti[i].velocityY * 15;
            this.confetti[i].rotation += this.confetti[i].rotationDirection;
            this.confetti[i].size *= 0.95;
        }
    }

    display(x, y) {

        shapeLayer.push();
        shapeLayer.translate(width/2, height/2);
        shapeLayer.translate(x, y);
        shadowLayer.push();
        shadowLayer.translate(width/2, height/2);
        shadowLayer.translate(x, y);

        for (let i = 0; i < this.confettiNumber; i++) {

            shapeLayer.push();
            shapeLayer.translate(this.confetti[i].x, this.confetti[i].y);
            shapeLayer.rotate(this.confetti[i].rotation);
            shapeLayer.fill(this.confetti[i].colour);
            shapeLayer.rect(0, 0, this.confetti[i].size*30);
            shapeLayer.pop();

            shadowLayer.push();
            shadowLayer.translate(this.confetti[i].x, this.confetti[i].y+30);
            shadowLayer.rotate(this.confetti[i].rotation);
            shadowLayer.fill(palette.shadow);
            shadowLayer.rect(0, 0, this.confetti[i].size*30);
            shadowLayer.pop();
        }

        shapeLayer.pop();
        shadowLayer.pop();
    }
}