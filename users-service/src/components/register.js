import fs from 'fs';

export default function postRegister(request, reply){
	const db = request.server.db;

	// Read the avatar file as a binary blob
	const avatarBlob = fs.readFileSync("/data/pics/defaultAvatar.png");

	const query = db.prepare("INSERT INTO users (username, avatar_blob, presentacion) VALUES (?, ?, ?)");
	query.run(request.body.username,  avatarBlob, "Hola soy un nuevo usuario");
	reply.status(200).send({message : "User created in database"});
}
