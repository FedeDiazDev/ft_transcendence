import { Navbar } from "./components/Navbar.js";
import { Home } from "./pages/home.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app?.appendChild(Home());
  document.body.insertBefore(Navbar(), app);
});