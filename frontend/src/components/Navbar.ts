import { render } from "../router.js";

export const Navbar = () => {
    const nav = document.createElement("nav");
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
    ];
  
    links.forEach(({ text, path }) => {
      const a = document.createElement("a");
      a.textContent = text;
      a.href = path;
      a.className = "px-3 py-2 rounded hover:bg-gray-700 transition";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.history.pushState({}, "", path);
        render();
      });
      menu.appendChild(a);
    });
  
    nav.appendChild(logo);
    nav.appendChild(menu);
  
    return nav;
  };
  