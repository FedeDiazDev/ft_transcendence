import cookie from "@fastify/cookie";

export default function logout(request, reply)
{
	reply.clearCookie('refreshToken', {
      	httpOnly: true,
      	secure: true,
		sameSite: 'none',
		path: '/',
      	maxAge: 0
	})
	.status(200)
	.send({ message: 'Logged out' });
}