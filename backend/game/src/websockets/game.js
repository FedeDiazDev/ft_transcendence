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
			player.socket.send(JSON.stringify(game));
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
					players.push({ id: playerId, socket });
					if (players.length === 2) {
						game = new Game(players[0].id, players[1].id);
						game.start();
						players.forEach(player => {
							player.socket.send(JSON.stringify(game));
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
						player.socket.send(JSON.stringify(game));
					});

					startGameLoop();
				}
			})
		})
	})
}

export default gameLogic;