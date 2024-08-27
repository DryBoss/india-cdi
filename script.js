//selecting elements
const root = document.documentElement;
const scoreShow = document.getElementById("score");
const highscoreShow = document.getElementById("highscore");
const lifeShow = document.getElementById("life");
const runner = document.getElementById("runner");
const product = document.getElementById("product");
const powerUp = document.getElementById("power-up");
const buttonJump = document.getElementById("button-jump");
const buttonDuck = document.getElementById("button-duck");
const gameOver = document.getElementById("game-over");
const finalComment = document.getElementById("final-comment");
const finalScore = document.getElementById("final-score");
const buttonPlayAgain = document.getElementById("play-again");

//game variables
let gamePaused = false;
let isJumping = false;
let isDucking = false;
let speedFactor = 1;
let score = 0;
if (localStorage.getItem("highScore")) {
  //setting initial highscore, when website finish loading
  highscoreShow.textContent = localStorage.getItem("highScore");
} else {
  localStorage.setItem("highScore", 0);
}
let highscore = localStorage.getItem("highScore");
let life = 3;
const products = ["zee-cinema.png"];
let collisionHandled = false;

const disableAnimations = () => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
    * {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
};

//controls
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
    case "Space":
      if (!isJumping) {
        jump();
      }
      break;
    case "ArrowDown":
    case "ControlLeft":
    case "ControlRight":
      if (!isDucking) {
        duck();
      }
      break;
  }
});

buttonJump.addEventListener("click", () => {
  if (!isJumping) {
    jump();
  }
});

buttonDuck.addEventListener("click", () => {
  if (!isDucking) {
    duck();
  }
});

buttonPlayAgain.addEventListener("click", () => {
  document.location.reload();
});

const jump = () => {
  if (!isJumping) {
    isJumping = true;
    runner.classList.add("jump");

    setTimeout(() => {
      isJumping = false;
      runner.classList.remove("jump");
    }, 400);
  }
};

const duck = () => {
  if (!gamePaused) {
    if (!isDucking) {
      isDucking = true;
      runner.classList.add("duck");

      setTimeout(() => {
        isDucking = false;
        runner.classList.remove("duck");
      }, 300);
    }
  }
};

product.addEventListener("animationend", (event) => {
  product.src =
    "./assets/images/products/" +
    products[Math.floor(Math.random()) * products.length];
  product.style.animation = "none";
  product.style.bottom = Math.floor(Math.random() * 6) + "rem";
  product.offsetHeight; // Trigger reflow to restart animation
  product.style.animation = `move ${2 / speedFactor}s linear`;
});

const checkCollision = (runnerRect, productRect) => {
  return !(
    runnerRect.right < productRect.left ||
    runnerRect.left > productRect.right ||
    runnerRect.bottom < productRect.top ||
    runnerRect.top > productRect.bottom
  );
};

const handleCollision = () => {
  const runnerRect = runner.getBoundingClientRect();

  const productRect = product.getBoundingClientRect();
  if (checkCollision(runnerRect, productRect)) {
    if (!collisionHandled) {
      life--; // Decrease life by 1
      lifeShow.textContent = life;
      collisionHandled = true;
      if (!life) {
        finalComment.textContent =
          score > highscore
            ? "oi mama na pls!"
            : "dhon khelso vaiya, shei hoice!";
        finalScore.textContent = Math.floor(score);
        if (score > highscore) {
          localStorage.setItem("highScore", Math.floor(score));
        }
        gameOver.style.display = "block";
        window.clearInterval(gameLoop);
        disableAnimations();
        gamePaused = true;
      } // Set flag to true to indicate collision handled
    }
  } else {
    collisionHandled = false; // Reset flag if no collision
  }

  const powerUpRect = powerUp.getBoundingClientRect();
  if (checkCollision(runnerRect, powerUpRect)) {
    score += 5;
    life++;
    lifeShow.textContent = life;
    powerUp.style.display = "none"; // Hide the power-up after collection
    setTimeout(() => (powerUp.style.display = "block"), 10000); // Reappear after 10 seconds
  }
};

let gameLoop = setInterval(() => {
  handleCollision();

  // Increase speed over time
  speedFactor += 0.0001;
  root.style.setProperty("--speedFactor", `${speedFactor}s`);

  product.style.animationDuration = `${2 / speedFactor}s`;
  powerUp.style.animationDuration = `${6 / speedFactor}s`;

  // Update score
  score += 0.01;
  scoreShow.textContent = Math.floor(score);
}, 10);
