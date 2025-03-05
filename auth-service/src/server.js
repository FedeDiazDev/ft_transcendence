import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import dbConnector from './database.js';
import routes from './routes.js';
import cors from '@fastify/cors'

const opts = {
	logger: true,
}

const fastify = Fastify(opts);

fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);
	reply.status(350).send(error);
});

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

async function startServer(){
	try{
		await fastify.register(cors);
		await fastify.register(routes);
		await fastify.register(dbConnector);

		await fastify.listen(connectOptions, serverError);
	}catch(error){
		fastify.log.error(error);
		process.exit(1);
	}
}

startServer();
