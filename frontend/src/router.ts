import { Home } from "./pages/home.js";
import { Game } from "./pages/game.js";
import { Profile } from "./pages/profile.js"

const routes: Record<string, () => HTMLElement> = {
  "/": Home,
  "/profile": Profile,
  "/friends": () => {
    const div = document.createElement("div");
    div.innerHTML = "<h2>🫂 Lista de amigos</h2>";
    return div;
  },
  "/stats": () => {
    const div = document.createElement("div");
    div.innerHTML = "<h2>📊 Estadísticas</h2>";
    return div;
  },
};

export const render = () => {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = "";
    const component = routes[window.location.pathname] || (() => {
      const div = document.createElement("div");
      div.innerHTML = "<h2>404 - Página no encontrada</h2>";
      return div;
    });
    app.appendChild(component());
  }
};

window.addEventListener("popstate", render);

export const navigateTo = (path: string) => {
  window.history.pushState({}, "", path);
  render();
};
