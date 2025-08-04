import { GameCanvas } from "../components/game/Canvas.js";
import { createGame, startGame } from "../api/game/gameAPI.js";
import { GameState } from "../types/types.js";

export const Game = (mode: string) => {
    const container = document.createElement("div");
    container.className = "flex flex-col justify-center items-center bg-gradient-to-r from-[#0D1013] to-[#101115] mt-10 border-[#262626] p-6 rounded-md";
    const aux = document.createElement("div");
    aux.className = "flex flex-col justify-center items-center";
    let gameState: GameState = {
        roomId: "",
        status: "waiting",
        ball: { x: 0, y: 0 },
        paddles: {
            left: {
                player: "left",
                playerId: 1,
                x: 50,
                y: 200,
                width: 10,
                height: 50,
                speed: 5
            },
            right: {
                player: "right",
                playerId: 2,
                x: 440,
                y: 200,
                width: 10,
                height: 50,
                speed: 5
            }
        },
        points: 0,
        leftPoints: 0,
        rightPoints: 0
    };

    const score = document.createElement("p");
    score.id = "score";
    score.className = "text-2xl text-[#C4C4C4] m-2 p-2"
    if (mode == "local") {
        createGame(1, 2)
            .then(gameData => {
                if (!gameData?.gameState) {
                    //console.error("Error: gameState doesn't have the correct format", gameData);
                    return;
                }
                return startGame();
            })
            .then(gameData => {
                if (!gameData?.gameState) {
                    //console.error("Error: gameState doesn't have the correct format", gameData);
                    return;
                }
                gameState = gameData.gameState as GameState;

                if (mode === "local") {
                    const canvas = GameCanvas(gameState, "local", score, Date.now.toString());
                    aux.appendChild(score);
                    aux.appendChild(canvas);
                    const scoreElement = document.querySelector("#score");
                    if (scoreElement) {
                        scoreElement.innerHTML = `${gameState.leftPoints} - ${gameState.rightPoints}`;
                    }
                }
            })
            //.catch(err => console.error("Error creating the game", err));
            .catch(() => {});
    } else if (mode === "online") {
        const canvas = GameCanvas(gameState, "online", score, Date.now.toString());
        aux.appendChild(canvas);
    }
    container.appendChild(aux);
    return container;
};
