export async function createGame(request, reply)
{
	reply.send({ message: "Juego creado"})
}

export async function movePaddle(request, reply)
{
	const { direction } = request.body;

	if (!direction){
		return reply.status(400).send({ error: "Falta la dirección" });
	}
	
	reply.send({ message: "Mover pala"})
}