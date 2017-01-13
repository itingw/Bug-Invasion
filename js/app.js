// Global Variables
var grid_width = 707;
var grid_height = 747;

//generate x coordinates for grid
var x_coord = [],
    columns = grid_width / 101;
var x_step = grid_width / columns;
for (var i = 0; i < columns; i++) {
    x_coord[i] = i * x_step;
}

//generate y coordinates for grid
var y_coord = [],
    rows = 9;
var y_step = grid_height / rows;
for (var i = 0; i < rows; i++) {
    y_coord[i] = -41.5 + (i * 83);
}

//player start locations
var player_start_X = x_coord[3];
var player_start_Y = y_coord[8];

//player location convert to coordinates
var player_x_coord, player_y_coord, pad_coord_x, pad_coord_y;

// Random Integer Generator
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.width = 90;
    this.height = 50;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //give it a random speed
    this.speed = Math.random() * (200) + 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x > grid_width) {
        this.x = 0;
        this.speed = Math.random() * (200) + 100;
    } else {
        this.x = this.x + this.speed * dt;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log("enemy- x: ", this.x, "y: ", this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.lives = 5;
    //normal state = 0, invincible state =1
    this.state = 0;
    //levels of the game
    this.level = 1;
    //choosing background for level
    this.boardtype = 1;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.winning = 0;
};

//collision with bug = death, collision with heart = lives + 1, star = invincible!
Player.prototype.checkCollisions = function() {
    if (this.state === 0) {
        for (var i = 0; i < allEnemies.length; i++) {
            if (this.x < allEnemies[i].x + allEnemies[i].width &&
                this.x + this.width > allEnemies[i].x &&
                this.y < allEnemies[i].y + allEnemies[i].height &&
                this.y + this.height > allEnemies[i].y) {
                this.death();
                // console.log("COLLISION!")
            }
        }
    }

    for (var i = 0; i < allItems.length; i++) {
        if (this.x === allItems[i].x &&
            this.y === allItems[i].y) {
            // console.log("ITEM!: ", allItems[i].type);

            if (allItems[i].type == "heart") {
                this.lives += 1;
            }
            if (allItems[i].type == "star") {
                this.state = 1;
                this.sprite = "images/star.png";
            }
            if (allItems[i].type == "key") {
                //  console.log("TELEPORT ME");
                this.teleport();
            }
            allItems.splice(i, 1);
        }
    }
};
Player.prototype.refresh = function() {
    this.x = player_start_X;
    this.y = player_start_Y;
    this.state = 0;
    this.sprite = "images/char-boy.png"
}

Player.prototype.teleport = function() {
    this.x = teleportation[0].x;
    this.y = teleportation[0].y;
}

//when the player dies, start the level over. refresh the game after lives = 0
Player.prototype.death = function() {
    if (this.lives > 0) {
        this.lives -= 1;
        // console.log("lives: ", this.lives);
        player.refresh();
    }
    if (this.lives === 0) {
        allEnemies = [];
        allItems = [];
        teleportation = [];
    }
    player.refresh();
}

//player reaches the end of the board, level + 1
Player.prototype.win = function() {

    this.level += 1;
    player.refresh();
    //add a new enemy for each level
    spawnEnemies();
    //pick a new background type
    this.boardtype = getRandomInt(1, 11);
    console.log("board no: ", player.boardtype);
    this.winning = 1;
    ctx.clearRect(0, 0, 707, 835);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x;
    this.y = this.y;
}

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.checkCollisions();
}


//check whether there is an obstacle in the player's way
checkBlockedarea = function(dir) {
    //calculate the player's coordinates
    player_x_coord = player.x / x_step;
    player_y_coord = (player.y / y_step) - 0.5;

    var checked_sq;
    //use player's coordinates and direction to check blocked areas matrix
    switch (dir) {
        case 'left':
            checked_sq = blockedareasgrid[player_y_coord + 1][player_x_coord - 1];
            // console.log("left_square: ", checked_sq);
            if (checked_sq === 0) {
                return false;
            } else {
                return true;
            }
            break;
        case 'right':
            checked_sq = blockedareasgrid[player_y_coord + 1][player_x_coord + 1];
            // console.log("right_square: ", checked_sq);
            if (checked_sq === 0) {
                return false;
            } else {
                return true;
            }
            break;
        case 'down':
            checked_sq = blockedareasgrid[player_y_coord + 2][player_x_coord];
            // console.log("below_square: ", checked_sq);
            if (checked_sq === 0) {
                return false;
            } else {
                return true;
            }
            break;
        case 'up':
            checked_sq = blockedareasgrid[player_y_coord][player_x_coord];
            // console.log("above_square: ", checked_sq);
            if (checked_sq === 0) {
                return false;
            } else {
                return true;
            }
            break;
    }
}

