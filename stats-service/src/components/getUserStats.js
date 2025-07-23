import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function getUserStats(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(401).send({ error: "Token missing" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const username = payload.username;
    const db = request.server.db;

    const wins = db.prepare(`
        SELECT COUNT(*) as count 
        FROM games 
        WHERE winner_username = ?
      `).get(username);

    const losses = db.prepare(`
        SELECT COUNT(*) as count 
        FROM games 
        WHERE looser_username = ?
      `).get(username);

    const recentGames = db.prepare(`
        SELECT * FROM games 
        WHERE winner_username = ? OR looser_username = ? 
        ORDER BY game_date DESC LIMIT 5
      `).all(username, username);

    return {
      username,
      wins: wins.count,
      losses: losses.count,
      recentGames
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to get user statistics" });
  }
}

export function getFriendStats(request, reply) {
  try {
    const friendname = request.params.username;
    const db = request.server.db;

    // Get wins count
    const wins = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE winner_username = ?
        `).get(friendname);

    // Get losses count
    const losses = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE looser_username = ?
        `).get(friendname);

    // Get recent games (limit to 5)
    const recentGames = db.prepare(`
            SELECT * FROM games 
            WHERE winner_username = ? OR looser_username = ? 
            ORDER BY game_date DESC LIMIT 5
            `).all(friendname, friendname);

    return {
      username: friendname,
      wins: wins.count,
      losses: losses.count,
      recentGames
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to get friend statistics' });
  }
}