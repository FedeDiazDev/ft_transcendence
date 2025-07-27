import { Card } from "../components/common/Card.js";

export const Tournament = () => {
	const container = document.createElement("div");
	container.className = "flex flex-row items-center justify-evenly h-screen text-white";

	const createSection = Card("🏆", "Create Tournament", "/tournament/create");
	const JoinSection = Card("🔗", "Find Tournament", "/tournament/join");
	container.appendChild(createSection);
	container.appendChild(JoinSection);
	return container;
};
