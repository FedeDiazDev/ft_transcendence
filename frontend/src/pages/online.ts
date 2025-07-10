import { WaitingRoom } from "../components/common/WaitingRoom.js";

export const Online = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen text-white";

    const waitingRoom = WaitingRoom();
    container.appendChild(waitingRoom);

    return container;
};
