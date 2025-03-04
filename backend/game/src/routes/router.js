import { createGame, movePaddle, startGame, getGameInfo } from "../controllers/gameController.js";

async function routes (fastify, opts)
{
	fastify.get("/game/create", createGame);
	fastify.get("/game/start", startGame);
	fastify.get("/game/info", getGameInfo);
	//curl -X POST -H "Content-Type: application/json" -d '{"player":"left", "direction":"down"}' http://0.0.0.0:4444/game/movePaddle
	fastify.post("/game/movePaddle", movePaddle);
}
	
export default routes;