import Fastify from 'fastify';
import dbConnector from './database.js';
import routes from './routes.js';
import cors from '@fastify/cors'

//Activate logger inside fastify
const opts = {
	logger: true,
}

//Create instance of fastify with opts
const fastify = Fastify(opts);

//Manages errors from
fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);    
	reply.send(error);
});

//Defines where it listens
const connectOptions = {
    host: '0.0.0.0',
    port: 3000
}

//Exit process if the init fails
function serverError(err) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

//Async function. Register adds plugins to the db, but it is asynchronous. For that, it is important 
//to wait when one is completed. Also, the try catch is necessary because the server is not initialized
//and the setErrorHandler is no running yet
async function startServer(){
	try{
		await fastify.register(cors, { origin: '*' });
		await fastify.register(routes);
		await fastify.register(dbConnector);
		await fastify.listen(connectOptions, serverError);
	}catch(error){
		fastify.log.error(error);
		process.exit(1);
	}
}

startServer();
