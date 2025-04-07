import { Input } from "./Input.js"

async function fetchProfile(container : HTMLDivElement){
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.log("No token found in localStorage");
        return;
    }
    const payload = token.split('.')[1];//Split a string into substrings using the specified separator and return them as an array. JWTs consist of three parts separated by dots: header, payload, and signature. 
    const decodedPayload = atob(payload);//payload is decoded from Base64 format
    const jsonPayload = JSON.parse(decodedPayload);//decodedPayload is a string generated from a previous json when token was created. Now is rebuilt into a json object
    try{
        const response = await fetch("http://localhost:4000/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({ user: jsonPayload.username })
        })

        const data = await response.json(); 
        const textInput = Input("text", data.username || "", "Username", false);
        const idInput = Input("number", data.id || "", "id", false);
        
        container.appendChild(textInput);
        container.appendChild(idInput);
    }
    catch(error){
        console.error("Fetch error:", error);
    }
}

export const ProfileView = () => {
    const container = document.createElement("div");
    container.className = "flex flex-col gap-4 p-4 border";
    
    fetchProfile(container);
    return container;
};