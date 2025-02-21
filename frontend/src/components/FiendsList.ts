import { Friend } from "./FriendContainer.js";
export const FriendList = () => 
{
    const container = document.createElement("div");
	container.className = "rounded-lg shadow-lg border flex flex-col gap-6 p-4 text-2xl mt-10 items-center w-full";

    const friends = [ 
        {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "Pepe", connected: true, userID: 1},
        {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "Juan", connected: true, userID: 2},
        {avatarUrl: "https://dummyimage.com/128x72/fff/aaa", name: "José", connected: false, userID: 3},
        
    ];
    friends.forEach(({avatarUrl, name, connected, userID}) =>{
        container.appendChild(Friend(avatarUrl, name, connected, userID))
    });
    return container;
}