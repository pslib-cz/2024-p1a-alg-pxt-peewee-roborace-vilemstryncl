radio.setGroup(23)

let x = 0
let y = 0
let trim = 0
let mode = 2
function readPin(pin: DigitalPin) {
    return pins.digitalReadPin(pin)
}
type IRC = {
    l: DigitalPin,
    c: DigitalPin,
    r: DigitalPin
}
const PINS: IRC = {
    l: DigitalPin.P14,
    c: DigitalPin.P15,
    r: DigitalPin.P13
}
pins.setPull(PINS.l, PinPullMode.PullNone);
pins.setPull(PINS.c, PinPullMode.PullNone);
pins.setPull(PINS.r, PinPullMode.PullNone);

function check_endpoints(list: number[]) {
    list.forEach(el => {
        if (Math.abs(el) > 255) { // if el >= 510 it doesnt work cuz 510/255 = 2
            el = el - el % 255
        }
    })
}
function setMotors(leftSpeed: number, rightSpeed: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, leftSpeed)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, rightSpeed)
}

radio.onReceivedString((recievedString) => {
    let parts = recievedString.split(",")
    if (parts.length === 2) {
        x = parseInt(parts[0])
        y = parseInt(parts[1])
    }
})

radio.onReceivedValue((name, value) => {
    switch (name) {
        case "drive":
            mode = value;
            break;
        case "trim":
            trim = value;
            break;

    }
})
let last_side: string;
let last_center = input.runningTime()

basic.forever(() => {
    let leftSpeed = 0
    let rightSpeed = 0;
    switch (mode) {
        case 0:
            PCAmotor.MotorStop(PCAmotor.Motors.M1);
            PCAmotor.MotorStop(PCAmotor.Motors.M4);
            break;
        case 1:
            leftSpeed = x - y - trim;
            rightSpeed = x + y + trim;

            check_endpoints([leftSpeed, rightSpeed])
            setMotors(leftSpeed, rightSpeed)
            break;
        case 2:
            const L = readPin(PINS.l) === 1 ? true : false;
            const C = readPin(PINS.c) === 1 ? true : false;
            const R = readPin(PINS.r) === 1 ? true : false;
            console.log([L, C, R])

            if (true) {
                leftSpeed = 230;
                rightSpeed = 255;
                console.log("center")
                last_center = input.runningTime();

            }
            if (L && !R) {
                rightSpeed += 100 * (input.runningTime() - last_center) / 4000;
                leftSpeed -= rightSpeed >= 255 ? rightSpeed - 255 : 0;
                last_side = "l";
                console.log("left")
            } else if (R && !L) {
                leftSpeed += 100 * (input.runningTime() - last_center) / 4000;
                rightSpeed -= leftSpeed >= 255 ? leftSpeed - 255 : 0;
                last_side = "r";
                console.log("right")
                console.log([leftSpeed, rightSpeed])
            }
            if (!L && !C && !R) {
                leftSpeed = last_side === "l" ? 200 : -200;
                rightSpeed = -leftSpeed
                console.log("none")
            }
            check_endpoints([leftSpeed, rightSpeed])
            setMotors(leftSpeed, rightSpeed)
            break;

        default:
            break;
    }
    basic.pause(25)
})
