import { GameCanvas } from "../components/game/Canvas.js";
import { fetchUserData } from "../hooks/fetchUserData.js";
import { navigateTo } from "../router.js";

//TODO: checkear si estas en un torneo al darle a jugar torneo.
//TODO: borrar usuario del torneo al salir de la Base de datos
//TODO: Botón para salir

let interval: number | null = null;
export const joinSocket = (username: string, action: string, tournamentId: number, container: any, alias?: string, nb_players?: number) => {
    let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/tournament_logic");
    socket.onopen = function () {
        // console.log("✅ WebSocket conectado");
        interval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: "ping" }));
            }
        }, 30000);
        if (action === "create") {
            socket.send(JSON.stringify({ action: "create_tournament", username: username, number_players: nb_players, tournamentId: tournamentId }))
        } else if (action === "join") {
            fetchUserData((user) => {
                //console.log("ID:", user.id);
                socket.send(JSON.stringify({ action: "join", username: alias, tournamentId: tournamentId, userId: user.id }));

            })
        }
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.action) {
            case "start_match":
                if (!data.tournamentInfo && data.tournamentId && data.round) {
                    data.tournamentInfo = {
                        tournamentId: data.tournamentId,
                        round: data.round,
                    };
                }

                const matchList = data.matches || data.tournamentInfo?.matches || [];

                container.innerHTML = "";
                container.className = "p-4 text-white overflow-auto min-h-screen relative";

                const title = document.createElement("h2");
                title.innerText = `🏆 Torneo - Ronda ${data.round || data.tournamentInfo?.round}`;
                title.className = "text-2xl font-bold mb-6 text-center";
                container.appendChild(title);

                const bracketWrapper = document.createElement("div");
                bracketWrapper.className = "flex flex-col items-center justify-center relative";

                const rounds: Record<number, { player1: string, player2: string, round: number }[]> = {};

                matchList.forEach((match: { player1: string; player2: string; round: number }) => {
                    if (!rounds[match.round]) rounds[match.round] = [];
                    rounds[match.round].push(match);
                });


                const sortedRounds = Object.keys(rounds).map(Number).sort((a, b) => b - a);

                sortedRounds.forEach((roundNumber, roundIndex) => {
                    const roundMatches = rounds[roundNumber];
                    const nextRoundMatches = rounds[sortedRounds[roundIndex + 1]] || [];

                    const nextRoundPlayers = new Set<string>();
                    nextRoundMatches.forEach(nextMatch => {
                        nextRoundPlayers.add(nextMatch.player1);
                        nextRoundPlayers.add(nextMatch.player2);
                    });

                    const roundRow = document.createElement("div");
                    roundRow.className = "flex justify-center items-center gap-32 mb-32 relative";

                    roundMatches.forEach((match) => {
                        const matchCardWrapper = document.createElement("div");
                        matchCardWrapper.className = "relative flex flex-col items-center";

                        const matchCard = document.createElement("div");
                        matchCard.className =
                            "bg-[#1E1E1E] rounded-lg px-4 py-3 w-48 text-center border border-gray-600 shadow-md";

                        const p1 = document.createElement("p");
                        p1.innerText = match.player1;
                        p1.className = "text-sm";
                        if (nextRoundPlayers.has(match.player1)) {
                            p1.className += " text-yellow-400 font-bold";
                        }

                        const vs = document.createElement("p");
                        vs.innerText = "vs";
                        vs.className = "text-gray-400 text-xs";

                        const p2 = document.createElement("p");
                        p2.innerText = match.player2;
                        p2.className = "text-sm";
                        if (nextRoundPlayers.has(match.player2)) {
                            p2.className += " text-yellow-400 font-bold";
                        }

                        matchCard.appendChild(p1);
                        matchCard.appendChild(vs);
                        matchCard.appendChild(p2);
                        matchCardWrapper.appendChild(matchCard);

                        roundRow.appendChild(matchCardWrapper);
                    });

                    bracketWrapper.appendChild(roundRow);

                });
                container.appendChild(bracketWrapper);

                setTimeout(() => {
                    if (data.players.includes(alias)) {
                        container.innerHTML = "";
                        container.className = "flex flex-col items-center justify-center h-screen text-white";

                        const score = document.createElement("p");
                        score.innerText = "0 - 0";
                        score.className = "text-[#C4C4C4]";
                        container.appendChild(score);

                        container.appendChild(GameCanvas(data.gameState, "online", score, data.matchId, data.tournamentInfo, alias));
                    }
                }, 4000);
                break;



            case "tournament_ended":
                container.innerHTML = "";
                const summaryTitle = document.createElement("h2");
                summaryTitle.innerText = `🏆 Ganador del Torneo: ${data.winner}`;
                summaryTitle.className = "text-2xl font-bold mb-4 text-white";
                container.appendChild(summaryTitle);

                setTimeout(() => {
                    navigateTo("/");
                }, 6000);
                break;



            case "update_queue":
                const queueList = document.getElementById("queue-list");
                if (queueList) {
                    queueList.innerHTML = "";

                    const currentCount = data.players.length;
                    const maxCount = data.numberPlayers || "?";

                    const title = document.createElement("h2");
                    title.textContent = `Jugadores en cola (${currentCount}/${maxCount})`;
                    title.className = "text-2xl font-semibold mb-6 text-white";
                    queueList.appendChild(title);

                    const cardContainer = document.createElement("div");
                    cardContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";

                    data.players.forEach((username: string) => {
                        const card = document.createElement("div");
                        card.className = "bg-[#1A1D21] rounded-xl p-4 shadow-md border border-gray-700 flex items-center gap-4 opacity-0 animate-fade-in";

                        const avatar = document.createElement("div");
                        avatar.className = "w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm";
                        avatar.textContent = username.charAt(0).toUpperCase();

                        const name = document.createElement("p");
                        name.textContent = username;
                        name.className = "text-white text-md";

                        card.appendChild(avatar);
                        card.appendChild(name);
                        cardContainer.appendChild(card);
                    });

                    queueList.appendChild(cardContainer);
                }
                break;


            case "tournament_match_finished":
                container.innerHTML = "";
                const waitMsg = document.createElement("p");
                waitMsg.innerText = "Esperando siguiente ronda...";
                container.appendChild(waitMsg);
                break;
            // case "report_winner":
            //     const { winner, round, tournamentId } = data;
            //     console.log("WINNER: ", data);
            //     break;
            // case "tournament_ended":
            //     container.innerHTML = "";
            //     const resultMsg = document.createElement("h2");
            //     resultMsg.innerText = data.message || "¡El torneo ha terminado! Has ganado";
            //     container.appendChild(resultMsg);
            //     socket.close();
            //     setTimeout(() => {
            //         navigateTo("/");
            //     }, 3000);
            //     break;
            // case "waiting_players":
            //     container.innerHTML = "";
            //     const waiting = document.createElement("p");
            //     waiting.innerText = `Jugadores unidos: ${data.joined}/${data.required}`;
            //     container.appendChild(waiting);
            //     break;
            case "pong":
                break;
            case "eliminated_from_tournament":
                navigateTo("/");
                socket.close();
                break;
            case "finished":
                navigateTo("/");
                socket.close();
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

        // console.log(
        //     event.wasClean
        //         ? `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
        //         : "[close] La conexión se cayó en statusSocket"
        // );
    };

    socket.onerror = () => {
        console.error("[error] en WebSocket joinSocket");
    };
    return socket;
}