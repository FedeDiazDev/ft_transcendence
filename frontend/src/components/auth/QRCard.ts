function formatCorrectCard(div : HTMLDivElement, qr : HTMLImageElement, qrImg : string)
{
	div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-100 min-h-100 mx-auto text-white justify-evenly";

	const header = document.createElement("h3");
	header.className = "text-lg font-semibold text-white-400";
	header.textContent = "Scan QR Code with Google Authenticator";
	div.appendChild(header);

	qr.src = qrImg;
	qr.alt = "QR Code";
	qr.className = "w-full h-auto";
	div.appendChild(qr);

	const info = document.createElement("h3");
	info.className = "text-lg font-semibold text-white-400";
	info.textContent = "Introduce Verification Code";
	div.appendChild(info);

	const input = document.createElement("input");
    input.className = "text-black p-2 border rounded focus:outline-none transition";
	div.appendChild(input);

	const button = document.createElement("button");
	button.textContent = "Verify";
	button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";
	clickVerify(button, input);
	div.appendChild(button);
	return (div);
}

function clickVerify(button : HTMLButtonElement, input : HTMLInputElement)
{
	let verifyInput = null;
	button.addEventListener("click", async() => {
		verifyInput = input.value;
		fetchVerify(verifyInput);
	})
}

async function fetchVerify(verifyInput : string)
{
	const response = await fetch ("http://localhost:3000/verify", {
		method: "POST",
		headers: {"Content-type" : "application/json; charset=UTF-8"},
		body: JSON.stringify({ 
			verification : verifyInput,
			username : localStorage.getItem("username")
		})
	});

	localStorage.removeItem("username")

	const data = await response.json();
	if (data.message === "Verified OTP Code")
		console.log("Correct Verification!");
	else
		console.log("Incorrect Verification");
}

function formatIncorrectCard(div : HTMLDivElement)
{
	div.className = "flex flex-col items-center justify-center gap-4 p-6 bg-gray-800 shadow-xl rounded-lg w-80 h-40 mx-auto text-white text-center";

	const sorry = document.createElement("div");
	const text = document.createElement("h3");
	text.className = "text-lg font-semibold text-red-400";
	text.textContent = "Cannot generate QR. Try to Log In again.";
	sorry.appendChild(text);
	div.appendChild(sorry);
}

export const QRCard = () => {
	const div = document.createElement("div");
	const qr = document.createElement("img");
	const qrImg = localStorage.getItem("QRCode");
	localStorage.removeItem("QRCode");
	if (qrImg)
		formatCorrectCard(div, qr, qrImg);
	else
		formatIncorrectCard(div);
	return div;
}
