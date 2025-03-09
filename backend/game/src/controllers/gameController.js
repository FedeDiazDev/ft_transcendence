import { Game } from "../models/Game.js";

let game = null;
export const canvasH = 400;
export const canvasW = 800;

export async function getGameInfo(request, reply) {
  if (game === null)
    reply.send({ message: "No hay ningun juego creado" })
  reply.send({ gameState: game.gameState });
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

  reply.send({ message: game });
}

export async function startGame(request, reply) {
  game.start();
  reply.send({ message: "Juego iniciado", game: game });
}

export async function createGame(request, reply) {
  const { leftPlayerId, rightPlayerId } = request.body;

  if (!leftPlayerId || !rightPlayerId) {
    return reply.status(400).send({ error: "Faltan datos" });

  }
  game = new Game(leftPlayerId, rightPlayerId);
  reply.status(200).send({ message: "Juego creado", gameState: game })
}

export async function moveBall(request, reply) {
  game.update();
  return reply.send({ status: 'success', gameState: game });
}