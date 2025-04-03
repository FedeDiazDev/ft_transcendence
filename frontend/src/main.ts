import { Navbar } from "./components/common/Navbar.js";
import { LogHome } from "./pages/loghome.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  //TODO: ver en futuro como verificar esto  
  const userIsLoggedIn = true;

  if (!userIsLoggedIn) {
    app?.appendChild(LogHome());
  }
  //TODO: cuando se pueda aplicar la lógica del login, se mostrará solo una vez logeado
  document.body.insertBefore(Navbar(), app);
});