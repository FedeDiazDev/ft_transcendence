import { API_URLS } from "../apiConfig.js";

export const getFriendsList = async (): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.profile}/getFriends`, {
            method: 'GET',
        });
        const data = await response.json();
        return data.friends;
    } catch (error) {
        //console.error("Fetch error: ", error);
    }
}

export const getUserByName = async (text: string): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.profile}/searchUsers/${encodeURIComponent(text)}`, {
            method: 'GET',
        });

        if (!response.ok) throw new Error("Error en la búsqueda");

        const data = await response.json();
        return data.results;
    } catch (error) {
        //console.error("Fetch error: ", error);
    }
};
