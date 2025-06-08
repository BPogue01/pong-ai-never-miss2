const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let leftY = canvas.height / 2 - paddleHeight / 2;
let rightY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let playerControlled = true;
let flashTimer = 0;
let audioStarted = false;

const paddleHitSound = new Audio('ping.wav');
const scoreSound = new Audio('score.wav');
const bgMusic = new Audio('bgmusic.wav');
bgMusic.loop = true;
bgMusic.volume = 0.3;

function startAudio() {
  if (!audioStarted) {
    paddleHitSound.play().catch(() => {});
    scoreSound.play().catch(() => {});
    bgMusic.play().catch(() => {});
    audioStarted = true;
  }
}

document.addEventListener('keydown', (e) => {
  startAudio();
  if (e.key === 'ArrowUp') rightY -= 20;
  if (e.key === 'ArrowDown') rightY += 20;
  if (e.key === 't') playerControlled = !playerControlled;
});

document.addEventListener('click', startAudio);

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3;
  flashTimer = 20;  // longer flash duration
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawRetroGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function draw() {
  if (flashTimer > 0) {
    drawRect(0, 0, canvas.width, canvas.height, flashTimer % 4 < 2 ? 'red' : 'black');
    flashTimer--;
  } else {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
  }

  drawRetroGrid();
  drawRect(0, leftY, paddleWidth, paddleHeight, 'lime');
  drawRect(canvas.width - paddleWidth, rightY, paddleWidth, paddleHeight, 'cyan');
  drawRect(ballX, ballY, ballSize, ballSize, 'white');
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  leftY = ballY - paddleHeight / 2 + ballSize / 2;

  if (!playerControlled) {
    rightY = ballY - paddleHeight / 2 + ballSize / 2;
  } else {
    rightY = Math.max(0, Math.min(canvas.height - paddleHeight, rightY));
  }

  if (ballX <= paddleWidth) {
    if (ballY + ballSize >= leftY && ballY <= leftY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      paddleHitSound.play();
    } else {
      scoreSound.play();
      resetBall();
    }
  }

  if (ballX + ballSize >= canvas.width - paddleWidth) {
    if (ballY + ballSize >= rightY && ballY <= rightY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      paddleHitSound.play();
    } else {
      scoreSound.play();
      resetBall();
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
