import { API_URLS } from "../apiConfig.js"

export const createGame = async (leftPlayerId: number, rightPlayerId: number): Promise<void> => {
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
		return data;
	} catch (error) {
		console.error("Error en /create: ", error);
	}
}