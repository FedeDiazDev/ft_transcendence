export class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 5;
		this.height = 5;
		this.vx = 10;
		this.vy = 10;
	}
	move() {
		this.x += this.vx;
		this.y += this.vy;
	}
}