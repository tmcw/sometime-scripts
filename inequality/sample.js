var fs = require('fs');

var bub = JSON.parse(fs.readFileSync('bubbles.json'));

var sampled = [];
for (var i = 0; i < bub.length; i++) {
    if (Math.random() > 0.9) sampled.push(bub[i]);
}

fs.writeFileSync('sampled.json', JSON.stringify(sampled));
