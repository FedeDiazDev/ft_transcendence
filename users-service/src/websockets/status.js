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
                //console.log("ACtION", action);
                if (action === 'getOnlineUsers') {
                    //console.log("USEEEEEERE ONLINE");
                    //console.log("QUEUE: ", queue);
                    const onlineUsers = queue.map(({ id, username }) => ({ id, username }));
                    //console.log("ACTION: ", onlineUsers);
                    socket.send(JSON.stringify({ action: 'onlineUsers', users: onlineUsers }));
                }
                if (action === "ping")
                    socket.send(JSON.stringify({ action: 'pong'}));

            });            
            socket.on('close', () => {
                console.log("WebSocket cerrado");
                queue = queue.filter(player => player.id !== playerId);
                const onlineUsers = queue.map(({ id, username }) => ({ id, username }));
                console.log("CLOSE: ", onlineUsers);
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
