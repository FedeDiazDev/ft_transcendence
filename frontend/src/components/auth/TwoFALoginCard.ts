import { fetchUserData } from "../../hooks/fetchUserData.js";
import { navigateTo } from "../../router.js";
import { statusSocket } from "../../sockets/statusSocket.js";

function formatCard(div : HTMLDivElement)
{
	div.className = "flex flex-col items-center gap-2 p-6 bg-gradient-to-r from-[#0D1013] to-[#101115] shadow-xl rounded-lg w-100 min-h-100 mx-auto text-white justify-evenly";

	const header = document.createElement("h3");
	header.className = "text-lg font-semibold text-white-400";
	header.textContent = "Input Verification Code";
	div.appendChild(header);

	const input = document.createElement("input");
    input.className = "text-white bg-transparent p-2 border-0 border-b border-white focus:outline-none focus:border-white transition";
	div.appendChild(input);

	const button = document.createElement("button");
	button.textContent = "Verify";
	button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";
	clickVerify(button, input, div);
	
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			button.click();
		}
	});
	
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
	const response = await fetch ("https://" + window.location.hostname + ":8080/api/auth/login2fa", {
		method: "POST",
		headers: {"Content-type" : "application/json; charset=UTF-8"},
		body: JSON.stringify({ 
			verification : verifyInput,
			username : localStorage.getItem("username"),
			email : localStorage.getItem("email")
		})
	});

	const data = await response.json();
	console.log("Verification response:", data);
	if (data.message === "Verified OTP Code")
	{
		localStorage.setItem("authToken", data.token);
		fetchUserData((user) => {
			statusSocket(user.id, user.name, "login");
		});
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
