import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


function getUsername(request, reply) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: "Token no proporcionado" })
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

//? Si pasa x tiempo sin que el torneo se inice, se cierra cambiando el status?

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

export async function listOpenTournaments(request, reply) {
    let payload;

    try {
        payload = validateAuthorizationHeader(request);
    } catch (error) {
        return reply.status(401).send({ error: message });
    }
    const db = request.server.db;
    try {
        const query = db.prepare("SELECT * FROM tournaments WHERE status= ?");
        const tournaments = query.all("open");
        reply.status(200).send({ message: "Lista de torneos", tournaments });
    } catch (error) {
        return reply.status(500).send({ error: "Error al mostrar listado de torneos abiertos" });
    }
}

export async function closeTournament(request, reply) {
  
    const db = request.server.db;
    const { tournamentId } = request.body;

    if (!tournamentId) {
        return reply.status(400).send({ error: "ID de torneo no proporcionado" });
    }

    try {
        const query = db.prepare("UPDATE tournaments SET status = 'closed' WHERE id = ?");
        const result = query.run(tournamentId);

        if (result.changes === 0) {
            return reply.status(404).send({ error: "Torneo no encontrado" });
        }

        return reply.status(200).send({ message: "Torneo cerrado correctamente" });
    } catch (error) {
        console.error("Error al cerrar el torneo:", error);
        return reply.status(500).send({ error: "Error al cerrar el torneo" });
    }
}


export async function addPlayerToTournament(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }

    const { tournamentId, display_name } = request.body;
    if (!tournamentId || !display_name) {
        return reply.status(400).send({ error: "Faltan datos" });
    }

    try {
        const insertTransaction = db.transaction(() => {
            const countQuery = db.prepare("SELECT COUNT(*) as count FROM tournament_players WHERE tournament_id = ?");
            const { count } = countQuery.get(tournamentId);

            const totalQuery = db.prepare("SELECT number_players FROM tournaments WHERE id = ?");
            const result = totalQuery.get(tournamentId);

            if (!result) {
                throw new Error("Torneo no encontrado");
            }

            if (count >= result.number_players) {
                throw new Error("El torneo está lleno");
            }

            const insertQuery = db.prepare("INSERT INTO tournament_players (tournament_id, username, display_name) VALUES (?, ?, ?)");
            insertQuery.run(tournamentId, username, display_name);
        });

        insertTransaction();

        return reply.status(200).send({ message: "Jugador añadido al torneo" });
    } catch (error) {
        if (error.message === "El torneo está lleno") {
            return reply.status(409).send({ error: error.message });
        } else if (error.message === "Torneo no encontrado") {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: "Error al añadir jugador al torneo" });
    }
}
