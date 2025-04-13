export default function postProfile(request, reply){

    const db = request.server.db;
    const query = db.prepare("SELECT * FROM users WHERE username = ?")

    const response = query.get(request.body.user);
    if (response === undefined){
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