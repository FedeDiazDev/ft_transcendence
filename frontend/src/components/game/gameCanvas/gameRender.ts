import { GameState, Paddle } from "../../../types/types";

export function draw (gameState: GameState, ctx: any, canvas: any) {
	if (!ctx || !gameState?.ball) return;
	// console.log(" Redibujando con ball:", gameState.ball);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";

	ctx.beginPath();
	ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
	ctx.fill();

	Object.values(gameState.paddles).forEach((paddle: Paddle) => {
		ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	});
};