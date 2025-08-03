import { Game } from "../models/Game.js";
import { tournamentSockets } from "./tournament.js";
import  publishGameResultEvent  from "../events/publishGameResultEvent.js"

const games = new Map();

function startGameLoop(roomId) {
	const room = games.get(roomId);
	if (!room || room.gameLoopRunning) return;

	room.gameLoopRunning = true;
	let gameResultSent = false;

	const interval = setInterval(async () => {
		const { game, players } = room;
		game.update();

		if (game.leftPoints === 10 || game.rightPoints === 10) {
			if (gameResultSent) return;
			gameResultSent = true;

			const winnerId = game.leftPoints === 10 ? game.paddles.left.playerId : game.paddles.right.playerId;
			const looserPoints = game.leftPoints === 10 ? game.rightPoints : game.leftPoints;
			const winnerName = players.find(p => p.id === winnerId)?.name || "Desconocido";
			const looserName = players.find(p => p.id !== winnerId)?.name || "Desconocido";

			//POST result to stats-service
			// console.log("game over game is: ", game);//game.date
			// console.log("game over game.date is: ", game.date);
			// console.log("game over winnerId is: ", winnerId);
			// console.log("game over winnername is: ", winnerName);
			// console.log("game over looserName is: ", looserName);
			// console.log("game over looserPoints is: ", looserPoints);
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
			//console.log('Game data sent to stats-service successfully');
			players.forEach(player => {
				player.socket.send(JSON.stringify({
					type: "game_over",
					gameState: game,
					winner: winnerName,
					roomId
				}));
				player.socket.close();
			});

			clearInterval(interval);
			games.delete(roomId);
			return;
		}
		players.forEach(player => {
			player.socket.send(JSON.stringify({
				gameState: game,
				player1Name: players[0].name,
				player2Name: players[1].name,
				roomId
			}));
		});
	}, 1000 / 60);
}

async function gameLogic(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/api/game/online_game', { websocket: true }, (socket, req) => {
			socket.on('message', message => {
				const data = JSON.parse(message);
				//console.log("Data received:", data);

				const { action, id, name, roomId, direction } = data;

				if (action === "join_game") {
//					console.log("Mensaje recibido en game-service:", data);
					if (!games.has(roomId)) {
						const tournamentInfo = data.tournamentInfo || null;
						if (tournamentInfo) {
							const orgSocket = tournamentSockets.get(tournamentInfo.tournamentId);
							tournamentInfo.socket = orgSocket;
						}
//						console.log("Guardando room con tournamentInfo:", tournamentInfo);
						games.set(roomId, {
							players: [],
							game: null,
							gameLoopRunning: false,
							tournamentInfo: tournamentInfo,
						});
//						console.log("Room guardado:", games.get(roomId));
					}
					const room = games.get(roomId);
					room.players.push({ id, name, socket });
					if (room.players.length === 2) {
						room.game = new Game(room.players[0].id, room.players[1].id);
//						console.log("Game started in room:", roomId);
						room.game.start();

						room.players.forEach(player => {
							player.socket.send(JSON.stringify({
								gameState: room.game,
								player1Name: room.players[0].name,
								player2Name: room.players[1].name,
								roomId
							}));
						});

						startGameLoop(roomId);
					}
				}
				else if (action === "move_paddle") {
					const room = games.get(roomId);
					if (!room || !room.game) return;
					const { game, players } = room;
					if (id === game.paddles.left.playerId) {
						game.movePaddle('left', direction);
					} else if (id === game.paddles.right.playerId) {
						game.movePaddle('right', direction);
					}
					players.forEach(player => {
						player.socket.send(JSON.stringify({
							gameState: game,
							player1Name: players[0].name,
							player2Name: players[1].name,
							roomId
						}));
					});

					startGameLoop(roomId);
				}
			});
			socket.on('close', async () => {
				const roomEntry = [...games.entries()].find(([, room]) =>
					room.players.some(p => p.socket === socket)
				);
				if (!roomEntry) return;
				const [roomId, room] = roomEntry;

				if (room.cleanedUp) return;
				room.cleanedUp = true;

				const disconnectedPlayer = room.players.find(p => p.socket === socket);
				const remainingPlayer = room.players.find(p => p.socket !== socket);
				console.log(`Jugador desconectado: ${disconnectedPlayer?.name}`);
				if (remainingPlayer) {
					remainingPlayer.socket.send(JSON.stringify({
						type: "game_over",
						reason: "opponent_disconnected",
						winner: remainingPlayer.name,
						roomId
					}));
					remainingPlayer.socket.close();

					try {
						await publishGameResultEvent({
							winner_username: remainingPlayer.name,
							looser_username: disconnectedPlayer?.name || "Unknown",
							looser_points: room?.game?.leftPoints ?? 0,
							game_date: room?.game?.date ?? new Date().toISOString()
						});
					} catch (error) {
						console.error('Failed to publish disconnect game result:', error)
					}
				}
				if (room.tournamentInfo && remainingPlayer) {
					room.tournamentInfo.socket?.send(JSON.stringify({
						action: "report_winner",
						tournamentId: room.tournamentInfo.tournamentId,
						round: room.tournamentInfo.round,
						winner: remainingPlayer.name
					}));
				}
				clearInterval(room.interval);
				games.delete(roomId);
			});
		});
	});
}

export default gameLogic;
