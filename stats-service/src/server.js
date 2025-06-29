import Fastify from 'fastify';
import dbConnector from './database.js';
import routes from './routes.js';
import cors from '@fastify/cors';
import consumeGameResultEvents from './events/consumeGameResultEvents.js'
import { validateAuthorizationHeader } from './components/verifyAuth.js';

const opts = {
	logger: true,
}

const fastify = Fastify(opts);

fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);    
	reply.send(error);
});

fastify.addHook("preHandler", async (request, reply) => {
	if (request.raw.url.startsWith("/api")) {
		try {
			await validateAuthorizationHeader(request);
		} catch (err) {
			request.log.error(err);
			return reply.code(401).send({ error: err.message });
		}
	}
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
		await fastify.register(cors, { 
			origin: '*', 
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization']
		});
		await fastify.register(routes);
		await fastify.register(dbConnector);
		await fastify.register(consumeGameResultEvents);
		await fastify.listen(connectOptions, serverError);
		
	}catch(error){
		fastify.log.error(error);
		process.exit(1);
	}
}

startServer();
