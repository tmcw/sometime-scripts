// USER LIFE
// this requires a recent version of sometimemachine and a latest-dump. it
// calculates the date of the first and last edit by each user, somewhat
// useful for visualization of falloff.

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var users = [];

var i = 0;

function est(x) {
    var factor = 1;
    return Math.floor(x / factor);
}

var height = 2000;
var width = 2000;
var min = 1238561010;
var max = 1367877073;

var start = moment('January 1, 2005');

var Canvas = require('canvas'),
    canvas = new Canvas(width, height),
    ctx = canvas.getContext('2d');

var canvas2 = new Canvas(width, height),
    ctx2 = canvas2.getContext('2d');

ctx.strokeStyle = '#253494';

ctx.font = '20px Helvetica';

db.each(('select min(closed_at) as a, max(closed_at) as b, user_id from osm_changeset group by user_id;'), function(err, row) {
    users.push([est(row.a), est(row.b)]);
}, function() {
    users.sort(function(a, b) {
        return a[0] - b[0];
    });
    function scaley(_) {
        return (_ / users.length) * height;
    }
    function scalex(_) {
        return ((_ - min) / (max - min)) * width;
    }


    while (start.year() < 2014) {
        start = start.add('years', 1);

        ctx.fillStyle = '#ccc';

        ctx.fillRect(
            scalex(start.unix()), 0,
            1, height);

        ctx.fillStyle = '#888';

        ctx.fillText(start.year(),
            scalex(start.unix()) + 10, 30);
    }


    ctx2.fillStyle = '#980043';

    for (var j = 0; j < users.length; j++) {
        ctx.beginPath();

        ctx.moveTo(
            ~~scalex(users[j][0]),
            ~~scaley(j));

        ctx.lineTo(
            ~~scalex(users[j][1]),
            ~~scaley(j));

        ctx.stroke();

        ctx2.rect(
            ~~scalex(users[j][0]),
            ~~scaley(j) - 2, 5, 5);

        ctx2.rect(
            ~~scalex(users[j][1]),
            ~~scaley(j) - 2, 5, 5);

        ctx2.fill();
    }

    fs.writeFileSync('user_life.png', canvas.toBuffer());
    fs.writeFileSync('user_life_over.png', canvas2.toBuffer());
});
