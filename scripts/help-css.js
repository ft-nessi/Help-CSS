// constants and let's
const canvasParent = document.querySelector("#canvas-container");
const startPageElement = document.querySelector("#start-page");
const gamePageElement = document.querySelector("#game-page");
const gameOverPageElement = document.querySelector("#game-over-page");
const Game = {
  hasStarted: false,
  currentLevel: 0,
  levels: [
    { correct: 1, answers: ["border: green", "border: 5px solid green"] },
    { correct: 0, answers: ["border: 5px solid green; border-top: 10px dashed green;", "border: 5px solid green; border-top: double dashed"] },
    { correct: 1, answers: ["font-style: italic, underline;", "font-style: italic; text-decoration: underline;"] },
    { correct: 0, answers: [""] },
  ],
  isResetting: false,
  canMove: false,
  totalScore: 0,
  hasAnswered: false,
  hasUpdatedScore: false,
};

let ground;
let neutralB;
let rightB;
let wrongB;
let flashS;
let flashR;

function startLevel() {
  const actionElements = document.querySelectorAll(".action");
  actionElements.forEach((elem) => {
    elem.classList.add("hidden");
  });

  const allLevelElements = document.querySelectorAll(".level");
  allLevelElements.forEach((elem) => {
    elem.classList.add("hidden");
  });
  const levelElement = document.querySelector(`#level-${Game.currentLevel}`);
  levelElement.classList.remove("hidden");

  Game.isResetting = true;
}

function updateScore(isCorrect) {
  if (!Game.hasStarted) {
    return;
  }

  const scoreElement = document.querySelector("#score-number");
  Game.totalScore = Game.totalScore + (isCorrect ? 1 : 0);
  scoreElement.innerText = Game.totalScore;

  const allImageElements = document.querySelectorAll(".clara-image");
  allImageElements.forEach((elem) => {
    elem.classList.add("hidden");
  });

  const imageElement = document.querySelector(
    `#clara-image-${Game.totalScore}`
  );
  imageElement.classList.remove("hidden");

  const allStatusElements = document.querySelectorAll(".status");
  allStatusElements.forEach((elem) => {
    elem.classList.add("hidden");
  });

  const statusElement = document.querySelector(`#status-${Game.currentLevel}`);
  statusElement.classList.remove("hidden");

  const actionElements = document.querySelectorAll(".action");
  actionElements.forEach((elem) => {
    elem.classList.add("hidden");
  });

  if (isCorrect) {
    const correctButtonElement = document.querySelector(".nextLevel");
    correctButtonElement.classList.remove("hidden");
  } else {
    const wrongButtonElement = document.querySelector(".wrong-answer");
    wrongButtonElement.classList.remove("hidden");
  }
}

// Basis functions
function hidePage(name) {
  name.classList.add("hidden");
}

function showPage(name) {
  name.classList.remove("hidden");
}
// ______________________________________________________________
//  Here starts the Canvas
// --------------------------------------------------------------

function mySetup() {
  //BackgroundColor
  const c = color(208, 220, 227);

  //Ground Objects

  //Boxes Objects

  //Flash

  //Creating Canvas
  const canvas = createCanvas(
    canvasParent.clientWidth,
    canvasParent.clientHeight
  );
  canvas.parent("canvas-container");
}

function preload() {
  //Loading images
  ground = loadImage("images/ground-stone.png");
  neutralB = loadImage("images/neutral-stone.png");
  rightB = loadImage("images/right-stone.png");
  wrongB = loadImage("images/wrong-stone.png");
  flashS = loadImage("images/flash-standing.png");
  flashR = loadImage("images/flash-running.png");
}

function windowResized() {
  resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight, [false]);
}

//_______________________________________________________________
//  Building Classes
// --------------------------------------------------------------

class GroundStone {
  constructor(order) {
    this.order = order;
  }

  get x1() {
    return 0 + (canvasParent.clientWidth / 6) * (this.order - 1);
  }

  get y1() {
    return canvasParent.clientHeight - canvasParent.clientHeight / 10;
  }

  get width() {
    return canvasParent.clientWidth / 6;
  }

  get height() {
    return canvasParent.clientHeight / 10;
  }

  draw() {
    image(ground, this.x1, this.y1, this.width, this.height);
  }
}

