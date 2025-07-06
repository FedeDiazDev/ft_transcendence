import { ProfileView, FriendProfileView } from "../components/common/ProfileCard.js"
import { getUserStats } from "../api/stats/statsAPI.js"; // Adjust path as needed
import type { GameStats } from "../types/types.ts";

export const Profile = (): HTMLElement => {
  const parent = document.createElement("div");
  parent.className = "flex flex-col items-center gap-6 p-10 rounded-lg shadow-xl w-full max-w-2xl mx-auto rounded-xl bg-base-black2";
  const row = document.createElement("div");
  row.className = "flex w-full gap-4";
  const left = document.createElement("div");
  left.className = "w-1/2 flex flex-col items-center";
  left.id = "profile-header";
  //left.innerHTML = `<h2 class="text-2xl font-extrabold text-blue-400">Perfil</h2>`;

  const right = ProfileView();
  right.classList.add("w-1/2");

  row.appendChild(left);
  row.appendChild(right);
  parent.appendChild(row);

  // Create button to fetch and show user stats
  const statsButton = document.createElement("button");
  statsButton.textContent = "Ver mis estadísticas";
  statsButton.className = "mt-4 px-4 py-2 bg-base-black2 text-white rounded self-end";

  parent.appendChild(statsButton);

  // Container to show stats

  const statsContainer = document.createElement("div");
  statsButton.addEventListener("click", async () => {
    statsContainer.innerHTML="";
    statsContainer.className = "mt-6 w-full max-w-2xl bg-gradient-to-r from-[#0D1013] to-[#101115] p-4 rounded text-white ";
    statsContainer.textContent = "Cargando estadísticas...";

    try {
      const data = await getUserStats();
      if (!data) {
        statsContainer.textContent = "No se pudieron cargar las estadísticas.";
        return;
      }

      // Format recent games list
      const recentGamesHtml = data.recentGames
        .map((g: GameStats) => {
          const date = new Date(g.game_date).toLocaleString();
          return `<li>🏁 <strong>${g.winner_username}</strong> venció a <strong>${g.looser_username}</strong> (${g.looser_points} pts) — <span class="text-sm text-gray-400">📆 ${date}</span></li>`;
        })
        .join("");

      statsContainer.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Estadísticas de ${data.username}</h3>
        <p>✅ Victorias: <strong>${data.wins}</strong></p>
        <p>❌ Derrotas: <strong>${data.losses}</strong></p>
        <h4 class="mt-4 font-semibold">Últimas partidas:</h4>
        <ul class="list-disc list-inside max-h-48 overflow-auto">${recentGamesHtml}</ul>
      `;
      parent.appendChild(statsContainer);

    } catch (error) {
      statsContainer.textContent = "Error al cargar las estadísticas.";
      console.error("Error fetching user stats:", error);
    }
  });

  return parent;
};

export const FriendProfile = (id: string) => {
  const div = document.createElement("div");
  div.className = "flex flex-col items-center gap-6 p-10 bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-auto";

  div.innerHTML = `
    <h2 id="profile-header" class="text-2xl font-extrabold text-blue-400"> Perfil</h2>
    <p class="text-gray-300 text-lg">Información del usuario</p>
  `;

  div.appendChild(FriendProfileView(id));
  return div;
};
