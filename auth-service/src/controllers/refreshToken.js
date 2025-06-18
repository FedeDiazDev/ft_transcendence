import createWebTokenNoRefresh from "./jwtNoRefresh.js";
import jwt from "jsonwebtoken";

export default async function refreshToken(request, reply) {
	const refreshToken = request.cookies?.refreshToken;

	if (!refreshToken) {
		return reply.code(401).send({ error: 'No refresh token provided' });
	}

	let payload;
	try {
		payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
	} catch (err) {
		return reply.code(401).send({ error: 'Invalid or expired refresh token' });
	}

	const accessToken = createWebTokenNoRefresh(payload.username, payload.email);
	return reply.status(200).send(accessToken);
}