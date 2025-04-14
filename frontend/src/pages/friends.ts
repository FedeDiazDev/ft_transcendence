import { FriendList } from "../components/friends/FiendsList.js";
import { SearchBar } from "../components/common/SearchBar.js"

export const Friend = async () => {
  const div = document.createElement("div");
  div.className = "flex flex-col gap-6 items-center w-full";
  div.innerHTML = `<p class="text-center font-bold text-2xl">Mis amigos</p>`
  div.appendChild(SearchBar());
  const friendsComponent = await FriendList();
  div.appendChild(friendsComponent);

  return div;
};
