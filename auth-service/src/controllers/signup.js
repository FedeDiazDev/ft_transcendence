import crypto from "crypto";
import createQR from "./createQR.js";
import publishUserRegisteredEvent from "./publishQueue.js"

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

	console.log("esta entrando!!")

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

	const query = db.prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)");
	query.run(request.body.username, request.body.email, passStruct.hash, passStruct.salt);

	const data = await createQR();

	const queryQr = db.prepare("UPDATE users SET qrSecret = ? WHERE username = ?");
	queryQr.run(data.sr.base32, request.body.username);

	publishUserRegisteredEvent(request.body.username);
	reply.send({ message: "Generate QR", QR: data.qr});
}
