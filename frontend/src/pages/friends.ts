import { FriendList } from "../components/FiendsList.js";
import { SearchBar } from "../components/SearchBar.js"

export const Friend = () => {
    const div = document.createElement("div");
    div.className = "flex flex-col gap-6 items-center w-full";
    div.innerHTML = `<p class="text-center font-bold text-2xl">Mis amigos</p>`
    div.appendChild(SearchBar());
    div.appendChild(FriendList());
    return div;
  };
  