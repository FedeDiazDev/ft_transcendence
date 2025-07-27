import { FriendList } from "../components/friends/FiendsList.js";
import { SearchBar } from "../components/common/SearchBar.js";
import { getUserByName } from "../api/friends/friendsAPI.js";
import { UserI } from "../types/types.js";
import { addFriend } from "../api/profile/profileAPI.js";

// Function to show temporary success message
function showMessage(container: HTMLElement, message: string, isError: boolean = false) {
    const successMsg = document.createElement("div");
    successMsg.className = `fixed top-4 right-4 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500`;
    successMsg.textContent = message;
    container.appendChild(successMsg);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
        successMsg.style.opacity = "0";
        setTimeout(() => {
            container.removeChild(successMsg);
        }, 500);
    }, 3000);
}

export const Friend = async () => {
    const div = document.createElement("div");
    div.innerHTML = "";
    div.className = "flex flex-col gap-6 items-center w-full";
    div.innerHTML = `<h2 class="text-center font-bold text-2xl text-white">Mis amigos</h2>`;

    const resultsContainer = document.createElement("div");
    resultsContainer.className = "w-full";

    // Create a container specifically for the friends list
    const friendsListContainer = document.createElement("div");
    friendsListContainer.className = "w-full";

    // Function to refresh the friends list
    const refreshFriendsList = async () => {
        const newFriendsComponent = await FriendList();
        // Clear and update the friends list container
        friendsListContainer.innerHTML = '';
        friendsListContainer.appendChild(newFriendsComponent);
    };

    // Initial load of friends list
    const friendsComponent = await FriendList();
    friendsListContainer.appendChild(friendsComponent);

    const searchBar = SearchBar(async (text: string) => {
        const result = await getUserByName(text);
        resultsContainer.innerHTML = "";

        if (!result || result.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No se encontraron usuarios.";
            noResults.className = "text-white";
            resultsContainer.appendChild(noResults);
            return;
        }

        (result as UserI[]).forEach((user: UserI) => {
            const userRow = document.createElement("div");
            userRow.className = "flex items-center justify-between p-4 hover:bg-gray-600 hover:text-white rounded";

            const userEl = document.createElement("span");
            userEl.className = "text-white p-2";
            userEl.textContent = `👤   ${user.username}`;

            const addButton = document.createElement("button");
            addButton.textContent = "➕";
            addButton.title = "Agregar como amigo";
            addButton.className = "p-2";
            addButton.addEventListener("click", async () => {
                try {
                    console.log(`Agregar a ${user.username} (id: ${user.id})`);
                    const response = await addFriend(user.id);
                    
                    if (response.error) {
                        // Show error message if friend already exists
                        showMessage(document.body, response.error, true);
                        return;
                    }
                    
                    showMessage(document.body, `¡${user.username} ha sido agregado como amigo!`);
                    // Refresh the friends list
                    await refreshFriendsList();
                } catch (error) {
                    console.error("Error adding friend:", error);
                    showMessage(document.body, "Error al agregar amigo", true);
                }
            });
            userRow.appendChild(userEl);
            userRow.appendChild(addButton);
            resultsContainer.appendChild(userRow);
        });
    });

    div.appendChild(searchBar);
    div.appendChild(resultsContainer);
    div.appendChild(friendsListContainer);

    return div;
};
