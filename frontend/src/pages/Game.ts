import { GameCanvas } from "../components/Canvas.js"; 

export const Game = () => {
    const container = document.createElement("div");
    container.className = "flex justify-center items-center h-screen bg-black mt-10";
    const canvas = GameCanvas();
    container.appendChild(canvas);
    return container;
};
