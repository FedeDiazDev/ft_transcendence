export const gameSocket = (updateGameState: any, id: number, name: string) => {
	let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/online_game");
	socket.onopen = function (e) {
		alert("[open] Conexión establecida.");
		socket.send(JSON.stringify({ id: id, name: name, roomId: Date.now(), status: "ready", action: "join_game" }));
	}
	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		//console.log(data);
		if (data.type === "game_over") {
			console.log("Partida terminada, ganador:", data.winner);
			alert(`¡Fin del juego! Ganador: ${data.winner}`);
			return;
		}
		if (data.gameState) {
			updateGameState(data);
		}
	}
	socket.onclose = function (event) {
		console.log(event.wasClean
			? `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
			: '[close] La conexión se cayó en gameSocket');
	};

	socket.onerror = function (error) {
		alert(`[error]`);
	}
	return {
		sendMove: (direction: "up" | "down", id: number) => {
			socket.send(JSON.stringify({ action: "move_paddle", direction, id: id }));
		},
		close: () => socket.close()
	};

}