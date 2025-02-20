import { Input } from "./Input.js";
// Nombre y demás se pasarán por parámetro, por ahora a pelo para ver
export const ProfileView = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4 p-4 border";
    const textInput = Input("text", "Pepe", "", false);
    const emailInput = Input("email", "Garcia", "", false);
    const passwordInput = Input("password", "holaaaa1234", "", false);
    container.appendChild(textInput);
    container.appendChild(emailInput);
    container.appendChild(passwordInput);
    return container;
};
