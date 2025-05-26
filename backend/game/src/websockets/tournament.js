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
    fastify.register(async function (fastify) {
        fastify.get('/api/game/tournament_logic', { websocket: true }, (socket, req) => {
            let number_players;
            let players_waiting = [];
            let matches = [];
            socket.on('message', message => {
                const data = JSON.parse(message);
                if (data.action === "create_tournament") {
                    number_players = data.players;
                }
                else if (data.action === "join_player") {
                    players_waiting.push({ username: data.username, tournamentId: data.tournamentId, socket });
                    if (players_waiting.length < number_players) {
                        console.log(`${number_players - players_waiting.length}/${number_players}`)
                    }
                    console.log("Empezando emparejamientos...");
                    shuffle(players_waiting);
                    //console.log(players_waiting);
                    matches = pairPlayers(players_waiting);
                    matches.forEach((pair, index) => {
                        const matchId = `match_${index}_${Date.now()}`;
                        const [player1, player2] = pair;
                                            
                        const data = JSON.stringify({
                            action: "start_match",
                            matchId,
                            opponent: player2.username
                        });
                        player1.socket.send(data);
                    
                        player2.socket.send(JSON.stringify({
                            action: "start_match",
                            matchId,
                            opponent: player1.username
                        }));
                    
                        // Aquí puedes guardar la partida en memoria o en una estructura
                        // activeMatches[matchId] = {
                        //     players: [player1, player2],
                        // };
                    });
                    

                }
            })
        })
    })
}