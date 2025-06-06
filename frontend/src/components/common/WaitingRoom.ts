import { createMatchmakingSocket } from "../../sockets/matchmakingSocket.js";
import { GameCanvas } from "../game/Canvas.js";
import { fetchUserData } from "../../hooks/fetchUserData.js";

export const WaitingRoom = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen bg-gray-900 text-white";

    const text = document.createElement("p");
    text.className = "text-2xl font-semibold";
    text.textContent = "Esperando a un jugador";

    const dots = document.createElement("span");
    dots.className = "text-2xl";

    let dotCount = 0;
    setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dots.textContent = ".".repeat(dotCount);
    }, 500);

    text.appendChild(dots);
    container.appendChild(text);

    fetchUserData((user) => {
        const matchmakingSocket = createMatchmakingSocket((gameState) => {
            const score = document.createElement("p");
            matchmakingSocket.close();
            container.innerHTML = "";
            container.className = "flex flex-col items-center justify-center bg-gray-900 text-white";
            score.innerHTML = '0 - 0';
            container.appendChild(score);
            container.appendChild(GameCanvas(gameState, "online", score, Date.now().toString()));
        }, user.id);
    });

    return container;
};
