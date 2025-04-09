export async function postProfile(request, reply) {

    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE username = ?")

    const response = query.get(request.body.username);
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
    console.log("HEADEEEEEEEEEEER", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error("Token no proporcionado");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split('.')[1];
    console.log("Token recibido:", token); // Log para verificar el token recibido
    const decodedPayload = atob(token);
    console.log("DecodedPayload", decodedPayload);
    const jsonPayload = JSON.parse(decodedPayload);
    console.log("Payload decodificado:", jsonPayload); // Log para verificar el payload decodificado

    if (!jsonPayload || !jsonPayload.username) {
        const error = new Error("Token no válido o sin username");
        error.statusCode = 401;
        throw error;
    }

    const username = jsonPayload.username;
    console.log("Username extraído:", username); // Log para verificar el username extraído

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
