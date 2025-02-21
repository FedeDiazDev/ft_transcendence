import { Home } from "./pages/home.js";
import { Friend } from "./pages/friends.js";
import { Profile } from "./pages/profile.js";
import { StatsView } from "./pages/stats.js";

const routes: Record<string, () => HTMLElement> = {
  "/": Home,
  "/profile": Profile,
  "/stats": StatsView,
  "/friends": Friend,
};

export const render = () => {
  const app = document.getElementById("app");
  if (app) {
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
