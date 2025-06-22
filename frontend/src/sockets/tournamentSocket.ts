import { GameCanvas } from "../components/game/Canvas.js";
import { fetchUserData } from "../hooks/fetchUserData.js";
import { navigateTo } from "../router.js";

let interval: number | null = null;
export const joinSocket = (username: string, action: string, tournamentId: number, container: any, nb_players?: number) => {
    let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/tournament_logic");
    socket.onopen = function () {
        console.log("✅ WebSocket conectado");
        interval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: "ping" }));
            }
        }, 30000);
        if (action === "create") {
            socket.send(JSON.stringify({ action: "create_tournament", username: username, number_players: nb_players, tournamentId: tournamentId }))
        } else if (action === "join") {
            fetchUserData((user) => {
                console.log("ID:", user.id);
                socket.send(JSON.stringify({ action: "join", username: username, tournamentId: tournamentId, userId: user.id }));

            })
        }
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("DATA: ", data);
        switch (data.action) {
            case "start_match":
                if (!data.tournamentInfo && data.tournamentId && data.round) {
                    data.tournamentInfo = {
                        tournamentId: data.tournamentId,
                        round: data.round,
                    };
                }
                fetchUserData((user) => {
                    if (data.players.includes(user.username)) {
                        container.innerHTML = "";
                        container.className = "flex flex-col items-center justify-center h-screen bg-gray-900 text-white";
                        const score = document.createElement("p");
                        score.innerText = "0 - 0";
                        container.appendChild(score);
                        container.appendChild(GameCanvas(data.gameState, "online", score, data.matchId, data.tournamentInfo));
                    }
                });
                break;
            case "update_queue":
                const queueList = document.getElementById("queue-list");
                if (queueList) {
                    queueList.innerHTML = "";
                    data.players.forEach((username: string) => {
                        const li = document.createElement("li");
                        li.textContent = username;
                        queueList.appendChild(li);
                    });
                }
                break;
            case "tournament_match_finished":
                container.innerHTML = "";
                const waitMsg = document.createElement("p");
                waitMsg.innerText = "Esperando siguiente ronda...";
                container.appendChild(waitMsg);
                break;
            case "report_winner":
                const { winner, round, tournamentId } = data;
                console.log(data);
                break;
            case "tournament_ended":
                container.innerHTML = "";
                const resultMsg = document.createElement("h2");
                resultMsg.innerText = data.message || "¡El torneo ha terminado! Has ganado";
                container.appendChild(resultMsg);
                socket.close();
                break;
            case "waiting_players":
                container.innerHTML = "";
                const waiting = document.createElement("p");
                waiting.innerText = `Jugadores unidos: ${data.joined}/${data.required}`;
                container.appendChild(waiting);
                break;
            case "pong":
                break;
            case "eliminated_from_tournament":
                navigateTo("/");
                socket.close();
                break;
            case "finished":
                navigateTo("/");
                break;
            default:
                console.warn("Acción no reconocida:", data.action);
                break;
        }
    };

    socket.onclose = (event) => {
        if (interval) {
            clearInterval(interval);
        }

        console.log(
            event.wasClean
                ? `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
                : "[close] La conexión se cayó en statusSocket"
        );        
    };

    socket.onerror = () => {
        console.error("[error] en WebSocket joinSocket");
    };
    return socket;
}