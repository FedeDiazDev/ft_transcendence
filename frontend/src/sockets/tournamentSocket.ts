import { GameCanvas } from "../components/game/Canvas.js";
import { fetchUserData } from "../hooks/fetchUserData.js";

export const joinSocket = (username: string, action: string, tournamentId: number, container: any, nb_players?: number) => {
    let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/tournament_logic");
    socket.onopen = function () {
        if (action === "create") {
            socket.send(JSON.stringify({ action: "create_tournament", username: username, number_players: nb_players, tournamentId: tournamentId }))
        } else if (action === "join") {
            socket.send(JSON.stringify({ action: "join", username: username, tournamentId: tournamentId }))
        }
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("DATA: ", event.data);
        if (data.action === "start_match") {
            console.log("Tu ponente será: ", data.opponent);
            console.log("DATOOOOOS-> ", data);
            fetchUserData((user) => {
                const currentUser = user.username;

                if (data.players.includes(currentUser)) {
                    console.log("Empieza el partido entre tú y:", data.opponent);

                    container.innerHTML = "";
                    container.className = "flex flex-col items-center justify-center h-screen bg-gray-900 text-white";

                    const score = document.createElement("p");
                    score.innerText = "0 - 0";
                    container.appendChild(score);
                    container.appendChild(GameCanvas(data.gameState, "online", score));
                } else {
                    console.log("Este match no es para mí, lo ignoro");
                }
            });
        }
    }

    socket.onerror = () => {
        console.error("[error] en WebSocket joinSocket");
    };
    return socket;
}