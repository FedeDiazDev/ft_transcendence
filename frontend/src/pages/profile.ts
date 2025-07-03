import { ProfileView, FriendProfileView } from "../components/common/ProfileCard.js"
import { getUserStats } from "../api/stats/statsAPI.js"; // Adjust path as needed
import type { GameStats } from "../types/types.ts";

export const Profile = (): HTMLElement => {
  const div = document.createElement("div");
  div.className = "flex flex-col items-center gap-6 p-10 bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-auto";

  div.innerHTML = `
    <h2 id="profile-header" class="text-2xl font-extrabold text-blue-400">Perfil</h2>
    <p class="text-gray-300 text-lg">Información del usuario</p>
  `;

  // Append profile card
  div.appendChild(ProfileView());

  // Create button to fetch and show user stats
  const statsButton = document.createElement("button");
  statsButton.textContent = "Ver mis estadísticas";
  statsButton.className = "mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded";

  div.appendChild(statsButton);

  // Container to show stats
  const statsContainer = document.createElement("div");
  statsContainer.className = "mt-6 w-full max-w-2xl bg-gradient-to-r from-[#0D1013] to-[#101115] p-4 rounded text-white";
  div.appendChild(statsContainer);

  statsButton.addEventListener("click", async () => {
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
    } catch (error) {
      statsContainer.textContent = "Error al cargar las estadísticas.";
      console.error("Error fetching user stats:", error);
    }
  });

  return div;
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
