import { getAllPlayers, getAllGames } from "../api/stats/statsAPI.js";
import type { PlayerStats, GameStats } from "../types/types.ts";


export const Stats = async () => {
  try {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-6 items-center w-full p-4";

    const title = document.createElement("h2");
    title.textContent = "📊 Estadísticas Generales";
    title.className = "text-2xl font-bold text-center";
    container.appendChild(title);

    const players = await getAllPlayers();
    if (!players || players.length === 0) {
      container.appendChild(document.createTextNode("No player stats found."));
      return container;
    }

    const leaderboard = document.createElement("div");
    leaderboard.className = "w-full max-w-2xl";

    const heading = document.createElement("h3");
    heading.textContent = "🏆 Ranking Global";
    heading.className = "text-xl font-semibold mb-2";
    leaderboard.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "bg-gray-800 rounded p-4 divide-y divide-gray-700 shadow-md";

    players
      .sort((a: PlayerStats, b: PlayerStats) => b.elo - a.elo)
      .forEach((player: PlayerStats) => {
        const li = document.createElement("li");
        li.className = "py-2 flex justify-between";
        li.innerHTML = `<span class="text-white">👤 ${player.username}</span><span class="font-bold text-yellow-400">${player.elo}</span>`;
        list.appendChild(li);
      });

    leaderboard.appendChild(list);
    container.appendChild(leaderboard);

    const games = await getAllGames();
    if (!games || games.length === 0) {
      container.appendChild(document.createTextNode("No game history found."));
      return container;
    }

    const gameHistory = document.createElement("div");
    gameHistory.className = "w-full max-w-2xl";

    const gameTitle = document.createElement("h3");
    gameTitle.textContent = "📅 Historial de Partidas";
    gameTitle.className = "text-xl font-semibold mt-6 mb-2";
    gameHistory.appendChild(gameTitle);

    const gameList = document.createElement("ul");
    gameList.className = "bg-gray-800 rounded p-4 divide-y divide-gray-700 shadow-md";

    games.forEach((game: GameStats) => {
      const li = document.createElement("li");
      li.className = "py-2";
      const date = new Date(game.game_date).toLocaleString();
      li.innerHTML = `
        🏁 <strong><span class="text-white">${game.winner_username}</span></strong> venció a 
        <strong>${game.looser_username}</strong> 
        (${game.looser_points} pts) 
        <span class="text-sm text-gray-400 ml-2">📆 ${date}</span>
      `;
      gameList.appendChild(li);
    });

    gameHistory.appendChild(gameList);
    container.appendChild(gameHistory);

    return container;
  } catch (error) {
    console.error("Error loading stats page:", error);
    const container = document.createElement("div");
    container.textContent = "Error al cargar las estadísticas.";
    return container;
  }
};
