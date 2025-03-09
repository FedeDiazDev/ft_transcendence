import { API_URLS } from "../apiConfig.js"

export const createGame = async (leftPlayerId: number, rightPlayerId: number): Promise<{ gameState: string }> => {
	try {
		const response = await fetch(`${API_URLS.game}/game/create`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ leftPlayerId: leftPlayerId, rightPlayerId: rightPlayerId }),
		});
		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}
		const data = await response.json();
		if (!data || !data.gameState) {
			throw new Error("Respuesta inválida del servidor");
		}
		return data;
	} catch (error) {
		console.error("Error en /create: ", error);
		throw error;
	}
}

export const getGameState = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URLS.game}/game/state`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo el estado del juego:", error);
        return null;
    }
};
