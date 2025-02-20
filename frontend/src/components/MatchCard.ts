export const MatchCard = (local: string, local_score : number, visitor : string, visitor_score : number, date : string) => {
	const container = document.createElement("div");
	container.className = "rounded-lg text-center"
	const log = document.createElement("div");
	log.className = "rounded border border-sm";
	log.innerHTML = `<p>${local} : ${local_score} - ${visitor_score} : ${visitor} - ${date}</p>`;
	container.appendChild(log);
	return container;
}