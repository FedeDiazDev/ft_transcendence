import postSignup from './controllers/signup.js'
import postLogin from './controllers/login.js'
import postVerification from './controllers/verification.js'
import googleRegister from './controllers/googleRegister.js'
import refreshToken from './controllers/refreshToken.js'

const signupOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			username: { type: "string", minLength : 1, maxLength : 20,  pattern : "^[a-zA-Z0-9\\s.,@!#$%&*()\\-_=+]+$"},
			email: { type: "string" , format : "email"},
			password: { type: "string" , pattern : "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$"},
			confirmPassword: { type: "string" , pattern : "^(?=.*[A-Za-z])(?=.*\\d).{8,20}$"}
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
	fastify.post("/api/auth/refresh", refreshToken);
}
