let gameCanvas = document.getElementById("myGameCanvas");
let context = gameCanvas.getContext("2d");
gameCanvas.width = 600;
gameCanvas.height = 600;
let blocks = [];
let heightToFirstBlock = 75;
let initialNumberOfBlocks = 10;
let acceleration = [0.5];
let velocity = [0.2, 0.7];
let firstDistanceToBlocks = 75;
let horizontalDistance = [60];
let verticalDistance = [60];
const minmumBlockWidth = 130;
const minmumBlockHeight = 25;
let currentBlock = null;

let colorArray = ["#3F9AA5", "#03585D", "#FA7268", "#D93E3A", "#D93E3A"];
let blockProperties = {
  x: undefined,
  y: undefined,
  width: undefined,
  height: undefined,
};

class block {
  constructor(x, y, width, height, color = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.lineWidth = "6";
    context.fillStyle = colorArray[this.color];
    var im = new Image();
    im.src = "../assets/images/block.png";
    let pattern = context.createPattern(im, "repeat");
    context.fillStyle = pattern;
    context.drawImage(im, this.x, this.y, this.width, this.height);
  }
}
function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let t = false;

function drawShelfBlocks() {
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }
}

function initBlocks() {
  blocks = [];
  blockProperties.width = randomMinMax(
    minmumBlockWidth,
    gameCanvas.width * 0.09 + minmumBlockWidth
  );
  blockProperties.height = randomMinMax(
    minmumBlockHeight,
    gameCanvas.height * 0.01 + minmumBlockHeight
  );
  blockProperties.x = randomMinMax(
    100,
    gameCanvas.width - blockProperties.width
  );
  blockProperties.y =
    gameCanvas.height - firstDistanceToBlocks - blockProperties.height;
  blocks.push(
    new block(
      blockProperties.x,
      blockProperties.y,
      blockProperties.width,
      blockProperties.height
    )
  );
  for (let i = 1; i < initialNumberOfBlocks; i++) {
    blockProperties.width = randomMinMax(
      minmumBlockWidth,
      gameCanvas.width * 0.09 + minmumBlockWidth
    );
    blockProperties.height = randomMinMax(
      minmumBlockHeight,
      gameCanvas.height * 0.01 + minmumBlockHeight
    );
    blockProperties.x =
      (randomMinMax(horizontalDistance[0], horizontalDistance[0] * 1.2) +
        blocks[i - 1].x) %
      (gameCanvas.width - blockProperties.width);
    blockProperties.y =
      blocks[i - 1].y -
      verticalDistance[0] -
      blockProperties.height * (1 + randomMinMax(0, 0.1));
    blocks.push(
      new block(
        blockProperties.x,
        blockProperties.y,
        blockProperties.width,
        blockProperties.height
      )
    );
  }

  drawShelfBlocks();
}

function addShelfBlock() {
  let i = blocks.length;
  blockProperties.width = randomMinMax(
    minmumBlockWidth,
    gameCanvas.width * 0.2 + minmumBlockWidth
  );
  blockProperties.height = randomMinMax(
    minmumBlockHeight,
    gameCanvas.height * 0.03 + minmumBlockHeight
  );
  blockProperties.x =
    (randomMinMax(0.5 * horizontalDistance[0], horizontalDistance[0] * 1.3) +
      blocks[0].x) %
    (gameCanvas.width - blockProperties.width);
  sortShelfBlocks();
  blockProperties.y =
    blocks[0].y - verticalDistance[0] - blockProperties.height * 1.5;
  blocks.unshift(
    new block(
      blockProperties.x,
      blockProperties.y,
      blockProperties.width,
      blockProperties.height
    )
  );
}

function movingShelfBlocks() {
  let counter = 0;
  let removedShelfBlocks = 0;
  while (counter < 15) {
    counter += velocity[0];
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].y = blocks[i].y + velocity[0];
      if (blocks[i].y > gameCanvas.height) {
        blocks.splice(i, 1);
        addShelfBlock();
        removedShelfBlocks++;
      }
    }
    mainCharacter.align(velocity[0]);
    drawShelfBlocks();
    mainCharacter.draw();
  }
  return removedShelfBlocks;
}

let frequency = 0;
function movingScreen() {
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].y = blocks[i].y + velocity[1];
    if (blocks[i].y > gameCanvas.height) {
      blocks.splice(i, 1);
      addShelfBlock();
    }
  }
  if (currentScore >= 100 && currentScore < 1000) {
    frequency++;
    if (frequency < 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 10;
    }

    if (frequency <= 6 && frequency > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 10;
      if (frequency == 6) frequency = 0;
    }
  }
  if (currentScore >= 1000) {
    frequency++;
    if (frequency < 3) {
      blocks[currentBlock].x = blocks[currentBlock].x + 12;
      blocks[currentBlock].y = blocks[currentBlock].y + randomMinMax(-3, 3);
    }

    if (frequency <= 6 && frequency > 3) {
      blocks[currentBlock].x = blocks[currentBlock].x - 12;
      blocks[currentBlock].y = blocks[currentBlock].y + randomMinMax(-3, 3);
      if (frequency == 6) frequency = 0;
    }
  }

  drawShelfBlocks();
  {
    mainCharacter.align(velocity[1]);
    mainCharacter.draw();
  }
}

