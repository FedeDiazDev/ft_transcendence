import postRegister from "./components/register.js"
import postProfile from './components/profile.js'

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

const profileOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			user: { type: "string", minLength : 1},
		},
		required: ["user"],
	  }
	}
  };

export default function routes(fastify) {
	fastify.post("/register", registerOpts, postRegister);
	fastify.post("/profile", profileOpts, postProfile);
}
