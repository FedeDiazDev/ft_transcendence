import { createGame, movePaddle, startGame, getGameInfo, moveBall } from "../controllers/gameController.js";
import { createTournament, listOpenTournaments, addPlayerToTournament, closeTournament } from "../controllers/tournamentController.js"

async function routes (fastify, opts)
{
	//*GET
	fastify.get("/api/game/state", getGameInfo);
	
	//*POST
	fastify.post("/api/game/create", createGame);
	fastify.post("/api/game/start", startGame);
	//curl -X POST -H "Content-Type: application/json" -d '{"player":"left", "direction":"down"}' http://0.0.0.0:3000/game/movePaddle
	fastify.post("/api/game/movePaddle", movePaddle);
	fastify.post("/api/game/moveBall", moveBall);

	//*Tournaments
	fastify.post("/api/game/tournament/create", createTournament);
	fastify.post("/api/game/tournament/addPlayer", addPlayerToTournament);;
	fastify.get("/api/game/tournament/open", listOpenTournaments);	
	fastify.get("/api/game/tournament/close", closeTournament);
}
	
export default routes;