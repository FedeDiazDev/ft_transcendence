import getRoot from './controllers/getRoot.js'
import postSignup from './controllers/signup.js'

export default function routes(fastify) {
  fastify.get("/", getRoot);
  fastify.post("/signup", postSignup);
}