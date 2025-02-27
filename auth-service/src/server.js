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

const opts = {
	schema: { 
	  body: {
		type: "object",
		properties: {
		  nickname: { type: "string" },
		  email: { type: "string" },
		  password: { type: "string" },
		  confirmPassword: { type: "string" }
		},
		required: ["nickname", "email", "password", "confirmPassword"]
	  }
	}
  };
  
fastify.register(routes);
fastify.register(dbConnector);

fastify.listen(connectOptions, serverError);