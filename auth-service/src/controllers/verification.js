import speakeasy from 'speakeasy';

export default function postVerification(request, reply)
{
	const otpCode = request.body.verification;
	const db = request.server.db;
	const name = request.body.username;

	const query = db.prepare("SELECT qrSecret FROM users WHERE username = ?");
	const secret = query.get(name);

	const verified = speakeasy.totp.verify({
		secret: secret.qrSecret,
		encoding : "base32",
		token : otpCode,
		window : 1
	});
	if (verified)
		reply.send({message : "Verified OTP Code"});
	else
		reply.status(401).send({message : "OTP Verification failed"});
}
