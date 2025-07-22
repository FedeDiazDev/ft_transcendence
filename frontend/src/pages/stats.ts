import { getAllPlayers, getAllGames } from "../api/stats/statsAPI.js";
import type { PlayerStats, GameStats } from "../types/types.ts";

declare global {
  interface Window {
    Chart: any;
  }
}
export const Chart = window.Chart;


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

    // Leaderboard
    const leaderboard = document.createElement("div");
    leaderboard.className = "w-full max-w-2xl";

    const heading = document.createElement("h3");
    heading.textContent = "🏆 Ranking Global";
    heading.className = "text-xl font-semibold mb-2";
    leaderboard.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "bg-gradient-to-r from-[#0D1013] to-[#101115] rounded p-4 divide-y divide-gray-700 shadow-md";

    players
      .sort((a: PlayerStats, b: PlayerStats) => b.elo - a.elo)
      .forEach((player: PlayerStats) => {
        const li = document.createElement("li");
        li.className = "py-2 flex justify-between";
        li.innerHTML = `<a href="/profile/${player.username}" class="text-white hover:underline">👤 ${player.username}</a><span class="font-bold text-yellow-400">${player.elo}</span>`;
        list.appendChild(li);
      });

    leaderboard.appendChild(list);
    container.appendChild(leaderboard);

    const games = await getAllGames();
    if (!games || games.length === 0) {
      container.appendChild(document.createTextNode("No game history found."));
      return container;
    }

    // Average wins per player
    const totalWins = games.length;
    const averageWins = totalWins / players.length;

    const avgDiv  = document.createElement("div");
    avgDiv.className  = "text-center mt-4 text-gray-300";
    avgDiv.textContent  = `🏆 Promedio de victorias por jugador: ${averageWins.toFixed(2)}`;
    container.appendChild(avgDiv);

    // Wins per player Pie Chart
    const winsChartDiv = document.createElement("div");
    winsChartDiv.className = "w-full max-w-md";
    const winsCanvas = document.createElement("canvas");
    winsChartDiv.appendChild(winsCanvas);
    container.appendChild(winsChartDiv);

    // Calculate wins per player
    const winsCount: Record<string, number> = {};
    games.forEach((game: GameStats) => {
      winsCount[game.winner_username] = (winsCount[game.winner_username] || 0) + 1;
    });

    const winsLabels = Object.keys(winsCount);
    const winsData = Object.values(winsCount);

    new Chart(winsCanvas, {
      type: "pie",
      data: {
        labels: winsLabels,
        datasets: [{
          label: "Victorias",
          data: winsData,
          backgroundColor: [
            "#FBBF24", "#34D399", "#60A5FA", "#F472B6",
            "#F87171", "#A78BFA", "#4ADE80", "#FCD34D"
          ],
        }],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "🏆 Distribución de Victorias por Jugador",
            color: "#e5e7eb"
          },
          legend: {
            labels: {
              color: "#e5e7eb"
            }
          }
        }
      }
    });

    // ELO Bar Chart
    const eloChartDiv = document.createElement("div");
    eloChartDiv.className = "w-full max-w-md";
    const eloCanvas = document.createElement("canvas");
    eloChartDiv.appendChild(eloCanvas);
    container.appendChild(eloChartDiv);

    const eloLabels = players.map((p: PlayerStats) => p.username);
    const eloData = players.map((p: PlayerStats) => p.elo);

    new Chart(eloCanvas, {
      type: "bar",
      data: {
        labels: eloLabels,
        datasets: [{
          label: "ELO",
          data: eloData,
          backgroundColor: "#3B82F6", // Tailwind blue-500
        }],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "📊 ELO de Jugadores",
            color: "#e5e7eb"
          },
          legend: {
            labels: {
              color: "#e5e7eb"
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#e5e7eb"
            }
          },
          y: {
            ticks: {
              color: "#e5e7eb"
            },
            beginAtZero: true
          }
        }
      }
    });

    // Game History
    const gameHistory = document.createElement("div");
    gameHistory.className = "w-full max-w-2xl";

    const gameTitle = document.createElement("h3");
    gameTitle.textContent = "📅 Historial de Partidas";
    gameTitle.className = "text-xl font-semibold mt-6 mb-2";
    gameHistory.appendChild(gameTitle);

    const gameList = document.createElement("ul");
    gameList.className = "bg-gradient-to-r from-[#0D1013] to-[#101115] rounded p-4 divide-y divide-gray-700 shadow-md";

    games.forEach((game: GameStats) => {
      const li = document.createElement("li");
      li.className = "py-2";
      const date = new Date(game.game_date).toLocaleString();
      li.innerHTML = `
        🏁 <strong>
          <a href="/profile/${game.winner_username}" class="text-white hover:underline">
            ${game.winner_username}
          </a>
        </strong> venció a 
        <strong>
          <a href="/profile/${game.looser_username}" class="hover:underline">
            ${game.looser_username}
          </a>
        </strong> 
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

