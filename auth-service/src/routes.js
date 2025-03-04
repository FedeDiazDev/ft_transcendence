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

  fastify.options('/signup', (req, reply) => {
	reply
		.headers({
		'Access-Control-Allow-Origin': '*', // Replace with your frontend origin
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		})
		.send(); // No body needed for OPTIONS request, just set the headers
  });
  fastify.post("/signup", signupOpts, postSignup);
}

