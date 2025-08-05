import { getUserStats, getFriendStats } from "../api/stats/statsAPI.js";
import { FriendProfileView, ProfileView } from "../components/common/ProfileCard.js";
import { GameStats } from "../types/types.js";
import { getUserByUsername } from "../api/profile/profileAPI.js"

export const Profile = (): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col items-center gap-4 w-full max-w-4xl mx-auto";

  const parent = document.createElement("div");
  parent.className = "flex gap-6 rounded-lg shadow-xl w-full bg-base-black2 p-6";

  const left = document.createElement("div");
  left.className = "w-1/3 flex flex-col items-center gap-2";
  left.id = "profile-header"; 

  const right = ProfileView();
  right.className = "flex-1 flex flex-col justify-start gap-4 text-white";

  parent.appendChild(left);
  parent.appendChild(right);

  const statsWrapper = document.createElement("div");
  statsWrapper.className = "w-full bg-black p-4 flex justify-center";

  const statsButton = document.createElement("button");
  statsButton.textContent = "Show Stats";
  statsButton.className = "px-6 py-2 bg-white text-black rounded shadow";
  statsWrapper.appendChild(statsButton);

  const statsContainer = document.createElement("div");
  statsContainer.classList.add("hidden");

  statsButton.addEventListener("click", async () => {
    const isHidden = statsContainer.classList.toggle("hidden");
  
    if (!isHidden) {
      statsContainer.classList.add("w-full", "bg-gradient-to-r", "from-[#0D1013]", "to-[#101115]", "p-6", "rounded", "text-white", "mt-2");
  
      try {
        const data = await getUserStats();
        if (!data) {
          statsContainer.textContent = "Failed to load statistics.";
          return;
        }

        const recentGamesHtml = data.recentGames
          .map((g: GameStats) => {
            const date = new Date(g.game_date).toLocaleString();
            return `<li><strong>${g.winner_username}</strong> won <strong>${g.looser_username}</strong> (${g.looser_points} pts) — <span class="text-sm text-gray-400">${date}</span></li>`;
          })
          .join("");

        statsContainer.innerHTML = `
          <h3 class="text-xl font-bold mb-4">Statistics for ${data.username}</h3>
          <h4 class="font-semibold mb-2">Recent Games</h4>
          <ul class="list-disc list-inside max-h-48 overflow-auto mb-4">${recentGamesHtml}</ul>
          <div class="flex gap-4 text-lg">
            <p>Wins: <strong>${data.wins}</strong></p>
            <p>Losses: <strong>${data.losses}</strong></p>
          </div>
        `;
      } catch (error) {
        statsContainer.textContent = "Error loading statistics.";
        //console.error("Error fetching user stats:", error);
      }
    }
  });

  wrapper.appendChild(parent);
  wrapper.appendChild(statsWrapper);
  wrapper.appendChild(statsContainer);

  return wrapper;
};

export const FriendProfile = (id: string): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col items-center gap-4 w-full max-w-4xl mx-auto";

  const parent = document.createElement("div");
  parent.className = "flex gap-6 rounded-lg shadow-xl w-full bg-base-black2 p-6";

  const left = document.createElement("div");
  left.className = "w-1/3 flex flex-col items-center gap-2";
  left.id = "profile-header";

  const right = FriendProfileView(id);
  right.className = "flex-1 flex flex-col justify-start gap-4 text-white";

  parent.appendChild(left);
  parent.appendChild(right);

  const statsWrapper = document.createElement("div");
  statsWrapper.className = "w-full bg-black p-4 flex justify-center";

  const statsButton = document.createElement("button");
  statsButton.textContent = "Show Stats";
  statsButton.className = "px-6 py-2 bg-white text-black rounded shadow";
  statsWrapper.appendChild(statsButton);

  const statsContainer = document.createElement("div");
  statsContainer.classList.add("hidden");

  let isStatsVisible = false;
  statsButton.addEventListener("click", async () => {
    isStatsVisible = !isStatsVisible;
    statsContainer.classList.toggle("hidden", !isStatsVisible);

    if (isStatsVisible) {
      statsContainer.className = "w-full bg-gradient-to-r from-[#0D1013] to-[#101115] p-6 rounded text-white mt-2";

      try {
        const data = await getFriendStats(Number(id));
        if (!data) {
          statsContainer.textContent = "Failed to load statistics.";
          return;
        }

        const recentGamesHtml = data.recentGames
          .map((g: GameStats) => {
            const date = new Date(g.game_date).toLocaleString();
            return `<li><strong>${g.winner_username}</strong> won <strong>${g.looser_username}</strong> (${g.looser_points} pts) — <span class="text-sm text-gray-400">${date}</span></li>`;
          })
          .join("");

        statsContainer.innerHTML = `
          <h3 class="text-xl font-bold mb-4">Statistics for ${data.username}</h3>
          <h4 class="font-semibold mb-2">Recent Games</h4>
          <ul class="list-disc list-inside max-h-48 overflow-auto mb-4">${recentGamesHtml}</ul>
          <div class="flex gap-4 text-lg">
            <p>Wins: <strong>${data.wins}</strong></p>
            <p>Losses: <strong>${data.losses}</strong></p>
          </div>
        `;
      } catch (error) {
        statsContainer.textContent = "Error loading statistics.";
        //console.error("Error fetching friend stats:", error);
      }
    }
  });

  wrapper.appendChild(parent);
  wrapper.appendChild(statsWrapper);
  wrapper.appendChild(statsContainer);

  return wrapper;
};
