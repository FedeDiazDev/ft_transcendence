let queue = [];

async function matchmakingSockets(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/api/game/online/matchmaking', { websocket: true }, (socket, req) => {
			// console.log('Client connected');
			
			socket.on('message', message => {
				const playerId = JSON.parse(message).id;
				queue.push({ id: playerId, socket });

				if (queue.length % 2 === 0) {
					const player1 = queue.shift();
					const player2 = queue.shift();

					const matchInfo = {
						status: "ready",
						message: "Preparaos para la partida",
						players: [player1.id, player2.id],
						roomId: `room-${Date.now()}`
					};
					player1.socket.send(JSON.stringify(matchInfo));
					player2.socket.send(JSON.stringify(matchInfo));
				}
			});
		});
	});
}

export default matchmakingSockets;
