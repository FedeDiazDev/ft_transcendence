export const SignupCard = () => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 p-6 bg-gray-800 shadow-xl rounded-lg w-64 min-h-80 mx-auto text-white justify-evenly";

    const names = ["Nickname", "Email", "Password", "Confirm password"];
    for (let i:number = 0; i < 4; i++){
        const text = document.createElement("h3");
        text.textContent = names[i];
        div.appendChild(text);

        const input = document.createElement("input");
        if (i === 1)
            input.type = "email";
        else if (i === 2 || i === 3)
            input.type = "password";
        else
            input.type = "text";
        input.className = "text-black p-2 border rounded focus:outline-none transition";
        div.appendChild(input);
    }
    const button = document.createElement("button");
    button.textContent = "Sign Up";
    button.className = "w-full py-2 border border-white rounded-lg active:bg-gray-700 mt-2";

    const user = {
        nickname: "fmoran-m",
        password: "1234",
        email: "fmoran-m"
    }

    button.addEventListener("click", async () => {
        const response = await fetch("http://localhost:3000/signup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const responseText = await response.text();
        console.log(responseText);
    });
    div.appendChild(button);
    return div;
}