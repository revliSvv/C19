var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "play"
var score = 0;

function preload() {
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadImage("ghost-standing.png");
  ghostJumping = loadImage('ghost-jumping.png');
  spookySound = loadSound("spooky.wav");
}

function setup() {
  createCanvas(600, 600);

  tower = createSprite(300, 300);
  tower.addImage("tower", towerImg);
  tower.velocityY = 1;

  spawnGhost();

  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();
}

function draw() {
  background(200);
  if (gameState == 'play') {

    if (tower.y > 400) {
      tower.y = 300
    }

    if (keyDown('LEFT_ARROW') || keyDown('a')) {
      ghost.x -= 3;
    }

    if (keyDown('RIGHT_ARROW') || keyDown('d')) {
      ghost.x += 3;
    }

    if (keyDown('space') || keyDown('w') || keyDown('UP_ARROW')) {
      ghost.velocityY = -5;
      ghost.addImage('jumping', ghostJumping);
      ghost.addImage('ghostImg', ghostImg)
    }

    if (climbersGroup.isTouching(ghost)) {
      ghost.velocityY = 0;
    }

    if (invisibleBlockGroup.isTouching(ghost)) {
      ghost.destroy();
      //text('GAME OVER', 200, 200);
      //text('Press \'tab\' to restart.', 200, 300);
      gameState = 'end'
    }

    if (ghost.y >= 650) {
      gameState = 'end';
    }

    score += Math.round(getFrameRate() / 45);


    spawnDoors();

    ghost.velocityY += 0.5;
  }

  drawSprites();

  text('Score: ' + score, 30, 30);

  if (gameState == 'end') {
    climbersGroup.destroyEach();
    doorsGroup.destroyEach();
    invisibleBlockGroup.destroyEach();

    tower.velocityY = 0;

    stroke('black');
    fill('black');
    textSize(20);
    text('GAME OVER', 300, 200);
    text('Press \'r\' to restart.', 300, 300);

    if (keyDown('r')) {
      gameState = 'play';
      spawnGhost();

      tower.velocityY = 1;

      score = 0;
    }
  }
}

function spawnDoors() {
  if (frameCount % 240 == 0) {
    var door = createSprite(200, -50);
    var climber = createSprite(200, 10);
    var invisibleBlock = createSprite(200, 15);

    ghost.depth = door.depth + 1;

    door.addImage('doorImg', doorImg);
    climber.addImage('climberImg', climberImg);

    invisibleBlock.width = climber.width - 18;
    invisibleBlock.height = 2;
    invisibleBlock.visible = false;
    invisibleBlock.setCollider('rectangle', 0, 10);
    invisibleBlock.debug = true;

    door.x = Math.round(random(150, 400));
    climber.x = door.x;
    invisibleBlock.x = climber.x;

    door.velocityY = 1;
    climber.velocityY = door.velocityY;
    invisibleBlock.velocityY = climber.velocityY;

    doorsGroup.add(door);
    climbersGroup.add(climber);
    invisibleBlockGroup.add(invisibleBlock);
  }
}

function spawnGhost() {
  ghost = createSprite(200, 200, 50, 50);
  ghost.addImage('ghostImg', ghostImg);
  ghost.scale = 0.4;
  ghost.debug = true;
  ghost.setCollider('rectangle', -20, 20, 200, 250);
}