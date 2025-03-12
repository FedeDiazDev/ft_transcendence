import postRegister from "./components/register.js"

const registerOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			username: { type: "string", minLength : 1, pattern : "^[a-zA-Z0-9]+$"}
	  },
		required: ["username"]
	}
  }
}

export default function routes(fastify) {
	fastify.post("/register", registerOpts, postRegister);
}
