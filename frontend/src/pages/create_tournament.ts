import { navigateTo } from "../router.js";
import { createTournament } from "../api/game/tournamentAPI.js"
import { joinSocket } from "../sockets/tournamentSocket.js";
import { fetchUserData } from "../hooks/fetchUserData.js";

export const CreateTournament = () => {
	const container = document.createElement("div");
	container.className =
		"flex flex-col items-center justify-center h-screen text-white gap-6";
	const data = document.createElement("div");
	data.className ="flex flex-col items-center justify-center gap-4";

	const parentContainer = document.createElement("div");
	parentContainer.className = "flex flex-col items-center p-16 rounded-xl bg-base-black2";

	const createTitle = document.createElement("h2");
	createTitle.textContent = "🏆 Create Tournament";
	createTitle.className = "text-2xl font-semibold mb-4";

	const createForm = document.createElement("form");
	createForm.className = "flex flex-col gap-14 my-8";

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.placeholder = "Name";
	nameInput.required = true;
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

	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.textContent = "Create";
	submitBtn.className = "mt-2 px-8 py-4 rounded-xl text-white bg-base-black2 self-end";

	createForm.append(nameInput, selectInput);
	parentContainer.append(createTitle, createForm);
	data.appendChild(parentContainer);
	data.appendChild(submitBtn);
	container.append(data);

	// Evento submit
	submitBtn.addEventListener("click", async (e) => {
		e.preventDefault();

		const name = nameInput.value.trim();
		const number_participants = parseInt(selectInput.value);
		try {

			const response = await createTournament(name, number_participants);
			if (response.error) {
				console.error(response.error);
				return;
			}
			console.log(response);
			console.log("Torneo creado correctamente");
			fetchUserData((user) => {
				joinSocket(user.username, "create", response.tournamentState.id, container, number_participants);
				navigateTo("/tournament/join")

			})
		} catch (error) {
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
