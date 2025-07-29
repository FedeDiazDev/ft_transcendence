import fp from "fastify-plugin"
import Database from "better-sqlite3"

function dbConnector(fastify) {
    const dbFile = "/data/tournaments.db"
    const db = new Database(dbFile, { verbose: console.log });

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    db.exec(`
        CREATE TABLE IF NOT EXISTS tournaments ( 
        id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        winner_id INTEGER,
        number_players INTEGER NOT NULL);

        CREATE TABLE IF NOT EXISTS tournament_players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournament_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        display_name TEXT NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id));

        CREATE INDEX IF NOT EXISTS idx_tp_tournament ON tournament_players(tournament_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_tp_tourn_user ON tournament_players(tournament_id, username);
        `);

    fastify.decorate("db", db);

    fastify.addHook("onClose", (done) => {
        db.close();
        done();
    })
}

export default fp(dbConnector);