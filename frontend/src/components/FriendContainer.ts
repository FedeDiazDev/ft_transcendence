import { Status } from "./Status.js";

export const Friend = (avatarUrl: string, name: string, connected: boolean) => {
    const container = document.createElement("div");
    container.className = "flex items-center gap-4 p-4 bg-gray-800 text-white rounded-lg shadow-md w-80";

    const avatar = document.createElement("img");
    avatar.src = avatarUrl;
    avatar.alt = `${name} avatar`;
    avatar.className = "w-10 h-10 rounded-full";

    const username = document.createElement("p");
    username.textContent = name;
    username.className = "text-lg font-semibold";

    const scoreboard = document.createElement("span");
    scoreboard.textContent = "📊";
    scoreboard.className = "text-xl";

    // Estado de conexión
    const statusIndicator = Status(connected);

    // Agregar elementos al contenedor
    container.appendChild(avatar);
    container.appendChild(username);
    container.appendChild(scoreboard);
    container.appendChild(statusIndicator);

    return container;
};
