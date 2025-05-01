import { Home } from "./pages/home.js";
import { Friend } from "./pages/friends.js";
import { Profile } from "./pages/profile.js";
import { LogHome } from "./pages/loghome.js";
import { Login } from "./pages/login.js";
import { Signup } from "./pages/signup.js";
import { StatsView } from "./pages/stats.js";
import { CreateTournament } from "./pages/create_tournament.js"
import { Game } from "./pages/game.js"
import { Online } from "./pages/online.js"
import { QRCode } from "./pages/qrcode.js"
import { TwoFALogin } from "./pages/twofalogin.js"

const routes: Record<string, () => HTMLElement> = {
  "/loghome": LogHome,
  "/login": Login,
  "/signup": Signup,
  "/qrcode" : QRCode,
  "/twofalogin" : TwoFALogin,
  "/profile": Profile,
  "/stats": StatsView,
  "/friends": Friend,
  "/local_game": () => Game("local"),
  "/online_game": Online,
  "/create_tournament": CreateTournament,
  "/tournament/waiting_room": Online,
  "/": Home,
};

export const render = () => {
  const app = document.getElementById("app");
  if (!app) return;  
  app.innerHTML = "";

  const path = window.location.pathname;
  const pathParts = path.split("/");
  //TODO: en un futuro hacer que StatsView reciba el id del usuario que queremos ver
  if (pathParts[1] === "stats" && pathParts.length === 3) {
    const id = pathParts[2];
    const div = document.createElement("div");
    div.innerHTML = `<h2>📊 Estadísticas del usuario ${id}</h2>`;
    div.appendChild(StatsView());
    app.appendChild(div);
    return;
  }
  //TODO: en un futuro hacer que Profile reciba el id del usuario que queremos ver
  if (pathParts[1] === "profile" && pathParts.length === 3) {
    app.innerHTML = "";
    const id = pathParts[2];
    const div = document.createElement("div");
    div.innerHTML = `<h2>📊 Perfil del usuario ${id}</h2>`;
    div.appendChild(Profile());
    app.appendChild(div);
    return;
  }
  const component = routes[path] || (() => {
    if (path !== '/') {
      const div = document.createElement("div");
      div.innerHTML = "<h2>404 - Página no encontrada</h2>";
      return div;
    }
    return Home;
  });  
  app.appendChild(component());
};

window.addEventListener("popstate", render);
document.addEventListener("DOMContentLoaded", render);

export const authToken = () =>{
	const token = localStorage.getItem("authToken");
	if (!token || token === ""){
		return false;
	}
	else
		return true;
}

export const navigateTo = (path: string) => {

	const publicRoutes = ["/loghome", "/login", "/signup"];
	const twoFARoutes = ["/qrcode", "/twofalogin"];

	const username = localStorage.getItem("username");
	const token = authToken(); 

	if (publicRoutes.includes(path)) {
		window.history.pushState({}, "", path);
		render();
		return;
	}

	if (twoFARoutes.includes(path)) {
		if (username && !token) {
			window.history.pushState({}, "", path);
			render();
			return;
		} else {
			window.history.pushState({}, "", "/loghome");
			render();
			return;
		}
	}

	if (token) {
		window.history.pushState({}, "", path);
		render();
	} else {
		console.log("entra");
		window.history.pushState({}, "", "/loghome");
		render();
	}
};
