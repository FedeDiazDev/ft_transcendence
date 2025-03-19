import Fastify from 'fastify';
import routes from './routes/router.js';
import cors from '@fastify/cors'

const opts = {
	logger: true,
}

const fastify = Fastify(opts);

fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);    
	reply.send(error);
});

const connectOptions = {
    host: '0.0.0.0',
    port: 4444
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

		await fastify.listen(connectOptions, serverError);
	}catch(error){
		fastify.log.error(error);
		process.exit(1);
	}
}

startServer();