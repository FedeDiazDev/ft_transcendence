import Fastify from 'fastify'
import routes from "./routes/router.js"
const fastify = Fastify({
	logger: true
})
const opt = {
	port: 4444,
	host: "0.0.0.0"
}

fastify.register(routes);

fastify.listen(opt, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Servidor corriendo en ${address}`);
});
