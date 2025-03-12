import { API_URLS } from "../apiConfig.js";


type Player = "left" | "right";
type Direction = "up" | "down";

export const movePaddle = async (player: Player, direction: Direction): Promise<any> => {
    try {
        const response = await fetch(`${API_URLS.game}/game/movePaddle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player, direction }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        if (response.status !== 204) {
            const data = await response.json();
            // console.log(data)
            if (!data) {
                throw new Error("Respuesta inválida del servidor");
            }
            return data;
        }
    } catch (error) {
        console.error("Error en /movePaddle:", error);
    }
};