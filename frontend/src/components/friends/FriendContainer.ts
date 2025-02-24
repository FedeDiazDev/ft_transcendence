import { Status } from "../common/Status.js";
import { navigateTo } from "../../router.js";
export const Friend = (avatarUrl: string, name: string, connected: boolean, userId: number) => {
    const container = document.createElement("div");
    container.className = "flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg shadow-md w-80";
    
    const leftContainer = document.createElement("div");
    leftContainer.className = "flex items-center gap-3";

    const avatar = document.createElement("img");
    avatar.src = avatarUrl;
    avatar.alt = `${name} avatar`;
    avatar.className = "w-10 h-10 rounded-full";

    const username = document.createElement("p");
    username.textContent = name;
    username.className = "text-lg font-semibold cursor-pointer hover:text-blue-400 transition";
    username.title = "Ver perfil"; 
    username.addEventListener("click", () => {
        navigateTo(`/profile/${userId}`);
    });

    leftContainer.appendChild(avatar);
    leftContainer.appendChild(username);
    
    const rightContainer = document.createElement("div");
    rightContainer.className = "flex items-center gap-3";

    const scoreboard = document.createElement("span");
    scoreboard.textContent = "📊";
    scoreboard.className = "text-xl cursor-pointer hover:text-blue-400 transition";
    scoreboard.title = "Ver estadísticas";
    
    scoreboard.addEventListener("click", () => {
        navigateTo(`/stats/${userId}`);
    });
;

    const statusIndicator = Status(connected);

    rightContainer.appendChild(scoreboard);
    rightContainer.appendChild(statusIndicator);
    
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

    return container;
};
