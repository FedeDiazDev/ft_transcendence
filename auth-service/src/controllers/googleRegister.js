import { OAuth2Client } from "google-auth-library";
import createWebToken from "./jwt.js";
import publishUserRegisteredEvent from "./publishQueue.js"

const client = new OAuth2Client("169232875521-gqilrfir7hpghaadf7rlj8dmg94fmvp4.apps.googleusercontent.com");

function generateUniqueUsername(baseName, db) {
	let username = baseName;
	let suffix = 1;

	const checkUser = db.prepare("SELECT 1 FROM users WHERE username = ?");
	while (checkUser.get(username)) {
		username = `${baseName}${suffix}`;
		suffix++;
	}

	return username;
}

export default async function googleRegister(request, reply) {

	const db = request.server.db;

	const verify = await client.verifyIdToken({
		idToken: request.body.credentials.credential,
		audience: "169232875521-gqilrfir7hpghaadf7rlj8dmg94fmvp4.apps.googleusercontent.com"
	});

	const payload = verify.getPayload();
	const email = payload.email;
	const name = payload.name;

	const checkUser = db.prepare("SELECT * FROM users WHERE email = ?");
	const existing = checkUser.get(email);

	let userToken;

	if (existing){
		userToken = createWebToken(existing.username, existing.email);
		reply.status(200).send({message : "Logged in", username : existing.username, email : existing.email, token : userToken});
	}
	else
	{
		const uniqueUsername = generateUniqueUsername(name, db);

		userToken = createWebToken(uniqueUsername, email);

		const query = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)");
		query.run(uniqueUsername, email);
		publishUserRegisteredEvent(uniqueUsername);
		reply.status(200).send({message : "Sign up", username : uniqueUsername, email : payload.email, token : userToken});
	}
}
