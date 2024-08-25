//selecting elements
const runner = document.getElementById("runner");
const products = [
  document.getElementById("product1"),
  document.getElementById("product2"),
  document.getElementById("product3"),
];
const powerUp = document.getElementById("power-up");

//game variables
let isJumping = false;
let isDucking = false;
let speed = 2;
let score = 0;

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

const jump = () => {
  if (!isJumping) {
    isJumping = true;
    runner.classList.add("jump");

    setTimeout(() => {
      isJumping = false;
      runner.classList.remove("jump");
    }, 300);
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

  products.forEach((product) => {
    const productRect = product.getBoundingClientRect();
    if (checkCollision(runnerRect, productRect)) {
      alert(`Game Over! Final Score: ${score}`);
      document.location.reload();
    }
  });

  /*const powerUpRect = powerUp.getBoundingClientRect();
  if (checkCollision(runnerRect, powerUpRect)) {
    score += 10;
    powerUp.style.display = "none"; // Hide the power-up after collection
    setTimeout(() => (powerUp.style.display = "block"), 10000); // Reappear after 10 seconds
  }*/
};

let isAlive = setInterval(() => {
  handleCollision();

  // Increase speed over time
  speed += 0.001;

  products.forEach((product) => {
    product.style.animationDuration = `${2 / speed}s`;
  });
  powerUp.style.animationDuration = `${6 / speed}s`;

  // Update score
  score += Math.floor(speed);
}, 10);
