import speakeasy from 'speakeasy';
import createWebToken from "./jwt.js";
import { pendingUsers } from "./PendingUsers.js";
import publishUserRegisteredEvent from "./publishQueue.js"

export default function postVerification(request, reply)
{
	const otpCode = request.body.verification;
	const tempToken = request.body.tempToken;

	const userData = pendingUsers.get(tempToken);
	if (!tempToken || !userData) {
		reply.status(400).send({ message: "Invalid or expired temporary token" });
		return;
	}

	const secret = userData.qrSecret;
	if (!secret) {
		reply.status(400).send({ message: "QR secret not found" });
		return;
	}

	const verified = speakeasy.totp.verify({
		secret: userData.qrSecret,
		encoding : "base32",
		token : otpCode,
		window : 1
	});
	if (verified)
	{
		const db = request.server.db;
		const query = db.prepare("INSERT INTO users (username, email, password, salt, qrSecret) VALUES (?, ?, ?, ?, ?)");
  
        const checkUser = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        const existing = checkUser.get(userData.username, userData.email);
        
        if (existing) {
            pendingUsers.remove(tempToken);
            return reply.status(409).send({
                message: "Username or email was taken while you were verifying"
            });
        }
		query.run(userData.username, userData.email, userData.hashedPassword, userData.salt, userData.qrSecret);
		publishUserRegisteredEvent(userData.username);

		const userToken = createWebToken(userData.username, userData.email);

		pendingUsers.remove(tempToken);
		reply.setCookie("refreshToken", userToken.refreshToken, {
      		httpOnly: true,
      		secure: true,
      		sameSite: "none",
      		path: "/",
			maxAge: 60 * 60 * 24 * 2
		}).status(200).send({message : "Verified OTP Code", token : userToken.accessToken});
	}
	else
		reply.status(401).send({message : "OTP Verification failed"});
}
