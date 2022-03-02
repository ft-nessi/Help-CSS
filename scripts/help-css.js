// constants and let's
const canvasParent = document.querySelector("#canvas-container");
const startPageElement = document.querySelector("#start-page");
const gamePageElement = document.querySelector("#game-page");
const gameOverPageElement = document.querySelector("#game-over-page");

let ground;
let neutralB;
let rightB;
let wrongB;
let flashS;
let flashR;

// Basis functions
function hidePage(name) {
  name.style.display = "none";
}

function showPage(name) {
  name.style.display = "flex";
}
// ______________________________________________________________
//  Here starts the Canvas
// --------------------------------------------------------------

function setup() {
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
  ground = loadImage("../images/ground-stone.png");
  neutralB = loadImage("../images/neutral-stone.png");
  rightB = loadImage("../images/right-stone.png");
  wrongB = loadImage("../images/wrong-stone.png");
  flashS = loadImage("../images/flash-standing.png");
  flashR = loadImage("../images/flash-running.png");
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
  }

  get x1() {
    return (
      0 +
      (canvasParent.clientWidth / this.totalBoxesInRow) * (this.order - 1) +
      this.spaceLeft
    );
  }

  get y1() {
    return canvasParent.clientHeight / 12;
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
    this.image;
  }

  draw() {
    image(neutralB, this.x1, this.y1, this.width, this.height);
  }
}

let neutralBox1 = new NeutralBox(1, canvasParent.clientWidth/9, 2);
let neutralBox2 = new NeutralBox(2, 0.055 * canvasParent.clientWidth, 2);

console.log("0", neutralBox1.x1, neutralBox1.x2, neutralBox2.x1, neutralBox2.x2, canvasParent.clientWidth)

class Player {
  constructor() {
    this.speedX = 0;
    this.speedY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.acceleration = 0.3;
    this.isJumping = false;
    this.isColliding = false;
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
    return ((this.x1 >= x1 && this.x2 <= x2) || (this.x1 <= x2 && this.x2 >= x1))

  }

  isInCanvas() {
    return this.isIn(0, canvasParent.clientWidth)
  }

  isOnGround() {
    if (this.y2 === groundStone1.y1) return true;
    else false;
  }

  collidesWith(box) {
    return (this.y1 <= box.y2 && this.isIn(box.x1, box.x2))
  }

  collide() {
    this.isColliding = (this.collidesWith(neutralBox1) || this.collidesWith(neutralBox2))
  }


  move() {

    if (this.isInCanvas()) {
      
      if (keyIsDown(LEFT_ARROW)) {
        this.speedX -= this.acceleration;
      } 
      if (keyIsDown(RIGHT_ARROW)) {
        this.speedX += this.acceleration;
      } 
     } else {
       if (this.x1 < 0) {
         this.offsetX = 0;
       } else {
         this.offsetX = canvasParent.clientWidth - this.width;
       }
     }

    if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      this.speedX = 0
    }


    if (((this.isOnGround() && !this.isJumping) || this.isJumping) && keyIsDown(UP_ARROW) && !this.isColliding) {
      this.isJumping = true;
      this.speedY -= this.acceleration;
      console.log(this.offsetY);
    } else {
      this.isJumping = false;
      this.speedY += this.acceleration;

      if (this.isColliding) {
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

console.log(flash.isOnGround());

window.onresize = () => {
  windowResized;
};

//_______________________________________________________________
//  General Canvas functions
// --------------------------------------------------------------

function draw() {
  background(208, 220, 227);

  groundStone1.draw();
  groundStone2.draw();
  groundStone3.draw();
  groundStone4.draw();
  groundStone5.draw();
  groundStone6.draw();

  neutralBox1.draw();
  neutralBox2.draw();

  flash.collide();
  flash.move();
  flash.draw();
}

//Here are "EventListener"
document.getElementById("start-button").onclick = () => {
  hidePage(startPageElement);
  showPage(gamePageElement);
};

window.addEventListener("onload", () => {
  hidePage(gamePageElement);
  hidePage(gameOverPageElement);
});
