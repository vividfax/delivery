// https://coolors.co/ffebd6-a4d4b4-b96d40-6004c9-3b1c32

let palette = {
    white: "#FFEBD6",
    light: "#A4D4B4",
    mid: "#B96D40",
    dark: "#6004C9",
    black: "#3B1C32"
}

let player;
let shapes = [];
let holes = [];
let pegs = [];

let worldWidth = 2000;
let worldHeight = 2000;
let numberOfShapes = 5;

function setup() {

    createCanvas(windowWidth, windowHeight);
    noStroke();
    angleMode(DEGREES);
    rectMode(CENTER);

    setupController();

    newGame();
}

function draw() {

    buttonsPressed();
    stickMoved();

    background(palette.light);

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
}

function newGame() {

    player = new Player();
    shapes = [];
    holes = [];
    pegs = [];

    for (let i = 0; i < numberOfShapes; i++) {
        shapes.push({
            first: newShape(),
            second: newShape(),
            third: newShape()
        });
    }

    for (let i = 0; i < shapes.length; i++) {
        holes.push(new Hole(shapes[i], i));
        pegs.push(new Peg(shapes[i], i));
    }
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