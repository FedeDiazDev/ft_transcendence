import { calculateElo } from "./calculateElo.js";

export async function saveGameAndUpdateElo(db, {
  winner_username,
  looser_username,
  looser_points,
  game_date
}) {
  const formattedDate = game_date.replace('T', ' ').split('.')[0];

  // Ensure both users exist
  db.prepare(`INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)`).run(winner_username);
  db.prepare(`INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)`).run(looser_username);

  const winnerData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(winner_username);
  const loserData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(looser_username);

  const { winnerNewElo, loserNewElo } = calculateElo(winnerData.elo, loserData.elo);

  db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(winnerNewElo, winner_username);
  db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(loserNewElo, looser_username);

  db.prepare(`
    INSERT INTO games (
      winner_username, winner_points, looser_username, looser_points, game_date
    ) VALUES (?, ?, ?, ?, ?)
  `).run(winner_username, 10, looser_username, looser_points, formattedDate);

 // console.log("✅ Game result saved and ELO updated");
}
