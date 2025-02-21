import { Home } from "./pages/home.js";
import { Friend } from "./pages/friends.js";
import { Profile } from "./pages/profile.js"
import { StatsView } from "./pages/stats.js";
const routes: Record<string, () => HTMLElement> = {
  "/": Home,
  "/profile": Profile,
  "/stats": StatsView,  
  "/friends": Friend
  
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
