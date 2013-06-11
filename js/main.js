//Set up canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Chase image
var chaseReady = false;
var chaseImage = new Image();
chaseImage.onload = function () {
	chaseReady = true;
};
chaseImage.src = "images/chase.png";

// Garrett image
var garrettReady = false;
var garrettImage = new Image();
garrettImage.onload = function () {
	garrettReady = true;
};
garrettImage.src = "images/garrett.png";

// Game objects
var chase = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var garrett = {
	x: 0,
	y: 0
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var reset = function() {
    chase.x = canvas.width / 2 - 40;
    chase.y =canvas.height / 2;

    garrett.x = canvas.width / 2 + 40;
    garrett.y = canvas.height / 2;
};

// Update game objects
var update = function (modifier) {
	
	/*
	if (38 in keysDown) { // Player holding up
		chase.y -= chase.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		chase.y += chase.speed * modifier;
	}
	*/

	if (37 in keysDown) { // Player holding left
		chase.x -= chase.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		chase.x += chase.speed * modifier;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (chaseReady) {
		ctx.drawImage(chaseImage, chase.x, chase.y);
	}

	if (garrettReady) {
		ctx.drawImage(garrettImage, garrett.x, garrett.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
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