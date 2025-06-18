import { validateAuthorizationHeader } from "./verifyAuth.js";
import { calculateElo } from "./calculateElo.js";

export default function postGame(request, reply) {
    try {
        const payload = validateAuthorizationHeader(request);

        const db = request.server.db;
        
        const {
            winner_username,
            looser_username,
            looser_points,
            game_date,
        } = request.body;

        // Format the date string for SQLite
        const formattedDate = request.body.game_date.replace('T', ' ').split('.')[0];

        // Ensure both users are in the `players` table with ELO
        db.prepare(`
        INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)
        `).run(winner_username);
        db.prepare(`
        INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)
        `).run(looser_username);
        
        // Get current ELOs
        const winnerData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(winner_username);
        const loserData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(looser_username);

        // Get new elo
        const { winnerNewElo, loserNewElo } = calculateElo(winnerData.elo, loserData.elo);
        
        // Update elo
        db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(winnerNewElo, winner_username);
        db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(loserNewElo, looser_username);

        const query = db.prepare(`
            INSERT INTO games (
                winner_username, winner_points, looser_username, looser_points, game_date
            ) VALUES (?, ?, ?, ?, ?)
        `);
        
        query.run(request.body.winner_username, 10, request.body.looser_username, request.body.looser_points, formattedDate);
        reply.status(200).send({
            message : "Game stats and ELO saved in database"
        });
        //console.log("Game stats saved in database");
        //console.log(request.body);
        //console.log("Game stats saved in database");
    } catch(error) {
        request.log.error(error);
        reply.status(500).send({
            error: "Failed to save game or update ELO"
        })
    }
}
