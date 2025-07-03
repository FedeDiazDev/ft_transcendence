import { navigateTo } from "../../router.js";

declare const google: any;

async function googleCallback(response : any)
{
	console.log("Response: ", response);
	try{
		const newResponse = await fetch ("https://" + window.location.hostname + ":8080/api/auth/google-register", {
			method : "POST",
			headers: {"Content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify({ "credentials" : response})
		});
		const data = await newResponse.json();

		localStorage.setItem("username", data.username);
		localStorage.setItem("email", data.email);
		localStorage.setItem("authToken", data.token.accessToken);

		navigateTo("/");
	}
	catch(error){
		console.error("Fetch error: ", error);
	}
}

async function loadGoogleScript() {
  if (document.getElementById('gsi-client')) {
    return;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'gsi-client';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const LogHomeCard = async (): Promise<HTMLElement> => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gradient-to-r from-[#0D1013] to-[#101115] shadow-xl rounded-lg w-64 min-h-80 mx-auto text-white justify-evenly";

    const token = localStorage.getItem("authToken");

    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700";
    loginButton.addEventListener("click", () => {
        navigateTo("/login");
    });
    
    const signupButton = document.createElement("button");
    signupButton.textContent = "Sign Up";
    signupButton.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700";
    signupButton.addEventListener("click", () => {
        navigateTo("/signup");
    });
 
    div.appendChild(loginButton);
    div.appendChild(signupButton);

    await loadGoogleScript();
    google.accounts.id.initialize({
      client_id: '169232875521-gqilrfir7hpghaadf7rlj8dmg94fmvp4.apps.googleusercontent.com',
      callback: googleCallback
    });

    const googleDiv = document.createElement("div");

    google.accounts.id.renderButton(googleDiv, {
      theme: "outline",
      size: "large",
    });
    div.appendChild(googleDiv);

    return div;
}
