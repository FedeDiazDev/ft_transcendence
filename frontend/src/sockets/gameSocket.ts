

export const gameSocket = (updateGameState : any) => {
	let socket = new WebSocket("ws://localhost:4444/online/game");
	socket.onopen = function (e) {
		alert("[open] Conexión establecida.");
		socket.send(JSON.stringify({ id: Math.floor(Math.random() * 5), roomId: Date.now(), status: "ready", action: "join_game" }));
	}
	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log(data);
		updateGameState(data);
	}
	socket.onclose = function (event) {
		if (event.wasClean) {
			alert(`[close] Conexión cerrrada limpiamente, código=${event.code} motivo=${event.reason}`)
		} else {
			alert('[close] La conexión se cayó en gameSocket');
		}
	};

	socket.onerror = function (error) { 
		alert(`[error]`);
	}
	return socket;
}