import fp from "fastify-plugin";
import Database from "better-sqlite3";

function dbConnector(fastify) {

    const dbFile = "/data/stats.db";
    const db = new Database(dbFile, { verbose: console.log });

	db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS alias_to_user (
        alias TEXT PRIMARY KEY,
        real_username TEXT NOT NULL,
        FOREIGN KEY (real_username) REFERENCES players(username)
      );
      
      CREATE TABLE IF NOT EXISTS games (
        gameid INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
        winner_username TEXT NOT NULL,
        winner_points INTEGER NOT NULL,
        looser_username TEXT NOT NULL,
        looser_points INTEGER NOT NULL,
        game_date TEXT NOT NULL,
        elo INTEGER NOT NULL DEFAULT 500,
        FOREIGN KEY (winner_username) REFERENCES players(username),
        FOREIGN KEY (looser_username) REFERENCES players(username)
      );
      
      CREATE TABLE IF NOT EXISTS players (
        username TEXT PRIMARY KEY,
        elo INTEGER NOT NULL DEFAULT 500
      );
    `);//SQLite doesn't have a native DATE type
 
    fastify.decorate("db", db);

    fastify.addHook("onClose", (done) => {
      db.close();
      done();
    });
  }
  
  export default fp(dbConnector);
