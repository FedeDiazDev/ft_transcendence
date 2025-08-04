import { createMatchmakingSocket } from "../../sockets/matchmakingSocket.js";
import { GameCanvas } from "../game/Canvas.js";
import { fetchUserData } from "../../hooks/fetchUserData.js";

export const getUserById = async (id: any) => {
    const res = await fetch(`/api/users/getUserById/${id}`);
    if (!res.ok) throw new Error("User fetch failed");

    const data = await res.json();
    return data.user;
};

export const WaitingRoom = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen text-white";

    const text = document.createElement("p");
    text.className = "text-2xl font-semibold";
    text.textContent = "Waiting for a player";

    const dots = document.createElement("span");
    dots.className = "text-2xl";

    let dotCount = 0;
    const intervalId = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dots.textContent = ".".repeat(dotCount);
    }, 500);

    text.appendChild(dots);
    container.appendChild(text);

    fetchUserData((user) => {
        const matchmakingSocket = createMatchmakingSocket(async (gameState, roomId, opponentId) => {
            clearInterval(intervalId);
            matchmakingSocket.close();

            let opponentUsername = "Unknown";
            try {
                const res = await getUserById(opponentId);
                opponentUsername = res.username;
            } catch (err) {
                //console.error("Could not fetch opponent username", err);
            }

            container.innerHTML = "";
            container.className = "flex flex-col items-center justify-center text-white";

            const banner = document.createElement("p");
            banner.className = "text-2xl font-bold mb-4";
            banner.textContent = `Get ready! You're playing against ${opponentUsername}!`;

            container.appendChild(banner);

            setTimeout(() => {
                container.innerHTML = "";

                const score = document.createElement("p");
                score.innerHTML = '0 - 0';
                container.appendChild(score);
                container.appendChild(GameCanvas(gameState, "online", score, roomId));
            }, 2500);
        }, user.id);
    });

    return container;
};
