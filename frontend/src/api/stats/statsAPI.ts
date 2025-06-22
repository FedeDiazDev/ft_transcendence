import { getFriendData} from '../profile/profileAPI.js';

export async function getUserStats() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/user", {
            method: "GET",
            credentials: "include",
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
        console.error("Error fetching user stats:", error);
        return null;
    }
}

export async function getFriendStats(id: number) {

    try {
        const token = localStorage.getItem("authToken");

        console.log("Fetching friend data for user ID:", id);
        const friendData = await getFriendData(id);
        console.log("Friend data are:", friendData);
        const username = friendData.user.username;
        console.log("friend username is :", username);
        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/friend/" + username, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch friend stats: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching friend stats:", error);
        return null;
    }
}

export async function getAllPlayers() {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/players", {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Player stats response:", response);

        if (!response.ok)
            throw new Error(`Failed to fetch players: ${response.statusText}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}

export async function getAllGames() {
    try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/games", {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok)
            throw new Error(`Failed to fetch games: ${response.statusText}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching games:", error);
        return [];
    }
}
