var languages = {
	"english": {
		health: "Health"
	},
	"spanish": {
		health: "Salud"
	},
	"french": {
		health: "Santé"
	}
}

var lang = "english";
document.getElementById('lang').addEventListener('change', function() {
	lang = this.value;
}, false);

function collide(object1, object2) {
	if (object1.x + object1.width >= object2.x && object1.x + object1.width <= object2.x + object2.width / 2) {
			return "right";
	}
}

//Set up canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 336;

// garrett image
var garrettReady = false;
var garrettImage = new Image();
garrettImage.onload = function () {
	garrettReady = true;
};
garrettImage.src = "images/garrett.png";

// chase image
var chaseReady = false;
var chaseImage = new Image();
chaseImage.onload = function () {
	chaseReady = true;
};
chaseImage.src = "images/chase.png";

// Game objects
var garrett = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0,
	width: 60,
	height: 60
};
var chase = {
	speed: 256,
	x: 0,
	y: 0,
	width: 60,
	height: 60
};

heightFromGround = garrett.height + 8;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if (e.keyCode == 87 || e.keyCode == 38) {

		// this is a ternaery if statement below aka. Conditional Operator
		// more info here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
		player = (e.keyCode === 87) ? garrett : chase,
		jump(player);
	}
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function jump(player) {
	var jumpTime = 400,
	height = 20, // the higher the height is, the lower the jump is.
	intervals = 15, // make this higher for a smoother jump
	i;

	if (player.y == canvas.height - heightFromGround) {

		var i = setInterval( function() {
			player.y -= player.speed / height;
		}, jumpTime / intervals);

		setTimeout(function() {
			clearInterval(i);
		}, jumpTime);

		setTimeout(function() {
			var i1 = setInterval( function() {
				player.y += player.speed / height;
				if ( player.y >= canvas.height - heightFromGround) {
					clearInterval(i1);
					player.y == 8;
				}
			}, jumpTime / intervals);
		}, jumpTime);
	}
}

var reset = function() {
    garrett.x = canvas.width / 2 - 40;
    garrett.y = canvas.height - heightFromGround;

    chase.x = canvas.width / 2 + 40;
    chase.y = canvas.height - heightFromGround;
};

// Update game objects
var update = function (modifier) {
	
	
	if (65 in keysDown) { // Player holding left
		if (garrett.x > 0) {
			garrett.x -= garrett.speed * modifier;
		}
	}
	if (68 in keysDown) { // Player holding right
		if (garrett.x < canvas.width - garrett.width && !(collide(garrett, chase) === "right")) {
			garrett.x += garrett.speed * modifier;
		}
	}

	if (37 in keysDown) { // Player holding left
		if (chase.x > 0 && !(collide(garrett, chase) === "right")) {
			chase.x -= chase.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if (chase.x < canvas.width - chase.width) {
			chase.x += chase.speed * modifier;
		}
	}
};

// Draw everything
var render = function () {
	
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );

	if (garrettReady) {
		ctx.drawImage(garrettImage, garrett.x, garrett.y);
	}

	if (chaseReady) {
		ctx.drawImage(chaseImage, chase.x, chase.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(languages[lang]["health"] + ":", 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible