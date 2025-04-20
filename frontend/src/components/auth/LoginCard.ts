import { fetchUserData } from "../../hooks/fetchUserData.js";
import { statusSocket } from "../../sockets/statusSocket.js";
import { navigateTo } from "../../router.js";

function clickOnButtonLogin(button: HTMLButtonElement, names: string[], errorDiv: HTMLDivElement) {
	button.addEventListener("click", async () => {
		errorDiv.innerHTML = '';
		const inputs: string[] = [];
		for (let i: number = 0; i < names.length; i++) {
			const inputElement = document.getElementById(names[i]);
			if (inputElement instanceof HTMLInputElement)
				inputs[i] = inputElement.value;
		}

		const sendData = {
			"user": inputs[0].trim(),
			"password": inputs[1]
		}

		if (!sendData.user || !sendData.password) {
			errorDiv.className = "text-sm mt-2 h-6 text-red-400";
			errorDiv.textContent = "All fields must be filled";
		}
		else
			fetchLogin(sendData, errorDiv);
	});
}

async function fetchLogin(sendData: { user: string, password: string }, errorDiv: HTMLDivElement) {
	try {
		const response = await fetch("https://" + window.location.hostname + ":8080/api/auth/login", {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(sendData),
		})
		const data = await response.json();

		if (data.statusCode) {
			errorDiv.className = "text-sm mt-2 h-6 text-red-400";
			errorDiv.textContent = data.message;
		}
		else {
			localStorage.setItem("username", data.username);
			localStorage.setItem("email", data.email);
			fetchUserData((user) => {
				statusSocket(user.id, user.username, "login");
			})
			navigateTo("/twofalogin");
		}

	} catch (error) {
		console.error("Fetch error:", error);
	}
}

export const LoginCard = () => {
	const div = document.createElement("div");
	div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-64 min-h-64 mx-auto text-white justify-evenly";

	const names = ["Username", "Password"];
	for (let i: number = 0; i < names.length; i++) {
		const text = document.createElement("h3");
		text.textContent = names[i];
		div.appendChild(text);

		const input = document.createElement("input");
		if (i === 1)
			input.type = "password";
		else
			input.type = "text";
		input.className = "text-black p-2 border rounded focus:outline-none transition";
		input.id = names[i];
        div.appendChild(input);
    }

	const errorDiv = document.createElement("div");
	div.appendChild(errorDiv);

	const button = document.createElement("button");
	button.textContent = "Login";
	button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";

	clickOnButtonLogin(button, names, errorDiv);

	div.appendChild(button);
	return div;
}
