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

export const Friend = (
  avatarBlob: { data: Uint8Array },
  username: string,
  connected: boolean,
  userId: number,
  description: string
) => {
  const container = document.createElement("div");
  container.className = `
    flex items-center p-5 rounded-2xl
    bg-gradient-to-br from-[#0B0C0E] to-[#141519]
    text-gray-300 shadow-inner shadow-black w-[400px] h-[120px] mb-4
  `;

  // 📍 Columna izquierda (Avatar + login + estado)
  const leftSection = document.createElement("div");
  leftSection.className = "flex flex-col items-center justify-center w-1/3 gap-2";

  const avatarWrapper = document.createElement("div");
  avatarWrapper.className = `
    w-14 h-14 rounded-full flex items-center justify-center
    bg-gradient-to-br from-black to-gray-800 shadow-inner shadow-black
  `;

  const avatarImage = document.createElement("img");
  convertBlobToBase64(avatarBlob.data, avatarImage);
  avatarImage.alt = `${username} avatar`;
  avatarImage.className = "w-10 h-10 rounded-full";
  avatarWrapper.appendChild(avatarImage);

  const usernameLine = document.createElement("div");
  usernameLine.className = "flex items-center gap-2";

  const login = document.createElement("p");
  login.textContent = username;
  login.className = "text-white text-sm font-medium cursor-pointer hover:text-blue-400";
  login.title = "Ver perfil";
  container.addEventListener("click", () => {
    navigateTo(`/profile/${userId}`);
  });

  const statusDot = Status(connected);
  statusDot.classList.add("w-3", "h-3");

  usernameLine.appendChild(login);
  usernameLine.appendChild(statusDot);

  leftSection.appendChild(avatarWrapper);
  leftSection.appendChild(usernameLine);

  // 📝 Columna derecha (nombre completo y posible descripción)
  const rightSection = document.createElement("div");
  rightSection.className = "flex flex-row items-center justify-between w-2/3 pl-4";

  const descriptionEl = document.createElement("p");
  descriptionEl.textContent = description;
  descriptionEl.className = "text-gray-400 text-sm italic";

  rightSection.appendChild(descriptionEl);

  // Botón de eliminar
  const deleteBut = document.createElement("button");
  deleteBut.textContent = "❌";
  deleteBut.className = "text-xl cursor-pointer hover:text-red-400 transition self-end";
  deleteBut.title = "Eliminar amigo";

  deleteBut.addEventListener("click", async () => {
    try {
      await deleteFriend(userId);
      showMessage(`${username} ha sido eliminado de tu lista de amigos`);

      const friendsListContainer = container.closest(".w-full");
      if (friendsListContainer) {
        const newFriendsComponent = await FriendList();
        friendsListContainer.innerHTML = "";
        friendsListContainer.appendChild(newFriendsComponent);
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
      showMessage("Error al eliminar amigo", true);
    }
  });

  rightSection.appendChild(deleteBut);

  // Ensamblar todo
  container.appendChild(leftSection);
  container.appendChild(rightSection);

  return { element: container, statusDot: statusDot };
};
