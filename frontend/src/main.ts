import { navigateTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
	window.addEventListener("popstate", () => {
		navigateTo(window.location.pathname);
	});

	navigateTo(window.location.pathname);
});
