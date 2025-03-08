import { GameCanvas } from "../components/game/Canvas.js";
import { useKeyPress } from "../hooks/useKeyPress.js"
import { movePaddle } from "../api/game/paddleAPI.js"
import { createGame } from "../api/game/gameAPI.js"

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";

    createGame(1, 2)
        .then(gameData => {
            if (!gameData) {
                console.error("Error: No se pudo crear el juego.");
                return;
            }
            console.log("Juego creado:", gameData);
            const newCanvas = GameCanvas(gameData.gameState);
            container.appendChild(newCanvas);
        })
        .catch(err => console.error("Error al crear el juego:", err));

    const cleanup = useKeyPress({
        "ArrowUp": () => movePaddle("right", "up"),
        "ArrowDown": () => movePaddle("right", "down"),
        "w": () => movePaddle("left", "up"),
        "s": () => movePaddle("left", "down"),
    });


    window.addEventListener("beforeunload", cleanup);

    return container;
};
