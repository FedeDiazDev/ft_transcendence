import { fetchUserData } from "../hooks/fetchUserData.js";
import { navigateTo } from "../router.js";

let gameSocketInstance: ReturnType<typeof gameSocket> | null = null;
let currrentPlayerName : string | null = null;

export function showCard(winner: boolean) {
	const overlay = document.createElement("div");
	overlay.className = `
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/40 backdrop-blur-sm
  `;

	const card = document.createElement("div");
	card.className = `
    flex flex-col items-center gap-4 px-10 py-8 rounded-3xl
    bg-gradient-to-br from-[#0B0C0E] to-[#141519]
    shadow-[0_0_15px_#000_inset,0_0_10px_#000]
    w-[320px] md:w-[380px] text-center
    ${winner ? "ring-2 ring-green-400/30" : "ring-2 ring-red-400/30"}
  `;

	const icon = document.createElement("div");
	icon.className = `
    w-16 h-16 rounded-full flex items-center justify-center text-3xl
    ${winner ? "bg-green-600/10" : "bg-red-600/10"}
  `;
	icon.textContent = winner ? "🏆" : "❌";

	const title = document.createElement("p");
	title.className = "text-white text-lg font-semibold";
	title.textContent = winner ? "Congratulations!" : "¡Oh no!";

	const subtitle = document.createElement("p");
	subtitle.className = "text-gray-400 text-sm";
	subtitle.textContent = winner
		? "You won this match"
		: "You lost this match";

	card.append(icon, title, subtitle);
	overlay.append(card);
	document.body.append(overlay);

	setTimeout(() => overlay.remove(), 3000);
}

export const gameSocket = (updateGameState: any, id: number, name: string, roomId: string, tournamentInfo: any) => {
	const socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/online_game");

	socket.onopen = () => {
		//console.log("Enviando gameSocket con tournamentInfo:", tournamentInfo);
		currrentPlayerName = name;
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
			fetchUserData((user) => {
				if (currrentPlayerName === data.winner) showCard(true)
				else showCard(false)
			})
			if (window.location.pathname.endsWith("online_game")) { setTimeout(() => navigateTo("/"), 3000) }
			//console.log("Partida terminada, ganador:", data.winner);
			setTimeout(() => {
				if (
					tournamentInfo &&
					window.tournamentSocket &&
					window.tournamentSocket.readyState === 1
				) {
					//console.log("Enviando report_winner al servidor...");
					window.tournamentSocket.send(JSON.stringify({
						action: "report_winner",
						tournamentId: tournamentInfo.tournamentId,
						round: tournamentInfo.round,
						winner: data.winner
					}));
				} else {
					console.warn("Socket no listo para enviar report_winner");
				}
			}, 1000);
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
