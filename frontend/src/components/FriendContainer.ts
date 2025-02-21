import { Status } from "./Status.js";

export const Friend = (avatarUrl: string, name: string, connected: boolean) => {
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
    username.className = "text-lg font-semibold";

    leftContainer.appendChild(avatar);
    leftContainer.appendChild(username);
    
    const rightContainer = document.createElement("div");
    rightContainer.className = "flex items-center gap-3";

    const scoreboard = document.createElement("span");
    scoreboard.textContent = "📊";
    scoreboard.className = "text-xl";

    const statusIndicator = Status(connected);

    rightContainer.appendChild(scoreboard);
    rightContainer.appendChild(statusIndicator);
    
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

    return container;
};
