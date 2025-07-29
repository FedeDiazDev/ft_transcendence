import { closeTournament } from "../controllers/tournamentController.js";

function deletePlayerFromTournament(username, tournamentId, db) {
    //console.log("Intentando borrar:", username, tournamentId);
    try {
        const query = db.prepare(`
            DELETE FROM tournament_players 
            WHERE username = ? AND tournament_id = ?
        `);
        const result = query.run(username, tournamentId);
        console.log("Borrado:", result);
    } catch (e) {
        console.error("Error borrando de BDD:", e);
    }
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findTournamentIdBySocket(socket) {
    for (const [tournamentId, tournament] of Object.entries(tournaments)) {
        if (tournament.players.some(p => p.socket === socket)) {
            return tournamentId;
        }
    }
    return null;
}
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const tournaments = new Map();
export const tournamentSockets = new Map();


async function tournamentLogic(fastify, opts) {


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
                        tournamentSockets.set(tournamentId, socket);
                    }
                    return;
                }
                if (data.action === "ping")
                    socket.send(JSON.stringify({ action: 'pong' }));
                if (data.action === "join") {
                    const tournament = tournaments[tournamentId];
                    if (!tournament) return;
                    const existingPlayer = tournament.players.find(p => p.username === data.username);
                    if (existingPlayer) {
                        existingPlayer.socket = socket;
                    } else {
                        tournament.players.push({ username: data.username, socket });
                    }                    // console.log("Torneo:", tournamentId);
                    // console.log("Jugadores actuales:", tournament.players.map(p => p.username));
                    // console.log("Esperados:", tournament.number_players);
                    if (tournament.players.length < tournament.number_players) {
                        tournament.players.forEach(p => {
                            p.socket.send(JSON.stringify({
                                action: "update_queue",
                                players: tournament.players.map(pl => pl.username),
                                tournamentId,
                                numberPlayers: tournament.number_players
                            }));
                        });
                        return;
                    }

                    shuffle(tournament.players);
                    if (tournament.players.length === tournament.number_players) {
                        console.log("Se alcanzó el número de jugadores. Empezando torneo...");
                    }

                    tournament.status = "playing";
                    tournament.matches = [];
                    for (let i = 0; i < tournament.players.length; i += 2) {
                        const player1 = tournament.players[i];
                        const player2 = tournament.players[i + 1];

                        const matchId = `match_${i / 2}_${player1.username}_vs_${player2.username}_${Date.now()}`;
                        console.log(`  Player 1: ${player1?.username || "undefined"}`);
                        console.log(`  Player 2: ${player2?.username || "undefined"}`);
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

                        tournament.matches.push({
                            id: matchId,
                            player1: player1.username,
                            socket1: player1.socket,
                            player2: player2.username,
                            socket2: player2.socket,
                            round: tournament.round,
                            gameState
                        });

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
                    }

                    return;
                }
                if (data.action === "report_winner" || data.action === "tournament_match_finished") {
                    const tournament = tournaments[tournamentId];
                    if (!tournament || tournament.status === "finished") return;

                    const winner = data.winner;
                    const reportedRound = data.round;
                    const match = tournament.matches.find(m =>
                        m.round === reportedRound && (m.player1 === winner || m.player2 === winner));


                    if (!match) return;
                    if (!tournament.winners.includes(winner)) {
                        tournament.winners.push(winner);
                    }
                    const loserUsername = match.player1 === winner ? match.player2 : match.player1;
                    const loserSocket = match.player1 === winner ? match.socket2 : match.socket1;
                    //console.log("LOOOOSER", loserUsername);
                    loserSocket.send(JSON.stringify({
                        action: "eliminated_from_tournament",
                        message: "Has perdido esta ronda del torneo — serás redirigido al menú."
                    }), () => loserSocket.close());
                    tournament.players = tournament.players.filter(p => p.username !== loserUsername);
                    const expectedWinners = tournament.number_players / Math.pow(2, tournament.round);
                    if (tournament.winners.length < expectedWinners) {
                        const winnerSocket = match.player1 === winner ? match.socket1 : match.socket2;
                        winnerSocket.send(JSON.stringify({ action: "tournament_match_finished" }));
                        return;
                    }
                    if (expectedWinners === 1) {
                        tournament.status = "finished";
                        const champion = tournament.winners[0];
                        tournament.organizerSocket?.send(JSON.stringify({
                            action: "tournament_ended",
                            winner: champion,
                            tournamentId
                        }));
                        //console.log("ELL GANADOR DEL TORNEO ES: ", champion);
                        tournament.players.forEach(p => {
                            p.socket.send(JSON.stringify({
                                action: "tournament_ended",
                                winner: champion,
                                tournamentId
                            }));
                            p.socket.close();
                        });
                        closeTournament(fastify.db, tournamentId);
                        return;
                    }
                    tournament.round += 1;
                    tournament.players = tournament.players.filter(p =>
                        tournament.winners.includes(p.username)
                    );
                    tournament.winners = [];
                    shuffle(tournament.players);
                    tournament.matches = [];
                    for (let i = 0; i < tournament.players.length; i += 2) {
                        const player1 = tournament.players[i];
                        const player2 = tournament.players[i + 1];

                        const matchId = `match_${i / 2}_${player1.username}_vs_${player2.username}_${Date.now()}`;

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

                        tournament.matches.push({
                            id: matchId,
                            player1: player1.username,
                            socket1: player1.socket,
                            player2: player2.username,
                            socket2: player2.socket,
                            round: tournament.round,
                            gameState
                        });

                        const basePayload = {
                            action: "start_match",
                            matchId,
                            players: [player1.username, player2.username],
                            gameState,
                            tournamentInfo: {
                                tournamentId,
                                round: tournament.round
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
                    }
                }
            });
            socket.on('close', () => {
                const tournamentId = findTournamentIdBySocket(socket);

                if (!tournamentId || !tournaments[tournamentId]) return;

                const tournament = tournaments[tournamentId];
                const player = tournament.players.find(p => p.socket === socket);

                if (!player) return;

                try {
                    deletePlayerFromTournament(player.username, tournamentId, fastify.db);
                } catch (err) {
                    console.error("Error al eliminar jugador de BDD:", err);
                }

                tournament.players = tournament.players.filter(p => p.socket !== socket);
                tournament.players.forEach(p => {
                    p.socket.send(JSON.stringify({
                        action: "update_queue",
                        players: tournament.players.map(pl => pl.username),
                        tournamentId
                    }));
                });
            });


        });
    });
}

export default tournamentLogic;

