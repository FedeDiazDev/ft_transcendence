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
		this.lastTime = performance.now();
		this.ballSpeed = 500;
		this.currentTime = performance.now();
		this.deltaTime = 0;
		this.delayTime = 1000;
		this.points = 10;
		this.leftPoints = 0;
		this.rightPoints = 0;
	}
	start() {
		this.status = GameStatus.PLAYING;

		this.ball.x = 600;
		this.ball.y = 300;

		this.ball.vx = 0;
		this.ball.vy = 0;

		setTimeout(() => {
			this.ball.vy = Math.random() > 0.5 ? this.ballSpeed : - this.ballSpeed;
			this.ball.vx = Math.random() > 0.5 ? this.ballSpeed : - this.ballSpeed;
		}, this.delayTime);
	}

	movePaddle(player, direction) {
		if (this.paddles[player]) {
			this.paddles[player].move(direction);
		}
	}

	update() {
		this.currentTime = performance.now();
		this.deltaTime = (this.currentTime - this.lastTime) / 1000;
		this.lastTime = this.currentTime;
		if (this.status === GameStatus.PLAYING) {
			this.ball.move(this.deltaTime);
			this.paddleColision();			
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
			setTimeout(() => {
				this.ball.vy = Math.random() > 0.5 ? 300 : -300;
				this.ball.vx = Math.random() > 0.5 ? 300 : -300;
			}, this.delayTime);
		}
	}

	checkScore(player) {
		if (player === "left")
			this.leftPoints++;
		else if (player === "right")
			this.rightPoints++;
		if (this.leftPoints >= this.points || this.rightPoints >= this.points)
			this.status = GameStatus.GAME_OVER;
	}

	paddleColision() {
		const paddleLeft = this.paddles.left;
		const paddleRight = this.paddles.right;

		if (this.ball.x <= paddleLeft.x + paddleLeft.width && this.ball.y + this.ball.height > paddleLeft.y && this.ball.y < paddleLeft.y + paddleLeft.height) {
			let hitZone = (this.ball.y - paddleLeft.y) / (paddleLeft.height / 8);
			this.ball.vx *= -1;
			this.ball.vy = (hitZone - 0.5) * this.ballSpeed * (Math.abs(this.ball.vx) / (this.ballSpeed * 4));
		}
		else if (this.ball.x + this.ball.width >= paddleRight.x && this.ball.y + this.ball.height > paddleRight.y && this.ball.y < paddleRight.y + paddleRight.height) {
			let hitZone = (this.ball.y - paddleRight.y) / (paddleRight.height / 8);
			this.ball.vx *= -1;
			this.ball.vy = (hitZone - 0.5) * this.ballSpeed * (Math.abs(this.ball.vx) / (this.ballSpeed * 4));
		}
	}
}