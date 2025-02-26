export class Paddle {
	constructor(player, x, y, width, height) {
		this.player = player;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = 10;
	}

	move(direction) {
		if (direction === "up") this.y -= this.speed;
		else if (direction === "down") this.y += this.speed;
	}
}

