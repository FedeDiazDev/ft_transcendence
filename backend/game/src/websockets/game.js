import { Game } from "../models/Game.js";

let ids = [];
let player1;
let player2;
let game = null;
async function gameLogic(fastify, opts) {
	fastify.register(async function (fastify) {
		fastify.get('/online/game', { websocket: true }, (socket, req) => {

			socket.on('message', message => {
				const data = JSON.parse(message);
				if (data.action === "join_game") {
					const playerId = data.id;
					ids.push({ id: playerId, socket });
					if (ids.length === 2) {
						player1 = ids.shift();
						player2 = ids.shift();
						game = new Game(player1.id, player2.id);
						game.start();
						player1.socket.send((JSON.stringify(game)));
						player2.socket.send((JSON.stringify(game)));
					}
				}
				else if (data.action === "move_paddle") {
					console.log(data);
					if (data.id == 2) {
						game.movePaddle('left', data.direction);
						// console.log("ID 2:", game);
						player1.socket.send(JSON.stringify(game));
					}
					else if (data.id == 1){
						game.movePaddle('right', data.direction);
						// console.log("ID 1:", game);
						player2.socket.send(JSON.stringify(game))
					}
				}
			})
		})
	})
}

export default gameLogic;