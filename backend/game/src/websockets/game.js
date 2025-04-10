import { Game } from "../models/Game.js";

let players = [];
let game = null;
let gameLoopRunning = false;

function startGameLoop() {
	if (gameLoopRunning) return;
	gameLoopRunning = true;
	setInterval(() => {
		game.update();
		players.forEach(player => {
			const gameData = {
				player1Name: players[0].name,
				player2Name: players[1].name
			};
			player.socket.send(JSON.stringify(gameData));
		});
	}, 1000 / 60);
}


async function gameLogic(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/api/game/online_game', { websocket: true }, (socket, req) => {

			socket.on('message', message => {
				const data = JSON.parse(message);
				if (data.action === "join_game") {
					const playerId = data.id;
					const playerName = data.name;
					players.push({ id: playerId, name: playerName, socket });
					if (players.length === 2) {
						game = new Game(players[0].id, players[1].id);
						game.start();
						players.forEach(player => {
							const gameData = {
								gameState: game,
								player1Name: players[0].name,
								player2Name: players[1].name
							};
							player.socket.send(JSON.stringify(gameData));
						});
					}
				}
				else if (data.action === "move_paddle") {
					console.log(data);
					if (!game) return;
					if (data.id === game.paddles.left.playerId) {
						game.movePaddle('left', data.direction);
					} else if (data.id === game.paddles.right.playerId) {
						game.movePaddle('right', data.direction);
					}
					players.forEach(player => {
						const gameData = {
							gameState: game,
							player1Name: players[0].name,
							player2Name: players[1].name
						};
						player.socket.send(JSON.stringify(gameData));
					});

					startGameLoop();
				}
			})
		})
	})
}

export default gameLogic;