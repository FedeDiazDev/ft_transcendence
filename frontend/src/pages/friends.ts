import { FriendList } from "../components/friends/FiendsList.js";
import { SearchBar } from "../components/common/SearchBar.js";
import { getUserByName } from "../api/friends/friendsAPI.js";
import { UserI } from "../types/types.js";
import { addFriend } from "../api/profile/profileAPI.js";

export const Friend = async () => {
    const div = document.createElement("div");
    div.className = "flex flex-col gap-6 items-center w-full";
    div.innerHTML = `<p class="text-center font-bold text-2xl">Mis amigos</p>`;

    const resultsContainer = document.createElement("div");
    resultsContainer.className = "w-full";

    const friendsWrapper = document.createElement("div");
    let friendsComponent = await FriendList();
    friendsWrapper.appendChild(friendsComponent);

    const searchBar = SearchBar(async (text: string) => {
        const result = await getUserByName(text);
        resultsContainer.innerHTML = "";

        if (!result || result.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No se encontraron usuarios.";
            noResults.className = "text-gray-300";
            resultsContainer.appendChild(noResults);
            return;
        }

        (result as UserI[]).forEach((user: UserI) => {
            const userRow = document.createElement("div");
            userRow.className = "flex items-center justify-between p-1 hover:bg-gray-600 hover:text-white rounded";

            const userEl = document.createElement("span");
            userEl.textContent = `👤 ${user.username}`;

            const addButton = document.createElement("button");
            addButton.textContent = "➕";
            addButton.title = "Agregar como amigo";
            addButton.className = "text-green-400 hover:text-green-300 transition";
            addButton.addEventListener("click", async () => {
                console.log(`Agregar a ${user.username} (id: ${user.id})`);
                await addFriend(user.id);
                const updated = await FriendList();
                friendsWrapper.innerHTML = "";
                friendsWrapper.appendChild(updated);

            });

            userRow.appendChild(userEl);
            userRow.appendChild(addButton);
            resultsContainer.appendChild(userRow);
        });
    });

    div.appendChild(searchBar);
    div.appendChild(resultsContainer);
    div.appendChild(friendsWrapper);

    return div;
};
