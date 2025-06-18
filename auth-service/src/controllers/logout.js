export default function logout(request, reply)
{
	reply.clearCookie('refreshToken', {
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true
	})
	.status(200)
	.send({ message: 'Logged out' });
}