import { getFriendData} from '../profile/profileAPI.js';

export async function getUserStats() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/user", {
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
        console.error("Error fetching user stats:", error);
        return null;
    }
}

export async function getFriendStats(id: number) {

    try {
        console.log("Fetching friend data for user ID:", id);
        const friendData = await getFriendData(id);
        console.log("Friend data are:", friendData);
        const username = friendData.user.username;
        console.log("friend username is :", username);
        const response = await fetch("https://" + window.location.hostname + ":8080/api/stats/friend/" + username, {
            method: "GET"
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