let groundStone1 = new GroundStone(1);
let groundStone2 = new GroundStone(2);
let groundStone3 = new GroundStone(3);
let groundStone4 = new GroundStone(4);
let groundStone5 = new GroundStone(5);
let groundStone6 = new GroundStone(6);

class Box {
  constructor(order, spaceLeft, totalBoxesInRow) {
    this.order = order;
    this.spaceLeft = spaceLeft;
    this.totalBoxesInRow = totalBoxesInRow;
    this.isCollidingVert = false;
    this.isCollidingHor = false;
  }

  get x1() {
    return (
      0 +
      (canvasParent.clientWidth / this.totalBoxesInRow) * (this.order - 1) +
      this.spaceLeft
    );
  }

  get y1() {
    return 0;
  }

  get y2() {
    return this.y1 + this.height;
  }

  get x2() {
    return this.x1 + this.width;
  }

  get width() {
    return canvasParent.clientWidth / (this.totalBoxesInRow + 1);
  }

  get height() {
    return canvasParent.clientHeight / 5;
  }
}

class NeutralBox extends Box {
  constructor(order, spaceLeft, totalBoxesInRow) {
    super(order, spaceLeft, totalBoxesInRow);
    this.image = neutralB;
  }
  isIn(x1, x2) {
    return (this.x1 >= x1 && this.x2 <= x2) || (this.x1 <= x2 && this.x2 >= x1);
  }

  isInBetween(y1, y2) {
    return (y1 <= this.y1 && this.y1 <= y2) || (y1 <= this.y2 && this.y2 <= y2);
  }

  collidesWithVert(box) {
    return this.y1 <= box.y2 && this.isIn(box.x1, box.x2);
  }

  collidesWithHor(box) {
    return (
      this.x2 >= box.x1 &&
      this.isInBetween(box.y1, box.y2) &&
      this.x1 <= box.x2 &&
      this.isInBetween(box.y1, box.y2)
    );
  }

  collideVert() {
    this.isCollidingVert = this.collidesWithVert(flash);
  }

  collideHor() {
    this.isCollidingHor = this.collidesWithHor(flash);
  }

  draw() {
    this.collideVert();
    this.collideHor();

    const correct = Game.levels[Game.currentLevel].correct;
    const isThisCorrect = correct === this.order - 1;
    const isColliding = this.isCollidingHor && this.isCollidingVert;

    if (isColliding) {
      Game.hasAnswered = true;
    }

    if (isColliding && isThisCorrect) {
      Game.canMove = false;

      if (!Game.hasUpdatedScore) {
        updateScore(isThisCorrect);
        Game.hasUpdatedScore = true;
      }
    }

    if (isColliding && !isThisCorrect) {
      updateScore(false);
    }

    let textString = Game.levels[Game.currentLevel].answers[this.order - 1];
    if (Game.hasAnswered) {
      if (isThisCorrect) {
        this.image = rightB;
      } else {
        this.image = wrongB;
      }
    } else {this.image = neutralB}

    image(this.image, this.x1, this.y1, this.width, this.height);
    textSize(this.width/10);
    text(textString, this.x1 + 5, this.y1 + 8, this.width - 10, this.height - 10);
    fill(36, 53, 65);
    textStyle(BOLD);
    textAlign(CENTER);
  }
}

let neutralBox1;
let neutralBox2;

function createBoxes() {
  neutralBox1 = new NeutralBox(1, canvasParent.clientWidth / 9, 2);
  neutralBox2 = new NeutralBox(2, 0.055 * canvasParent.clientWidth, 2);
}

class Player {
  constructor() {
    this.speedX = 0;
    this.speedY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.acceleration = 0.3;
    this.isJumping = false;
    this.isCollidingVert = false;
    this.isCollidingHor = false;
  }

  get x1() {
    return 0 + this.offsetX;
  }

  get y1() {
    return (
      canvasParent.clientHeight -
      groundStone1.height -
      canvasParent.clientHeight / 5 +
      this.offsetY
    );
  }

  get x2() {
    return canvasParent.clientWidth / 14 + this.offsetX;
  }

  get y2() {
    return canvasParent.clientHeight - groundStone1.height + this.offsetY;
  }

  get width() {
    return this.x2 - this.x1;
  }

  get height() {
    return this.y2 - this.y1;
  }

