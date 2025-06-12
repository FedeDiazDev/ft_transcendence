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
                            matches: [],
                            round: 1,
                            winners: [],
                            status: "waiting",
                            organizerSocket: socket
                        };

                    }
                    return;
                }

                if (data.action === "join") {
                    const tournament = tournaments[tournamentId];
                    if (!tournament) return;

                    tournament.players.push({ username: data.username, socket });
                    if (tournament.players.length < tournament.number_players) return;

                    shuffle(tournament.players);
                    tournament.matches = pairPlayers(tournament.players);
                    tournament.status = "playing";

                    tournament.matches.forEach((pair, index) => {
                        const [player1, player2] = pair;
                        const matchId = `match_${index}_${player1.username}_vs_${player2.username}_${Date.now()}`;

                        const gameState = {
                            roomId: matchId,
                            status: "playing",
                            ball: { x: 600, y: 300 },
                            paddles: {
                                left: { player: "left", x: 0, y: 225, width: 15, height: 150, speed: 15 },
                                right: { player: "right", x: 1185, y: 225, width: 15, height: 150, speed: 15 }
                            },
                            points: 0,
                            leftPoints: 0,
                            rightPoints: 0
                        };

                        const payload = {
                            action: "start_match",
                            matchId,
                            round: 1,
                            tournamentId,
                            players: [player1.username, player2.username],
                            gameState
                        };

                        player1.socket.send(JSON.stringify({ ...payload, opponent: player2.username }));
                        player2.socket.send(JSON.stringify({ ...payload, opponent: player1.username }));
                    });
                    return;
                }

                if (data.action === "report_winner" || data.action === "tournament_match_finished") {
                    console.log("                                                      ")
                    console.log("ENTRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                    console.log("                                                      ")
                    const tournament = tournaments[tournamentId];
                    if (!tournament || tournament.status === "finished") return;

                    const round = data.round;
                    const winner = data.winner;

                    if (round !== tournament.round) {
                        console.warn(`Ganador de ronda antigua ignorado`);
                        return;
                    }

                    tournament.winners.push(winner);
                    const expectedWinners = tournament.number_players / Math.pow(2, tournament.round);

                    if (tournament.winners.length === expectedWinners) {
                        if (expectedWinners === 1) {
                            tournament.status = "finished";
                            const champion = tournament.winners[0];
                            tournament.players.forEach(p => {
                                p.socket.send(JSON.stringify({
                                    action: "tournament_winner",
                                    winner: champion,
                                    tournamentId
                                }));
                            });
                            tournament.organizerSocket?.send(JSON.stringify({
                                action: "tournament_ended",
                                message: `¡Ganador del torneo: ${champion}!`,
                                tournamentId
                            }));
                            return;
                        }

                        tournament.round += 1;
                        tournament.players = tournament.players.filter(p =>
                            tournament.winners.includes(p.username)
                        );
                        tournament.winners = [];
                        shuffle(tournament.players);
                        tournament.matches = pairPlayers(tournament.players);

                        tournament.matches.forEach((pair, index) => {
                            const [player1, player2] = pair;
                            const matchId = `match_${index}_${player1.username}_vs_${player2.username}_${Date.now()}`;

                            const gameState = {
                                roomId: matchId,
                                status: "playing",
                                ball: { x: 600, y: 300 },
                                paddles: {
                                    left: { player: "left", x: 0, y: 225, width: 15, height: 150, speed: 15 },
                                    right: { player: "right", x: 1185, y: 225, width: 15, height: 150, speed: 15 }
                                },
                                points: 0,
                                leftPoints: 0,
                                rightPoints: 0
                            };

                            const basePayload = {
                                action: "start_match",
                                matchId,
                                players: [player1.username, player2.username],
                                gameState,
                                tournamentInfo: {
                                    tournamentId,
                                    round: tournament.round,
                                }
                            };

                            player1.socket.send(JSON.stringify({
                                ...basePayload,
                                opponent: player2.username
                            }));

                            player2.socket.send(JSON.stringify({
                                ...basePayload,
                                opponent: player1.username
                            }));

                        });
                    }
                }
            });
        });
    });
}

export default tournamentLogic;
