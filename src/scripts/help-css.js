// constants and let's
const canvasParent = document.querySelector("#canvas-container");
const startPageElement = document.querySelector("#start-page");
const gamePageElement = document.querySelector("#game-page");
const gameOverPageElement = document.querySelector("#game-over-page");

let ground;
let neutralB;
let rightB;
let wrongB;

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
    return 0 + (canvasParent.clientWidth / this.totalBoxesInRow) * (this.order - 1) + this.spaceLeft;
  }

  get y1() {
    return canvasParent.clientHeight / 10;
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
  }

  draw() {
    image(neutralB, this.x1, this.y1, this.width, this.height);
  }
}

let neutralBox1 = new NeutralBox(1, 0.06 * canvasParent.clientWidth, 3)
let neutralBox2 = new NeutralBox(2, 0.045 * canvasParent.clientWidth, 3)
let neutralBox3 = new NeutralBox(3, 0.025 * canvasParent.clientWidth, 3)

// class Player {
//   constructor()

//   get x1() {
//     return 0
//   }

//   get y1() {
//   return canvasParent.clientHeight - groundStone1.height - canvasParent.clientHeight/6;
//   }
  
//   get x2() {
//     return canvasParent.clientWidth / 10
//   }

//   get y2() {
//     return canvasParent.clientHeight - groundStone1.height
//   }

//   isInCanvas() {
//     let turnRight;
//     let turnLeft
//     this.x1 += 10;

//     if (this.x2 <= canvasParent.clientWidth) {
//       this.x1 -= 10;
//       turnRight = true;
//     } else {
//       this.x1 -= 10;
//       turnRight = false;
//     }

//     this.x1 -= 10;

//     if (this.x1 >= 0) {
//       this.x1 += 10;
//       turnLeft = true;
//     } else {
//       this.x1 += 10;
//       turnLeft = false;
//     }

//     return turnLeft && turnRight ? true : false;
//   }

//   isOnGround() {



//   }

//   move() {

//     if (this.isInCanvas()) {

//       function keyPressed() {
//         if (keyCode === LEFT_ARROW) {
//           this.x1 -= 10;
//         } else if (keyCode === RIGHT_ARROW) {
//           this.x1 += 10;   
//         } else if (keyCode === UP_ARROW || keyCode === 32) {
//           this.y2 += 200;   
//         }
//     }
//     return keyPressed();
//   }


// }

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
  neutralBox3.draw();
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
