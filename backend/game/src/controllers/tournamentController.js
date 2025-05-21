import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function validateAuthorizationHeader(request) {
    const authHeader = request.headers['authorization'];    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error("Token no proporcionado");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];     
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);        
        return payload;
    } catch (err) {
        const error = new Error("Token inválido o expirado");
        error.statusCode = 401;
        throw error;
    }
}


export async function createTournament(request, reply) {
    const { name, players } = request.body;
    if (!name || !players) {
        return reply.status(400).send({ error: "Faltan datos" });
    }
    let payload;
    try {
        payload = validateAuthorizationHeader(request);        
    } catch (error) {
        return reply.status(401).send({ error: error.message });
    }
    const db = request.server.db;
    try {

        const query = db.prepare("INSERT INTO tournaments(name, status,number_players, created_at) VALUES(?, ?, ?, ?)");
       const info = query.run(name, "open", players, new Date().toISOString());
        const tournament = {
            id: info.lastInsertRowid,
            name,
            status: "open",
            number_participants: players,
            created_at: new Date().toISOString(),
        };
        return reply.status(200).send({ message: "Juego creado", tournamentState: tournament });
    } catch (error) {
        return reply.status(500).send({ error: "Error al crear el torneo" });
    }
}   