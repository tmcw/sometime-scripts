// USER LIFE
// this requires a recent version of sometimemachine and a latest-dump. it
// calculates the date of the first and last edit by each user, somewhat
// useful for visualization of falloff.

var fs = require('fs');
var moment = require('moment');
var pad = require('pad');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();

var bboxes = JSON.parse(fs.readFileSync('bboxes.json'));

var width = 1000,
    height = 500;

var Canvas = require('canvas'),
    canvas = new Canvas(width, height),
    ctx = canvas.getContext('2d');

function sx(_) {
    return ((_ + 130) / 70) * width;
}

function sy(_) {
    return ((52 - _) / 30) * height;
}

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, width, height);

ctx.strokeStyle = '#00FFFF';
ctx.globalAlpha = 0.8;
ctx.globalCompositeOperation = 'hard-light';

var n = 0;

bboxes.forEach(function(b, i) {

    ctx.rect(
        ~~sx(b[0]),
        ~~sy(b[1]),
        ~~(sx(b[2]) - sx(b[0])),
        ~~(sy(b[3]) - sy(b[1])));

    ctx.stroke();

    if (i % 200 === 0) {
        fs.writeFileSync('frames/' + pad(5, n++, '0') + '.png', canvas.toBuffer());
        ctx.beginPath();
    }
});


fs.writeFileSync('bot_mode.png', canvas.toBuffer());
