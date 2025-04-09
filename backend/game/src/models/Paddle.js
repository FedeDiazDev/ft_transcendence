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
		if (direction === "up" && this.y - this.speed >= 0) {
			this.y -= this.speed;
		}		
		else if (direction === "down" && this.y + this.height + this.speed <= 600) {
			this.y += this.speed;
		}
	}
	
}

