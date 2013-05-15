var fs = require('fs');
var ss = require('simple-statistics');

var bub = ss.sum(JSON.parse(fs.readFileSync('bubbles.json')));
var sample = ss.sum(JSON.parse(fs.readFileSync('sampled.json')));

console.log(JSON.parse(fs.readFileSync('sampled.json')).length);
console.log(sample);
console.log(sample/bub);
