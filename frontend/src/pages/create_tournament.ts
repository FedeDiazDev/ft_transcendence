import { navigateTo } from "../router.js";
import { createTournament } from "../api/game/tournamentAPI.js"

export const CreateTournament = () => {
	const container = document.createElement("div");
	container.className =
		"flex flex-row items-center justify-center h-screen bg-gray-900 text-white gap-6";

	const parentContainer = document.createElement("div");
	parentContainer.className = "flex flex-col items-center";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "🏆 Crear Torneo";
	createTitle.className = "text-2xl font-semibold mb-4";

	const createForm = document.createElement("form");
	createForm.className = "flex flex-col gap-4";

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.placeholder = "Nombre del torneo";
	nameInput.required = true;
	nameInput.className =
		"p-2 bg-gray-800 text-white border border-gray-600 rounded-lg";

	const selectInput = document.createElement("select");
	selectInput.required = true;
	selectInput.className =
		"p-2 bg-gray-800 text-white border border-gray-600 rounded-lg";

	const fourOption = document.createElement("option");
	fourOption.value = "4";
	fourOption.textContent = "4 participantes";

	const eightOption = document.createElement("option");
	eightOption.value = "8";
	eightOption.textContent = "8 participantes";

	selectInput.append(fourOption, eightOption);

	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.textContent = "Crear torneo";
	submitBtn.className =
		"mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white";

	createForm.append(nameInput, selectInput, submitBtn);
	parentContainer.append(createTitle, createForm);
	container.appendChild(parentContainer);

	// Evento submit
	createForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const name = nameInput.value.trim();
		const number_participants = parseInt(selectInput.value);
		try {

			const response = await createTournament(name, number_participants);
			if (response.error){
				console.error(response.error);
				return;
			}
			console.log("Torneo creado correctamente");
		}catch(error){
			console.error("Error creating tournnament");
		}
		// try {
		// 	const res = await fetch("http://localhost:3000/tournaments", {
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({
		// 			name,
		// 			number_participants,
		// 			status: "open", // o el estado que uses por defecto
		// 		}),
		// 	});

		// 	if (!res.ok) throw new Error("Error al crear el torneo");

		// 	// Redirige o muestra éxito
		// 	navigateTo("/tournaments");
		// } catch (err) {
		// 	console.error(err);
		// 	alert("No se pudo crear el torneo.");
		// }
	});

	return container;
};
