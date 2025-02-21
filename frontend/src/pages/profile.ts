import { ProfileView } from "../components/ProfileCard.js"

export const Profile = () => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-6 p-10 bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-auto";
    
    div.innerHTML = `
      <h2 class="text-2xl font-extrabold text-blue-400">👤 Perfil</h2>
      <p class="text-gray-300 text-lg">Información del usuario</p>
    `;
    
    div.appendChild(ProfileView());
    return div;
};
