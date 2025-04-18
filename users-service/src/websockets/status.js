let queue = [];

export async function friendsStatus(fastify, opts) {
    fastify.register(async function (fastify) {
        fastify.get('/api/users/onlineStatus', { websocket: true }, (socket, req) => {
            socket.on('message', message => {
                const data = JSON.parse(message);
                const { action, id: playerId, name: playerName } = data;

                if (action === 'login') {
                    if (!queue.some(player => player.id === playerId)) {
                        queue.push({ id: playerId, name: playerName, socket });
                    }
                }
                if (action === 'getOnlineUsers') {
                    const onlineUsers = queue.map(({ id, name }) => ({ id, name }));
                    socket.send(JSON.stringify({ action: 'onlineUsers', users: onlineUsers }));
                }
            });
            socket.on('close', () => {
                queue = queue.filter(player => player.id !== playerId);
            });
        });
    });
}