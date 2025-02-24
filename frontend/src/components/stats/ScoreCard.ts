import { MatchCard } from "./MatchCard.js";

export const ScoreCard = () => {
	const container = document.createElement("div");
	container.className = "rounded-lg shadow-lg border flex flex-col gap-6 p-4 text-2xl mt-10";
	const title = document.createElement("p");
	title.className = "text-center";
	title.innerHTML = "Historial";
	container.appendChild(title);
	const games = [
		{ local: "Juan", local_score: 7, visitor: "Pepe", visitor_score: 2, date: "12-02-2024" },
		{ local: "Pepe", local_score: 3, visitor: "Juan", visitor_score: 1, date: "12-02-2024" },
		{ local: "Juan", local_score: 7, visitor: "Pepe", visitor_score: 2, date: "12-02-2024" },
	];

	games.forEach(({ local, local_score, visitor, visitor_score, date }) => {
		container.appendChild(MatchCard(local, local_score, visitor, visitor_score, date));
	});
	return container;
}