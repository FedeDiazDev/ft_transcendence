import { Game } from "../models/Game.js";

const game = new Game();

export async function getGameInfo(request, reply) {
  reply.send({ status: game.status, ball: game.ball, paddles: game.paddles });
}

export async function movePaddle(request, reply) {
  const { player, direction } = request.body;

  if (!player || !direction) {
    return reply.status(400).send({ error: "Faltan datos" });
  }

  game.movePaddle(player, direction);
  reply.send({ message: `Pala de ${player} movida hacia ${direction}` });
}

export async function startGame(request, reply) {
  game.start();
  reply.send({ message: "Juego iniciado", status: game.status });
}

export async function createGame(request, reply)
{
	reply.send({ message: "Juego creado"})
}
