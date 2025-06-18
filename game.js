const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddle = { x: 200, y: 570, w: 100, h: 10 };
let ball = { x: 250, y: 300, r: 8, dx: 5, dy: -5 };
let blocks = [];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    blocks.push({ x: 60 * col + 20, y: 30 * row + 20, w: 50, h: 20, broken: false });
  }
}

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function updatePaddle() {
  const paddleSpeed = 8; // ← ここを変えると速さを調整できる
  if (keys["ArrowLeft"] && paddle.x > 0) {
    paddle.x -= paddleSpeed;
  }
  if (keys["ArrowRight"] && paddle.x + paddle.w < canvas.width) {
    paddle.x += paddleSpeed;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePaddle();

  // パドル
  ctx.fillStyle = "blue";
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  // ボール
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // ブロック
  ctx.fillStyle = "red";
  for (let b of blocks) {
    if (!b.broken) ctx.fillRect(b.x, b.y, b.w, b.h);
  }

  // 移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 壁衝突
  if (ball.x <= ball.r || ball.x >= canvas.width - ball.r) ball.dx *= -1;
  if (ball.y <= ball.r) ball.dy *= -1;

  // パドル衝突
  if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.w &&
      ball.y + ball.r >= paddle.y) ball.dy *= -1;

  // ブロック衝突
  for (let b of blocks) {
    if (!b.broken &&
        ball.x > b.x && ball.x < b.x + b.w &&
        ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
      ball.dy *= -1;
      b.broken = true;
    }
  }

  // ゲームオーバー
  if (ball.y > canvas.height) {
    alert("ゲームオーバー！");
    document.location.reload();
  }

  requestAnimationFrame(draw);
}

draw();
