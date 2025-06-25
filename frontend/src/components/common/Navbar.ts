import { navigateTo } from "../../router.js";

async function fetchLogout()
{
	await fetch("https://" + window.location.hostname + ":8080/api/auth/logout", {
	  method: "POST",
	  credentials: "include",
	});
}

export const Navbar = () => {
	const nav = document.createElement("nav");
	const token = localStorage.getItem("authToken");
	nav.id = "navbar";
	nav.className = "p-4 bg-gray-800 text-white flex justify-between items-center";
  
	const logo = document.createElement("a");
	logo.href = "/";
	logo.textContent = "🏓 Pong";
	logo.className = "text-2xl font-bold";
  
	const menu = document.createElement("div");
	menu.className = "flex space-x-4";
  
    const links = [
      { text: "Inicio", path: "/" },
      { text: "Perfil", path: "/profile" },
      { text: "Amigos", path: "/friends" },
      { text: "Estadísticas", path: "/stats" },
      { text: "Log", path: "/loghome" },
    ];
  
	links.forEach(({ text, path }) => {
	  const a = document.createElement("a");
	  if (token && text == "Log In")
		a.textContent = "Log Out";
	  else
		a.textContent = text;
	  a.href = path;
	  a.className = "px-3 py-2 rounded-lg hover:bg-gray-700 transition";
	  a.addEventListener("click", (e) => {
		e.preventDefault();
		if (token && text == "Log In"){
		  localStorage.removeItem("authToken");
		  localStorage.removeItem("username");
		  localStorage.removeItem("email");
		  fetchLogout();
		}
		navigateTo(path);
	  });
	  menu.appendChild(a);
	});
  
	nav.appendChild(logo);
	nav.appendChild(menu);
  
	return nav;
  };
