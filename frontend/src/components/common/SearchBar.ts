export const SearchBar = (onSearch: (searchText: string) => void) => {
    const container = document.createElement("div");
    container.className = "flex items-center gap-2 p-2 bg-gradient-to-r from-[#0D1013] to-[#101115] text-white rounded-lg shadow-md w-80";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Buscar...";
    input.className = "w-full p-2 bg-gray-700 text-white border-none outline-none rounded-lg";

    const button = document.createElement("button");
    button.innerHTML = "🔍";
    button.className = "p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition";

    button.addEventListener("click", () => {
        const searchText = input.value.trim();
        if (searchText !== "") {
            onSearch(searchText);
        }
    });

    container.appendChild(input);
    container.appendChild(button);
    return container;
};
