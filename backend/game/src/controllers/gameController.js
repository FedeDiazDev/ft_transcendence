import { Game } from "../models/Game.js";
import { GameStatus } from "../models/GameStatus.js";

let game = null;

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
  const paddles = game.paddles;
  const paddleSpeed = game.paddles.left.speed;
  const paddleHeight = game.paddles.left.height;
  if (
    (player === "left" && direction === "up" && paddles.left.y <= 0) ||
    (player === "left" && direction === "down" && paddles.left.y + paddleHeight >= 600) ||
    (player === "right" && direction === "up" && paddles.right.y <= 0) ||
    (player === "right" && direction === "down" && paddles.right.y + paddleHeight >= 600)
  )
    return reply.status(204).send({ error: "Movement not allowed", message: "The paddle cannot move further in this direction" });


  game.movePaddle(player, direction);
  return reply.status(200).send({ gameState: game });
}

export async function startGame(request, reply) {
  if (!game) {
    return reply.status(500).send({ message: "Error: gameState no inicializado" });
  }

  game.start();
  game.gameStatus = GameStatus.PLAYING;

  return reply.status(200).send({
    message: "Juego iniciado",
    gameState: game,
  });
}


export async function createGame(request, reply) {
  const { leftPlayerId, rightPlayerId } = request.body;

  if (!leftPlayerId || !rightPlayerId) {
    return reply.status(400).send({ error: "Faltan datos" });

  }
  game = new Game(leftPlayerId, rightPlayerId);
  return reply.status(200).send({ message: "Juego creado", gameState: game })
}

export async function moveBall(request, reply) {
  const body = request.body || {};
  if (game.status !== GameStatus.PLAYING) {
    return reply.send({ status: 'error', message: 'El juego no está en curso' });
  }
  if (game.status === GameStatus.GAME_OVER)
    return reply.status(200).send({ message: "Juego finalizado", gameState: game })
  game.update();
  return reply.send({ status: 'success', gameState: game });
}
