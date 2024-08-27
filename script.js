//selecting elements
const root = document.documentElement;
const runner = document.getElementById("runner");
const product = document.getElementById("product");
const powerUp = document.getElementById("power-up");
const buttonJump = document.getElementById("button-jump");
const buttonDuck = document.getElementById("button-duck");

//game variables
let isJumping = false;
let isDucking = false;
let speedFactor = 1;
let score = 0;
const products = ["zee-cinema.png"];

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
  if (!isDucking) {
    isDucking = true;
    runner.classList.add("duck");

    setTimeout(() => {
      isDucking = false;
      runner.classList.remove("duck");
    }, 300);
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
    document.location.reload();
  }
};

let isAlive = setInterval(() => {
  handleCollision();

  // Increase speed over time
  speedFactor += 0.0001;
  root.style.setProperty("--speedFactor", `${speedFactor}s`);

  product.style.animationDuration = `${2 / speedFactor}s`;
  powerUp.style.animationDuration = `${6 / speedFactor}s`;

  // Update score
  score += 1;
}, 10);
