import fp from "fastify-plugin";
import Database from "better-sqlite3";

function dbConnector(fastify) {

    const dbFile = "/data/auth.db";
    const db = new Database(dbFile, { verbose: console.log });

	db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        salt TEXT NOT NULL,
		qrSecret TEXT
      );
    `);
 
    fastify.decorate("db", db);

    fastify.addHook("onClose", (done) => {
      db.close();
      done();
    });
  }
  
  export default fp(dbConnector);
