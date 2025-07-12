import { Card } from "../components/common/Card.js";

export const Home = () => {
  const div = document.createElement("div");
  div.className = "flex justify-center gap-12 p-10";

  const cards = [
    { title: "🎮", description: "Play tournament", path: '/tournament' },
    { title: "🔥", description: "Play game", path: '/local_game' },
    { title: "🚀", description: "Play online game", path: '/online_game' },
  ];

  cards.forEach(({ title, description, path }) => {
    div.appendChild(Card(title, description, path));
  });

  return div;
};
