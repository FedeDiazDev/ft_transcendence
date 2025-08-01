export function NotFound(): HTMLElement {
	const div = document.createElement("div");
	div.className = "h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4";

	div.innerHTML = `
		<h1 class="text-[10rem] font-black text-black leading-none select-none">404</h1>
		<p class="text-gray-600 text-lg mb-6">Ups, someone messed up!</p>
	`;

	return div;
}
