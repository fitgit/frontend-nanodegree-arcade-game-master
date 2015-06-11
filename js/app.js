
//global constants
var frameWidth=100;
var frameHeight=80;

// Enemies our player must avoid
var Enemy = function(row,speed,stagger) { //the stone row for enemy, the speed to increment the frame, delay to start execution.
    "use strict";
    this.x=0;
    this.y=0;
    this.row=row;    
    this.stagger=stagger;
    this.speed=speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    "use strict";
    this.y=this.row*frameHeight; //1 row(0th is water)
    if (this.x >= 505){ //reset - not sure if I can use the canvas.width from Engine
        this.x=0 +frameHeight *dt;
    } else {
        //adding stagger(delay start) logic.
        //first row, starts with 0 delay,2 with 25 frame count and the 3 is delayed by 50 frame counts
        //based on the instantiation parameter of the enemies below.
        if ( this.x >= this.stagger) { 
            this.x+=frameWidth*dt + this.speed;
        } else 
             this.x++;
    }
   
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(level){
    "use strict";
    this.sprite='images/char-cat-girl.png';
    //starting position of the player, by default
    this.x=2*frameWidth;
    this.y=5*frameHeight;
    this.score=0;
    //initial score is 0, unless changed by the user.
    this.level=level;
};

//function to update scores, everytime a win is encountered.
//need to update the logic to add continous play, if the user wants to via a menu(to be done)

Player.prototype.update=function(dt){
    "use strict";
    console.log("update:level=" + this.level);
    if (this.level === 0){
        this.score+=50;    //50 points on a win at first level
   } else if (this.level === 1){
         this.score+=100;  //100 points on a win at first level
   }else if (this.level === 2){
         this.score+=200;  //200 points on a win at first level
   }
  console.log("Score=" +this.score);
};

Player.prototype.render=function(){
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.setLevel=function(level){
    "use strict";
    console.log("setLevel=" + level);
    
    //will pop extra enemies if the levels decreased from before
    if (level  < this.level)
        changeEnemies(this.level -level); 

    //will add Enemies if levels increased from before
    var enemyMiddle2;
    var enemyTop2;
    if (allEnemies.length ===3 && level === 1){
        enemyMiddle2=new Enemy(2,15,50);//run on stone row2, 15pix/sec speed,delay of 25 pix/sec
        allEnemies.push(enemyMiddle2);
    } else if (allEnemies.length ===3 && level === 2){
        enemyMiddle2=new Enemy(2,15,50);//run on stone row2, 15pix/sec, speeddelay of 50 pix/sec
        allEnemies.push(enemyMiddle2);
        enemyTop2=new Enemy(1,10,25);//run on stone row1, 10pix/sec speed,delay of 25 pix/sec
        allEnemies.push(enemyTop2);
    }  else if (allEnemies.length ===4 && level === 2){
        enemyTop2=new Enemy(1,10,25);//run on stone row1, 10pix/sec speed,delay of 25 pix/sec
        allEnemies.push(enemyTop2);
    } 
    this.level=level;
};

//A utility function to pop enemies out of allEnemies array.
//numToPop - is the number of enemies to be popped out fo the array.
var changeEnemies= function(numToPop){
    "use strict";
    console.log("allEnemies length=" + allEnemies.length);
    var len=allEnemies.length;
    if (len > 3){
        for (var i=0;i<numToPop;i++){
            allEnemies.pop();
            console.log("popping i=" +i);
        }
    }
};

Player.prototype.handleInput=function(key){
    "use strict";
    console.log("key=" + key);
    if (key === 'up'){
        this.y-=frameHeight;
    } else if (key === 'down'){
        this.y += frameHeight;
    }else if (key === 'left'){
        this.x -= frameWidth;
    } else if (key === 'right'){
        this.x += frameWidth;
    }
    //player position resets if going beyond the canvas
    if (this.y > 400)
        this.y = 400;
    if (this.x < 0)
        this.x= 0;
    if (this.x > 400)
        this.x=400;

      console.log("player:x=" + this.x + " player.y=" + this.y);
};


var allEnemies=[];
var player;

var entitiesInit= function (level){
    "use strict";
    var enemyTop=new Enemy(1,0,0); //runs on stone row1, normal speed,with no delay
    allEnemies.push(enemyTop);
    var enemyMiddle=new Enemy(2,5,25);//run on stone row2, 5pix/sec,delay of 25 pix/sec
    var enemyBottom=new Enemy(3,10,50);//run on stone row3, 10pix/sec,delay of 50pix/sec
    allEnemies.push(enemyMiddle);
    allEnemies.push(enemyBottom);

    player=new Player(level);
};



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    "use strict";
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
