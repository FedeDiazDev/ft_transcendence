import { GameStatus } from "./GameStatus.js";
import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { canvasH } from "../controllers/gameController.js";
import { canvasW } from "../controllers/gameController.js";

export class Game {
	constructor() {
		this.status = GameStatus.WAITING;
		this.ball = new Ball(50, 50);
		this.paddles = {
			left: new Paddle("left", 10, 50),
			right: new Paddle("right", 480, 50),
		};
		this.points = 10;
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
		}		
		if (this.ball.x <= 0) {
			this.resetBall();
			this.checkScore("left");
		}		
		else if (this.ball.x + this.ball.width >= canvasW) {
			this.resetBall();
			this.checkScore("right");
		}
		if (this.ball.y <= 0 || this.ball.y + this.ball.height >= canvasH) {
			this.ball.vy *= -1;
		}
	}

	resetBall() {
		this.ball.x = 50;
		this.ball.y = 50;
		if (this.status === GameStatus.PLAYING) {
			this.ball.vx *= -1;
			this.ball.vy = Math.random() > 0.5 ? 10 : -10;
		}
	}

	checkScore(player) {
		if (player === "left")
			this.leftPoints++;
		else if (player === "right")
			this.rightPoints++;
		if (this.leftPoints >= 10 || this.rightPoints >= 10)
			this.status = GameStatus.GAME_OVER;
	}

	paddleColision()
	{
		if ()
	}
}