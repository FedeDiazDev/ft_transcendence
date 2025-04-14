import { navigateTo } from "../../router.js";

function formatCard(div : HTMLDivElement)
{
	div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-100 min-h-100 mx-auto text-white justify-evenly";

	const header = document.createElement("h3");
	header.className = "text-lg font-semibold text-white-400";
	header.textContent = "Introduce Verification Code";
	div.appendChild(header);

	const input = document.createElement("input");
    input.className = "text-black p-2 border rounded focus:outline-none transition";
	div.appendChild(input);

	const button = document.createElement("button");
	button.textContent = "Verify";
	button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";
	clickVerify(button, input, div);
	div.appendChild(button);
	return (div);
}

function clickVerify(button : HTMLButtonElement, input : HTMLInputElement, div : HTMLDivElement)
{
	let verifyInput = null;
	let errorText: HTMLParagraphElement;
	button.addEventListener("click", async() => {
		verifyInput = input.value;
		const flag = await fetchVerify(verifyInput)
		
		if (flag == false && errorText == null)
		{
			errorText = document.createElement("p");
			errorText.className = "text-sm text-red-400";
			errorText.textContent = "Incorrect OTP Code. Please, try again."
			div.appendChild(errorText);
		}
	})
}

async function fetchVerify(verifyInput : string)
{
	const response = await fetch ("https://transcendence.fr:8080/api/auth/verify", {
		method: "POST",
		headers: {"Content-type" : "application/json; charset=UTF-8"},
		body: JSON.stringify({ 
			verification : verifyInput,
			username : localStorage.getItem("username"),
			email : localStorage.getItem("email")
		})
	});

	const data = await response.json();
	if (data.message === "Verified OTP Code")
	{
		localStorage.setItem("authToken", data.token);
		localStorage.removeItem("QRCode");
		navigateTo("/");
		return true;
	}
	else
		return false;
}

export const TwoFALoginCard = () => {
	const div = document.createElement("div");
	
	formatCard(div);

	return div;
}
