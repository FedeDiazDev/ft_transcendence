let socket: WebSocket | null = null;
let lastOnlineUsersCallback: ((users: any[]) => void) | null = null;

export const statusSocket = (
	id: number,
	username: string,
	action: "login" | "getOnlineUsers",
	onOnlineUsersReceived?: (users: any[]) => void
) => {
	let interval: number | null = null;

	// Guardar siempre el último callback proporcionado
	if (onOnlineUsersReceived) {
		lastOnlineUsersCallback = onOnlineUsersReceived;
	}

	const connectSocket = () => {
		socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/users/onlineStatus");

		socket.onopen = () => {
			console.log("✅ WebSocket conectado");

			interval = setInterval(() => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(JSON.stringify({ action: "ping" }));
				}
			}, 30000);

			if (id) {
				socket!.send(JSON.stringify({ id, username, action: "login" }));
			}
			
			if (action === "getOnlineUsers") {
				setTimeout(() => {
					console.log("📨 Enviando getOnlineUsers");
					socket!.send(JSON.stringify({ action: "getOnlineUsers" }));
				}, 100);
			}
		};

		socket.onmessage = (event) => {
			console.log("📩 Mensaje recibido", event.data);

			const data = JSON.parse(event.data);

			if (data.action === "onlineUsers" && lastOnlineUsersCallback) {
				lastOnlineUsersCallback(data.users);
			}
		};

		socket.onclose = (event) => {
			if (interval) clearInterval(interval);

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
		console.log("🔌 Conectando socket");
		connectSocket();
	} else if (socket.readyState === WebSocket.OPEN) {
		if (action === "getOnlineUsers") {
			console.log("📨 Socket ya abierto, enviando getOnlineUsers");
			socket.send(JSON.stringify({ action: "getOnlineUsers" }));
		}
	}

	return socket;
};
