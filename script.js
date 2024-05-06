// idea: create a mini kirby themed fighting game

// setting up variables
const COMMA = 188;
const PERIOD = 190;
let pixelifySans;
let startupImage;
let loseSprite;
let winSprite;
let startup = true;
let clickedAttack = false;
let clickedDefend = false;
let clickedUlt = false;
let failedUlt = false;
let bossTurn = false;
let upMovement = true;
let downMovement = false;
let playerHealth = 750;
let playerAttack = 17;
let playerDefense = 0;
let playerEnergy = 0;
let bossHealth = 1000;
let bossAttack = 12;
let movement = 0;
let damageDealt = 0;

// load game assets
function preload() {
  pixelifySans = loadFont("assets/PixelifySans.ttf");
  startupImage = loadImage("assets/startupImage.png");
  metaKnight = loadImage("assets/metaKnight.png");
  loseSprite = loadImage("assets/loseSprite.png");
  winSprite = loadImage("assets/winSprite.png");
}

// setup screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(pixelifySans, 80);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(255);
  // create startup screen
  if (startup) {
    startupScreen();
    if (mouseIsPressed) {
      // stop loading screen when play button is pressed
      if (mouseX < width/2-3 && mouseX > width/2-217 && mouseY < height/2+40 && mouseY > height/2-20) {
        startup = false;
      }
    } 
  } else if (clickedAttack) {
    // shows attack screen after attack is clicked
    fightingScreen();
    healthBars();
    attack();
    // pressing comma ends attack and changes to boss attack
    if (keyIsDown(COMMA)) {
      clickedAttack = false;
      bossTurn = true;
      damageDealt = round(random(5)*bossAttack);
      // prevents health from going into negatives
      if (playerHealth-damageDealt < 0){
        playerHealth = 0;
      } else {
        playerHealth -= damageDealt;
      }
    }
  } else if (clickedDefend) {
    // shows defense screen after defense is clicked
    fightingScreen();
    healthBars();
    defend();
    // pressing comma ends action and changes to boss attack
    if (keyIsDown(COMMA)) {
      clickedDefend = false;
      bossTurn = true;
      damageDealt = round(random(5)*bossAttack)-playerDefense;
      // prevents health from going into negatives
      if (damageDealt < 0) {
        damageDealt = 0;
      } if (playerHealth-damageDealt < 0) {
        playerHealth = 0;
      } else {
        playerHealth -= damageDealt;
      }
    }
  } else if (clickedUlt) {
    // shows ultimate screen after ultimate is clicked
    fightingScreen();
    healthBars();
    ult();
    // pressing comma ends action and changes to boss attack
    if (keyIsDown(COMMA)) {
      clickedUlt = false;
      bossTurn = true;
      damageDealt = round(random(5)*bossAttack);
      if (playerHealth-damageDealt < 0) {
        playerHealth = 0;
      } else {
        playerHealth -= damageDealt;
      }
    }
  } else if (failedUlt) {
    // shows if you do not have enough energy for ult
    fightingScreen();
    healthBars();
    strokeWeight(5);
    stroke(252, 129, 154);
    fill(255);
    textSize(height/32);
    text("> You have " + playerEnergy + " energy. You need at least 5!", width/2, height*13/18);
    if (keyIsDown(COMMA)) {
      failedUlt = false;
    }
  } else if (bossTurn) {
    // boss attacks after player finishes an action
    fightingScreen();
    healthBars();
    bossAttacksPlayer();
    // pressing period ends boss turn
    if (keyIsDown(PERIOD)) {
      bossTurn = false;
      playerEnergy += 1;
    }
  // plays losing screen if player runs out of health
  } else if (playerHealth == 0) {
    playerLost();
  // plays win screen if boss runs out of health
  } else if (bossHealth == 0) {
    playerWon();
  } else {
    // load fighting screen
    fightingScreen();
    healthBars();
    if (mouseIsPressed) {
      // uses mouse coordinates when mouse is pressed
      // checks if attack button was pressed
      if (mouseX < width/6+width/8 && mouseX > width/6-width/8 && mouseY < height*6/7+height/20 && mouseY > height*6/7-height/20) {
        damageDealt = round(random(5)*playerAttack);
        // prevents health from going into negatives
        if (bossHealth-damageDealt < 0) {
          bossHealth = 0;
        } else {
          bossHealth -= damageDealt;
        }
        clickedAttack = true;
      // checks if defend button was pressed
      } else if (mouseX < width/2+width/8 && mouseX > width/2-width/8 && mouseY < height*6/7+height/20 && mouseY > height*6/7-height/20) {
        playerDefense = round(random(5)*10);
        clickedDefend = true;
      // checks if ult button was pressed
      } else if (mouseX < width*5/6+width/8 && mouseX > width/2-width/8 && mouseY < height*6/7+height/20 && mouseY > height*6/7-height/20) {
        // checks if the player has enough energy to ult
        if (playerEnergy >= 5) {
          playerEnergy -= 5;
          damageDealt = round(random(9)*playerAttack);
          if (bossHealth-damageDealt < 0) {
            bossHealth = 0;
          } else {
            bossHealth -= damageDealt;
          }
          clickedUlt = true;
        } else {
          failedUlt = true;
        }
      } else {
      // print normal screen if player is clicking but not clicking the buttons
        strokeWeight(5);
        stroke(252, 129, 154);
        fill(255);
        text("> What will you do?", width/2, height*13/18);
      }
    }
    else {
    // if it is the players turn and has yet to take action
      strokeWeight(5);
      stroke(252, 129, 154);
      fill(255);
      text("> What will you do?", width/2, height*13/18);
    }
  }
  // print name at the corner at all times
  noStroke();
  textSize(15);
  fill(0);
  text("sunflwrs (Amy)", width-80, height-25);
}

