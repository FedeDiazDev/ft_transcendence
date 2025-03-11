import { GameState, Paddle } from "../../types/types.js";
import { movePaddle } from "../../api/game/paddleAPI.js";
import { useKeyPress } from "../../hooks/useKeyPress.js";

export const GameCanvas = (state: GameState) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    canvas.className = "border border-gray-600";

    const ctx = canvas.getContext("2d");

    let gameState: GameState = { ...state };

    const draw = () => {
        if (!ctx) return;
        if (!gameState) {
            console.log("No gameState");
            return;
        }
        console.log(gameState);
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

    const updatePaddlePosition = (player: "left" | "right", direction: "up" | "down") => {
        const paddle = gameState.paddles[player];
        if (!paddle) return;

        const speed = paddle.speed ?? 10;
        const newY = direction === "up" ? paddle.y - speed : paddle.y + speed;
        
        gameState = {
            ...gameState,
            paddles: {
                ...gameState.paddles,
                [player]: { ...paddle, y: newY }
            }
        };
    };

    const moveAndUpdate = async (player: "left" | "right", direction: "up" | "down") => {
        updatePaddlePosition(player, direction);
        await movePaddle(player, direction);
    };

    const cleanup = useKeyPress({
        "ArrowUp": () => moveAndUpdate("right", "up"),
        "ArrowDown": () => moveAndUpdate("right", "down"),
        "w": () => moveAndUpdate("left", "up"),
        "s": () => moveAndUpdate("left", "down"),
    });

    window.addEventListener("beforeunload", cleanup);

    return canvas;
};
