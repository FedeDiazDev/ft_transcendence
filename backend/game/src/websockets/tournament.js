import { closeTournament } from "../controllers/tournamentController.js";

function deletePlayerFromTournament(username, tournamentId, db) {
    try {
        const query = db.prepare(`
            DELETE FROM tournament_players 
            WHERE username = ? AND tournament_id = ?
        `);
        query.run(username, tournamentId);
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
                            matchHistory: [],
                            status: "waiting",
                            organizerSocket: socket
                        };
                        tournamentSockets.set(tournamentId, socket);
                    }
                    return;
                }

                if (data.action === "ping") {
                    socket.send(JSON.stringify({ action: 'pong' }));
                    return;
                }

                if (data.action === "join") {
                    const tournament = tournaments[tournamentId];
                    if (!tournament) return;

                    const existingPlayer = tournament.players.find(p => p.username === data.username);
                    if (existingPlayer) {
                        existingPlayer.socket = socket;
                    } else {
                        tournament.players.push({ username: data.username, socket });
                    }

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

                    // COMIENZA EL TORNEO
                    shuffle(tournament.players);
                    tournament.status = "playing";

                    tournament.matchHistory.push(...tournament.matches);
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

                        const match = {
                            id: matchId,
                            player1: player1.username,
                            socket1: player1.socket,
                            player2: player2.username,
                            socket2: player2.socket,
                            round: tournament.round,
                            gameState
                        };
                        tournament.matches.push(match);
                    }

                    const fullMatchHistory = [...tournament.matchHistory, ...tournament.matches].map(match => ({
                        id: match.id,
                        player1: match.player1,
                        player2: match.player2,
                        round: match.round
                    }));

                    for (const match of tournament.matches) {
                        const payload = {
                            action: "start_match",
                            matchId: match.id,
                            round: match.round,
                            tournamentId,
                            players: [match.player1, match.player2],
                            gameState: match.gameState,
                            matches: fullMatchHistory
                        };

                        match.socket1.send(JSON.stringify({ ...payload, opponent: match.player2 }));
                        match.socket2.send(JSON.stringify({ ...payload, opponent: match.player1 }));
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
                        tournament.winners.includes(p.username));
                    tournament.winners = [];

                    shuffle(tournament.players);
                    tournament.matchHistory.push(...tournament.matches);
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

                        const match = {
                            id: matchId,
                            player1: player1.username,
                            socket1: player1.socket,
                            player2: player2.username,
                            socket2: player2.socket,
                            round: tournament.round,
                            gameState
                        };
                        tournament.matches.push(match);
                    }

                    const fullMatchHistory = [...tournament.matchHistory, ...tournament.matches].map(match => ({
                        id: match.id,
                        player1: match.player1,
                        player2: match.player2,
                        round: match.round
                    }));

                    for (const match of tournament.matches) {
                        const payload = {
                            action: "start_match",
                            matchId: match.id,
                            players: [match.player1, match.player2],
                            gameState: match.gameState,
                            tournamentInfo: {
                                tournamentId,
                                round: tournament.round,
                                matches: fullMatchHistory
                            }
                        };

                        match.socket1.send(JSON.stringify({ ...payload, opponent: match.player2 }));
                        match.socket2.send(JSON.stringify({ ...payload, opponent: match.player1 }));
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
