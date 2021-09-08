// how to read files in nodejs: Change directory to grammer on cmd and you can check which files there is with 'dir/w' and enter "node fileread.js"

var fs = require('fs');
fs.readFile('sample.txt', 'utf8', function(err, data){
    console.log(data);
});

// function(,freely)