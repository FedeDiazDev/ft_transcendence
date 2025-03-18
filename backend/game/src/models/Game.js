import { GameStatus } from "./GameStatus.js";
import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

export class Game {
	constructor(player1Id, player2Id) {
		this.status = GameStatus.WAITING;
		this.ball = new Ball(400, 200);
		this.paddles = {
			left: new Paddle("left", 20, 150, player1Id),
			right: new Paddle("right", 770, 150, player2Id),
		};
		this.points = 3;
		this.leftPoints = 0;
		this.rightPoints = 0;
	}
	start() {
		this.status = GameStatus.PLAYING;
	}

	movePaddle(player, direction) {
		if (this.paddles[player]) {
			this.paddles[player].move(direction);
		}
	}

	update() {
		if (this.status === GameStatus.PLAYING) {
			this.ball.move();
			this.paddleColision();			
		}
		if (this.ball.x <= 0) {
			this.resetBall();
			this.checkScore("right");
		}
		else if (this.ball.x + this.ball.width >= 800) {
			this.resetBall();
			this.checkScore("left");
		}
		if (this.ball.y <= 0 || this.ball.y + this.ball.height >= 400) {
			this.ball.vy *= -1;
		}
	}

	resetBall() {
		this.ball.x = 400;
		this.ball.y = 200;
		if (this.status === GameStatus.PLAYING) {
			this.ball.vx *= -1;
			this.ball.vy = Math.random() > 0.5 ? 10 : -10;
		}
		else
		{
			this.ball.vx = 0;
			this.ball.vy = 0;
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
			this.ball.vy = (hitZone - 0.5) * 5 * (Math.abs(this.ball.vx) / 20);
		}
		else if (this.ball.x + this.ball.width >= paddleRight.x && this.ball.y + this.ball.height > paddleRight.y && this.ball.y < paddleRight.y + paddleRight.height) {
			let hitZone = (this.ball.y - paddleRight.y) / (paddleRight.height / 8);
			this.ball.vx *= -1;
			this.ball.vy = (hitZone - 0.5) * 5 * (Math.abs(this.ball.vx) / 20);
		}
	}
}