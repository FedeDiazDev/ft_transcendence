import { GameCanvas } from "../components/game/Canvas.js";
import { createGame, startGame } from "../api/game/gameAPI.js";
import { GameState } from "../types/types.js";

export const Game = (mode: string) => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";
    let gameState: GameState = {
        roomId: "",
        status: "waiting",
        ball: { x: 0, y: 0 },
        paddles: {
            left: {
                player: "left",
                playerId: 1,
                x: 50,
                y: 200,
                width: 10,
                height: 50,
                speed: 5
            },
            right: {
                player: "right",
                playerId: 2,
                x: 440,
                y: 200,
                width: 10,
                height: 50,
                speed: 5
            }
        },
        points: 0,
        leftPoints: 0,
        rightPoints: 0
    };

    if (mode == "local") {
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
                gameState = gameData.gameState as GameState;

                if (mode === "local") {
                    const canvas = GameCanvas(gameState, "local");
                    container.appendChild(canvas);
                }
            })
            .catch(err => console.error("Error al crear el juego:", err));
    } else if (mode === "online") {
        const canvas = GameCanvas(gameState, "online");
        container.appendChild(canvas);
    }

    return container;
};
