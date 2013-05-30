// USER LIFE
// this requires a recent version of sometimemachine and a latest-dump. it
// calculates the date of the first and last edit by each user, somewhat
// useful for visualization of falloff.

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var ss = require('simple-statistics');
var incr = require('incr-object');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var users = [];

var i = 0;

var days = new incr();

db.each(('select closed_at from osm_changeset order by closed_at desc limit 1000000;'), function(err, row) {
    days.incr(moment(row.closed_at * 1000).format('YYYYMMDD'));
}, function(err) {
    fs.writeFileSync('days.json', JSON.stringify(days.entries()));
    console.log(ss.median(days.entries().map(function(e) {
        return e.value;
    })));
    console.log(ss.mean(days.entries().map(function(e) {
        return e.value;
    })));
});
