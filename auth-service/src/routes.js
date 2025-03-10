import getRoot from './controllers/getRoot.js'
import postSignup from './controllers/signup.js'

const signupOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			username: { type: "string", minLength : 1, pattern : "^[a-zA-Z0-9]+$"},
			email: { type: "string" , format : "email"},
			password: { type: "string" , minLength : 8, pattern : "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d ]{8,}$"},
			confirmPassword: { type: "string" , minLength : 8, pattern : "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d ]{8,}$"}
		},
		required: ["username", "email", "password", "confirmPassword"],
	  }
	}
  };
 
export default function routes(fastify) {
  fastify.post("/signup", signupOpts, postSignup);
}

