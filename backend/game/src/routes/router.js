import { createGame, movePaddle } from "../controllers/gameController.js";

async function routes (fastify, opts)
{
	fastify.get("/game", createGame);
	fastify.post("/movePaddle", movePaddle);
}

export default routes;