import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export default function createWebToken(user, email){
	const payload = {
		"username" : user,
		"email" : email
	};
	const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h", algorithm: "HS256"});
	const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "2d", algorithm: "HS256"});

	return {accessToken, refreshToken};
}
