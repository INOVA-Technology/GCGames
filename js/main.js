var languages = {
	"english": {
		health: "Health",
		play: "Play",
		died: "died"
	},
	"spanish": {
		health: "Salud",
		play: "Jugar",
		died: "muerto"
	},
	"french": {
		health: "Santé",
		play: "Jouer",
		died: "mort"
	}
}
var go = false,
	lang = "english",
	rect;

document.getElementById('lang').addEventListener('change', function() {
	lang = this.value;
	if (!go) {
		menu();
	}
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

// fire image
var fireReady = false;
var fireImage = new Image();
fireImage.onload = function () {
	fireReady = true;
};
fireImage.src = "images/blue fire2.png";

// block for chase image
var shieldReady = false;
var shieldImage = new Image();
shieldImage.onload = function () {
	shieldReady = true;
};
shieldImage.src = "images/shieldRight.png";

// Game objects
var garrett = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0,
	width: 60,
	height: 60,
	health: 100,
	isFiring: false,
	isDead: false,
	fire: {
	    speed: 300,
	    x: 0,
	    y: 0,
	    width: 30,
	    height: 30,
	    damage: 10
	}
},
	chase = {
		speed: 256,
		x: 0,
		y: 0,
		width: 60,
		height: 60,
		health: 100,
		isFiring: false,
		isDead: false,
		fire: {
		    speed: 300,
		    x: 0,
		    y: 0,
		    width: 30,
		    height: 30,
		    damage: 10
		}
	},

	heightFromGround = garrett.height + 1;

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

	if (e.keyCode === 69 && go && fireReady) {
        firefunction(garrett);
	}

	if (e.keyCode === 16 && go && fireReady) {
		firefunction(chase);
	}

	if (e.keyCode === 81 && go && shieldReady) {
        garrettShield();
	}
}, false);

var die = function(guy) {
	name = (guy === garrett) ? "Garrett" : "Chase";
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	rect1 = {
	    x: 32,
	    y: 32,
	    w: 70,
	    h: 30
	};
	ctx.fillText(name + " " + languages[lang]["died"], rect1.x, rect1.y + 16);
}

var garrettShield = function() {
    console.log("working");
    if (shieldReady) {
    ctx.drawImage(shieldImage, garrett.x, garrett.y);
    console.log("drawn");
    }
}


var firefunction = function (player) {
	if (!player.isFiring) {
		player.fire.x = player.x;
		player.fire.y = player.y;
		player.isFiring = true;
		enemy = (player === garrett) ? chase : garrett;
		var i = setInterval(function() {
			//Hit? Maybe. Dead? idk
			if (player === garrett) {
				player.fire.x += 25;
				if (player.fire.x + player.fire.width >= enemy.x && player.fire.y + player.fire.height >= enemy.y && player.fire.y <= enemy.y + enemy.height) {
					clearInterval(i);
					player.isFiring = false;
			        enemy.health -= player.fire.damage;
				} else if (player.fire.x + player.fire.width >= canvas.width) {
					clearInterval(i);
					player.isFiring = false;
				}
			} else {
				player.fire.x -= 25;
				if (player.fire.x <= enemy.x + enemy.width && player.fire.y + player.fire.height >= enemy.y && player.fire.y <= enemy.y + enemy.height) {
					clearInterval(i);
					player.isFiring = false;
					enemy.health -= player.fire.damage;
				} else if (player.fire.x <= 0) {
					clearInterval(i);
					player.isFiring = false;
				}
			}
	        if (enemy.health <= 0) {
	        	enemy.isDead = true;
	        }
		}, 25);
	}
}

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

var menu = function () {

	ctx.clearRect (0 , 0 , canvas.width , canvas.height);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	rect = {
	    x: 32,
	    y: 32,
	    w: 70,
	    h: 30
	};
	ctx.fillText(languages[lang]["play"], rect.x, rect.y + 16);    
}

canvas.addEventListener('click', checkStart, false);
	function checkStart(e) {
        var p = getMousePos(e);

        if (p.x >= rect.x && p.x <= rect.x + rect.w &&
            p.y >= rect.y && p.y <= rect.y + rect.h) {
            
            go = !go;
            if (go) {
            	// Let's play this game!
            	var main = function () {
					var now = Date.now();
					var delta = now - then;

					if (garrett.isDead) {
	            		die(garrett);
	            	} else if (chase.isDead) {
	            		die(chase);
	            	} else {
						update(delta / 1000);
						render();

						then = now;
					}
				};
                reset();

				var then = Date.now();
				setInterval(main, 1); // Execute as fast as possible
				
            }
        }
    }

        function getMousePos(e) {
            var r = canvas.getBoundingClientRect();
            return {
                x: e.clientX - r.left,
                y: e.clientY - r.top
            };
        }

// Draw game
var render = function () {
	
	ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );

	if (garrettReady) {
		ctx.drawImage(garrettImage, garrett.x, garrett.y);
	}

	if (chaseReady) {
		ctx.drawImage(chaseImage, chase.x, chase.y);
	}

	if (garrett.isFiring) {
		ctx.drawImage(fireImage, garrett.fire.x, garrett.fire.y);
	}

	if (chase.isFiring) {
		ctx.drawImage(fireImage, chase.fire.x, chase.fire.y);
	}

	// Health
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Garrett's " + languages[lang]["health"] + ": " + garrett.health, 32, 32);
	ctx.textAlign = "right";
	ctx.fillText("Chase's " + languages[lang]["health"] + ": " + chase.health, canvas.width - 32, 32);
};

// Let's play this game!
menu();
