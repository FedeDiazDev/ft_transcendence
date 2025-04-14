import { API_URLS } from "../apiConfig.js";

export const getFriendsList = async (): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.profile}/getFriends`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.friends;
    } catch (error) {
        console.error("Fetch error: ", error);
    }
}