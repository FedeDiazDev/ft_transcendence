import { Friend } from "./FriendContainer.js";
import { getFriendsList } from "../../api/friends/friendsAPI.js";
export const FriendList = () => 
{
    const container = document.createElement("div");
	container.className = "rounded-lg shadow-lg border flex flex-col gap-6 p-4 text-2xl mt-10 items-center w-full";
    try {
        const amiguis = getFriendsList();
        console.log(amiguis);

        // // Si no hay amigos, puedes manejar el caso de forma diferente.
        // if (!amiguis || amiguis.length === 0) {
        //     const noFriendsMessage = document.createElement('p');
        //     noFriendsMessage.textContent = "No tienes amigos aún.";
        //     container.appendChild(noFriendsMessage);
        // } else {
        //     // Iterar sobre la lista de amigos obtenida desde la API
        //     amiguis.forEach(({ avatarUrl, name, connected, userID }) => {
        //         container.appendChild(Friend(avatarUrl, name, connected, userID));
        //     });
       // }
    } catch (error) {
        console.error("Error al obtener la lista de amigos:", error);
    }
    // const friends = [ 
    //     {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "Pepe", connected: true, userID: 1},
    //     {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "Juan", connected: true, userID: 2},
    //     {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "José", connected: false, userID: 3},
        
    // ];
    // friends.forEach(({avatarUrl, name, connected, userID}) =>{
    //     container.appendChild(Friend(avatarUrl, name, connected, userID))
    // });
    return container;
}