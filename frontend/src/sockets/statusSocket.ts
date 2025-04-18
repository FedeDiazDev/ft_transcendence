export const statusSocket = (
	id: number,
	action: "login" | "getOnlineUsers",
	onOnlineUsersReceived?: (users: any[]) => void
) => {
	const socket = new WebSocket("wss://localhost:8080/api/users/onlineStatus");

	socket.onopen = () => {
		socket.send(JSON.stringify({ id, action }));

		if (action === "getOnlineUsers") {
			socket.send(JSON.stringify({ action: "getOnlineUsers" }));
		}
	};

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.action === "onlineUsers" && onOnlineUsersReceived) {
			onOnlineUsersReceived(data.users);
		}
	};

	socket.onclose = (event) => {
		console.log(event.wasClean
			? `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
			: '[close] La conexión se cayó en gameSocket');
	};

	socket.onerror = () => {
		alert(`[error]`);
	};

	return socket;
};
