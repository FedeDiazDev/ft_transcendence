import crypto from "crypto";

function hashPassword(password){
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

	console.log("Hashed Password");

	return{
		salt: salt,
		hash: hash
	}
}

export default function postSignup(request, reply){
	if (request.body.password != request.body.confirmPassword)
		throw new Error("Password does not match");
	else{
		const passStruct = hashPassword(request.body.password);
		const db = request.server.db;

		const query = db.prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)");
		query.run(request.body.username, request.body.email, passStruct.hash, passStruct.salt);
		reply.status(200).send({message : "Registration complete"});
	}
}
