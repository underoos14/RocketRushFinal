let boardWidth = 480;
let boardHeight = 270;

let rocket;
let broken_rocket;
let asteroid;
let astLevel;

//physics
let velocityY = 0;

let gameover = false;
let score = 0;

function start_game() {
  rocket = new component(50, 35, "rocket.svg", 40, boardHeight - 150);
  gamearea.start();
}

let gamearea = {
  canvas: document.getElementById("board"),
  start: function () {
    this.canvas.width = boardWidth;
    this.canvas.height = boardHeight;
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(update_gamearea, 20);
    window.addEventListener("keydown", function (e) {
      gamearea.key = e.keyCode;
    });
    window.addEventListener("keyup", function (e) {
      gamearea.key = false;
    });
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, boardWidth, boardHeight);
  },
};

function component(width, height, color, x, y) {
  this.image = new Image();
  this.image.src = color;
  this.width = width;
  this.height = height;
  this.velocityY = 2;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = gamearea.context;
    if (gameover) {
      return;
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.font = "20px, Courier New";
    score = score + 0.05;
    ctx.fillText(Math.round(score), 5, 20);
  };
  this.newPos = function () {
    this.y += this.velocityY;
  };
}
asteroidArray = [];
let lastThreeAsteroidsColors = [];
let zero = 10;
let range1 = Math.round(boardHeight * 0.33);
let range2 = Math.round(boardHeight * 0.66);
let range3 = Math.round(boardHeight - 35);

function section(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function placeAsteroid() {
  asteroid = new component(35, 35, null, 500, null);
  let chance = Math.random();
  let newColor;

  if (chance >= 0.7) {
    newColor = "asteroid_red.svg";
  } else if (chance >= 0.3 && chance < 0.7) {
    newColor = "asteroid_blue.svg";
  } else {
    newColor = "asteroid_purple.svg";
  }

  if (lastThreeAsteroidsColors.includes(newColor)) {
    newColor = lastThreeAsteroidsColors.find((color) => color !== newColor);
    if (!newColor) {
      newColor = lastThreeAsteroidsColors[0];
    }
  }

  asteroid.image.src = newColor;
  let yPosition;
  if (newColor === "asteroid_red.svg") {
    yPosition = section(zero, range1);
  } else if (newColor === "asteroid_blue.svg") {
    yPosition = section(range1, range2);
  } else {
    yPosition = section(range2, range3);
  }
  asteroid.y = yPosition;
  asteroidArray.push(asteroid);

  lastThreeAsteroidsColors.push(newColor);
  if (lastThreeAsteroidsColors.length > 3) {
    lastThreeAsteroidsColors.shift();
  }

  if (asteroidArray.length > 5) {
    asteroidArray.shift();
  }
}

function detectCollision(r, s) {
  return (
    r.x < s.x + 0.8 * s.width &&
    r.x + 0.8 * r.width > s.x &&
    r.y < s.y + 0.8 * s.height &&
    r.y + 0.8 * r.height > s.y
  );
}

setInterval(placeAsteroid, 1350);

function showGameOver() {
  document.getElementById("score-board").style.display = "flex";
  document.getElementById("finalscore").textContent = Math.round(score);
}

function update_gamearea() {
  if (!gameover) {
    gamearea.clear();

    for (let i = 0; i < asteroidArray.length; i++) {
      let asteroid = asteroidArray[i];
      if (score < 500) {
        asteroid.x -= 7;
        asteroid.update();
      } else if (score >= 500 && score < 1000) {
        asteroid.x -= 9;
        asteroid.update();
      } else {
        asteroid.x -= 11;
        asteroid.update();
      }
      // asteroid moves left

      if (detectCollision(rocket, asteroid)) {
        rocket.update();
        asteroid.update();
        gameover = true;
        gamearea.stop();
        showGameOver(); // Stop game loop
      }
    }

    rocket.y = Math.min(
      Math.max(rocket.y + velocityY, 0),
      boardHeight - rocket.height
    ); //deals with dodging of rocket and confines rocket within canvas
    rocket.update();
  }
  if (gamearea.key && gamearea.key == 38) {
    rocket.velocityY = -3;
  }
  if (gamearea.key && gamearea.key == 40) {
    rocket.velocityY = 3;
  }
  rocket.newPos();
}
//Restart game
function restart_game() {
  gameover = false;
  score = 0;
  document.getElementById("score-board").style.display = "none";
  location.reload();
}

//STAR BACKGROUND
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const STAR_COUNT = 1;
let result = "";
for (let i = 0; i < STAR_COUNT; i++) {
  result += `${randomNumber(-50, 50)}vw ${randomNumber(
    -50,
    50
  )}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
}
console.log(result.substring(0, result.length - 1));
