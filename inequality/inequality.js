// http://www.osmfoundation.org/wiki/License/Contributor_Terms

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var year_ago = moment().subtract('year', 1);

var bins = {};
var done = 0;

db.each('select sum(num_changes) as per_user from osm_changeset group by user_id;', function(err, row) {

    var bin = Math.ceil(row.per_user / 10000);
    if (bins[bin] === undefined) bins[bin] = 0;
    bins[bin]++;

    console.log('%d done', ++done);

}, function() {
    console.log('done');

    fs.writeFileSync('bins.json', JSON.stringify(bins));

});
