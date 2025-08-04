import { GameStatus } from "./GameStatus.js";
import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

export class Game {
    constructor(player1Id, player2Id) {
        this.date = new Date();
        this.status = GameStatus.WAITING;
        this.ball = new Ball(600, 300);
        this.paddles = {
            left: new Paddle("left", 0, 225, player1Id),
            right: new Paddle("right", 1185, 225, player2Id),
        };

        this.targetFps = 60;
        this.targetFrameTime = 1000 / this.targetFps;
        this.fixedDeltaTime = 1 / this.targetFps;

        this.ballSpeed = 200;
        this.delayTime = 1000;
        this.points = 10;
        this.leftPoints = 0;
        this.rightPoints = 0;

        this.ballStartDelay = 0;

        this.isRunning = false;
        this.gameLoopInterval = null;
    }

    start() {
        this.status = GameStatus.PLAYING;
        this.ball.x = 600;
        this.ball.y = 300;
        this.ball.vx = 0;
        this.ball.vy = 0;

        this.ballStartDelay = this.delayTime;

        this.startGameLoop();
    }

    startGameLoop() {
        if (this.isRunning) return;

        this.isRunning = true;

        const gameLoop = async () => {
            while (this.isRunning && this.status !== GameStatus.TERMINATED) {
                const frameStart = performance.now();

                this.update();

                const frameEnd = performance.now();
                const frameDuration = frameEnd - frameStart;

                if (frameDuration < this.targetFrameTime) {
                    const sleepTime = this.targetFrameTime - frameDuration;
                    await this.sleep(sleepTime);
                }
            }
        };
        gameLoop();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    movePaddle(player, direction) {
        const paddle = this.paddles[player];
        paddle.move(direction);
    }

    update() {
        const deltaTime = this.fixedDeltaTime;

        if (this.status === GameStatus.PLAYING) {
            if (this.ballStartDelay > 0) {
                this.ballStartDelay -= this.targetFrameTime;
                if (this.ballStartDelay <= 0) {
                    this.ball.vy = Math.random() > 0.5 ? this.ballSpeed : -this.ballSpeed;
                    this.ball.vx = Math.random() > 0.5 ? this.ballSpeed : -this.ballSpeed;
                }
            } else {
                this.ball.move(deltaTime);
                this.paddleColision();
            }
        }

        if (this.ball.x <= 0) {
            this.resetBall();
            this.checkScore("right");
        }
        else if (this.ball.x + this.ball.width >= 1200) {
            this.resetBall();
            this.checkScore("left");
        }

        if (this.ball.y <= 0) {
            this.ball.y = 0;
            this.ball.vy = Math.abs(this.ball.vy);
        }
        else if (this.ball.y + this.ball.height >= 600) {
            this.ball.y = 600 - this.ball.height;
            this.ball.vy = -Math.abs(this.ball.vy);
        }
    }

    resetBall() {
        this.ball.x = 600;
        this.ball.y = 300;
        this.ball.vx = 0;
        this.ball.vy = 0;

        if (this.status === GameStatus.PLAYING) {
            this.ballStartDelay = this.delayTime;
        }
    }

    checkScore(player) {
        if (player === "left")
            this.leftPoints++;
        else if (player === "right")
            this.rightPoints++;

        if (this.leftPoints >= this.points || this.rightPoints >= this.points) {
            this.status = GameStatus.GAME_OVER;
            this.stop();
        }
    }

    paddleColision() {
        const paddleLeft = this.paddles.left;
        const paddleRight = this.paddles.right;

        if (this.ball.x <= paddleLeft.x + paddleLeft.width &&
            this.ball.y + this.ball.height > paddleLeft.y &&
            this.ball.y < paddleLeft.y + paddleLeft.height &&
            this.ball.vx < 0) {

            let hitZone = (this.ball.y - paddleLeft.y) / (paddleLeft.height / 8);
            hitZone = Math.min(0.8, Math.max(0.2, hitZone));
            this.ball.vx = Math.abs(this.ball.vx);
            this.ball.vy = (hitZone - 0.5) * this.ballSpeed * 0.5;

            this.ball.x = paddleLeft.x + paddleLeft.width + 1;
        }
        else if (this.ball.x + this.ball.width >= paddleRight.x &&
            this.ball.y + this.ball.height > paddleRight.y &&
            this.ball.y < paddleRight.y + paddleRight.height &&
            this.ball.vx > 0) {

            let hitZone = (this.ball.y - paddleRight.y) / (paddleRight.height / 8);
            //hitZone = Math.min(0.9, Math.max(0.1, hitZone));
            this.ball.vx = -Math.abs(this.ball.vx);
            this.ball.vy = (hitZone - 0.5) * this.ballSpeed * 0.5;

            this.ball.x = paddleRight.x - this.ball.width - 1;
        }
    }
}