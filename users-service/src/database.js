import fp from "fastify-plugin";
import Database from "better-sqlite3";

function dbConnector(fastify) {
  //Creates DB
  const dbFile = "/data/users.db";
  const db = new Database(dbFile, { verbose: console.log });

  //Improve performance writting in the database
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  //Creates table

  db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        avatar_blob BLOB,
        presentacion TEXT
      );
      
      CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        friend_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(friend_id) REFERENCES users(id)
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
