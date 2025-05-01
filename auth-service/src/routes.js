import postSignup from './controllers/signup.js'
import postLogin from './controllers/login.js'
import postVerification from './controllers/verification.js'
import googleRegister from './controllers/googleRegister.js'

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

 const loginOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			user: { type: "string", minLength : 1},
			password: { type: "string", minLength : 1},
		},
		required: ["user", "password"],
	  }
	}
  };

export default function routes(fastify) {
	fastify.post("/api/auth/verify", postVerification);
	fastify.post("/api/auth/signup", signupOpts, postSignup);
	fastify.post("/api/auth/login", loginOpts, postLogin);
	fastify.post("/api/auth/google-register", googleRegister);
}
