// USER LIFE
// this requires a recent version of sometimemachine and a latest-dump. it
// calculates the date of the first and last edit by each user, somewhat
// useful for visualization of falloff.

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var age = [];

var i = 0;

var height = 400;
var width = 800;
var min = 1238561010;
var max = 1367877073;

var start = moment('January 1, 2005');

var Canvas = require('canvas'),
    canvas = new Canvas(width, height),
    ctx = canvas.getContext('2d');

ctx.fillStyle = '#464';

db.each(('select min(closed_at) as a, max(closed_at) as b, user_id from osm_changeset group by user_id  order by random() LIMIT 100;'), function(err, row) {

    age.push(row.b - row.a);

}, function() {
    console.log('here');

    age = age.sort(function(a, b) {
        return a - b;
    });

    var maxage = age[age.length - 1];

    function sy(_) {
        return ~~((_ / age.length) * height);
    }

    function sx(_) {
        return ~~((_ / maxage) * width) || 2;
    }

    age = age.sort(function(a, b) {
        return Math.random() - 0.5;
    });

    for (var y = 0; y < age.length; y++) {
        // console.log(0, sy(y),
        //     sx(age[y]), 1);
        ctx.rect(
            0, sy(y),
            sx(age[y]), 1);
    }

    ctx.fill();

    fs.writeFileSync('user_abs.png', canvas.toBuffer());
});
