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
 /* global variable to set the player's level */
 
var gameLevel=0;
/* called from HTML when the user choses the level, set the player's level*/
function setLevel(){
        "use strict";
        var selector=document.getElementById('levelSelect');
        gameLevel=parseInt(selector.value);
        player.setLevel(gameLevel);
    }

var Engine = (function(global) {
    "use strict";
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
     //isCollision is a boolean, stating if collision occured or not.
     //hasScored is a boolean, stating if the player made it to other side.
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,isCollision=false,hasScored=false;

    canvas.width = 505;
    canvas.height = 606;
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

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /*if collided with enemy or crossed safely(hasScored),display score and exit*/
        if (isCollision || hasScored){
            var score=doc.getElementById('score');
            console.log("game End: player.score" + player.score);
            score.value=player.score;
            return;
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
        reset();
        //one time creation of  enemies and player objects.
        entitiesInit(gameLevel);
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
    function update(dt){
        updateEntities(dt); 
    }
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        /* detect if the player collided with enemy*/
        collisionDetect();
        /* if not collision, check if player won(crossed over safely)*/
        if (!isCollision){
            hasScored=scoreDetect();
        }
    }
    //check if the player corssed over safely(won) and update the scores based on the level
    //levels are used  for computing the scores and increase the challenge level to cross the stone rows.
    function scoreDetect(){
        if (player.y === 0){
            player.update(0);
            return true;
        }
    }
    /* function to detect if the enemy and player collided.
     * Goes thro every enemy in the allEnemies array and checks if the player's co-ordinates match with the enemy .
     * i,e check if the enemy.x is in the range of the player and player +100(player's frameWidth) and has the same y coordinate as player
     */
    function collisionDetect(){
        //console.log("CollisionDetect: player.x=" + player.x + " player.y= " + player.y);
        allEnemies.forEach(function(enemy) {
            //console.log("CollisionDetect:enemy.x=" + Math.floor(enemy.x) + " enemy.y= " + Math.floor(enemy.y) );
            if ( (Math.floor(enemy.x) > player.x ) && (Math.floor(enemy.x) < player.x +100) && (player.y === Math.floor(enemy.y) )){
                console.log("CollisionDetect:DETECTED!!!" );
                isCollision=true;
                return;
            }
        });
    }
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        //console.log("render:isCollision=" +isCollision);
        //if collision detected, draw gameOver in the canvas
        //if hasScored(reached the other side safely),draw you win image.
        if (isCollision){
            console.log("drawing gameOver");
            ctx.drawImage(Resources.get('images/gameOver.jpg'),160,240,184,123);
        } else if (hasScored){
            console.log("drawing You scored!!");
            ctx.drawImage(Resources.get('images/youWin.jpg'),0,240,500,100);
        } else {
            renderEntities();
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-cat-girl.png',
        'images/gameOver.jpg',
        'images/youWin.jpg'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
