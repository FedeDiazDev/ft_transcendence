import { Navbar } from "./components/common/Navbar.js";
import { navigateTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
	const app = document.getElementById("app");

	window.addEventListener("popstate", () => {
		navigateTo(window.location.pathname);
	});

	navigateTo(window.location.pathname);
	//TODO: cuando se pueda aplicar la lógica del login, se mostrará solo una vez logeado
	document.body.insertBefore(Navbar(), app);
});
