export const createMatchmakingSocket = (onReady: (gameState: any) => void, userId : number) => {

	let socket = new WebSocket("wss://transcendence.fr:8080/api/game/online_matchmaking")
	socket.onopen = function (e) {
		alert("[open] Conexión esablecida");
		socket.send(JSON.stringify({ id: userId, action: "join_queue"}));
	}

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
	
		if (data.status === "ready") {
			console.log("¡Partida lista!", data);
			console.log(`Jugadores: ${data.players.join(" vs ")}`);
			console.log(`Sala: ${data.roomId}`);
			onReady(data.gameState);
			socket.close();
		}
	};

	socket.onclose = function (event) {
		if (event.wasClean) {
			alert(`[close] Conexión cerrrada limpiamente, código=${event.code} motivo=${event.reason}`)
		} else {
			alert('[close] La conexión se cayó');
		}
	};

	socket.onerror = function (error) {
		alert(`[error]`);
	};

	return socket;
}
