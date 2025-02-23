import { WaitingRoom } from "../components/WaitingRoom.js";

export const Online = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-gray-900 text-white";

    const waitingRoom = WaitingRoom();
    container.appendChild(waitingRoom);

    return container;
};
