import { getUserData, getFriendData } from "../../api/profile/profileAPI.js";
// import { Input } from "./Input.js";
import { getUserStats, getFriendStats } from "../../api/stats/statsAPI.js";

function showError(msg: string) {
  const existing = document.getElementById("error-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "error-overlay";
  overlay.className = `
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/40 backdrop-blur-sm transition-opacity duration-300 opacity-0
  `;

  const card = document.createElement("div");
  card.setAttribute("role", "alert");
  card.className = `
    transform scale-90 opacity-0 transition-all duration-300
    flex flex-col items-center gap-4 px-12 py-10 rounded-3xl
    bg-gradient-to-br from-[#0B0C0E] to-[#141519]
    shadow-[0_0_15px_#000_inset,0_0_10px_#000]
    w-[360px] md:w-[440px] text-center
  `;

  const title = document.createElement("p");
  title.className = "text-white text-xl font-semibold";
  title.textContent = msg;

  card.append(title);
  overlay.append(card);
  document.body.append(overlay);

  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0");
    card.classList.remove("opacity-0", "scale-90");
    card.classList.add("opacity-100", "scale-100");
  });

  setTimeout(() => {
    overlay.classList.add("opacity-0");
    card.classList.add("opacity-0", "scale-90");
    setTimeout(() => overlay.remove(), 300);
  }, 3000);
}


async function fetchStats(container: HTMLDivElement) {
    try {
        const stats = await getUserStats();
        if (!stats) {
            //console.error("No stats data received");
            return;
        }

        const statsSection = document.createElement("div");
        statsSection.className = "mt-6 border-t pt-4";

        const statsTitle = document.createElement("h2");
        statsTitle.textContent = "Game History";
        statsTitle.className = "text-gray-300 text-lg text-center w-full mb-4";
        statsSection.appendChild(statsTitle);

        const statsGrid = document.createElement("div");
        statsGrid.className = "grid grid-cols-2 gap-4";

        const totalGames = (stats.wins || 0) + (stats.losses || 0);
        const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

        const winsCard = createStatCard("Games Won", `${stats.wins || 0} (${winRate}%)`, "text-green-500");
        const lossesCard = createStatCard("Games Lost", stats.losses || 0, "text-red-500");
        statsGrid.appendChild(winsCard);
        statsGrid.appendChild(lossesCard);
        statsSection.appendChild(statsGrid);

        if (stats.recentGames && stats.recentGames.length > 0) {
            const recentGamesSection = document.createElement("div");
            recentGamesSection.className = "mt-4";

            const gamesList = document.createElement("ul");
            gamesList.className = "divide-y";

            stats.recentGames.forEach((game: any) => {
                const gameItem = document.createElement("li");
                gameItem.className = "py-2";

                const isWinner = game.winner_username === stats.username;
                const result = isWinner ? "Won" : "Lost";
                const resultClass = isWinner ? "text-green-500" : "text-red-500";

                gameItem.innerHTML = `
                    <span class="${resultClass} font-medium">${result}</span>
                    <span class="ml-2">${isWinner ? game.winner_points : game.looser_points} - ${isWinner ? game.looser_points : game.winner_points}</span>
                    <span class="ml-2 text-sm text-gray-500">vs ${isWinner ? game.looser_username : game.winner_username}</span>
                    <span class="ml-2 text-xs text-gray-400">${new Date(game.game_date).toLocaleString()}</span>
                `;

                gamesList.appendChild(gameItem);
            });

            recentGamesSection.appendChild(gamesList);
            statsSection.appendChild(recentGamesSection);
        }

        container.appendChild(statsSection);

    } catch (error) {
        //console.error("Error fetching stats:", error);

        const errorMsg = document.createElement("div");
        errorMsg.className = "mt-4 p-3 bg-red-100 text-red-700 rounded";
        errorMsg.textContent = "Unable to load game statistics.";
        container.appendChild(errorMsg);
    }
}

