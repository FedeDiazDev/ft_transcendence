import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 

export async function postProfile(request, reply) {

    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE username = ?")
    const response = query.get(request.body.user);
    if (response === undefined) {
        const error = new Error("User does not exist");
        error.statusCode = 400;
        throw error;
    }
    //
    reply.status(200).send({
        username: response.username,
        id: response.id
    });
}


export async function getUser(request, reply) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error("Token no proporcionado");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    console.log("TOKEN", token);
    let payload;
    try {        
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return reply.status(401).send({ error: "Token inválido o expirado" });
    }
    console.log("PAYLOADDD", payload);
    const username = payload.username;

    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE username = ?");
    let response;
    try {
        response = query.get(username);
    } catch (error) {
        const dbError = new Error("Error al consultar la base de datos");
        dbError.statusCode = 500;
        throw dbError;
    }

    if (!response) {
        const error = new Error("Usuario no existe");
        error.statusCode = 400;
        throw error;
    }
    reply.status(200).send({ message: "Usuario encontrado", user: response });
}
