import { validateAuthorizationHeader } from "./verifyAuth.js";

export function getAllPlayersData(request, reply) {
  try {
    validateAuthorizationHeader(request);

    const db = request.server.db;

    const players = db.prepare(`
      SELECT username, elo 
      FROM users 
      ORDER BY elo DESC
    `).all();

    return players;
  } catch (error) {
    request.log.error(error);
    return reply.code(401).send({ error: "Unauthorized or failed to get players data" });
  }
}
