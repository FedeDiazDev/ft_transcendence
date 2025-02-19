import { render } from "../router.js";

export const Card = (icon: string, text: string, path: string) => {
    const card = document.createElement("button");
    card.className = "card w-64 h-80 bg-gray-800 text-white p-6 rounded-lg shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-105";
    
    card.innerHTML = `
      <div class='flex flex-col items-center justify-center h-full'>
        <div class='text-4xl'>${icon}</div>
        <p class='text-lg font-semibold mt-2'>${text}</p>
      </div>
    `;
  
    card.addEventListener("click", () => {
      window.history.pushState({}, "", path);
      render();
    });
  
    return card;
  };
  