const fastify = require('fastify')({ logger:true })

fastify.post('/signup', function handler (request, reply){
	const {username, email, pass} = request.body;
	if (username && email && pass)
		reply.send({is: 'working'});
	else
		reply.send({not: 'going'});
})

fastify.listen({ port: 3000, host: '0.0.0.0',});