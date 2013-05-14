// http://www.osmfoundation.org/wiki/License/Contributor_Terms

var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(argv._[0]);

var year_ago = moment().subtract('year', 1);

var users = {};
var i = 0;
var mine = 0;
var u;

var done = 0;

db.each('select closed_at, user_id from osm_changeset where closed_at > ' + year_ago.unix() + ';', function(err, row) {
    var id = row.user_id;
    if (!users[id]) users[id] = {};
    users[id][moment(row.closed_at * 1000).month()] = true;
    console.log('%d done', ++done);
}, function() {
    var voters = [];
    for (var u in users) {
        if (Object.keys(users[u]).length > 2) voters.push(u);
    }
    console.log('%d voting users found', voters.length);
    fs.writeFileSync('voting_users.csv', voters.join('\n'));
});
