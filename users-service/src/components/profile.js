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

// Function to validate PNG signature
async function validatePNGSignature(filePath) {
    try {
        const buffer = await fs.promises.readFile(filePath, { length: 8 });
        const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        return pngSignature.every((byte, i) => buffer[i] === byte);
    } catch (error) {
        console.error("Error validating PNG signature:", error);
        return false;
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

    // if (!response) {
    //     const error = new Error("Usuario no existe");
    //     error.statusCode = 404;
    //     throw error;
    // }
    reply.status(200).send({ message: "User found", user: response });
}

export async function getUserById(request, reply) {
    const id = request.params.id;
    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE id = ?");
    let response;
    try {
        response = query.get(id);
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
            return part.mimetype === 'image/png';
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
        const filePath = avatarFile.filepath || avatarFile.path || 
                (avatarFile[0] && (avatarFile[0].filepath || avatarFile[0].path));
        
        if (!filePath) {
            console.error("File path is undefined!", avatarFile);
            return reply.code(400).send({ message: "Invalid file upload - no file path" });
        }

        // Validate PNG signature
        const isValidPNG = await validatePNGSignature(filePath);
        if (!isValidPNG) {
            // Clean up invalid file
            await fs.promises.unlink(filePath);
            return reply.code(400).send({ message: "Invalid PNG file format" });
        }

        // Read file content as buffer
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
        await fs.promises.unlink(filePath);        
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

export async function getUserByUsername(request, reply) {
    const { username } = request.params;

    const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.code(401).send({ error: "Authorization header missing" });
    }
  
    const token = authHeader.split(" ")[1];
    if (!token) {
    return reply.code(401).send({ error: "Token missing" });
    }
  
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE username = ?");
    let response;

    try {
        response = query.get(username);
    } catch (error) {
        console.error("Error querying the database:", error);
        return reply.status(500).send({
            error: "Error querying the database for username"
        });
    }

    if (!response) {
        console.error("Username not found");
        return reply.status(404).send({
            error: "Username not found in database"
        });
    }

    reply.status(200).send({
        message: "User found", user: response
    });
}