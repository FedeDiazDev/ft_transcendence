
async function matchmakingSockets(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/online/matchmaking', { websocket: true }, (socket, req) => {
			console.log('Client connnected');
			socket.on('message', message => {
				socket.send('hi from server')
			})
		})
	})
}

export default matchmakingSockets;