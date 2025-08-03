import { saveGameAndUpdateElo, storeAlias } from "./components/postGame.js";
import { getUserStats, getFriendStats } from "./components/getUserStats.js";
import { getAllPlayersData } from "./components/getAllPlayersData.js";
import { getAllGamesData } from "./components/getAllGamesData.js";

export default function routes(fastify) {
    fastify.post("/api/stats/game", saveGameAndUpdateElo);
    fastify.get("/api/stats/user", getUserStats);
    fastify.get("/api/stats/friend/:username", getFriendStats);
    fastify.post("/api/stats/alias", storeAlias)
    fastify.get("/api/stats/players", getAllPlayersData);
    fastify.get("/api/stats/games", getAllGamesData); 
}

