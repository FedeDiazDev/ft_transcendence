import { navigateTo } from "../../router.js";

function parseUsername(username: string, errors: string[])
{
	if (/[^a-zA-Z0-9\s.,@!#$%&*()\-_=+]/.test(username))
		errors.push("*Username contains forbidden characters")
	if (username.length > 20)
		errors.push("*Username must be below 20 characters")
}

function parseEmail(email: string, errors: string[])
{
	if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) 
		errors.push("*Incorrect email format");
	if (email.length > 254)
		errors.push("*Email must be below 254 characters");
}

function parsePassword(password: string, errors: string[])
{
	if (password.length < 8 || password.length > 20)
		errors.push("*Password must be between 8 and 20 characters");
	if (!/[A-Za-z]/.test(password))
		errors.push("*Password must contain at least one letter");
	if (!/\d/.test(password))
		errors.push("*Password must contain at least one number");
}

function parseCheckPwd(password: string, confirmPassword: string, errors: string[])
{
	if (password !== confirmPassword)
		errors.push("*Confirm Password does not match");
}

function parseFront(sendData: { username?: string, email?: string, password?: string, confirmPassword?: string }) {

	let errors: string[] = [];

	if (!sendData.username || !sendData.email || !sendData.password || !sendData.confirmPassword) {
		errors.push("*All fields must be filled");
		return errors;
	}
	parseUsername(sendData.username, errors);
	parseEmail(sendData.email, errors);
	parsePassword(sendData.password, errors);
	parseCheckPwd(sendData.password, sendData.confirmPassword, errors);

	return errors;
}

function showErrors(frontErrors: string[], errorDiv: HTMLDivElement) {
	for (let i = 0; i < frontErrors.length; i++) {
		const newDiv = document.createElement("div");
		newDiv.className = "text-sm mt-2 mb-2 text-red-400";
		newDiv.textContent = frontErrors[i];
		errorDiv.appendChild(newDiv);
	}
}

function clickOnButtonSignup(button: HTMLButtonElement, names: string[], errorDiv: HTMLDivElement) {
	button.addEventListener("click", async () => {
		errorDiv.innerHTML = '';
		const inputs: string[] = [];
		for (let i: number = 0; i < names.length; i++) {
			const inputElement = document.getElementById(names[i]);
			if (inputElement instanceof HTMLInputElement)
				inputs[i] = inputElement.value;
		}
		const sendData = {
			"username": inputs[0].trim(),
			"email": inputs[1].trim(),
			"password": inputs[2],
			"confirmPassword": inputs[3]
		}


		let frontErrors: string[] = parseFront(sendData);

		showErrors(frontErrors, errorDiv);

		if (frontErrors.length === 0) {
			localStorage.setItem("username", inputs[0].trim());
			localStorage.setItem("email", inputs[1].trim());
			fetchSignup(sendData, errorDiv);
		}
	});
}

async function fetchSignup(sendData: { username: string, email: string, password: string, confirmPassword: string }, errorDiv: HTMLDivElement) {
	try {
		const response = await fetch("https://" + window.location.hostname + ":8080/api/auth/signup", {
			method: "POST",
			headers: { "Content-type": "application/json; charset=UTF-8" },
			body: JSON.stringify(sendData),
		})
		if (response.status !== 200) {
			errorDiv.className = "text-sm mt-2 h-6 text-red-400"
			errorDiv.textContent = "*User or email already exists";
			return;
		}
		const data = await response.json();
		data.username = sendData.username;
		data.password = sendData.password;
		localStorage.setItem("QRCode", data.QR);
		localStorage.setItem("tempToken", data.tempToken);
		navigateTo("/qrcode");
	} catch (error) {
		//console.error("Fetch error:", error);
	}
}

export const SignupCard = () => {
	const div = document.createElement("div");
	div.className = "flex flex-col items-center gap-2 p-6 bg-gradient-to-r from-[#0D1013] to-[#101115] shadow-xl rounded-lg w-80 min-h-80 mx-auto text-white justify-evenly";

	const names = ["Username", "Email", "Password", "Confirm password"];
	const types = ["text", "email", "password", "password"];

	const button = document.createElement("button");
	button.textContent = "Sign Up";
	button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";

	for (let i: number = 0; i < names.length; i++) {
		const text = document.createElement("h3");
		text.textContent = names[i];
		div.appendChild(text);

		const input = document.createElement("input");
		input.className = "text-white bg-transparent p-2 border-0 border-b border-white focus:outline-none focus:border-white transition";
		input.type = types[i];
		input.id = names[i];
		
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				button.click();
			}
		});

		div.appendChild(input);
	}

	const errorDiv = document.createElement("div");
	div.appendChild(errorDiv);

	clickOnButtonSignup(button, names, errorDiv);

	div.appendChild(button);

	return div;
}