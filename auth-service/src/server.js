import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import dbConnector from './database.js';
import routes from './routes.js';

const opts = {
	logger: true,
	key : fs.readFileSync(path.resolve("/etc/ssl/server.key")) ,
	cert : fs.readFileSync(path.resolve("/etc/ssl/server.crt")) ,
}

const fastify = Fastify(opts);

const connectOptions = {
    host: '0.0.0.0',
    port: 3000
}

function serverError(err) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

fastify.register(routes);
fastify.register(dbConnector);

fastify.listen(connectOptions, serverError);
