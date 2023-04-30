// https://coolors.co/ffebd6-a4d4b4-b96d40-6004c9-3b1c32

let palette = {
    white: "#FFEBD6",
    light: "#A4D4B4",
    mid: "#B96D40",
    dark: "#6004C9",
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

function preload() {

    comicFont = loadFont("./fonts/Bangers-Regular.ttf");
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    noStroke();
    angleMode(DEGREES);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont(comicFont);

    createBackgrounds();

    setupController();

    newGame();
}

function draw() {

    // console.log(frameRate());

    buttonsPressed();
    stickMoved();

    image(noiseLayers[int(frameCount/10)%noiseLayers.length], 0, 0);

    translate(-player.x, -player.y);
    translate(-player.cameraX, -player.cameraY);

    for (let i = 0; i < shapes.length; i++) {
        holes[i].update();
        holes[i].display();
    }

    for (let i = 0; i < shapes.length; i++) {
        pegs[i].update();
        pegs[i].display();
    }

    if (player.pegNumber >= 0) pegs[player.pegNumber].display();

    player.update();
    player.display();

    for (let i = 0; i < mines.length; i++) {
        mines[i].update();
        mines[i].display();
    }
}

function newGame() {

    player = new Player();
    shapes = [];
    holes = [];
    pegs = [];
    mines = [];
    score = 0;

    for (let i = 0; i < numberOfShapes; i++) {
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
        noiseLayers[h].fill("#9ED1AF");

        for (let i = 0; i < width; i += size) {
            for (let j = 0; j < height; j += size) {

                if (random() < 0.5) {
                    noiseLayers[h].rect(i, j, size);
                }
            }
        }
    }
}
