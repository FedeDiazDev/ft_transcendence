import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function validateAuthorizationHeader(request) {
  const authHeader = request.headers['authorization'];

  console.log("Logging auth header: ")
  console.log(request.headers['authorization']);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Token no proporcionado");
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload;
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}
