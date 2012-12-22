var fs = require('fs');
var csv2json = require('csv2json-stream');

var opts = {
  delim: ',',
  columns: ['Category', 'Type', 'Data1', 'Data2']
};

fs.createReadStream('data.csv').pipe(csv2json(opts)).pipe(fs.createWriteStream('data.json'));