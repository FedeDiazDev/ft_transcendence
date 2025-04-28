import { Home } from "./pages/home.js";
import { Friend } from "./pages/friends.js";
import { Profile } from "./pages/profile.js";
import { LogHome } from "./pages/loghome.js";
import { Login } from "./pages/login.js";
import { Signup } from "./pages/signup.js";
import { CreateTournament } from "./pages/create_tournament.js"
import { Game } from "./pages/game.js"
import { Online } from "./pages/online.js"
import { fetchUserData } from "./hooks/fetchUserData.js";
import { statusSocket } from "./sockets/statusSocket.js";
import { QRCode } from "./pages/qrcode.js"
import { TwoFALogin } from "./pages/twofalogin.js"

const routes: Record<string, () => HTMLElement | Promise<HTMLElement>> = {
  "/loghome": LogHome,
  "/login": Login,
  "/signup": Signup,
  "/qrcode": QRCode,
  "/twofalogin": TwoFALogin,
  "/profile": Profile,
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
    return Home();
  });

  const result = component();
  if (result instanceof Promise) {
    result.then(resolvedComponent => {
      app.appendChild(resolvedComponent);
    });
  } else {
    app.appendChild(result);
  }
};

window.addEventListener("popstate", render);
document.addEventListener("DOMContentLoaded", () => {
  render();
  //authToken();
});

let hasLoggedIn = false;

export const authToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token || token === "") {
    return false;
  } else {
    if (!hasLoggedIn) {
      fetchUserData((user) => {
        statusSocket(user.id, user.username, "login");
      });
      hasLoggedIn = true;
    }
    return true;
  }
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
    if (path !== "/") {
      alert("Sign up or log in please");
    }
    window.history.pushState({}, "", "/loghome");
    render();
  }
};
