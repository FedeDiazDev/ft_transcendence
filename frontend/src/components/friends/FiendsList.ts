import { Friend } from "./FriendContainer.js";
import { getFriendsList } from "../../api/friends/friendsAPI.js";
import { UserI } from "../../types/types.js";
import { statusSocket } from "../../sockets/statusSocket.js";
import { fetchUserData } from "../../hooks/fetchUserData.js";
export const FriendList = async () => {
    const container = document.createElement("div");
    container.className = "rounded-lg shadow-lg border flex flex-col gap-6 p-4 text-2xl mt-10 items-center w-full";
    try {
        const response = await getFriendsList();
        fetchUserData((user) => {
            const id = user.id;
            statusSocket(id, "getOnlineUsers", (onlineUsers) => {
                if (!response || response.length === 0) {
                    const noFriendsMessage = document.createElement("p");
                    noFriendsMessage.textContent = "No tienes amigos aún.";
                    container.appendChild(noFriendsMessage);
                } else {
                    response.forEach(({ username, id }: UserI) => {
                        const isOnline = onlineUsers.some((user) => user.id === id);
                        container.appendChild(Friend("https://dummyimage.com/128x72/fff/aaa", username, isOnline, id));
                    });
                }
            });
        })
    } catch (error) {
        console.error("Error al obtener la lista de amigos:", error);
    }
    return container;
}
