import { updateBall } from "../../../api/game/gameAPI";
import { GameState } from "../../../types/types";
import { draw } from "./gameRender";



export async function updateGameState(gameState: GameState, ctx: any, canvas: any) {
	// console.log(" updateGameState ejecutado");
	if (gameState.status !== "playing") {
		console.warn(" Estado no es PLAYING:", gameState.status);
		return;
	}
	try {
		const updatedState = await updateBall();
		// console.log(" Estado recibido de updateBall:", updatedState);

		if (updatedState && updatedState.ball) {
			gameState = { ...gameState, ...updatedState };
			draw(gameState, ctx, canvas);
		} else {
			console.warn(" updateBall no devolvió datos válidos");
		}
	} catch (error) {
		console.error("Error al actualizar la bola:", error);
	}
};
