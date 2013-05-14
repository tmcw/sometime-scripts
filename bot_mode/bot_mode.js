// USER LIFE
// this requires a recent version of sometimemachine and a latest-dump. it
// calculates the date of the first and last edit by each user, somewhat
// useful for visualization of falloff.

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var bboxes = [];

db.each(('select * from osm_changeset where user_id=451693;'), function(err, row) {
    bboxes.push([
        row.min_lon,
        row.min_lat,
        row.max_lon,
        row.max_lat]);
}, function() {
    fs.writeFileSync('bboxes.json', JSON.stringify(bboxes));
});
