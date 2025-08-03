import { Home } from "./pages/home.js";
import { Friend } from "./pages/friends.js";
import { Profile, FriendProfile } from "./pages/profile.js";
import { LogHome } from "./pages/loghome.js";
import { Login } from "./pages/login.js";
import { Signup } from "./pages/signup.js";
import { Tournament } from "./pages/tournament.js"
import { CreateTournament } from "./pages/create_tournament.js"
import { Game } from "./pages/game.js"
import { Online } from "./pages/online.js"
import { fetchUserData } from "./hooks/fetchUserData.js";
import { statusSocket } from "./sockets/statusSocket.js";
import { QRCode } from "./pages/qrcode.js"
import { TwoFALogin } from "./pages/twofalogin.js"
import { JoinTournament } from "./pages/join_tournament.js"
import { Stats } from "./pages/stats.js"
import { Navbar } from "./components/common/Navbar.js";
import "./interceptFetch.js"
import { getUserByUsername } from "./api/profile/profileAPI.js";
import { gameSocketInstance } from "./sockets/gameSocket.js";
import { NotFound } from "./pages/not_found.js";
import fetchLogout from "./components/common/Navbar.js";

function removeNotAllowedKeys(allowedKeys: string[]) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && !allowedKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  }
}

export const cleanupLocalStorage = () => {
  const tempToken = localStorage.getItem("tempToken");
  const authToken = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  
  if (tempToken) {
    const allowedKeys = ["username", "email", "QRCode", "tempToken"];
    removeNotAllowedKeys(allowedKeys);
    return;
  }
  
  if (authToken) {
    const allowedKeys = ["username", "email", "authToken"];
    removeNotAllowedKeys(allowedKeys);
    return;
  }
  
  if (!authToken && !tempToken && (username || email) && window.location.pathname === "/twofalogin") {
    const allowedKeys = ["username", "email"];
    removeNotAllowedKeys(allowedKeys);
    return;
  }
  removeNotAllowedKeys([])
  fetchLogout();
};

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
  "/tournament": Tournament,
  "/tournament/create": CreateTournament,
  "/tournament/join": JoinTournament,
  "/tournament/waiting_room": Online,
  "/stats": Stats,
  "/": Home,
};

export const render = async () => {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = "";

  const existingNavbar = document.getElementById("navbar");
  if (existingNavbar) {
    existingNavbar.remove();
  }

  document.body.insertBefore(Navbar(), app);

  const path = window.location.pathname;
  const pathParts = path.split("/");

  const publicRoutes = ["/loghome", "/login", "/signup"];
  const twoFARoutes = ["/qrcode", "/twofalogin"];
  const username = localStorage.getItem("username");
  const token = authToken();

    if (token && publicRoutes.includes(path)) {
    window.history.pushState({}, "", "/");
    render();
    return;
  }

  if (token && twoFARoutes.includes(path)) {
    window.history.pushState({}, "", "/");
    render();
    return;
  }

  if (!publicRoutes.includes(path) && !twoFARoutes.includes(path) && !token) {
    cleanupLocalStorage();
    window.history.pushState({}, "", "/loghome");
    render();
    return;
  }

  if (twoFARoutes.includes(path)) {
    if ((!username && !localStorage.getItem("email")) || token) {
      cleanupLocalStorage();
      window.history.pushState({}, "", "/loghome");
      render();
      return;
    }
  }

  if (pathParts[1] === "profile" && pathParts.length === 3) {
    const identifier = pathParts[2];
    const div = document.createElement("div");

    if (/^\d+$/.test(identifier)) {
      const profileComponent = FriendProfile(identifier);
      div.appendChild(profileComponent);
    } else {
      try {
        const user = await getUserByUsername(identifier);
        const profileElement = FriendProfile(user.id);
        div.appendChild(profileElement);
      } catch (error) {
        app.appendChild(NotFound());
      }
    }

    app.appendChild(div);
    return;
  }

  const component = routes[path] || (() => {
    if (path !== '/') {
      return NotFound();
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
  cleanupLocalStorage();
  render();
  authToken();
});

export const authToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token || token === "") {
    cleanupLocalStorage();
    return false;
  } else {
    fetchUserData((user) => {
      if (typeof user === "object" && user.username) {
        statusSocket(user.id || null, user.username, "login");
      } else if (typeof user === "string") {
        statusSocket(null, user, "login");
      }
    });
    return true;
  }
}

export const navigateTo = (path: string) => {
  if (window.location.pathname === path) {
    return;
  }
  if (!path.endsWith("online_game")) {
    gameSocketInstance?.close();
  }
  window.history.pushState({}, "", path);
  render();
}
