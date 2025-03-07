import { GameCanvas } from "../components/game/Canvas.js";
import { useKeyPress } from "../hooks/useKeyPress.js"
import { movePaddle } from "../api/game/paddleAPI.js"
import { createGame } from "../api/game/gameAPI.js"

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";
    const canvas = GameCanvas();
    container.appendChild(canvas);

    createGame(1, 2)        
        .then(response => console.log(response))
        .catch(err => console.error(err));

    const cleanup = useKeyPress({
        "ArrowUp": () => movePaddle("right", "up"),
        "ArrowDown": () => movePaddle("right", "down"),
        "w": () => movePaddle("left", "up"),
        "s": () => movePaddle("left", "down"),
    });


    window.addEventListener("beforeunload", cleanup);

    return container;
};
