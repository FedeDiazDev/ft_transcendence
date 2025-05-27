import { openTournaments, registerPlayer } from "../api/game/tournamentAPI.js";
import { fetchUserData } from "../hooks/fetchUserData.js";
import { joinSocket } from "../sockets/tournamentSocket.js"
export const JoinTournament = () => {
	const container = document.createElement("div");
	container.className =
		"flex flex-row items-center justify-center h-screen bg-gray-900 text-white gap-6";

	const parentContainer = document.createElement("div");
	parentContainer.className = "flex flex-col items-center";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "Torneos disponibles";
	createTitle.className = "text-2xl font-semibold mb-4";
	parentContainer.appendChild(createTitle);

	container.appendChild(parentContainer);

	(async () => {
		try {
			const response = await openTournaments();
			if (response?.error) {
				console.error(response.error);
				return;
			}

			const tournaments = response.tournaments;
			tournaments.forEach((tournament : any) => {
				const tournamentCard = document.createElement("div");
				tournamentCard.className =
					"bg-gray-800 p-4 rounded-xl shadow-md mb-4 w-80 text-center";

				const name = document.createElement("h3");
				name.textContent = tournament.name;
				name.className = "text-xl font-bold mb-2";

				const players = document.createElement("p");
				players.textContent = `Jugadores: ${tournament.number_players}`;

				const status = document.createElement("p");
				status.textContent = `Estado: ${tournament.status}`;

				const joinButton = document.createElement("button");
				joinButton.textContent = "Unirse";
				joinButton.className =
					"mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700";
				joinButton.addEventListener("click", async () => {
                    const response = await registerPlayer(tournament.id);
                    if (response.error){
                        console.error(response.error);
                    }
					console.log(`Unirse al torneo con ID: ${tournament.id}`);
					fetchUserData((user) => {
						joinSocket(user.username, "join", tournament.id);
					})
                    console.log("Unido al torneo correctamente");
				});

				tournamentCard.appendChild(name);
				tournamentCard.appendChild(players);
				tournamentCard.appendChild(status);
				tournamentCard.appendChild(joinButton);

				parentContainer.appendChild(tournamentCard);
			});
		} catch (error) {
			console.error("Error al obtener torneos:", error);
		}
	})();

	return container;
};
