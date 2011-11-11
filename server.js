var http = require('http');

var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('O Filipe e o Joao sao larilas\n');
}).listen(port);

console.log('Server running at http://127.0.0.1:1337/');