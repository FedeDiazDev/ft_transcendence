export const CardGame = (text, styles) => {
    const div = document.createElement("div");
    div.className = `flex items-center justify-center w-64 h-40 rounded-lg shadow-lg ${styles}`;
    div.innerHTML = `<p class='text-center font-semibold text-lg'>${text}</p>`;
    return div;
};
