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
    var factor = 10000;
    return Math.floor(x / factor);
}

db.each(('select min(closed_at) as a, max(closed_at) as b, user_id from osm_changeset group by user_id;'), function(err, row) {
    if (++i % 10 == 0) users.push([est(row.a), est(row.b)]);
}, function() {
    fs.writeFileSync('user_life.json', JSON.stringify(users));
});