// function for startup (beginning) screen
function startupScreen() {
  noStroke();
  textSize(80);
  fill(252, 129, 154);
  rect(width/2-110, height/2+10, 200, 75);
  rect(width/2-110, height/2+10, 215, 60);
  image(startupImage, width/2+110, height/2, 213, 238);
  fill(0);
  text("PLAY", width/2-110, height/2);
  textSize(15);
  text("Press ',' after player action and '.' after boss action", width/2, height/2+150);
  text("Use the ULT button after you gain 5 (five) energy!", width/2, height/2+175);
  text("You gain 1 energy per attack/defend.", width/2, height/2+200);
}

// create main fighting screen
function fightingScreen() {
  image(metaKnight, width/2, height/3+movement, 244*height/500, 207*height/500);
  // prevents boss movement from going to far up/down
  if (upMovement) {
    movement -= 1;
  } else if (downMovement) {
    movement += 1;
  } if (movement == -15) {
    upMovement = false;
    downMovement = true;
  } else if (movement == 15) {
    upMovement = true;
    downMovement = false;
  }
  // general fighting screen
  strokeWeight(5);
  stroke(252, 129, 154);
  fill(255, 168, 186);
  rect(width/2, height*4/5, width-20, height/4);
  rect(width/6, height*6/7, width/4, height/10);
  rect(width/2, height*6/7, width/4, height/10);
  rect(width*5/6, height*6/7, width/4, height/10);
  textSize(height/16);
  fill(255);
  text("ATTACK", width/6, height*6/7);
  text("DEFEND", width/2, height*6/7);
  text("ULT", width*5/6, height*6/7);
}

// function to show health bars
function healthBars() {
  noStroke();
  fill(0);
  textSize(height/16);
  text("BOSS HP", width/2, 10);
  text("PLAYER HP", width/5, height*7/11);
  rect(width/2, 40, width-50, 20);
  rect(width*2/3, height*7/11, width/2, 20);
  rectMode(CORNER);
  fill(255, 50, 50);
  rect(width/2-(width-60)/2, 35, (width-60)*(bossHealth/1000), 10);
  rect(width*2/3-(width/2-10)/2, height*7/11-5, (width/2-10)*(playerHealth/750), 10);
  rectMode(CENTER);
}

// function for attack button
function attack() {
  strokeWeight(5);
  stroke(252, 129, 154);
  fill(255);
  text("> You dealt " + damageDealt + " damage!", width/2, height*13/18);
}

// function for defend button
function defend() {
  strokeWeight(5);
  stroke(252, 129, 154);
  fill(255);
  text("> You defended!", width/2, height*13/18);
} 

// function for ult (ultimate)
function ult() {
  strokeWeight(5);
  stroke(252, 129, 154);
  fill(255)
  textSize(height/32);
  text("You released your ultimate! You dealt " + damageDealt + " damage!", width/2, height*13/18);
}

// function for boss attack
function bossAttacksPlayer() {
  strokeWeight(5);
  stroke(252, 129, 154);
  fill(255);
  text("> The boss dealt " + damageDealt + " damage!", width/2, height*13/18);
}

// create losing screen (you run out of health)
function playerLost() {
  textSize(50);
  noStroke();
  fill(0);
  text("YOU LOST!", width/2-110, height/2);
  image(loseSprite, width/2+110, height/2, 1818*height/5000, 1377*height/5000);
}

// create win screen (boss runs out of health)
function playerWon() {
  textSize(50);
  noStroke();
  fill(0);
  text("YOU WON!", width/2-100, height/2);
  image(winSprite, width/2+100, height/2, 221*height/800, 228*height/800);
}