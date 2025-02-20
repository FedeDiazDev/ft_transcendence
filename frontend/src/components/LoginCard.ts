export const LoginCard = () => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-64 min-h-64 mx-auto text-white justify-evenly";

    const names = ["Nickname", "Password",];
    for (let i:number = 0; i < 2; i++){
        const text = document.createElement("h3");
        text.textContent = names[i];
        div.appendChild(text);

        const input = document.createElement("input");
        if (i === 1)
            input.type = "password";
        else
            input.type = "text";
        input.className = "text-black p-2 border rounded focus:outline-none transition";
        div.appendChild(input);
    }
    return div;
}