function createStatCard(label: string, value: number | string, valueColorClass: string) {
    const card = document.createElement("div");
    card.className = "bg-gray-50 p-3 rounded shadow-sm";

    const labelElement = document.createElement("div");
    labelElement.className = "text-sm text-gray-600";
    labelElement.textContent = label;

    const valueElement = document.createElement("div");
    valueElement.className = `text-xl font-bold ${valueColorClass}`;
    valueElement.textContent = value.toString();

    card.appendChild(labelElement);
    card.appendChild(valueElement);

    return card;
}


export function convertBlobToBase64(data: any, avatarImage: HTMLImageElement) {
    const uint8Array = new Uint8Array(data);
    let binaryString = '';
    uint8Array.forEach(byte => {
        binaryString += String.fromCharCode(byte);
    });
    const base64String = btoa(binaryString);
    avatarImage.src = `data:image/png;base64,${base64String}`;
}

async function isPNG(file: File): Promise<boolean> {
    const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const bytes = await file.slice(0, 8).arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    return PNG_SIGNATURE.every((byte, i) => uint8Array[i] === byte);
}

async function fetchProfile(container: HTMLDivElement) {
    try {
      const data = await getUserData();
      if (!data) {
        //console.error("No data received");
        return;
      }

      container.innerHTML = "";

      const usernameLabel = document.createElement("p");
      usernameLabel.className = "text-sm font-bold text-white mb-1";
      usernameLabel.textContent = "Username:";
  
      const usernameValue = document.createElement("p");
      usernameValue.className = "text-white font-normal mb-4";
      usernameValue.textContent = data.user.username || "";
  
      container.appendChild(usernameLabel);
      container.appendChild(usernameValue);
  
      const aboutMeLabel = document.createElement("p");
      aboutMeLabel.className = "text-sm font-bold text-white mb-1";
      aboutMeLabel.textContent = "About Me:";
  
      const aboutMeValue = document.createElement("p");
      aboutMeValue.className = "text-white whitespace-pre-wrap";
      aboutMeValue.textContent = (data.user.presentacion || "");

      aboutMeValue.style.whiteSpace = "pre-wrap";
      aboutMeValue.style.wordBreak = "break-word";
      aboutMeValue.style.maxWidth = "100%";
      aboutMeValue.style.overflow = "hidden";

      container.appendChild(aboutMeLabel);
      container.appendChild(aboutMeValue);
  
      const editAboutBtn = document.createElement("button");
      editAboutBtn.textContent = "Edit About Me";
      editAboutBtn.className = "mt-3 px-4 py-2 bg-white text-black rounded shadow";
      container.appendChild(editAboutBtn);
  
      editAboutBtn.addEventListener("click", () => {
        container.removeChild(aboutMeValue);
        editAboutBtn.remove();
  
        const textarea = document.createElement("textarea");
        textarea.maxLength = 300;
        textarea.value = aboutMeValue.textContent || "";
        textarea.rows = 5;
        textarea.className = "p-2 rounded border w-full text-black mb-2";
        container.appendChild(textarea);
  
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "px-4 py-2 bg-green-600 text-white rounded shadow";
        container.appendChild(saveBtn);
  
        saveBtn.addEventListener("click", async () => {
          try {
            await fetch(
              "https://" + window.location.hostname + ":8080/api/users/updateProfileText",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ presentacion: textarea.value }),
              }
            );
  
            textarea.remove();
            saveBtn.remove();
  
            aboutMeValue.textContent = textarea.value;
            container.appendChild(aboutMeValue);
            container.appendChild(editAboutBtn);
          } catch (err) {
            showError("Failed to update About Me.");
          }
        });
      });
  
      const profileHeader = document.getElementById("profile-header");
      if (profileHeader) {
        profileHeader.innerHTML = "";
  
        const avatarImage = document.createElement("img");
        avatarImage.alt = "Avatar";
        avatarImage.className = "w-32 h-32 rounded-full object-cover";
  
        if (data.user.avatar_blob) {
          convertBlobToBase64(data.user.avatar_blob.data, avatarImage);
        }
  
        const editAvatarButton = document.createElement("button");
        editAvatarButton.textContent = "Edit Avatar";
        editAvatarButton.className = "mt-2 px-4 py-2 bg-white text-black rounded shadow";
  
        editAvatarButton.addEventListener("click", () => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/png";
          fileInput.style.display = "none";
          document.body.appendChild(fileInput);
          fileInput.click();
  
          fileInput.addEventListener("change", async (event) => {
            const target = event.target as HTMLInputElement;
            if (!target.files || target.files.length === 0) {
              document.body.removeChild(fileInput);
              return;
            }
            const file = target.files[0];
  
            if (file.type !== "image/png") {
              showError("Please select a PNG image file.");
              document.body.removeChild(fileInput);
              return;
            }
  
            const isValidPNG = await isPNG(file);
            if (!isValidPNG) {
              showError("Invalid PNG file. Please select a valid PNG image.");
              document.body.removeChild(fileInput);
              return;
            }
  
            if (file.size > 5 * 1024 * 1024) {
              showError("File is too large. Maximum size is 5MB.");
              document.body.removeChild(fileInput);
              return;
            }
  
            editAvatarButton.textContent = "Uploading...";
            editAvatarButton.disabled = true;
  
            try {
              const formData = new FormData();
              formData.append("avatar", file);
  
              const response = await fetch("https://" + window.location.hostname + ":8080/api/users/updateAvatar", {
                method: "POST",
                body: formData,
              });
  
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
              }
  
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && e.target.result) {
                  avatarImage.src = e.target.result as string;
                }
              };
              reader.readAsDataURL(file);
            } catch (error) {
              showError("Failed to upload avatar. Please try again.");
            } finally {
              editAvatarButton.textContent = "Edit Avatar";
              editAvatarButton.disabled = false;
              document.body.removeChild(fileInput);
            }
          });
        });
  
        profileHeader.appendChild(avatarImage);
        profileHeader.appendChild(editAvatarButton);
      }
    } catch (error) {
      //console.error("Fetch error:", error);
    }
}

