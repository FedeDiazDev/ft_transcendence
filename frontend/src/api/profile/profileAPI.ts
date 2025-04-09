import { API_URLS } from "../apiConfig.js"

export const getUserData = async (): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        console.log("Token enviado:", token);

        const response = await fetch(`${API_URLS.profile}/getUser`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
