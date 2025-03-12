export class Paddle {
	constructor(player, x, y, playerId) {
		this.player = player;
		this.playerId = playerId;
		this.x = x;
		this.y = y;
		this.width = 10;
		this.height = 100;
		this.speed = 10;
	}

	move(direction) {
		if ((this.y - this.speed) >= 0 && (this.y + this.height + this.speed) <= 400) {			
			if (direction === "up")
				this.y -= this.speed;
			else if (direction === "down")
				this.y += this.speed;
		}
		
	}
}

