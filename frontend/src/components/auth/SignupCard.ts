function handleResponse(data : { code?: string}, errorDiv : HTMLDivElement){
	if (data.code === "SQLITE_CONSTRAINT_UNIQUE"){
		errorDiv.className = "text-sm mt-2 h-6 color-red"
		errorDiv.textContent = "error";
	}
}

function clickOnButton(button : HTMLButtonElement, names : string[], errorDiv : HTMLDivElement){
	button.addEventListener("click", async () => {
	const inputs: string[] = [];
	for (let i: number = 0; i < names.length; i++) {
		const inputElement = document.getElementById(names[i]);
			if (inputElement instanceof HTMLInputElement)
				inputs[i] = inputElement.value;
			else
				inputs[i] = '';
		}
		const sendData = {
			"username" : inputs[0],
			"email" : inputs[1],
			"password" : inputs[2],
			"confirmPassword" : inputs[3]
		}
		fetchSignup(sendData, errorDiv);
	});
}

async function fetchSignup(sendData : { username? : string, email? : string, password? : string, confirmPassword? : string}, errorDiv : HTMLDivElement){
	try{
		const response = await fetch ("http://localhost:3000/signup", {
			method: "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(sendData),
		})
		const data = await response.json(); 
		handleResponse(data, errorDiv);
	} catch(error){
		console.error("Fetch error:", error);
	}
}

export const SignupCard = () => {
	const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-64 min-h-80 mx-auto text-white justify-evenly";

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

	const sendData = clickOnButton(button, names, errorDiv);

    div.appendChild(button);

    return div;
}
