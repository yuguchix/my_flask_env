const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddle = { x: 200, y: 570, w: 100, h: 10 };
let ball = { x: 250, y: 300, r: 8, dx: 5, dy: -5 };
let blocks = [];
let score = 0;
let particles = [];  // ← グローバルに追加


for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    const isBonus = Math.random() < 0.2; // 20%の確率でボーナスに
    blocks.push({
      x: 60 * col + 20,
      y: 30 * row + 20,
      w: 50,
      h: 20,
      broken: false,
      bonus: isBonus
    });
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

function isCleared() {
  return blocks.every(b => b.broken);
}

function getBackgroundColor(score) {
  if (score < 30) return "#000000";        // 初期：黒
  if (score < 60) return "#4169e1";        // 少し明るく
  if (score < 90) return "#ff7f50";
  if (score < 120) return "#4d004d";       // 紫っぽく
  if (score < 150) return "#00264d";       // 青系
  return "#264d00";                        // 緑系（最大）
}

function createExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: x,
      y: y,
      dx: Math.cos((Math.PI * 2) * (i / 20)) * (Math.random() * 2 + 1),
      dy: Math.sin((Math.PI * 2) * (i / 20)) * (Math.random() * 2 + 1),
      radius: 3,
      life: 30, // フレーム数
      color: "gold"
    });
  }
}


function draw() {
  ctx.fillStyle = getBackgroundColor(score);  // ← スコアで色決定
  ctx.fillRect(0, 0, canvas.width, canvas.height); // ← 背景を塗りつぶす

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
    if (!b.broken) {
      ctx.fillStyle = b.bonus ? "gold" : "red"; // ボーナスなら金色
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
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

  // ブロック衝突 ＆ スコア加算
  for (let b of blocks) {
    if (!b.broken &&
        ball.x > b.x && ball.x < b.x + b.w &&
        ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
      ball.dy *= -1;
      b.broken = true;
      score += b.bonus ? 50 : 10; // 💥 ボーナスならスコア5倍！

      if (b.bonus) {
        createExplosion(b.x + b.w / 2, b.y + b.h / 2); // 爆発発生
      }
      break;
    }
  }

  // パーティクルの描画と更新
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    p.life -= 1;

    if (p.life <= 0) {
      particles.splice(i, 1); // 寿命で削除
    }
  }

  // ゲームオーバー
  if (ball.y > canvas.height) {
    alert("ゲームオーバー！");
    document.location.reload();
  }


  // スコア表示（追加）
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

if (isCleared()) {
  alert("ステージクリア！");
  document.location.reload();
  return;
}

  requestAnimationFrame(draw);
}

draw();
