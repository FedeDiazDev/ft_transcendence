import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

//TODO: verificar jwt
export async function getFriends(request, reply) {
    const db = request.server.db;
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
    console.log("PAYYYLOAD", payload);
    const username = payload.username;
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


export async function addFriend(request, reply) { }


export async function deleteFiend(request, friend) { }


export async function searchFriendByName(request, friend) { }