import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from 'node:fs';
import { formidable } from 'formidable';

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

export async function getUser(request, reply) {
    let payload;
    try {
        payload = validateAuthorizationHeader(request);
    } catch (error) {
        return reply.status(error.statusCode || 401).send({ error: error.message });
    }
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

export async function updateProfileText(request, reply) {
    let payload;
    try {
        payload = validateAuthorizationHeader(request);
    } catch (error) {
        return reply.status(error.statusCode || 401).send({ error: error.message });
    }
    const username = payload.username;
    const db = request.server.db;
    const query = db.prepare("UPDATE users SET presentacion = ? WHERE username = ?");
    let response;
    try {
        response = query.run(request.body.presentacion, username);
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
    reply.status(200).send({ message: "Texto de perfil actualizado" });
}

export async function updateAvatar(request, reply) {
    let payload;
    try {
        payload = validateAuthorizationHeader(request);
    } catch (error) {
        return reply.status(error.statusCode || 401).send({ error: error.message });
    }
    const username = payload.username;
    
    // Configure formidable
    const form = formidable({
        keepExtensions: true,
        multiples: false,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowEmptyFiles: false,
        uploadDir: '/tmp', // Use a directory that's definitely writable
        filter: function(part) {
            console.log("Received part:", part.name, part.mimetype);
            return true;
        }
    });
    
    try {
        // Parse raw request with proper promise handling
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(request.raw, (err, fields, files) => {
                if (err) {
                    console.error("Parse error:", err);
                    return reject(err);
                }
                //console.log("Parsed fields:", fields);
                //console.log("Parsed files:", files ? Object.keys(files) : "none");
                resolve([fields, files]);
            });
        });
        
        //console.log("Files received:", files);
        //console.log("Request type:", request.raw.constructor.name);
        
        // Check if avatar file was uploaded (with better error handling)
        if (!files || !files.avatar) {
            console.error("No avatar file found in:", files);
            return reply.code(400).send({ message: 'No avatar file received' });
        }
        
        // Formidable v3 sometimes returns an array even with multiples:false
        const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;        
        // Read file content as buffer
        const filePath = avatarFile.filepath || avatarFile.path || 
                (avatarFile[0] && (avatarFile[0].filepath || avatarFile[0].path));
        if (!filePath) {
            console.error("File path is undefined!", avatarFile);
            return reply.code(400).send({ message: "Invalid file upload - no file path" });
        }
        const buffer = await fs.promises.readFile(filePath);
        
        // Update database with the avatar
        const db = request.server.db;
        const query = db.prepare("UPDATE users SET avatar_blob = ? WHERE username = ?");
        let response;
        try {
            response = query.run(buffer, username);
        } catch (error) {
            console.error("Database error:", error);
            return reply.code(500).send({ message: "Database error" });
        }
        
        // Clean up temp file
        await fs.promises.unlink(avatarFile.filepath);        
        if (!response || response.changes === 0) {
            return reply.code(404).send({ message: "User not found" });
        }        
        return reply.code(200).send({ message: "Avatar updated successfully" });
        
    } catch (error) {
        console.error("File upload error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return reply.code(500).send({ 
            message: 'Error processing file upload', 
            error: error.message  // Add the actual error message
        });
    }
}