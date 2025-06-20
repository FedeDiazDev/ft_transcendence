import { API_URLS } from "../apiConfig.js"

export const createTournament = async (name: string, players: number) => {

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.game}/tournament/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: name, players: players })
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data || !data.tournamentState) {
            throw new Error("Respuesta inválida del servidor");
        }
        return data;
    } catch (error) {
        console.error("Error en /tournament/create: ", error);
        throw error;
    }
}

export const registerPlayer = async (tournamentId: number) => {

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.game}/tournament/addPlayer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ tournamentId: tournamentId })
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Error("Respuesta inválida del servidor");
        }
        return data;
    } catch (error) {
        console.error("Error en /tournament/addPlayer", error);
        throw error;
    }
}

export const openTournaments = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.game}/tournament/open`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en /tournament/open:", error)
    }
}
