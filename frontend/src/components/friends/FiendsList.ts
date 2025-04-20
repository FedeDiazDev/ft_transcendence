import { Friend } from "./FriendContainer.js";
import { getFriendsList } from "../../api/friends/friendsAPI.js";
import { UserI } from "../../types/types.js";
import { statusSocket } from "../../sockets/statusSocket.js";
import { fetchUserData } from "../../hooks/fetchUserData.js";

export const FriendList = async () => {
	const container = document.createElement("div");
	container.className = "...";

	const statusDots = new Map<number, HTMLElement>();

	try {
		const response = await getFriendsList();
		console.log(response);
		fetchUserData((user) => {
			statusSocket(user.id, user.username,"getOnlineUsers", (onlineUsers) => {
				console.log("ONLINE: ", onlineUsers);
				const onlineIds = onlineUsers.map((u) => u.id);
				container.innerHTML = "";
				if (response) {
					container.innerHTML = "";

					if (response.length === 0) {
						const noFriendsMessage = document.createElement("p");
						noFriendsMessage.textContent = "No tienes amigos aún.";
						container.appendChild(noFriendsMessage);
					} else {
						response.forEach(({ username, id }: UserI) => {
							const isOnline = onlineIds.includes(id);
							const { element, statusDot } = Friend("https://dummyimage.com/128x72/fff/aaa", username, isOnline, id);
							statusDots.set(id, statusDot);
							container.appendChild(element);
						});
					}
				} else {
					statusDots.forEach((dot, friendId) => {
						const isOnline = onlineIds.includes(friendId);
						dot.className = `w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`;
						dot.title = isOnline ? "Online" : "Offline";
					});
				}
			});
		});
	} catch (error) {
		console.error("Error al obtener la lista de amigos:", error);
	}
	return container;
};
