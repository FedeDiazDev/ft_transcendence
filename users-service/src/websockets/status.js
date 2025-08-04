let queue = [];

export async function friendsStatus(fastify, opts) {
    fastify.register(async function (fastify) {
        fastify.get('/api/users/onlineStatus', { websocket: true }, (socket, req) => {
            let playerId = null;
            let playerName = null;

            socket.on('message', message => {
                const data = JSON.parse(message);
                const { action, id, username } = data;

                if (action === 'login') {
                    playerId = id;
                    playerName = username;
                    if (!queue.some(player => player.id === playerId)) {
                        queue.push({ id: playerId, username: playerName, socket });
                        const onlineUsers = queue.map(({ id, username }) => ({ id, username }));
                        console.log("LOGIN: ", onlineUsers);
                        queue.forEach(player => {
                            player.socket.send(JSON.stringify({
                                action: 'onlineUsers',
                                users: onlineUsers,
                            }));
                        });
                    }
                }
                if (action === 'getOnlineUsers') {
                    const onlineUsers = queue.map(({ id, username }) => ({ id, username }));
                    socket.send(JSON.stringify({ action: 'onlineUsers', users: onlineUsers }));
                }
                if (action === "ping")
                    socket.send(JSON.stringify({ action: 'pong'}));

            });            
            socket.on('close', () => {
                queue = queue.filter(player => player.id !== playerId);
                const onlineUsers = queue.map(({ id, username }) => ({ id, username }));
                queue.forEach(player => {
                    player.socket.send(JSON.stringify({
                        action: 'onlineUsers',
                        users: onlineUsers,
                    }));
                });
            });
        });
    });
}
