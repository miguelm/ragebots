/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    keys,           // Keyboard input
    localPlayer,    // Local player
    remotePlayers,
    socket;

var logged, urlImg;



/**************************************************
** GAME INITIALISATION
**************************************************/
function init(data) {
    // Declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // Maximise the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialise keyboard controls
    keys = new Keys();

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen
    var startX = Math.round(Math.random()*(canvas.width-5)),
        startY = Math.round(Math.random()*(canvas.height-5));

    // Initialise the local player
    localPlayer = new Player(startX, startY);
	localPlayer.setName(data.uid);
	addImage(data,localPlayer);

 	//socket = io.connect("http://localhost", {port: 3000, transports: ["websocket"]});
    //socket = new io.Socket();
    //io.configure(function() {
    //    io.set("transports", ["xhr-polling", "flashsocket", "json-polling"]);
    //});

    //socket.configure(function () {
    //    socket.set('transports', ['flashsocket', 'xhr-polling']);
    //});


    remotePlayers = [];

	

};

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // Window resize
    window.addEventListener("resize", onResize, false);

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
    if (localPlayer) {
        keys.onKeyDown(e);
    };
};

// Keyboard key up
function onKeyup(e) {
    if (localPlayer) {
        keys.onKeyUp(e);
    };
};

// Browser window resize
function onResize(e) {
    // Maximise the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), imgURL: localPlayer.getImg(),name: localPlayer.getName()});

};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
	if(data.id != localPlayer.id && localPlayer != undefined && data.imgURL != undefined ){
    	console.log("New player connected: "+data.id);
		var url = data.imgURL
    	var newPlayer = new Player(data.x, data.y);
		newPlayer.id = data.id;
		newPlayer.setImg(url);	
		newPlayer.setName(data.name);
		remotePlayers.push(newPlayer);

		$("#usersplaying").append("<li id="+newPlayer.getName()+"><div class='score'>1</div><img src='"+url+"'></img><div class='name'>"+newPlayer.getName()+"</div></li>");
	}
};

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
	movePlayer.setImg(data.imgUrl);	
};

function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
	$("#"+data.name).remove();
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY(), name:localPlayer.getName(),imgUrl: localPlayer.getImg()});
    };
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the local player
    localPlayer.draw(ctx);

    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };
};

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};

function isLogged(){

	if(logged == undefined)
		return false
	return logged;
}

function initialize()
{
	$("#login").show();
  	$("#design").hide();
  	$("#email").focus();
}

function validate()
{
	logged = false;
	var email = $('#emailinput').val();  
	var pwd = $('#passwordinput').val();  

	if(validateEmail(email))
	{
		var jsonresp = $.getJSON("https://services.sapo.pt/Codebits/gettoken?user="+email+"&password="+pwd+"&callback=?",
		function(data) {
			if(data.error == undefined)
		   	{
				logged = true;
				showDraw(data);
			}
			else
			{
				alert("Your e-mail/password is invalid!");
				
			}
		 });

	}
	else
		alert("E-mail inválido!")	
	
}

function addImage(data, player)
{
	$.ajax({
	     type: "GET",
	     url: "https://services.sapo.pt/Codebits/botuser/"+escape(data.uid),
		 dataType: "jsonp",

			success: function(bot){
				var url = "https://codebits.eu"+bot.botfile
		    	player.setImg(url);
				$("#user").append("<img src= '"+url+"'></img><div class='name'>"+player.getName()+"</div>");
				$("#usersplaying").append("<li id="+player.getName()+"><div class='score'>1</div><img src='"+url+"'></img><div class='name'>"+player.getName()+"</div></li>");
				socket = io.connect('/');
			    // Start listening for events
			    setEventHandlers();
			//	$("#usersplaying").append("<li id="+player.getName()+"><div class='score'>1</div><img src='"+player.getImg()+"'></img><div class='name'>"+player.getName()+"</div></li>");
				
				// "https://services.sapo.pt/Codebits/botmake/"+getUrlBot(bot);
				
			//	$("#loginform").append('<img id="botimage" src='+url +' />')
		 	}
		})
	

}

function getUrlBot(bot)
{
	return bot.body+","+bot.bgcolor+","+bot.grad+","+bot.eyes+","
	+bot.mouth+","+bot.legs+","+bot.head+","+bot.arms
	+","+(bot.balloon=="false"?"":escape(bot.balloon));
}

function showDraw(data){

	if(isLogged()){

		$("#login").hide();
	  	$("#design").show();
		init(data);
    	animate();

	}
}

function validateEmail(elementValue){  
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(elementValue);  
 }

 

