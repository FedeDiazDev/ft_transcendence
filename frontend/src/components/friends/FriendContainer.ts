import { Status } from "../common/Status.js";
import { navigateTo } from "../../router.js";
import { deleteFriend } from "../../api/profile/profileAPI.js";
import { FriendList } from "./FiendsList.js";
import { convertBlobToBase64 } from "../common/ProfileCard.js";

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

export const Friend = (avatarBlob: { data: Uint8Array }, name: string, connected: boolean, userId: number) => {
    const container = document.createElement("div");
    container.className = "flex justify-between items-center p-4 bg-gradient-to-r from-[#0D1013] to-[#101115] text-white rounded-lg shadow-md w-80";

    const leftContainer = document.createElement("div");
    leftContainer.className = "flex items-center gap-3";

    const avatarImage = document.createElement("img");
    convertBlobToBase64(avatarBlob.data, avatarImage);
    avatarImage.alt = `${name} avatar`;
    avatarImage.className = "w-10 h-10 rounded-full";

    const username = document.createElement("p");
    username.textContent = name;
    username.className = "text-lg font-semibold cursor-pointer hover:text-blue-400 transition";
    username.title = "View profile";
    username.addEventListener("click", () => {
        navigateTo(`/profile/${userId}`);
    });

    leftContainer.appendChild(avatarImage);
    leftContainer.appendChild(username);

    const rightContainer = document.createElement("div");
    rightContainer.className = "flex items-center gap-3";

    const deleteBut = document.createElement("button");
    deleteBut.textContent = "❌";
    deleteBut.className = "text-xl cursor-pointer hover:text-blue-400 transition";
    deleteBut.title = "Delete friend";

    const statusIndicator = Status(connected);
    
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

    leftContainer.appendChild(statusIndicator);
    rightContainer.appendChild(deleteBut);

    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

    return { element: container, statusDot: statusIndicator };
};
