import { Game } from "../models/Game.js";

let game = null;

export async function getGameInfo(request, reply) {
  if (game === null)
      reply.send({message: "No hay ningun juego creado"})
  reply.send({ status: game.status, ball: game.ball, paddles: game.paddles });
}

export async function movePaddle(request, reply) {
  const { player, direction } = request.body;

  if (!player || !direction) {
    return reply.status(400).send({ error: "Faltan datos" });
  }
  if (!["left", "right"].includes(player) || !["up", "down"].includes(direction)) {
    return reply.status(400).send({ error: "Valores no validos" });
  }

  game.movePaddle(player, direction);

  reply.send({ message: game.paddles[player] });
}

export async function startGame(request, reply) {
  game.start();
  reply.send({ message: "Juego iniciado", game: game });
}

export async function createGame(request, reply) {
  game = new Game();
  reply.send({ message: "Juego creado" })
}
