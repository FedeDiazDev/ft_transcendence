import { createGame, movePaddle, startGame, getGameInfo, moveBall } from "../controllers/gameController.js";

async function routes (fastify, opts)
{
	//*GET
	fastify.get("/game/state", getGameInfo);
	
	//*POST
	fastify.post("/game/create", createGame);
	fastify.post("/game/start", startGame);
	//curl -X POST -H "Content-Type: application/json" -d '{"player":"left", "direction":"down"}' http://0.0.0.0:4444/game/movePaddle
	fastify.post("/game/movePaddle", movePaddle);
	fastify.post("/game/moveBall", moveBall);
}
	
export default routes;