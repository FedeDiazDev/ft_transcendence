import { getUser, updateProfileText, updateAvatar } from './components/profile.js'
import { addFriend, deleteFiend, getFriends, searchUsersByName } from "./components/friends.js";

const registerOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			username: { type: "string", minLength : 1, pattern : "^[a-zA-Z0-9]+$"}
	  },
		required: ["username"]
	}
  }
}

export default function routes(fastify) {
	fastify.get("/api/users/getUser", getUser);
	fastify.post("/api/users/updateProfileText", updateProfileText);
	fastify.post('/api/users/updateAvatar', updateAvatar);
	fastify.get("/api/users/getFriends", getFriends);
	fastify.get("/api/users/searchUsers/:text", searchUsersByName);
	fastify.post("/api/users/addFriend", addFriend);
	fastify.delete("/api/users/deleteFriend/:friendId", deleteFiend);
}
