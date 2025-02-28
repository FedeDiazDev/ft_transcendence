import getRoot from './controllers/getRoot.js'
import postSignup from './controllers/signup.js'

const signupOpts = {
	schema: { 
	  body: {
		type: "object",
		properties: {
		  username: { type: "string" },
		  email: { type: "string" },
		  password: { type: "string" },
		  confirmPassword: { type: "string" }
		},
		required: ["username", "email", "password", "confirmPassword"]
	  }
	}
  };
 
export default function routes(fastify) {
  fastify.get("/", getRoot);
  fastify.post("/signup", signupOpts, postSignup);
}

