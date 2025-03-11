import { GameCanvas } from "../components/game/Canvas.js";
import { createGame } from "../api/game/gameAPI.js";
import { GameState } from "../types/types.js";

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";

    createGame(1, 2)
        .then(gameData => {
            if (!gameData || typeof gameData.gameState !== "object") {
                console.error("Error: gameState no tiene el formato correcto", gameData);
                return;
            }
            const gameState = gameData.gameState as GameState;
            console.log("Juego creado:", gameData);

            const validatedState = {
                status: gameState.status ?? "WAITING",
                ball: gameState.ball ?? { x: 400, y: 200 },
                paddles: {
                    left: gameState.paddles?.left ?? { player: "left", playerId: 0, x: 20, y: 150, width: 10, height: 100, speed: 10 },
                    right: gameState.paddles?.right ?? { player: "right", playerId: 0, x: 770, y: 150, width: 10, height: 100, speed: 10 },
                },
                points: gameState.points ?? 10,
                leftPoints: gameState.leftPoints ?? 0,
                rightPoints: gameState.rightPoints ?? 0,
            };

            const canvas = GameCanvas(validatedState);
            container.appendChild(canvas);
        })
        .catch(err => console.error("Error al crear el juego:", err));

    return container;
};
