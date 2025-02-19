import { Navbar } from "./components/Navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  document.body.insertBefore(Navbar(), app);
});
