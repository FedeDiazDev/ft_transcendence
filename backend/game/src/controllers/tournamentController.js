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
        const checkQuery = db.prepare("SELECT id, status FROM tournaments WHERE name = ?");
        const existing = checkQuery.get(name);

        if (existing) {
            return reply.status(409).send({
                message: "El torneo ya existe",
                tournamentId: existing.id,
                status: existing.status,
            });
        }
        const insertQuery = db.prepare("INSERT INTO tournaments(name, status, number_players, created_at) VALUES (?, ?, ?, ?)");
        const info = insertQuery.run(name, "open", players, new Date().toISOString());

        const tournament = {
            id: info.lastInsertRowid,
            name,
            status: "open",
            number_participants: players,
            created_at: new Date().toISOString(),
        };

        return reply.status(200).send({
            message: "Torneo creado",
            tournamentState: tournament,
        });

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


export async function closeTournament(db, tournamentId) {
    if (!tournamentId) {
        throw new Error("ID de torneo no proporcionado");
    }

    try {
        const query = db.prepare("UPDATE tournaments SET status = 'closed' WHERE id = ?");
        const result = query.run(tournamentId);

        if (result.changes === 0) {
            throw new Error("Torneo no encontrado");
        }

        return { message: "Torneo cerrado correctamente" };
    } catch (error) {
        console.error("Error al cerrar el torneo:", error);
        throw new Error("Error al cerrar el torneo");
    }
}


export async function addPlayerToTournament(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    const { tournamentId, alias } = request.body;
    if (!tournamentId || !alias) {
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
            insertQuery.run(tournamentId, username, alias);
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

export async function checkPlayerTournament(request, reply) {
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    const db = request.server.db;
    try {
        const query = db.prepare(`SELECT tp.tournament_id, t.status
		FROM tournament_players tp
		JOIN tournaments t ON tp.tournament_id = t.id
		WHERE tp.username = ? AND t.status IN ('open')
		LIMIT 1`);
        const result = query.get(username);
        console.log("USERNAME:", username);
        console.log("RESULTADO:", result);
        reply.status(200).send({ message: "Checkeo Player", result });

    } catch (error) {
        return reply.status(500).send({ error: "Error al checkear el jugador" });

    }
}


export async function checkNickname(request, reply) {
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Falta el username" });
    }
    const { tournamentId, alias } = request.query;
    if (!tournamentId || !alias) {
        return reply.status(400).send({ error: "Faltan datos en la query" });
    }
    const db = request.server.db;
    try {
        const query = db.prepare(`
            SELECT 1 FROM tournament_players
            WHERE tournament_id = ? AND display_name = ?
            LIMIT 1
        `);
        const result = query.get(tournamentId, alias);
        return reply.status(200).send({
            exists: !!result,
        });
    } catch (error) {
        console.error("Error al verificar alias:", error);
        return reply.status(500).send({ error: "Error al verificar alias" });
    }
}
