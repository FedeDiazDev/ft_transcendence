import { navigateTo } from "../../router.js";

async function registerInUserDatabase(username : string){
	try{
		const response = await fetch ("http://localhost:4000/register", {
			method: "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify({ "username" : username })
		});
		const data = await response.json(); 
		console.log(data)
	} catch(error){
		console.error("Fetch error:", error);
	}
}

function handleResponse(data : { code?: string}, errorDiv : HTMLDivElement, username : string){
	if (data.code === "SQLITE_CONSTRAINT_UNIQUE"){
		errorDiv.className = "text-sm mt-2 h-6 text-red-400"
		errorDiv.textContent = "*User or email already exists";
	}
	else
		registerInUserDatabase(username);
} //This error is the only one that can throw the server if everything is fine in the front parse

function parseFront(sendData : { username? : string, email? : string, password? : string, confirmPassword? : string}){

	let errors: string[] = [];

	if (!sendData.username || !sendData.email || !sendData.password || !sendData.confirmPassword) {
        errors.push("*All fields must be filled");
        return errors;
    }
	if (sendData.username && !/^[a-zA-Z0-9]+$/.test(sendData.username))
		errors.push("*Incorrect username format");
	if (sendData.password && sendData.password !== sendData.confirmPassword)
		errors.push("*Confirm Password does not match");
	if (sendData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]{8,}$/.test(sendData.password))
		errors.push("*Incorrect password format");
	if (sendData.email && !/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(sendData.email))
		errors.push("*Incorrect email format");
	return errors;
}

function showErrors(frontErrors : string[], errorDiv : HTMLDivElement){
	for (let i = 0; i < frontErrors.length; i++){
		const newDiv = document.createElement("div");
		newDiv.className = "text-sm mt-2 h-6 text-red-400";
		newDiv.textContent = frontErrors[i];
		errorDiv.appendChild(newDiv);
	}
}

function clickOnButtonSignup(button : HTMLButtonElement, names : string[], errorDiv : HTMLDivElement){
	button.addEventListener("click", async () => {
	errorDiv.innerHTML = '';
	const inputs: string[] = [];
	for (let i: number = 0; i < names.length; i++) {
		const inputElement = document.getElementById(names[i]);
			if (inputElement instanceof HTMLInputElement)
				inputs[i] = inputElement.value;
		}
		const sendData = {
			"username" : inputs[0].trim(),
			"email" : inputs[1].trim(),
			"password" : inputs[2],
			"confirmPassword" : inputs[3]
		}

		localStorage.setItem("username", inputs[0].trim());
		localStorage.setItem("email", inputs[1].trim());

		let frontErrors: string[] = parseFront(sendData);

		showErrors(frontErrors, errorDiv);

		if (frontErrors.length === 0){
			fetchSignup(sendData, errorDiv);
		}
	});
}

async function fetchSignup(sendData : { username : string, email : string, password : string, confirmPassword : string}, errorDiv : HTMLDivElement){
	try{
		const response = await fetch ("http://localhost:3000/signup", {
			method: "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(sendData),
		})
		const data = await response.json(); 
		localStorage.setItem("QRCode", data.QR);
		handleResponse(data, errorDiv, sendData.username);
		navigateTo("/qrcode");
		//const token = data.token;
		//localStorage.setItem("authToken", token);
	} catch(error){
		console.error("Fetch error:", error);
	}
}

export const SignupCard = () => {
	const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-80 min-h-80 mx-auto text-white justify-evenly";

    const names = ["Username", "Email", "Password", "Confirm password"];
	const types = ["text", "email", "password", "password"];

    for (let i:number = 0; i < names.length; i++){
        const text = document.createElement("h3");
        text.textContent = names[i];
        div.appendChild(text);

        const input = document.createElement("input");
        input.className = "text-black p-2 border rounded focus:outline-none transition";
		input.type = types[i];
		input.id = names[i];
        div.appendChild(input);
    }

    const errorDiv = document.createElement("div");
	div.appendChild(errorDiv);

    const button = document.createElement("button");
    button.textContent = "Sign Up";
    button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";

	clickOnButtonSignup(button, names, errorDiv);

    div.appendChild(button);

    return div;
}
