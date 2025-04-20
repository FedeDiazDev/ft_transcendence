import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function createWebToken(user, email){
	const payload = {
		"username" : user,
		"email" : email
	};
	const options = {
		expiresIn : "1h",
		algorithm : "HS256"
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET);//token is not expiring since 4th parameter "options" is not passed to jwt.sign 
	return token;
}
