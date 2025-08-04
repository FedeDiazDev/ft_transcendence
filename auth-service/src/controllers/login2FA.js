import speakeasy from 'speakeasy';
import createWebToken from "./jwt.js";

export default function login2FA(request, reply) {
    const { verification, username, email } = request.body;

    if (!verification || (!username && !email)) {
        reply.status(400).send({ message: "Missing verification code, username or email" });
        return;
    }

    const db = request.server.db;
    
    const getUserQuery = db.prepare("SELECT * FROM users WHERE username = ? AND email = ?");
    const user = getUserQuery.get(username, email);
    
    if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
    }

    if (!user.qrSecret) {
        reply.status(400).send({ message: "2FA not configured for this user" });
        return;
    }

    const verified = speakeasy.totp.verify({
        secret: user.qrSecret,
        encoding: "base32",
        token: verification,
        window: 1
    });

    if (verified) {
        const userToken = createWebToken(user.username, user.email);
        
        reply.setCookie("refreshToken", userToken.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 2 
        }).status(200).send({
            message: "Verified OTP Code", 
            token: userToken.accessToken
        });
    } else {
        reply.status(401).send({ message: "OTP Verification failed" });
    }
}