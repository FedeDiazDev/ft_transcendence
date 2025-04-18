import { Input } from "./Input.js";

async function fetchProfile(container: HTMLDivElement) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.log("No token found in localStorage");
        return;
    }
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    try {
        const response = await fetch("https://localhost:8080/api/users/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: jsonPayload.username }),
        });

        const data = await response.json();

        // Create field wrappers with labels + inputs
        const fields = [
            { name: "Username", input: Input("text", data.username || "", "Username", false) },
            { name: "Presentacion", input: Input("text", data.presentacion || "", "Presentacion", false) },
            { name: "Avatar", input: Input("text", data.avatar_blob || "", "Avatar", false) },
        ];

        const profileHeader = document.getElementById("profile-header");

        // Avatar image with edit button
        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "flex items-center gap-2 mb-4";

        const avatarImage = document.createElement("img");
        avatarImage.src = data.avatar_blob || "";
        avatarImage.alt = "Avatar";
        avatarImage.className = "w-24 h-24 rounded-full";

        const editAvatarButton = document.createElement("button");
        editAvatarButton.textContent = "Edit";
        editAvatarButton.className = "px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600";

        avatarWrapper.appendChild(avatarImage);
        avatarWrapper.appendChild(editAvatarButton);

        if (profileHeader) {
            profileHeader.appendChild(avatarWrapper);
        }

        // Add each field with label to container
        fields.forEach((field) => {
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "flex items-center mb-2";

            const label = document.createElement("label");
            label.textContent = field.name + ": ";
            label.className = "w-24 font-medium text-gray-600";

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(field.input);

            // Add "Edit" button next to "Presentacion" field
            if (field.name === "Presentacion") {
                const editPresentacionButton = document.createElement("button");
                editPresentacionButton.textContent = "Edit";
                editPresentacionButton.className = "ml-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600";
                fieldWrapper.appendChild(editPresentacionButton);
            }

            container.appendChild(fieldWrapper);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
export const ProfileView = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4 p-4 border";

    fetchProfile(container);
    return container;
};