import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function createWebTokenNoRefresh(user, email){
	const payload = {
		"username" : user,
		"email" : email
	};
	const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m", algorithm: "HS256"});
	return {accessToken};
}
