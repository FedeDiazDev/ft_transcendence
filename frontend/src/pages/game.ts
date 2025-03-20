import { GameCanvas } from "../components/game/Canvas.js";
import { createGame, startGame } from "../api/game/gameAPI.js";
import { GameState } from "../types/types.js";

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";

    createGame(1, 2)
        .then(gameData => {
            if (!gameData?.gameState) {
                console.error("Error: gameState no tiene el formato correcto", gameData);
                return;
            }
            return startGame();
        })
        .then(gameData => {
            if (!gameData?.gameState) {
                console.error("Error: gameState no tiene el formato correcto", gameData);
                return;
            }
            const gameState = gameData.gameState as GameState;

            const canvas = GameCanvas(gameState, "local");
            container.appendChild(canvas);

        })
        .catch(err => console.error("Error al crear el juego:", err));

    return container;
};
