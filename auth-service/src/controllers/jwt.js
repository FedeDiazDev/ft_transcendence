import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables en process.env

export default function createWebToken(user, email){
	const payload = {
		"username" : user,
		"email" : email
	};
	const options = {
		expiresIn : "1h",
		algorithm : "HS256"
	};
	const token = jwt.sign(payload, "production_password"); //QUITAR
	return token;
}
