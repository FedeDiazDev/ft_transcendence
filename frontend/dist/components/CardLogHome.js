export const CardLogHome = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center gap-6 p-10 bg-gray-800 shadow-xl w-64 h-100 mx-auto text-white justify-evenly";
    const loginButton = document.createElement("button");
    const signupButton = document.createElement("button");
    const googleButton = document.createElement("button");
    container.appendChild(loginButton);
    container.appendChild(signupButton);
    container.appendChild(googleButton);
    return container;
};
