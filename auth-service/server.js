import Fastify from 'fastify'
const fastify = Fastify({
	logger: true
  })

const connectOptions = {
    host: '0.0.0.0',
    port: 3000
}

const opts = {
  schema: { 
    body: {
      type: "object",
      properties: {
        nickname: { type: "string" },
        email: { type: "string" },
        password: { type: "string" }
      },
      required: ["nickname", "email", "password"]
    },
    response: {
      200: {
        type: "object",
        properties: {
          hello: { type: "string" }
        }
      }
    }
  }
};

function serverError(err) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

fastify.get('/', async function handler (request, reply) {
	return { root: 'works' }
})

fastify.post("/signup", opts, async function handler (request, reply) {
	reply.send({"post" : "complete"});
});

fastify.listen(connectOptions, serverError);