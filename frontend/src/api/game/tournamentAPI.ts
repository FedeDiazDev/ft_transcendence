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
            body: JSON.stringify({ name, players })
        });

        const data = await response.json();

        if (response.status === 409) {
            throw new Error("409");
        }
        if (response.status === 400) {
            if (data?.error?.includes("Not more than 5 tournaments at a time allowed. Wait for one to finish!")) {
                throw new Error("MAX_TOURNAMENTS_OPEN");
            } else {
                throw new Error(`Error 400: ${data.error}`);
            }
        }

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${data.error}`);
        }

        if (!data || !data.tournamentState) {
            throw new Error("Respuesta inválida del servidor");
        }

        return {
            exists: false,
            tournamentState: data.tournamentState
        };

    } catch (error) {
        //console.error("Error en /tournament/create: ", error);
        throw error;
    }
};

export const registerPlayer = async (tournamentId: number, alias: string) => {
    //console.log("DATOS: ", tournamentId, alias);
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.game}/tournament/addPlayer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ tournamentId: tournamentId, alias: alias })
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
        //console.error("Error en /tournament/addPlayer", error);
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
        //console.error("Error en /tournament/open:", error)
    }
}

export const closeTournament = async (tournamentId: number): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token de autenticación no encontrado");
        }

        const response = await fetch(`${API_URLS.tournaments}/close`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ tournamentId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Error desconocido del servidor");
        }

        return data;
    } catch (error) {
        //console.error("Error en /tournament/close:", error);
        throw error;
    }
};


export const checkPlayer = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.game}/tournament/user`, {
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
        //console.error("Error en /tournament/open:", error)
    }
}

export const checkNickname = async (tournamentId: number, alias: string) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token de autenticación no encontrado");
        }

        const url = new URL(`${API_URLS.game}/tournament/checkNickname`);
        url.searchParams.append("tournamentId", tournamentId.toString());
        url.searchParams.append("alias", alias);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Error al comprobar el nickname");
        }

        return data;

    } catch (error) {
        //console.error("Error en /tournament/checkNickname:", error);
        throw error;
    }
};
