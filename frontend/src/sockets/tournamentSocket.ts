export const joinSocket = (username: string, action: string, tournamentId: number, nb_players?: number) => {
    let socket = new WebSocket("wss://" + window.location.hostname + ":8080/api/game/tournament_logic");
    socket.onopen = function () {
        if (action === "create") {
            socket.send(JSON.stringify({ action: "create_tournament", username: username, number_players: nb_players, tournamentId: tournamentId }))
            socket.send(JSON.stringify({ action: "join", username: username, tournamentId: tournamentId }))
        } else if (action === "join") {
            console.log("JOOOOOOOOOOOOOOOOOIN");
            socket.send(JSON.stringify({ action: "join", username: username, tournamentId: tournamentId }))
        }
    };

    socket.onerror = () => {
        console.error("[error] en WebSocket joinSocket");
    };
    return socket;
}