let queue = [];

async function matchmakingSockets(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/api/game/online_matchmaking', { websocket: true }, (socket, req) => {
			socket.on('message', message => {
				const playerId = JSON.parse(message).id;
				if (queue.find(entry => entry.id === playerId)) {
					console.log(`Jugador ${playerId} ya está en la cola`);
					return;
				}
				queue.push({ id: playerId, socket });
				if (queue.length >= 2) {
					const player1 = queue.shift();
					let player2Index = queue.findIndex(p => p.id !== player1.id);

					if (player2Index === -1) {
						queue.unshift(player1);
						return;
					}

					const [player2] = queue.splice(player2Index, 1);
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
			socket.on('close', () => {
				queue = queue.filter(entry => entry.socket !== socket);
			});
		});
	});
}

export default matchmakingSockets;
