/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	
	var imgUrl;
    var x = startX,
        y = startY,
        id,
        moveAmount = 2;
	var img;
	var name;

    var getX = function() {
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

    var update = function(keys) {
        var prevX = x,
            prevY = y;
        // Up key takes priority over down
        if (keys.up) {
            y -= moveAmount;
        } else if (keys.down) {
            y += moveAmount;
        };

        // Left key takes priority over right
        if (keys.left) {
            x -= moveAmount;
        } else if (keys.right) {
            x += moveAmount;
        };

        return (prevX != x || prevY != y) ? true : false;
    };

    var draw = function(ctx) {
	
	if(img == undefined && imgUrl != undefined){
		img = new Image();   // Create new img ele.ment  
	    img.src = imgUrl;//"imgUrl"""; // Set source path
		img.onload = function(){  
		  ctx.drawImage(img, x, y, 80, 60)
		};  

	}else if(img != undefined)
	{
		 ctx.drawImage(img, x, y,80,60)
	}

}

    return {
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