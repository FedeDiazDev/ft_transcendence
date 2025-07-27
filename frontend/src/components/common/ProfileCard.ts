import { getUserData, getFriendData } from "../../api/profile/profileAPI.js";
import { Input } from "./Input.js";
import { getUserStats, getFriendStats } from "../../api/stats/statsAPI.js";

async function fetchStats(container: HTMLDivElement) {
    try {
        const stats = await getUserStats();
        if (!stats) {
            console.error("No stats data received");
            return;
        }

        // Create stats section
        const statsSection = document.createElement("div");
        statsSection.className = "mt-6 border-t pt-4";

        const statsTitle = document.createElement("h2");
        statsTitle.textContent = "Game History";
        statsTitle.className = "text-gray-300 text-lg text-center w-full mb-4";
        statsSection.appendChild(statsTitle);

        // Create stats display
        const statsGrid = document.createElement("div");
        statsGrid.className = "grid grid-cols-2 gap-4";

        const totalGames = (stats.wins || 0) + (stats.losses || 0);
        const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

        const winsCard = createStatCard("Games Won", `${stats.wins || 0} (${winRate}%)`, "text-green-500");
        const lossesCard = createStatCard("Games Lost", stats.losses || 0, "text-red-500");
        statsGrid.appendChild(winsCard);
        statsGrid.appendChild(lossesCard);
        statsSection.appendChild(statsGrid);

        // games history section
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
        console.error("Error fetching stats:", error);

        // Show error message in the container
        const errorMsg = document.createElement("div");
        errorMsg.className = "mt-4 p-3 bg-red-100 text-red-700 rounded";
        errorMsg.textContent = "Unable to load game statistics.";
        container.appendChild(errorMsg);
    }
}

// Helper function to create stat cards
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
    // Set as image source with data URL
    avatarImage.src = `data:image/png;base64,${base64String}`;
}

// Function to validate PNG file signature
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
            console.error("No data received");
            return;
        }
        // Create field wrappers with labels + inputs
        const fields = [
            { name: "Username", input: Input("text", data.user.username || "", "Username", false) },
            { name: "Presentacion", input: Input("text", data.user.presentacion || "", "Presentacion", false) },
        ];

        const profileHeader = document.getElementById("profile-header");

        // Avatar image with edit button
        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "flex flex-col items-center gap-4 mb-4";
        const avatarImage = document.createElement("img");
        if (data.user.avatar_blob) {
            // The avatar_blob from SQLite is received as an object  { type: "Buffer", data: (2146) […] }, must be converted
            // to a Uint8Array and then to Base64 string to be used as a data URL in the img tag src attribute
            convertBlobToBase64(data.user.avatar_blob.data, avatarImage);
        } else {
            avatarImage.src = "";
        }
        avatarImage.alt = "Avatar";
        avatarImage.className = "w-24 h-24 rounded-full";

        const editAvatarButton = document.createElement("button");
        editAvatarButton.textContent = "Edit avatar";
        editAvatarButton.className = "self-end px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700";

        editAvatarButton.addEventListener("click", () => {
            // Create hidden file input
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/png";
            fileInput.style.display = "none";
            document.body.appendChild(fileInput);

            // Trigger file dialog
            fileInput.click();

            // Handle file selection
            fileInput.addEventListener("change", async (event) => {
                const target = event.target as HTMLInputElement;
                if (!target.files || target.files.length === 0) {
                    document.body.removeChild(fileInput);
                    return;
                }

                const file = target.files[0];

                // Validate file is PNG
                if (file.type !== "image/png") {
                    alert("Please select a PNG image file.");
                    document.body.removeChild(fileInput);
                    return;
                }

                // Validate actual PNG signature
                const isValidPNG = await isPNG(file);
                if (!isValidPNG) {
                    alert("Invalid PNG file. Please select a valid PNG image.");
                    document.body.removeChild(fileInput);
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert("File is too large. Maximum size is 5MB.");
                    document.body.removeChild(fileInput);
                    return;
                }
                editAvatarButton.textContent = "Uploading...";
                editAvatarButton.disabled = true;

                try {
                    // Create FormData to send the file
                    const formData = new FormData();
                    formData.append("avatar", file);
                    const response = await fetch("https://" + window.location.hostname + ":8080/api/users/updateAvatar", {
                        method: "POST",
                        // No Content-Type header - FormData sets it automatically
                        body: formData
                    });
                    console.log("Response status:", response.status);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Server response:", errorText);
                        throw new Error(`Failed to upload avatar: ${response.statusText}`);
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target && e.target.result) {
                            avatarImage.src = e.target.result as string;
                        }
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error("Failed to upload avatar:", error);
                    alert("Failed to upload avatar. Please try again.");
                } finally {
                    // Reset button state
                    editAvatarButton.textContent = "Edit";
                    editAvatarButton.disabled = false;
                    // Remove the file input
                    document.body.removeChild(fileInput);
                }
            });
        });

        avatarWrapper.appendChild(avatarImage);
        avatarWrapper.appendChild(editAvatarButton);

        if (profileHeader) {
            profileHeader.appendChild(avatarWrapper);
        }
        // Add each field with label to container
        fields.forEach((field) => {
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "flex flex-col gap-2 mb-4";

            const lineContainer = document.createElement("div");
            lineContainer.className = "flex items-center gap-2";

            const label = document.createElement("label");
            label.textContent = field.name + ": ";
            label.className = "w-24 font-medium text-gray-600";

            lineContainer.append(label, field.input);
            fieldWrapper.append(lineContainer);

            if (field.name === "Presentacion") {
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit presentation";
                editBtn.className =
                    "self-end px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700";

                editBtn.addEventListener("click", () => {
                    lineContainer.removeChild(field.input);
                    editBtn.remove();

                    const textarea = document.createElement("textarea");
                    textarea.value = field.input.value;
                    textarea.rows = 3;
                    textarea.className = "p-2 rounded border w-full text-black";
                    lineContainer.append(textarea);

                    const saveBtn = document.createElement("button");
                    saveBtn.textContent = "Save";
                    saveBtn.className =
                        "self-end mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700";
                    fieldWrapper.append(saveBtn);

                    saveBtn.addEventListener("click", async () => {
                        try {
                            await fetch(
                                "https://" +
                                window.location.hostname +
                                ":8080/api/users/updateProfileText",
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ presentacion: textarea.value }),
                                }
                            );

                            textarea.remove();
                            saveBtn.remove();
                            field.input.value = textarea.value;
                            lineContainer.append(field.input);
                            fieldWrapper.append(editBtn);
                        } catch (err) {
                            console.error("Failed to update presentacion", err);
                            alert("Error al actualizar la presentación");
                        }
                    });
                });

                fieldWrapper.append(editBtn);
            }

            container.append(fieldWrapper);
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export const ProfileView = () => {
    const container = document.createElement("div");
    container.className = "bg-[#1c1c1c] text-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto";
    // Use an immediately-invoked async function to avoid race condition between fetchProfile and fetchStats
    // and to ensure that the container is populated with data before being returned
    (async () => {
        await fetchProfile(container);
    })();

    return container;
};

