export const SignupCard = () => {
	const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-80 min-h-80 mx-auto text-white justify-evenly";

    const names = ["Username", "Email", "Password", "Confirm password"];
	createInputs(names, div);

    const errorDiv = document.createElement("div");
	div.appendChild(errorDiv);

    const button = document.createElement("button");
    button.textContent = "Sign Up";
    button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";

	clickOnButtonSignup(button, names, errorDiv);

    div.appendChild(button);

    return div;
}

function createInputs(names : string[], div : HTMLDivElement){
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
}

function clickOnButtonSignup(button : HTMLButtonElement, names : string[], errorDiv : HTMLDivElement){
	button.addEventListener("click", async () => {
		errorDiv.innerHTML = '';

		const inputs = getInputs(names);
		const requestData = createRequestJSON(inputs);

		let frontErrors: string[] = parseFront(requestData);
		printErrors(frontErrors, errorDiv);

		if (frontErrors.length === 0){
			const responseData = await fetchSignup(requestData, errorDiv);
			handleResponse(responseData, errorDiv, requestData.username);
		}
	});
}

function getInputs(names : string[]){
	const inputs : string[] = [];

	for (let i: number = 0; i < names.length; i++) {
		const inputElement = document.getElementById(names[i]);
		if (inputElement instanceof HTMLInputElement)
			inputs[i] = inputElement.value;
	}
	return inputs;
}

function createRequestJSON(inputs : string[]){
	const requestData = {
		"username" : inputs[0].trim(),
		"email" : inputs[1].trim(),
		"password" : inputs[2],
		"confirmPassword" : inputs[3]
	}
	return requestData;
}

function parseFront(requestData : { username? : string, email? : string, password? : string, confirmPassword? : string}){

	let errors: string[] = [];

	if (!requestData.username || !requestData.email || !requestData.password || !requestData.confirmPassword) {
        errors.push("*All fields must be filled");
        return errors;
    }

	if (requestData.username && !/^[a-zA-Z0-9]+$/.test(requestData.username))
		errors.push("*Incorrect username format");
	if (requestData.password && requestData.password !== requestData.confirmPassword)
		errors.push("*Confirm Password does not match");
	if (requestData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]{8,}$/.test(requestData.password))
		errors.push("*Incorrect password format");
	if (requestData.email && !/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(requestData.email))
		errors.push("*Incorrect email format");
	return errors;
}

function printErrors(frontErrors : string[], errorDiv : HTMLDivElement){
	for (let i = 0; i < frontErrors.length; i++){
		const newDiv = document.createElement("div");
		newDiv.className = "text-sm mt-2 h-6 text-red-400";
		newDiv.textContent = frontErrors[i];
		errorDiv.appendChild(newDiv);
	}
}

async function fetchSignup(requestData : { username : string, email : string, password : string, confirmPassword : string}, errorDiv : HTMLDivElement){
	try{
		const response = await fetch ("http://localhost:3000/signup", {
			method: "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(requestData),
		})
		const responseData = await response.json(); 
		return responseData;
	} catch(error){
		console.error("Fetch error:", error);
	}
}

function handleResponse(responseData : { statusCode?: number}, errorDiv : HTMLDivElement, username : string){
	if (responseData.statusCode === 200)
		registerInUserDatabase(username);

	else if (responseData.statusCode === 500){
		errorDiv.className = "text-sm mt-2 h-6 text-red-400"
		errorDiv.textContent = "*User or email already exists";
	}
}

async function registerInUserDatabase(username : string){
	try{
		const response = await fetch ("http://localhost:4000/register", {
			method: "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify({ "username" : username })
		});
		const data = await response.json(); 
	} catch(error){
		console.error("Fetch error:", error);
	}
}