export const ProfileView = (): HTMLElement => {
    const container = document.createElement("div");
    container.className = "bg-[#1c1c1c] p-6 rounded-xl shadow-md w-full max-w-xl mx-auto";
  
    (async () => {
      await fetchProfile(container);
    })();
  
    return container;
};

async function fetchFriendProfile(container: HTMLDivElement, id: string) {
    try {
      const data = await getFriendData(Number(id));
      if (!data) {
        //console.error("No friend data received");
        return;
      }
  
      container.innerHTML = "";
  
      const usernameLabel = document.createElement("p");
      usernameLabel.className = "text-sm font-bold text-white mb-1";
      usernameLabel.textContent = "Username:";
  
      const usernameValue = document.createElement("p");
      usernameValue.className = "text-white font-normal mb-4";
      usernameValue.textContent = data.user.username || "";
  
      container.appendChild(usernameLabel);
      container.appendChild(usernameValue);
  
      const aboutMeLabel = document.createElement("p");
      aboutMeLabel.className = "text-sm font-bold text-white mb-1";
      aboutMeLabel.textContent = "About Me:";
  
      const aboutMeValue = document.createElement("p");
      aboutMeValue.className = "text-white whitespace-pre-wrap";
      aboutMeValue.textContent = data.user.presentacion || "";
  
      container.appendChild(aboutMeLabel);
      container.appendChild(aboutMeValue);
  
      const profileHeader = document.getElementById("profile-header");
      if (profileHeader) {
        profileHeader.innerHTML = "";
  
        const avatarImage = document.createElement("img");
        avatarImage.alt = "Avatar";
        avatarImage.className = "w-32 h-32 rounded-full object-cover";
  
        if (data.user.avatar_blob) {
          convertBlobToBase64(data.user.avatar_blob.data, avatarImage);
        }
  
        profileHeader.appendChild(avatarImage);
      }
    } catch (error) {
      //console.error("Fetch error:", error);
    }
}


export const FriendProfileView = (id: string): HTMLElement => {
    const container = document.createElement("div");
    container.className = "bg-[#1c1c1c] p-6 rounded-xl shadow-md w-full max-w-xl mx-auto";
    (async () => {
      await fetchFriendProfile(container, id);
    })();
    return container;
};