function sortShelfBlocks() {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < blocks.length - 1; i++) {
      if (blocks[i].y > blocks[i + 1].y) {
        let temp = blocks[i];
        blocks[i] = blocks[i + 1];
        blocks[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
}
let highestShelfBIndex;

function highestBlockIndex() {
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i].y <= 0) {
      highestShelfBIndex = i - 1;
      break;
    }
  }
}

let i = 1;
let j = 1;
let z = 1;
var exitFlag = false;
let moveflag = false;
let updateScore = document.querySelector(".game-score span");
class character {
  constructor(x, y, width, height) {
    this.x1 = x;
    this.y1 = y;
    this.boy = 1;
    this.width = width;
    this.height = height;
    this.dx = 0;
    this.dy = 0;
    this.moveSpeed = 2;
    (this.jumpPower = -7), (this.onGround = true);
    this.numberOfbarriers = 0;
  }

  draw() {
    var boy = new Image();

    if (this.onGround == false && this.dy < 0) {
      boy.src = "../assets/images/jump_up" + mainCharacter.boy + ".png";
    } else if (this.onGround == false && this.dy > 0) {
      boy.src = "../assets/images/jump_fall" + mainCharacter.boy + ".png";
    } else {
      if (moveflag == false) {
        boy.src =
          "../assets/images/standing_frame" +
          mainCharacter.boy +
          "-" +
          Math.floor(j / 10 + 1) +
          ".png";
      } else {
        boy.src =
          "../assets/images/running_frame" +
          mainCharacter.boy +
          "-" +
          Math.floor(i / 10 + 1) +
          ".png";
      }
    }
    if (gameOver == true) {
      boy.src = "../assets/images/frame-got-hit" + mainCharacter.boy + ".png";
    }
    context.drawImage(boy, this.x1, this.y1, this.width, this.height);
    j += 1;
    i += 1;
    if (Math.floor(i / 10 + 1) >= 7) {
      i = 1;
    }
    if (Math.floor(j / 10 + 1) >= 3) {
      j = 1;
    }
    updateScore.innerHTML = currentScore;
    if (currentScore === 2000) {
      document.querySelector(".first-badge").style.opacity = "1";
    }
  }

  updatePosition() {
    if (
      this.x1 + this.width + this.dx > gameCanvas.width ||
      this.x1 + this.dx < 0
    ) {
      this.dx = -this.dx;
    }
    this.x1 += this.dx;
    this.y1 += this.dy;

    if (this.y1 + this.height >= game.ground) {
      this.y1 = game.ground - this.height;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }
  align(x) {
    this.y1 = this.y1 + x;
  }
  gravity() {
    if (this.onGround == false) {
      this.dy += game.gravity;
      this.dy *= game.drag;
    } else {
      this.dy = 0;
    }
    this.dx *= this.onGround ? game.groundDrag : game.drag;
  }
  up() {
    this.onGround = false;
    this.dy = this.jumpPower;
  }

  runLeft() {
    this.dx = -this.moveSpeed;
    moveflag = true;
  }
  runRight() {
    this.dx = this.moveSpeed;
    moveflag = true;
  }
}

const keyboard = (() => {
  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);
  const keyboard = {
    right: false,
    left: false,
    up: false,
    esc: false,
    any: false,
  };

  function keyHandler(e) {
    const state = e.type === "keydown";
    if (e.keyCode == 39) {
      keyboard.right = state;
    } else if (e.keyCode == 37) {
      keyboard.left = state;
    } else if (e.keyCode == 38) {
      keyboard.up = state;
      e.preventDefault();
    } else if (e.keyCode == 27) {
      keyboard.esc = state;
      e.preventDefault();
    }
    if (state) {
      keyboard.any = true;
    }
  }
  return keyboard;
})();

const game = {
  gravity: 0.2,
  drag: 0.999,
  groundDrag: 0.9,
  ground: gameCanvas.height,
};

