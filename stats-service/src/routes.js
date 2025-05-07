import postGame from "./components/postGame.js";

export default function routes(fastify) {
    fastify.post("/api/stats/game", postGame);
}

