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