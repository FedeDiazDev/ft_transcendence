import speakeasy from 'speakeasy';
import createWebToken from "./jwt.js";

export default function postVerification(request, reply)
{
	const otpCode = request.body.verification;
	const name = request.body.username;

	const db = request.server.db;

	const query = db.prepare("SELECT qrSecret FROM users WHERE username = ?");
	const secret = query.get(name);

	const verified = speakeasy.totp.verify({
		secret: secret.qrSecret,
		encoding : "base32",
		token : otpCode,
		window : 1
	});
	if (verified)
	{
		const userToken = createWebToken(request.body.username, request.body.email);
		reply.send({message : "Verified OTP Code", token : userToken});
	}
	else
		reply.status(401).send({message : "OTP Verification failed"});
}
