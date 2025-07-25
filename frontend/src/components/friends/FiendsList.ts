import { Friend } from "./FriendContainer.js";
import { getFriendsList } from "../../api/friends/friendsAPI.js";
import { UserI } from "../../types/types.js";
import { statusSocket } from "../../sockets/statusSocket.js";
import { fetchUserData } from "../../hooks/fetchUserData.js";

export const FriendList = async () => {
	const container = document.createElement("div");
	container.className = "rounded-lg flex flex-col gap-6 p-4 text-2xl mt-10 items-center w-full";

	const statusDots = new Map<number, HTMLElement>();

	try {
		const response = await getFriendsList();
		console.log("Friends: ", response);

		if (!response || response.length === 0) {
			const noFriendsMessage = document.createElement("p");
			noFriendsMessage.className = "text-white";
			noFriendsMessage.textContent = "No tienes amigos aún.";
			container.appendChild(noFriendsMessage);
			return container;
		}
		response.forEach(({ username, id, avatar_blob, presentacion }: UserI) => {
			const { element, statusDot } = Friend(
				avatar_blob || "https://dummyimage.com/128x72/fff/aaa",
				username,
				false,
				Number(id),
				presentacion
			);
			statusDots.set(Number(id), statusDot);
			container.appendChild(element);
		});

		fetchUserData((user) => {
			statusSocket(user.id, user.username, "getOnlineUsers", (onlineUsers) => {
				const onlineIds = onlineUsers
					.filter((u) => u.id !== user.id)
					.map((u) => Number(u.id));
				statusDots.forEach((dot, friendId) => {
					const isOnline = onlineIds.includes(friendId);
					dot.className = `w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`;
					dot.title = isOnline ? "Online" : "Offline";
				});
			});

		});

	} catch (error) {
		console.error("Error al obtener la lista de amigos:", error);
	}
	return container;
};
