import { Friend } from "./FriendContainer.js";
import { getFriendsList } from "../../api/friends/friendsAPI.js";
import { UserI } from "../../types/types.js";
export const FriendList = async () => {
    const container = document.createElement("div");
    container.className = "rounded-lg shadow-lg border flex flex-col gap-6 p-4 text-2xl mt-10 items-center w-full";
    try {
        const response = await getFriendsList();
        console.log(response);
        if (!response || response.length === 0) {
            const noFriendsMessage = document.createElement('p');
            noFriendsMessage.textContent = "No tienes amigos aún.";
            container.appendChild(noFriendsMessage);
        } else {
            response.forEach(({ username, id }: UserI) => {
                container.appendChild(Friend("https://dummyimage.com/128x72/fff/aaa", username, true, id));
            });
        }
    } catch (error) {
        console.error("Error al obtener la lista de amigos:", error);
    }
    return container;
}
