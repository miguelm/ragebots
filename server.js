// Placeholder file for Node.js game server
//TRALALALA
var util = require("util"),
    express = require("express"),
    io = require("socket.io"),
    Player = require("./Player").Player;

var app = express.createServer(express.logger());
var socket = io.listen(app);

socket.configure(function() {
  socket.set('log level', 1);                    // reduce logging
  socket.set('transports', [                     // enable all transports (optional if you want flashsocket)
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
  socket.set("polling duration", 10);

  var path = require('path');
  var HTTPPolling = require(path.join(
    path.dirname(require.resolve('socket.io')),'lib', 'transports','http-polling')
  );
  var XHRPolling = require(path.join(
    path.dirname(require.resolve('socket.io')),'lib','transports','xhr-polling')
  );

  XHRPolling.prototype.doWrite = function(data) {
    HTTPPolling.prototype.doWrite.call(this);

    var headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Length': (data && Buffer.byteLength(data)) || 0
    };

    if (this.req.headers.origin) {
      headers['Access-Control-Allow-Origin'] = '*';
      if (this.req.headers.cookie) {
        headers['Access-Control-Allow-Credentials'] = 'true';
      }
    }

    this.response.writeHead(200, headers);
    this.response.write(data);
    this.log.debug(this.name + ' writing', data);
  };
});

app.get('/index.htm', function (request, response) {
    console.log("/index.htm");
});

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  //app.use(express.errorHandler());
});

var port = process.env.PORT || 80;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var socket,
    players;

	
/*Point Structure*/	
 function point(x,y){ this.x=x;this.y=y; }
/* 2D Array Constructor */
 function Create2DArray(rows,cols) {
      var arr = new  Array(rows);
       for (var i = 0; i < rows; i++) {
                 arr[i] = new Array(cols);
                  for(var j=0;j<cols;j++)
                   arr[i][j] = new point(0,0);
                 }

                        //console.log(arr[0][0]);
              return arr;
       }
/* Create Game Field*/
 function GameField(cellWidth,  cellHeight,  fieldWidth,  fieldHeight)
   {
       var matrixWidth = Math.floor(fieldWidth / cellWidth);
       var matrixHeight = Math.floor((fieldHeight) / cellHeight);
       var matrix =  Create2DArray(matrixWidth,matrixHeight);
          
       for(var i=0;i<matrixWidth;i++)
         {
         for (var j = 0; j < matrixHeight; j++)
           {
            matrix[i][j]= new point(i*cellWidth, j*cellHeight);
                  
            }
          }
           return matrix;
 }
function init() {
    matrix = GameField(48,64,1440,672);
 
	players = [];
	
    setEventHandlers();
};

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
	//client.on("go",onGo);
	
	 setInterval(function(){
		    client.emit("go");
			console.log("GO!")
			;},1000);
};



function onGo(){}
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
	
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
	newPlayer.setName(data.name)
	newPlayer.setImg(data.imgURL)

	//this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), imgUrl: newPlayer.getImg(), name: newPlayer.getName()});
this.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), imgUrl: newPlayer.getImg(), name: newPlayer.getName()});

console.log("eu "+data.imgUrl)
var i, existingPlayer;
/*for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
	console.log("outro "+existingPlayer.getImg())
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), imgUrl: existingPlayer.getImg(), name: existingPlayer.getName()});

};*/


	console.log("outro "+newPlayer.getName())
players.push(newPlayer);

};

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

  		// Update player position
	//	movePlayer.setX(data.x);
	//	movePlayer.setY(data.y);
		console.log("DATA.X " + data.x + " DATA.Y "+data.y);
		var p = matrix[data.x ][data.y ];
		movePlayer.setX(p.x);
		movePlayer.setY(p.y);
		movePlayer.setImg(data.imgUrl);
		movePlayer.setName(data.name)
	    console.log("Matrix.X " + p.x + " Matrix.Y " + p.y);
		// Broadcast updated position to connected socket clients
		//this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
	    
	//this.broadcast.emit("move player", {id: movePlayer.id, x: p.x, y: p.y});
	this.broadcast.emit("move player", {id: movePlayer.id, x: p.x, y: p.y, imgUrl: movePlayer.getImg(), name: movePlayer.getName()});
	this.emit("move player", {id: movePlayer.id, x: p.x, y: p.y, imgUrl: movePlayer.getImg(), name: movePlayer.getName()});
	
	    //this.emit("move player", { id: movePlayer.id, x: p.x, y: p.y });
 

};

// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

init();