async function tournamentLogic(fastify, opts) {
    fastify.register(async function (fastify) {
        fastify.get('/api/game/tournament_logic', { websocket: true }, (socket, req) => {
            let number_players;
            
            socket.on('message', message => {
                const data = JSON.parse(message);
                if (data.action === "create_tournament") {
                    number_players = data.players;
                }
            })
        })
    })
}