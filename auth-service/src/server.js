import Fastify from 'fastify';
import dbConnector from './database.js';
import routes from './routes.js';

const fastify = Fastify({
	logger: true
  })

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
