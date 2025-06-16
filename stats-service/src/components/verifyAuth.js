import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function validateAuthorizationHeader(request) {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.user = payload; // attach user payload to request
    } catch (err) {
      return reply.code(401).send({ error: "Token inválido o expirado" });
    }
};