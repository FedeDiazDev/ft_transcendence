import { navigateTo } from "../router.js";
import { createTournament } from "../api/game/tournamentAPI.js";
import { joinSocket } from "../sockets/tournamentSocket.js";
import { fetchUserData } from "../hooks/fetchUserData.js";

export const CreateTournament = () => {
	const container = document.createElement("div");
	container.className =
		"flex flex-col items-center justify-center h-screen text-white gap-6";

	const data = document.createElement("div");
	data.className = "flex flex-col items-center justify-center gap-4";

	const parentContainer = document.createElement("div");
	parentContainer.className =
		"flex flex-col items-center p-16 rounded-xl bg-base-black2";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "🏆 Create Tournament";
	createTitle.className = "text-2xl font-semibold mb-4";

	const createForm = document.createElement("form");
	createForm.className = "flex flex-col gap-14 my-8";

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.placeholder = "Name";
	nameInput.required = true;
	nameInput.maxLength = 10; // Límite HTML
	nameInput.className =
		"p-2 bg-gradient-to-r from-[#0D1013] to-[#101115] text-white border-b border-white focus:outline-none focus:border-white transition";

	const selectInput = document.createElement("select");
	selectInput.required = true;
	selectInput.className =
		"appearance-none bg-gradient-to-r from-[#0D1013] to-[#101115] text-white border-0 border-b-2 border-white px-2 py-2 rounded-none";

	const fourOption = document.createElement("option");
	fourOption.value = "4";
	fourOption.textContent = "4 participants";

	const eightOption = document.createElement("option");
	eightOption.value = "8";
	eightOption.textContent = "8 participants";

	selectInput.append(fourOption, eightOption);

	const errorMessage = document.createElement("p");
	errorMessage.className = "text-red-500 text-sm h-5";
	errorMessage.textContent = "";

	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.textContent = "Create";
	submitBtn.className =
		"mt-2 px-8 py-4 rounded-xl text-white bg-base-black2 self-end";

	createForm.append(nameInput, selectInput);
	parentContainer.append(createTitle, createForm);
	data.appendChild(parentContainer);
	data.appendChild(errorMessage);
	data.appendChild(submitBtn);
	container.append(data);

	submitBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		errorMessage.textContent = "";

		const name = nameInput.value.trim();
		const number_participants = parseInt(selectInput.value);

		// Validación de longitud
		if (name.length > 10) {
			errorMessage.textContent = "El nombre no puede tener más de 10 caracteres.";
			return;
		}

		try {
			const response = await createTournament(name, number_participants);

			fetchUserData((user) => {
				joinSocket(
					user.username,
					"create",
					response.tournamentState.id,
					container,
					"",
					number_participants
				);
				navigateTo("/tournament/join");
			});
		} catch (error: unknown) {
			let message = "Hubo un error al crear el torneo. Inténtalo de nuevo.";

			if (error instanceof Error) {
				if (error.message.includes("409")) {
					message = "Ya existe un torneo con ese nombre.";
				} else {
					console.error("Error creando torneo:", error);
					message = error.message;
				}
			}
			errorMessage.textContent = message;
		}
	});

	return container;
};
