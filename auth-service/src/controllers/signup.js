import crypto from "crypto";
import createQR from "./createQR.js";
import { pendingUsers } from "./PendingUsers.js";

function confirmPassword(password, confirmPassword){	
	if (password != confirmPassword){
		const error = new Error("Passwords do not match");
		error.statusCode = 400;
		throw error;
	}
}

function hashPassword(password){
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

	return{
		salt: salt,
		hash: hash
	}
}

export default async function postSignup(request, reply){

	const db = request.server.db;

	const checkUser = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");
	const existing = checkUser.get(request.body.username, request.body.email);

	if (existing) {
		const error = new Error("Username or email already in use");
		error.statusCode = 409;
		throw error;
	}

	confirmPassword(request.body.password, request.body.confirmPassword);
	const passStruct = hashPassword(request.body.password);

	const data = await createQR();

	const userData = {
		username: request.body.username,
		email: request.body.email,
		hashedPassword: passStruct.hash,
		salt: passStruct.salt,
		qrSecret: data.sr.base32
	};
	const tempToken = pendingUsers.add(userData);

	reply.send({ message: "Generate QR", QR: data.qr, tempToken: tempToken});
}
