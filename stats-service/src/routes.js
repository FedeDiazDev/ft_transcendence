import postGame from "./components/postGame.js";
import { getUserStats } from "./components/getUserStats.js";

export default function routes(fastify) {
    fastify.post("/api/stats/game", postGame);
    fastify.get("/api/stats/user", getUserStats);
}