Player.prototype.handleInput = function(key) {
    var blocked = checkBlockedarea(key);

    switch (key) {
        case 'left':
            if (this.x > x_coord[0] && blocked === false) {
                this.x -= x_step;
            }
            break;
        case 'right':
            if (this.x < x_coord[columns - 1] && blocked === false) {
                this.x += x_step;
            }
            break;
        case 'down':
            if (this.y < y_coord[rows - 1] && blocked === false) {
                this.y += y_step;
            }
            break;
        case 'up':
            if (this.y > y_coord[0] && blocked === false) {
                this.y -= y_step;
            }
            if (this.y === y_coord[0]) {
                player.win();
            }
            break;
    }
    // console.log("player", this.x, this.y);
}

//create obstacles based on blocked areas matrix
var Blockedarea = function(x, y, type) {
    this.x = x;
    this.y = y;

    switch (type) {
        case "tree-short":
            this.sprite = 'images/tree-short.png';
            break;
        case "tree-tall":
            this.sprite = 'images/tree-tall.png';
            break;
        case "tree-ugly":
            this.sprite = 'images/tree-ugly.png';
            break;
        case "rock":
            this.sprite = 'images/rock.png';
            break;
        case "wall-tall":
            this.sprite = 'images/wall-block-tall.png';
            break;
        case "wall-short":
            this.sprite = 'images/wall-block-short.png';
            break;
        case "window":
            this.sprite = 'images/window-tall.png';
            break;
        case "water":
            this.sprite = 'images/water-block.png';
            break;
        case "stone-block-tall":
            this.sprite = 'images/stone-block-tall.png';
            break;
    }
};

//render the obstacles
Blockedarea.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), x_coord[this.x], y_coord[this.y]);
}

//create new item
var Item = function(x, y) {
    this.x = x;
    this.y = y;
    this.type = "";
    //pick a random item type
    switch (getRandomInt(0, 3)) {
        case 0:
            this.sprite = 'images/heart.png';
            this.type = "heart";
            break;
        case 1:
            this.sprite = 'images/star.png';
            this.type = "star";
            break;
        case 2:
            this.sprite = 'images/key.png';
            this.type = "key";
    }
}

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Pad = function() {
    this.x = x_coord[getRandomInt(0, 6)];
    this.y = y_coord[getRandomInt(1, 3)];
    this.sprite = 'images/selector.png';

    pad_coord_x = (this.x / x_step);
    pad_coord_y = (this.y / y_step) + 0.5;

    // console.log("original:", pad_coord_x, pad_coord_y);
    // console.log(blockedareasgrid);

    while (blockedareasgrid[pad_coord_y][pad_coord_x] !== 0) {
        this.x = x_coord[getRandomInt(0, 6)];
        this.y = y_coord[getRandomInt(1, 3)];
        pad_coord_x = (this.x / x_step);
        pad_coord_y = (this.y / y_step) + 0.5;
        // console.log("new: ", this.x, this.y);
    }
}

Pad.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//display the # lives and level
function infodisplay() {
    ctx.clearRect(0, 0, 1010, 45);
    ctx.font = '15pt Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Level: ' + player.level, 0, 30);
    var heart_w = 25;
    var heart_h = 40;
    for (var i = 0; i < player.lives; i++) {
        ctx.drawImage(Resources.get('images/heart.png'), 100 + (i * heart_w), 2, heart_w, heart_h);
    }
    // ctx.fillText('Lives: ' + player.lives, 200, 30);
}

//add new enemies
function spawnEnemies() {
    for (var i = 0; i <= player.level; i++) {
        i = new Enemy(x_coord[0], y_coord[getRandomInt(1, 7)]);
        allEnemies.push(i);
    }
}

function refreshItems() {

    allItems = [];
    teleportation = [];
    for (var i = 0; i < getRandomInt(1, player.level); i++) {
        var item_x = getRandomInt(0, 6);
        var item_y = getRandomInt(1, 8);

        if (blockedareasgrid[item_y][item_x] === 0) {
            t = new Item(x_coord[item_x], y_coord[item_y]);
            allItems.push(t);
            if (t.type === "key" && teleportation.length === 0) {
                var pad = new Pad();
                teleportation.push(pad);
            }
        }
    }
    // console.log("no. items: ", allItems.length);
    // console.log(teleportation);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//Create items
var allItems = [];

// Place the player object in a variable called player
var player = new Player(player_start_X, player_start_Y);

// Create blocked areas
//this one is the array for rendering each blocked area object
var allBlockedareas = [];
//this one is the grid of each object
var blockedareasgrid = [];

var teleportation = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        // 32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
