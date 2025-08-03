import { calculateElo } from "./calculateElo.js";


export async function storeAlias(req, reply) {
  const { alias, real_username } = req.body;
  const db = req.server.db;
  
  console.log("Received Alias:", alias);
  console.log("Received Real Username:", real_username);

  if (!alias || !real_username) {
    return reply.status(400).send({ error: "Alias and real username are required" });
  }

  try {
    // Ensure the real_username exists in the players table
    const userExists = db.prepare("SELECT username FROM players WHERE username = ?").get(real_username);
    if (!userExists) {
      // Insert the real_username into players table with a default ELO of 500 if not exists
      db.prepare("INSERT INTO players (username, elo) VALUES (?, 500)").run(real_username);
    }

    // Now insert or replace the alias into alias_to_user table
    const updateQuery = db.prepare("INSERT OR REPLACE INTO alias_to_user (alias, real_username) VALUES (?, ?)");
    await updateQuery.run(alias, real_username);

    console.log(`Alias ${alias} saved for username ${real_username}`);
    return reply.status(200).send({ message: "Alias saved successfully" });
  } catch (error) {
    console.error("Error saving alias:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
}


export async function saveGameAndUpdateElo(db, {
  winner_username,
  looser_username,
  looser_points,
  game_date
}) {
  const formattedDate = game_date.replace('T', ' ').split('.')[0];

  // Map aliases to real usernames if needed, or use the real username itself
  const winnerRealUsername = db.prepare(`SELECT real_username FROM alias_to_user WHERE alias = ?`).get(winner_username)?.real_username || winner_username;
  const looserRealUsername = db.prepare(`SELECT real_username FROM alias_to_user WHERE alias = ?`).get(looser_username)?.real_username || looser_username;

  // Ensure both users exist in the players table (with default ELO)
  db.prepare(`INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)`).run(winnerRealUsername);
  db.prepare(`INSERT OR IGNORE INTO players (username, elo) VALUES (?, 500)`).run(looserRealUsername);

  const winnerData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(winnerRealUsername);
  const loserData = db.prepare(`SELECT elo FROM players WHERE username = ?`).get(looserRealUsername);

  const { winnerNewElo, loserNewElo } = calculateElo(winnerData.elo, loserData.elo);

  db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(winnerNewElo, winnerRealUsername);
  db.prepare(`UPDATE players SET elo = ? WHERE username = ?`).run(loserNewElo, looserRealUsername);

  // Insert the game result into the games table
  db.prepare(`
    INSERT INTO games (
      winner_username, winner_points, looser_username, looser_points, game_date
    ) VALUES (?, ?, ?, ?, ?)
  `).run(winnerRealUsername, 10, looserRealUsername, looser_points, formattedDate);

  console.log("✅ Game result saved and ELO updated");
}
