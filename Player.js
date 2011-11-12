var Player = function(startX, startY, nameBot) {
	
	var imgUrl;
	
    var x = startX,
        y = startY,
        id
		name = nameBot;

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

    var getName= function() {
        return name;
    };
    var setName = function(newName) {
        name = newName;
    };



    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
		getImg: getImg,
		setImg: setImg,
		getName: getName,
		setName: setName,
        id: id

    }
};

exports.Player = Player;