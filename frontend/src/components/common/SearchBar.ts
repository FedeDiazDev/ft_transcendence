export const SearchBar = (onSearch: (searchText: string) => void) => {
	const container = document.createElement("div");
	container.className =
		"flex items-center gap-2 p-2 bg-base-black2 text-white rounded-lg shadow-md w-80";

	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = "Buscar...";
	input.className =
		"w-full px-3 py-2 bg-gradient-to-r from-[#0D1013] to-[#101115] text-white border-b border-white70 placeholder-white70 focus:outline-none focus:border-white transition";

	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const searchText = input.value.trim();
			if (searchText !== "") {
				onSearch(searchText);
			}
		}
	});

	const button = document.createElement("button");
	button.innerHTML = "🔍";
	button.className =
		"px-3 py-2 bg-base-black3 text-white rounded-md border border-white70 hover:border-white transition";

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
