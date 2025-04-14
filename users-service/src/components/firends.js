import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

//TODO: verificar jwt
export async function getFriends(request, reply) {
    const db = request.server.db;
    const userId = request.query.userId;
    if (!userId) {
        return reply.status(400).send({ error: "Falta el userId" });
    }
    try {
        const query = db.prepare(`
            SELECT users.id, users.username
            FROM friends
            JOIN users ON friends.friend_id = users.id
            WHERE friends.user_id = ?
        `);
        const friends = query.all(userId);
        reply.status(200).send({ message: "Lista de amigos", friends });
    } catch (err) {
        reply.status(500).send({ error: "Error al obtener los amigos" });
    }
}


export async function addFriend(request, reply) { }


export async function deleteFiend(request, friend) { }

