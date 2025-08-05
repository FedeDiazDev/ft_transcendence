export class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 15;
		this.height = 15;
		this.vx = 0;
		this.vy = 0;
	}
	move(deltaTime) {
		this.x += this.vx * deltaTime;
		this.y += this.vy * deltaTime;
	}
}