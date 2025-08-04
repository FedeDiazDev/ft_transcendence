import { getAllPlayers, getAllGames } from "../api/stats/statsAPI.js";
import { navigateTo } from "../router.js";
import type { PlayerStats, GameStats } from "../types/types.ts";

declare global {
  interface Window {
    Chart: any;
  }
}
export const Chart = window.Chart;

const colorScale = [
  "#488f31",
  "#de425b",
  "#6ca257",
  "#e76b77",
  "#8eb67c",
  "#ee8e94",
  "#afc9a2",
  "#f2afb2",
  "#d0ddc9",
  "#f3d0d1"
];

export const Stats = async (): Promise<HTMLElement> => {
  try {
    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.className = "flex flex-col items-center gap-6 w-full max-w-5xl mx-auto";

    const title: HTMLHeadingElement = document.createElement("h2");
    title.textContent = "Stats";
    title.className = "text-2xl font-bold text-white text-center";
    wrapper.appendChild(title);

    const players: PlayerStats[] = await getAllPlayers();
    const games: GameStats[] = await getAllGames();

    if (!players || players.length === 0) {
      const noPlayersMsg = document.createElement("p");
      noPlayersMsg.textContent = "No player stats found... Play some games to create them!";
      noPlayersMsg.className = "text-white";
      wrapper.appendChild(noPlayersMsg);
      return wrapper;
    }

    if (!games || games.length === 0) {
      const noGamesMsg = document.createElement("p");
      noGamesMsg.textContent = "No game history found... Play some games to create it!";
      noGamesMsg.className = "text-white";
      wrapper.appendChild(noGamesMsg);
      return wrapper;
    }

    // Leaderboard
    const leaderboardCard: HTMLDivElement = document.createElement("div");
    leaderboardCard.className = "w-full bg-base-black2 rounded-lg shadow-md p-4";

    const leaderboardTitle: HTMLHeadingElement = document.createElement("h3");
    leaderboardTitle.className = "text-xl font-semibold text-white mb-4";
    leaderboardTitle.textContent = "Global Ranking";
    leaderboardCard.appendChild(leaderboardTitle);

    const ul: HTMLUListElement = document.createElement("ul");
    ul.className = "divide-y divide-gray-700";

    players
      .sort((a, b) => b.elo - a.elo)
      .forEach((player: PlayerStats) => {
        const li: HTMLLIElement = document.createElement("li");
        li.className = "flex justify-between py-2 text-white hover:bg-gray-800 px-2 rounded cursor-pointer";

        const usernameSpan: HTMLSpanElement = document.createElement("span");
        usernameSpan.textContent = `👤 ${player.username}`;
        usernameSpan.addEventListener("click", () => navigateTo(`/profile/${player.username}`));

        const eloSpan: HTMLSpanElement = document.createElement("span");
        eloSpan.className = "font-bold text-yellow-400";
        eloSpan.textContent = `${player.elo}`;

        li.appendChild(usernameSpan);
        li.appendChild(eloSpan);
        ul.appendChild(li);
      });

    leaderboardCard.appendChild(ul);
    wrapper.appendChild(leaderboardCard);

    // Wins Average
    const statsCard: HTMLDivElement = document.createElement("div");
    statsCard.className = "w-full bg-base-black2 text-white p-4 rounded-lg shadow-md";
    const avgWins: number = games.length / players.length;
    statsCard.innerHTML = `
      <p class="text-center">Average Wins per Player: <strong>${avgWins.toFixed(2)}</strong></p>
    `;
    wrapper.appendChild(statsCard);

    // Chart Container
    const chartContainer: HTMLDivElement = document.createElement("div");
    chartContainer.className = "flex flex-col md:flex-row gap-4 w-full";

    // Wins Pie Chart
    const winsDiv: HTMLDivElement = document.createElement("div");
    winsDiv.className = "w-full md:w-1/2 bg-base-black2 p-4 rounded-lg shadow-md";

    const winsCanvas: HTMLCanvasElement = document.createElement("canvas");
    winsDiv.appendChild(winsCanvas);
    chartContainer.appendChild(winsDiv);

    const winsCount: Record<string, number> = {};
    games.forEach((game: GameStats) => {
      winsCount[game.winner_username] = (winsCount[game.winner_username] || 0) + 1;
    });

    const winsLabels: string[] = Object.keys(winsCount);
    const winsData: number[] = Object.values(winsCount);

    new Chart(winsCanvas, {
      type: "pie",
      data: {
        labels: winsLabels,
        datasets: [{
          label: "Wins",
          data: winsData,
          backgroundColor: colorScale,
        }],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Wins Distribution",
            color: "#e5e7eb",
          },
          legend: {
            labels: {
              color: "#e5e7eb",
            },
          },
        },
      },
    });

    const eloDiv: HTMLDivElement = document.createElement("div");
    eloDiv.className = "w-full md:w-1/2 bg-base-black2 p-4 rounded-lg shadow-md";

    const scrollWrapper: HTMLDivElement = document.createElement("div");
    scrollWrapper.className = "overflow-x-auto";

    const eloCanvas: HTMLCanvasElement = document.createElement("canvas");
    eloCanvas.height = 300;
    scrollWrapper.appendChild(eloCanvas);
    eloDiv.appendChild(scrollWrapper);
    chartContainer.appendChild(eloDiv);

    const eloLabels: string[] = players.map((p) => p.username);
    const eloData: number[] = players.map((p) => p.elo);


    new Chart(eloCanvas, {
      type: "bar",
      data: {
        labels: eloLabels,
        datasets: [{
          label: "ELO",
          data: eloData,
          backgroundColor: "#ee8e94",
        }],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Players' ELO",
            color: "#e5e7eb",
          },
          legend: {
            labels: {
              color: "#e5e7eb",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#e5e7eb",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#e5e7eb",
            },
          },
        },
      },
    });

    wrapper.appendChild(chartContainer);

    // Game History
    const historyCard: HTMLDivElement = document.createElement("div");
    historyCard.className = "w-full bg-base-black2 rounded-lg p-4 shadow-md";

    const historyTitle: HTMLHeadingElement = document.createElement("h3");
    historyTitle.textContent = "Game History";
    historyTitle.className = "text-xl font-semibold text-white mb-4";
    historyCard.appendChild(historyTitle);

    const historyList: HTMLUListElement = document.createElement("ul");
    historyList.className = "space-y-2 text-white max-h-64 overflow-y-auto";

    games.forEach((game: GameStats) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "text-sm";

      const date: string = new Date(game.game_date).toLocaleString();

      li.innerHTML = `
        <strong class="hover:underline cursor-pointer text-white" data-user="${game.winner_username}">${game.winner_username}</strong>
        won 
        <strong class="hover:underline cursor-pointer" data-user="${game.looser_username}">${game.looser_username}</strong>
        (${game.looser_points} points) — <span class="text-gray-400"> on ${date}</span>
      `;

      li.querySelectorAll<HTMLElement>("[data-user]").forEach((el) => {
        el.addEventListener("click", () => {
          const username = el.getAttribute("data-user");
          if (username) navigateTo(`/profile/${username}`);
        });
      });

      historyList.appendChild(li);
    });

    historyCard.appendChild(historyList);
    wrapper.appendChild(historyCard);

    return wrapper;

  } catch (error) {
    //console.error("Error loading stats page:", error);
    const errDiv: HTMLDivElement = document.createElement("div");
    errDiv.textContent = "Error while loading stats!";
    return errDiv;
  }
};
