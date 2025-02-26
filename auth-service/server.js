import Fastify from 'fastify'

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
  

fastify.get('/', async function handler (request, reply) {
	return { root: 'works' }
})

fastify.post("/signup", opts, async function handler (request, reply) {
	if (request.body.password != request.body.confirmPassword)
		reply.status(400).send({message : "Password does not match"},);
	else
		reply.send({message : "Successful request"});
});

fastify.listen(connectOptions, serverError);