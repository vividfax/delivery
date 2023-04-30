// https://coolors.co/ffebd6-a4d4b4-b96d40-6004c9-3b1c32
// https://coolors.co/ffebd6-ffbf00-9c91b6-6000cd-3b1c32

let palette = {
    white: "#FFEBD6",
    light: "#93A8A4",
    light2: "#8EA4A0",
    mid: "#FFBF00",
    dead: "#7B6355",
    dark: "#6000CD",
    black: "#3B1C32",
    bad: "#C8FF00"
}

let player;
let shapes = [];
let holes = [];
let pegs = [];
let mines = [];

let worldWidth = 2500;
let worldHeight = 2000;
let numberOfShapes = 5;

let noiseLayers = [];

let score = 0;

let comicFont;
let scoreFont;

let timer = 0;
let timeBump = 0;
let timeStart = 0;
let timeCount = 0;
let countingTime = true;

let sandboxMode = false;

function preload() {

    comicFont = loadFont("./fonts/Bangers-Regular.ttf");
    scoreFont = loadFont("./fonts/ContrailOne-Regular.ttf");
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    noStroke();
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    strokeJoin(ROUND);

    createBackgrounds();

    setupController();

    newGame();
}

function draw() {

    // console.log(frameRate());

    buttonsPressed();
    stickMoved();

    image(noiseLayers[int(frameCount/10)%noiseLayers.length], 0, 0);

    push();
    translate(-player.x, -player.y);
    translate(-player.cameraX, -player.cameraY);

    for (let i = 0; i < mines.length; i++) {
        mines[i].update();
        mines[i].display();
    }

    for (let i = 0; i < shapes.length; i++) {
        holes[i].update();
        holes[i].display();
    }

    holes[0].display();

    for (let i = 0; i < shapes.length; i++) {
        pegs[i].update();
        pegs[i].display();
    }

    if (player.pegNumber >= 0) pegs[player.pegNumber].display();

    player.update();
    player.display();

    pop();

    if (!sandboxMode  && score != 0 && countingTime == true) {

        if (timeStart == 0) timeStart = millis();
        if (timeStart + timeCount*1000 < millis()) {
            timeCount++;
            timer--;
        }

        if (timer <= 0) countingTime = false;
    }

    displayTimer();
    if (!countingTime) displayResetButton();
}

function newGame() {

    player = new Player();
    shapes = [];
    holes = [];
    pegs = [];
    mines = [];
    score = 0;

    shapes.push({
        first: newShape(),
        second: newShape(),
        third: newShape()
    });
    holes.push(new Hole(shapes[0], 0));
    pegs.push(new Peg(shapes[0], 0));
    holes[0].solved = true;
    pegs[0].solved = true;
    holes[0].partyDone = true;

    for (let i = 1; i < numberOfShapes+1; i++) {
        shapes.push({
            first: newShape(),
            second: newShape(),
            third: newShape()
        });
        holes.push(new Hole(shapes[i], i));
        pegs.push(new Peg(shapes[i], i));
    }

    // for (let i = 0; i < 5; i++) {
    //     mines.push(new Mine());
    // }

    timer = 16;
    timeBump = 8;
    timeStart = 0;
    timeCount = 0;
    countingTime = true;
}

function newShape() {

    return [random(-50, 50), random(-50, 50), random(50, 150), random(50, 150), random([0, 500]) , random(360)];
}

function addShape() {

    shapes.push({
        first: newShape(),
        second: newShape(),
        third: newShape()
    });

    let i = shapes.length-1;

    holes.push(new Hole(shapes[i], i));
    pegs.push(new Peg(shapes[i], i));
}

function createBackgrounds() {

    let size = 10;
    let layers = 10;

    for (let i = 0; i < layers; i++) {
        noiseLayers.push(createGraphics(width, height));
    }

    for (let h = 0; h < noiseLayers.length; h++) {

        noiseLayers[h].noStroke();
        noiseLayers[h].background(palette.light);
        noiseLayers[h].fill(palette.light2);

        for (let i = 0; i < width; i += size) {
            for (let j = 0; j < height; j += size) {

                if (random() < 0.5) {
                    noiseLayers[h].rect(i, j, size);
                }
            }
        }
    }
}

function displayTimer() {

    noFill();
    stroke(palette.white);
    if (!countingTime) stroke(palette.black);
    strokeWeight(20);
    rect(width/2, height/2, width, height, 20);
    noStroke();

    if (sandboxMode || score == 0) return;
    fill(palette.white);
    if (!countingTime) fill(palette.black);
    rect(width/2, 50, 150, 100, 0, 0, 10, 10);
    fill(palette.dark);
    if (!countingTime) fill(palette.white);
    textFont(scoreFont);
    textSize(50);
    text(timer, width/2, 50);
}

function displayResetButton() {

    if (aButtonPressed(2) || keyIsDown(88)) {
        newGame();
    } else if (aButtonPressed(1) || keyIsDown(66)) {
        sandboxMode = true;
        newGame();
    }

    fill(palette.black);
    rect(width/2, height/2, 450, 200, 10);
    fill(palette.white);
    textSize()
    text("[x] restart", width/2, height/2-45);
    text("[b] sandbox mode", width/2, height/2+35);
}

function keyPressed() {

    if (!countingTime && (key == "x" || key == "X")) {
        newGame();
    } else if (!countingTime && (key == "b" || key == "B")) {
        sandboxMode = true;
        newGame();
    }
}