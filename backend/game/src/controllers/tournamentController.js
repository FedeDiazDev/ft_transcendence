import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


function getUsername(request, reply) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: "No token" })
    }
    const token = authHeader.split(' ')[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return reply.status(401).send({ error: "Invalid or expired token" });
    }
    const username = payload.username;
    if (!username) {
        return reply.status(400).send({ error: "Username missing" });
    }
    return username;
}

function validateAuthorizationHeader(request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error("No token");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return payload;
    } catch (err) {
        const error = new Error("Invalid or expired token");
        error.statusCode = 401;
        throw error;
    }
}


export async function createTournament(request, reply) {
    const { name, players } = request.body;
    if (!name || !players) {
        return reply.status(400).send({ error: "Missing data" });
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
                message: "Tournament already exists",
                tournamentId: existing.id,
                status: existing.status,
            });
        }

        const countOpenQuery = db.prepare("SELECT COUNT(*) as count FROM tournaments WHERE status = 'open'");
        const { count } = countOpenQuery.get();
        if (count >= 5) {
            return reply.status(400).send({
                error: "Not more than 5 tournaments at a time allowed. Wait for one to finish!",
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
            message: "Created tournament",
            tournamentState: tournament,
        });

    } catch (error) {
        return reply.status(400).send({ error: "Error creating tournament" });
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
        reply.status(200).send({ message: "Tournament list", tournaments });
    } catch (error) {
        return reply.status(400).send({ error: "Error listing open tournaments" });
    }
}


export async function closeTournament(db, tournamentId) {
    if (!tournamentId) {
        throw new Error("Tournament id not given");
    }

    try {
        const query = db.prepare("UPDATE tournaments SET status = 'closed' WHERE id = ?");
        const result = query.run(tournamentId);

        if (result.changes === 0) {
            throw new Error("Tournament not found");
        }

        return { message: "Tournament correctly closed" };
    } catch (error) {
        //console.error("Error al cerrar el torneo:", error);
        throw new Error("Error closing the tournament");
    }
}


export async function addPlayerToTournament(request, reply) {
    const db = request.server.db;
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Missing username" });
    }
    const { tournamentId, alias } = request.body;
    if (!tournamentId || !alias) {
        return reply.status(400).send({ error: "Missing data" });
    }

    try {
        const insertTransaction = db.transaction(() => {
            const countQuery = db.prepare("SELECT COUNT(*) as count FROM tournament_players WHERE tournament_id = ?");
            const { count } = countQuery.get(tournamentId);

            const totalQuery = db.prepare("SELECT number_players FROM tournaments WHERE id = ?");
            const result = totalQuery.get(tournamentId);

            if (!result) {
                throw new Error("Tournament not found");
            }

            if (count >= result.number_players) {
                throw new Error("Tournament is full");
            }

            const insertQuery = db.prepare("INSERT INTO tournament_players (tournament_id, username, display_name) VALUES (?, ?, ?)");
            insertQuery.run(tournamentId, username, alias);

            const saveAliasToStats = async () => {
                try {
                    const response = await fetch('http://stats-service:3000/api/stats/alias', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            alias: alias,
                            real_username: username,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to save alias: ${response.statusText}`);
                    }

                    //console.log("Alias saved successfully to stats service");
                } catch (error) {
                    //console.error("Error calling saveAlias endpoint:", error);
                }
            }

            saveAliasToStats();
        });

        insertTransaction();

        return reply.status(200).send({ message: "Player added to tournament" });
    } catch (error) {
        if (error.message === "Tournament is full") {
            return reply.status(409).send({ error: error.message });
        } else if (error.message === "Tournament not found") {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(400).send({ error: "Error adding tournament" });
    }
}

export async function checkPlayerTournament(request, reply) {
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Username missing" });
    }
    const db = request.server.db;
    try {
        const query = db.prepare(`SELECT tp.tournament_id, t.status
		FROM tournament_players tp
		JOIN tournaments t ON tp.tournament_id = t.id
		WHERE tp.username = ? AND t.status IN ('open')
		LIMIT 1`);
        const result = query.get(username);
        reply.status(200).send({ message: "Player checked", result });

    } catch (error) {
        return reply.status(400).send({ error: "Error checking player" });

    }
}

export async function checkNickname(request, reply) {
    const username = getUsername(request, reply);
    if (!username) {
        return reply.status(400).send({ error: "Username missing" });
    }
    const { tournamentId, alias } = request.query;
    if (!tournamentId || !alias) {
        return reply.status(400).send({ error: "Missing query data" });
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
        //console.error("Error al verificar alias:", error);
        return reply.status(400).send({ error: "Error verifying alias" });
    }
}
