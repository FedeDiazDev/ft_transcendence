import { createGame, movePaddle, startGame, getGameInfo } from "../controllers/gameController.js";

async function routes (fastify, opts)
{
	fastify.get("/game/create", createGame);
	fastify.get("/game/start", startGame);
	fastify.post("/game/movePaddle", movePaddle);
}

export default routes;