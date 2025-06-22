import { navigateTo } from "../router.js";

let gameSocketInstance: ReturnType<typeof gameSocket> | null = null;

export const gameSocket = (updateGameState: any, id: number, name: string, roomId: string, tournamentInfo : any) => {
	const socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/online_game");

	socket.onopen = () => {
		console.log("Enviando gameSocket con tournamentInfo:", tournamentInfo);

		socket.send(JSON.stringify({
			id,
			name,
			roomId: roomId,
			status: "ready",
			action: "join_game",
			tournamentInfo: tournamentInfo
		}));
	};

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.roomId && data.roomId !== roomId) return;

		if (data.type === "game_over") {			
			console.log("Partida terminada, ganador:", data.winner);
			alert(`¡Fin del juego! Ganador: ${data.winner}`);
			if (tournamentInfo && window.tournamentSocket) {
				window.tournamentSocket.send(JSON.stringify({
					action: "report_winner",
					tournamentId: tournamentInfo.tournamentId,
					round: tournamentInfo.round,
					winner: data.winner
				}));
			}
			return;
		}
		
		if (data.gameState) {
			updateGameState(data);
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

	const instance = {
		sendMove: (direction: "up" | "down", id: number) => {
			socket.send(JSON.stringify({
				action: "move_paddle",
				direction,
				id,
				roomId
			}));
		},
		close: () => socket.close(),
		socket
	};
	
	gameSocketInstance = instance;

	return instance;
};

window.addEventListener("beforeunload", () => {
	gameSocketInstance?.close();
});
