export function calculateElo(winnerElo, loserElo) {
	const K = 32;
	const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
	const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

	return {
		winnerNewElo: Math.round(winnerElo + K * (1 - expectedWinner)),
		loserNewElo: Math.round(loserElo + K * (0 - expectedLoser)),
	};
}