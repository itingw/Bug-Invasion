/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var start = 0;
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    var numRows = 9,
        numCols = 7,
        row, col;

    console.log("start", start);

    canvas.width = 707;
    canvas.height = 835;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/
         functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        if (player.winning === 1) {
            player.winning = 0;
            refreshItems();

        }


        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }




    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }



    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    //draws the obstacles on the board
    function drawWalls() {
        // console.log("drawWalls");
        var r = "rock";
        var s = "tree-short";
        var t = "tree-tall";
        var u = "tree-ugly";
        var w = "wall-tall";
        var b = "wall-short";
        var d = "window";
        var h = "water";
        var o = "stone-block-tall"
        var x = 0;

        allBlockedareas = [];
        blockedareasgrid = [];

        function getBlockedareas() {
            // console.log("get blocked areas");
            //read grid and add new obstacles to board
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    if (blockedareasgrid[row][col] != x) {
                        allBlockedareas.push(new Blockedarea(col, row, blockedareasgrid[row][col]));
                    }
                }
            }
        }
        if (player.boardtype === 1) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, x, x, x, x, x], // row 2
                [x, s, x, x, x, s, x], // row 3
                [x, x, x, x, x, x, x], // row 4
                [x, s, x, x, x, s, x], // row 5
                [x, x, x, x, x, x, x], // row 6
                [x, s, x, x, x, s, x], // row 7
                [x, r, x, x, x, r, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 2) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, x, x, x, x, x], // row 2
                [x, x, x, x, x, x, x], // row 3
                [w, d, w, x, w, d, w], // row 4
                [x, x, x, x, x, x, x], // row 5
                [x, x, x, x, b, b, x], // row 6
                [x, x, x, x, b, x, x], // row 7
                [b, b, x, x, b, x, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
            ctx.drawImage(Resources.get('images/door-tall-open.png'), x_coord[3], y_coord[3]);
        }
        if (player.boardtype === 3) {

            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, x, x, x, x, x], // row 2
                [r, r, x, r, s, r, x], // row 3
                [s, u, x, r, t, x, x], // row 4
                [s, x, x, r, t, x, r], // row 5
                [u, x, u, s, x, x, s], // row 6
                [t, x, x, x, x, s, r], // row 7
                [u, s, u, x, t, u, t], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 4) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [r, r, r, r, x, x, x], // row 2
                [b, b, b, r, r, x, r], // row 3
                [x, x, b, x, x, x, r], // row 4
                [x, x, x, x, x, r, r], // row 5
                [r, x, b, x, r, r, x], // row 6
                [b, x, x, x, x, x, x], // row 7
                [b, x, b, r, r, x, r], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 5) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [r, r, r, x, r, r, x], // row 2
                [s, t, s, x, s, u, x], // row 3
                [u, t, x, x, u, u, x], // row 4
                [t, t, s, x, x, x, x], // row 5
                [s, s, x, x, r, s, u], // row 6
                [u, x, x, x, x, u, x], // row 7
                [t, s, r, x, x, x, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 6) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, r, r, r, x, x], // row 2
                [b, x, b, b, b, x, b], // row 3
                [b, x, x, b, x, x, x], // row 4
                [x, x, x, b, x, b, b], // row 5
                [x, b, b, b, x, x, b], // row 6
                [x, b, x, x, x, x, x], // row 7
                [x, x, b, x, b, b, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 7) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [b, b, b, x, x, x, b], // row 2
                [b, b, b, b, x, x, b], // row 3
                [b, b, x, x, x, b, b], // row 4
                [b, b, b, x, x, x, b], // row 5
                [b, b, x, x, x, b, b], // row 6
                [b, b, b, x, x, x, b], // row 7
                [b, b, b, b, x, b, b], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 8) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, x, x, r, r, r], // row 2
                [x, x, x, r, r, r, r], // row 3
                [x, x, x, u, s, r, r], // row 4
                [r, x, x, x, x, x, x], // row 5
                [t, s, s, x, s, u, u], // row 6
                [r, r, r, x, r, r, r], // row 7
                [x, x, x, x, x, x, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 9) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, x, x, x, x, x], // row 2
                [r, x, x, b, r, x, r], // row 3
                [r, x, x, b, r, x, r], // row 4
                [x, x, x, b, r, x, r], // row 5
                [b, b, x, b, r, x, r], // row 6
                [s, t, x, x, u, x, r], // row 7
                [u, u, x, x, t, x, r], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        if (player.boardtype === 10) {
            blockedareasgrid = [
                [x, x, x, x, x, x, x], // row 1
                [x, x, b, b, b, x, x], // row 2
                [b, x, x, x, x, x, x], // row 3
                [b, x, b, b, x, b, b], // row 4
                [b, x, x, b, x, b, x], // row 5
                [x, x, x, b, x, x, x], // row 6
                [b, b, x, x, x, b, x], // row 7
                [b, x, x, b, b, b, x], // row 8
                [x, x, x, x, x, x, x] // row 9
            ];
        }
        getBlockedareas();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // console.log("render");
        var s = 'images/stone-block.png';
        var g = 'images/grass-block.png';
        var w = 'images/water-block.png';
        var d = 'images/dirt-block.png';
        var f = 'images/wood-block.png';
        var b = 'images/wall-block-tall.png';
        var o = 'images/door-tall-open.png';
        var t = 'images/window-tall.png';

        var boardlayout = [];
        if (player.boardtype === 1) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [s, s, s, s, s, s, s], // row 2
                [g, g, s, s, s, g, g], // row 3
                [g, g, s, s, s, g, g], // row 4
                [g, g, s, s, s, g, g], // row 5
                [g, g, s, s, s, g, g], // row 6
                [g, g, s, s, s, g, g], // row 7
                [g, g, s, s, s, g, g], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 2) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [g, g, s, s, s, g, g], // row 2
                [g, g, s, s, s, g, g], // row 3
                [f, f, f, f, f, f, f], // row 4
                [f, f, f, f, f, f, f], // row 5
                [f, f, f, f, f, f, f], // row 6
                [f, f, f, f, f, f, f], // row 7
                [f, f, f, f, f, f, f], // row 8
                [f, f, f, f, f, f, f] // row 9
            ];
        }
        if (player.boardtype === 3) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [d, d, d, d, d, d, d], // row 2
                [g, g, d, g, g, g, d], // row 3
                [g, g, d, g, g, d, d], // row 4
                [g, d, d, g, g, d, g], // row 5
                [g, d, g, g, d, d, g], // row 6
                [g, d, d, d, d, g, g], // row 7
                [g, g, g, d, g, g, g], // row 8
                [d, d, d, d, d, d, d] // row 9
            ];
        }
        if (player.boardtype === 4) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [w, w, w, w, s, s, s], // row 2
                [w, w, w, w, w, s, w], // row 3
                [s, s, w, s, s, s, w], // row 4
                [s, s, s, s, s, w, w], // row 5
                [w, s, w, s, w, w, s], // row 6
                [w, s, s, s, s, s, s], // row 7
                [w, s, w, w, w, s, w], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 5) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [g, g, g, d, g, g, d], // row 2
                [g, g, g, d, g, g, d], // row 3
                [g, g, d, d, g, g, d], // row 4
                [g, g, g, d, d, d, d], // row 5
                [g, g, d, d, g, g, g], // row 6
                [g, d, d, d, d, g, d], // row 7
                [g, g, g, d, d, d, d], // row 8
                [d, d, d, d, d, d, d] // row 9
            ];
        }
        if (player.boardtype === 6) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [s, s, w, w, w, s, s], // row 2
                [s, s, s, s, s, s, s], // row 3
                [s, s, s, s, s, s, s], // row 4
                [s, s, s, s, s, s, s], // row 5
                [s, s, s, s, s, s, s], // row 6
                [s, s, s, s, s, s, s], // row 7
                [s, s, s, s, s, s, s], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 7) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [s, s, s, s, s, s, s], // row 2
                [s, s, s, s, s, s, s], // row 3
                [s, s, s, s, s, s, s], // row 4
                [s, s, s, s, s, s, s], // row 5
                [s, s, s, s, s, s, s], // row 6
                [s, s, s, s, s, s, s], // row 7
                [s, s, s, s, s, s, s], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 8) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [s, s, s, s, w, w, w], // row 2
                [g, s, g, w, w, w, w], // row 3
                [g, s, g, g, g, w, w], // row 4
                [g, s, s, s, g, g, g], // row 5
                [g, g, g, s, g, g, g], // row 6
                [w, w, w, s, w, w, w], // row 7
                [g, g, g, s, g, g, g], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 9) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [s, s, s, f, f, f, f], // row 2
                [w, s, g, s, w, f, w], // row 3
                [w, s, g, g, w, f, w], // row 4
                [s, s, s, s, w, f, w], // row 5
                [g, g, s, s, w, f, w], // row 6
                [g, g, s, s, g, f, w], // row 7
                [g, g, s, s, g, f, w], // row 8
                [s, s, s, s, s, s, s] // row 9
            ];
        }
        if (player.boardtype === 10) {
            boardlayout = [
                [w, w, w, w, w, w, w], // row 1
                [f, f, f, f, f, f, f], // row 2
                [f, f, f, f, f, f, f], // row 3
                [f, f, f, f, f, f, f], // row 4
                [f, f, f, f, f, f, f], // row 5
                [f, f, f, f, f, f, f], // row 6
                [f, f, f, f, f, f, f], // row 7
                [f, f, f, f, f, f, f], // row 8
                [f, f, f, f, f, f, f] // row 9
            ];

        }
        //
        // /* Loop through the number of rows and columns we've defined above
        //  * and, using the rowImages array, draw the correct image for that
        //  * portion of the "grid"
        //  */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(boardlayout[row][col]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */

    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        // console.log("render entities");
        if (start === 0) {
            //show instructions
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.75;
            ctx.fillRect(0, 0, 707, 835);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.font = "bold 30pt Arial"
            ctx.fillText("How to Play:", 250, 115);
            ctx.font = "25pt Arial"
            ctx.fillText("  Use arrow keys", 100, 220);
            ctx.fillText("  Avoid these:", 100, 320);
            ctx.drawImage(Resources.get("images/enemy-bug.png"), 365, 200);
            ctx.fillText("  Get powerups:", 100, 420);
            ctx.font = "15pt Arial"
            ctx.drawImage(Resources.get("images/heart.png"), 150, 415);
            ctx.fillText("Extra Life!", 155, 600);
            ctx.drawImage(Resources.get("images/"), 305, 415);
            ctx.fillText("Invincibility!", 305, 600);
            ctx.drawImage(Resources.get("images/key.png"), 455, 415);
            ctx.fillText("Teleportation!", 455, 600);
            ctx.font = "20pt Arial"
            ctx.fillText("Press any key to start!", 220, 700);
        }
        //play game!
        if (player.lives > 0 && start === 1) {
            infodisplay();
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });
            allBlockedareas.forEach(function(blockedarea) {
                blockedarea.render();
            });
            teleportation.forEach(function(pad) {
                pad.render();
            });
            drawWalls();
            allItems.forEach(function(item) {
                item.render();
            });
            player.render();
        }
        //game over
        if (player.lives === 0) {
            ctx.clearRect(0, 0, 1010, 45);
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(150, 340, 400, 175);

            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.font = "bold 20pt Arial";
            if (player.level <= 5) {
                ctx.fillText("You only made it to level", 170, 390);
                ctx.fillText(player.level, 495, 390);
                ctx.font = "18pt Arial";
                ctx.fillText("You can do better than that!", 195, 435);
            }
            if (player.level <= 10 && player.level > 5) {
                ctx.fillText("You made it to level", 210, 390);
                ctx.fillText(player.level, 470, 390);
                ctx.font = "18pt Arial";
                ctx.fillText("Not Bad! But not great!", 230, 435);
            }
            if (player.level > 10 && player.level < 15) {
                ctx.fillText("Wow! You made it to level", 168, 390);
                ctx.fillText(player.level, 500, 390);
                ctx.font = "18pt Arial";
                ctx.fillText("You're pretty good!", 240, 435);
            }
            if (player.level >= 15) {
                ctx.fillText("Wow! You made it to level", 168, 390);
                ctx.fillText(player.level, 500, 390);
                ctx.font = "18pt Arial";
                ctx.fillText("How did you do that!", 240, 435);
            }
            ctx.strokeStyle = "white";
            ctx.strokeRect(220, 465, 250, 30);
            ctx.font = "14pt Arial";
            ctx.fillText("Press   Space   to Restart", 240, 485);
        }
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/dirt-block.png',
        'images/wood-block.png',
        'images/window-tall.png',
        'images/wall-block-tall.png',
        'images/wall-block-short.png',
        'images/door-tall-open.png',
        'images/brown-block.png',
        'images/tree-short.png',
        'images/tree-tall.png',
        'images/tree-ugly.png',
        'images/rock.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/heart.png',
        'images/Star.png',
        'images/key.png',
        'images/Selector.png',
        'images/stone-block-tall.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

//when the game is over, press 'space'. this function restarts the game
GameRestartInput = function(key) {
    start = 1;
    if (key === 'space') {
        player.lives = 5;
        player.level = 1;
        player.boardtype = 1;
        player.x = player_start_X;
        player.y = player_start_Y;
        ctx.clearRect(0, 0, 707, 835);
    }

}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space'
    };

    if (player.lives === 0 || start === 0) {
        GameRestartInput(allowedKeys[e.keyCode]);
    }
});
