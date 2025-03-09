import { GameState, Paddle } from "../../types/types.js";


export const GameCanvas = (state: GameState) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    canvas.className = "border border-gray-600";

    const ctx = canvas.getContext("2d");

    let gameState: GameState = { ...state };
    const draw = () => {
        console.log(gameState);
        if (!ctx) return;
        if (!gameState || !gameState.ball) {
            console.error("Error: gameState o ball no están definidos.");
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
        ctx.fill();

        Object.values(gameState.paddles).forEach((paddle: Paddle) => {
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        });
    };

    const loop = () => {
        draw();
        requestAnimationFrame(loop);
    };
    loop();

    (canvas as any).updateGameState = (newState: GameState) => {
        gameState = { ...newState };
    };

    return canvas;
};
