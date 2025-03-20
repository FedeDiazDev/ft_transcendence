let queue = [];

async function matchmakingSockets(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/online/matchmaking', { websocket: true }, (socket, req) => {
			console.log('Client connnected');
			socket.on('message', message => {
				queue.push(JSON.parse(message).id);
				console.log("HOOOOLAAA");
				console.log(queue);
				if (queue.length % 2 == 0) {
					console.log("DOs jugadores listos para jugar");
					socket.send("Preparaos para la partida");
				}
			})
		})
	})
}

export default matchmakingSockets;