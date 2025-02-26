import { GameStatus } from "./GameStatus.js";
import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

export class Game {
	constructor() {
		this.status = GameStatus.WAITING;
		this.ball = new Ball(50, 50);
		this.paddles = {
			left: new Paddle("left", 10, 50),
			right: new Paddle("right", 480, 50),
		};
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
	}
}