function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function pairPlayers(players) {
    let matches = [];
    for (let i = 0; i < players.length; i += 2) {
        matches.push([players[i], players[i + 1]]);
    }
    return matches;
}

async function tournamentLogic(fastify, opts) {
    const tournaments = {};
    fastify.register(async function (fastify) {
        fastify.get('/api/game/tournament_logic', { websocket: true }, (socket, req) => {
            socket.on('message', message => {
                const data = JSON.parse(message);
                const tournamentId = data.tournamentId;
                if (data.action === "create_tournament") {
                    if (!tournaments[tournamentId]) {
                        tournaments[tournamentId] = {
                            number_players: data.number_players,
                            players: [],
                            matches: []
                        };
                    }
                    console.log("TORNEOS", tournaments);
                }
                else if (data.action === "join") {
                    console.warn("JOOOIN");
                    if (!tournaments[tournamentId]) {
                        console.error("No se ha encontrado dicho torneo");
                        return;
                    }
                    const tournament = tournaments[tournamentId];
                    tournament.players.push({ username: data.username, tournamentId: data.tournamentId, socket });
                    if (tournament.players.length < tournament.number_players) {
                        console.log(`Jugadores: ${tournament.players.length}/${tournament.number_players}`)
                        return;
                    }
                    console.log("Empezando emparejamientos...");
                    shuffle(tournament.players);
                    //console.log(players);
                    tournament.matches = pairPlayers(tournament.players);
                    console.log("TORNEOS", tournaments);
                    tournament.matches.forEach((pair, index) => {
                        const gameState = {
                            roomId: matchId,
                            player1: player1.username,
                            player2: player2.username,
                            ball: { x: 0, y: 0, speedX: 1, speedY: 1 },
                            score: { [player1.username]: 0, [player2.username]: 0 }
                        };
                        const matchId = `match_${index}_${Date.now()}`;
                        const [player1, player2] = pair;
                        player1.socket.send(JSON.stringify({
                            action: "start_match",
                            matchId,
                            opponent: player2.username,
                            gameState
                        }));
                        player2.socket.send(JSON.stringify({
                            action: "start_match",
                            matchId,
                            opponent: player1.username,
                            gameState
                        }));
                    });
                }
            })
        })
    })
}

export default tournamentLogic;