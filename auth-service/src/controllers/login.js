import crypto from "crypto";
import createWebToken from "./jwt.js";

function checkHashPassword(password, salt){
	const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
	return hashedPassword;
}

export default function postLogin(request, reply){

	const db = request.server.db;
	const query = db.prepare("SELECT * FROM users WHERE email = ? OR username = ?")
	const response = query.get(request.body.user, request.body.user);
	if (response === undefined){
		const error = new Error("User does not exist");
		error.statusCode = 400;
		throw error;
	}

	const hashedPassword = checkHashPassword(request.body.password, response.salt);
	if (!crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(response.password, 'hex'))){
		const error = new Error("Incorrect password");
		error.statusCode = 400;
		throw error;
	}

	const userToken = createWebToken(response.username, response.email);
	reply.status(200).send({message : "Log In complete", token : userToken});
}
