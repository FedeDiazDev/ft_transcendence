import { Game } from "../models/Game.js";
import  publishGameResultEvent  from "../events/publishGameResultEvent.js"

let players = [];
let game = null;
let gameLoopRunning = false;

function startGameLoop() {
	if (gameLoopRunning) return;
	gameLoopRunning = true;
	let gameResultSent = false;

	const interval = setInterval(async () => {
		game.update();
		if (game.leftPoints === 10 || game.rightPoints === 10) {
			if (gameResultSent) return;
			gameResultSent = true;
			const winnerId = game.leftPoints === 10
				? game.paddles.left.playerId
				: game.paddles.right.playerId;
			const looserPoints = game.leftPoints === 10? game.rightPoints : game.leftPoints;
			const winnerName = players.find(p => p.id === winnerId)?.name || "Desconocido";
			const looserName = players.find(p => p.id !== winnerId)?.name || "Desconocido";

			//POST result to stats-service
			console.log("game over game is: ", game);//game.date
			console.log("game over game.date is: ", game.date);
			console.log("game over winnerId is: ", winnerId);
			console.log("game over winnername is: ", winnerName);
			console.log("game over looserName is: ", looserName);
			console.log("game over looserPoints is: ", looserPoints);
			try {
				await publishGameResultEvent({
				  winner_username: winnerName,
				  looser_username: looserName,
				  looser_points: looserPoints,
				  game_date: game.date
				});

				console.log('Game result published to RabbitMQ');
			} catch (error) {
				console.error('Failed to publish game result to RabbitMQ:', error);
			}
			// const response = await fetch("http://stats-service:3000/api/stats/game", {
			// 	method: 'POST',
			// 	headers: {
			// 	  'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 	  winner_username: winnerName,
			// 	  looser_username: looserName,
			// 	  looser_points: looserPoints,
			// 	  game_date: game.date
			// 	})
			//   });

			// if (!response.ok) {
			// 	console.error('Error sending game data to stats-service:', response.statusText);
			// }
			// console.log("response from stats container is : ", response);
			console.log('Game data sent to stats-service successfully');
			players.forEach(player => {
				player.socket.send(JSON.stringify({
					type: "game_over",
					gameState: game,
					winner: winnerName
				}));
				player.socket.close();
			});

			// Reset
			clearInterval(interval);
			players = [];
			game = null;
			gameLoopRunning = false;
			return;
		}

		players.forEach(player => {
			const gameData = {
				gameState: game,
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
				console.log("data received in socket: ", data);
				if (data.action === "join_game") {
					const playerId = data.id;
					const playerName = data.name;
					players.push({ id: playerId, name: playerName, socket });
					if (players.length === 2) {
						game = new Game(players[0].id, players[1].id);
						console.log("game created: ", game);
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
					//console.log(data);
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