function checkLive() {
  if (mainCharacter.y1 + mainCharacter.height >= game.ground) {
    mainCharacter.onGround = true;
    if (moveScreenCounter > 3) {
      gameOver = true;
    }
  } else {
    mainCharacter.onGround = false;
  }
  for (let i = 0; i < blocks.length; i++) {
    if (
      blocks[i].x <
        mainCharacter.x1 + mainCharacter.width - 0.13 * mainCharacter.width &&
      mainCharacter.x1 <
        blocks[i].x + blocks[i].width - 0.131 * mainCharacter.width &&
      blocks[i].y <= mainCharacter.y1 + mainCharacter.height &&
      mainCharacter.y1 + mainCharacter.height < blocks[i].y + 10
    ) {
      mainCharacter.onGround = true;
      moveScreenFlag = false;
      currentBlock = i;

      if (mainCharacter.y1 > 0 && mainCharacter.y1 <= 300) {
        openscreen = true;
      } else {
        openscreen = false;
      }
    }
  }
}

let openscreen = false;
let nonrepeat = true;
let moveScreenFlag = false;
let gameOver = false;
let moveScreenCounter = 0;
let currentScore = 0;
let levelScore = 5;
let width = 50;
let height = 50;
let alphabet_index = 0;
let escape = false;
let currentUser;

let gradient = context.createLinearGradient(0, 0, gameCanvas.width, 0);
let gradient2 = context.createLinearGradient(0, 0, gameCanvas.width, 0);
context.font = "70px sans-serif";
text_width = context.measureText("Game Over").width;
gradient.addColorStop("0", "magenta");
gradient.addColorStop("0.5", "green");
gradient.addColorStop("1.0", "red");
gradient2.addColorStop("0", "red");
gradient2.addColorStop("0.5", "green");
gradient2.addColorStop("1.0", "magenta");

let gameOverString = ["G", "a", "m", "e", " ", "O", "v", "e", "r"];
let text_string = "";
let mainCharacter = new character(
  gameCanvas.width / 2 - width / 2,
  game.ground - height,
  width,
  height
);
var hero = localStorage.getItem("hero");
mainCharacter.boy = hero;
var myanim;
mainCharacter.draw();
initBlocks();
mainLoop();
let gameOverModal = document.getElementById("gameOverModal");
let modalFlag = false;

function mainLoop() {
  if (gameOver == false) {
    if (keyboard.esc == false && escape == false) {
      moveflag = false;
      if (keyboard.up && mainCharacter.onGround) {
        mainCharacter.up();
      }
      if (keyboard.left) {
        mainCharacter.runLeft();
      }
      if (keyboard.right) {
        mainCharacter.runRight();
      }
      if (moveflag == true) {
        if (mainCharacter.moveSpeed < 7) {
          mainCharacter.moveSpeed += 0.1;
          mainCharacter.jumpPower = -7;
        } else {
          mainCharacter.jumpPower = -10;
        }
      } else {
        mainCharacter.jumpPower = -7;
        mainCharacter.moveSpeed = 2;
      }
      mainCharacter.updatePosition();
      if (moveScreenCounter > 10) movingScreen();
      checkLive();
      mainCharacter.gravity();
      context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      highestBlockIndex();
      if (openscreen && mainCharacter.y1 < 400 && mainCharacter.onGround) {
        movingShelfBlocks();
        moveScreenFlag = true;
        moveScreenCounter += 1;
        mainCharacter.onGround = false;
      }
      drawShelfBlocks();
      mainCharacter.draw();
    }
  } else {
    document.getElementById("gameoverscore").innerText = currentScore;
    localStorage.setItem("currentScore", currentScore);
    if (z == 280) {
      gameOverModal.style.display = "block";
      btn = gameOverModal
        .querySelector(".btn")
        .addEventListener("click", function () {
          currentUser = gameOverModal.querySelector(".playerName").value;
          localStorage.setItem("currentUser", currentUser);
          exitFlag = true;
        });
    }
    if (z % 10 == 0) {
      drawShelfBlocks();
      mainCharacter.draw();
      if (alphabet_index == 9) {
        text_string = "";
      }
      if (alphabet_index > 8) {
        if (alphabet_index == 18) {
          alphabet_index = 0;
          text_string = "";
        }
        context.fillStyle = gradient2;
        text_string += gameOverString[alphabet_index % 9];
        context.fillText(text_string, (gameCanvas.width - text_width) / 2, 250);
        alphabet_index += 1;
      } else {
        context.fillStyle = gradient;
        text_string += gameOverString[alphabet_index];
        context.fillText(text_string, (gameCanvas.width - text_width) / 2, 250);
        alphabet_index += 1;
      }
    }
    z += 1;
  }

  if (exitFlag) {
    cancelAnimationFrame(myanim);
    cancelAnimationFrame(mainLoop);
    window.location.href = "../index.html";
  } else {
    myanim = requestAnimationFrame(mainLoop);
    currentScore = moveScreenCounter * levelScore;
  }
}

cancelAnimationFrame(mainLoop);
