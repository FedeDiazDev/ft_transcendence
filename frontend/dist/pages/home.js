import { Card } from "../components/Card.js";
export const Home = () => {
    const div = document.createElement("div");
    div.className = "flex justify-center gap-12 p-10";
    const cards = [
        { title: "🔥", description: "Local", path: '/local_game' },
        { title: "🚀", description: "Online", path: '/online_game' },
        { title: "🎮", description: "Torneo", path: '/tournament' },
    ];
    cards.forEach(({ title, description, path }) => {
        div.appendChild(Card(title, description, path));
    });
    return div;
};
