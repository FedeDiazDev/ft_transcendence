import { LogHomeCard } from "../components/auth/LogHomeCard.js"

export const LogHome = async () => {
    const div = document.createElement("div");
    div.className="flex flex-col items-center justify-center";

    const logo = document.createElement("a");
    logo.href = "/";
    logo.textContent = "🏓 Pong";
    logo.className = "text-4xl font-bold mb-3";

	const card = await LogHomeCard();

    div.appendChild(logo);
	div.appendChild(card);
    return div;
};
