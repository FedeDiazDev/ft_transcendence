function hashPassword(password){
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

	return{
		salt: salt,
		hash: hash
	}
}

export default async function registerInDB(request, reply){
	const db = request.server.db;

	const passStruct = hashPassword(request.body.password);

	const query = db.prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)");
	query.run(request.body.username, request.body.email, passStruct.hash, passStruct.salt);
}