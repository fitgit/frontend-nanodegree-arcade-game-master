Project:Front-End-Arcade-Game development.

Has 3 js files.
app.js: entities or contestants of the game definition and their functions.

Engine.js: The main Engine which has the event loop to update the positions and refresh the canvas. Calls Entity functions from app.js

Resource.js: A function to load all the images needed for the project and cache them for quicker access.

How to Play

1. To run the game, click on index.html

2. Chose the level, u want to play. Start moving the player across the stone frames.

3. If there is a collision with the enemy, the game is over , with a game over image being displayed,with a score of 0.

4. If the player reaches the other end(water frames), a "You win" image is displayed and the score is displayed on the page.