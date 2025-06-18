import pygame
import sys

pygame.init()

# ウィンドウ設定
WIDTH, HEIGHT = 500, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("ブロック崩し")

# 色
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED   = (255, 0, 0)
BLUE  = (0, 0, 255)

# パドル設定
paddle = pygame.Rect(200, 550, 100, 10)

# ボール設定
ball = pygame.Rect(250, 300, 10, 10)
ball_speed = [4, -4]

# ブロック生成
blocks = [pygame.Rect(x * 60 + 20, y * 30 + 20, 50, 20)
          for y in range(5) for x in range(7)]

clock = pygame.time.Clock()

# メインループ
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # キー入力
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and paddle.left > 0:
        paddle.move_ip(-6, 0)
    if keys[pygame.K_RIGHT] and paddle.right < WIDTH:
        paddle.move_ip(6, 0)

    # ボール移動
    ball.move_ip(*ball_speed)

    # 壁との衝突
    if ball.left <= 0 or ball.right >= WIDTH:
        ball_speed[0] *= -1
    if ball.top <= 0:
        ball_speed[1] *= -1
    if ball.bottom >= HEIGHT:
        print("Game Over")
        pygame.quit()
        sys.exit()

    # パドルとの衝突
    if ball.colliderect(paddle):
        ball_speed[1] *= -1

    # ブロックとの衝突
    for block in blocks[:]:
        if ball.colliderect(block):
            blocks.remove(block)
            ball_speed[1] *= -1
            break

    # 描画
    screen.fill(BLACK)
    pygame.draw.rect(screen, BLUE, paddle)
    pygame.draw.ellipse(screen, WHITE, ball)
    for block in blocks:
        pygame.draw.rect(screen, RED, block)

    pygame.display.flip()
    clock.tick(60)
