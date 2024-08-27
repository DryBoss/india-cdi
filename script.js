// Selecting elements
const root = document.documentElement; //document
const scoreShow = document.getElementById("score"); //game info section
const highscoreShow = document.getElementById("highscore");
const lifeShow = document.getElementById("life");
const runner = document.getElementById("runner"); //game board section
const product = document.getElementById("product");
const powerUp = document.getElementById("power-up");
const buttonJump = document.getElementById("button-jump"); //buttons section
const buttonDuck = document.getElementById("button-duck");
const gameOverDialog = document.getElementById("game-over"); //game over dialog
const finalComment = document.getElementById("final-comment");
const finalScore = document.getElementById("final-score");
const buttonPlayAgain = document.getElementById("play-again");

//game variables
let gamePaused = false; //game variables
let speedFactor = 1;
let isJumping = false;
let isDucking = false;
let collisionHandled = false;
const damageTaken = new Audio("./assets/sound/damage.mp3");
let score = 0; //score variables
//checking if highscore already available and setting it to show in highscore show paragraph
if (localStorage.getItem("highScore")) {
  highscoreShow.textContent = localStorage.getItem("highScore");
} else {
  localStorage.setItem("highScore", 0);
}
let highscore = localStorage.getItem("highScore"); //setting highsore from localstorage
let life = 3; //life variables
const products = ["zee-cinema.png"]; //product array indicating image

//disabling all animations to freeze the gme after loss
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
//keyboard controls
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
//ui button controls
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
//dialog button controls
buttonPlayAgain.addEventListener("click", () => {
  document.location.reload();
});

//movement functions
const jump = () => {
  if (!isJumping) {
    isJumping = true;
    runner.classList.add("jump");
    setTimeout(() => {
      isJumping = false;
      runner.classList.remove("jump");
    }, 500);
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
      }, 500);
    }
  }
};

//each product cycle end
product.addEventListener("animationend", (event) => {
  //random selecting product
  product.src =
    "./assets/images/products/" +
    products[Math.floor(Math.random()) * products.length];
  //Starting new animation with new speed and height
  product.style.animation = "none";
  product.style.bottom = Math.floor(Math.random() * 4) + "rem";
  product.offsetHeight; // Trigger reflow to restart animation
  product.style.animation = `move ${2 / speedFactor}s linear`;
});

//checking for collision
const checkCollision = (runnerRect, productRect) => {
  return !(
    runnerRect.right < productRect.left ||
    runnerRect.left > productRect.right ||
    runnerRect.bottom < productRect.top ||
    runnerRect.top > productRect.bottom
  );
};

const updateLife = () => {
  switch (life) {
    case 0:
      lifeShow.style.width = "0px";
      break;
    case 1:
      lifeShow.style.width = "30px";
      break;
    case 2:
      lifeShow.style.width = "60px";
      break;
    case 3:
      lifeShow.style.width = "90px";
      break;
    case 4:
      lifeShow.style.width = "120px";
      break;
    case 5:
      lifeShow.style.width = "150px";
      break;
  }
};

//what to do after collision
const handleCollision = () => {
  const runnerRect = runner.getBoundingClientRect();
  //for collison with product
  const productRect = product.getBoundingClientRect();
  if (checkCollision(runnerRect, productRect)) {
    if (!collisionHandled) {
      damageTaken.play();
      life--;
      updateLife();
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
        gameOverDialog.style.display = "block";
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
    life < 5 ? life++ : life;
    updateLife();
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
