import { navigateTo } from "../router.js";

export const LogHomeCard = () => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-64 min-h-80 mx-auto text-white justify-evenly";

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

    const googleButton = document.createElement("button");
    googleButton.textContent = "Sign In with Google";
    googleButton.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700";

    div.appendChild(loginButton);
    div.appendChild(signupButton);
    div.appendChild(googleButton);
    return div;
}