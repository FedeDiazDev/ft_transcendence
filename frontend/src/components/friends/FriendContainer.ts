import { Status } from "../common/Status.js";
import { navigateTo } from "../../router.js";
import { deleteFriend } from "../../api/profile/profileAPI.js";
import { FriendList } from "./FiendsList.js";

// Function to show temporary message
function showMessage(message: string, isError: boolean = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg transition-opacity duration-500 ${
        isError ? "bg-red-500" : "bg-green-500"
    } text-white`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 3000);
}

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
    username.title = "View profile";
    username.addEventListener("click", () => {
        navigateTo(`/profile/${userId}`);
    });

    leftContainer.appendChild(avatar);
    leftContainer.appendChild(username);

    const rightContainer = document.createElement("div");
    rightContainer.className = "flex items-center gap-3";

    const scoreboard = document.createElement("button");
    scoreboard.textContent = "📊";
    scoreboard.className = "text-xl cursor-pointer hover:text-blue-400 transition";
    scoreboard.title = "Show stadistics";

    const deleteBut = document.createElement("button");
    deleteBut.textContent = "❌";
    deleteBut.className = "text-xl cursor-pointer hover:text-blue-400 transition";
    deleteBut.title = "Delete friend";

    const statusIndicator = Status(connected);
    
    scoreboard.addEventListener("click", () => {
        navigateTo(`/stats/${userId}`);
    });

    deleteBut.addEventListener("click", async () => {
        try {
            await deleteFriend(userId);
            showMessage(`${name} ha sido eliminado de tu lista de amigos`);
            
            // Find the friends list container and refresh it
            const friendsListContainer = container.closest(".w-full");
            if (friendsListContainer) {
                const newFriendsComponent = await FriendList();
                friendsListContainer.innerHTML = '';
                friendsListContainer.appendChild(newFriendsComponent);
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
            showMessage("Error al eliminar amigo", true);
        }
    });

    rightContainer.appendChild(scoreboard);
    rightContainer.appendChild(statusIndicator);
    rightContainer.appendChild(deleteBut);

    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

    return { element: container, statusDot: statusIndicator };
};
