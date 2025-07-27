export function getAllPlayersData(request, reply) {
  try {
    const db = request.server.db;

    console.log("Calling getAllPlayers...");
    console.log("Sending token:", request);


    const players = db.prepare(`
      SELECT username, elo 
      FROM players 
      ORDER BY elo DESC
    `).all();
    request.log.info("Players returned:");
    console.log(players)

    return players;
  } catch (error) {
    request.log.error(error);
    return reply.code(401).send({ error: "Unauthorized or failed to get players data" });
  }
}
