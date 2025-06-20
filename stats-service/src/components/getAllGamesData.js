import { validateAuthorizationHeader } from "./verifyAuth.js";

export function getAllGamesData(request, reply) {
	try {
	  validateAuthorizationHeader(request);
  
	  const db = request.server.db;
  
	  const games = db.prepare(`
		SELECT winner_username, looser_username, looser_points, game_date
		FROM games
		ORDER BY game_date DESC
	  `).all();
  
	  return games;
	} catch (error) {
	  request.log.error(error);
	  return reply.code(401).send({ error: "Unauthorized or failed to get games data" });
	}
  }
  