import { getUserData } from "../../api/profile/profileAPI.js";
import { Input } from "./Input.js";


function convertBlobToBase64(data: any, avatarImage: HTMLImageElement) {
    const uint8Array = new Uint8Array(data);
    let binaryString = '';
    uint8Array.forEach(byte => {
        binaryString += String.fromCharCode(byte);
    });
    const base64String = btoa(binaryString);
    // Set as image source with data URL
    avatarImage.src = `data:image/png;base64,${base64String}`;
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
            //{ name: "Avatar", input: Input("text", data.user.avatar_blob || "", "Avatar", false) },
        ];

        const profileHeader = document.getElementById("profile-header");

        // Avatar image with edit button
        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "flex items-center gap-2 mb-4";
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
        editAvatarButton.textContent = "Edit";
        editAvatarButton.className = "px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600";

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
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                        },
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

                // Add click event listener to handle editing
                editPresentacionButton.addEventListener("click", async () => {
                    // Get current value
                    const currentValue = field.input.value;
                    
                    // Remove existing input and edit button
                    fieldWrapper.removeChild(field.input);
                    fieldWrapper.removeChild(editPresentacionButton);
                    
                    // Create textarea for editing
                    const textarea = document.createElement("textarea");
                    textarea.value = currentValue;
                    textarea.className = "p-2 border rounded w-full";
                    textarea.rows = 3;

                    // Create save button
                    const saveButton = document.createElement("button");
                    saveButton.textContent = "Save";
                    saveButton.className = "ml-2 px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600";
                    
                    // Add new elements
                    fieldWrapper.appendChild(textarea);
                    fieldWrapper.appendChild(saveButton);
                    
                    // Focus the textarea
                    textarea.focus();

                    // Add save functionality
                    saveButton.addEventListener("click", async () => {
                        const newValue = textarea.value;
                        
                        try {
                            // Call API to update the presentacion
                            const response = await fetch("https://" + window.location.hostname + ":8080/api/users/updateProfileText", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                                },
                                body: JSON.stringify({
                                    presentacion: newValue
                                })
                            });
                            
                            if (!response.ok) {
                                throw new Error("Failed to update presentacion");
                            }
                            
                            // Replace textarea with updated input
                            fieldWrapper.removeChild(textarea);
                            fieldWrapper.removeChild(saveButton);
                            
                            // Create new input with updated value
                            const updatedInput = Input("text", newValue, "Presentacion", false);
                            field.input = updatedInput; // Update the reference in the fields array
                            
                            // Add back the elements
                            fieldWrapper.appendChild(updatedInput);
                            fieldWrapper.appendChild(editPresentacionButton);
                            
                        } catch (error) {
                            console.error("Failed to update presentacion:", error);
                            alert("Failed to update presentacion. Please try again.");
                        }
                    });
                });

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


