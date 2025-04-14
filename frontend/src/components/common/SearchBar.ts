import { getUserByName } from "../../api/friends/friendsAPI.js";
import { UserI } from "../../types/types.js";

export const SearchBar = () => {
    const container = document.createElement("div");
    container.className = "flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg shadow-md w-80";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Buscar...";
    input.className = "w-full p-2 bg-gray-700 text-white border-none outline-none rounded-lg";

    const button = document.createElement("button");
    button.innerHTML = "🔍";
    button.className = "p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition";
    button.addEventListener("click", async () => {
        const searchText = input.value.trim();
        if (searchText === "") return;

        const result = await getUserByName(searchText);
        console.log("Usuarios encontrados:", result);

        const previousResults = container.querySelector(".search-results");
        if (previousResults) previousResults.remove();

        const resultsContainer = document.createElement("div");
        resultsContainer.className = "search-results mt-2 w-full bg-gray-700 rounded-lg p-2";

        if (!result || result.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No se encontraron usuarios.";
            noResults.className = "text-gray-300";
            resultsContainer.appendChild(noResults);
        } else {
            (result as UserI[]).forEach((user: UserI) => {
                const userRow = document.createElement("div");
                userRow.className = "flex items-center justify-between p-1 hover:bg-gray-600 rounded";

                const userEl = document.createElement("span");
                userEl.textContent = `👤 ${user.username}`;
                userEl.className = "text-white";

                const addButton = document.createElement("button");
                addButton.textContent = "➕";
                addButton.title = "Agregar como amigo";
                addButton.className = "text-green-400 hover:text-green-300 transition";
                
                addButton.addEventListener("click", () => {
                    console.log(`Agregar a ${user.username} (id: ${user.id})`);
                    //TODO: enviar solicitud amistad
                });

                userRow.appendChild(userEl);
                userRow.appendChild(addButton);
                resultsContainer.appendChild(userRow);
            });
        }

        container.appendChild(resultsContainer);
    });

    container.appendChild(input);
    container.appendChild(button);

    return container;
};
