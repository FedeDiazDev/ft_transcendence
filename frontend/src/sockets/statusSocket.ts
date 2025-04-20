let socket: WebSocket | null = null;

export const statusSocket = (
	id: number,
	username: string,
	action: "login" | "getOnlineUsers",
	onOnlineUsersReceived?: (users: any[]) => void
) => {
	const connectSocket = () => {
		socket = new WebSocket("wss://localhost:8080/api/users/onlineStatus");

		socket.onopen = () => {
			if (id) {
				socket!.send(JSON.stringify({ id, username, action: "login" }));
			}

			if (action === "getOnlineUsers") {
				setTimeout(() => {
					socket!.send(JSON.stringify({ action: "getOnlineUsers" }));
				}, 100);
			}
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.action === "onlineUsers" && onOnlineUsersReceived) {
				onOnlineUsersReceived(data.users);
			}
		};

		socket.onclose = (event) => {
			console.log(
				event.wasClean
					? `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
					: "[close] La conexión se cayó en statusSocket"
			);
			socket = null;
		};

		socket.onerror = () => {
			console.error("[error] en WebSocket");
		};
	};

	if (!socket || socket.readyState === WebSocket.CLOSED) {
		connectSocket();
	} else if (socket.readyState === WebSocket.OPEN) {
		if (action === "getOnlineUsers") {
			socket.send(JSON.stringify({ action: "getOnlineUsers" }));
		}
	}

	return socket;
};
