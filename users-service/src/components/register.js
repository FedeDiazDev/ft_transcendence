export default function postRegister(request, reply){
	const db = request.server.db;

	const query = db.prepare("INSERT INTO users (username) VALUES (?)");
	query.run(request.body.username);
	reply.status(200).send({message : "User created in database"});
}
