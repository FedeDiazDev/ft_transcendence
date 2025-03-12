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

function postRegister(){}

export default function routes(fastify) {
	fastify.post("/register", registerOpts, postRegister);
}

