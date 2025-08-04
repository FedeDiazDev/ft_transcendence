import { FriendList } from "../components/friends/FiendsList.js";
import { SearchBar } from "../components/common/SearchBar.js";
import { getUserByName } from "../api/friends/friendsAPI.js";
import { UserI } from "../types/types.js";
import { addFriend } from "../api/profile/profileAPI.js";

function showMessage(container: HTMLElement, message: string, isError: boolean = false) {
    const successMsg = document.createElement("div");
    successMsg.className = `fixed top-4 right-4 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500`;
    successMsg.textContent = message;
    container.appendChild(successMsg);

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

    const friendsListContainer = document.createElement("div");
    friendsListContainer.className = "w-full";

    const refreshFriendsList = async () => {
        const newFriendsComponent = await FriendList();
        friendsListContainer.innerHTML = '';
        friendsListContainer.appendChild(newFriendsComponent);
    };

    const friendsComponent = await FriendList();
    friendsListContainer.appendChild(friendsComponent);

    const searchBar = SearchBar(async (text: string) => {
        const result = await getUserByName(text);
        resultsContainer.innerHTML = "";

        if (!result || result.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No users found.";
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
            addButton.title = "Add friend";
            addButton.className = "p-2";
            addButton.addEventListener("click", async () => {
                try {
                    const response = await addFriend(user.id);
                    
                    if (response.error) {
                        showMessage(document.body, response.error, true);
                        return;
                    }
                    
                    showMessage(document.body, `${user.username} has been added as a friend!`);
                    await refreshFriendsList();
                } catch (error) {
                    console.error("Error adding friend:", error);
                    showMessage(document.body, "Error adding friend", true);
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