  draw() {
    image(flashS, this.x1, this.y1, this.width, this.height);
  }

  isIn(x1, x2) {
    return (this.x1 >= x1 && this.x2 <= x2) || (this.x1 <= x2 && this.x2 >= x1);
  }

  isInBetween(y1, y2) {
    return (y1 <= this.y1 && this.y1 <= y2) || (y1 <= this.y2 && this.y2 <= y2);
  }

  isInCanvas() {
    return this.isIn(0, canvasParent.clientWidth);
  }

  isOnGround() {
    if (this.y2 === groundStone1.y1) return true;
    else false;
  }

  collidesWithVert(box) {
    return this.y1 <= box.y2 && this.isIn(box.x1, box.x2);
  }

  collidesWithHor(box) {
    return (
      this.x2 >= box.x1 &&
      this.isInBetween(box.y1, box.y2) &&
      this.x1 <= box.x2 &&
      this.isInBetween(box.y1, box.y2)
    );
  }

  collideVert() {
    this.isCollidingVert =
      this.collidesWithVert(neutralBox1) || this.collidesWithVert(neutralBox2);
  }

  collideHor() {
    this.isCollidingHor =
      this.collidesWithHor(neutralBox1) || this.collidesWithHor(neutralBox2);
  }

  isPressing(key) {
    if (!Game.canMove) {
      return false;
    }
    return keyIsDown(key);
  }

  move() {
    if (this.isInCanvas()) {
      if (this.isPressing(LEFT_ARROW)) {
        this.speedX -= this.acceleration;
      }
      if (this.isPressing(RIGHT_ARROW)) {
        this.speedX += this.acceleration;
      }
    } else {
      if (this.x1 < 0) {
        this.offsetX = 0;
      } else {
        this.offsetX = canvasParent.clientWidth - this.width;
      }
    }

    if (!this.isPressing(LEFT_ARROW) && !this.isPressing(RIGHT_ARROW)) {
      this.speedX = 0;
    }

    if (this.isCollidingHor) {
      this.speedX = 0;
      if (this.isPressing(RIGHT_ARROW)) {
        this.speedX += this.acceleration;
      }
      if (this.isPressing(LEFT_ARROW)) {
        this.speedX -= this.acceleration;
      }
    }

    if (
      ((this.isOnGround() && !this.isJumping) || this.isJumping) &&
      this.isPressing(UP_ARROW) &&
      !this.isCollidingVert
    ) {
      this.isJumping = true;
      this.speedY -= this.acceleration;
    } else {
      this.isJumping = false;
      this.speedY += this.acceleration;

      if (this.isCollidingVert) {
        this.speedY = 0;
        this.speedY += this.acceleration;
      }
    }

    this.offsetX += this.speedX;
    this.offsetY += this.speedY;

    if (this.offsetY > 0) {
      this.speedY = 0;
      this.offsetY = 0;
    }
  }
}

let flash = new Player();

window.onresize = () => {
  windowResized();
};

//_______________________________________________________________
//  General Canvas functions
// --------------------------------------------------------------

function draw() {
  if (!Game.hasStarted) {
    return;
  }

  background(208, 220, 227);

  groundStone1.draw();
  groundStone2.draw();
  groundStone3.draw();
  groundStone4.draw();
  groundStone5.draw();
  groundStone6.draw();

  neutralBox1.draw();
  neutralBox2.draw();

  flash.collideHor();
  flash.collideVert();
  flash.move();
  flash.draw();

  if (Game.isResetting) {
    Game.isResetting = false;
    Game.canMove = true;
    Game.hasAnswered = false;
    Game.hasUpdatedScore = false;
  }
}

//Here are "EventListener"
document.getElementById("start-button").onclick = () => {
  hidePage(startPageElement);
  showPage(gamePageElement);
  Game.hasStarted = true;
  createBoxes();
  mySetup();
};

document.querySelector(".nextLevel").onclick = () => {
  if (Game.currentLevel === 2) {
    Game.hasStarted = false;
    hidePage(gamePageElement);
    showPage(gameOverPageElement);
    return;
  }

  Game.currentLevel++;
  startLevel();
};

document.querySelector("#try-again-button").onclick = () => {
  window.location.reload();
}

window.addEventListener("onload", () => {
  hidePage(gamePageElement);
  hidePage(gameOverPageElement);
});

startLevel();
