import { getUserData } from "../api/profile/profileAPI.js";

export async function fetchUserData(callback: (user: any) => void) {
    try {
        const data = await getUserData();
        callback(data.username || data.user);
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
    }
}