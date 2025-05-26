import postGame from "./components/postGame.js";
import { getUserStats, getFriendStats } from "./components/getUserStats.js";

export default function routes(fastify) {
    fastify.post("/api/stats/game", postGame);
    fastify.get("/api/stats/user", getUserStats);
    fastify.get("/api/stats/friend/:username", getFriendStats);
}

