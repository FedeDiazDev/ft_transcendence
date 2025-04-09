export class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 15;
		this.height = 15;
		this.vx = 10;
		this.vy = 10;
	}
	move() {
		this.x += this.vx;
		this.y += this.vy;
	}
}