import { openTournaments, registerPlayer, checkPlayer, checkNickname } from "../api/game/tournamentAPI.js";
import { fetchUserData } from "../hooks/fetchUserData.js";
import { joinSocket } from "../sockets/tournamentSocket.js"

declare global {
	interface Window {
		tournamentSocket?: WebSocket;
	}
}

export const JoinTournament = () => {
	const container = document.createElement("div");
	container.className = "flex flex-row items-center justify-center h-screen text-white gap-6";

	const parentContainer = document.createElement("div");
	parentContainer.className = "flex flex-col items-center gap-6";

	const tournamentsContainer = document.createElement("div");
	tournamentsContainer.className = "flex flex-row items-center justify-center flex-wrap gap-12"

	const createTitle = document.createElement("h2");
	createTitle.textContent = "Torneos disponibles";
	createTitle.className = "text-2xl font-semibold mb-4";
	parentContainer.appendChild(createTitle);

	container.appendChild(parentContainer);
	parentContainer.appendChild(tournamentsContainer);
	const showError = (msg: string) => {
		const errorMsg = document.createElement("p");
		errorMsg.textContent = msg;
		errorMsg.className = "text-red-500 mt-4";
		parentContainer.appendChild(errorMsg);
	};

	const renderTournaments = (tournaments: any[]) => {
		tournaments.forEach((tournament) => {
			const tournamentCard = document.createElement("div");
			tournamentCard.className = "bg-gradient-to-r from-[#0D1013] to-[#101115] p-4 rounded-xl shadow-md mb-4 w-80 text-center";

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

			joinButton.addEventListener("click", () => {
				const overlay = document.createElement("div");
				overlay.className = "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";

				const modal = document.createElement("div");
				modal.className = "bg-[#0D1013] p-6 rounded-lg shadow-lg max-w-sm w-full text-white flex flex-col gap-4";

				const title = document.createElement("h3");
				title.textContent = `Pon tu nick para "${tournament.name}"`;
				title.className = "text-xl font-semibold";

				const input = document.createElement("input");
				input.type = "text";
				input.placeholder = "Tu nickname";
				input.className = "p-2 rounded bg-[#1f2226] text-white outline-none";

				const errorMsg = document.createElement("p");
				errorMsg.className = "text-red-500 text-sm hidden";

				const buttonsContainer = document.createElement("div");
				buttonsContainer.className = "flex justify-end gap-4";

				const cancelBtn = document.createElement("button");
				cancelBtn.textContent = "Cancelar";
				cancelBtn.className = "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600";

				const submitBtn = document.createElement("button");
				submitBtn.textContent = "Unirse";
				submitBtn.className = "px-4 py-2 bg-green-600 rounded hover:bg-green-700";

				input.addEventListener("keydown", (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						submitBtn.click();
					}
				});

				buttonsContainer.appendChild(cancelBtn);
				buttonsContainer.appendChild(submitBtn);

				modal.appendChild(title);
				modal.appendChild(input);
				modal.appendChild(errorMsg);
				modal.appendChild(buttonsContainer);
				overlay.appendChild(modal);
				document.body.appendChild(overlay);

				cancelBtn.addEventListener("click", () => {
					document.body.removeChild(overlay);
					joinButton.disabled = false;
					joinButton.textContent = "Unirse";
				});

				submitBtn.addEventListener("click", async () => {
					const alias = input.value.trim();
					if (!alias) {
						errorMsg.textContent = "El nickname no puede estar vacío";
						errorMsg.classList.remove("hidden");
						return;
					}

					if (alias.length > 20) {
						errorMsg.textContent = "El nickname no puede tener más de 20 caracteres";
						errorMsg.classList.remove("hidden");
						return;
					}

					submitBtn.disabled = true;
					submitBtn.textContent = "Comprobando...";

					try {
						const nicknameExists = await checkNickname(tournament.id, alias);
						if (nicknameExists.exists) {
							errorMsg.textContent = `El nick "${alias}" ya está en uso en este torneo.`;
							errorMsg.classList.remove("hidden");
							submitBtn.disabled = false;
							submitBtn.textContent = "Unirse";
							return;
						}

						const response = await registerPlayer(tournament.id, alias);
						if (response.error) {
							errorMsg.textContent = response.error;
							errorMsg.classList.remove("hidden");
							submitBtn.disabled = false;
							submitBtn.textContent = "Unirse";
							return;
						}

						localStorage.setItem("lastTournamentAlias", alias);
						document.body.removeChild(overlay);

						const gameContainer = document.createElement("div");
						gameContainer.className = "flex flex-col items-center justify-center h-screen text-white";
						parentContainer.innerHTML = "";
						parentContainer.appendChild(gameContainer);

						const queueList = document.createElement("ul");
						queueList.id = "queue-list";
						queueList.className = "w-full max-w-4xl mx-auto px-4 mt-8";
						gameContainer.appendChild(queueList);

						fetchUserData((user) => {
							window.tournamentSocket = joinSocket(
								user.username,
								"join",
								tournament.id,
								gameContainer,
								alias
							);
						});

					} catch (error) {
						errorMsg.textContent = "Error al unirse al torneo";
						errorMsg.classList.remove("hidden");
						submitBtn.disabled = false;
						submitBtn.textContent = "Unirse";
					}
				});
				joinButton.disabled = true;
				joinButton.textContent = "Uniendo...";
			});

			tournamentCard.appendChild(name);
			tournamentCard.appendChild(players);
			tournamentCard.appendChild(status);
			tournamentCard.appendChild(joinButton);
			tournamentsContainer.appendChild(tournamentCard);
		});
	};

	(async () => {
		try {
			const response = await openTournaments();
			if (response?.error) {
				showError(response.error);
				return;
			}
			tournamentsContainer.innerHTML = "";
			renderTournaments(response.tournaments);
		} catch (error) {
			showError("Error al obtener torneos");
		}
	})();

	(async () => {
		try {
			const tournamentStatus = await checkPlayer();
			if (tournamentStatus?.result) {
				const { tournament_id } = tournamentStatus.result;
				const alias = localStorage.getItem("lastTournamentAlias") || "Jugador";

				const gameContainer = document.createElement("div");
				gameContainer.className = "flex flex-col items-center justify-center h-screen text-white";
				parentContainer.innerHTML = "";
				parentContainer.appendChild(gameContainer);

				const queueList = document.createElement("ul");
				queueList.id = "queue-list";
				gameContainer.appendChild(queueList);

				fetchUserData((user) => {
					window.tournamentSocket = joinSocket(
						user.username,
						"join",
						tournament_id,
						gameContainer,
						alias
					);
				});
				return;
			}

			const response = await openTournaments();
			if (response?.error) {
				showError(response.error);
				return;
			}
			tournamentsContainer.innerHTML = "";
			renderTournaments(response.tournaments);
		} catch (error) {
			showError("Error al obtener torneos");
		}
	})();
	return container;
};