import postRegister from "./components/register.js"
import { postProfile, getUser } from './components/profile.js'
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

const profileOpts = {
	schema: {
	  body: {
		type: "object",
		properties: {
			user: { type: "string", minLength : 1},
		},
		required: ["user"],
	  }
	}
  };

export default function routes(fastify) {
	fastify.post("/api/users/register", registerOpts, postRegister);
	fastify.post("/api/users/profile", profileOpts, postProfile);
	fastify.get("/api/users/getUser", getUser);
	fastify.get("/api/users/getFriends", getFriends);
	fastify.get("/api/users/searchUsers/:text", searchUsersByName);
	fastify.post("/api/users/addFriend", addFriend);
	fastify.delete("/api/users/deleteFriend/:friendId", deleteFiend);
}
