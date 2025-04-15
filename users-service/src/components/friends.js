import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

function getUsername(request, reply) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: "Token no proporcionado" })
    }
    const token = authHeader.split(' ')[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return reply.status(401).send({ error: "Token inválido o expirado" });
    }
    const username = payload.username;
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    return username;
}

export async function getFriends(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    try {
        const query = db.prepare(`
            SELECT users.id, users.username
            FROM friends
            JOIN users ON friends.friend_id = users.id
            WHERE friends.user_id = (SELECT id FROM users WHERE username = ?)
        `);
        const friends = query.all(username);
        reply.status(200).send({ message: "Lista de amigos", friends });
    } catch (err) {
        reply.status(500).send({ error: "Error al obtener los amigos" });
    }
}

export async function getUsers(request, reply) {
    const db = request.server.db;
    const query = db.prepare("SELECT username FROM users");
    try {
        const users = query.all();
        reply.status(200).send({ message: "Lista de usuarios", users });
    } catch (err) {
        reply.status(500).send({ error: "Error al obtener los usuarios" });
    }
}

export async function addFriend(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    try {
        const query = db.prepare("INSERT INTO friends (user_id, friend_id) VALUES((SELECT id FROM users WHERE username = ?), ?);");
        query.run(username, request.body.friendId);
        reply.status(200).send({ message: "Friend added" });
    } catch (error) {
        reply.status(500).send({ error: "Error al agregar el amigo." });
    }

}


export async function deleteFiend(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    const { friendId } = request.params;
    if (!friendId) {
        return reply.status(400).send({ error: "Falta el friendId" });
    }
    try {
        const query = db.prepare(`
                DELETE FROM friends 
                WHERE user_id = (SELECT id FROM users WHERE username = ?) 
                AND friend_id = ?;
            `);
        query.run(username, friendId);

        reply.status(200).send({ message: "Amigo eliminado correctamente" });
    } catch (error) {
        reply.status(500).send({ error: "Error al borrar amigo" });
    }
}


export async function searchUsersByName(request, reply) {
    const db = request.server.db;    
    const searchText = request.params.text;
    if (!searchText || searchText.trim() === "") {
        return reply.status(400).send({ error: "Texto de búsqueda vacío" });
    }
    try {
        const query = db.prepare("SELECT id, username FROM users WHERE username LIKE ?");
        const results = query.all(`%${searchText}%`);
        reply.status(200).send({ results })
    } catch (error) {
        reply.status(500).send({ error: "Error en la búsqueda" });
    }

}

