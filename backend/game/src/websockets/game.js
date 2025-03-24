async function gameLogic(fastify, opts)
{
	fastify.register(async function (fastify) {
		fastify.get('/online/movePaddle', { websocket : true}, (socket, req) =>{
			
		})
	})
}

export default gameLogic;