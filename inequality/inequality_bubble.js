// http://www.osmfoundation.org/wiki/License/Contributor_Terms

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var year_ago = moment().subtract('year', 1);

var bins = {};
var done = 0;

db.all('select sum(num_changes) as per_user from osm_changeset group by user_id;', function(err, rows) {
    fs.writeFileSync('bubbles.json', JSON.stringify(rows.map(function(r) {
        return r.per_user;
    })));
});
