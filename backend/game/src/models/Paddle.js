export class Paddle {
	constructor(player, x, y, playerId) {
		this.player = player;
		this.playerId = playerId;
		this.x = x;
		this.y = y;
		this.width = 10;
		this.height = 40;
		this.speed = 10;
	}

	move(direction) {
		if (direction === "up") this.y -= this.speed;
		else if (direction === "down") this.y += this.speed;
	}
}

