import { OAuth2Client } from "google-auth-library";
import createWebToken from "./jwt.js";

const client = new OAuth2Client("169232875521-gqilrfir7hpghaadf7rlj8dmg94fmvp4.apps.googleusercontent.com");

export default async function googleRegister(request, reply) {

	const db = request.server.db;

	const verify = await client.verifyIdToken({
		idToken: request.body.credentials.credential,
		audience: "169232875521-gqilrfir7hpghaadf7rlj8dmg94fmvp4.apps.googleusercontent.com"
	});

	const payload = verify.getPayload();
	const email = payload.email;
	const name = payload.name;

	const checkUser = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");
	const existing = checkUser.get(name, email);

	const userToken = createWebToken(name, email);
	if (existing)
		reply.status(200).send({message : "Logged in", username : name, email : payload.email, token : userToken});
	else
	{
		const query = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)");
		query.run(name, email);
		reply.status(200).send({message : "Sign up", username : name, email : payload.email, token : userToken});
	}
}
