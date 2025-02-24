import { CardGame } from "../components/stats/CardGame.js";
import { ScoreCard } from "../components/stats/ScoreCard.js";

export const StatsView = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4"
  
    const statsContainer = document.createElement("div");
    const winMatchContainer = document.createElement("div");
    const looseMatchContainer = document.createElement("div");
    statsContainer.className = "flex flex-row gap-12 justify-center mt-16";
    container.appendChild(statsContainer);
    statsContainer.appendChild(winMatchContainer);
    statsContainer.appendChild(looseMatchContainer);
    winMatchContainer.appendChild(CardGame("12 Victorias", "text-green-600"));
    looseMatchContainer.appendChild(CardGame("2 Derrotas", "text-red-600"));
    container.appendChild(ScoreCard());

    return container;
};