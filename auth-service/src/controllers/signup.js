import crypto from "crypto";
import createQR from "./createQR.js";

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

	console.log("Hashed Password");

	return{
		salt: salt,
		hash: hash
	}
}

export default async function postSignup(request, reply){

	confirmPassword(request.body.password, request.body.confirmPassword);
	const passStruct = hashPassword(request.body.password);
	const db = request.server.db;

	const query = db.prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)");
	query.run(request.body.username, request.body.email, passStruct.hash, passStruct.salt);

	const data = await createQR();

	const queryQr = db.prepare("UPDATE users SET qrSecret = ? WHERE username = ?");
	queryQr.run(data.sr.base32, request.body.username);

	reply.send({ message: "Generate QR", QR: data.qr});
}
