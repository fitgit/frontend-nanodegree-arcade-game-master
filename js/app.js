//global constants
var frameWidth=100;
var frameHeight=80;

// Enemies our player must avoid
var Enemy = function(row,speed,stagger) { //the stone row for enemy, the speed increment the frame, delay to start execution.
    
    this.x=0;
    this.y=0;
    this.row=row;    
    this.stagger=stagger;
    this.speed=speed;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
     
     this.y=this.row*frameHeight; //1 row(0th is water)
    if (this.x >= 505){ //reset - not sure if I can use the canvas.width from Engine
        this.x=0 +frameHeight *dt;
    } else {
        //adding stagger start logic.
        //first row, starts with 0 delay,2 with 25 frames and the 3 is delayed by 50 frames.
        if ( this.x >= this.stagger) { 
            this.x+=frameWidth*dt + this.speed;
            //console.log("in action,x=" + this.x + " y= " + this.y);
        } else 
             this.x++;
    }
   
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function(level){
    this.sprite='images/char-cat-girl.png';
    this.x=2*frameWidth;
    this.y=5*frameHeight;
    this.score=0;
    this.level=level;
}

Player.prototype.update=function(dt){
    if (this.level === 0){
        this.score+=50;    //50 points on a win at first level
   } else if (this.level === 1){
         this.score+=100;  //100 points on a win at first level
   }else if (level ===2){
         this.score+=200;  //200 points on a win at first level
   }
}

Player.prototype.render=function(){
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput=function(key){
    
    console.log("key=" + key);
    if (key === 'up'){
        this.y-=frameHeight;
    } else if (key === 'down'){
        this.y+=frameHeight;
    }else if (key === 'left'){
        this.x-=frameWidth
    } else if (key === 'right'){
        this.x+=frameWidth
    }
      console.log("player:x=" + this.x + " player.y=" + this.y);
}
var allEnemies=[];

var enemyTop=new Enemy(1,0,0); //runs on stone row1, normal speed,with no delay
allEnemies.push(enemyTop);
var enemyMiddle=new Enemy(2,5,25);//run on stone row2, 5pix/sec,delay of 25 pix/sec
var enemyBottom=new Enemy(3,10,50);//run on stone row3, 10pix/sec,delay of 50pix/sec
allEnemies.push(enemyMiddle);
allEnemies.push(enemyBottom);

var player=new Player(0);
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
