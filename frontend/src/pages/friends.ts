import { FriendList } from "../components/FiendsList.js";
export const Friend = () => {
    const div = document.createElement("div");
    div.appendChild(FriendList());
    return div;
  };
  