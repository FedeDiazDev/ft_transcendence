import { API_URLS } from "../apiConfig.js"; 


type Player = "left" | "right";
type Direction = "up" | "down";

export const movePaddle = async (player: Player, direction: Direction): Promise<void> => {
    try {
        const response = await fetch(`${API_URLS.game}/game/movePaddle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player, direction }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error moviendo la pala:", error);
    }
};
