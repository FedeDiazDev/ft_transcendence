export function HelpCard(): HTMLElement {
	const card = document.createElement("div");
	card.id = "help-card";
	card.className = `
		fixed top-20 right-4 z-50 bg-black text-white border border-gray-700 
		rounded-2xl shadow-lg max-w-md w-full p-6 space-y-4 text-sm
	`;

	card.innerHTML = `
		<h1 class="text-2xl font-bold mb-2">Help</h1>

		<div>
			<h2 class="text-lg font-semibold mb-1">Game</h2>
			<ul class="list-disc list-inside space-y-1 text-gray-300">
			<li>
				<em>Play Game:</em> Play a local game against your friends!
				<ul class="pl-5 list-[square] space-y-1 mt-1">
				<li><span class="text-gray-400">Left Player:</span> W / S to move the paddle up and down</li>
				<li><span class="text-gray-400">Right Player:</span> ↑ / ↓ to move the paddle up and down</li>
				</ul>
			</li>
		
			<li>
				<em>Tournaments:</em> Join or create tournaments
				<ul class="pl-5 list-[square] space-y-1 mt-1">
				<li><span class="text-gray-400">Players:</span> W / S or ↑ / ↓ to move the paddle up and down</li>
				</ul>
			</li>

			<li>
				<em>Remote Game:</em> Play online against random people!
				<ul class="pl-5 list-[square] space-y-1 mt-1">
				<li><span class="text-gray-400">Players:</span> W / S or ↑ / ↓ to move the paddle up and down</li>
				</ul>
			</li>
			</ul>
		</div>	  

		<hr class="border-gray-700" />

		<div>
			<h2 class="text-lg font-semibold mb-1">Profile</h2>
			<p class="text-gray-300">Edit your avatar, about me and check your stats!</p>
		</div>

		<hr class="border-gray-700" />

		<div>
			<h2 class="text-lg font-semibold mb-1">Friends</h2>
			<p class="text-gray-300">Add new friends or check your friends' profiles</p>
		</div>

		<hr class="border-gray-700" />

		<div>
			<h2 class="text-lg font-semibold mb-1">Stats</h2>
			<p class="text-gray-300">Check everyone's ELO, wins and losses</p>
		</div>
	`;

	return card;
}

  