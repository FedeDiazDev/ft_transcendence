import { openTournaments, registerPlayer } from "../api/game/tournamentAPI.js";
import { fetchUserData } from "../hooks/fetchUserData.js";
import { joinSocket } from "../sockets/tournamentSocket.js"

declare global {
	interface Window {
		tournamentSocket?: WebSocket;
	}
}


export const JoinTournament = () => {
	const container = document.createElement("div");
	container.className = "flex flex-row items-center justify-center h-screen bg-gray-900 text-white gap-6";

	const parentContainer = document.createElement("div");
	parentContainer.className = "flex flex-col items-center";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "Torneos disponibles";
	createTitle.className = "text-2xl font-semibold mb-4";
	parentContainer.appendChild(createTitle);

	container.appendChild(parentContainer);

	const showError = (msg: string) => {
		const errorMsg = document.createElement("p");
		errorMsg.textContent = msg;
		errorMsg.className = "text-red-500 mt-4";
		parentContainer.appendChild(errorMsg);
	};

	const renderTournaments = (tournaments: any[]) => {
		tournaments.forEach((tournament) => {
			const tournamentCard = document.createElement("div");
			tournamentCard.className = "bg-gray-800 p-4 rounded-xl shadow-md mb-4 w-80 text-center";

			const name = document.createElement("h3");
			name.textContent = tournament.name;
			name.className = "text-xl font-bold mb-2";

			const players = document.createElement("p");
			players.textContent = `Jugadores: ${tournament.number_players}`;

			const status = document.createElement("p");
			status.textContent = `Estado: ${tournament.status}`;

			const joinButton = document.createElement("button");
			joinButton.textContent = "Unirse";
			joinButton.className = "mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700";

			joinButton.addEventListener("click", async () => {
				joinButton.disabled = true;
				joinButton.textContent = "Uniendo...";
				try {
					const response = await registerPlayer(tournament.id);
					if (response.error) {
						showError(response.error);
						joinButton.disabled = false;
						joinButton.textContent = "Unirse";
						return;
					}

					const gameContainer = document.createElement("div");
					gameContainer.className = "flex flex-col items-center justify-center h-screen bg-gray-900 text-white";

					parentContainer.innerHTML = "";
					parentContainer.appendChild(gameContainer);
					const queueList = document.createElement("ul");
					queueList.id = "queue-list";
					gameContainer.appendChild(queueList);

					fetchUserData((user) => {
						window.tournamentSocket = joinSocket(user.username, "join", tournament.id, gameContainer);
					});

				} catch (error) {
					showError("Error al unirse al torneo");
					joinButton.disabled = false;
					joinButton.textContent = "Unirse";
				}
			});

			tournamentCard.appendChild(name);
			tournamentCard.appendChild(players);
			tournamentCard.appendChild(status);
			tournamentCard.appendChild(joinButton);

			parentContainer.appendChild(tournamentCard);
		});
	};

	(async () => {
		try {
			const response = await openTournaments();
			if (response?.error) {
				showError(response.error);
				return;
			}
			renderTournaments(response.tournaments);
		} catch (error) {
			showError("Error al obtener torneos");
		}
	})();

	return container;
};
