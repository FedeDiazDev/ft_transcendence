import fp from "fastify-plugin";
import Database from "better-sqlite3";

function dbConnector(fastify) {
    //Creates DB
    const dbFile = "/data/auth.db";
    const db = new Database(dbFile, { verbose: console.log });

	//Improve performance writting in the database
	db.pragma('journal_mode = WAL');

    //Creates table
  
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
 
//  Can access an instance of the DB from fastify
  
    fastify.decorate("db", db);

 // Creates a hook so the db closes at the same time that the server

    fastify.addHook("onClose", (done) => {
      db.close();
      done();
    });
  }
  
  export default fp(dbConnector);
