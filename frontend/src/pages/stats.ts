import { CardGame } from "../components/CardGame.js";

export const StatsView = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4"
    const matchContainer = document.createElement("div");
    container.className = "flex flex-row gap-8";
    container.appendChild(matchContainer);
    matchContainer.appendChild(CardGame("Victorias", "text-green"));
    matchContainer.appendChild(CardGame("Derrotas", "text-red"));

};