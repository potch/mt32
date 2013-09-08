var midi = require('midi');
var help = require('midi-help');

var out = new midi.output();

var numPorts = out.getPortCount();

for (var i=0; i < numPorts; i++) {
    console.log(i + ') ' + out.getPortName(i));
}

out.openPort(0);

playNote(out, 64, 127, 1, 100);

display(out, 'Hello!');

function playNote(output, note, vel, channel, duration) {
    noteOn(output, note, vel, channel);
    setTimeout(function() {
        noteOff(output, note, vel, channel);
    }, duration);
}

function noteOn(output, note, vel, channel) {
    channel = channel || 0;
    var code = 144 + channel;
    output.sendMessage([code, note, vel]);
}

function noteOff(output, note, vel, channel) {
    channel = channel || 0;
    var code = 128 + channel;
    output.sendMessage([code, note, vel]);
}

function display(output, msg) {
    var checksum = 0x20;
    var bytes = [];
    for (var i=0; i<20; i++) {
        var ch = i < msg.length ? msg.charCodeAt(i) : 0x20;
        checksum += ch;
        bytes.push(ch);
    }
    checksum = (~checksum & 0x7F) + 1;
    bytes = [0x41,0x10,0x16,0x12,0x20,0x0,0x0].concat(bytes, checksum);
    sendSysEx(output, bytes);
}

function sendSysEx(output, msg) {
    msg = [0xF0].concat(msg, 0xF7);
    output.sendMessage(msg);
}