async function fetchFriendProfile(container: HTMLDivElement, id: string) {
    try {

        const FriendData = await getFriendData(Number(id));
        if (!FriendData) {
            console.error("No friend data received");
            return;
        }
        // Create field wrappers with labels + inputs
        const fields = [
            { name: "Username", input: Input("text", FriendData.user.username || "", "Username", false) },
            { name: "Presentacion", input: Input("text", FriendData.user.presentacion || "", "Presentacion", false) },
        ];

        const profileHeader = document.getElementById("profile-header");

        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "flex items-center gap-2 mb-4";
        const avatarImage = document.createElement("img");
        if (FriendData.user.avatar_blob) {
            // The avatar_blob from SQLite is received as an object  { type: "Buffer", FriendData: (2146) […] }, must be converted
            // to a Uint8Array and then to Base64 string to be used as a FriendData URL in the img tag src attribute
            convertBlobToBase64(FriendData.user.avatar_blob.data, avatarImage);
        } else {
            avatarImage.src = "";
        }
        avatarImage.alt = "Avatar";
        avatarImage.className = "w-24 h-24 rounded-full";
        avatarWrapper.appendChild(avatarImage);

        if (profileHeader) {
            profileHeader.appendChild(avatarWrapper);
        }
        // Add each field with label to container
        fields.forEach((field) => {
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "flex flex-col items-start mb-4 w-full";

            const label = document.createElement("label");
            label.textContent = field.name + ": ";
            label.className = "mb-1 text-sm font-medium text-gray-200";
            field.input.classList.add("w-full", "rounded", "p-2", "bg-white", "text-black");

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(field.input);

            container.appendChild(fieldWrapper);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


async function fetchFriendStats(container: HTMLDivElement, id: string) {
    try {
        const stats = await getFriendStats(Number(id));
        if (!stats) {
            console.error("No friend stats received");
            return;
        }

        // Create stats section
        const statsSection = document.createElement("div");
        statsSection.className = "mt-6 border-t pt-4";

        const statsTitle = document.createElement("h2");
        statsTitle.textContent = "Game History";
        statsTitle.className = "text-gray-300 text-lg text-center w-full mb-4";
        statsSection.appendChild(statsTitle);

        // Create stats display
        const statsGrid = document.createElement("div");
        statsGrid.className = "grid grid-cols-2 gap-4";

        const totalGames = (stats.wins || 0) + (stats.losses || 0);
        const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

        const winsCard = createStatCard("Games Won", `${stats.wins || 0} (${winRate}%)`, "text-green-500");
        const lossesCard = createStatCard("Games Lost", stats.losses || 0, "text-red-500");
        statsGrid.appendChild(winsCard);
        statsGrid.appendChild(lossesCard);
        statsSection.appendChild(statsGrid);

        // games history section
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
        console.error("Error fetching stats:", error);

        // Show error message in the container
        const errorMsg = document.createElement("div");
        errorMsg.className = "mt-4 p-3 bg-red-100 text-red-700 rounded";
        errorMsg.textContent = "Unable to load game statistics.";
        container.appendChild(errorMsg);
    }
}

export const FriendProfileView = (id: string) => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4 p-4 border";
    // Use an immediately-invoked async function to avoid race condition between fetchProfile and fetchStats
    // and to ensure that the container is populated with data before being returned
    (async () => {
        await fetchFriendProfile(container, id);
        await fetchFriendStats(container, id);
    })();

    return container;
};