type IRC = {
    l: DigitalPin,
    c: DigitalPin,
    r: DigitalPin
}
type PinData = {
    l: boolean,
    c: boolean,
    r: boolean
}
const IR: IRC = {
    l: DigitalPin.P14,
    c: DigitalPin.P15,
    r: DigitalPin.P13
}
pins.setPull(IR.l, PinPullMode.PullNone);
pins.setPull(IR.c, PinPullMode.PullNone);
pins.setPull(IR.r, PinPullMode.PullNone);

let data: PinData = {l: false, c: false, r: false};
basic.forever(function () {
    data.l = pins.digitalReadPin(IR.l) === 1;
    data.c = pins.digitalReadPin(IR.c) === 1;
    data.r = pins.digitalReadPin(IR.r) === 1;
    console.log(data);

    basic.pause(20)
})
