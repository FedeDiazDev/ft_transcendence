import { navigateTo } from "../router.js";

export const Tournament = () => {
	const container = document.createElement("div");
	container.className = "flex flex-row items-center justify-center h-screen bg-gray-900 text-white gap-6";

	const createSection = document.createElement("div");
	createSection.className = "flex flex-col items-center gap-3";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "🏆 Crear Torneo";
	createTitle.className = "text-xl font-semibold";

	const createButton = document.createElement("button");
	createButton.textContent = "Crear Torneo";
	createButton.className = "p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition cursor-pointer";

	createSection.appendChild(createTitle);	
	createSection.appendChild(createButton);

	const joinSection = document.createElement("div");
	joinSection.className = "flex flex-col items-center gap-3";

	const joinTitle = document.createElement("h2");
	joinTitle.textContent = "🔗 Unirse a Torneo";
	joinTitle.className = "text-xl font-semibold";

	const joinButton = document.createElement("button");
	joinButton.textContent = "Unirse";
	joinButton.className = "p-2 bg-green-500 rounded-lg hover:bg-green-600 transition cursor-pointer";

	joinSection.appendChild(joinTitle);	
	joinSection.appendChild(joinButton);
	container.appendChild(createSection);
	container.appendChild(joinSection);

	createButton.addEventListener("click", () => {
		// const tournamentName = tournamentNameInput.value.trim();
		navigateTo(`/tournament/create`);
		// if (tournamentName) {
			// navigateTo(`/tournament/create?name=${encodeURIComponent(tournamentName)}`);
		// }
	});

	joinButton.addEventListener("click", () => {
		// const tournamentId = tournamentIdInput.value.trim();
		navigateTo(`/tournament/join`);
		// if (tournamentId) {
			// navigateTo(`/tournament/join?id=${encodeURIComponent(tournamentId)}`);
		// }
	});
	return container;
};
