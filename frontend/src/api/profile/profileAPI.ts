import { API_URLS } from "../apiConfig.js"

export const getUserData = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URLS.profile}/getUser`, {
            method: 'GET',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        //console.error("Fetch error:", error);
    }
}

export const getFriendData = async (id: number): Promise<any> => {
    try {
        const response = await fetch(`${API_URLS.profile}/getUserById/${id}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        //console.error("Fetch error:", error);
    }
}

export const addFriend = async (friendId: number): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.profile}/addFriend`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        //console.error("Fetch error: ", error);
    }
}

export const deleteFriend = async (friendId : number) : Promise <any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URLS.profile}/deleteFriend/${friendId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        //console.error("Fetch error: ", error);
    }
}

export const getUserByUsername = async (username: string) => {
    try {
        const res = await fetch(`${API_URLS.profile}/getUserByUsername/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
        });

        if (!res.ok) throw new Error('User not found');
        const data = await res.json();

        return data.user;
    } catch(error) {
        //console.error('Error fetching user by username');
        throw error;
    }
}