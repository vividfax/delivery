let controllers = [];

let controllerLY = 0;
let controllerLX = 0;

let controllerRY = 0;
let controllerRX = 0;

function setupController() {
    window.addEventListener("gamepadconnected", function(e) {
    gamepadHandler(e, true);
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
        colour=color(120,0,0)
        gamepadHandler(e, false);
    });
}

function gamepadHandler(event, connecting) {
    let gamepad = event.gamepad;
    if (connecting) {
            print("Connecting to controller "+gamepad.index)
        controllers[gamepad.index] = gamepad
    } else {
        delete controllers[gamepad.index]
    }
}

function aButtonPressed(index) {

    var gamepads = navigator.getGamepads()

    for (let i in controllers) {

        let controller=gamepads[i]

        if (controller.buttons) {
        let val=controller.buttons[index];

        if (buttonPressed(val)) {

            return true;
        }
        }
    }
    return false;
}

function buttonPressed(b) {
    if (typeof(b) == "object") {
        return b.pressed; // binary
    }
    return b > 0.9; // analog value
}

function stickMoved() {

    var gamepads = navigator.getGamepads()

    for (let i in controllers) {

        let controller=gamepads[i]

        if (controller.axes)
        {
            let axes=controller.axes;

            if (abs(controller.axes[0]) > 0.2) {
                controllerLX = controller.axes[0] * 0.3;
            } else {
                controllerLX = 0;
            }
            if (abs(controller.axes[1]) > 0.2) {
                controllerLY = controller.axes[1] * 0.3;
            } else {
                controllerLY = 0;
            }
            if (abs(controller.axes[2]) > 0.2) {
                controllerRX = controller.axes[2] * 0.3;
            } else {
                controllerRX = 0;
            }
            if (abs(controller.axes[3]) > 0.2) {
                controllerRY = controller.axes[3] * 0.3;
            } else {
                controllerRY = 0;
            }
        }
    }
}

function buttonsPressed() {

    let strength = 0.27;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        controllerLX = -strength;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        controllerLX = strength;
    } else {
        controllerLX = 0;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        controllerLY = -strength;
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        controllerLY = strength;
    } else {
        controllerLY = 0;
    }

}
