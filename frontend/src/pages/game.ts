import { GameCanvas } from "../components/game/Canvas.js"; 
import { useKeyPress }  from "../hooks/useKeyPress.js"
import { movePaddle } from "../api/game/paddleAPI.js"

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";
    const canvas = GameCanvas();
    container.appendChild(canvas);

    const cleanup = useKeyPress({
        "ArrowUp": () => movePaddle("right", "up"),
        "ArrowDown": () => movePaddle("right", "down"),
        "w": () => movePaddle("left", "up"),
        "s": () => movePaddle("left", "down"),
    });


    window.addEventListener("beforeunload", cleanup);

    return container;
};
