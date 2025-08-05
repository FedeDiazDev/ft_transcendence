export class Paddle {
	constructor(player, x, y, playerId) {
		this.player = player;
		this.playerId = playerId;
		this.x = x;
		this.y = y;
		this.width = 15;
		this.height = 150;
		this.speed = 15;
	}

	move(direction) {
		if (direction === "up") {
			this.y = Math.max(0, this.y - this.speed);
		} else if (direction === "down") {
			this.y = Math.min(600 - this.height, this.y + this.speed);
		}		
	}
}
