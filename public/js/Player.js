/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	
	var imgUrl;
    var x = 0,
        y = 0,
		real_x = 0,
	    real_y = 0,
        id,
        moveAmount = 2;
	var img;
	var name;

    // Getters and setters
    var setRealX = function (newRealX) {
        real_x = newRealX;
    };
    var setRealY = function (newRealY) {
        real_y = newRealY;
    };
    var getX = function () {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getImg = function() {
        return imgUrl;
    };
    var setImg = function(newImg) {
        imgUrl = newImg;
    };

    var getName = function() {
        return name;
    };
    var setName = function(newName) {
        name = newName;
    };

    var update = function(newx,newy) {
        var prevX = x,
			prevY = y;

			 // Up key takes priority over down
		        //        if (keys.up) {
		        //            y -= 1;
		        //        } else if (keys.down) {
		        //            y += 1;
		        //        };


		        //        // Left key takes priority over right
		        //        if (keys.left) {
		        //            x -= 1;
		        //        } else if (keys.right) {
		        //            x += 1;
		        //        };
		        x = newx;
		        y = newy;
		        if (y < 0) y = 0;
		        if (x < 0) x = 0;
		        if (y > 9) y =9 ;
		        if (x > 29) x = 29;
	
        return (prevX != x || prevY != y) ? true : false;
    };

    var draw = function(ctx) {
	
	if(img == undefined && imgUrl != undefined){
		img = new Image();   // Create new img ele.ment  
	    img.src = imgUrl;//"imgUrl"""; // Set source path
		img.onload = function(){  
		  ctx.drawImage(img, real_x, real_y, 80, 60)
		};  

	}else if(img != undefined)
	  {
		 ctx.drawImage(img, real_x, real_y,80,60)
	  }
	}
    // Draw player
   // var draw = function (ctx) {
     //   ctx.fillRect(real_x, real_y, 64,48);
    //};

    // Define which variables and methods can be accessed
    return {
        setRealX: setRealX,
        setRealY: setRealY,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
		getImg: getImg,
		setImg: setImg,
		getName: getName,
		setName: setName,
        update: update,
        draw: draw
    }
};