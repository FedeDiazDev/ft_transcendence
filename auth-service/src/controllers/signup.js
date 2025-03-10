import crypto from "crypto";

//SALT: Random values than interacts with the hasing aside of regular string that comes
//HASH: Math iterations to transform the password

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

export default function postSignup(request, reply){

		confirmPassword(request.body.password, request.body.confirmPassword);
		const passStruct = hashPassword(request.body.password);
		const db = request.server.db;

		const query = db.prepare("INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)");
		query.run(request.body.username, request.body.email, passStruct.hash, passStruct.salt);
		reply.status(200).send({message : "Registration complete"});
//	}
}
