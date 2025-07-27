export const createMatchmakingSocket = (onReady: (gameState: any, roomId : string) => void, userId: number) => {

	let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/online_matchmaking")
	socket.onopen = function (e) {
		//alert("[open] Conexión esablecida");
		socket.send(JSON.stringify({ id: userId, action: "join_queue" }));
	}

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.status === "ready") {
			// console.log("¡Partida lista!", data);
			// console.log(`Jugadores: ${data.players.join(" vs ")}`);
			// console.log(`Sala: ${data.roomId}`);
			onReady(data.gameState, data.roomId);
			socket.close();
		}
	};

	// socket.onclose = function (event) {
	// 	if (event.wasClean) {
	// 		console.log(`[close] Conexión cerrrada limpiamente, código=${event.code} motivo=${event.reason}`)
	// 	} else {
	// 		console.log('[close] La conexión se cayó');
	// 	}
	// };

	socket.onerror = function (error) {
		alert(`[error]`);
	};

	return socket;
}
